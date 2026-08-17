"use client";

import { useState } from "react";
import { Dumbbell, Zap, CircleDot, ChevronDown, ChevronUp } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  muscleGroup: string;
  formCue: string;
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

  return (
    <div
      className="glass-card p-4 hover-lift border-glow fade-in-up opacity-0"
      style={{ animationDelay: `${index * 80}ms` }}
      data-testid={`workout-card-${exercise.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Number badge with gradient */}
        <div className="w-8 h-8 rounded-lg number-badge flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-accent font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {exercise.name}
            </h3>
          </div>
          {/* Expandable form cue */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2 group"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Hide" : "Show"} form cue for ${exercise.name}`}
          >
            <span className="group-hover:underline">Form tip</span>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {expanded && (
            <p className="text-xs text-muted mb-2 leading-relaxed expand-content">
              {exercise.formCue}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-accent-dim text-accent">
              {exercise.sets} × {exercise.reps}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              {equipmentIcon(exercise.equipment)}
              {exercise.equipment}
            </span>
            <span className="text-xs text-muted/70">
              {exercise.muscleGroup}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
