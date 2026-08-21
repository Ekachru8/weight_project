"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, Search, Dumbbell, Zap, CircleDot, Flame, Trophy, Play, CheckCircle2, X, Clock, AlertTriangle, Info, Activity, Volume2, VolumeX, FileText, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { weeklyWorkoutSchedule } from "@/lib/workout-schedule";
import { FitnessAssistant, FitnessReadiness } from "@/components/FitnessAssistant";

interface Exercise {
  id: number;
  slug: string;
  name: string;
  category: string;
  difficulty: string;
  equipment: string;
  targetMuscles: string[];
  movementPattern: string;
  description: string;
  formCues: string[];
  instructions: string[];
  commonMistakes: string[];
  safetyTips: string[];
  defaultSets: number;
  defaultReps: string;
  estimatedCaloriesPerMinute: number;
  videoUrl?: string;
  videoStatus: string;
  videoExerciseSlug?: string;
  voiceoverUrl?: string;
  voiceoverStatus?: string;
  transcript?: string;
  videoSource?: string;
  videoSourcePage?: string;
  pixabayAssetId?: string;

  // Legacy for "today" workout
  dayNumber?: number;
  dayName?: string;
  muscleGroup?: string;
  sets?: number;
  reps?: string;
}

interface WorkoutLog {
  date: string;
  completed: boolean;
  dayNumber: number;
}

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Glutes", "Shoulders", "Arms", "Core", "Full Body", "Cardio", "Mobility"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const EQUIPMENT_TYPES = ["All", "Bodyweight", "Dumbbells", "Resistance Band", "Chair", "Mat", "Pull-up Bar"];

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

