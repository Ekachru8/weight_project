import type { DietResult } from "@/lib/diet";
import {
  getSampleMealPlan,
  type DietType,
  type Meal,
  type MealPlan,
} from "@/lib/meals";

export interface AssistantIntake {
  foodsTheyEat: string;
  comfortableFoods: string;
  foodsToAvoid: string;
  allergies: string;
  cookingConstraints: string;
  mealsPerDay: number;
}

export interface DietAssistantPlan {
  meals: MealPlan;
  headline: string;
  summary: string;
  aiReasoning: string;
  swaps: string[];
  safetyNote: string;
  source?: "ai" | "fallback";
}

export interface DietAssistantContext {
  diet: Pick<DietResult, "targetCalories" | "proteinG" | "carbsG" | "fatG" | "tdee" | "targetWeightKg" | "estimatedWeeks">;
  user: {
    age?: number | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    targetWeightKg?: number | null;
    activityLevel?: string | null;
    goal?: string | null;
    dietPreference?: string | null;
  };
}

export const EMPTY_ASSISTANT_INTAKE: AssistantIntake = {
  foodsTheyEat: "",
  comfortableFoods: "",
  foodsToAvoid: "",
  allergies: "",
  cookingConstraints: "",
  mealsPerDay: 5,
};

function firstListItem(value: string): string | null {
  const item = value
    .split(/[,\n]/)
    .map((part) => part.trim())
    .find(Boolean);
  return item ? item.replace(/[.!?]+$/, "") : null;
}

function dietLabel(dietType: DietType): string {
  if (dietType === "non_vegetarian") return "non-vegetarian";
  if (dietType === "eggetarian") return "eggetarian";
  return "vegetarian";
}

function cloneMealPlan(mealPlan: MealPlan): MealPlan {
  return {
    ...mealPlan,
    breakfast: { ...mealPlan.breakfast },
    morningSnack: { ...mealPlan.morningSnack },
    lunch: { ...mealPlan.lunch },
    eveningSnack: { ...mealPlan.eveningSnack },
    dinner: { ...mealPlan.dinner },
  };
}

function recalculate(meals: Omit<MealPlan, "totalCalories" | "totalProtein" | "totalCarbs" | "totalFat">): MealPlan {
  const all = [meals.breakfast, meals.morningSnack, meals.lunch, meals.eveningSnack, meals.dinner];
  return {
    ...meals,
    totalCalories: all.reduce((sum, meal) => sum + meal.calories, 0),
    totalProtein: all.reduce((sum, meal) => sum + meal.protein, 0),
    totalCarbs: all.reduce((sum, meal) => sum + meal.carbs, 0),
    totalFat: all.reduce((sum, meal) => sum + meal.fat, 0),
  };
}

export function buildFallbackDietAssistantPlan(
  targetCalories: number,
  dietType: DietType,
  goal: string,
  weight: number,
  intake: AssistantIntake,
): DietAssistantPlan {
  const baseMeals = cloneMealPlan(getSampleMealPlan(targetCalories, dietType));
  const meals = sanitizeMealPlan(baseMeals, intake, dietType);
  const favorite = firstListItem(intake.comfortableFoods) || firstListItem(intake.foodsTheyEat);
  const avoid = firstListItem(intake.foodsToAvoid);
  const mealCount = Math.min(6, Math.max(3, intake.mealsPerDay || 5));
  const goalLabel = goal === "lose" ? "fat loss" : goal === "gain" ? "muscle gain" : "maintenance";
  const capitalizedAvoid = avoid ? avoid.charAt(0).toUpperCase() + avoid.slice(1) : "";
  
  const constraintsText = intake.cookingConstraints ? ` and fits your cooking routine` : "";
  const favText = favorite ? ` It prioritizes foods you enjoy, respects your exclusions,${constraintsText}.` : ` It uses familiar, balanced foods, respects your exclusions,${constraintsText}.`;
  const exclusionsText = avoid ? ` ${capitalizedAvoid} has been excluded based on your preferences.` : "";

  return {
    meals,
    headline: "A nutrition plan built around your lifestyle",
    summary: `A ${mealCount}-meal, ${dietLabel(dietType)} plan designed to support ${goalLabel} at approximately ${targetCalories} kcal per day.${favText}${exclusionsText}`,
    aiReasoning: `This starter plan keeps your ${dietLabel(dietType)} preference and ${goalLabel} goal in view while targeting approximately ${targetCalories} kcal for your current ${weight} kg body weight. Use the swaps below to make it fit your routine.`,
    swaps: [
      "Swap rice, roti, oats, or potatoes in similar portions when you want a different carbohydrate source.",
      "Swap chicken, fish, eggs, paneer, tofu, or lentils according to your diet preference and protein target.",
      intake.cookingConstraints
        ? `Cooking constraint noted: ${intake.cookingConstraints}. Choose the quickest preparation method available.`
        : "Batch-cook one protein and one carbohydrate source to make the plan easier to follow.",
    ],
    safetyNote: "This plan is intended for general wellness and is not medical advice. If you have a medical condition, take medication, are pregnant, or have a food allergy, consult a qualified clinician or dietitian before following it.",
    source: "fallback",
  };
}

