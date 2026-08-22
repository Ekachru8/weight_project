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
  voiceoverUrl?: string;
  voiceoverStatus?: string;
  transcript?: string;
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
  
  // Checking both new API fields and legacy fields
  const hasValidVideo = ex.videoUrl && ex.videoUrl.trim() !== "";
  const isGenerating = ex.videoStatus === "queued" || ex.videoStatus === "generating" || ex.videoStatus === "processing";
  const isFailed = ex.videoStatus === "failed";
  
  return (
    <motion.div 
      variants={itemVariants}
      className="glass-card flex flex-col hover:-translate-y-1 transition-transform group border border-white/5 hover:border-accent/30 overflow-hidden cursor-pointer relative shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden flex flex-col justify-center items-center">
        {hasValidVideo ? (
          isHovered ? (
            <video 
              src={ex.videoUrl!} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <>
              {ex.thumbnailUrl ? (
                <img src={ex.thumbnailUrl} alt={ex.name} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full bg-black/50" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="text-accent ml-1" size={20} fill="currentColor" />
                </div>
              </div>
            </>
          )
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-black/60 relative">
            <div className="absolute inset-0 overflow-hidden">
               <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <Loader2 className="animate-spin text-accent mb-2 relative z-10" size={24} />
            <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1 relative z-10">Preparing Video...</p>
          </div>
        ) : isFailed ? (
          <div className="px-4 text-center">
            <AlertTriangle className="mx-auto text-red-400/50 mb-2" size={32} />
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Demonstration Failed</p>
          </div>
        ) : (
          <div className="px-4 text-center">
            <Activity className="mx-auto text-muted/30 mb-2" size={32} />
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Demonstration unavailable</p>
          </div>
        )}
        
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
          {ex.category}
        </div>
        
        {ex.difficulty && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${getDifficultyColor(ex.difficulty)}`}>
            {ex.difficulty}
          </div>
        )}
        
        {hasValidVideo && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[9px] font-bold text-accent uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
            <Play size={10} fill="currentColor"/> Video Available
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
          <div className="grid grid-cols-2 gap-2 mt-2">
            {hasValidVideo ? (
              <button className="col-span-1 text-[10px] font-bold text-black bg-accent hover:bg-accent/80 transition-colors py-2 rounded-lg flex items-center justify-center gap-1">
                <Play size={12} fill="currentColor" /> Watch
              </button>
            ) : (
               <div className="col-span-1" />
            )}
            <button className={`text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg flex items-center justify-center gap-1 ${hasValidVideo ? 'col-span-1' : 'col-span-2'}`}>
              <Info size={12}/> View details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
