"use client";

import { useState } from "react";
import { Play, Dumbbell, Zap, CircleDot, Info, Activity, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { ExerciseMedia } from "@/lib/exercise-provider";

// Local types until everything is unified
export interface Exercise {
  id: number;
  slug: string;
  name: string;
  category: string;
  difficulty: string | null;
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
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  status?: string;
  videoStatus?: string;
  videoExerciseSlug?: string;
  audioUrl?: string | null;
  audioStatus?: string;
  voiceoverUrl?: string;
  voiceoverStatus?: string;
  transcript?: string;
  photoUrl?: string | null;
  photoAlt?: string | null;
  photoSource?: string | null;
  photoSourcePage?: string | null;
  videoSource?: string;
  videoSourcePage?: string;
  pixabayAssetId?: string;

  estimatedCaloriesPerMinute?: number;
  // Legacy for "today" workout
  dayNumber?: number;
  dayName?: string;
  muscleGroup?: string;
  sets?: number;
  reps?: string;
  modification?: string;
  stopCondition?: string;
}

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

const getDifficultyColor = (diff: string | null) => {
  if (!diff) return "text-muted bg-white/5 border-white/10";
  switch (diff.toLowerCase()) {
    case "beginner": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "advanced": return "text-red-400 bg-red-400/10 border-red-400/20";
    default: return "text-muted bg-white/5 border-white/10";
  }
};

interface ExerciseCardProps {
  ex: Exercise;
  onClick: () => void;
  itemVariants?: any;
}

export function ExerciseCard({ ex, onClick, itemVariants }: ExerciseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasValidAudio = ex.audioStatus === "ready" && Boolean(ex.audioUrl) && Boolean(ex.transcript);
  const isGeneratingAudio = ex.audioStatus === "queued" || ex.audioStatus === "generating" || ex.audioStatus === "processing";
  const isAudioFailed = ex.audioStatus === "failed";
  
  return (
    <motion.div 
      variants={itemVariants}
      className="glass-card flex flex-col hover:-translate-y-1 transition-transform group border border-white/5 hover:border-accent/30 overflow-hidden cursor-pointer relative shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Exercise Photo */}
      <div className="relative w-full h-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform origin-bottom">
        {ex.photoUrl ? (
          <img 
            src={ex.photoUrl} 
            alt={ex.photoAlt || ex.name} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.querySelector('span')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={`text-xs font-bold text-muted uppercase tracking-widest ${ex.photoUrl ? 'hidden' : ''}`}>Exercise image coming soon</span>
        
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <div className="px-2 py-1 bg-black/60 rounded text-[9px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
            {ex.category}
          </div>
          {ex.difficulty && (
            <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${getDifficultyColor(ex.difficulty)}`}>
              {ex.difficulty}
            </div>
          )}
        </div>
      </div>

      {/* Audio Panel */}
      <div className="relative w-full bg-[#0a0a0a] border-b border-white/5 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="text-accent" size={12} />
          <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Physical Trainer Guidance</span>
        </div>

        {hasValidAudio ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between group-hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Play size={12} fill="currentColor" className="ml-0.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">Listen to guidance</span>
                <span className="text-[9px] text-muted">AI Voice Coach</span>
              </div>
            </div>
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-accent rounded-full"></div>
            </div>
          </div>
        ) : isGeneratingAudio ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-3">
            <Loader2 className="animate-spin text-accent" size={14} />
            <span className="text-[11px] font-bold text-muted">Preparing form guidance...</span>
          </div>
        ) : (
          <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-2 flex items-center gap-3">
            <AlertTriangle className="text-red-400/50" size={14} />
            <span className="text-[11px] font-bold text-muted">Audio guidance unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-lg text-white mb-1 leading-tight group-hover:text-accent transition-colors line-clamp-1">{ex.name}</h3>
        <p className="text-xs text-muted italic mb-3 line-clamp-2">&quot;{ex.formCues?.[0] || ex.description || "Maintain proper form."}&quot;</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 text-muted rounded-md flex items-center gap-1">{getEquipmentIcon(ex.equipment)} {ex.equipment}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 text-muted rounded-md flex items-center gap-1"><CircleDot size={12}/> {ex.targetMuscles?.[0] || "Various"}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Prescription</span>
            <span className="text-white font-bold bg-white/5 px-2 py-1 rounded text-xs">{ex.defaultSets || 3} Sets × {ex.defaultReps || "10-12"}</span>
          </div>
          <div className="mt-2">
            <button className="w-full text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg flex items-center justify-center gap-1">
              <Info size={12}/> View written instructions
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
