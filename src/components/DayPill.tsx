"use client";

interface DayPillProps {
  dayNumber: number;
  dayName: string;
  isActive?: boolean;
  isToday?: boolean;
  onClick?: () => void;
}

const dayColors: Record<string, string> = {
  Chest: "from-red-500/20 to-red-600/10 text-red-400 border-red-500/20",
  Back: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
  Legs: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
  Shoulders: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
  Arms: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
  Core: "from-pink-500/20 to-pink-600/10 text-pink-400 border-pink-500/20",
  Rest: "from-slate-500/20 to-slate-600/10 text-slate-400 border-slate-500/20",
};

export default function DayPill({
  dayNumber,
  dayName,
  isActive = false,
  isToday = false,
  onClick,
}: DayPillProps) {
  const colorClass = dayColors[dayName] || dayColors["Rest"];

  return (
    <button
      onClick={onClick}
      data-testid={`day-pill-${dayNumber}`}
      aria-label={`Day ${dayNumber}: ${dayName}${isToday ? " (Today)" : ""}`}
      className={`
        relative px-3 py-2 rounded-xl border transition-all duration-300
        bg-gradient-to-b ${colorClass}
        ripple-container
        ${isActive ? "ring-2 ring-accent scale-105 shadow-lg shadow-accent/10" : "hover:scale-[1.03]"}
        ${isToday ? "pulse-glow" : ""}
        ${onClick ? "cursor-pointer btn-press" : "cursor-default"}
      `}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        Day {dayNumber}
      </span>
      <p className="text-sm font-bold">{dayName}</p>
      {isToday && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
      )}
    </button>
  );
}
