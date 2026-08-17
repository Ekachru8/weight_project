"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  weeklyCompleted: number;
  weeklyTotal: number;
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 600;
    const steps = Math.min(value, 30);
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setDisplay(Math.round((current / steps) * value));
      if (current >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{display}</span>;
}

export default function StreakBadge({
  currentStreak,
  longestStreak,
  weeklyCompleted,
  weeklyTotal,
}: StreakBadgeProps) {
  const progressPercent = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3" data-testid="streak-badge">
      {/* Current Streak */}
      <div className="glass-card p-4 text-center glow hover-lift">
        <Flame
          className={`mx-auto mb-1 text-accent ${currentStreak > 0 ? "fire-pulse" : ""}`}
          size={22}
        />
        <p className="text-3xl font-extrabold accent-text count-up-pop">
          <AnimatedNumber value={currentStreak} />
        </p>
        <p className="text-xs text-muted mt-0.5">Day Streak</p>
      </div>

      {/* Longest Streak */}
      <div className="glass-card p-4 text-center hover-lift">
        <Trophy className="mx-auto mb-1 text-yellow-500" size={22} />
        <p className="text-3xl font-extrabold text-yellow-400 count-up-pop" style={{ animationDelay: "100ms" }}>
          <AnimatedNumber value={longestStreak} />
        </p>
        <p className="text-xs text-muted mt-0.5">Best Streak</p>
      </div>

      {/* This Week with animated progress bar */}
      <div className="glass-card p-4 text-center hover-lift">
        <div className="mx-auto mb-1 w-[22px] h-[22px] rounded-full border-2 border-accent flex items-center justify-center">
          <span className="text-[10px] font-bold text-accent">
            {weeklyCompleted}
          </span>
        </div>
        <p className="text-3xl font-extrabold text-foreground count-up-pop" style={{ animationDelay: "200ms" }}>
          <AnimatedNumber value={weeklyCompleted} />
          <span className="text-lg text-muted">/{weeklyTotal}</span>
        </p>
        <p className="text-xs text-muted mt-0.5">This Week</p>
        {/* Animated progress bar */}
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full accent-gradient progress-fill-animate"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={weeklyCompleted}
            aria-valuemin={0}
            aria-valuemax={weeklyTotal}
          />
        </div>
      </div>
    </div>
  );
}
