"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, Search, Dumbbell, Zap, CircleDot, Flame, Trophy, Play, CheckCircle2, X, Clock, AlertTriangle, Info, Activity, Volume2, VolumeX, FileText, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { weeklyWorkoutSchedule } from "@/lib/workout-schedule";
import { FitnessAssistant, FitnessReadiness } from "@/components/FitnessAssistant";
import { ExerciseCard, type Exercise } from "@/components/ExerciseCard";
import { ExerciseModal } from "@/components/ExerciseModal";
import { EXERCISES } from "@/data/exercises";
import { EXERCISE_ASSETS } from "@/data/exercise-assets";


interface WorkoutLog {
  date: string;
  completed: boolean;
  dayNumber: number;
}

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Glutes", "Shoulders", "Arms", "Core", "Full Body", "Cardio", "Mobility"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const EQUIPMENT_TYPES = ["All", "Bodyweight", "Dumbbells", "Resistance Band", "Chair", "Mat", "Pull-up Bar"];
const MOVEMENT_PATTERNS = ["All", "Push", "Pull", "Squat", "Hinge", "Lunge", "Core", "Carry", "Isolation", "Cardio"];
const SORT_OPTIONS = ["Recommended", "Beginner friendly", "Shortest workout", "Most popular"];

const getEquipmentIcon = (eq: string) => {
  switch (eq.toLowerCase()) {
    case "dumbbells": return <Dumbbell size={14} className="text-accent" />;
    case "resistance band": return <Zap size={14} className="text-yellow-400" />;
    case "bodyweight": return <CircleDot size={14} className="text-blue-400" />;
    case "mat": return <CircleDot size={14} className="text-emerald-400" />;
    case "chair": return <CircleDot size={14} className="text-orange-400" />;
    case "pull-up bar": return <Dumbbell size={14} className="text-red-400" />;
    default: return <CircleDot size={14} className="text-muted" />;
  }
};

const getDifficultyColor = (diff: string) => {
  switch (diff.toLowerCase()) {
    case "beginner": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "advanced": return "text-red-400 bg-red-400/10 border-red-400/20";
    default: return "text-muted bg-white/5 border-white/10";
  }
};

