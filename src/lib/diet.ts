/**
 * Diet calculation functions using Mifflin-St Jeor equation.
 */

export type Gender = "male" | "female";
export type Goal = "lose" | "gain" | "maintain";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "extra_active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export interface DietResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  isBelowFloor: boolean;
  cautionMessage: string | null;
  targetWeightKg: number | null;
  estimatedWeeks: number | null;
}

/**
 * Calculate BMR using Mifflin-St Jeor equation.
 * Men:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 * Women: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

/**
 * Calculate Total Daily Energy Expenditure.
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Apply the user's goal to TDEE to get target calories.
 * - Lose (with target): TDEE - 300
 * - Gain (with target): TDEE + 250
 * - Maintain: TDEE
 * Safety floor: 1200 kcal (women) / 1500 kcal (men)
 */
export function calculateTargetCalories(
  tdee: number,
  goal: Goal,
  gender: Gender,
  weightKg?: number,
  targetWeightKg?: number
): { calories: number; isBelowFloor: boolean; cautionMessage: string | null; estimatedWeeks: number | null } {
  let calories = tdee;
  let estimatedWeeks: number | null = null;
  let dailyCalorieAdjustment = 0;

  if (weightKg !== undefined && targetWeightKg !== undefined) {
    const weightDifference = Math.abs(weightKg - targetWeightKg);
    if (goal === "lose") {
      dailyCalorieAdjustment = 300; // max adjustment is implicitly maintained, wait, the prompt says "Allow a max of 500". Since we hardcode 300 here, it's fine.
      calories = tdee - dailyCalorieAdjustment;
      estimatedWeeks = weightDifference > 0 ? (weightDifference * 7700) / (dailyCalorieAdjustment * 7) : 0;
    } else if (goal === "gain") {
      dailyCalorieAdjustment = 250;
      calories = tdee + dailyCalorieAdjustment;
      estimatedWeeks = weightDifference > 0 ? (weightDifference * 7700) / (dailyCalorieAdjustment * 7) : 0;
    } else {
      calories = tdee;
    }
  } else {
    switch (goal) {
      case "lose":
        calories = tdee - 500;
        break;
      case "gain":
        calories = tdee + 350;
        break;
      case "maintain":
        calories = tdee;
        break;
    }
  }

  const floor = gender === "male" ? 1500 : 1200;
  const isBelowFloor = calories < floor;

  let cautionMessage: string | null = null;
  if (isBelowFloor) {
    cautionMessage = `Your calculated target of ${calories} kcal is unusually low — consider seeking professional guidance. Showing ${floor} kcal as the minimum safe target.`;
    calories = floor;
  }

  return { calories: Math.round(calories), isBelowFloor, cautionMessage, estimatedWeeks };
}

/**
 * Calculate macro breakdown:
 * - Protein: 1.8 g/kg bodyweight
 * - Fat: 25% of total calories (9 cal/g)
 * - Carbs: remainder
 */
export function calculateMacros(
  targetCalories: number,
  weightKg: number
): { proteinG: number; fatG: number; carbsG: number } {
  const proteinG = Math.round(1.8 * weightKg);
  const fatG = Math.round((targetCalories * 0.25) / 9);
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const carbsG = Math.round(
    Math.max(0, targetCalories - proteinCals - fatCals) / 4
  );

  return { proteinG, fatG, carbsG };
}

/**
 * Full diet calculation pipeline.
 */
export function calculateDiet(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal,
  targetWeightKg?: number
): DietResult {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const {
    calories: targetCalories,
    isBelowFloor,
    cautionMessage,
    estimatedWeeks,
  } = calculateTargetCalories(tdee, goal, gender, weightKg, targetWeightKg);
  const { proteinG, fatG, carbsG } = calculateMacros(targetCalories, weightKg);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    proteinG,
    fatG,
    carbsG,
    isBelowFloor,
    cautionMessage,
    targetWeightKg: targetWeightKg ?? null,
    estimatedWeeks: estimatedWeeks !== null ? Math.round(estimatedWeeks) : null,
  };
}
