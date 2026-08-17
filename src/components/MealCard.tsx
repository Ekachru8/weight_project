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

  return (
    <div className="glass-card p-4 hover-lift">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon size={14} className={color} />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
          {mealTime}
        </span>
      </div>
      <h4 className="font-semibold text-foreground text-sm mb-1">
        {meal.name}
      </h4>
      <p className="text-xs text-muted mb-3 leading-relaxed">{meal.items}</p>
      <div className="flex gap-3 text-[10px]">
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
          {meal.calories} kcal
        </span>
        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
          P: {meal.protein}g
        </span>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
          C: {meal.carbs}g
        </span>
        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-medium">
          F: {meal.fat}g
        </span>
      </div>
    </div>
  );
}
