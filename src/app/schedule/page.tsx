"use client";

import { useState, useEffect } from "react";
import DayPill from "@/components/DayPill";
import { Loader2, Dumbbell, Zap, CircleDot, Battery, Star } from "lucide-react";

interface Exercise {
  id: number;
  dayNumber: number;
  dayName: string;
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  muscleGroup: string;
  formCue: string;
}

const DAYS = [
  { number: 1, name: "Chest" },
  { number: 2, name: "Back" },
  { number: 3, name: "Legs" },
  { number: 4, name: "Shoulders" },
  { number: 5, name: "Arms" },
  { number: 6, name: "Core" },
  { number: 7, name: "Rest" },
];

export default function SchedulePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [todayDayNumber, setTodayDayNumber] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const [exercisesRes, todayRes] = await Promise.all([
          fetch("/api/exercises"),
          fetch("/api/today"),
        ]);
        const exData = await exercisesRes.json();
        const todayData = await todayRes.json();
        setExercises(exData);
        setTodayDayNumber(todayData.dayNumber);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getEquipmentIcon = (eq: string) => {
    switch (eq.toLowerCase()) {
      case "dumbbells":
        return <Dumbbell size={12} />;
      case "resistance band":
        return <Zap size={12} />;
      default:
        return <CircleDot size={12} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const filteredExercises = selectedDay
    ? exercises.filter((e) => e.dayNumber === selectedDay)
    : exercises;

  return (
    <div className="space-y-6">
      <div className="fade-in-up">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Weekly Schedule
        </h1>
        <p className="text-sm text-muted">
          Your 6-day split + rest day rotation
        </p>
      </div>

      {/* Day pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 fade-in-up opacity-0 delay-100">
        <button
          onClick={() => setSelectedDay(null)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap btn-press ${
            selectedDay === null
              ? "accent-gradient text-black shadow-sm shadow-accent/20"
              : "glass-card text-muted hover:text-foreground"
          }`}
        >
          All Days
        </button>
        {DAYS.map((day) => (
          <DayPill
            key={day.number}
            dayNumber={day.number}
            dayName={day.name}
            isActive={selectedDay === day.number}
            isToday={day.number === todayDayNumber}
            onClick={() => setSelectedDay(day.number)}
          />
        ))}
      </div>

      {/* Schedule content with smooth transitions */}
      <div className="space-y-6 fade-in-up opacity-0 delay-200">
        {selectedDay === 7 || (selectedDay === null && false) ? null : null}
        {DAYS.filter((d) =>
          selectedDay ? d.number === selectedDay : true
        ).map((day) => {
          const dayExercises = filteredExercises.filter(
            (e) => e.dayNumber === day.number
          );
          const isToday = day.number === todayDayNumber;

          if (day.number === 7) {
            return (
              <div key={day.number} className={`glass-card p-6 hover-lift ${isToday ? "ring-1 ring-accent/30" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Battery className="text-blue-400" size={20} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Day 7 — Rest
                      </h2>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">Active Recovery</p>
                  </div>
                </div>
                <p className="text-sm text-muted">
                  Stretching and mobility flow on the mat, or a light walk.
                  No streak penalty.
                </p>
              </div>
            );
          }

          return (
            <div key={day.number} className={`glass-card p-4 hover-lift ${isToday ? "ring-1 ring-accent/30" : ""}`}>
              <div className="flex items-center gap-3 mb-3">
                <DayPill
                  dayNumber={day.number}
                  dayName={day.name}
                  isToday={isToday}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted">
                      {dayExercises.length} exercises •{" "}
                      {dayExercises.reduce((s, e) => s + e.sets, 0)} sets
                    </p>
                    {isToday && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent">
                        <Star size={10} /> Today
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {dayExercises.map((ex, i) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 group hover:bg-white/[0.02] rounded-lg transition-colors px-1 -mx-1"
                  >
                    <span className="text-accent text-xs font-bold w-5 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ex.name}
                      </p>
                      <p className="text-[10px] text-muted">{ex.formCue}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted flex items-center gap-0.5">
                        {getEquipmentIcon(ex.equipment)}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-dim text-accent whitespace-nowrap">
                        {ex.sets}×{ex.reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