function InlineTimer({ defaultSeconds = 60 }: { defaultSeconds?: number }) {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft === 0) setTimeLeft(defaultSeconds);
    setIsActive(!isActive);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <button 
      onClick={toggle} 
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-press border ${
        isActive 
          ? 'bg-accent/20 text-accent border-accent/30 shadow-[0_0_10px_rgba(192,255,0,0.2)]' 
          : 'bg-white/5 hover:bg-white/10 text-muted border-transparent'
      }`}
    >
      {isActive ? <Play size={12} className="animate-pulse" /> : <Clock size={12} />}
      <span>{formatted}</span>
    </button>
  );
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [todayData, setTodayData] = useState<any>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fitnessReadiness, setFitnessReadiness] = useState<FitnessReadiness | null>(null);
  const [assistantState, setAssistantState] = useState<'loading' | 'chat' | 'ready_card' | 'workout'>('loading');
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  
  // Library Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [movementTypeFilter, setMovementTypeFilter] = useState("All");
  const [audioOnly, setAudioOnly] = useState(false);
  const [noEquipmentOnly, setNoEquipmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  
  const [activeTab, setActiveTab] = useState<"today" | "library">("today");
  const [marking, setMarking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [audioState, setAudioState] = useState<'loading' | 'ready' | 'error'>('ready');
  const [completedExIds, setCompletedExIds] = useState<Set<number>>(new Set());
  
  // Audio controls state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSelectExercise = async (ex: Exercise) => {
    setSelectedExercise(ex);
    setIsPlayingAudio(false);
    setShowTranscript(false);
    setAudioProgress(0);
    
    // Check if audioUrl is already ready
    if (ex.audioStatus === "ready" && Boolean(ex.audioUrl)) {
      setAudioState('ready');
    } else {
      fetchAudio(ex);
    }
  };

  const fetchAudio = async (ex: Exercise) => {
    setAudioState('loading');
    try {
      const res = await fetch('/api/exercises/audio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseSlug: ex.slug })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setAudioState('error');
        return;
      }

      if (data.audioStatus === 'ready' && data.audioUrl) {
         setSelectedExercise(prev => prev?.slug === ex.slug ? { ...prev, audioUrl: data.audioUrl, audioStatus: 'ready', transcript: data.transcript } : prev);
         setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, audioUrl: data.audioUrl, audioStatus: 'ready', transcript: data.transcript } : p));
         setAudioState('ready');
         return;
      }

      if (data.jobId) {
        // Start polling
        const poll = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/exercises/audio/status/${data.jobId}`);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'ready' && statusData.audioUrl) {
              clearInterval(poll);
              setSelectedExercise(prev => prev?.slug === ex.slug ? { ...prev, audioUrl: statusData.audioUrl, audioStatus: 'ready', transcript: statusData.transcript } : prev);
              setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, audioUrl: statusData.audioUrl, audioStatus: 'ready', transcript: statusData.transcript } : p));
              setAudioState('ready');
            } else if (statusData.status === 'failed') {
              clearInterval(poll);
              setSelectedExercise(prev => prev?.slug === ex.slug ? { ...prev, audioStatus: 'failed' } : prev);
              setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, audioStatus: 'failed' } : p));
              setAudioState('error');
            } else {
              // queued, generating, processing
              setSelectedExercise(prev => prev?.slug === ex.slug ? { ...prev, audioStatus: statusData.status } : prev);
              setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, audioStatus: statusData.status } : p));
            }
          } catch (e) {
            clearInterval(poll);
            setAudioState('error');
          }
        }, 3000); // Poll every 3 seconds
      } else {
         setAudioState('error');
      }
    } catch (err) {
      setAudioState('error');
    }
  };

  const toggleExercise = (id: number) => {
    setCompletedExIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allExercisesCompleted = todayData?.exercises?.length > 0 && completedExIds.size === todayData.exercises.length;

  const fetchData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const localWeekday = new Date().getDay();
      const [exercisesRes, todayRes, logsRes, readinessRes] = await Promise.all([
        fetch("/api/exercises"),
        fetch(`/api/today?weekday=${localWeekday}`),
        fetch("/api/workout-log"),
        fetch("/api/user/readiness"),
      ]);
      
      const exData = await exercisesRes.json();
      const logsData = await logsRes.json();
      
      let readinessData = null;
      if (readinessRes.ok) {
         const r = await readinessRes.json();
         if (r.fitnessReadiness) readinessData = r.fitnessReadiness;
      }
      setFitnessReadiness(readinessData);
      
      if (!readinessData) {
        setAssistantState('chat');
      } else {
        setAssistantState('ready_card');
      }

      // 1. PRESERVE THE COMPLETE EXERCISE CATALOG
      const allExercises = EXERCISES;
      const exercisesWithMedia = allExercises.map((ex) => {
        const asset = EXERCISE_ASSETS[ex.slug];
        return {
          ...ex,
          audioUrl: asset?.voiceoverUrl || null,
          audioStatus: asset?.status || "not_started",
          transcript: asset?.transcript || undefined,
          imageUrl: asset?.photoUrl || null,
          imageAlt: asset?.photoAlt || undefined,
          imageStatus: asset?.photoUrl ? "ready" : "unavailable",
          imageExerciseSlug: asset?.photoUrl ? ex.slug : undefined,
          imageSource: (asset?.photoSource as any) || undefined,
        } as Exercise;
      });

      setExercises(exercisesWithMedia);
      
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Catalog Health] Loaded ${exercisesWithMedia.length} exercises from trusted catalog.`);
      }

      if (Array.isArray(logsData)) setLogs(logsData);

      let td = null;
      if (todayRes.ok) {
        const rawTd = await todayRes.json();
        if (!rawTd.error) td = rawTd;
      }

      if (!td) {
        // Fallback logic
        const schedule = weeklyWorkoutSchedule[localWeekday];
        if (schedule) {
          const isRestDay = localWeekday === 0;
          let fallbackExercises: any[] = [];
          if (!isRestDay && schedule.exercises) {
            fallbackExercises = schedule.exercises
              .map(slug => exercisesWithMedia.find(ex => ex.slug === slug))
              .filter(Boolean);
          }
          
          td = {
            dayNumber: localWeekday,
            dayName: schedule.day,
            title: schedule.title,
            isRestDay,
            exercises: fallbackExercises,
            isCompleted: false,
            isLogged: false,
            date: new Date().toISOString().split('T')[0]
          };
        } else {
          setHasError(true);
        }
      }
      setTodayData(td);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteReadiness = async (profile: FitnessReadiness) => {
    setAssistantState('loading');
    try {
      await fetch('/api/user/readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitnessReadiness: profile })
      });
      setFitnessReadiness(profile);
      generatePersonalizedWorkout(profile);
    } catch (err) {
      console.error(err);
      setAssistantState('chat');
    }
  };

  const generatePersonalizedWorkout = async (profile: FitnessReadiness) => {
    setGeneratingWorkout(true);
    setAssistantState('workout');
    try {
      const localWeekday = new Date().getDay();
      const res = await fetch('/api/today/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitnessReadiness: profile,
          todaySchedule: weeklyWorkoutSchedule[localWeekday],
          availableExercises: exercises
        })
      });
      const data = await res.json();
      if (res.ok && !data.error) {
         const mappedExercises = data.exercises.map((aiEx: any) => {
            const base = exercises.find(e => e.slug === aiEx.exerciseSlug);
            return {
              ...base,
              sets: aiEx.sets,
              reps: aiEx.reps,
              description: aiEx.modification, // override description with modification
              formCues: [aiEx.formCue] // override form cue
            };
         });
         setTodayData((prev: any) => ({
           ...prev,
           title: data.title,
           description: data.description,
           safetyNote: data.safetyNote,
           exercises: mappedExercises,
           isRestDay: data.intensity === "Rest" || mappedExercises.length === 0,
         }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingWorkout(false);
    }
  };

  const currentStreak = useMemo(() => {
    if (!logs.length) return 0;
    const sorted = [...logs].filter((l) => l.completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!sorted.length) return 0;
    let streak = 1;
    let currDate = new Date(sorted[0].date);
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.floor((currDate.getTime() - new Date(sorted[i].date).getTime()) / 86400000);
      if (diffDays === 1) { streak++; currDate = new Date(sorted[i].date); } 
      else if (diffDays > 1) break;
    }
    return streak;
  }, [logs]);

  const longestStreak = useMemo(() => {
    if (!logs.length) return 0;
    const sorted = [...logs].filter((l) => l.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (!sorted.length) return 0;
    let longest = 1, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.floor((new Date(sorted[i].date).getTime() - new Date(sorted[i-1].date).getTime()) / 86400000);
      if (diffDays === 1) current++;
      else if (diffDays > 1) current = 1;
      if (current > longest) longest = current;
    }
    return longest;
  }, [logs]);

  const [weeklyCompleted, setWeeklyCompleted] = useState(0);

  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7*86400000);
    setWeeklyCompleted(logs.filter((l) => l.completed && new Date(l.date) >= weekAgo).length);
  }, [logs]);

  const markComplete = async () => {
    if (!todayData || marking) return;
    setMarking(true);
    try {
      await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayData.date, dayNumber: todayData.dayNumber, completed: true }),
      });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      setTodayData({ ...todayData, isCompleted: true });
      setLogs([...logs, { date: todayData.date, completed: true, dayNumber: todayData.dayNumber }]);
    } finally {
      setMarking(false);
    }
  };

  const filteredExercises = useMemo(() => {
    const result = exercises.filter((e) => {
      const matchesSearch = !search || 
        [e.name, e.category, e.equipment, e.movementPattern, ...e.targetMuscles].some(str => 
          str?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "All" || e.difficulty === difficultyFilter;
      const matchesEquipment = equipmentFilter === "All" || e.equipment === equipmentFilter;
      const matchesMovement = movementTypeFilter === "All" || e.movementPattern === movementTypeFilter;
      
      const hasValidAudio = e.audioStatus === "ready" && Boolean(e.audioUrl);
      const matchesAudio = !audioOnly || hasValidAudio;
      
      const isNoEq = e.equipment.toLowerCase() === "bodyweight";
      const matchesNoEq = !noEquipmentOnly || isNoEq;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment && matchesMovement && matchesAudio && matchesNoEq;
    });

    if (sortBy === "Beginner friendly") {
      result.sort((a, b) => {
         const getVal = (d: string | null | undefined) => d === "Beginner" ? 1 : d === "Intermediate" ? 2 : 3;
         return getVal(a.difficulty) - getVal(b.difficulty);
      });
    } else if (sortBy === "Shortest workout") {
      result.sort((a, b) => {
         return a.defaultSets - b.defaultSets;
      });
    } else if (sortBy === "Most popular") {
       result.sort((a, b) => (b.estimatedCaloriesPerMinute || 0) - (a.estimatedCaloriesPerMinute || 0));
    }
    return result;
  }, [exercises, search, categoryFilter, difficultyFilter, equipmentFilter, movementTypeFilter, audioOnly, noEquipmentOnly, sortBy]);

  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);
  useEffect(() => {
    setConfettiParticles(
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${30 + Math.random() * 20}%`,
        backgroundColor: ["#c0ff00", "#00e676", "#38bdf8", "#fb923c"][i % 4],
        animationDelay: `${Math.random() * 0.3}s`,
        animationDuration: `${0.6 + Math.random() * 0.6}s`,
      }))
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="text-muted text-sm font-bold uppercase tracking-widest">Loading today&apos;s workout...</p>
      </div>
    );
  }

  const containerVariants: import("framer-motion").Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants: import("framer-motion").Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 relative pb-20">
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {confettiParticles.map((p) => (
            <div key={p.id} className="confetti-particle" style={{ left: p.left, top: p.top, backgroundColor: p.backgroundColor, animationDelay: p.animationDelay, animationDuration: p.animationDuration, boxShadow: `0 0 10px ${p.backgroundColor}` }} />
          ))}
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="text-6xl drop-shadow-[0_0_20px_rgba(192,255,0,0.5)]">🔥</motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.05] relative z-10 mx-auto max-w-sm mb-6 shadow-2xl shadow-black/50">
        <button onClick={() => setActiveTab("today")} className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-xl transition-all duration-500 ease-out border backdrop-blur-md ${activeTab === "today" ? "bg-white/[0.08] border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-white/[0.02] border-white/[0.05] text-muted hover:bg-white/[0.04] hover:text-white hover:border-white/10"}`}>Today</button>
        <button onClick={() => setActiveTab("library")} className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-xl transition-all duration-500 ease-out border backdrop-blur-md ${activeTab === "library" ? "bg-white/[0.08] border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-white/[0.02] border-white/[0.05] text-muted hover:bg-white/[0.04] hover:text-white hover:border-white/10"}`}>Library</button>
      </div>

      {activeTab === "today" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-6 flex flex-col items-center text-center group"><Flame className="text-accent mb-2 group-hover:animate-pulse" size={28} /><span className="text-3xl font-black text-white">{currentStreak}</span><span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Day Streak</span></div>
            <div className="glass-card p-6 flex flex-col items-center text-center group"><Trophy className="text-yellow-500 mb-2 group-hover:-translate-y-1 transition-transform" size={28} /><span className="text-3xl font-black text-white">{longestStreak}</span><span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Best Streak</span></div>
            <div className="glass-card p-6 flex flex-col items-center text-center group">
              <div className="relative group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 mb-1 -rotate-90" viewBox="0 0 36 36"><path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" /><path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${(weeklyCompleted / 6) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
                <div className="absolute inset-0 flex items-center justify-center pb-1"><span className="text-sm font-black">{weeklyCompleted}</span></div>
              </div>
              <span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">This Week</span>
            </div>
          </motion.div>

          {assistantState === 'chat' && (
            <FitnessAssistant onComplete={handleCompleteReadiness} />
          )}

          {assistantState === 'ready_card' && (
            <motion.div variants={itemVariants} className="max-w-md mx-auto glass-card p-8 text-center rounded-3xl border border-white/10">
              <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto mb-6 flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(192,255,0,0.2)]">
                <CheckCircle2 size={32} className="text-accent" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Your fitness profile is ready.</h2>
              <p className="text-muted mb-8 text-sm">We&apos;ll use your readiness profile to customize today&apos;s workout.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => generatePersonalizedWorkout(fitnessReadiness!)}
                  className="w-full bg-accent text-black font-black py-4 rounded-xl hover:scale-105 transition-transform"
                >
                  Continue to today&apos;s workout
                </button>
                <button 
                  onClick={() => setAssistantState('chat')}
                  className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Update my readiness
                </button>
              </div>
            </motion.div>
          )}

          {assistantState === 'workout' && hasError ? (
            <div className="text-center py-16 text-muted glass-card rounded-2xl border-white/5 flex flex-col items-center justify-center">
              <AlertTriangle className="text-red-500/50 mb-4" size={48} />
              <p className="text-lg font-bold text-white mb-6">We couldn&apos;t load your workout. Try again.</p>
              <button onClick={fetchData} className="px-6 py-2 bg-white/10 rounded-lg text-white font-bold hover:bg-white/20 transition">Try again</button>
            </div>
          ) : assistantState === 'workout' && !todayData ? (
             <div className="text-center py-16 text-muted glass-card rounded-2xl border-white/5">
               <Dumbbell className="mx-auto mb-4 opacity-30" size={48} />
               <p className="text-lg font-medium text-white/50">Your workout plan is being prepared.</p>
             </div>
          ) : assistantState === 'workout' && generatingWorkout ? (
             <div className="text-center py-16 text-muted glass-card rounded-2xl border-white/5 flex flex-col items-center">
               <Loader2 className="animate-spin text-accent mb-4" size={48} />
               <p className="text-lg font-bold text-white">Customizing your workout...</p>
             </div>
          ) : assistantState === 'workout' && todayData.isRestDay ? (
            <motion.div variants={itemVariants} className="glass-card p-12 text-center flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
              
              <Zap className="text-accent mb-6" size={56} />
              <h2 className="text-3xl sm:text-5xl font-black mb-3 text-white">Sunday — Rest Day</h2>
              <p className="text-muted text-lg max-w-md mx-auto mb-8">Recover today so you can train well tomorrow.</p>
              
              <div className="text-left w-full max-w-sm mb-8 space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0"><CheckCircle2 className="text-accent" size={20}/></div>
                  <p className="text-sm text-white/80"><strong className="text-white">Take an easy walk.</strong> Light activity promotes blood flow for recovery.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0"><CheckCircle2 className="text-accent" size={20}/></div>
                  <p className="text-sm text-white/80"><strong className="text-white">Do 5–10 minutes of light mobility.</strong> Keep your joints feeling healthy and smooth.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0"><CheckCircle2 className="text-accent" size={20}/></div>
                  <p className="text-sm text-white/80"><strong className="text-white">Prioritize hydration and sleep.</strong> Real progress happens while you rest.</p>
                </div>
              </div>
              
              <button 
                onClick={() => { setActiveTab("library"); setCategoryFilter("Mobility"); }} 
                className="px-6 py-3 bg-white/10 rounded-xl text-white font-bold hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
              >
                View mobility exercises
              </button>
            </motion.div>
          ) : assistantState === 'workout' && (
            <>
              {fitnessReadiness && (
                <motion.div variants={itemVariants} className="mb-8 glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold mb-1 flex items-center gap-2"><Activity size={16} className="text-accent"/> Your movement profile</h4>
                    <p className="text-xs text-muted">
                      {fitnessReadiness.fitnessLevel} • {fitnessReadiness.intensityPreference} intensity • {fitnessReadiness.equipment.join(", ")}
                    </p>
                  </div>
                  <button onClick={() => setAssistantState('chat')} className="text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition">
                    Update readiness
                  </button>
                </motion.div>
              )}

              {todayData.safetyNote && (
                <motion.div variants={itemVariants} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                   <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
                   <p className="text-sm text-red-200/80 leading-relaxed">{todayData.safetyNote}</p>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mb-6">
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">{todayData.dayName} — {todayData.title}</h2>
                <p className="text-muted text-lg">{todayData.description || `${todayData.exercises?.length || 0} exercises selected for today.`}</p>
              </motion.div>
              <div className="space-y-4">
                {todayData.exercises?.map((ex: any) => {
                  const isDone = completedExIds.has(ex.id);
                  const timerSeconds = ex.reps?.match(/(\d+)/) ? parseInt(ex.reps.match(/(\d+)/)[1]) : 60;
                  
                  return (
                    <motion.div variants={itemVariants} key={ex.id} className={`glass-card p-4 flex flex-col sm:flex-row gap-4 justify-between transition-all duration-300 relative overflow-hidden ${isDone ? 'border-accent/30 bg-accent/5' : 'hover:border-white/20'}`}>
                      <div className="flex items-start gap-4 flex-1">
                        <button onClick={() => toggleExercise(ex.id)} className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 btn-press ${isDone ? 'bg-accent border-accent text-black shadow-[0_0_15px_rgba(192,255,0,0.4)]' : 'border-white/20 hover:border-accent/50 text-transparent hover:bg-white/5'}`}>
                          <CheckCircle2 size={18} className={isDone ? 'opacity-100' : 'opacity-0'} />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 rounded text-white/70 tracking-widest uppercase">{ex.category || ex.muscleGroup}</span>
                            <button onClick={() => handleSelectExercise(ex)} className="text-xs text-accent hover:text-white flex items-center gap-1 transition-colors bg-accent/10 px-2 py-0.5 rounded"><Play size={10} /> View Details</button>
                          </div>
                          <h3 className={`font-black text-xl mb-1 transition-colors ${isDone ? 'text-accent' : 'text-white'}`}>{ex.name}</h3>
                          <p className="text-sm text-muted italic mb-1">&quot;{ex.formCues?.[0] || ex.description}&quot;</p>
                          {ex.modification && (
                            <div className="mt-2 bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">
                              <p className="text-xs text-blue-200/90 font-medium"><strong className="text-blue-400">Mod:</strong> {ex.modification}</p>
                            </div>
                          )}
                          {ex.stopCondition && (
                            <div className="mt-1 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                              <p className="text-xs text-red-200/90 font-medium"><strong className="text-red-400">Stop:</strong> {ex.stopCondition}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-3 sm:gap-2 text-sm font-medium border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                        <div className="flex gap-2">
                          <div className="bg-white/5 px-3 py-1.5 rounded-lg text-center min-w-[70px]"><span className="block text-xl font-black text-white">{ex.sets || ex.defaultSets}</span><span className="text-[9px] text-muted uppercase tracking-widest">Sets</span></div>
                          <div className="bg-white/5 px-3 py-1.5 rounded-lg text-center min-w-[70px]"><span className="block text-xl font-black text-white">{ex.reps || ex.defaultReps}</span><span className="text-[9px] text-muted uppercase tracking-widest">Reps</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <InlineTimer defaultSeconds={timerSeconds} />
                          <div className="flex items-center gap-1 text-muted bg-white/5 px-2 py-1.5 rounded-lg">{getEquipmentIcon(ex.equipment)}<span className="text-[10px] uppercase tracking-wider">{ex.equipment}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div variants={itemVariants} className="pt-6 flex justify-center">
                {todayData.isCompleted ? (
                  <div className="flex items-center gap-2 text-accent font-black bg-accent/10 px-8 py-4 rounded-2xl border border-accent/20 glow"><CheckCircle2 size={24} /> Workout Completed</div>
                ) : (
                  <div className="w-full max-w-sm flex flex-col items-center gap-3">
                    <button onClick={markComplete} disabled={marking || !allExercisesCompleted} className={`group relative w-full flex items-center justify-center px-8 py-4 font-black text-lg rounded-2xl overflow-hidden transition-all duration-300 btn-press ${allExercisesCompleted ? 'bg-accent text-black hover:scale-105 shadow-[0_0_30px_rgba(192,255,0,0.3)]' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                      {marking ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle2 size={24} className="mr-2" /> <span>Finish Workout</span></>}
                    </button>
                    {!allExercisesCompleted && <p className="text-xs text-muted font-medium text-center">Complete all {todayData.exercises?.length} exercises to finish.</p>}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      )}

      {activeTab === "library" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          <motion.div variants={itemVariants} className="text-center py-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Move with confidence.</h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">Explore clear, guided exercises for strength, mobility, cardio, and everyday movement.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input type="text" placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent">
                  {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <button 
                onClick={() => {
                  setSearch(""); setCategoryFilter("All"); setDifficultyFilter("All"); setEquipmentFilter("All");
                  setMovementTypeFilter("All"); setAudioOnly(false); setNoEquipmentOnly(false); setSortBy("Recommended");
                }}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest px-3 py-2"
              >
                Clear all filters
              </button>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 border-t border-white/5 mt-2">
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg px-3 py-2">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Difficulty</label>
                <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg px-3 py-2">
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Equipment</label>
                <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg px-3 py-2">
                  {EQUIPMENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Movement Type</label>
                <select value={movementTypeFilter} onChange={(e) => setMovementTypeFilter(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg px-3 py-2">
                  {MOVEMENT_PATTERNS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
               <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                 <input type="checkbox" checked={audioOnly} onChange={(e) => setAudioOnly(e.target.checked)} className="rounded border-white/10 text-accent focus:ring-accent/50 bg-[#1a1a1a]" />
                 <span className="font-medium">Audio guidance available</span>
               </label>
               <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                 <input type="checkbox" checked={noEquipmentOnly} onChange={(e) => setNoEquipmentOnly(e.target.checked)} className="rounded border-white/10 text-accent focus:ring-accent/50 bg-[#1a1a1a]" />
                 <span className="font-medium">No equipment</span>
               </label>
            </div>
            
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest text-right">
               {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExercises.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} itemVariants={itemVariants} onClick={() => handleSelectExercise(ex)} />
            ))}
          </motion.div>

          {filteredExercises.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20 text-muted glass-card rounded-2xl border-white/5">
              <Search className="mx-auto mb-4 opacity-30 text-accent" size={48} />
              <p className="text-lg font-bold text-white">No exercises found.</p>
              <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Premium Detail Modal */}
      <ExerciseModal 
        ex={selectedExercise}
        onClose={() => {
          if (audioRef.current) audioRef.current.pause();
          setSelectedExercise(null);
        }}
        videoState={audioState}
        isPlayingAudio={isPlayingAudio}
        setIsPlayingAudio={setIsPlayingAudio}
        isVideoMuted={isVideoMuted}
        setIsVideoMuted={setIsVideoMuted}
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        audioProgress={audioProgress}
        setAudioProgress={setAudioProgress}
        audioRef={audioRef}
        videoRef={videoRef}
      />
    </motion.div>
  );
}
