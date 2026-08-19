"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Ruler,
  Weight,
  Target,
  Activity,
  User,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface OnboardingData {
  gender: string;
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  activityLevel: string;
  goal: string;
}

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise", icon: "🪑" },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week", icon: "🚶" },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week", icon: "🏃" },
  { value: "very_active", label: "Very Active", desc: "6-7 days/week", icon: "💪" },
  { value: "extra_active", label: "Extra Active", desc: "Athlete level", icon: "🔥" },
];

function calculateProjection(data: OnboardingData) {
  const weight = parseFloat(data.weightKg);
  const target = parseFloat(data.targetWeightKg);
  const heightCm = parseFloat(data.heightCm);
  const age = parseInt(data.age);
  const isMale = data.gender === "male";

  // BMR using Mifflin-St Jeor
  const bmr = isMale
    ? 10 * weight + 6.25 * heightCm - 5 * age + 5
    : 10 * weight + 6.25 * heightCm - 5 * age - 161;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const tdee = bmr * (activityMultipliers[data.activityLevel] || 1.55);

  // Safe rate: ~0.5 kg/week for loss, ~0.3 kg/week for gain
  const isLosing = target < weight;
  const weeklyRate = isLosing ? 0.5 : target > weight ? 0.3 : 0;
  const totalChange = Math.abs(target - weight);
  const weeksNeeded = weeklyRate > 0 ? Math.ceil(totalChange / weeklyRate) : 0;

  // Daily calorie target
  const dailyDeficit = isLosing ? 500 : target > weight ? 300 : 0;
  const dailyCalories = Math.round(
    isLosing ? tdee - dailyDeficit : tdee + dailyDeficit
  );

  // Macro split
  const proteinG = Math.round(weight * 1.8);
  const fatG = Math.round((dailyCalories * 0.25) / 9);
  const carbsG = Math.round(
    (dailyCalories - proteinG * 4 - fatG * 9) / 4
  );

  // Generate projection data points (weekly)
  const projectionData = [];
  const maxWeeks = Math.min(weeksNeeded || 12, 52);
  const now = new Date();

  for (let w = 0; w <= maxWeeks; w++) {
    const date = new Date(now);
    date.setDate(date.getDate() + w * 7);
    const projected = isLosing
      ? Math.max(target, weight - w * weeklyRate)
      : Math.min(target, weight + w * weeklyRate);

    projectionData.push({
      week: w,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: Math.round(projected * 10) / 10,
    });
  }

  return {
    tdee: Math.round(tdee),
    dailyCalories,
    proteinG,
    carbsG,
    fatG,
    weeksNeeded: maxWeeks,
    projectionData,
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    gender: "",
    age: "",
    heightCm: "",
    weightKg: "",
    targetWeightKg: "",
    activityLevel: "",
    goal: "",
  });

  const totalSteps = 4;

  const updateField = (field: keyof OnboardingData, value: string) => {
    setData((prev) => {
      const newData = { ...prev, [field]: value };
      // Auto-infer goal
      if (field === "targetWeightKg" || field === "weightKg") {
        const w = parseFloat(field === "weightKg" ? value : newData.weightKg);
        const t = parseFloat(
          field === "targetWeightKg" ? value : newData.targetWeightKg
        );
        if (w && t) {
          if (t < w) newData.goal = "lose";
          else if (t > w) newData.goal = "gain";
          else newData.goal = "maintain";
        }
      }
      return newData;
    });
  };

  const canProceed = (() => {
    switch (step) {
      case 0:
        return data.gender && data.age;
      case 1:
        return data.heightCm && data.weightKg;
      case 2:
        return data.targetWeightKg && data.activityLevel;
      case 3:
        return true; // Projection review step
      default:
        return false;
    }
  })();

  const projection = useMemo(() => {
    if (
      data.weightKg &&
      data.targetWeightKg &&
      data.heightCm &&
      data.age &&
      data.gender &&
      data.activityLevel
    ) {
      return calculateProjection(data);
    }
    return null;
  }, [data]);

  const handleComplete = async () => {
    setSaving(true);
    try {
      // Save onboarding data to user profile
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: data.gender,
          age: parseInt(data.age),
          heightCm: parseFloat(data.heightCm),
          weightKg: parseFloat(data.weightKg),
          targetWeightKg: parseFloat(data.targetWeightKg),
          activityLevel: data.activityLevel,
          goal: data.goal,
          onboardingDone: true,
        }),
      });

      // If we have projection data, also save diet targets
      if (projection) {
        await fetch("/api/diet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            calories: projection.dailyCalories,
            proteinG: projection.proteinG,
            carbsG: projection.carbsG,
            fatG: projection.fatG,
          }),
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setSaving(false);
    }
  };

  const GoalIcon =
    data.goal === "lose"
      ? TrendingDown
      : data.goal === "gain"
      ? TrendingUp
      : Minus;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-sky-500/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 fade-in-up">
          <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-accent/20">
            <Dumbbell size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">
              Set Up Your Profile
            </h1>
            <p className="text-xs text-muted">
              Step {step + 1} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-card rounded-full mb-8 overflow-hidden">
          <div
            className="h-full accent-gradient rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="glass-card p-6 sm:p-8 fade-in-up" key={step}>
          {/* Step 0: Gender & Age */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">
                  About You
                </h2>
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-3 block">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateField("gender", g)}
                      className={`py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        data.gender === g
                          ? "bg-accent-dim text-accent border border-accent/30 shadow-md shadow-accent/10"
                          : "bg-card border border-border text-muted hover:text-foreground hover:bg-card-hover"
                      }`}
                    >
                      {g === "male" ? "♂ Male" : "♀ Female"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="onboard-age"
                  className="text-sm font-medium text-muted mb-2 block"
                >
                  Age
                </label>
                <input
                  id="onboard-age"
                  type="number"
                  min="14"
                  max="100"
                  value={data.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="25"
                  className="auth-input"
                />
              </div>
            </div>
          )}

          {/* Step 1: Height & Current Weight */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Ruler size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">
                  Your Measurements
                </h2>
              </div>

              <div>
                <label
                  htmlFor="onboard-height"
                  className="text-sm font-medium text-muted mb-2 block"
                >
                  Height (cm)
                </label>
                <input
                  id="onboard-height"
                  type="number"
                  min="100"
                  max="250"
                  value={data.heightCm}
                  onChange={(e) => updateField("heightCm", e.target.value)}
                  placeholder="175"
                  className="auth-input"
                />
              </div>

              <div>
                <label
                  htmlFor="onboard-weight"
                  className="text-sm font-medium text-muted mb-2 block"
                >
                  Current Weight (kg)
                </label>
                <div className="relative">
                  <Weight
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="onboard-weight"
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={data.weightKg}
                    onChange={(e) => updateField("weightKg", e.target.value)}
                    placeholder="75.0"
                    className="auth-input pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target & Activity */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">
                  Your Goal
                </h2>
              </div>

              <div>
                <label
                  htmlFor="onboard-target"
                  className="text-sm font-medium text-muted mb-2 block"
                >
                  Target Weight (kg)
                </label>
                <div className="relative">
                  <Target
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="onboard-target"
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={data.targetWeightKg}
                    onChange={(e) =>
                      updateField("targetWeightKg", e.target.value)
                    }
                    placeholder="70.0"
                    className="auth-input pl-10"
                  />
                </div>
                {data.goal && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-accent">
                    <GoalIcon size={14} />
                    Goal:{" "}
                    {data.goal === "lose"
                      ? "Weight Loss"
                      : data.goal === "gain"
                      ? "Weight Gain"
                      : "Maintain Weight"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-3 block">
                  <Activity size={14} className="inline mr-1.5 -mt-0.5" />
                  Activity Level
                </label>
                <div className="space-y-2">
                  {activityLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() =>
                        updateField("activityLevel", level.value)
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                        data.activityLevel === level.value
                          ? "bg-accent-dim border border-accent/30 shadow-md shadow-accent/10"
                          : "bg-card border border-border hover:bg-card-hover"
                      }`}
                    >
                      <span className="text-lg">{level.icon}</span>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold ${
                            data.activityLevel === level.value
                              ? "text-accent"
                              : "text-foreground"
                          }`}
                        >
                          {level.label}
                        </div>
                        <div className="text-xs text-muted">{level.desc}</div>
                      </div>
                      {data.activityLevel === level.value && (
                        <CheckCircle2 size={18} className="text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Projection & Review */}
          {step === 3 && projection && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">
                  Your Projection
                </h2>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-xl p-3 border border-border">
                  <div className="text-xs text-muted mb-1">Daily Calories</div>
                  <div className="text-xl font-extrabold accent-text">
                    {projection.dailyCalories}
                  </div>
                  <div className="text-xs text-muted">kcal/day</div>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border">
                  <div className="text-xs text-muted mb-1">Timeline</div>
                  <div className="text-xl font-extrabold accent-text">
                    {projection.weeksNeeded}
                  </div>
                  <div className="text-xs text-muted">weeks</div>
                </div>
              </div>

              {/* Macro Split */}
              <div className="flex justify-between bg-card rounded-xl p-3 border border-border">
                <div className="text-center flex-1">
                  <div className="text-sm font-bold text-green-400">
                    {projection.proteinG}g
                  </div>
                  <div className="text-[10px] text-muted">Protein</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center flex-1">
                  <div className="text-sm font-bold text-sky-400">
                    {projection.carbsG}g
                  </div>
                  <div className="text-[10px] text-muted">Carbs</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center flex-1">
                  <div className="text-sm font-bold text-orange-400">
                    {projection.fatG}g
                  </div>
                  <div className="text-[10px] text-muted">Fat</div>
                </div>
              </div>

              {/* Projection Chart */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="text-xs text-muted mb-3 font-medium">
                  Weight Projection
                </div>
                <div className="h-48 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projection.projectionData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        interval="preserveStartEnd"
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                      />
                      <YAxis
                        domain={["dataMin - 2", "dataMax + 2"]}
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        width={35}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(13,17,23,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                          color: "#e8ecf1",
                        }}
                        formatter={(value: any) => [
                          `${value} kg`,
                          "Weight",
                        ]}
                      />
                      <ReferenceLine
                        y={parseFloat(data.targetWeightKg)}
                        stroke="#a3e635"
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                        label={{
                          value: "Goal",
                          position: "right",
                          fill: "#a3e635",
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="url(#projectionGradient)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: "#a3e635",
                          stroke: "#0b0f14",
                          strokeWidth: 2,
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="projectionGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#a3e635" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-xs text-muted text-center leading-relaxed">
                This is a science-based estimate using the Mifflin-St Jeor
                equation. Actual results may vary based on adherence and
                individual factors.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-foreground bg-card border border-border hover:bg-card-hover transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={step < totalSteps - 1 ? () => setStep((s) => s + 1) : handleComplete}
            disabled={!canProceed || saving}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold accent-gradient text-black hover:opacity-90 shadow-lg shadow-accent/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : step < totalSteps - 1 ? (
              <>
                Continue
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Start My Journey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
