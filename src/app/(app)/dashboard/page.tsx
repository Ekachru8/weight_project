"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
        <div className="glass-card p-6 h-96 skeleton" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-4 h-32 skeleton" />
          <div className="glass-card p-4 h-32 skeleton" />
          <div className="glass-card p-4 h-32 skeleton" />
        </div>
      </div>
    );
  }

  if (!todayData) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="space-y-8 lg:space-y-12 relative pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        variants={itemVariants}
        className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group aspect-video sm:aspect-auto sm:h-[400px] lg:h-[500px]"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-transparent to-[#030303]/80 z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
            src="https://assets.mixkit.co/videos/preview/mixkit-man-working-out-with-a-kettlebell-in-the-gym-14456-large.mp4"
          />
        </div>
        
        <div className="absolute inset-0 z-20 p-8 sm:p-12 lg:p-16 flex flex-col justify-end items-start text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass-card flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(192,255,0,0.4)]"
          >
            <span className="text-2xl sm:text-3xl">{greeting.emoji}</span>
          </motion.div>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-accent uppercase mb-3 drop-shadow-md">
            {greeting.text}
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
            {todayData.isRestDay ? "Rest & Recover" : `Day ${todayData.dayNumber} — ${todayData.dayName}`}
          </h1>
          
          {!todayData.isRestDay && (
            <p className="text-gray-300 text-sm sm:text-lg mb-8 max-w-xl font-medium drop-shadow-md">
              You have {todayData.exercises.length} exercises lined up today. Prepare your mind and body to push the limits.
            </p>
          )}

          {todayData.isCompleted ? (
            <div className="flex items-center gap-3 text-accent font-black text-lg bg-accent/10 px-8 py-4 rounded-full border border-accent/30 backdrop-blur-md">
              <CalendarCheck size={24} />
              Workout Complete
            </div>
          ) : (
            <Link 
              href="/exercises" 
              className="group/btn relative inline-flex items-center justify-center px-10 py-5 font-black text-lg sm:text-xl text-black bg-accent rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_50px_rgba(192,255,0,0.5)] hover:shadow-[0_0_80px_rgba(192,255,0,0.7)] hover:scale-105"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              <Play size={24} className="mr-3 fill-black" />
              <span>Start Workout</span>
            </Link>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-muted">
            Your Progress
          </h2>
          <div className="h-[1px] flex-1 bg-border ml-6"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Flame className="text-accent mb-4 group-hover:animate-pulse" size={36} />
            <span className="text-4xl sm:text-5xl font-black text-foreground drop-shadow-[0_0_15px_rgba(192,255,0,0.4)]">{currentStreak}</span>
            <span className="text-xs sm:text-sm text-muted font-bold uppercase tracking-widest mt-2">Day Streak</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Trophy className="text-yellow-500 mb-4 group-hover:-translate-y-1 transition-transform" size={36} />
            <span className="text-4xl sm:text-5xl font-black text-foreground drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">{longestStreak}</span>
            <span className="text-xs sm:text-sm text-muted font-bold uppercase tracking-widest mt-2">Best Streak</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <svg className="w-14 h-14 sm:w-16 sm:h-16 mb-2 -rotate-90" viewBox="0 0 36 36">
                <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${(weeklyCompleted / 6) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pb-2">
                <span className="text-lg font-black">{weeklyCompleted}</span>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-muted font-bold uppercase tracking-widest mt-2">This Week</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
