"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

interface WeightEntry {
  date: string;
  weightKg: number;
}

interface WeightChartProps {
  data: WeightEntry[];
  targetWeight?: number;
}

export default function WeightChart({ data, targetWeight }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent-dim flex items-center justify-center mx-auto mb-3">
          <svg className="text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <p className="text-foreground font-semibold text-sm mb-1">No weight data yet</p>
        <p className="text-muted text-xs">
          Log your weight to see the trend chart here!
        </p>
      </div>
    );
  }

  const minWeight = Math.min(...data.map((d) => d.weightKg));
  const maxWeight = Math.max(...data.map((d) => d.weightKg));
  const padding = 3;

  return (
    <div className="glass-card p-5 hover-lift">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Weight Trend
      </h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3e635" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickFormatter={(v) => {
                const parts = v.split("-");
                return `${parts[1]}/${parts[2]}`;
              }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              domain={[
                Math.floor(
                  (targetWeight
                    ? Math.min(minWeight, targetWeight)
                    : minWeight) - padding
                ),
                Math.ceil(
                  (targetWeight
                    ? Math.max(maxWeight, targetWeight)
                    : maxWeight) + padding
                ),
              ]}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(26, 31, 46, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "#6b7280" }}
              itemStyle={{ color: "#a3e635" }}
              formatter={(value: number) => [`${value} kg`, "Weight"]}
            />
            {targetWeight && (
              <ReferenceLine
                y={targetWeight}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: `Goal: ${targetWeight}kg`,
                  fill: "#f59e0b",
                  fontSize: 10,
                  position: "right",
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="weightKg"
              stroke="#a3e635"
              strokeWidth={2}
              fill="url(#weightGradient)"
              dot={{ fill: "#a3e635", r: 3, strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: "#a3e635",
                strokeWidth: 2,
                stroke: "#0b0f14",
              }}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
