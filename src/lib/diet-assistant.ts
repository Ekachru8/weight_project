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
  diet: Pick<DietResult, "targetCalories" | "proteinG" | "carbsG" | "fatG" | "tdee">;
  user: {
    age?: number | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
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
  const meals = applyAllergyGuard(cloneMealPlan(getSampleMealPlan(targetCalories, dietType)), intake.allergies);
  const favorite = firstListItem(intake.comfortableFoods) || firstListItem(intake.foodsTheyEat);
  const avoid = firstListItem(intake.foodsToAvoid);
  const mealCount = Math.min(6, Math.max(3, intake.mealsPerDay || 5));
  const goalLabel = goal === "lose" ? "fat-loss" : goal === "gain" ? "muscle-gain" : "maintenance";
  const foodLine = favorite
    ? ` It gives priority to foods you are comfortable with, starting with ${favorite}.`
    : " It uses familiar, balanced foods that are easy to swap as your preferences become clearer.";
  const avoidLine = avoid ? ` I have left out ${avoid} from the suggestions.` : "";

  return {
    meals,
    headline: `${goalLabel[0].toUpperCase()}${goalLabel.slice(1)} plan, made around you`,
    summary: `A ${mealCount}-meal ${dietLabel(dietType)} day targeting about ${targetCalories} kcal and your existing macro targets.${foodLine}${avoidLine}`,
    aiReasoning: `This starter plan keeps your ${dietLabel(dietType)} preference and ${goalLabel} goal in view while targeting approximately ${targetCalories} kcal for your current ${weight} kg body weight. Use the swaps below to make it fit your routine.`,
    swaps: [
      "Swap rice, roti, oats, or potatoes in similar portions when you want a different carbohydrate source.",
      "Swap chicken, fish, eggs, paneer, tofu, or lentils according to your diet preference and protein target.",
      intake.cookingConstraints
        ? `Cooking constraint noted: ${intake.cookingConstraints}. Choose the quickest preparation method available.`
        : "Batch-cook one protein and one carbohydrate source to make the plan easier to follow.",
    ],
    safetyNote: "This is general wellness guidance, not medical care. If you have a medical condition, take medication, are pregnant, or have a food allergy, confirm the plan with a qualified clinician or dietitian.",
    source: "fallback",
  };
}

function applyAllergyGuard(mealPlan: MealPlan, allergies: string): MealPlan {
  const allergyText = allergies.toLowerCase();
  if (!allergyText) return mealPlan;

  const rules = [
    { pattern: /peanut|nut|almond|walnut|cashew/, label: "nut-free" },
    { pattern: /dairy|milk|lactose|cheese|paneer|yogurt|curd/, label: "dairy-free" },
    { pattern: /egg/, label: "egg-free" },
    { pattern: /fish|salmon|tuna|seafood|shellfish|shrimp|prawn/, label: "seafood-free" },
    { pattern: /soy|tofu|soya/, label: "soy-free" },
    { pattern: /gluten|wheat/, label: "gluten-free" },
  ];
  const matched = rules.filter((rule) => rule.pattern.test(allergyText));
  if (matched.length === 0) return mealPlan;

  const labels = matched.map((rule) => rule.label).join(" / ");
  const protect = (meal: Meal): Meal => {
    if (!matched.some((rule) => rule.pattern.test(`${meal.name} ${meal.items}`.toLowerCase()))) return meal;
    return {
      ...meal,
      name: `${labels} alternative needed`,
      items: `Replace this meal with a verified ${labels} equivalent using a similar portion and nutrition profile.`,
    };
  };

  return recalculate({
    breakfast: protect(mealPlan.breakfast),
    morningSnack: protect(mealPlan.morningSnack),
    lunch: protect(mealPlan.lunch),
    eveningSnack: protect(mealPlan.eveningSnack),
    dinner: protect(mealPlan.dinner),
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
