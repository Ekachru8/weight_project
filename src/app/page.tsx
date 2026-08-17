"use client";

import { useState, useEffect, useCallback } from "react";
import WorkoutCard from "@/components/WorkoutCard";
import StreakBadge from "@/components/StreakBadge";
import DayPill from "@/components/DayPill";
import { Check, Battery, Loader2, Sparkles } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  muscleGroup: string;
  formCue: string;
}

interface TodayData {
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  exercises: Exercise[];
  isCompleted: boolean;
  date: string;
}

interface WorkoutLog {
  date: string;
  completed: boolean;
  dayNumber: number;
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 6) return { text: "Late night grind", emoji: "🌙" };
  if (hour < 12) return { text: "Good morning", emoji: "🌅" };
  if (hour < 17) return { text: "Good afternoon", emoji: "☀️" };
  if (hour < 21) return { text: "Good evening", emoji: "🌆" };
  return { text: "Let's crush it tonight", emoji: "🌙" };
}

export default function Dashboard() {
  const [todayData, setTodayData] = useState<TodayData | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [todayRes, logsRes] = await Promise.all([
        fetch("/api/today"),
        fetch("/api/workout-log"),
      ]);
      const today = await todayRes.json();
      const logsData = await logsRes.json();
      setTodayData(today);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markComplete = async () => {
    if (!todayData || marking) return;
    setMarking(true);
    try {
      await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayData.date,
          dayNumber: todayData.dayNumber,
          completed: true,
        }),
      });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      await fetchData();
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setMarking(false);
    }
  };

  // Calculate streaks from logs
  const currentStreak = calculateSimpleStreak(logs);
  const longestStreak = calculateSimpleLongest(logs);
  const weeklyCompleted = logs.filter((l) => {
    const logDate = new Date(l.date);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return l.completed && logDate >= weekAgo && l.dayNumber !== 7;
  }).length;

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton hero */}
        <div className="glass-card p-6">
          <div className="skeleton h-4 w-32 mb-3" />
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-40" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
        </div>
        {/* Skeleton cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4">
            <div className="skeleton h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!todayData) return null;

  return (
    <div className="space-y-6 relative">
      {/* Confetti celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 20}%`,
                backgroundColor: ["#a3e635", "#38bdf8", "#fb923c", "#f472b6", "#a78bfa"][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.8 + Math.random() * 0.8}s`,
              }}
            />
          ))}
          <div className="text-4xl celebrate-scale">🎉</div>
        </div>
      )}

      {/* Hero Section with greeting */}
      <div className="fade-in-up">
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 accent-gradient rounded-full blur-3xl opacity-20 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-500 rounded-full blur-3xl opacity-10 translate-y-8 -translate-x-8" />
          <p className="text-sm text-muted mb-2 flex items-center gap-1.5">
            <span>{greeting.emoji}</span>
            <span>{greeting.text}</span>
          </p>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">
            Today&apos;s Focus
          </p>
          <div className="flex items-center gap-3 mb-2">
            <DayPill
              dayNumber={todayData.dayNumber}
              dayName={todayData.dayName}
              isToday
            />
          </div>
          <h1 className="text-3xl font-extrabold accent-text">
            {todayData.isRestDay ? "Rest & Recover" : `Day ${todayData.dayNumber} — ${todayData.dayName}`}
          </h1>
          {!todayData.isRestDay && (
            <p className="text-sm text-muted mt-1">
              {todayData.exercises.length} exercises •{" "}
              {todayData.exercises.reduce((s, e) => s + e.sets, 0)} total sets
            </p>
          )}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="fade-in-up opacity-0 delay-100">
        <StreakBadge
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          weeklyCompleted={weeklyCompleted}
          weeklyTotal={6}
        />
      </div>

      {/* Exercises or Rest Day */}
      {todayData.isRestDay ? (
        <div className="glass-card p-8 text-center fade-in-up opacity-0 delay-200">
          <Battery className="mx-auto mb-3 text-blue-400" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">Rest Day</h2>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Take it easy today. Do some stretching, mobility work on the mat, or
            go for a walk. No streak penalty for rest days! 🧘
          </p>
        </div>
      ) : (
        <div className="space-y-3 fade-in-up opacity-0 delay-200">
          {todayData.exercises.map((exercise, index) => (
            <WorkoutCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
      )}

      {/* Mark Complete Button */}
      {!todayData.isRestDay && (
        <div className="sticky bottom-20 md:bottom-4 z-40 fade-in-up opacity-0 delay-300">
          <button
            id="mark-complete-btn"
            onClick={markComplete}
            disabled={todayData.isCompleted || marking}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 btn-press flex items-center justify-center gap-2 ${
              todayData.isCompleted
                ? "bg-success/20 text-success border border-success/30 cursor-default"
                : "accent-gradient text-black hover:opacity-90 shadow-lg shadow-accent/20 hover:shadow-accent/30"
            }`}
          >
            {marking ? (
              <Loader2 className="animate-spin" size={20} />
            ) : todayData.isCompleted ? (
              <>
                <Sparkles size={20} />
                Completed! 💪
              </>
            ) : (
              <>
                <Check size={20} />
                Mark Today Complete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Simple streak calculation (client-side approximation)
function calculateSimpleStreak(logs: WorkoutLog[]): number {
  const sortedLogs = [...logs]
    .filter((l) => l.dayNumber !== 7)
    .sort((a, b) => b.date.localeCompare(a.date));

  let streak = 0;
  for (const log of sortedLogs) {
    if (log.completed) streak++;
    else break;
  }
  return streak;
}

function calculateSimpleLongest(logs: WorkoutLog[]): number {
  const sortedLogs = [...logs]
    .filter((l) => l.dayNumber !== 7)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let current = 0;
  for (const log of sortedLogs) {
    if (log.completed) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}
