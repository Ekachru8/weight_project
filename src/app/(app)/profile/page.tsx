"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  CheckCircle,
  User,
  Scale,
  Target,
  Utensils,
  Dumbbell
} from "lucide-react";

interface UserData {
  id: number;
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
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
  });

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
      setForm({
        name: data.name || "",
        age: data.age?.toString() || "",
        gender: data.gender || "male",
        heightCm: data.heightCm?.toString() || "",
        weightKg: data.weightKg?.toString() || "",
        targetWeightKg: data.targetWeightKg?.toString() || "",
        activityLevel: data.activityLevel || "moderate",
        goal: data.goal || "maintain",
        dietPreference: data.dietPreference || "non_veg",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : undefined,
          heightCm: form.heightCm ? Number(form.heightCm) : undefined,
          weightKg: form.weightKg ? Number(form.weightKg) : undefined,
          targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const initials = (user?.name || "HF")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 fade-in-up pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-lg text-xl font-bold text-foreground">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Profile Settings
            </h1>
            <p className="text-sm text-foreground/70">
              Manage your personal details and goals.
            </p>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="glass-card px-4 py-3 flex items-center gap-2 shadow-lg border-success/30 border">
            <CheckCircle size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Changes saved just now</span>
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

        {/* Diet & Activity */}
        <div className="glass-card p-6 border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
            <Utensils className="text-orange-400" size={20} />
            <h2 className="text-lg font-bold text-foreground">Diet & Activity</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-diet" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Diet Preference
              </label>
              <select
                id="profile-diet"
                value={form.dietPreference}
                onChange={(e) => setForm({ ...form, dietPreference: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              >
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="both">Flexible / Both</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-activity" className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
                Activity Level
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
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
