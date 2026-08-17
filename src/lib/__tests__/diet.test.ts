import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateDiet,
} from "../diet";

describe("calculateBMR", () => {
  it("calculates BMR correctly for a male", () => {
    // 10 × 70 + 6.25 × 175 − 5 × 25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
    const result = calculateBMR(70, 175, 25, "male");
    expect(result).toBeCloseTo(1673.75, 1);
  });

  it("calculates BMR correctly for a female", () => {
    // 10 × 60 + 6.25 × 165 − 5 × 30 − 161 = 600 + 1031.25 - 150 - 161 = 1320.25
    const result = calculateBMR(60, 165, 30, "female");
    expect(result).toBeCloseTo(1320.25, 1);
  });

  it("returns higher BMR for male vs female with same stats", () => {
    const male = calculateBMR(70, 175, 25, "male");
    const female = calculateBMR(70, 175, 25, "female");
    expect(male).toBeGreaterThan(female);
    expect(male - female).toBe(166); // +5 vs -161 = 166 difference
  });

  it("returns lower BMR with higher age", () => {
    const young = calculateBMR(70, 175, 20, "male");
    const old = calculateBMR(70, 175, 50, "male");
    expect(young).toBeGreaterThan(old);
  });

  it("returns higher BMR with more weight", () => {
    const light = calculateBMR(50, 175, 25, "male");
    const heavy = calculateBMR(90, 175, 25, "male");
    expect(heavy).toBeGreaterThan(light);
  });

  it("returns higher BMR with more height", () => {
    const short = calculateBMR(70, 150, 25, "male");
    const tall = calculateBMR(70, 200, 25, "male");
    expect(tall).toBeGreaterThan(short);
  });
});

describe("calculateTDEE", () => {
  it("applies sedentary multiplier (1.2)", () => {
    expect(calculateTDEE(2000, "sedentary")).toBe(2400);
  });

  it("applies light multiplier (1.375)", () => {
    expect(calculateTDEE(2000, "light")).toBe(2750);
  });

  it("applies moderate multiplier (1.55)", () => {
    expect(calculateTDEE(2000, "moderate")).toBe(3100);
  });

  it("applies very_active multiplier (1.725)", () => {
    expect(calculateTDEE(2000, "very_active")).toBe(3450);
  });

  it("applies extra_active multiplier (1.9)", () => {
    expect(calculateTDEE(2000, "extra_active")).toBe(3800);
  });

  it("rounds to nearest integer", () => {
    const result = calculateTDEE(1673.75, "moderate");
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calculateTargetCalories", () => {
  it("subtracts 500 for lose goal", () => {
    const result = calculateTargetCalories(2500, "lose", "male");
    expect(result.calories).toBe(2000);
    expect(result.isBelowFloor).toBe(false);
  });

  it("adds 350 for gain goal", () => {
    const result = calculateTargetCalories(2500, "gain", "male");
    expect(result.calories).toBe(2850);
    expect(result.isBelowFloor).toBe(false);
  });

  it("keeps TDEE for maintain goal", () => {
    const result = calculateTargetCalories(2500, "maintain", "male");
    expect(result.calories).toBe(2500);
    expect(result.isBelowFloor).toBe(false);
  });

  it("enforces male safety floor of 1500", () => {
    const result = calculateTargetCalories(1800, "lose", "male");
    // 1800 - 500 = 1300, below 1500 floor
    expect(result.calories).toBe(1500);
    expect(result.isBelowFloor).toBe(true);
    expect(result.cautionMessage).toBeTruthy();
  });

  it("enforces female safety floor of 1200", () => {
    const result = calculateTargetCalories(1500, "lose", "female");
    // 1500 - 500 = 1000, below 1200 floor
    expect(result.calories).toBe(1200);
    expect(result.isBelowFloor).toBe(true);
    expect(result.cautionMessage).toBeTruthy();
  });

  it("does not trigger floor for female at exactly 1200", () => {
    const result = calculateTargetCalories(1700, "lose", "female");
    // 1700 - 500 = 1200, exactly at floor
    expect(result.calories).toBe(1200);
    expect(result.isBelowFloor).toBe(false);
  });

  it("returns null caution message when not below floor", () => {
    const result = calculateTargetCalories(3000, "lose", "male");
    expect(result.cautionMessage).toBeNull();
  });
});

describe("calculateMacros", () => {
  it("calculates protein at 1.8g per kg bodyweight", () => {
    const result = calculateMacros(2000, 70);
    expect(result.proteinG).toBe(126); // 1.8 * 70 = 126
  });

  it("calculates fat at 25% of calories", () => {
    const result = calculateMacros(2000, 70);
    expect(result.fatG).toBe(56); // (2000 * 0.25) / 9 ≈ 55.6 → 56
  });

  it("fills remainder with carbs", () => {
    const result = calculateMacros(2000, 70);
    const proteinCals = result.proteinG * 4;
    const fatCals = result.fatG * 9;
    const carbCals = result.carbsG * 4;
    // Total should be close to 2000
    expect(proteinCals + fatCals + carbCals).toBeGreaterThan(1900);
    expect(proteinCals + fatCals + carbCals).toBeLessThanOrEqual(2000);
  });

  it("returns 0 carbs when protein+fat exceed calories", () => {
    // Very low calories but heavy person
    const result = calculateMacros(500, 200);
    // Protein: 360g (1440 cal), Fat: 14g (126 cal) — exceeds 500
    // Carbs should be max(0, ...) = 0
    expect(result.carbsG).toBe(0);
  });
});

describe("calculateDiet", () => {
  it("returns a complete DietResult", () => {
    const result = calculateDiet(70, 175, 25, "male", "moderate", "lose");
    expect(result).toHaveProperty("bmr");
    expect(result).toHaveProperty("tdee");
    expect(result).toHaveProperty("targetCalories");
    expect(result).toHaveProperty("proteinG");
    expect(result).toHaveProperty("fatG");
    expect(result).toHaveProperty("carbsG");
    expect(result).toHaveProperty("isBelowFloor");
    expect(result).toHaveProperty("cautionMessage");
  });

  it("returns rounded BMR", () => {
    const result = calculateDiet(70, 175, 25, "male", "moderate", "lose");
    expect(Number.isInteger(result.bmr)).toBe(true);
  });

  it("returns coherent values (target <= TDEE for lose)", () => {
    const result = calculateDiet(70, 175, 25, "male", "moderate", "lose");
    expect(result.targetCalories).toBeLessThan(result.tdee);
  });

  it("returns coherent values (target > TDEE for gain)", () => {
    const result = calculateDiet(70, 175, 25, "male", "moderate", "gain");
    expect(result.targetCalories).toBeGreaterThan(result.tdee);
  });

  it("returns coherent values (target === TDEE for maintain)", () => {
    const result = calculateDiet(70, 175, 25, "male", "moderate", "maintain");
    expect(result.targetCalories).toBe(result.tdee);
  });
});
