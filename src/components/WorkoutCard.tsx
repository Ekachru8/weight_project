"use client";

import { useState } from "react";
import { Dumbbell, Zap, CircleDot, ChevronDown, ChevronUp, Play, X } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  muscleGroup: string;
  formCue: string;
  hoverVideoUrl?: string | null;
  fullVideoUrl?: string | null;
}

interface WorkoutCardProps {
  exercise: Exercise;
  index: number;
}

const equipmentIcon = (eq: string) => {
  switch (eq.toLowerCase()) {
    case "dumbbells":
      return <Dumbbell size={14} />;
    case "resistance band":
      return <Zap size={14} />;
    default:
      return <CircleDot size={14} />;
  }
};

export default function WorkoutCard({ exercise, index }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className="glass-card p-4 hover-lift border-glow fade-in-up opacity-0 relative overflow-hidden group cursor-pointer"
        style={{ animationDelay: `${index * 80}ms` }}
        data-testid={`workout-card-${exercise.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowVideo(true)}
      >
        {/* Hover Video Preview Background */}
        {exercise.hoverVideoUrl && (
          <div
            className={`absolute inset-0 z-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-30" : "opacity-0"
            }`}
          >
            <video
              src={exercise.hoverVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between gap-3">
          {/* Number badge with gradient */}
          <div className="w-8 h-8 rounded-lg number-badge flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg bg-black/40 border border-white/10">
            <span className="text-accent font-bold text-sm">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate text-lg group-hover:text-accent transition-colors">
                {exercise.name}
              </h3>
              {exercise.fullVideoUrl && (
                <button className="text-accent bg-accent/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} fill="currentColor" />
                </button>
              )}
            </div>
            {/* Expandable form cue */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
              aria-expanded={expanded}
              aria-label={`${expanded ? "Hide" : "Show"} form cue for ${exercise.name}`}
            >
              <span className="hover:underline">Form tip</span>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {expanded && (
              <p className="text-sm text-muted/90 mb-3 leading-relaxed expand-content bg-black/20 p-3 rounded-lg border border-white/5">
                {exercise.formCue}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-accent-dim text-accent border border-accent/20 shadow-[0_0_10px_rgba(192,255,0,0.1)]">
                {exercise.sets} × {exercise.reps}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted bg-white/5 px-2 py-0.5 rounded-full">
                {equipmentIcon(exercise.equipment)}
                {exercise.equipment}
              </span>
              <span className="text-xs text-muted/70 uppercase tracking-wider font-semibold">
                {exercise.muscleGroup}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Video Modal */}
      {showVideo && exercise.fullVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 fade-in-up">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setShowVideo(false)}
          />
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(192,255,0,0.15)] border border-white/10 z-10">
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setShowVideo(false)}
                className="bg-black/50 hover:bg-white/10 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`${exercise.fullVideoUrl}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-black to-black/80">
              <h2 className="text-2xl font-bold text-white mb-2">{exercise.name}</h2>
              <p className="text-muted">{exercise.formCue}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
