"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, Dumbbell, Zap, CircleDot, Flame, Trophy, Play, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface WorkoutLog {
  date: string;
  completed: boolean;
  dayNumber: number;
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

function ExerciseCard({ ex, onClick, itemVariants }: { ex: Exercise, onClick: () => void, itemVariants: any }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Placeholder mock video URLs since we can't generate actual AI video files
  const mockGlimpseUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <motion.div 
      variants={itemVariants}
      className="glass-card flex flex-col hover:-translate-y-1 transition-transform group border border-white/5 hover:border-accent/30 overflow-hidden cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Video Glimpse Container */}
      <div className="relative w-full h-32 bg-black/50 border-b border-white/5 overflow-hidden">
        {isHovered ? (
          <video 
            src={ex.hoverVideoUrl || mockGlimpseUrl} 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="text-white/20 group-hover:text-accent/50 transition-colors" size={32} />
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-accent uppercase tracking-widest backdrop-blur-md">
          {ex.muscleGroup}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-lg text-white mb-1 leading-tight group-hover:text-accent transition-colors">{ex.name}</h3>
        <p className="text-xs text-muted italic mb-3 line-clamp-1">"{ex.formCue}"</p>
        
        <div className="mt-auto flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-1 text-xs text-muted">
            {getEquipmentIcon(ex.equipment)}
            <span>{ex.equipment}</span>
          </div>
          <span className="text-white font-bold bg-white/5 px-2 py-1 rounded">{ex.sets} × {ex.reps}</span>
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
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("All");
  const [muscleFilter, setMuscleFilter] = useState("All");
  
  // Tabs: 'today' | 'library'
  const [activeTab, setActiveTab] = useState<"today" | "library">("today");
  const [marking, setMarking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Exercise | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const localNow = new Date();
        const localDateStr = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")}`;

        const [exercisesRes, todayRes, logsRes] = await Promise.all([
          fetch("/api/exercises"),
          fetch(`/api/today?localDate=${localDateStr}`),
          fetch("/api/workout-log")
        ]);
        const exData = await exercisesRes.json();
        const tData = await todayRes.json();
        const lData = await logsRes.json();
        setExercises(exData);
        setTodayData(tData);
        setLogs(lData);
      } catch (error) {
        console.error("Failed to fetch exercises or logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      // Optimistically update logs for streak
      setLogs([...logs, { date: todayData.date, completed: true, dayNumber: todayData.dayNumber }]);
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

  const confettiParticles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${20 + Math.random() * 60}%`,
    top: `${30 + Math.random() * 20}%`,
    backgroundColor: ["#c0ff00", "#00e676", "#38bdf8", "#fb923c"][i % 4],
    animationDelay: `${Math.random() * 0.3}s`,
    animationDuration: `${0.6 + Math.random() * 0.6}s`,
  })), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative pb-20"
    >
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
                boxShadow: `0 0 10px ${particle.backgroundColor}`
              }}
            />
          ))}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="text-6xl drop-shadow-[0_0_20px_rgba(192,255,0,0.5)]"
          >
            🔥
          </motion.div>
        </div>
      )}

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6 flex flex-col items-center text-center group">
          <Flame className="text-accent mb-2 group-hover:animate-pulse" size={28} />
          <span className="text-3xl font-black text-white">{currentStreak}</span>
          <span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Day Streak</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center text-center group">
          <Trophy className="text-yellow-500 mb-2 group-hover:-translate-y-1 transition-transform" size={28} />
          <span className="text-3xl font-black text-white">{longestStreak}</span>
          <span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Best Streak</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center text-center group">
          <div className="relative group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12 mb-1 -rotate-90" viewBox="0 0 36 36">
              <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
              <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${(weeklyCompleted / 6) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pb-1">
              <span className="text-sm font-black">{weeklyCompleted}</span>
            </div>
          </div>
          <span className="text-xs text-muted font-bold uppercase tracking-widest mt-1">This Week</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 p-1 glass-card rounded-xl">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all border ${
            activeTab === "today" ? "bg-gradient-to-b from-accent/20 to-accent/5 text-accent border-accent/20 ring-1 ring-accent shadow-sm shadow-accent/10" : "border-transparent text-muted hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          Today's Workout
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all border ${
            activeTab === "library" ? "bg-gradient-to-b from-accent/20 to-accent/5 text-accent border-accent/20 ring-1 ring-accent shadow-sm shadow-accent/10" : "border-transparent text-muted hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          Full Library
        </button>
      </motion.div>

      {activeTab === "today" && todayData && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {todayData.isRestDay ? (
            <motion.div variants={itemVariants} className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10">
              <Zap className="text-accent mb-6" size={56} />
              <h2 className="text-3xl font-black mb-3 text-white">Rest & Recover</h2>
              <p className="text-muted max-w-sm">Muscles grow when you rest. Take this time to stretch, hydrate, and prepare for tomorrow.</p>
            </motion.div>
          ) : (
            <>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">Day {todayData.dayNumber} — {todayData.dayName}</h2>
                  <p className="text-muted text-lg">{todayData.exercises.length} exercises to crush today.</p>
                </div>
                {todayData.isCompleted ? (
                  <div className="flex items-center gap-2 text-accent font-black bg-accent/10 px-6 py-3 rounded-full border border-accent/20">
                    <CheckCircle2 size={20} />
                    Complete
                  </div>
                ) : (
                  <button
                    onClick={markComplete}
                    disabled={marking}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-black bg-accent rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    {marking ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <CheckCircle2 size={20} className="mr-2" />
                        <span>Finish Workout</span>
                      </>
                    )}
                  </button>
                )}
              </motion.div>

              <div className="space-y-3">
                {todayData.exercises.map((ex: any, i: number) => (
                  <motion.div 
                    variants={itemVariants}
                    key={ex.id}
                    className="glass-card p-5 flex flex-col sm:flex-row gap-4 justify-between group hover:border-accent/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded text-accent tracking-widest uppercase">
                          {ex.muscleGroup}
                        </span>
                      </div>
                      <h3 className="font-black text-xl text-white mb-1 group-hover:text-accent transition-colors">{ex.name}</h3>
                      <p className="text-sm text-muted italic">"{ex.formCue}"</p>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-sm font-medium">
                      <div className="bg-white/5 px-4 py-2 rounded-lg text-center min-w-[100px]">
                        <span className="block text-2xl font-black text-white">{ex.sets}</span>
                        <span className="text-[10px] text-muted uppercase tracking-widest">Sets</span>
                      </div>
                      <div className="bg-white/5 px-4 py-2 rounded-lg text-center min-w-[100px]">
                        <span className="block text-2xl font-black text-white">{ex.reps}</span>
                        <span className="text-[10px] text-muted uppercase tracking-widest">Reps</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted bg-white/5 px-3 py-1.5 rounded-lg mt-1 w-full sm:w-auto justify-center">
                        {getEquipmentIcon(ex.equipment)}
                        <span className="text-xs uppercase tracking-wider">{ex.equipment}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {activeTab === "library" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search exercises by name, muscle, or equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
              />
            </div>
            
            <div className="pill-scroll mb-2">
              {DAY_FILTERS.map((df) => (
                <button
                  key={df}
                  onClick={() => setDayFilter(df)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all border ${
                    dayFilter === df
                      ? "bg-gradient-to-b from-accent/20 to-accent/5 text-accent border-accent/20 ring-1 ring-accent shadow-sm shadow-accent/10"
                      : "glass-card text-muted hover:text-white border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  {df}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} itemVariants={itemVariants} onClick={() => setSelectedVideo(ex)} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16 text-muted">
              <Dumbbell className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg">No exercises found matching your search.</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Full Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl glass-card border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(192,255,0,0.1)]"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              
              <div className="w-full aspect-video bg-black relative">
                {/* Simulated AI Video Player */}
                <video 
                  src={selectedVideo.fullVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-cover"
                />
                
                {/* AI Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full backdrop-blur-md border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">AI Generated</span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-accent/10 text-accent rounded">
                    {selectedVideo.muscleGroup}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-muted rounded">
                    {selectedVideo.equipment}
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{selectedVideo.name}</h2>
                <div className="flex items-center gap-4 text-sm font-bold text-white mb-6">
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                    {selectedVideo.sets} Sets
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                    {selectedVideo.reps} Reps
                  </div>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                  <h4 className="text-sm font-bold text-accent mb-1 flex items-center gap-2">
                    <Flame size={16} /> AI Form Cue
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "{selectedVideo.formCue}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
