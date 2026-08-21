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
      // Return public demo data for guests
      return NextResponse.json({
        id: "guest",
        name: "Guest User",
        email: "",
        onboardingDone: false,
      });
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
    const { name, age, gender, heightCm, weightKg, targetWeightKg, activityLevel, goal, equipment } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender !== undefined && { gender }),
        ...(heightCm !== undefined && { heightCm: Number(heightCm) }),
        ...(weightKg !== undefined && { weightKg: Number(weightKg) }),
        ...(targetWeightKg !== undefined && { targetWeightKg: Number(targetWeightKg) }),
        ...(activityLevel !== undefined && { activityLevel }),
        ...(goal !== undefined && { goal }),
        ...(equipment !== undefined && { equipment }),
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
    const {
      name, age, gender, heightCm, weightKg,
      targetWeightKg, activityLevel, goal,
      equipment, onboardingDone,
    } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender !== undefined && { gender }),
        ...(heightCm !== undefined && { heightCm: Number(heightCm) }),
        ...(weightKg !== undefined && { weightKg: Number(weightKg) }),
        ...(targetWeightKg !== undefined && { targetWeightKg: Number(targetWeightKg) }),
        ...(activityLevel !== undefined && { activityLevel }),
        ...(goal !== undefined && { goal }),
        ...(equipment !== undefined && { equipment }),
        ...(onboardingDone !== undefined && { onboardingDone: Boolean(onboardingDone) }),
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

