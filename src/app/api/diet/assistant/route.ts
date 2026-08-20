import { NextResponse } from "next/server";
import {
  buildFallbackDietAssistantPlan,
  sanitizeMealPlan,
  normalizeAssistantPlan,
  type AssistantIntake,
  type DietAssistantContext,
} from "@/lib/diet-assistant";
import type { DietType, Meal } from "@/lib/meals";

const DIET_TYPES = new Set<DietType>([
  "vegetarian",
  "non_vegetarian",
  "eggetarian",
]);

const RECIPE_OPTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    mealType: { type: "string" },
    ingredients: { type: "array", items: { type: "string" } },
    instructions: { type: "array", items: { type: "string" } },
    prepMinutes: { type: "number" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
  },
  required: ["name", "mealType", "ingredients", "instructions", "prepMinutes", "calories", "protein", "carbs", "fat"],
};

const MEAL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    items: { type: "string" },
    instructions: { type: "array", items: { type: "string" } },
    prepMinutes: { type: "number" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    options: { type: "array", items: RECIPE_OPTION_SCHEMA },
  },
  required: ["name", "items", "instructions", "prepMinutes", "calories", "protein", "carbs", "fat", "options"],
};

const METADATA_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    aiReasoning: { type: "string" },
    swaps: { type: "array", items: { type: "string" } },
    safetyNote: { type: "string" },
  },
  required: ["headline", "summary", "aiReasoning", "swaps", "safetyNote"],
};

function text(value: unknown, maxLength = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseIntake(value: unknown): AssistantIntake {
  const input = value && typeof value === "object" ? (value as Partial<AssistantIntake>) : {};
  const mealsPerDay = Number(input.mealsPerDay);
  return {
    foodsTheyEat: text(input.foodsTheyEat),
    comfortableFoods: text(input.comfortableFoods),
    foodsToAvoid: text(input.foodsToAvoid),
    allergies: text(input.allergies),
    cookingConstraints: text(input.cookingConstraints),
    mealsPerDay: Number.isFinite(mealsPerDay) ? Math.min(6, Math.max(3, mealsPerDay)) : 5,
  };
}

function parseContext(value: unknown): DietAssistantContext | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<DietAssistantContext>;
  const diet = input.diet;
  const user = input.user;

  if (!diet || typeof diet.targetCalories !== "number" || !user || typeof user !== "object") {
    return null;
  }

  return {
    diet: {
      targetCalories: diet.targetCalories,
      proteinG: typeof diet.proteinG === "number" ? diet.proteinG : 0,
      carbsG: typeof diet.carbsG === "number" ? diet.carbsG : 0,
      fatG: typeof diet.fatG === "number" ? diet.fatG : 0,
      tdee: typeof diet.tdee === "number" ? diet.tdee : diet.targetCalories,
      targetWeightKg: typeof diet.targetWeightKg === "number" ? diet.targetWeightKg : null,
      estimatedWeeks: typeof diet.estimatedWeeks === "number" ? diet.estimatedWeeks : null,
    },
    user,
  };
}

function getDietType(value: unknown): DietType {
  return typeof value === "string" && DIET_TYPES.has(value as DietType) ? (value as DietType) : "non_vegetarian";
}

