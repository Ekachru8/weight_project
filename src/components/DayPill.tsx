"use client";

interface DayPillProps {
  dayNumber: number;
  dayName: string;
  isActive?: boolean;
  isToday?: boolean;
  onClick?: () => void;
}

const dayColors: Record<string, string> = {
  Chest: "text-rose-300",
  Back: "text-blue-300",
  Legs: "text-purple-300",
  Shoulders: "text-amber-300",
  Arms: "text-emerald-300",
  Core: "text-pink-300",
  Rest: "text-slate-400",
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
        relative px-4 py-2.5 rounded-2xl border transition-all duration-500 ease-out
        shrink-0 min-w-[76px] flex flex-col items-center justify-center gap-0.5
        backdrop-blur-md overflow-hidden group
        ${isActive 
          ? `bg-white/[0.08] border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] ${colorClass}` 
          : "bg-white/[0.02] border-white/[0.05] text-muted hover:bg-white/[0.04] hover:border-white/10 hover:text-white"}
        ${isToday ? "ring-1 ring-accent/30 shadow-[0_0_20px_rgba(192,255,0,0.1)]" : ""}
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500 ${isActive ? "opacity-80" : "opacity-50 group-hover:opacity-80"} whitespace-nowrap`}>
        Day {dayNumber}
      </span>
      <p className={`text-sm font-semibold whitespace-nowrap transition-colors duration-500 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{dayName}</p>
      {isToday && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
      )}
    </button>
  );
}
