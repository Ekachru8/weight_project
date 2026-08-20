"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Save,
  User,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: string | null;
  goal: string | null;
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
    activityLevel: "moderate",
    goal: "maintain",
    equipment: "Dumbbells, Resistance Band, Yoga Mat",
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
        activityLevel: data.activityLevel || "moderate",
        goal: data.goal || "maintain",
        equipment: data.equipment || "Dumbbells, Resistance Band, Yoga Mat",
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

  // Get user initials for avatar
  const initials = (user?.name || "HF")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          {/* Avatar with gradient */}
          <div className="w-12 h-12 rounded-2xl avatar-gradient flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-sm">{initials}</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Profile
            </h1>
            <p className="text-xs text-muted">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="glass-card px-4 py-3 flex items-center gap-2 shadow-lg border-success/30 border">
            <CheckCircle size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Profile saved & diet recalculated!</span>
          </div>
        </div>
      )}

      <form onSubmit={saveProfile} className="space-y-4 fade-in-up opacity-0 delay-100">
        {/* Name */}
        <div>
          <label htmlFor="profile-name" className="text-xs text-muted font-medium mb-1 block">
            Display Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="profile-age" className="text-xs text-muted font-medium mb-1 block">
              Age
            </label>
            <input
              id="profile-age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
              placeholder="25"
            />
          </div>
          <div>
            <label htmlFor="profile-gender" className="text-xs text-muted font-medium mb-1 block">
              Gender
            </label>
            <select
              id="profile-gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="profile-height" className="text-xs text-muted font-medium mb-1 block">
              Height (cm)
            </label>
            <input
              id="profile-height"
              type="number"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
              placeholder="175"
            />
          </div>
          <div>
            <label htmlFor="profile-weight" className="text-xs text-muted font-medium mb-1 block">
              Weight (kg)
            </label>
            <input
              id="profile-weight"
              type="number"
              step="0.1"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
              placeholder="70"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label htmlFor="profile-activity" className="text-xs text-muted font-medium mb-1 block">
            Activity Level
          </label>
          <select
            id="profile-activity"
            value={form.activityLevel}
            onChange={(e) =>
              setForm({ ...form, activityLevel: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="very_active">Very Active (6–7 days/week)</option>
            <option value="extra_active">Extra Active (athlete)</option>
          </select>
        </div>

        {/* Goal */}
        <div>
          <label htmlFor="profile-goal" className="text-xs text-muted font-medium mb-1 block">
            Goal
          </label>
          <select
            id="profile-goal"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label htmlFor="profile-equipment" className="text-xs text-muted font-medium mb-1 flex items-center gap-1">
            <Dumbbell size={12} /> Equipment
          </label>
          <input
            id="profile-equipment"
            type="text"
            value={form.equipment}
            onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-[#101010] border border-white/15 text-sm text-white [color-scheme:dark] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
          />
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-dim/50 border border-accent/10">
          <AlertTriangle size={14} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted">
            Saving your profile automatically recalculates your diet targets
            based on your updated stats.
          </p>
        </div>

        {/* Save button */}
        <button
          id="save-profile-btn"
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold text-sm btn-press transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? "bg-success/20 text-success border border-success/30"
              : "accent-gradient text-black hover:opacity-90 shadow-lg shadow-accent/20"
          }`}
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : saved ? (
            <>
              <CheckCircle size={18} />
              Saved & Recalculated!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
