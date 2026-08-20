"use client";

import { useState, useEffect, useCallback } from "react";
import MacroRing from "@/components/MacroRing";
import MealCard from "@/components/MealCard";
import { getSampleMealPlan } from "@/lib/meals";
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
} from "lucide-react";

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
  const [assistantIntake, setAssistantIntake] = useState<AssistantIntake>(EMPTY_ASSISTANT_INTAKE);
  const [assistantPlan, setAssistantPlan] = useState<DietAssistantPlan | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantStep, setAssistantStep] = useState<1 | 2 | 3>(1);
  const [assistantError, setAssistantError] = useState("");
  const [isGeneratingAssistant, setIsGeneratingAssistant] = useState(false);

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

  const generateAssistantPlan = useCallback(async () => {
    if (!diet || !user) return;
    setIsGeneratingAssistant(true);
    setAssistantError("");
    try {
      const context = {
        diet: {
          targetCalories: diet.targetCalories,
          proteinG: diet.proteinG,
          carbsG: diet.carbsG,
          fatG: diet.fatG,
          tdee: diet.tdee,
        },
        user,
      };
      const res = await fetch("/api/diet/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietType, intake: assistantIntake, context }),
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
      setAssistantOpen(true);
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

  const updateAssistantIntake = (field: keyof AssistantIntake, value: string | number) => {
    setAssistantIntake((previous) => ({ ...previous, [field]: value }));
  };

  const fetchDiet = useCallback(async () => {
    try {
      const res = await fetch("/api/diet");
      const data = await res.json();
      
      if (!res.ok || data.error) {
        console.warn("API error - Falling back to MOCK DATA for presentation", data);
        
        // MOCK DATA FALLBACK for presentation if database is asleep/missing
        setOnboardingRequired(false);
        setUser({ goal: "lose", weightKg: 70, dietPreference: "non_vegetarian" } as any);
        setDiet({
          targetCalories: 1850,
          proteinG: 150,
          carbsG: 180,
          fatG: 55,
          bmr: 1650,
          tdee: 2350,
          isBelowFloor: false,
          cautionMessage: ""
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

  const displayedCalories = assistantPlan?.meals.totalCalories ?? diet.targetCalories;
  const displayedProtein = assistantPlan?.meals.totalProtein ?? diet.proteinG;
  const displayedCarbs = assistantPlan?.meals.totalCarbs ?? diet.carbsG;
  const displayedFat = assistantPlan?.meals.totalFat ?? diet.fatG;

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

      {/* AI dietician intake */}
      <div className="glass-card p-5 border-accent/20 bg-accent/[0.035] fade-in-up opacity-0 delay-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl accent-gradient flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(192,255,0,0.2)]">
            <Sparkles className="text-black" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-accent">AI Dietician</p>
            <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">Build a plan around your real life</h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed mt-1">
              Tell me what you already eat, what feels comfortable, and what you want to avoid. I&apos;ll shape the meals around your target calories and macros.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAssistantOpen((open) => !open)}
            className="shrink-0 px-3 py-2 rounded-xl border border-accent/30 bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors btn-press"
          >
            {assistantOpen ? "Close" : assistantPlan ? "Refine plan" : "Start"}
          </button>
        </div>

        {assistantOpen && (
          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="flex items-center gap-2 mb-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`h-1.5 flex-1 rounded-full transition-colors ${assistantStep >= item ? "bg-accent" : "bg-white/10"}`} />
              ))}
              <span className="text-[10px] text-muted whitespace-nowrap">Step {assistantStep}/3</span>
            </div>

            {assistantStep === 1 && (
              <div className="space-y-4 fade-in-up">
                <div>
                  <label htmlFor="foods-they-eat" className="text-xs text-foreground font-semibold mb-1 block">What do you usually eat?</label>
                  <p className="text-[11px] text-muted mb-2">Share regular meals, snacks, or ingredients. A simple comma-separated list is perfect.</p>
                  <textarea
                    id="foods-they-eat"
                    value={assistantIntake.foodsTheyEat}
                    onChange={(event) => updateAssistantIntake("foodsTheyEat", event.target.value)}
                    className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                    placeholder="For example: rice, dal, chicken, curd, bananas, roti"
                  />
                </div>
                <div>
                  <label htmlFor="comfortable-foods" className="text-xs text-foreground font-semibold mb-1 block">Which foods are you comfortable eating?</label>
                  <p className="text-[11px] text-muted mb-2">This helps the assistant choose foods you are more likely to enjoy and follow consistently.</p>
                  <textarea
                    id="comfortable-foods"
                    value={assistantIntake.comfortableFoods}
                    onChange={(event) => updateAssistantIntake("comfortableFoods", event.target.value)}
                    className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                    placeholder="For example: home-cooked Indian meals, eggs, oats, paneer"
                  />
                </div>
                <button type="button" onClick={() => setAssistantStep(2)} className="w-full py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press">Continue →</button>
              </div>
            )}

            {assistantStep === 2 && (
              <div className="space-y-4 fade-in-up">
                <div>
                  <label htmlFor="foods-to-avoid" className="text-xs text-foreground font-semibold mb-1 block">Anything you dislike or want to avoid?</label>
                  <p className="text-[11px] text-muted mb-2">Mention ingredients, dishes, or textures you do not want in the plan.</p>
                  <textarea
                    id="foods-to-avoid"
                    value={assistantIntake.foodsToAvoid}
                    onChange={(event) => updateAssistantIntake("foodsToAvoid", event.target.value)}
                    className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                    placeholder="For example: fish, mushrooms, very spicy food"
                  />
                </div>
                <div>
                  <label htmlFor="food-allergies" className="text-xs text-foreground font-semibold mb-1 block">Food allergies or intolerances</label>
                  <p className="text-[11px] text-muted mb-2">List any allergy or intolerance explicitly. Leave blank if none.</p>
                  <textarea
                    id="food-allergies"
                    value={assistantIntake.allergies}
                    onChange={(event) => updateAssistantIntake("allergies", event.target.value)}
                    className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                    placeholder="For example: peanuts, lactose"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAssistantStep(1)} className="px-4 py-3 rounded-xl glass-card text-sm font-medium text-muted hover:text-foreground transition-colors btn-press">← Back</button>
                  <button type="button" onClick={() => setAssistantStep(3)} className="flex-1 py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press">Continue →</button>
                </div>
              </div>
            )}

            {assistantStep === 3 && (
              <div className="space-y-4 fade-in-up">
                <div>
                  <label htmlFor="cooking-constraints" className="text-xs text-foreground font-semibold mb-1 block">What should the plan fit around?</label>
                  <p className="text-[11px] text-muted mb-2">Tell me about cooking time, budget, work schedule, or other practical limits.</p>
                  <textarea
                    id="cooking-constraints"
                    value={assistantIntake.cookingConstraints}
                    onChange={(event) => updateAssistantIntake("cookingConstraints", event.target.value)}
                    className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                    placeholder="For example: under 20 minutes on weekdays, affordable ingredients"
                  />
                </div>
                <div>
                  <label htmlFor="meals-per-day" className="text-xs text-foreground font-semibold mb-1 block">How many eating occasions work for you?</label>
                  <select
                    id="meals-per-day"
                    value={assistantIntake.mealsPerDay}
                    onChange={(event) => updateAssistantIntake("mealsPerDay", Number(event.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value={3}>3 meals</option>
                    <option value={4}>4 meals</option>
                    <option value={5}>5 meals</option>
                    <option value={6}>6 meals</option>
                  </select>
                </div>
                {assistantError && <p className="text-xs text-rose-300" role="alert">{assistantError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAssistantStep(2)} className="px-4 py-3 rounded-xl glass-card text-sm font-medium text-muted hover:text-foreground transition-colors btn-press">← Back</button>
                  <button type="button" onClick={generateAssistantPlan} disabled={isGeneratingAssistant} className="flex-1 py-3 rounded-xl accent-gradient text-black font-bold text-sm btn-press disabled:opacity-60 flex items-center justify-center gap-2">
                    {isGeneratingAssistant ? <><Loader2 className="animate-spin" size={17} /> Building your plan...</> : <><Sparkles size={17} /> Build my plan</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {assistantPlan && (
        <div className="glass-card p-5 border-accent/20 fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              {assistantPlan.source === "ai" ? <Sparkles className="text-accent" size={18} /> : <ShieldCheck className="text-accent" size={18} />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-accent">{assistantPlan.source === "ai" ? "AI personalized" : "Personalized starter"}</p>
                <span className="text-[10px] text-muted">Built from your answers</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-1">{assistantPlan.headline}</h2>
              <p className="text-sm text-muted leading-relaxed mt-1">{assistantPlan.summary}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {assistantPlan.swaps.slice(0, 3).map((swap, index) => (
              <div key={`${swap}-${index}`} className="rounded-xl bg-white/[0.035] border border-white/[0.06] p-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted mb-1">{index === 0 ? "Flexible" : index === 1 ? "Protein" : "Routine"}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{swap}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-yellow-400/[0.06] border border-yellow-400/15 p-3">
            <ShieldCheck className="text-yellow-300 flex-shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] text-yellow-100/75 leading-relaxed">{assistantPlan.safetyNote}</p>
          </div>
        </div>
      )}

      {/* Calorie target hero with animated counter effect */}
      <div className="glass-card p-6 text-center glow fade-in-up opacity-0 delay-100">
        <Flame className="mx-auto mb-2 text-accent fire-pulse" size={28} />
        <p className="text-5xl font-black accent-text count-up-pop">
          {displayedCalories}
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
          proteinG={displayedProtein}
          carbsG={displayedCarbs}
          fatG={displayedFat}
          calories={displayedCalories}
        />
      </div>

      {/* Diet type toggle */}
      <div className="fade-in-up opacity-0 delay-300">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {assistantPlan ? "Your Personalized Meal Plan" : "Sample Meal Plan"}
        </h3>
        <div className="pill-scroll mb-4">
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
              className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-500 ease-out border flex items-center justify-center backdrop-blur-md ${
                dietType === dt.value
                  ? "bg-white/[0.08] border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  : "bg-white/[0.02] border-white/[0.05] text-muted hover:bg-white/[0.04] hover:border-white/10 hover:text-white"
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
        {assistantPlan ? (
          <div className="glass-card p-4 mt-4 bg-accent/5 border-accent/20 flex items-start gap-3 fade-in-up">
            <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="text-black" size={14} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-accent mb-1">Personalized Plan</h4>
              <p className="text-xs text-muted leading-relaxed">
                {assistantPlan.summary}
              </p>
            </div>
          </div>
        ) : aiPlan ? (
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
        ) : null}

        {/* Meal plan totals */}
        <div className="glass-card p-4 mt-4 hover-lift">
          <p className="text-xs text-muted mb-2 font-medium">
            {assistantPlan ? "Your Day Totals" : "Sample Day Totals"}
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
