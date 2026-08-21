"use client";

import { useState } from "react";
import type { Meal } from "@/lib/meals";
import { Sun, Coffee, CloudSun, Sunset, Moon, ChevronDown, ChevronUp, Check, Clock } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  mealTime: string;
  selectedOptionIndex?: number;
  isManualSelection?: boolean;
  onSelectOption?: (index: number) => void;
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

export default function MealCard({ meal, mealTime, selectedOptionIndex = 0, isManualSelection = false, onSelectOption }: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const { icon: Icon, bg, color } = getMealIcon(mealTime);

  const options = meal.options || [];
  const hasOptions = options.length > 0;
  
  // Use selected option if available, otherwise use default meal
  const activeDish = hasOptions && selectedOptionIndex < options.length 
    ? options[selectedOptionIndex]
    : meal;

  // Generate a dynamic label based on macro balance
  let label = "Balanced";
  let labelColor = "text-muted bg-white/[0.05]";
  if (activeDish.protein > 35) {
    label = "High Protein";
    labelColor = "text-green-400 bg-green-400/10";
  } else if (activeDish.carbs < 20) {
    label = "Low Carb";
    labelColor = "text-sky-400 bg-sky-400/10";
  } else if (activeDish.calories < 250) {
    label = "Light Snack";
    labelColor = "text-accent bg-accent/10";
  } else if (mealTime.toLowerCase().includes("evening") || mealTime.toLowerCase().includes("dinner")) {
    label = "Recovery";
    labelColor = "text-purple-400 bg-purple-400/10";
  }

  return (
    <div className={`glass-card hover-lift relative overflow-hidden group transition-all duration-300 ${isExpanded ? "ring-1 ring-accent/30" : ""}`}>
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="p-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
              {activeDish.name}
            </h4>
            <p className="text-sm text-foreground/70 leading-relaxed pr-4">
              {'items' in activeDish ? activeDish.items : (activeDish.ingredients?.join(", ") || "")}
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 sm:gap-2 sm:text-right mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
            <div className="flex-1 sm:flex-none">
              <span className="text-xl font-black text-foreground">{activeDish.calories}</span>
              <span className="text-xs text-muted ml-1">kcal</span>
            </div>
            <div className="flex gap-2.5 text-xs font-semibold">
              <span className="text-green-400">{activeDish.protein}g P</span>
              <span className="text-blue-400">{activeDish.carbs}g C</span>
              <span className="text-orange-400">{activeDish.fat}g F</span>
            </div>
          </div>
        </div>

        {hasOptions && (
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <p className="text-[10px] uppercase tracking-wider text-accent font-bold">
              {isManualSelection ? "Selected by you" : "Recommended for today"}
            </p>
            <button 
              onClick={() => {
                setIsExpanded(!isExpanded);
                if (isExpanded) setShowAllOptions(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-white transition-colors btn-press"
            >
              Choose a different option
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Expanded Recipe Options */}
      {isExpanded && hasOptions && (
        <div className="px-5 pb-5 pt-2 bg-black/20 border-t border-white/5 relative z-10 fade-in-up">
          <p className="text-xs text-muted mb-4 font-medium italic">Choose a different option each day for variety.</p>
          <div className="grid lg:grid-cols-2 gap-4">
            {(showAllOptions ? options : options.slice(0, 4)).map((opt, idx) => {
              // Ensure we use the correct original index for selection logic
              const originalIdx = options.findIndex(o => o.name === opt.name);
              const isSelected = selectedOptionIndex === originalIdx;
              return (
                <div key={idx} className={`p-4 rounded-xl border transition-all ${isSelected ? "border-accent/40 bg-accent/[0.03] shadow-[0_0_15px_rgba(192,255,0,0.05)]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-bold text-foreground text-sm pr-2">{opt.name}</h5>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[9px] uppercase tracking-wider font-bold flex-shrink-0 flex items-center gap-1">
                        <Check size={10} /> Selected
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2.5 text-[10px] font-semibold mb-4">
                    <span className="text-muted flex items-center gap-1"><Clock size={12} /> {opt.prepMinutes} min</span>
                    <span className="text-foreground/80">{opt.calories} kcal</span>
                    <span className="text-green-400">{opt.protein}g P</span>
                    <span className="text-blue-400">{opt.carbs}g C</span>
                    <span className="text-orange-400">{opt.fat}g F</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h6 className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Ingredients</h6>
                      <ul className="space-y-1">
                        {opt.ingredients.map((ing, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                            <span className="text-accent/50 mt-0.5">•</span> {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">How to prepare</h6>
                      <ol className="space-y-1.5">
                        {opt.instructions.map((inst, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                            <span className="text-muted/60 font-semibold">{i + 1}.</span> {inst}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {!isSelected && onSelectOption && (
                    <button
                      onClick={() => {
                        onSelectOption(originalIdx);
                        setIsExpanded(false);
                        setShowAllOptions(false);
                      }}
                      className="w-full mt-4 py-2 rounded-lg border border-accent/30 text-accent hover:bg-accent/10 transition-colors text-xs font-bold btn-press"
                    >
                      Choose this recipe
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {options.length > 4 && !showAllOptions && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowAllOptions(true)}
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-muted hover:text-white hover:bg-white/[0.05] transition-all"
              >
                View more options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
