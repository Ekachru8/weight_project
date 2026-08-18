"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DayPill from "@/components/DayPill";
import { Loader2, Play, Flame, Trophy, CalendarCheck } from "lucide-react";

interface TodayData {
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  exercises: any[];
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

  const fetchData = useCallback(async () => {
    try {
      const localNow = new Date();
      const localDateStr = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")}`;

      const [todayRes, logsRes] = await Promise.all([
        fetch(`/api/today?localDate=${localDateStr}`),
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

  const calculateSimpleStreak = (logs: WorkoutLog[]) => {
    if (!logs.length) return 0;
    const sorted = [...logs]
      .filter((l) => l.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!sorted.length) return 0;
    let streak = 1;
    let currDate = new Date(sorted[0].date);
    for (let i = 1; i < sorted.length; i++) {
      const prevDate = new Date(sorted[i].date);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak++;
        currDate = prevDate;
      } else if (diffDays > 1) {
        break;
      }
    }
    return streak;
  };

  const calculateSimpleLongest = (logs: WorkoutLog[]) => {
    if (!logs.length) return 0;
    const sorted = [...logs]
      .filter((l) => l.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (!sorted.length) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.floor(
        (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays === 1) current++;
      else if (diffDays > 1) current = 1;
      if (current > longest) longest = current;
    }
    return longest;
  };

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
        <div className="glass-card p-6 h-64 skeleton" />
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
          <div className="glass-card p-4"><div className="skeleton h-12 w-full" /></div>
        </div>
      </div>
    );
  }

  if (!todayData) return null;

  return (
    <div className="space-y-8 relative pb-20">
      <div className="relative fade-in-up rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-1000"
            src="https://assets.mixkit.co/videos/preview/mixkit-man-working-out-with-a-kettlebell-in-the-gym-14456-large.mp4"
          />
        </div>
        
        <div className="relative z-20 p-8 sm:p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(192,255,0,0.3)]">
            <span className="text-3xl">{greeting.emoji}</span>
          </div>
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-2">
            {greeting.text}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-xl">
            {todayData.isRestDay ? "Rest & Recover" : `Day ${todayData.dayNumber} — ${todayData.dayName}`}
          </h1>
          
          {!todayData.isRestDay && (
            <p className="text-muted text-sm sm:text-base mb-8 max-w-md">
              You have {todayData.exercises.length} exercises lined up today. Prepare your mind and body.
            </p>
          )}

          {todayData.isCompleted ? (
            <div className="flex items-center gap-2 text-accent font-bold bg-accent/10 px-6 py-3 rounded-full border border-accent/20">
              <CalendarCheck size={20} />
              Workout Complete
            </div>
          ) : (
            <Link 
              href="/exercises" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-accent rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(192,255,0,0.4)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <Play size={20} className="mr-2 fill-black" />
              <span>Start Workout</span>
            </Link>
          )}
        </div>
      </div>

      <div className="fade-in-up opacity-0 delay-100">
        <h2 className="text-sm uppercase tracking-widest text-muted mb-3 font-bold pl-1">
          Your Progress
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center hover-lift relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Flame className="text-accent mb-2" size={24} />
            <span className="text-2xl font-black text-foreground drop-shadow-[0_0_10px_rgba(192,255,0,0.3)]">{currentStreak}</span>
            <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Day Streak</span>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center hover-lift relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trophy className="text-yellow-500 mb-2" size={24} />
            <span className="text-2xl font-black text-foreground drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{longestStreak}</span>
            <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Best Streak</span>
          </div>

          <div className="glass-card p-4 flex flex-col items-center justify-center text-center hover-lift relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <svg className="w-8 h-8 mb-2 -rotate-90" viewBox="0 0 36 36">
                <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${(weeklyCompleted / 6) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <span className="text-2xl font-black text-foreground">{weeklyCompleted}<span className="text-sm text-muted">/6</span></span>
            <span className="text-[10px] text-muted uppercase tracking-wider mt-1">This Week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
