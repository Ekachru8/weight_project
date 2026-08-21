"use client";

import { useState, useEffect, useCallback } from "react";
import MacroRing from "@/components/MacroRing";
import MealCard from "@/components/MealCard";
import { getSampleMealPlan, getDeterministicOptionIndex } from "@/lib/meals";
import type { DietType } from "@/lib/meals";
import type { DietResult } from "@/lib/diet";
import {
  EMPTY_ASSISTANT_INTAKE,
  type AssistantIntake,
  type DietAssistantPlan,
} from "@/lib/diet-assistant";
import {
  Loader2,
  AlertTriangle,
  Flame,
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Check,
  X,
  Info,
} from "lucide-react";

interface UserData {
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg?: number | null;
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
  const [assistantIntake, setAssistantIntake] = useState<AssistantIntake>(EMPTY_ASSISTANT_INTAKE);
  const [assistantPlan, setAssistantPlan] = useState<DietAssistantPlan | null>(null);
  const [planCreated, setPlanCreated] = useState(false);
  const [assistantMode, setAssistantMode] = useState<"closed" | "chat" | "edit">("closed");
  const [chatInput, setChatInput] = useState("");
  const [assistantStep, setAssistantStep] = useState<1 | 2 | 3>(1);
  const [assistantError, setAssistantError] = useState("");
  const [isGeneratingAssistant, setIsGeneratingAssistant] = useState(false);
  const [manualSelections, setManualSelections] = useState<{ date: string; options: Record<string, number> }>({ date: "", options: {} });

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

  const generateAIPlan = useCallback(async (calories: number, type: DietType, goal: string, weight: number) => {
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
  }, []);

