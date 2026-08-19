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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="fade-in-up">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1">
          Progress
        </h1>
        <p className="text-sm text-muted">
          Track your consistency and weight trend
        </p>
      </div>

      {/* Stats grid with animated counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-in-up opacity-0 delay-100">
        <div className="glass-card p-4 text-center hover-lift">
          <Flame className="mx-auto mb-1 text-accent" size={18} />
          <p className="text-2xl font-extrabold accent-text count-up-pop">{currentStreak}</p>
          <p className="text-[10px] text-muted">Current Streak</p>
        </div>
        <div className="glass-card p-4 text-center hover-lift">
          <Trophy className="mx-auto mb-1 text-yellow-500" size={18} />
          <p className="text-2xl font-extrabold text-yellow-400 count-up-pop" style={{ animationDelay: "100ms" }}>
            {longestStreak}
          </p>
          <p className="text-[10px] text-muted">Best Streak</p>
        </div>
        <div className="glass-card p-4 text-center hover-lift">
          <Calendar className="mx-auto mb-1 text-blue-400" size={18} />
          <p className="text-2xl font-extrabold text-blue-400 count-up-pop" style={{ animationDelay: "200ms" }}>
            {monthCompleted}
          </p>
          <p className="text-[10px] text-muted">This Month</p>
        </div>
        <div className="glass-card p-4 text-center hover-lift">
          <TrendingUp className="mx-auto mb-1 text-emerald-400" size={18} />
          <p className="text-2xl font-extrabold text-emerald-400 count-up-pop" style={{ animationDelay: "300ms" }}>
            {completionRate}%
          </p>
          <p className="text-[10px] text-muted">All-Time Rate</p>
        </div>
      </div>

      {/* Weight delta badge */}
      {weightDelta !== null && (
        <div className="fade-in-up opacity-0 delay-200">
          <div className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-muted" />
              <span className="text-xs text-muted">Weight Change</span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${
              weightDeltaNum < 0 ? "text-blue-400" : weightDeltaNum > 0 ? "text-emerald-400" : "text-muted"
            }`}>
              {weightDeltaNum < 0 ? <ArrowDown size={14} /> : weightDeltaNum > 0 ? <ArrowUp size={14} /> : <Minus size={14} />}
              {weightDeltaNum > 0 ? "+" : ""}{weightDelta} kg
            </div>
          </div>
        </div>
      )}

      {/* Calendar Heatmap */}
      <div className="fade-in-up opacity-0 delay-200">
        <CalendarHeatmap logs={logs} registrationDate={registrationDate} />
      </div>

      {/* Weight Logging */}
      <div className="fade-in-up opacity-0 delay-300">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scale size={16} className="text-accent" />
            <h3 className="text-sm font-semibold text-foreground">
              Log Weight
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              id="weight-input"
              type="number"
              step="0.1"
              placeholder="Weight in kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
            />
            <button
              id="log-weight-btn"
              onClick={logWeight}
              disabled={!newWeight || saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-b from-accent/20 to-accent/5 text-accent border border-accent/20 ring-1 ring-accent shadow-sm shadow-accent/10 text-sm font-semibold btn-press disabled:opacity-50 transition-all hover:bg-white/[0.02]"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Log"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Weight Trend Chart */}
      <div className="fade-in-up opacity-0 delay-400">
        <WeightChart data={weightLogs} />
      </div>
    </div>
  );
}
