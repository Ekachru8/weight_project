"use client";

import { useMemo } from "react";

interface CalendarHeatmapProps {
  logs: Array<{
    date: string;
    completed: boolean;
    dayNumber: number;
  }>;
  registrationDate: string;
}

export default function CalendarHeatmap({
  logs,
  registrationDate,
}: CalendarHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const logMap = new Map<string, { completed: boolean; dayNumber: number }>();
    for (const log of logs) {
      logMap.set(log.date, {
        completed: log.completed,
        dayNumber: log.dayNumber,
      });
    }

    const today = new Date();
    const todayStr = formatDateLocal(today);

    // Go back 13 weeks (91 days)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);
    // Align to the nearest Monday
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const regDate = new Date(registrationDate);

    const weeks: Array<
      Array<{
        date: string;
        status: "completed" | "skipped" | "rest" | "today" | "future" | "empty";
        dayNum: number;
      }>
    > = [];

    const monthLabelsArr: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    const current = new Date(startDate);
    let weekIndex = 0;
    let currentWeek: typeof weeks[0] = [];

    while (current <= today || currentWeek.length > 0) {
      if (current > today && currentWeek.length === 0) break;

      const dateStr = formatDateLocal(current);
      const dayOfWeek = current.getDay();

      // Track month labels
      if (current.getMonth() !== lastMonth) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        monthLabelsArr.push({
          label: monthNames[current.getMonth()],
          weekIndex,
        });
        lastMonth = current.getMonth();
      }

      // Determine day number in the rotation
      const regDay = new Date(
        regDate.getFullYear(),
        regDate.getMonth(),
        regDate.getDate()
      );
      const targetDay = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      const diffDays = Math.floor(
        (targetDay.getTime() - regDay.getTime()) / (1000 * 60 * 60 * 24)
      );
      const dayNum = ((diffDays % 7) + 7) % 7 + 1;

      let status: typeof weeks[0][0]["status"] = "empty";

      if (current > today) {
        status = "future";
      } else if (current < regDate) {
        status = "empty";
      } else if (dateStr === todayStr) {
        const log = logMap.get(dateStr);
        if (log?.completed) status = "completed";
        else if (dayNum === 7) status = "rest";
        else status = "today";
      } else {
        const log = logMap.get(dateStr);
        if (dayNum === 7) {
          status = "rest";
        } else if (log?.completed) {
          status = "completed";
        } else {
          status = "skipped";
        }
      }

      currentWeek.push({ date: dateStr, status, dayNum });

      // Sunday = end of week display row (we use Mon-Sun layout)
      if (dayOfWeek === 0 || current >= today) {
        if (currentWeek.length > 0) {
          // Pad to 7 if incomplete
          while (currentWeek.length < 7) {
            currentWeek.push({ date: "", status: "future", dayNum: 0 });
          }
          weeks.push(currentWeek);
          currentWeek = [];
          weekIndex++;
        }
        if (current >= today) break;
      }

      current.setDate(current.getDate() + 1);
    }

    return { weeks, monthLabels: monthLabelsArr };
  }, [logs, registrationDate]);

  const getColor = (
    status: "completed" | "skipped" | "rest" | "today" | "future" | "empty"
  ) => {
    switch (status) {
      case "completed":
        return "bg-accent";
      case "skipped":
        return "bg-red-500/40";
      case "rest":
        return "bg-blue-500/30";
      case "today":
        return "bg-accent/30 ring-2 ring-accent";
      case "future":
        return "bg-transparent";
      case "empty":
        return "bg-white/[0.03]";
    }
  };

  const getTooltip = (cell: typeof weeks[0][0]) => {
    if (!cell.date) return "";
    const statusText = {
      completed: "✅ Completed",
      skipped: "❌ Skipped",
      rest: "🧘 Rest Day",
      today: "📍 Today",
      future: "",
      empty: "",
    };
    return `${cell.date} — Day ${cell.dayNum} — ${statusText[cell.status]}`;
  };

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="glass-card p-4 overflow-x-auto hover-lift">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Activity Heatmap
      </h3>

      {/* Month labels */}
      <div className="flex mb-1 pl-6">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-muted font-medium"
            style={{
              position: "relative",
              left: `${m.weekIndex * 18}px`,
              marginRight: "auto",
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 pt-0.5">
          {dayLabels.map((d, i) => (
            <span
              key={i}
              className="text-[9px] text-muted h-[14px] flex items-center justify-center w-4"
            >
              {i % 2 === 0 ? d : ""}
            </span>
          ))}
        </div>

        {/* Grid with pop-in animation */}
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`heatmap-cell heatmap-pop ${getColor(cell.status)} cursor-default`}
                  style={{ animationDelay: `${wi * 20 + di * 10}ms` }}
                  title={getTooltip(cell)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> Completed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500/40" /> Skipped
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/30" /> Rest
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent/30 ring-1 ring-accent" />{" "}
          Today
        </span>
      </div>
    </div>
  );
}

function formatDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
