import { NextResponse } from "next/server";
import {
  buildFallbackDietAssistantPlan,
  sanitizeMealPlan,
  normalizeAssistantPlan,
  type AssistantIntake,
  type DietAssistantContext,
} from "@/lib/diet-assistant";
import type { DietType } from "@/lib/meals";

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
    ingredients: { type: "array", items: { type: "string" } },
    instructions: { type: "array", items: { type: "string" } },
    prepMinutes: { type: "number" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
  },
  required: [
    "name",
    "ingredients",
    "instructions",
    "prepMinutes",
    "calories",
    "protein",
    "carbs",
    "fat",
  ],
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

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    meals: {
      type: "object",
      additionalProperties: false,
      properties: {
        breakfast: MEAL_SCHEMA,
        morningSnack: MEAL_SCHEMA,
        lunch: MEAL_SCHEMA,
        eveningSnack: MEAL_SCHEMA,
        dinner: MEAL_SCHEMA,
      },
      required: [
        "breakfast",
        "morningSnack",
        "lunch",
        "eveningSnack",
        "dinner",
      ],
    },
    headline: { type: "string" },
    summary: { type: "string" },
    aiReasoning: { type: "string" },
    swaps: { type: "array", items: { type: "string" } },
    safetyNote: { type: "string" },
  },
  required: [
    "meals",
    "headline",
    "summary",
    "aiReasoning",
    "swaps",
    "safetyNote",
  ],
} as const;

