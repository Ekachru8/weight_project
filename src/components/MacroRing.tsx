"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MacroRingProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  calories: number;
}

export default function MacroRing({
  proteinG,
  carbsG,
  fatG,
  calories,
}: MacroRingProps) {
  const data = [
    { name: "Protein", value: proteinG * 4, grams: proteinG, color: "#a3e635" },
    { name: "Carbs", value: carbsG * 4, grams: carbsG, color: "#38bdf8" },
    { name: "Fat", value: fatG * 9, grams: fatG, color: "#fb923c" },
  ];

  const totalCals = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card p-6 hover-lift">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Daily Macros
      </h3>
      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="glass-card px-3 py-2 text-xs border border-border shadow-lg">
                      <p className="font-semibold" style={{ color: d.color }}>
                        {d.name}
                      </p>
                      <p className="text-foreground">
                        {d.grams}g ({Math.round((d.value / totalCals) * 100)}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-foreground">
              {calories}
            </span>
            <span className="text-[10px] text-muted">kcal</span>
          </div>
        </div>

        {/* Macro breakdown */}
        <div className="flex flex-col gap-3 flex-1">
          {data.map((d) => {
            const percent = totalCals > 0 ? Math.round((d.value / totalCals) * 100) : 0;
            return (
              <div key={d.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-foreground">
                      {d.name}
                    </span>
                    <span className="text-xs text-muted">
                      {percent}%
                    </span>
                  </div>
                  {/* Animated bar */}
                  <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-fill-animate"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: d.color,
                        animationDelay: "300ms",
                      }}
                    />
                  </div>
                  <p className="text-lg font-bold mt-0.5" style={{ color: d.color }}>
                    {d.grams}
                    <span className="text-xs font-normal text-muted ml-0.5">
                      g
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
