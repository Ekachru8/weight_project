"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, Dumbbell, Zap, CircleDot, X, Frown } from "lucide-react";

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

const DAY_FILTERS = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("All");
  const [muscleFilter, setMuscleFilter] = useState("All");

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch("/api/exercises");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, []);

  const muscleGroups = useMemo(() => {
    const groups = new Set(exercises.map((e) => e.muscleGroup));
    return ["All", ...Array.from(groups).sort()];
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(search.toLowerCase()) ||
        e.equipment.toLowerCase().includes(search.toLowerCase());
      const matchesDay = dayFilter === "All" || e.dayName === dayFilter;
      const matchesMuscle =
        muscleFilter === "All" || e.muscleGroup === muscleFilter;
      return matchesSearch && matchesDay && matchesMuscle;
    });
  }, [exercises, search, dayFilter, muscleFilter]);

  const getEquipmentIcon = (eq: string) => {
    switch (eq.toLowerCase()) {
      case "dumbbells":
        return <Dumbbell size={14} className="text-accent" />;
      case "resistance band":
        return <Zap size={14} className="text-yellow-400" />;
      case "bodyweight":
        return <CircleDot size={14} className="text-blue-400" />;
      default:
        return <CircleDot size={14} className="text-muted" />;
    }
  };

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
          Exercise Library
        </h1>
        <p className="text-sm text-muted">
          {exercises.length} exercises across 6 training days
        </p>
      </div>

      {/* Search */}
      <div className="relative fade-in-up opacity-0 delay-100">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          size={16}
        />
        <input
          id="exercise-search"
          type="text"
          placeholder="Search exercises, muscles, or equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Day filter */}
      <div className="pill-scroll fade-in-up opacity-0 delay-200">
        {DAY_FILTERS.map((day) => (
          <button
            key={day}
            onClick={() => setDayFilter(day)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 btn-press ${
              dayFilter === day
                ? "accent-gradient text-black shadow-sm shadow-accent/20"
                : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Muscle group filter */}
      {muscleGroups.length > 2 && (
        <div className="pill-scroll fade-in-up opacity-0 delay-300">
          {muscleGroups.map((mg) => (
            <button
              key={mg}
              onClick={() => setMuscleFilter(mg)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all duration-200 ${
                muscleFilter === mg
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-card/50 border border-border text-muted hover:text-foreground"
              }`}
            >
              {mg}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-muted">
        Showing {filtered.length} of {exercises.length} exercises
      </p>

      {/* Exercise grid with staggered entrance */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((ex, i) => (
          <div
            key={ex.id}
            className="glass-card p-4 hover-lift fade-in-up opacity-0"
            style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg number-badge flex items-center justify-center flex-shrink-0 mt-0.5">
                {getEquipmentIcon(ex.equipment)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  {ex.name}
                </h3>
                <p className="text-[10px] text-muted mt-0.5 leading-relaxed">
                  {ex.formCue}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-dim text-accent">
                    {ex.sets}×{ex.reps}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-muted">
                    {ex.muscleGroup}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-muted">
                    Day {ex.dayNumber} — {ex.dayName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced empty state */}
      {filtered.length === 0 && (
        <div className="glass-card p-8 text-center fade-in-up">
          <Frown className="mx-auto mb-3 text-muted" size={40} />
          <p className="text-foreground font-semibold text-sm mb-1">
            No exercises found
          </p>
          <p className="text-muted text-xs">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => { setSearch(""); setDayFilter("All"); setMuscleFilter("All"); }}
            className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium accent-gradient text-black btn-press"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