function ExerciseCard({ ex, onClick, itemVariants }: { ex: Exercise, onClick: () => void, itemVariants: any }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ensure we only show the video if the generated video exactly matches this exercise slug
  const hasValidVideo = (ex as any).videoStatus === "ready" && ex.videoExerciseSlug === ex.slug;

  return (
    <motion.div 
      variants={itemVariants}
      className="glass-card flex flex-col hover:-translate-y-1 transition-transform group border border-white/5 hover:border-accent/30 overflow-hidden cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-36 bg-black/50 border-b border-white/5 overflow-hidden flex flex-col justify-center items-center">
        {hasValidVideo ? (
          isHovered ? (
            <video 
              src={ex.videoUrl} 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="text-white/20 group-hover:text-accent/50 transition-colors" size={32} />
            </div>
          )
        ) : (
          <div className="px-4 text-center">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Video demonstration coming soon</p>
            <p className="text-[10px] text-white/40 italic line-clamp-2">&quot;{ex.formCues?.[0] || ex.description}&quot;</p>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-accent uppercase tracking-widest backdrop-blur-md">
          {ex.category}
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${getDifficultyColor(ex.difficulty)}`}>
          {ex.difficulty}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-lg text-white mb-1 leading-tight group-hover:text-accent transition-colors">{ex.name}</h3>
        <p className="text-xs text-muted italic mb-3 line-clamp-1">{ex.description}</p>
        
        <div className="mt-auto flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-1 text-xs text-muted">
            {getEquipmentIcon(ex.equipment)}
            <span>{ex.equipment}</span>
          </div>
          <span className="text-white font-bold bg-white/5 px-2 py-1 rounded text-xs">{ex.defaultSets} × {ex.defaultReps}</span>
        </div>
      </div>
    </motion.div>
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
  
  const [activeTab, setActiveTab] = useState<"today" | "library">("today");
  const [marking, setMarking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Exercise | null>(null);
  const [videoState, setVideoState] = useState<'loading' | 'ready' | 'error'>('ready');
  const [completedExIds, setCompletedExIds] = useState<Set<number>>(new Set());
  
  // Audio / Video controls state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSelectVideo = async (ex: Exercise) => {
    setSelectedVideo(ex);
    setIsPlayingAudio(false);
    setShowTranscript(false);
    setAudioProgress(0);
    
    // Check if videoUrl is already provided by EXERCISE_ASSETS (which means it's ready)
    if (ex.videoUrl && ex.videoExerciseSlug === ex.slug) {
      setVideoState('ready');
      // Fetch voiceover if not already present
      if (!ex.voiceoverUrl) {
        fetchVoiceover(ex);
      }
    } else {
      fetchVideo(ex);
    }
  };

  const fetchVoiceover = async (ex: Exercise) => {
    try {
      const res = await fetch('/api/exercises/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseSlug: ex.slug })
      });
      const data = await res.json();
      if (res.ok && data.voiceoverUrl) {
        setSelectedVideo(prev => prev?.slug === ex.slug ? { ...prev, voiceoverUrl: data.voiceoverUrl, transcript: data.transcript, voiceoverStatus: 'ready' } : prev);
        setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, voiceoverUrl: data.voiceoverUrl, transcript: data.transcript, voiceoverStatus: 'ready' } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideo = async (ex: Exercise) => {
    setVideoState('loading');
    try {
      const res = await fetch('/api/exercises/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseSlug: ex.slug,
          exerciseName: ex.name,
          category: ex.category,
          targetMuscles: ex.targetMuscles,
          equipment: ex.equipment,
          instructions: ex.instructions,
          formCues: ex.formCues
        })
      });
      const data = await res.json();
      if (res.ok && data.videoUrl) {
        setSelectedVideo(prev => prev?.slug === ex.slug ? { ...prev, videoUrl: data.videoUrl, videoExerciseSlug: data.exerciseSlug, videoStatus: 'ready' } : prev);
        setExercises(prev => prev.map(p => p.slug === ex.slug ? { ...p, videoUrl: data.videoUrl, videoExerciseSlug: data.exerciseSlug, videoStatus: 'ready' } : p));
        setVideoState('ready');
        
        // Fetch voiceover after video is ready
        fetchVoiceover(ex);
      } else {
        setVideoState('error');
      }
    } catch (err) {
      setVideoState('error');
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

      const validExercises = Array.isArray(exData) ? exData : [];
      setExercises(validExercises);
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
              .map(slug => validExercises.find(ex => ex.slug === slug))
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
    return exercises.filter((e) => {
      const matchesSearch = !search || 
        [e.name, e.category, e.equipment, e.movementPattern, ...e.targetMuscles].some(str => 
          str?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "All" || e.difficulty === difficultyFilter;
      const matchesEquipment = equipmentFilter === "All" || e.equipment === equipmentFilter;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
    });
  }, [exercises, search, categoryFilter, difficultyFilter, equipmentFilter]);

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
                            <button onClick={() => handleSelectVideo(ex)} className="text-xs text-accent hover:text-white flex items-center gap-1 transition-colors bg-accent/10 px-2 py-0.5 rounded"><Play size={10} /> Watch Form</button>
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
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Move better. Train with confidence.</h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">Explore over 100 exercises with detailed instructions, AI demonstrations, and proper form cues.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input type="text" placeholder="Search exercises, muscles, movement patterns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium" />
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Category</label>
                <div className="pill-scroll pb-1">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategoryFilter(c)} className={`shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-semibold rounded-lg transition-all border ${categoryFilter === c ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-transparent text-muted hover:text-white"}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Difficulty</label>
                <div className="pill-scroll pb-1">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDifficultyFilter(d)} className={`shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-semibold rounded-lg transition-all border ${difficultyFilter === d ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-transparent text-muted hover:text-white"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 block">Equipment</label>
                <div className="pill-scroll pb-1">
                  {EQUIPMENT_TYPES.map(e => (
                    <button key={e} onClick={() => setEquipmentFilter(e)} className={`shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-semibold rounded-lg transition-all border ${equipmentFilter === e ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-transparent text-muted hover:text-white"}`}>{e}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExercises.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} itemVariants={itemVariants} onClick={() => handleSelectVideo(ex)} />
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
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col glass-card border border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl"
            >
              <button onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setSelectedVideo(null);
              }} className="absolute top-4 right-4 z-20 p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"><X size={20} /></button>
              
              <div className="flex-shrink-0 w-full aspect-video bg-black relative border-b border-white/5">
                {videoState === 'loading' ? (
                  <div className="w-full h-full flex items-center justify-center flex-col gap-4"><Loader2 className="animate-spin text-accent" size={32} /><p className="text-white text-sm font-bold tracking-wide">Generating AI demonstration...</p></div>
                ) : videoState === 'error' || selectedVideo.videoExerciseSlug !== selectedVideo.slug ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-4"><AlertTriangle className="text-yellow-500 opacity-50" size={40} /><p className="text-white text-sm font-bold">Video unavailable for this exercise.</p><button onClick={() => fetchVideo(selectedVideo)} className="px-6 py-2 bg-white/10 rounded-lg text-white font-bold hover:bg-white/20 transition">Try again</button></div>
                ) : (
                  <>
                    <video ref={videoRef} src={(selectedVideo as any).videoUrl} autoPlay muted={isVideoMuted} loop playsInline className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full backdrop-blur-md border border-white/10"><div className="w-2 h-2 rounded-full bg-accent animate-pulse" /><span className="text-[10px] font-bold text-white uppercase tracking-widest">{(selectedVideo as any).videoSource === 'pixabay' ? 'EXERCISE DEMONSTRATION' : 'HOMEFIT DEMONSTRATION'}</span></div>
                    
                    <button onClick={() => setIsVideoMuted(!isVideoMuted)} className="absolute bottom-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 z-20">
                      {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    
                    {(selectedVideo as any).voiceoverUrl && (
                      <audio 
                        ref={audioRef} 
                        src={(selectedVideo as any).voiceoverUrl} 
                        onEnded={() => setIsPlayingAudio(false)}
                        onTimeUpdate={() => {
                          if (audioRef.current) {
                            setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                
                {/* Voiceover Controls */}
                {(selectedVideo as any).voiceoverStatus === 'ready' && (selectedVideo as any).voiceoverExerciseSlug === selectedVideo.slug ? (
                  <div className="mb-6 p-4 rounded-xl border border-accent/20 bg-accent/5 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            if (audioRef.current) {
                              if (isPlayingAudio) {
                                audioRef.current.pause();
                                setIsPlayingAudio(false);
                              } else {
                                audioRef.current.play();
                                setIsPlayingAudio(true);
                              }
                            }
                          }} 
                          className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-[0_0_15px_rgba(192,255,0,0.3)]"
                        >
                          {isPlayingAudio ? <Pause size={16} /> : <Play size={16} />}
                          {isPlayingAudio ? "Pause guidance" : "Listen to form guidance"}
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = 0;
                              audioRef.current.play();
                              setIsPlayingAudio(true);
                            }
                          }}
                          className="p-2 text-muted hover:text-white transition-colors"
                          title="Replay guidance"
                        >
                          <RotateCcw size={18} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-white transition-colors"
                      >
                        <FileText size={14} />
                        {showTranscript ? "Hide transcript" : "Show transcript"}
                      </button>
                    </div>

                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-100 ease-linear" style={{ width: `${audioProgress}%` }} />
                    </div>

                    {showTranscript && (selectedVideo as any).transcript && (
                      <div className="mt-2 p-4 bg-black/40 rounded-lg border border-white/5 text-sm text-white/80 leading-relaxed italic">
                        <span className="block text-[10px] text-accent font-bold uppercase tracking-widest mb-2 not-italic">Form guidance</span>
                        &quot;{(selectedVideo as any).transcript}&quot;
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center">
                    <p className="text-sm text-muted font-bold flex items-center gap-2"><VolumeX size={16}/> Audio guidance is being prepared</p>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 text-white rounded-full">{selectedVideo.category}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getDifficultyColor(selectedVideo.difficulty)}`}>{selectedVideo.difficulty}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-muted rounded-full flex items-center gap-1">{getEquipmentIcon(selectedVideo.equipment)} {selectedVideo.equipment}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-muted rounded-full flex items-center gap-1"><Activity size={12}/> {selectedVideo.movementPattern}</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">{selectedVideo.name}</h2>
                <p className="text-muted text-lg mb-8 leading-relaxed">{selectedVideo.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-2"><CircleDot size={16} className="text-accent" /> Muscles worked</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVideo.targetMuscles?.map((m, i) => (
                          <span key={i} className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-medium">{m}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-2"><CheckCircle2 size={16} className="text-emerald-400" /> How to perform it</h4>
                      <ol className="text-white/80 leading-relaxed space-y-4">
                        {selectedVideo.instructions?.map((inst, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {selectedVideo.commonMistakes?.length > 0 && (
                      <div className="bg-red-400/5 border border-red-400/20 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><AlertTriangle size={16} /> Common Mistakes to Avoid</h4>
                        <ul className="text-red-200/80 leading-relaxed space-y-2 list-disc list-inside">
                          {selectedVideo.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h4 className="text-[10px] font-bold text-muted mb-4 uppercase tracking-widest">Recommended Prescription</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div><span className="block text-3xl font-black text-white">{selectedVideo.defaultSets}</span><span className="text-[10px] text-muted uppercase tracking-widest">Sets</span></div>
                        <div><span className="block text-3xl font-black text-white">{selectedVideo.defaultReps}</span><span className="text-[10px] text-muted uppercase tracking-widest">Reps</span></div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10 text-center">
                        <span className="block text-xl font-black text-white">{selectedVideo.estimatedCaloriesPerMinute}</span>
                        <span className="text-[10px] text-muted uppercase tracking-widest">Cal / Min</span>
                      </div>
                    </div>

                    {selectedVideo.formCues?.length > 0 && (
                      <div className="bg-accent/5 rounded-2xl p-6 border border-accent/20">
                        <h4 className="text-[10px] font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2"><Flame size={14}/> Form Cues</h4>
                        <div className="space-y-3">
                          {selectedVideo.formCues.map((cue, i) => (
                            <p key={i} className="text-sm text-white/90 italic border-l-2 border-accent pl-3">&quot;{cue}&quot;</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedVideo as any).modifications?.length > 0 && (
                      <div className="bg-yellow-400/5 rounded-2xl p-6 border border-yellow-400/20">
                        <h4 className="text-[10px] font-bold text-yellow-400 mb-3 uppercase tracking-widest">Make it easier</h4>
                        <ul className="text-xs text-yellow-200/80 leading-relaxed space-y-2 list-disc list-inside">
                          {(selectedVideo as any).modifications.map((mod: string, i: number) => <li key={i}>{mod}</li>)}
                        </ul>
                      </div>
                    )}

                    {(selectedVideo as any).progressions?.length > 0 && (
                      <div className="bg-emerald-400/5 rounded-2xl p-6 border border-emerald-400/20">
                        <h4 className="text-[10px] font-bold text-emerald-400 mb-3 uppercase tracking-widest">Progress when ready</h4>
                        <ul className="text-xs text-emerald-200/80 leading-relaxed space-y-2 list-disc list-inside">
                          {(selectedVideo as any).progressions.map((prog: string, i: number) => <li key={i}>{prog}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="bg-blue-400/5 rounded-2xl p-6 border border-blue-400/20">
                      <h4 className="text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Safety Section</h4>
                      <p className="text-sm font-bold text-white mb-2">Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.</p>
                      {selectedVideo.safetyTips?.length > 0 && (
                        <ul className="text-xs text-blue-200/80 leading-relaxed space-y-2 list-disc list-inside">
                          {selectedVideo.safetyTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