function extractJson(response: unknown): unknown {
  if (!response || typeof response !== "object") return null;
  const content = (response as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function fetchOpenAI(apiKey: string, schema: any, systemPrompt: string, userPayload: any) {
  const baseUrl = (process.env.OPENAI_API_BASE || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.DIET_ASSISTANT_MODEL || "gpt-4o-mini";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(45000), // Extended timeout for safety
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_completion_tokens: 3000, // Safe for 8 recipes
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Provider error: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return extractJson(json);
}

export async function POST(request: Request) {
  let fallbackPlan: ReturnType<typeof buildFallbackDietAssistantPlan> | null = null;

  try {
    const body = await request.json();
    const context = parseContext(body?.context);
    const userMessage = typeof body?.userMessage === "string" ? body.userMessage : null;
    
    if (!context) {
      return NextResponse.json({ error: "A valid diet context is required." }, { status: 400 });
    }

    const intake = parseIntake(body?.intake);
    const dietType = getDietType(body?.dietType);
    const goal = context.user.goal === "lose" || context.user.goal === "gain" ? context.user.goal : "maintain";
    const weight = typeof context.user.weightKg === "number" ? context.user.weightKg : 70;

    fallbackPlan = buildFallbackDietAssistantPlan(context.diet.targetCalories, dietType, goal, weight, intake);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ plan: fallbackPlan, provider: "fallback" });
    }

    const userPayload = {
      profile: {
        age: context.user.age ?? null,
        gender: context.user.gender ?? null,
        heightCm: context.user.heightCm ?? null,
        weightKg: weight,
        targetWeightKg: context.diet.targetWeightKg ?? null,
        activityLevel: context.user.activityLevel ?? null,
        goal,
        dietType,
        tdee: context.diet.tdee,
        targetCalories: context.diet.targetCalories,
        estimatedWeeks: context.diet.estimatedWeeks ?? null,
        macros: { proteinG: context.diet.proteinG, carbsG: context.diet.carbsG, fatG: context.diet.fatG },
      },
      intake,
      userMessage,
    };

    // 1. Fetch metadata
    const metadataPrompt = [
      "You are a cautious nutrition-planning assistant.",
      "Return only valid JSON matching the requested shape.",
      "Set headline to 'A nutrition plan built around your lifestyle'.",
      "Set summary to follow this exact format: 'A <meals>-meal, <dietType> plan designed to support <goal> at approximately <calories> kcal per day. It prioritizes foods you enjoy, respects your exclusions, and fits your cooking routine.'",
      "Set safetyNote strictly to: 'This plan is intended for general wellness and is not medical advice. If you have a medical condition, take medication, are pregnant, or have a food allergy, consult a qualified clinician or dietitian before following it.'",
      `The JSON shape is: ${JSON.stringify(METADATA_SCHEMA)}`,
    ].join(" ");

    const metaPromise = fetchOpenAI(apiKey, METADATA_SCHEMA, metadataPrompt, userPayload);

    // 2. Fetch meals concurrently
    const mealTypes = ["breakfast", "morningSnack", "lunch", "eveningSnack", "dinner"] as const;
    const mealPromises = mealTypes.map(async (mealType) => {
      const mealPrompt = [
        "You are a nutrition-planning assistant. Return only valid JSON matching the requested shape.",
        "Generate meal-type-specific recipes. Breakfast must contain breakfast dishes only. Morning snacks must be light snack foods only. Lunch and dinner must be complete meals.",
        "Do not reuse the same recipe template across meal types. Return at least 8 genuinely different options for each meal slot. Every option must have the correct mealType.",
        "Never include a listed allergen or a food the user asked to avoid.",
        "Respect vegetarian and eggetarian restrictions strictly.",
        "If a userMessage is provided, adapt the recipes to fulfill the user's specific request (e.g., 'Make it easier to cook', 'Increase protein'). Do NOT break any dietary rules while doing so.",
        `The JSON shape is: ${JSON.stringify(MEAL_SCHEMA)}`,
      ].join(" ");

      const payload = {
        ...userPayload,
        mealType,
        requiredOptionCount: 8,
      };

      return fetchOpenAI(apiKey, MEAL_SCHEMA, mealPrompt, payload);
    });

    // Await all
    const [metadata, ...mealsData] = await Promise.all([metaPromise, ...mealPromises]);

    // Assemble plan
    const rawPlan = {
      ...(metadata as any),
      meals: {
        breakfast: mealsData[0],
        morningSnack: mealsData[1],
        lunch: mealsData[2],
        eveningSnack: mealsData[3],
        dinner: mealsData[4],
      }
    };

    const plan = normalizeAssistantPlan(rawPlan, fallbackPlan);
    plan.meals = sanitizeMealPlan(plan.meals, intake, dietType);

    return NextResponse.json({
      plan,
      provider: plan.source === "ai" ? "ai" : "fallback",
    });
  } catch (error) {
    console.error("POST /api/diet/assistant error:", error);
    if (fallbackPlan) {
      return NextResponse.json({ plan: fallbackPlan, provider: "fallback" });
    }
    return NextResponse.json({ error: "Unable to read the diet assistant request." }, { status: 400 });
  }
}
