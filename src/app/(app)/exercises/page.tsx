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
  const [todayData, setTodayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("All");
  const [muscleFilter, setMuscleFilter] = useState("All");
  
  // Tabs: 'today' | 'library'
  const [activeTab, setActiveTab] = useState<"today" | "library">("today");
  const [marking, setMarking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const localNow = new Date();
        const localDateStr = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")}`;

        const [exercisesRes, todayRes] = await Promise.all([
          fetch("/api/exercises"),
          fetch(`/api/today?localDate=${localDateStr}`)
        ]);
        const exData = await exercisesRes.json();
        const tData = await todayRes.json();
        setExercises(exData);
        setTodayData(tData);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      setTodayData({ ...todayData, isCompleted: true });
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setMarking(false);
    }
  };

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

  const confettiParticles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${20 + Math.random() * 60}%`,
    top: `${30 + Math.random() * 20}%`,
    backgroundColor: ["#a3e635", "#38bdf8", "#fb923c", "#f472b6", "#a78bfa"][i % 5],
    animationDelay: `${Math.random() * 0.5}s`,
    animationDuration: `${0.8 + Math.random() * 0.8}s`,
  })), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="confetti-particle"
              style={{
                left: particle.left,
                top: particle.top,
                backgroundColor: particle.backgroundColor,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
          <div className="text-4xl celebrate-scale">🎉</div>
        </div>
      )}

      <div className="fade-in-up">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1">
          Exercises
        </h1>
        <p className="text-sm text-muted">
          Your daily workout and complete library
        </p>
      </div>

      <div className="flex gap-2 p-1 bg-card rounded-xl border border-border fade-in-up opacity-0 delay-100">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "today" ? "accent-gradient text-black shadow-md" : "text-muted hover:text-foreground"
          }`}
        >
          Today's Workout
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "library" ? "accent-gradient text-black shadow-md" : "text-muted hover:text-foreground"
          }`}
        >
          Full Library
        </button>
      </div>

      {activeTab === "today" && todayData && (
        <div className="space-y-4 fade-in-up">
          {todayData.isRestDay ? (
            <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
              <Zap className="text-accent mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2">Rest Day</h2>
              <p className="text-muted">Take time to recover and hydrate.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold">Day {todayData.dayNumber} — {todayData.dayName}</h2>
                <p className="text-sm text-muted">{todayData.exercises.length} exercises to crush today.</p>
              </div>

              {todayData.exercises.map((ex: any, i: number) => (
                <div key={ex.id} className="glass-card p-4 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg number-badge flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-black">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-foreground mb-1">{ex.name}</h3>
                      <p className="text-xs text-muted mb-3 leading-relaxed">{ex.formCue}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-accent/20 text-accent border border-accent/20">
                          {ex.sets} × {ex.reps}
                        </span>
                        <span className="text-xs flex items-center gap-1.5 text-muted bg-card px-2 py-1 rounded-md border border-border">
                          {getEquipmentIcon(ex.equipment)} {ex.equipment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!todayData.isCompleted ? (
                <button
                  onClick={markComplete}
                  disabled={marking}
                  className="w-full mt-6 py-4 rounded-xl accent-gradient text-black font-extrabold text-lg flex items-center justify-center gap-2 hover-lift shadow-[0_0_20px_rgba(192,255,0,0.3)] disabled:opacity-50 transition-all btn-press"
                >
                  {marking ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Zap size={24} className="fill-black" />
                      Mark Today Complete
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full mt-6 py-4 rounded-xl glass-card border-accent/50 text-accent font-bold text-center flex items-center justify-center gap-2">
                  <Zap size={20} className="fill-accent" />
                  Workout Completed!
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "library" && (
        <div className="space-y-6 fade-in-up">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
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
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="pill-scroll">
            {DAY_FILTERS.map((day) => (
              <button
                key={day}
                onClick={() => setDayFilter(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 btn-press ${
                  dayFilter === day ? "accent-gradient text-black shadow-sm shadow-accent/20" : "bg-card border border-border text-muted hover:text-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((ex, i) => (
              <div key={ex.id} className="glass-card p-4 hover-lift">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg number-badge flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getEquipmentIcon(ex.equipment)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
                    <p className="text-[10px] text-muted mt-0.5 leading-relaxed">{ex.formCue}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-dim text-accent">{ex.sets}×{ex.reps}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-muted">{ex.muscleGroup}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Frown className="mx-auto mb-3 text-muted" size={40} />
              <p className="text-foreground font-semibold text-sm mb-1">No exercises found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
