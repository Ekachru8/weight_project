import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDiet } from "@/lib/diet";
import type { Gender, ActivityLevel, Goal } from "@/lib/diet";
import { auth } from "@/lib/auth";

// GET /api/user — Fetch the single user
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        dietTargets: { orderBy: { generatedAt: "desc" }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Validation helper
function validateFields(fields: any) {
  if (fields.name !== undefined && typeof fields.name === 'string' && fields.name.trim() === '') {
    return { error: "Display name cannot be empty" };
  }
  if (fields.age !== undefined && (isNaN(fields.age) || fields.age <= 0 || fields.age > 120)) {
    return { error: "Age must be a realistic positive number" };
  }
  if (fields.heightCm !== undefined && (isNaN(fields.heightCm) || fields.heightCm <= 0)) {
    return { error: "Height must be positive" };
  }
  if (fields.weightKg !== undefined && (isNaN(fields.weightKg) || fields.weightKg <= 0)) {
    return { error: "Current weight must be positive" };
  }
  if (fields.targetWeightKg !== undefined && fields.targetWeightKg !== "" && fields.targetWeightKg !== null) {
    if (isNaN(fields.targetWeightKg) || fields.targetWeightKg <= 0) {
      return { error: "Target weight must be positive" };
    }
  }
  if (fields.mealsPerDay !== undefined && fields.mealsPerDay !== "" && fields.mealsPerDay !== null) {
    const meals = Number(fields.mealsPerDay);
    if (isNaN(meals) || meals < 3 || meals > 6) {
      return { error: "Meals per day must be between 3 and 6" };
    }
  }
  if (fields.goal && fields.targetWeightKg && fields.weightKg) {
    const target = Number(fields.targetWeightKg);
    const weight = Number(fields.weightKg);
    if (fields.goal === "lose" && target >= weight) {
      return { error: "Goal is lose weight, but target weight is not lower than current weight" };
    }
    if (fields.goal === "gain" && target <= weight) {
      return { error: "Goal is gain weight, but target weight is not higher than current weight" };
    }
  }
  return null;
}

// PUT /api/user — Update user profile and recalculate diet
export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to use this feature" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationError = validateFields(body);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    const { 
      name, age, gender, heightCm, weightKg, targetWeightKg, activityLevel, goal, equipment, dietPreference,
      foodsTheyEat, comfortableFoods, foodsToAvoid, allergies, budget, openToNewFoods, mealsPerDay,
      cookingConstraints, fitnessLevel, mobilityLevel, difficultMovements, intensityPreference, healthNotes, workoutFocus
    } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender !== undefined && { gender }),
        ...(heightCm !== undefined && { heightCm: Number(heightCm) }),
        ...(weightKg !== undefined && { weightKg: Number(weightKg) }),
        ...(targetWeightKg !== undefined && { targetWeightKg: targetWeightKg ? Number(targetWeightKg) : null }),
        ...(activityLevel !== undefined && { activityLevel }),
        ...(goal !== undefined && { goal }),
        ...(equipment !== undefined && { equipment }),
        ...(dietPreference !== undefined && { dietPreference }),
        ...(foodsTheyEat !== undefined && { foodsTheyEat }),
        ...(comfortableFoods !== undefined && { comfortableFoods }),
        ...(foodsToAvoid !== undefined && { foodsToAvoid }),
        ...(allergies !== undefined && { allergies }),
        ...(budget !== undefined && { budget }),
        ...(openToNewFoods !== undefined && { openToNewFoods: Boolean(openToNewFoods) }),
        ...(mealsPerDay !== undefined && { mealsPerDay: mealsPerDay ? Number(mealsPerDay) : null }),
        ...(cookingConstraints !== undefined && { cookingConstraints }),
        ...(fitnessLevel !== undefined && { fitnessLevel }),
        ...(mobilityLevel !== undefined && { mobilityLevel }),
        ...(difficultMovements !== undefined && { difficultMovements }),
        ...(intensityPreference !== undefined && { intensityPreference }),
        ...(healthNotes !== undefined && { healthNotes }),
        ...(workoutFocus !== undefined && { workoutFocus }),
      },
    });

    // If all diet-relevant fields are present, recalculate diet targets
    if (user.age && user.gender && user.heightCm && user.weightKg && user.activityLevel && user.goal) {
      const dietResult = calculateDiet(
        user.weightKg,
        user.heightCm,
        user.age,
        user.gender as Gender,
        user.activityLevel as ActivityLevel,
        user.goal as Goal,
        user.targetWeightKg ?? undefined
      );

      await prisma.dietTarget.create({
        data: {
          userId,
          calories: dietResult.targetCalories,
          proteinG: dietResult.proteinG,
          carbsG: dietResult.carbsG,
          fatG: dietResult.fatG,
        },
      });
    }

    const updatedUser = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        dietTargets: { orderBy: { generatedAt: "desc" }, take: 1 },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// PATCH /api/user — Update user profile (supports onboarding fields)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to use this feature" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationError = validateFields(body);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    const {
      name, age, gender, heightCm, weightKg, targetWeightKg, activityLevel, goal, equipment, onboardingDone, dietPreference,
      foodsTheyEat, comfortableFoods, foodsToAvoid, allergies, budget, openToNewFoods, mealsPerDay,
      cookingConstraints, fitnessLevel, mobilityLevel, difficultMovements, intensityPreference, healthNotes, workoutFocus
    } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender !== undefined && { gender }),
        ...(heightCm !== undefined && { heightCm: Number(heightCm) }),
        ...(weightKg !== undefined && { weightKg: Number(weightKg) }),
        ...(targetWeightKg !== undefined && { targetWeightKg: targetWeightKg ? Number(targetWeightKg) : null }),
        ...(activityLevel !== undefined && { activityLevel }),
        ...(goal !== undefined && { goal }),
        ...(equipment !== undefined && { equipment }),
        ...(onboardingDone !== undefined && { onboardingDone: Boolean(onboardingDone) }),
        ...(dietPreference !== undefined && { dietPreference }),
        ...(foodsTheyEat !== undefined && { foodsTheyEat }),
        ...(comfortableFoods !== undefined && { comfortableFoods }),
        ...(foodsToAvoid !== undefined && { foodsToAvoid }),
        ...(allergies !== undefined && { allergies }),
        ...(budget !== undefined && { budget }),
        ...(openToNewFoods !== undefined && { openToNewFoods: Boolean(openToNewFoods) }),
        ...(mealsPerDay !== undefined && { mealsPerDay: mealsPerDay ? Number(mealsPerDay) : null }),
        ...(cookingConstraints !== undefined && { cookingConstraints }),
        ...(fitnessLevel !== undefined && { fitnessLevel }),
        ...(mobilityLevel !== undefined && { mobilityLevel }),
        ...(difficultMovements !== undefined && { difficultMovements }),
        ...(intensityPreference !== undefined && { intensityPreference }),
        ...(healthNotes !== undefined && { healthNotes }),
        ...(workoutFocus !== undefined && { workoutFocus }),
      },
    });

    // If all diet-relevant fields are present, recalculate diet targets
    if (user.age && user.gender && user.heightCm && user.weightKg && user.activityLevel && user.goal) {
      const dietResult = calculateDiet(
        user.weightKg,
        user.heightCm,
        user.age,
        user.gender as Gender,
        user.activityLevel as ActivityLevel,
        user.goal as Goal,
        user.targetWeightKg ?? undefined
      );

      await prisma.dietTarget.create({
        data: {
          userId,
          calories: dietResult.targetCalories,
          proteinG: dietResult.proteinG,
          carbsG: dietResult.carbsG,
          fatG: dietResult.fatG,
        },
      });
    }

    const updatedUser = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        dietTargets: { orderBy: { generatedAt: "desc" }, take: 1 },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