export function sanitizeMealPlan(mealPlan: MealPlan, intake: AssistantIntake, dietType: DietType): MealPlan {
  const forbiddenText = `${intake.foodsToAvoid}, ${intake.allergies}`.toLowerCase();
  const forbiddenTerms = forbiddenText.split(/[,\n]/).map(t => t.trim()).filter(Boolean);

  const isForbidden = (text: string) => {
    const lower = text.toLowerCase();
    // Enforce diet types intrinsically
    if (dietType === "vegetarian" || dietType === "eggetarian") {
      if (/chicken|meat|fish|seafood|beef|pork|tuna|salmon/.test(lower)) return true;
    }
    if (dietType === "vegetarian") {
      if (/egg/.test(lower)) return true;
    }
    return forbiddenTerms.some(term => lower.includes(term));
  };

  const getAlternative = (originalCalories: number, originalProtein: number, originalCarbs: number, originalFat: number, baseName: string): Meal => {
    const safeProteins: string[] = [];
    if (!isForbidden("lentils") && !isForbidden("dal")) safeProteins.push("Lentils", "Dal");
    if (!isForbidden("paneer") && !isForbidden("dairy") && !isForbidden("milk")) safeProteins.push("Paneer");
    if (!isForbidden("tofu") && !isForbidden("soy")) safeProteins.push("Tofu");
    if (dietType !== "vegetarian" && !isForbidden("egg") && !isForbidden("eggs")) safeProteins.push("Eggs");
    if (dietType === "non_vegetarian" && !isForbidden("chicken")) safeProteins.push("Chicken");
    if (dietType === "non_vegetarian" && !isForbidden("fish") && !isForbidden("salmon") && !isForbidden("tuna")) safeProteins.push("Fish");
    if (safeProteins.length === 0) safeProteins.push("Plant Protein"); 

    const safeCarbs: string[] = [];
    if (!isForbidden("rice")) safeCarbs.push("Rice");
    if (!isForbidden("roti") && !isForbidden("wheat") && !isForbidden("gluten")) safeCarbs.push("Roti");
    if (!isForbidden("oats")) safeCarbs.push("Oats");
    if (!isForbidden("quinoa")) safeCarbs.push("Quinoa");
    if (!isForbidden("potato")) safeCarbs.push("Sweet Potato");
    if (safeCarbs.length === 0) safeCarbs.push("Mixed Veggies");

    const options: import("./meals").RecipeOption[] = [];
    for (let i = 0; i < 4; i++) {
       const p = safeProteins[i % safeProteins.length];
       const c = safeCarbs[i % safeCarbs.length];
       options.push({
         name: `${p} & ${c} Variation ${i + 1}`,
         ingredients: [`1 portion of ${p}`, `1 portion of ${c}`, "Spices to taste", "1 tsp oil"],
         instructions: ["Gather all ingredients.", "Prepare the protein and carbohydrates.", "Cook thoroughly.", "Serve hot."],
         prepMinutes: 15 + (i * 5),
         calories: originalCalories,
         protein: originalProtein,
         carbs: originalCarbs,
         fat: originalFat
       });
    }

    const p = safeProteins[0];
    const c = safeCarbs[0];

    return {
      name: `${p} & ${c} Safe Bowl`,
      items: `A safe, customized portion of ${p.toLowerCase()} and ${c.toLowerCase()} tailored to your restrictions.`,
      instructions: ["Gather all ingredients.", "Prepare the protein and carbohydrates.", "Cook thoroughly.", "Serve hot."],
      prepMinutes: 20,
      calories: originalCalories,
      protein: originalProtein,
      carbs: originalCarbs,
      fat: originalFat,
      options
    };
  };

  const sanitizeMeal = (meal: Meal): Meal => {
    const sanitizedOptions = meal.options?.filter(opt => {
      if (isForbidden(opt.name)) return false;
      if (opt.ingredients.some(isForbidden)) return false;
      if (opt.instructions.some(isForbidden)) return false;
      return true;
    }) || [];

    const isMainForbidden = isForbidden(meal.name) || isForbidden(meal.items) || (meal.instructions && meal.instructions.some(isForbidden));

    if (isMainForbidden || sanitizedOptions.length < 4) {
      const alt = getAlternative(meal.calories, meal.protein, meal.carbs, meal.fat, meal.name);
      
      if (isMainForbidden) {
         meal.name = alt.name;
         meal.items = alt.items;
         meal.instructions = alt.instructions;
         meal.prepMinutes = alt.prepMinutes;
      }
      
      while (sanitizedOptions.length < 4) {
         sanitizedOptions.push(alt.options![sanitizedOptions.length % 4]);
      }
    }
    
    meal.options = sanitizedOptions;
    return meal;
  };

  return recalculate({
    breakfast: sanitizeMeal(mealPlan.breakfast),
    morningSnack: sanitizeMeal(mealPlan.morningSnack),
    lunch: sanitizeMeal(mealPlan.lunch),
    eveningSnack: sanitizeMeal(mealPlan.eveningSnack),
    dinner: sanitizeMeal(mealPlan.dinner),
  });
}

