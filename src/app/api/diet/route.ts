import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDiet } from "@/lib/diet";
import type { Gender, ActivityLevel, Goal } from "@/lib/diet";

// GET /api/diet — Fetch latest diet target + full calculation details
export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { id: 1 } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has completed onboarding
    if (!user.age || !user.gender || !user.heightCm || !user.weightKg || !user.activityLevel || !user.goal) {
      return NextResponse.json({
        onboardingRequired: true,
        user,
      });
    }

    const dietResult = calculateDiet(
      user.weightKg,
      user.heightCm,
      user.age,
      user.gender as Gender,
      user.activityLevel as ActivityLevel,
      user.goal as Goal
    );

    const latestTarget = await prisma.dietTarget.findFirst({
      where: { userId: 1 },
      orderBy: { generatedAt: "desc" },
    });

    return NextResponse.json({
      onboardingRequired: false,
      user,
      diet: dietResult,
      savedTarget: latestTarget,
    });
  } catch (error) {
    console.error("GET /api/diet error:", error);
    return NextResponse.json(
      { error: "Failed to fetch diet info" },
      { status: 500 }
    );
  }
}

// POST /api/diet — Save diet onboarding data and calculate targets
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { age, gender, heightCm, weightKg, activityLevel, goal, dietPreference } = body;

    if (!age || !gender || !heightCm || !weightKg || !activityLevel || !goal || !dietPreference) {
      return NextResponse.json(
        { error: "All fields are required: age, gender, heightCm, weightKg, activityLevel, goal, dietPreference" },
        { status: 400 }
      );
    }

    // Update user profile
    await prisma.user.update({
      where: { id: 1 },
      data: {
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
        dietPreference,
      },
    });

    // Calculate diet
    const dietResult = calculateDiet(
      Number(weightKg),
      Number(heightCm),
      Number(age),
      gender as Gender,
      activityLevel as ActivityLevel,
      goal as Goal
    );

    // Simulate AI Generation Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save diet target
    const target = await prisma.dietTarget.create({
      data: {
        userId: 1,
        calories: dietResult.targetCalories,
        proteinG: dietResult.proteinG,
        carbsG: dietResult.carbsG,
        fatG: dietResult.fatG,
      },
    });

    return NextResponse.json({
      diet: dietResult,
      savedTarget: target,
    });
  } catch (error) {
    console.error("POST /api/diet error:", error);
    return NextResponse.json(
      { error: "Failed to save diet data" },
      { status: 500 }
    );
  }
}
