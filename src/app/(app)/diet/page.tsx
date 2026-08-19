"use client";

import { useState, useEffect, useCallback } from "react";
import MacroRing from "@/components/MacroRing";
import MealCard from "@/components/MealCard";
import { getSampleMealPlan } from "@/lib/meals";
import type { DietType } from "@/lib/meals";
import type { DietResult } from "@/lib/diet";
import { Loader2, AlertTriangle, Flame, Target, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface UserData {
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: string | null;
  goal: string | null;
  dietPreference: string | null;
}

export default function DietPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [diet, setDiet] = useState<DietResult | null>(null);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dietType, setDietType] = useState<DietType>("non_vegetarian");
  const [step, setStep] = useState(1);

  // Onboarding form state
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    heightCm: "",
    weightKg: "",
    activityLevel: "moderate",
    goal: "maintain",
    dietPreference: "non_vegetarian",
  });

  const fetchDiet = useCallback(async () => {
    try {
      const res = await fetch("/api/diet");
      const data = await res.json();
      setOnboardingRequired(data.onboardingRequired);
      setUser(data.user);
      if (!data.onboardingRequired) {
        setDiet(data.diet);
        setDietType(data.user.dietPreference as DietType || "non_vegetarian");
        generateAIPlan(data.diet.targetCalories, data.user.dietPreference as DietType || "non_vegetarian", data.user.goal, data.user.weightKg);
      }
    } catch (error) {
      console.error("Failed to fetch diet:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAIPlan = async (calories: number, type: DietType, goal: string, weight: number) => {
    setIsGeneratingAI(true);
    try {
      // Dynamic import to avoid SSR issues with the mock delay if needed, or just fetch via API
      const { generateAIDietPlan } = await import("@/lib/meals");
      const result = await generateAIDietPlan(calories, type, goal, weight);
      setAiPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, [fetchDiet]);

  // When dietType changes via tabs, regenerate the AI plan
  useEffect(() => {
    if (diet && user && aiPlan) {
      generateAIPlan(diet.targetCalories, dietType, user.goal || "maintain", user.weightKg || 70);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dietType]);

  const submitOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setDiet(data.diet);
      setDietType(form.dietPreference as DietType);
      setUser(prev => prev ? { ...prev, goal: form.goal, weightKg: Number(form.weightKg) } : null);
      setOnboardingRequired(false);
      generateAIPlan(data.diet.targetCalories, form.dietPreference as DietType, form.goal, Number(form.weightKg));
    } catch (error) {
      console.error("Failed to save diet:", error);
    } finally {
      setSaving(false);
    }
  };

  const goalIcon = (goal: string) => {
    switch (goal) {
      case "lose":
        return <TrendingDown size={16} className="text-blue-400" />;
      case "gain":
        return <TrendingUp size={16} className="text-emerald-400" />;
      default:
        return <Minus size={16} className="text-yellow-400" />;
    }
  };

  const goalLabel = (goal: string) => {
    switch (goal) {
      case "lose":
        return "Lose Weight";
      case "gain":
        return "Gain Weight";
      default:
        return "Maintain Weight";
    }
  };

  // Can advance to step 2?
  const canAdvance = form.age !== "" && form.heightCm !== "" && form.weightKg !== "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  // Onboarding form with step progress
  if (onboardingRequired) {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <div className="fade-in-up text-center">
          <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-4 hover-lift">
            <Target size={28} className="text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">
            Set Up Your Diet Plan
          </h1>
          <p className="text-sm text-muted">
            Tell us about yourself so we can calculate your daily calorie and
            macro targets.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 fade-in-up opacity-0 delay-100">
          <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? "accent-gradient" : "bg-white/10"}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? "accent-gradient" : "bg-white/10"}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 3 ? "accent-gradient" : "bg-white/10"}`} />
          <span className="text-[10px] text-muted ml-2">Step {step}/3</span>
        </div>

        <form onSubmit={submitOnboarding} className="space-y-4 fade-in-up opacity-0 delay-200">
          {step === 1 && (
            <div className="space-y-4 fade-in-up">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="diet-age" className="text-xs text-muted font-medium mb-1 block">Age</label>
                  <input
                    id="diet-age"
                    type="number"
                    required
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label htmlFor="diet-gender" className="text-xs text-muted font-medium mb-1 block">Gender</label>
                  <select
                    id="diet-gender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="diet-height" className="text-xs text-muted font-medium mb-1 block">Height (cm)</label>
                  <input
                    id="diet-height"
                    type="number"
                    required
                    value={form.heightCm}
                    onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label htmlFor="diet-weight" className="text-xs text-muted font-medium mb-1 block">Weight (kg)</label>
                  <input
                    id="diet-weight"
                    type="number"
                    step="0.1"
                    required
                    value={form.weightKg}
                    onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                    placeholder="70"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!canAdvance}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press disabled:opacity-50 transition-all mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 fade-in-up">
              <div>
                <label htmlFor="diet-activity" className="text-xs text-muted font-medium mb-1 block">Activity Level</label>
                <select
                  id="diet-activity"
                  value={form.activityLevel}
                  onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                >
                  <option value="sedentary">Sedentary (desk job, little exercise)</option>
                  <option value="light">Light (1–3 days/week)</option>
                  <option value="moderate">Moderate (3–5 days/week)</option>
                  <option value="very_active">Very Active (6–7 days/week)</option>
                  <option value="extra_active">Extra Active (athlete / physical job)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted font-medium mb-2 block">What&apos;s your goal?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "lose", label: "Lose Weight", icon: TrendingDown, color: "blue" },
                    { value: "maintain", label: "Maintain", icon: Minus, color: "yellow" },
                    { value: "gain", label: "Gain Weight", icon: TrendingUp, color: "emerald" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm({ ...form, goal: g.value })}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 btn-press ${
                        form.goal === g.value
                          ? `border-${g.color}-400/50 bg-${g.color}-500/10 ring-2 ring-${g.color}-400/30`
                          : "border-border bg-card hover:bg-card-hover"
                      }`}
                    >
                      <g.icon
                        className={`mx-auto mb-1 ${
                          form.goal === g.value
                            ? `text-${g.color}-400`
                            : "text-muted"
                        }`}
                        size={20}
                      />
                      <span
                        className={`text-xs font-medium ${
                          form.goal === g.value ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {g.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl glass-card text-sm font-medium text-muted hover:text-foreground transition-all btn-press"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press disabled:opacity-50 transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 fade-in-up">
              <div>
                <label className="text-xs text-muted font-medium mb-2 block">Diet Preference</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "non_vegetarian", label: "🍗 Non-Vegetarian" },
                    { value: "vegetarian", label: "🥬 Vegetarian" },
                    { value: "eggetarian", label: "🥚 Eggetarian" },
                  ].map((dp) => (
                    <button
                      key={dp.value}
                      type="button"
                      onClick={() => setForm({ ...form, dietPreference: dp.value })}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 btn-press flex items-center justify-between ${
                        form.dietPreference === dp.value
                          ? `border-accent/50 bg-accent/10 ring-2 ring-accent/30`
                          : "border-border bg-card hover:bg-card-hover"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          form.dietPreference === dp.value ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {dp.label}
                      </span>
                      {form.dietPreference === dp.value && (
                        <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center shadow-[0_0_10px_rgba(192,255,0,0.5)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl glass-card text-sm font-medium text-muted hover:text-foreground transition-all btn-press"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Generate AI Diet Plan"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Diet results
  if (!diet) return null;

  if (isGeneratingAI) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 bg-accent rounded-full blur-[30px] opacity-20 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center shadow-[0_0_30px_rgba(192,255,0,0.3)] relative z-10">
            <Loader2 className="text-black animate-spin" size={28} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Generating AI Diet Plan...</h2>
          <p className="text-sm text-muted mt-1">Analyzing your profile and preferences to build the perfect plan.</p>
        </div>
      </div>
    );
  }

  const mealPlan = aiPlan ? aiPlan.meals : getSampleMealPlan(diet.targetCalories, dietType);

  return (
    <div className="space-y-6">
      <div className="fade-in-up">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1">
          Diet Plan
        </h1>
        <div className="flex items-center gap-2">
          {goalIcon(user?.goal || "maintain")}
          <p className="text-sm text-muted">
            {goalLabel(user?.goal || "maintain")} • {diet.tdee} TDEE
          </p>
        </div>
      </div>

      {/* Caution banner */}
      {diet.isBelowFloor && diet.cautionMessage && (
        <div className="fade-in-up bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-warning">{diet.cautionMessage}</p>
        </div>
      )}

      {/* Calorie target hero with animated counter effect */}
      <div className="glass-card p-6 text-center glow fade-in-up opacity-0 delay-100">
        <Flame className="mx-auto mb-2 text-accent fire-pulse" size={28} />
        <p className="text-5xl font-black accent-text count-up-pop">
          {diet.targetCalories}
        </p>
        <p className="text-sm text-muted mt-1">calories per day</p>
        <div className="flex justify-center gap-6 mt-3 text-xs text-muted">
          <span>
            BMR: <strong className="text-foreground">{diet.bmr}</strong>
          </span>
          <span>
            TDEE: <strong className="text-foreground">{diet.tdee}</strong>
          </span>
        </div>
      </div>

      {/* Macro ring */}
      <div className="fade-in-up opacity-0 delay-200">
        <MacroRing
          proteinG={diet.proteinG}
          carbsG={diet.carbsG}
          fatG={diet.fatG}
          calories={diet.targetCalories}
        />
      </div>

      {/* Diet type toggle */}
      <div className="fade-in-up opacity-0 delay-300">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Sample Meal Plan
        </h3>
        <div className="pill-scroll mb-4">
          {[
            { value: "non_vegetarian" as DietType, label: "🍗 Non-Veg" },
            { value: "vegetarian" as DietType, label: "🥬 Vegetarian" },
            { value: "eggetarian" as DietType, label: "🥚 Eggetarian" },
          ].map((dt) => (
            <button
              key={dt.value}
              onClick={() => setDietType(dt.value)}
              className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border flex items-center justify-center btn-press ${
                dietType === dt.value
                  ? "bg-gradient-to-b from-accent/20 to-accent/5 text-accent border-accent/20 ring-1 ring-accent shadow-sm shadow-accent/10"
                  : "glass-card text-muted hover:text-foreground border-transparent hover:bg-white/[0.02]"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>

        {/* Meal cards */}
        <div className="space-y-3">
          <MealCard meal={mealPlan.breakfast} mealTime="Breakfast" />
          <MealCard meal={mealPlan.morningSnack} mealTime="Morning Snack" />
          <MealCard meal={mealPlan.lunch} mealTime="Lunch" />
          <MealCard meal={mealPlan.eveningSnack} mealTime="Evening Snack" />
          <MealCard meal={mealPlan.dinner} mealTime="Dinner" />
        </div>

        {/* AI Reasoning */}
        {aiPlan && (
          <div className="glass-card p-4 mt-4 bg-accent/5 border-accent/20 flex items-start gap-3 fade-in-up">
            <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-black text-xs font-bold">AI</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-accent mb-1">Why this plan?</h4>
              <p className="text-xs text-muted leading-relaxed">
                {aiPlan.aiReasoning}
              </p>
            </div>
          </div>
        )}

        {/* Meal plan totals */}
        <div className="glass-card p-4 mt-4 hover-lift">
          <p className="text-xs text-muted mb-2 font-medium">
            Sample Day Totals
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-bold">
              {mealPlan.totalCalories} kcal
            </span>
            <span className="text-green-400">P: {mealPlan.totalProtein}g</span>
            <span className="text-blue-400">C: {mealPlan.totalCarbs}g</span>
            <span className="text-orange-400">F: {mealPlan.totalFat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
