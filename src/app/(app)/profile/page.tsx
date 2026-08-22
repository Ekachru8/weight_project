/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Loader2,
  CheckCircle,
  User,
  Scale,
  Target,
  Utensils,
  Dumbbell,
  AlertCircle
} from "lucide-react";

interface UserData {
  id: number | string;
  name: string;
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  activityLevel: string | null;
  goal: string | null;
  dietPreference: string | null;
  equipment: string;
  foodsTheyEat: string | null;
  comfortableFoods: string | null;
  foodsToAvoid: string | null;
  allergies: string | null;
  budget: string | null;
  openToNewFoods: boolean | null;
  mealsPerDay: number | null;
  cookingConstraints: string | null;
  fitnessLevel: string | null;
  mobilityLevel: string | null;
  difficultMovements: string | null;
  intensityPreference: string | null;
  healthNotes: string | null;
  workoutFocus: string | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    heightCm: "",
    weightKg: "",
    targetWeightKg: "",
    activityLevel: "moderate",
    goal: "maintain",
    dietPreference: "non_veg",
    equipment: "",
    foodsTheyEat: "",
    comfortableFoods: "",
    foodsToAvoid: "",
    allergies: "",
    budget: "",
    openToNewFoods: false,
    mealsPerDay: "",
    cookingConstraints: "",
    fitnessLevel: "",
    mobilityLevel: "",
    difficultMovements: "",
    intensityPreference: "",
    healthNotes: "",
    workoutFocus: "",
  });

  const fetchUser = useCallback(async () => {
    if (status === "loading" || status === "unauthenticated") {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user");
      if (res.status === 401) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);
      
      const displayNameFallback = data.name || session?.user?.name || session?.user?.email?.split("@")[0] || "";
      
      setForm({
        name: displayNameFallback,
        age: data.age?.toString() || "",
        gender: data.gender || "male",
        heightCm: data.heightCm?.toString() || "",
        weightKg: data.weightKg?.toString() || "",
        targetWeightKg: data.targetWeightKg?.toString() || "",
        activityLevel: data.activityLevel || "moderate",
        goal: data.goal || "maintain",
        dietPreference: data.dietPreference || "non_veg",
        equipment: data.equipment || "",
        foodsTheyEat: data.foodsTheyEat || "",
        comfortableFoods: data.comfortableFoods || "",
        foodsToAvoid: data.foodsToAvoid || "",
        allergies: data.allergies || "",
        budget: data.budget || "",
        openToNewFoods: data.openToNewFoods || false,
        mealsPerDay: data.mealsPerDay?.toString() || "",
        cookingConstraints: data.cookingConstraints || "",
        fitnessLevel: data.fitnessLevel || "",
        mobilityLevel: data.mobilityLevel || "",
        difficultMovements: data.difficultMovements || "",
        intensityPreference: data.intensityPreference || "",
        healthNotes: data.healthNotes || "",
        workoutFocus: data.workoutFocus || "",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        mealsPerDay: form.mealsPerDay ? Number(form.mealsPerDay) : undefined,
      };

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save profile");
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      setError(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (status === "unauthenticated" || user?.id === "guest") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 fade-in-up">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6">
          <User className="text-muted/50" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Guest Preview</h1>
        <p className="text-sm text-muted max-w-sm mb-6">Create an account to save your personal details, unlock AI diet generation, and track progress over time.</p>
        <div className="flex gap-4">
          <a href="/login" className="px-6 py-2.5 rounded-xl bg-card border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm">
            Sign In
          </a>
          <a href="/signup" className="px-6 py-2.5 rounded-xl bg-accent text-black font-bold hover:brightness-110 transition-all text-sm">
            Create Account
          </a>
        </div>
      </div>
    );
  }

  const initials = (form.name || session?.user?.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate completeness
  const allFields = Object.keys(form);
  const filledFields = allFields.filter(key => {
    const val = (form as any)[key];
    return val !== "" && val !== null && val !== undefined;
  });
  const completeness = Math.round((filledFields.length / allFields.length) * 100);

  return (
    <div className="space-y-8 fade-in-up pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-lg text-xl font-bold text-foreground overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt={form.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {form.name || "Your Profile"}
            </h1>
            <p className="text-sm text-foreground/70">
              Manage your personal details and goals.
            </p>
          </div>
        </div>
        <div className="glass-card px-4 py-2 border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={`${completeness}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {completeness}%
            </div>
          </div>
          <div className="text-xs">
            <p className="font-bold text-foreground">Profile Completeness</p>
            <p className="text-muted">Fill out all fields for better AI results</p>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="glass-card px-4 py-3 flex items-center gap-2 shadow-lg border-success/30 border">
            <CheckCircle size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Changes saved just now</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="glass-card px-4 py-3 flex items-center gap-2 shadow-lg border-danger/30 border bg-danger/5">
            <AlertCircle size={16} className="text-danger" />
            <span className="text-sm font-medium text-danger">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={saveProfile} className="space-y-8">
        
        {/* Personal Details */}
        <div className="glass-card p-6 border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
            <User className="text-accent" size={20} />
            <h2 className="text-lg font-bold text-foreground">Personal Details</h2>
          </div>
          
          <div>
            <label htmlFor="profile-name" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
              Display Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-age" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Age
              </label>
              <input
                id="profile-age"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-gender" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Gender
              </label>
              <select
                id="profile-gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Metrics & Goal */}
        <div className="glass-card p-6 border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
            <Target className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-foreground">Body Metrics & Goal</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-height" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Height (cm)
              </label>
              <input
                id="profile-height"
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-goal" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Goal
              </label>
              <select
                id="profile-goal"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Muscle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-weight" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Current Weight (kg)
              </label>
              <input
                id="profile-weight"
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-target-weight" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Target Weight (kg)
              </label>
              <input
                id="profile-target-weight"
                type="number"
                step="0.1"
                value={form.targetWeightKg}
                onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Nutrition Preferences */}
        <div className="glass-card p-6 border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
            <Utensils className="text-orange-400" size={20} />
            <h2 className="text-lg font-bold text-foreground">Nutrition Preferences</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-diet" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Diet Type
              </label>
              <select
                id="profile-diet"
                value={form.dietPreference}
                onChange={(e) => setForm({ ...form, dietPreference: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="veg">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="both">Flexible / Both</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-meals" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Preferred meals per day (3-6)
              </label>
              <input
                id="profile-meals"
                type="number"
                min="3"
                max="6"
                value={form.mealsPerDay}
                onChange={(e) => setForm({ ...form, mealsPerDay: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-foods-eat" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Foods Eaten Regularly
              </label>
              <input
                id="profile-foods-eat"
                type="text"
                value={form.foodsTheyEat}
                onChange={(e) => setForm({ ...form, foodsTheyEat: e.target.value })}
                placeholder="e.g. Rice, Chicken, Lentils"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-foods-comfort" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Comfortable Foods / Enjoy
              </label>
              <input
                id="profile-foods-comfort"
                type="text"
                value={form.comfortableFoods}
                onChange={(e) => setForm({ ...form, comfortableFoods: e.target.value })}
                placeholder="e.g. Pasta, Potatoes"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-foods-avoid" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Foods to Avoid
              </label>
              <input
                id="profile-foods-avoid"
                type="text"
                value={form.foodsToAvoid}
                onChange={(e) => setForm({ ...form, foodsToAvoid: e.target.value })}
                placeholder="e.g. Broccoli, Fish"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-allergies" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Allergies or Intolerances
              </label>
              <input
                id="profile-allergies"
                type="text"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="e.g. Peanuts, Lactose"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-budget" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Budget Level
              </label>
              <select
                id="profile-budget"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="">Select budget</option>
                <option value="low">Budget-friendly</option>
                <option value="medium">Standard</option>
                <option value="high">Premium</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-cooking" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Cooking Constraints
              </label>
              <input
                id="profile-cooking"
                type="text"
                value={form.cookingConstraints}
                onChange={(e) => setForm({ ...form, cookingConstraints: e.target.value })}
                placeholder="e.g. 30 mins max, meal prep on Sundays"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors">
            <input
              type="checkbox"
              checked={form.openToNewFoods}
              onChange={(e) => setForm({ ...form, openToNewFoods: e.target.checked })}
              className="w-4 h-4 rounded accent-accent bg-[#101010] border-white/10"
            />
            <span className="text-sm font-medium text-foreground">Open to trying new foods</span>
          </label>
        </div>

        {/* Fitness Readiness */}
        <div className="glass-card p-6 border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
            <Dumbbell className="text-purple-400" size={20} />
            <h2 className="text-lg font-bold text-foreground">Fitness Readiness</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-activity" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Daily Activity Level
              </label>
              <select
                id="profile-activity"
                value={form.activityLevel}
                onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="very_active">Very Active</option>
                <option value="extra_active">Extra Active</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-fitness" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Fitness Level
              </label>
              <select
                id="profile-fitness"
                value={form.fitnessLevel}
                onChange={(e) => setForm({ ...form, fitnessLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-mobility" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Mobility / Flexibility
              </label>
              <select
                id="profile-mobility"
                value={form.mobilityLevel}
                onChange={(e) => setForm({ ...form, mobilityLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="">Select level</option>
                <option value="poor">Poor</option>
                <option value="average">Average</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-intensity" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Preferred Intensity
              </label>
              <select
                id="profile-intensity"
                value={form.intensityPreference}
                onChange={(e) => setForm({ ...form, intensityPreference: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="">Select intensity</option>
                <option value="low">Low Intensity (Recovery/Steady)</option>
                <option value="medium">Medium (Moderate sweating)</option>
                <option value="high">High (HIIT / Heavy lifting)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="profile-equipment" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
              Available Equipment
            </label>
            <input
              id="profile-equipment"
              type="text"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              placeholder="e.g. Dumbbells, Resistance Bands, None (Bodyweight)"
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-difficult" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Movements that feel difficult
              </label>
              <input
                id="profile-difficult"
                type="text"
                value={form.difficultMovements}
                onChange={(e) => setForm({ ...form, difficultMovements: e.target.value })}
                placeholder="e.g. Squats, Push-ups"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="profile-focus" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Workout Focus
              </label>
              <input
                id="profile-focus"
                type="text"
                value={form.workoutFocus}
                onChange={(e) => setForm({ ...form, workoutFocus: e.target.value })}
                placeholder="e.g. Build strength, improve cardio"
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-health" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
              Health or Movement Restrictions
            </label>
            <input
              id="profile-health"
              type="text"
              value={form.healthNotes}
              onChange={(e) => setForm({ ...form, healthNotes: e.target.value })}
              placeholder="e.g. Bad knees, lower back pain"
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-accent text-black font-bold text-sm btn-press disabled:opacity-50 transition-all hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center justify-center min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
