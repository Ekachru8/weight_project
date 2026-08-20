"use client";

import { useState, useEffect, useCallback } from "react";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import WeightChart from "@/components/WeightChart";
import { Loader2, Flame, Trophy, Calendar, TrendingUp, Scale, ArrowDown, ArrowUp, Minus } from "lucide-react";

interface WorkoutLog {
  date: string;
  completed: boolean;
  dayNumber: number;
}

interface WeightEntry {
  date: string;
  weightKg: number;
}

export default function ProgressPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrationDate, setRegistrationDate] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [logsRes, weightRes, userRes] = await Promise.all([
        fetch("/api/workout-log"),
        fetch("/api/weight-log"),
        fetch("/api/user"),
      ]);
      const logsData = await logsRes.json();
      const weightData = await weightRes.json();
      const userData = await userRes.json();
      setLogs(logsData);
      setWeightLogs(weightData);
      setUser(userData);
      setRegistrationDate(userData.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logWeight = async () => {
    if (!newWeight || saving) return;
    setSaving(true);
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      await fetch("/api/weight-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, weightKg: parseFloat(newWeight) }),
      });
      setNewWeight("");
      await fetchData();
    } catch (error) {
      console.error("Failed to log weight:", error);
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const completedDays = logs.filter(
    (l) => l.completed && l.dayNumber !== 7
  ).length;
  const totalLoggedDays = logs.filter((l) => l.dayNumber !== 7).length;
  const completionRate =
    totalLoggedDays > 0
      ? Math.round((completedDays / totalLoggedDays) * 100)
      : 0;

  // Current streak
  const sortedLogs = [...logs]
    .filter((l) => l.dayNumber !== 7)
    .sort((a, b) => b.date.localeCompare(a.date));
  let currentStreak = 0;
  for (const log of sortedLogs) {
    if (log.completed) currentStreak++;
    else break;
  }

  // Longest streak
  const chronoLogs = [...logs]
    .filter((l) => l.dayNumber !== 7)
    .sort((a, b) => a.date.localeCompare(b.date));
  let longestStreak = 0;
  let tempStreak = 0;
  for (const log of chronoLogs) {
    if (log.completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // This month
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLogs = logs.filter(
    (l) => l.date.startsWith(monthStr) && l.dayNumber !== 7
  );
  const monthCompleted = monthLogs.filter((l) => l.completed).length;

  // Weight delta
  const weightDelta = weightLogs.length >= 2
    ? (weightLogs[weightLogs.length - 1].weightKg - weightLogs[0].weightKg).toFixed(1)
    : null;
  const weightDeltaNum = weightDelta ? parseFloat(weightDelta) : 0;

  // Goal progress
  let progressPct = 0;
  if (user?.weightKg && user?.targetWeightKg) {
    const diff = Math.abs(user.weightKg - user.targetWeightKg);
    progressPct = Math.max(0, Math.min(100, 100 - (diff * 5))); // Rough estimation
  }

  return (
    <div className="space-y-8 fade-in-up pb-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">Progress</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Your progress, at a glance.
        </h1>
        <p className="text-sm text-foreground/70">
          Small steps. Real progress. Consistency is what matters most.
        </p>
      </div>

      {/* Goal & Weight Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-white/5 hover-lift">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Current Weight</p>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {user?.weightKg || 0} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kg</span>
          </p>
        </div>
        <div className="glass-card p-5 border-white/5 hover-lift">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Target Weight</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-400">
            {user?.targetWeightKg || 0} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kg</span>
          </p>
        </div>
        <div className="glass-card p-5 border-white/5 hover-lift">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Total Change</p>
          <p className={`text-2xl sm:text-3xl font-black flex items-center gap-1 ${weightDeltaNum < 0 ? "text-emerald-400" : weightDeltaNum > 0 ? "text-orange-400" : "text-muted"}`}>
            {weightDeltaNum < 0 ? <ArrowDown size={18} /> : weightDeltaNum > 0 ? <ArrowUp size={18} /> : <Minus size={18} />}
            {Math.abs(weightDeltaNum)} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kg</span>
          </p>
        </div>
        <div className="glass-card p-5 border-white/5 hover-lift flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
          <div className="flex justify-between items-end mb-2 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Goal Progress</span>
            <span className="text-xs font-bold text-accent">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full accent-gradient rounded-full" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weight Chart and Logging */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border-white/5">
            <h2 className="text-lg font-bold text-foreground mb-4">Weight History</h2>
            {weightLogs.length > 0 ? (
              <WeightChart data={weightLogs} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                  <Scale className="text-muted/50" size={24} />
                </div>
                <p className="text-sm font-medium text-foreground/80 mb-1">No entries yet</p>
                <p className="text-xs text-muted max-w-sm">Your progress history will appear here after your first check-in.</p>
              </div>
            )}
          </div>

          <div className="glass-card p-6 border-white/5">
            <h2 className="text-lg font-bold text-foreground mb-4">Workout Consistency</h2>
            <CalendarHeatmap logs={logs} registrationDate={registrationDate} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-white/5">
            <h2 className="text-lg font-bold text-foreground mb-4">Log Today&apos;s Weight</h2>
            <p className="text-xs text-muted mb-4">Record your weight to keep your progress chart up to date.</p>
            <div className="flex gap-2">
              <input
                id="weight-input"
                type="number"
                step="0.1"
                placeholder="Weight in kg"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200"
              />
              <button
                id="log-weight-btn"
                onClick={logWeight}
                disabled={!newWeight || saving}
                className="px-6 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-foreground text-sm font-bold btn-press disabled:opacity-50 transition-all hover:bg-white/[0.1] flex items-center justify-center min-w-[80px]"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6 border-white/5">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Entries</h2>
            {weightLogs.length > 0 ? (
              <div className="space-y-1">
                {[...weightLogs].reverse().slice(0, 5).map((log, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-muted font-medium">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-sm font-bold text-foreground">{log.weightKg} kg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted py-4 text-center">No recent entries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