function text(value: unknown, maxLength = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseIntake(value: unknown): AssistantIntake {
  const input = value && typeof value === "object"
    ? (value as Partial<AssistantIntake>)
    : {};

  const mealsPerDay = Number(input.mealsPerDay);

  return {
    foodsTheyEat: text(input.foodsTheyEat),
    comfortableFoods: text(input.comfortableFoods),
    foodsToAvoid: text(input.foodsToAvoid),
    allergies: text(input.allergies),
    cookingConstraints: text(input.cookingConstraints),
    mealsPerDay: Number.isFinite(mealsPerDay)
      ? Math.min(6, Math.max(3, mealsPerDay))
      : 5,
  };
}

function parseContext(value: unknown): DietAssistantContext | null {
  if (!value || typeof value !== "object") return null;

  const input = value as Partial<DietAssistantContext>;
  const diet = input.diet;
  const user = input.user;

  if (
    !diet ||
    typeof diet.targetCalories !== "number" ||
    !user ||
    typeof user !== "object"
  ) {
    return null;
  }

  return {
    diet: {
      targetCalories: diet.targetCalories,
      proteinG: typeof diet.proteinG === "number" ? diet.proteinG : 0,
      carbsG: typeof diet.carbsG === "number" ? diet.carbsG : 0,
      fatG: typeof diet.fatG === "number" ? diet.fatG : 0,
      tdee: typeof diet.tdee === "number" ? diet.tdee : diet.targetCalories,
    },
    user,
  };
}

function getDietType(value: unknown): DietType {
  return typeof value === "string" && DIET_TYPES.has(value as DietType)
    ? (value as DietType)
    : "non_vegetarian";
}

function extractJson(response: unknown): unknown {
  if (!response || typeof response !== "object") return null;

  const content = (
    response as {
      choices?: Array<{ message?: { content?: unknown } }>;
    }
  ).choices?.[0]?.message?.content;

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

export async function POST(request: Request) {
  let fallbackPlan: ReturnType<typeof buildFallbackDietAssistantPlan> | null = null;

  try {
    const body = await request.json();
    const context = parseContext(body?.context);

    if (!context) {
      return NextResponse.json(
        { error: "A valid diet context is required." },
        { status: 400 },
      );
    }

    const intake = parseIntake(body?.intake);
    const dietType = getDietType(body?.dietType);
    const goal = context.user.goal === "lose" || context.user.goal === "gain"
      ? context.user.goal
      : "maintain";
    const weight = typeof context.user.weightKg === "number"
      ? context.user.weightKg
      : 70;

    fallbackPlan = buildFallbackDietAssistantPlan(
      context.diet.targetCalories,
      dietType,
      goal,
      weight,
      intake,
    );

    // The fallback keeps the feature working even before an AI key is configured.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ plan: fallbackPlan, provider: "fallback" });
    }

    const baseUrl = (
      process.env.OPENAI_API_BASE || "https://api.openai.com/v1"
    ).replace(/\/$/, "");
    const model = process.env.DIET_ASSISTANT_MODEL || "gpt-4o-mini";

    const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_completion_tokens: 4000,
        // json_object is supported by more OpenAI-compatible providers than
        // json_schema. The system message still requires the exact shape.
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "You are a cautious nutrition-planning assistant, not a doctor.",
              "Return only valid JSON matching the requested plan shape.",
              "Create a practical one-day plan around the supplied profile and preferences.",
              "Never include a listed allergen or a food the user asked to avoid.",
              "Respect vegetarian and eggetarian restrictions strictly.",
              "Keep calories reasonably close to the supplied target and use clear portions.",
              "Do not make medical claims or recommend extreme restriction.",
              "Set headline to 'A nutrition plan built around your lifestyle'.",
              "Set summary to follow this exact format: 'A <meals>-meal, <dietType> plan designed to support <goal> at approximately <calories> kcal per day. It prioritizes foods you enjoy, respects your exclusions, and fits your cooking routine.' (Adjust wording slightly if constraints are missing).",
              "If the user excluded items, explicitly state '<Item> has been excluded based on your preferences.' in the summary. Never use 'I have left out'.",
              "Set safetyNote strictly to: 'This plan is intended for general wellness and is not medical advice. If you have a medical condition, take medication, are pregnant, or have a food allergy, consult a qualified clinician or dietitian before following it.'",
              "CRITICAL: For EVERY meal, you must generate exactly one recommended dish AND at least four completely distinct, interchangeable recipe options in the `options` array.",
              "Every option must be a genuinely different dish. Do not just change the title.",
              "Every recommended dish and option must include detailed step-by-step `instructions`, a list of `ingredients` with quantities, and `prepMinutes`.",
              `The JSON shape is: ${JSON.stringify(PLAN_SCHEMA)}`,
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              profile: {
                age: context.user.age ?? null,
                gender: context.user.gender ?? null,
                heightCm: context.user.heightCm ?? null,
                weightKg: weight,
                activityLevel: context.user.activityLevel ?? null,
                goal,
                dietType,
                targetCalories: context.diet.targetCalories,
                macros: {
                  proteinG: context.diet.proteinG,
                  carbsG: context.diet.carbsG,
                  fatG: context.diet.fatG,
                },
              },
              intake,
            }),
          },
        ],
      }),
    });

    if (!providerResponse.ok) {
      console.error(
        "Diet assistant provider error:",
        providerResponse.status,
        await providerResponse.text(),
      );
      return NextResponse.json({ plan: fallbackPlan, provider: "fallback" });
    }

    const providerJson = await providerResponse.json();
    const plan = normalizeAssistantPlan(extractJson(providerJson), fallbackPlan);
    
    // Ensure the AI plan strictly adheres to forbidden items, just in case
    plan.meals = sanitizeMealPlan(plan.meals, intake, dietType);

    return NextResponse.json({
      plan,
      provider: plan.source === "ai" ? "ai" : "fallback",
    });
  } catch (error) {
    console.error("POST /api/diet/assistant error:", error);

    // Important: return a valid plan instead of a 500 response. The old code
    // returned { error: ... }, which caused the browser to throw at data.error.
    if (fallbackPlan) {
      return NextResponse.json({ plan: fallbackPlan, provider: "fallback" });
    }

    return NextResponse.json(
      { error: "Unable to read the diet assistant request." },
      { status: 400 },
    );
  }
}
