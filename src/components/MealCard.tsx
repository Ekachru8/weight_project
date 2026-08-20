"use client";

import type { Meal } from "@/lib/meals";
import { Sun, Coffee, CloudSun, Sunset, Moon } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  mealTime: string;
}

const getMealIcon = (mealTime: string) => {
  const lower = mealTime.toLowerCase();
  if (lower.includes("breakfast")) return { icon: Sun, bg: "meal-icon-breakfast", color: "text-amber-400" };
  if (lower.includes("morning")) return { icon: Coffee, bg: "meal-icon-snack", color: "text-accent" };
  if (lower.includes("lunch")) return { icon: CloudSun, bg: "meal-icon-lunch", color: "text-sky-400" };
  if (lower.includes("evening")) return { icon: Sunset, bg: "meal-icon-snack", color: "text-orange-400" };
  if (lower.includes("dinner")) return { icon: Moon, bg: "meal-icon-dinner", color: "text-purple-400" };
  return { icon: Coffee, bg: "meal-icon-snack", color: "text-muted" };
};

export default function MealCard({ meal, mealTime }: MealCardProps) {
  const { icon: Icon, bg, color } = getMealIcon(mealTime);

  // Generate a dynamic label based on macro balance
  let label = "Balanced";
  let labelColor = "text-muted bg-white/[0.05]";
  if (meal.protein > 35) {
    label = "High Protein";
    labelColor = "text-green-400 bg-green-400/10";
  } else if (meal.carbs < 20) {
    label = "Low Carb";
    labelColor = "text-sky-400 bg-sky-400/10";
  } else if (meal.calories < 250) {
    label = "Light Snack";
    labelColor = "text-accent bg-accent/10";
  } else if (mealTime.toLowerCase().includes("evening") || mealTime.toLowerCase().includes("dinner")) {
    label = "Recovery";
    labelColor = "text-purple-400 bg-purple-400/10";
  }

  return (
    <div className="glass-card p-5 hover-lift relative overflow-hidden group">
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shadow-sm`}>
              <Icon size={16} className={color} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted font-bold">
              {mealTime}
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${labelColor}`}>
              {label}
            </span>
          </div>
          
          <h4 className="font-bold text-foreground text-base mb-1.5">
            {meal.name}
          </h4>
          <p className="text-sm text-foreground/70 leading-relaxed pr-4">{meal.items}</p>
        </div>

        <div className="flex sm:flex-col gap-3 sm:gap-2 sm:text-right mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
          <div className="flex-1 sm:flex-none">
            <span className="text-xl font-black text-foreground">{meal.calories}</span>
            <span className="text-xs text-muted ml-1">kcal</span>
          </div>
          <div className="flex gap-2.5 text-xs font-semibold">
            <span className="text-green-400">{meal.protein}g P</span>
            <span className="text-blue-400">{meal.carbs}g C</span>
            <span className="text-orange-400">{meal.fat}g F</span>
          </div>
        </div>
      </div>
    </div>
  );
}