export function normalizeAssistantPlan(value: unknown, fallback: DietAssistantPlan): DietAssistantPlan {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<DietAssistantPlan>;
  const rawMeals = candidate.meals as Partial<MealPlan> | undefined;
  const requiredMeals = ["breakfast", "morningSnack", "lunch", "eveningSnack", "dinner"] as const;

  if (!rawMeals || requiredMeals.some((key) => !isMeal(rawMeals[key]))) return fallback;

  const meals = recalculate({
    breakfast: rawMeals.breakfast as Meal,
    morningSnack: rawMeals.morningSnack as Meal,
    lunch: rawMeals.lunch as Meal,
    eveningSnack: rawMeals.eveningSnack as Meal,
    dinner: rawMeals.dinner as Meal,
  });

  return {
    meals,
    headline: typeof candidate.headline === "string" ? candidate.headline : fallback.headline,
    summary: typeof candidate.summary === "string" ? candidate.summary : fallback.summary,
    aiReasoning: typeof candidate.aiReasoning === "string" ? candidate.aiReasoning : fallback.aiReasoning,
    swaps: Array.isArray(candidate.swaps) && candidate.swaps.every((item) => typeof item === "string")
      ? candidate.swaps.slice(0, 5)
      : fallback.swaps,
    safetyNote: typeof candidate.safetyNote === "string" ? candidate.safetyNote : fallback.safetyNote,
    source: "ai",
  };
}

function isMeal(value: unknown): value is Meal {
  if (!value || typeof value !== "object") return false;
  const meal = value as Partial<Meal>;
  return (
    typeof meal.name === "string" &&
    typeof meal.items === "string" &&
    typeof meal.calories === "number" &&
    typeof meal.protein === "number" &&
    typeof meal.carbs === "number" &&
    typeof meal.fat === "number"
  );
}