  const generateAssistantPlan = useCallback(async (userMessage?: string) => {
    if (!diet || !user) return;
    setIsGeneratingAssistant(true);
    setAssistantError("");

    if (user.targetWeightKg && user.weightKg) {
      if (user.targetWeightKg < user.weightKg && user.goal !== "lose" && user.goal !== "maintain") {
        setAssistantError("Your target weight is lower than your current weight, but your goal is set to Gain Weight. Please update your target weight or goal.");
        setIsGeneratingAssistant(false);
        return;
      }
      if (user.targetWeightKg > user.weightKg && user.goal !== "gain" && user.goal !== "maintain") {
        setAssistantError("Your target weight is higher than your current weight, but your goal is set to Lose Weight. Please update your target weight or goal.");
        setIsGeneratingAssistant(false);
        return;
      }
    }

    try {
      const context = {
        diet: {
          targetCalories: diet.targetCalories,
          proteinG: diet.proteinG,
          carbsG: diet.carbsG,
          fatG: diet.fatG,
          tdee: diet.tdee,
          targetWeightKg: user.targetWeightKg,
          estimatedWeeks: (diet as any).estimatedWeeks,
        },
        user,
      };
      const res = await fetch("/api/diet/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietType, intake: assistantIntake, context, userMessage }),
      });

      const responseText = await res.text();
      let data: { plan?: DietAssistantPlan; error?: string } = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(`The server returned an invalid response (${res.status}).`);
      }

      if (!res.ok || !data.plan) {
        throw new Error(data.error || `Unable to generate a personalized plan (${res.status}).`);
      }

      setAssistantPlan(data.plan);
      setPlanCreated(true);
      setAssistantMode("closed");
    } catch (error) {
      console.error("Failed to generate assistant plan:", error);
      setAssistantError(
        error instanceof Error
          ? error.message
          : "I couldn't build that plan right now. Please try again.",
      );
    } finally {
      setIsGeneratingAssistant(false);
    }
  }, [assistantIntake, diet, dietType, user]);

  const updateAssistantIntake = (field: keyof AssistantIntake, value: string | number | boolean) => {
    setAssistantIntake((previous) => ({ ...previous, [field]: value }));
    setAssistantPlan(null);
    setManualSelections({ date: "", options: {} });
  };

  const fetchDiet = useCallback(async () => {
    try {
      const res = await fetch("/api/diet");
      const data = await res.json();
      
      if (!res.ok || data.error) {
        console.warn("API error - Falling back to MOCK DATA for presentation", data);
        
        // MOCK DATA FALLBACK for presentation if database is asleep/missing
        setOnboardingRequired(false);
        setUser({ goal: "lose", weightKg: 70, targetWeightKg: 65, dietPreference: "non_vegetarian" } as any);
        setDiet({
          targetCalories: 1850,
          proteinG: 150,
          carbsG: 180,
          fatG: 55,
          bmr: 1650,
          tdee: 2350,
          isBelowFloor: false,
          cautionMessage: "",
          targetWeightKg: 65,
          estimatedWeeks: 6,
        });
        setDietType("non_vegetarian");
        generateAIPlan(1850, "non_vegetarian", "lose", 70);
        
        setLoading(false);
        return;
      }

      setOnboardingRequired(data.onboardingRequired);
      if (data.user) {
        setUser(data.user);
      }
      
      if (!data.onboardingRequired && data.diet && data.user) {
        setDiet(data.diet);
        setDietType(data.user.dietPreference as DietType || "non_vegetarian");
        generateAIPlan(data.diet.targetCalories, data.user.dietPreference as DietType || "non_vegetarian", data.user.goal, data.user.weightKg);
      }
    } catch (error) {
      console.error("Failed to fetch diet:", error);
    } finally {
      setLoading(false);
    }
  }, [generateAIPlan]);

  useEffect(() => {
    fetchDiet();
  }, [fetchDiet]);

  // When dietType changes via tabs, regenerate the AI plan
  useEffect(() => {
    setAssistantPlan(null);
    setManualSelections({ date: "", options: {} });
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

  const handleUpdateTargetWeight = async (targetWeight: number) => {
    if (!user || isNaN(targetWeight) || targetWeight <= 0) return;
    setUser((prev) => prev ? { ...prev, targetWeightKg: targetWeight } : null);
    
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetWeightKg: targetWeight }),
      });
      const data = await res.json();
      if (data.dietTargets && data.dietTargets[0]) {
         const latestTarget = data.dietTargets[0];
         setDiet((prev) => prev ? { 
            ...prev, 
            targetCalories: latestTarget.calories,
            proteinG: latestTarget.proteinG,
            carbsG: latestTarget.carbsG,
            fatG: latestTarget.fatG,
            // Assuming tdee, etc. remain the same if we only updated targetWeightKg
         } : null);
         // Generate new AI Plan if needed, but since we rely on Assistant or Fallback, 
         // just fetchDiet to refresh everything safely.
         fetchDiet();
      }
    } catch (err) {
      console.error("Failed to update target weight:", err);
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1">
            Your nutrition plan
          </h1>
          <p className="text-sm text-muted">
            Meals and recipes selected around your goal, preferences, and routine.
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label htmlFor="diet-gender" className="text-xs text-muted font-medium mb-1 block">Gender</label>
                  <select
                    id="diet-gender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
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
                  className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
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

  if (!diet) {
    return (
      <div className="text-center py-16 text-muted glass-card rounded-2xl border-white/5 fade-in-up mt-6">
        <AlertTriangle className="mx-auto mb-4 opacity-30 text-rose-500" size={48} />
        <p className="text-lg font-medium text-white/50">Unable to load your diet plan</p>
        <p className="text-sm mt-2 text-white/30">Please check your database connection or reload the page.</p>
      </div>
    );
  }

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

  const mealPlan = assistantPlan?.meals ?? (aiPlan ? aiPlan.meals : getSampleMealPlan(diet.targetCalories, dietType));

  const todayKey = new Date().toISOString().slice(0, 10);

  const getActiveOption = (meal: any, key: string) => {
    if (!meal) return { dish: { calories: 0, protein: 0, carbs: 0, fat: 0 }, index: 0, isManual: false };
    const options = meal.options || [];
    if (options.length === 0) return { dish: meal, index: 0, isManual: false };

    if (manualSelections.date === todayKey && manualSelections.options[key] !== undefined) {
      const idx = manualSelections.options[key];
      return { dish: options.length > idx ? options[idx] : meal, index: idx, isManual: true };
    }

    const recIdx = getDeterministicOptionIndex(todayKey, key, options.length);
    return { dish: options[recIdx], index: recIdx, isManual: false };
  };

  const activeBreakfast = getActiveOption(mealPlan.breakfast, "breakfast");
  const activeMorningSnack = getActiveOption(mealPlan.morningSnack, "morningSnack");
  const activeLunch = getActiveOption(mealPlan.lunch, "lunch");
  const activeEveningSnack = getActiveOption(mealPlan.eveningSnack, "eveningSnack");
  const activeDinner = getActiveOption(mealPlan.dinner, "dinner");

  const dynamicMeals = {
    breakfast: activeBreakfast.dish,
    morningSnack: activeMorningSnack.dish,
    lunch: activeLunch.dish,
    eveningSnack: activeEveningSnack.dish,
    dinner: activeDinner.dish,
  };

  const dynamicTotals = {
    totalCalories: Object.values(dynamicMeals).reduce((sum, dish) => sum + dish.calories, 0),
    totalProtein: Object.values(dynamicMeals).reduce((sum, dish) => sum + dish.protein, 0),
    totalCarbs: Object.values(dynamicMeals).reduce((sum, dish) => sum + dish.carbs, 0),
    totalFat: Object.values(dynamicMeals).reduce((sum, dish) => sum + dish.fat, 0),
  };

  const displayedCalories = assistantPlan ? dynamicTotals.totalCalories : diet.targetCalories;
  const displayedProtein = assistantPlan ? dynamicTotals.totalProtein : diet.proteinG;
  const displayedCarbs = assistantPlan ? dynamicTotals.totalCarbs : diet.carbsG;
  const displayedFat = assistantPlan ? dynamicTotals.totalFat : diet.fatG;

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

      {/* Goal Snapshot */}
      {user && user.targetWeightKg && (
        <div className="fade-in-up glass-card border-white/10 rounded-3xl p-6 lg:p-8 bg-white/[0.02]">
          <div className="flex items-start gap-3 mb-4">
            <Target className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-foreground">Goal Snapshot</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Current Weight</p>
              <p className="text-lg font-black text-foreground">{user.weightKg} kg</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Target Weight</p>
              <p className="text-lg font-black text-accent">{user.targetWeightKg} kg</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Change Required</p>
              <p className="text-lg font-black text-foreground">{Math.abs((user.weightKg || 0) - user.targetWeightKg).toFixed(1)} kg</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Estimated Timeline</p>
              <p className="text-lg font-black text-foreground">{diet.estimatedWeeks ? `~${diet.estimatedWeeks} weeks` : "N/A"}</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
            Your calorie target ({diet.targetCalories} kcal) is based on your current profile, activity level, desired weight change, and a moderate adjustment designed to support steady progress.
          </p>
          <p className="text-[10px] text-muted/60 mt-3 max-w-3xl">
            Progress varies between individuals. This estimate is for general wellness planning and should be reviewed with a qualified clinician or dietitian if you have medical needs.
          </p>
        </div>
      )}

      {/* AI dietician intake */}
      <div className="glass-card border-accent/25 bg-white/[0.025] rounded-3xl p-6 lg:p-8 fade-in-up opacity-0 delay-100 relative overflow-hidden">
        {/* Glow behind the icon */}
        <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        {(!planCreated || assistantMode === "edit") && (
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl accent-gradient flex items-center justify-center flex-shrink-0 shadow-[0_0_24px_rgba(192,255,0,0.25)]">
                <Sparkles className="text-black" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">AI Dietician</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">Build a nutrition plan that fits your life</h2>
                <p className="text-sm text-foreground/80 leading-relaxed mt-2.5 max-w-2xl">
                  Answer a few simple questions about your preferences, routine, and food choices. We&apos;ll create a practical meal plan that supports your goals and is easy to follow.
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted font-bold mt-3">Built around your preferences • Flexible meals • Smarter choices</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (planCreated) {
                  setAssistantMode("closed");
                }
              }}
              aria-label="Close AI Dietician"
              className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-accent/40 bg-white/[0.02] hover:bg-accent/10 text-muted hover:text-accent transition-all duration-300 btn-press group ${!planCreated ? 'hidden' : ''}`}
            >
              <X size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        {(planCreated && assistantMode !== "edit") && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(192,255,0,0.2)]">
                <Sparkles className="text-black" size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-0.5">AI Dietician</p>
                <h2 className="text-lg font-bold text-foreground">Your plan is ready</h2>
                <p className="text-xs text-foreground/70 mt-0.5">
                  Built around the foods you enjoy, with practical portions and flexible alternatives to help you stay consistent.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {assistantMode === "closed" ? (
                <>
                  <button
                    onClick={() => setAssistantMode("chat")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-bold hover:bg-accent/20 transition-all btn-press"
                  >
                    Ask AI Dietician
                  </button>
                  <button
                    onClick={() => setAssistantMode("edit")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-muted hover:text-white text-xs font-bold transition-all btn-press"
                  >
                    Adjust preferences
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setAssistantMode("closed")}
                  aria-label="Close AI Dietician"
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] text-muted hover:text-white hover:bg-white/[0.1] transition-all btn-press"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {assistantMode === "chat" && (
          <div className="mt-6 pt-6 border-t border-white/[0.08] relative z-10 fade-in-up">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-black" size={14} />
                  </div>
                  <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
                    <p className="text-sm text-foreground leading-relaxed">
                      Hi! I’m your AI Dietician. I’ve reviewed your profile and created a starting plan. What would you like to improve first?
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "Make it easier to cook",
                        "Add more variety",
                        "Increase protein",
                        "Reduce calories",
                        "Change foods I dislike",
                        "Show different recipes"
                      ].map(reply => (
                        <button
                          key={reply}
                          onClick={() => generateAssistantPlan(reply)}
                          className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors btn-press"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isGeneratingAssistant && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-black animate-pulse" size={14} />
                    </div>
                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin text-accent" size={14} />
                        <span className="text-xs text-muted">Updating your plan...</span>
                      </div>
                    </div>
                  </div>
                )}
                {assistantError && !isGeneratingAssistant && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                      <p className="text-xs font-medium text-rose-400">{assistantError}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-auto">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      generateAssistantPlan(chatInput);
                      setChatInput("");
                    }
                  }}
                  placeholder="Type foods separated by commas or ask for a change..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      generateAssistantPlan(chatInput);
                      setChatInput("");
                    }
                  }}
                  disabled={isGeneratingAssistant || !chatInput.trim()}
                  className="w-11 h-11 rounded-full accent-gradient flex items-center justify-center text-black disabled:opacity-50 transition-all btn-press"
                >
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {(!planCreated || assistantMode === "edit") && (
          <div className="mt-8 pt-6 border-t border-white/[0.08] relative z-10">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 overflow-hidden">
              <div className="flex items-center flex-1 gap-2 sm:gap-4">
                {[
                  { id: 1, label: "Your Food Preferences" },
                  { id: 2, label: "Foods to Avoid" },
                  { id: 3, label: "Your Routine" }
                ].map((s) => {
                  const isActive = assistantStep === s.id;
                  const isCompleted = assistantStep > s.id;
                  return (
                    <div key={s.id} className="flex-1">
                      <div className={`h-1.5 w-full rounded-full transition-all duration-500 mb-2 ${
                        isActive ? "bg-accent shadow-[0_0_10px_rgba(192,255,0,0.4)]" : 
                        isCompleted ? "bg-accent/40" : "bg-white/10"
                      }`} />
                      <div className="hidden sm:flex items-center gap-1.5">
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-accent" />
                          </div>
                        ) : (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
                            isActive ? "border-accent bg-accent text-black" : "border-muted text-muted"
                          }`}>
                            {s.id}
                          </div>
                        )}
                        <span className={`text-[10px] uppercase tracking-wider font-bold truncate ${isActive ? "text-accent" : "text-muted"}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="ml-4 sm:hidden flex-shrink-0">
                <span className="text-xs font-bold text-accent">Step {assistantStep} of 3</span>
              </div>
            </div>

            <div className="transition-all duration-300">
              {assistantStep === 1 && (
                <div className="space-y-6 fade-in-up">
                  {(!user?.targetWeightKg) && (
                    <div className="mb-6">
                      <label htmlFor="target-weight" className="text-sm text-foreground font-semibold mb-1 block">What weight would you like to reach?</label>
                      <p className="text-[11px] sm:text-xs text-muted mb-3 leading-relaxed">This helps us estimate your calorie target and a realistic timeline. You can update it later.</p>
                      <input
                        id="target-weight"
                        type="number"
                        min="30"
                        max="300"
                        onBlur={(e) => handleUpdateTargetWeight(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                        placeholder="e.g. 70"
                      />
                    </div>
                  )}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="foods-they-eat" className="text-sm text-foreground font-semibold mb-1 block">Foods you enjoy</label>
                      <textarea
                        id="foods-they-eat"
                        value={assistantIntake.foodsTheyEat}
                        onChange={(event) => updateAssistantIntake("foodsTheyEat", event.target.value)}
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y transition-all"
                        placeholder="For example: rice, dal, chicken, curd, bananas, roti, pizza, noodles"
                      />
                      <div className="mt-3 bg-black/40 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                        <Info className="text-muted shrink-0 mt-0.5" size={16} />
                        <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
                          Tell us what you genuinely enjoy eating. We will work with your preferences, budget, and routine rather than forcing foods you dislike. If you are open to anything, we can suggest a wider range of options based on your profile and goals.
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="open-to-new"
                          checked={assistantIntake.openToNewFoods}
                          onChange={(e) => updateAssistantIntake("openToNewFoods", e.target.checked)}
                          className="w-4 h-4 rounded bg-black/40 border-white/15 text-accent focus:ring-accent/40"
                        />
                        <label htmlFor="open-to-new" className="text-sm text-foreground/80 cursor-pointer">Open to new foods?</label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comfortable-foods" className="text-sm text-foreground font-semibold mb-1 block">Which foods do you enjoy and feel comfortable preparing?</label>
                      <p className="text-[11px] sm:text-xs text-muted mb-3 leading-relaxed">These preferences help us suggest meals you will actually enjoy and continue eating.</p>
                      <textarea
                        id="comfortable-foods"
                        value={assistantIntake.comfortableFoods}
                        onChange={(event) => updateAssistantIntake("comfortableFoods", event.target.value)}
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y transition-all"
                        placeholder="For example: home-cooked Indian meals, eggs, oats, paneer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="button" onClick={() => setAssistantStep(2)} className="w-full sm:w-auto px-8 py-3.5 rounded-xl accent-gradient text-black font-extrabold text-sm btn-press shadow-[0_0_20px_rgba(192,255,0,0.2)]">Continue to exclusions →</button>
                  </div>
                </div>
              )}

              {assistantStep === 2 && (
                <div className="space-y-6 fade-in-up">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-foreground mb-1">Tell us what to leave out</h3>
                    <p className="text-xs text-muted">We’ll remove disliked foods, ingredients, textures, and allergens from your recommendations.</p>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="foods-to-avoid" className="text-sm text-foreground font-semibold mb-1 block">Foods you want to avoid</label>
                      <textarea
                        id="foods-to-avoid"
                        value={assistantIntake.foodsToAvoid}
                        onChange={(event) => updateAssistantIntake("foodsToAvoid", event.target.value)}
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y transition-all"
                        placeholder="For example: tofu, fish, mushrooms, very spicy food"
                      />
                    </div>
                    <div>
                      <label htmlFor="food-allergies" className="text-sm text-foreground font-semibold mb-1 block">Allergies or intolerances</label>
                      <p className="text-[11px] sm:text-xs text-muted mb-3 leading-relaxed">List every allergy or intolerance clearly. This information is used as a safety filter.</p>
                      <textarea
                        id="food-allergies"
                        value={assistantIntake.allergies}
                        onChange={(event) => updateAssistantIntake("allergies", event.target.value)}
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y transition-all"
                        placeholder="For example: peanuts, lactose, shellfish. Type &quot;None&quot; if you have no known restrictions."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 justify-end">
                    <button type="button" onClick={() => setAssistantStep(1)} className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.02] text-sm font-bold text-foreground hover:bg-white/[0.05] transition-colors btn-press">Back</button>
                    <button type="button" onClick={() => setAssistantStep(3)} className="w-full sm:w-auto px-8 py-3.5 rounded-xl accent-gradient text-black font-extrabold text-sm btn-press shadow-[0_0_20px_rgba(192,255,0,0.2)]">Continue to your routine →</button>
                  </div>
                </div>
              )}

              {assistantStep === 3 && (
                <div className="space-y-6 fade-in-up">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-foreground mb-1">Make the plan fit your routine</h3>
                    <p className="text-xs text-muted">Tell us how you live and cook so the plan feels practical on your busiest days.</p>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="cooking-constraints" className="text-sm text-foreground font-semibold mb-1 block">Cooking time and schedule</label>
                      <textarea
                        id="cooking-constraints"
                        value={assistantIntake.cookingConstraints}
                        onChange={(event) => updateAssistantIntake("cookingConstraints", event.target.value)}
                        className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y transition-all mb-4"
                        placeholder="For example: under 30 minutes on weekdays, meal prep on Sunday"
                      />
                      
                      <label htmlFor="budget" className="text-sm text-foreground font-semibold mb-1 block">Affordable meal options</label>
                      <select
                        id="budget"
                        value={assistantIntake.budget}
                        onChange={(event) => updateAssistantIntake("budget", event.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all appearance-none"
                      >
                        <option value="low">Low budget (simple, very affordable ingredients)</option>
                        <option value="moderate">Moderate budget</option>
                        <option value="flexible">Flexible budget</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="meals-per-day" className="text-sm text-foreground font-semibold mb-1 block">How many meals or eating occasions suit you?</label>
                      <select
                        id="meals-per-day"
                        value={assistantIntake.mealsPerDay}
                        onChange={(event) => updateAssistantIntake("mealsPerDay", Number(event.target.value))}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all appearance-none"
                      >
                        <option value={3}>3 meals</option>
                        <option value={4}>4 meals</option>
                        <option value={5}>5 meals</option>
                        <option value={6}>6 meals</option>
                      </select>
                      <p className="text-[11px] text-muted mt-3">You can still choose different dishes for variety within your selected meal structure.</p>
                    </div>
                  </div>
                  {assistantError && <p className="text-xs font-semibold text-rose-400 bg-rose-400/10 border border-rose-400/20 p-3 rounded-xl" role="alert">{assistantError}</p>}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 justify-end">
                    <button type="button" onClick={() => setAssistantStep(2)} className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.02] text-sm font-bold text-foreground hover:bg-white/[0.05] transition-colors btn-press">Back</button>
                    <button type="button" onClick={() => generateAssistantPlan()} disabled={isGeneratingAssistant} className="w-full sm:w-auto px-8 py-3.5 rounded-xl accent-gradient text-black font-extrabold text-sm btn-press shadow-[0_0_20px_rgba(192,255,0,0.2)] disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2">
                      {isGeneratingAssistant ? <><Loader2 className="animate-spin" size={18} /> Creating your personalized plan...</> : <><Sparkles size={18} /> Create my flexible meal plan</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Note */}
            <div className="mt-8 pt-5 border-t border-white/[0.08] flex justify-center fade-in-up">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05]">
                <ShieldCheck size={14} className="text-muted flex-shrink-0" />
                <p className="text-[10px] text-muted/80 leading-relaxed max-w-md text-center sm:text-left">
                  Your answers are used only to personalize your nutrition recommendations. This plan is for general wellness and is not medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Redesigned Daily Macros Section */}
      <div className="glass-card p-6 lg:p-8 border-white/10 fade-in-up mt-8 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-[250px] h-[250px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your daily nutrition targets</h2>
          <p className="text-sm text-muted mt-1.5">Personalized to support your goal and daily routine.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="mb-8">
              <p className="text-5xl font-black accent-text count-up-pop tracking-tight flex items-baseline gap-2">
                {displayedCalories} <span className="text-xl text-foreground font-bold tracking-normal">kcal</span>
              </p>
              <p className="text-[11px] uppercase tracking-widest text-muted font-bold mt-2">Daily energy target</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-4 sm:p-5 hover-lift">
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Protein</p>
                <p className="text-2xl font-black text-green-400">{displayedProtein} <span className="text-sm font-bold text-muted ml-0.5">g</span></p>
              </div>
              <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-4 sm:p-5 hover-lift">
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Carbohydrates</p>
                <p className="text-2xl font-black text-blue-400">{displayedCarbs} <span className="text-sm font-bold text-muted ml-0.5">g</span></p>
              </div>
              <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-4 sm:p-5 hover-lift">
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Fat</p>
                <p className="text-2xl font-black text-orange-400">{displayedFat} <span className="text-sm font-bold text-muted ml-0.5">g</span></p>
              </div>
              <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-4 sm:p-5 hover-lift">
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Meals</p>
                <p className="text-2xl font-black text-accent">{assistantIntake.mealsPerDay || 5}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-4 lg:pt-0">
            <MacroRing
              proteinG={displayedProtein}
              carbsG={displayedCarbs}
              fatG={displayedFat}
              calories={displayedCalories}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center relative z-10">
          <p className="text-[11px] text-muted/60">Your targets are calculated from your current goal, body metrics, activity level, and personalized meal plan.</p>
        </div>
      </div>

      {/* Premium Plan Summary */}
      {assistantPlan && (
        <div className="glass-card p-6 lg:p-8 border-accent/20 fade-in-up mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(192,255,0,0.2)]">
              {assistantPlan.source === "ai" ? <Sparkles className="text-black" size={28} /> : <ShieldCheck className="text-black" size={28} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-accent mb-2">Your Personalized Plan</p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">A nutrition plan built around your lifestyle</h3>
              <p className="text-sm text-foreground/80 leading-relaxed mt-3 max-w-3xl">
                A {assistantIntake.mealsPerDay || 5}-meal {dietType.replace('_', ' ')} plan designed to support your {user?.goal || "wellness"} goal at approximately {displayedCalories} kcal per day. It prioritizes foods you enjoy, respects your exclusions, and fits your cooking routine. Foods you marked as unsuitable have been excluded from this plan.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 relative z-10">
            <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-5 hover-lift">
              <p className="text-[10px] uppercase tracking-[0.12em] text-accent font-bold mb-2">Built Around Your Preferences</p>
              <p className="text-xs text-foreground/80 leading-relaxed">Prioritizes familiar foods you enjoy and are comfortable preparing.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-5 hover-lift">
              <p className="text-[10px] uppercase tracking-[0.12em] text-accent font-bold mb-2">Balanced for Your Goal</p>
              <p className="text-xs text-foreground/80 leading-relaxed">Provides approximately {displayedProtein} g protein, {displayedCarbs} g carbohydrates, and {displayedFat} g fat.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-5 hover-lift">
              <p className="text-[10px] uppercase tracking-[0.12em] text-accent font-bold mb-2">Designed for Your Routine</p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {assistantIntake.cookingConstraints 
                  ? `Built to fit your schedule and cooking limits: ${assistantIntake.cookingConstraints}.`
                  : "Designed to be practical, flexible, and easy to follow."}
              </p>
            </div>
          </div>

          {assistantPlan.swaps && assistantPlan.swaps.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6 relative z-10">
              <h4 className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-4">Smart Substitutions</h4>
              <ul className="space-y-3">
                {assistantPlan.swaps.map((swap, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    <Check className="text-accent flex-shrink-0 mt-0.5" size={16} />
                    <span>{swap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-5 flex items-start gap-2.5 relative z-10">
            <ShieldCheck className="text-muted flex-shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-muted leading-relaxed">
              <strong className="text-foreground font-semibold">Nutrition note: </strong>
              This plan is intended for general wellness and is not medical advice. If you have a medical condition, take medication, are pregnant, or have a food allergy, consult a qualified clinician or dietitian before following it.
            </p>
          </div>
        </div>
      )}

      {/* Redesigned Meal Plan Section */}
      <div className="fade-in-up mt-10 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {assistantPlan ? "Your personalized meal plan" : "Sample meal plan"}
          </h2>
        </div>
        {assistantPlan && (
          <p className="text-sm text-muted mt-2">Meals selected around your preferences, exclusions, nutrition targets, and daily routine.</p>
        )}
      </div>

      <div className="fade-in-up mb-6 flex justify-start">
        <div className="flex bg-white/[0.035] border border-white/10 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto snap-x hide-scrollbar shadow-inner">
          {[
            { value: "non_vegetarian" as DietType, label: "🍗 Non-Veg" },
            { value: "vegetarian" as DietType, label: "🥬 Vegetarian" },
            { value: "eggetarian" as DietType, label: "🥚 Eggetarian" },
          ].map((dt) => (
            <button
              key={dt.value}
              onClick={() => {
                setDietType(dt.value);
                setAssistantPlan(null);
              }}
              className={`snap-center flex-1 sm:flex-none whitespace-nowrap px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
                dietType === dt.value
                  ? "bg-white/[0.1] text-white shadow-md border-white/10 border"
                  : "text-muted hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fade-in-up mb-4 text-center">
        <p className="text-xs text-muted">
          Your recommendations refresh daily. You can also choose another recipe whenever you want more variety.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {mealPlan.breakfast && <MealCard meal={mealPlan.breakfast} mealTime="Breakfast" selectedOptionIndex={activeBreakfast.index} isManualSelection={activeBreakfast.isManual} onSelectOption={(idx) => setManualSelections(prev => ({ date: todayKey, options: { ...prev.options, breakfast: idx } }))} />}
        {mealPlan.morningSnack && <MealCard meal={mealPlan.morningSnack} mealTime="Morning Snack" selectedOptionIndex={activeMorningSnack.index} isManualSelection={activeMorningSnack.isManual} onSelectOption={(idx) => setManualSelections(prev => ({ date: todayKey, options: { ...prev.options, morningSnack: idx } }))} />}
        {mealPlan.lunch && <MealCard meal={mealPlan.lunch} mealTime="Lunch" selectedOptionIndex={activeLunch.index} isManualSelection={activeLunch.isManual} onSelectOption={(idx) => setManualSelections(prev => ({ date: todayKey, options: { ...prev.options, lunch: idx } }))} />}
        {mealPlan.eveningSnack && <MealCard meal={mealPlan.eveningSnack} mealTime="Evening Snack" selectedOptionIndex={activeEveningSnack.index} isManualSelection={activeEveningSnack.isManual} onSelectOption={(idx) => setManualSelections(prev => ({ date: todayKey, options: { ...prev.options, eveningSnack: idx } }))} />}
        {mealPlan.dinner && <MealCard meal={mealPlan.dinner} mealTime="Dinner" selectedOptionIndex={activeDinner.index} isManualSelection={activeDinner.isManual} onSelectOption={(idx) => setManualSelections(prev => ({ date: todayKey, options: { ...prev.options, dinner: idx } }))} />}
      </div>
        {/* AI Reasoning (for standard AI plan only) */}
        {!assistantPlan && aiPlan && (
          <div className="glass-card p-4 mt-4 bg-accent/5 border-accent/20 flex items-start gap-3 fade-in-up">
            <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <span className="text-black text-[10px] font-extrabold uppercase tracking-widest">AI</span>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-accent font-bold mb-1.5">Why this plan?</h4>
              <p className="text-xs text-muted leading-relaxed">
                {aiPlan.aiReasoning}
              </p>
            </div>
          </div>
        )}

        {/* Meal plan totals */}
        <div className="glass-card p-5 mt-6 hover-lift bg-white/[0.02]">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-3">
            {assistantPlan ? "Your Day Totals" : "Sample Day Totals"}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center sm:text-left">
            <div className="sm:border-r border-white/10 sm:pr-4">
              <p className="text-[10px] text-muted mb-0.5">Calories</p>
              <span className="text-foreground font-black text-sm sm:text-base">
                {dynamicTotals.totalCalories}
              </span>
            </div>
            <div className="sm:border-r border-white/10 sm:pr-4">
              <p className="text-[10px] text-muted mb-0.5">Protein</p>
              <span className="text-green-400 font-bold text-sm sm:text-base">{dynamicTotals.totalProtein}g</span>
            </div>
            <div className="sm:border-r border-white/10 sm:pr-4">
              <p className="text-[10px] text-muted mb-0.5">Carbs</p>
              <span className="text-blue-400 font-bold text-sm sm:text-base">{dynamicTotals.totalCarbs}g</span>
            </div>
            <div>
              <p className="text-[10px] text-muted mb-0.5">Fat</p>
              <span className="text-orange-400 font-bold text-sm sm:text-base">{dynamicTotals.totalFat}g</span>
            </div>
          </div>
        </div>
      </div>
  );
}
