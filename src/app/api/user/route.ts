import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDiet } from "@/lib/diet";
import type { Gender, ActivityLevel, Goal } from "@/lib/diet";

// GET /api/user — Fetch the single user
export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { id: 1 },
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
    const body = await request.json();
    const { name, age, gender, heightCm, weightKg, activityLevel, goal, equipment } = body;

    const user = await prisma.user.update({
      where: { id: 1 },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender !== undefined && { gender }),
        ...(heightCm !== undefined && { heightCm: Number(heightCm) }),
        ...(weightKg !== undefined && { weightKg: Number(weightKg) }),
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
        user.goal as Goal
      );

      await prisma.dietTarget.create({
        data: {
          userId: 1,
          calories: dietResult.targetCalories,
          proteinG: dietResult.proteinG,
          carbsG: dietResult.carbsG,
          fatG: dietResult.fatG,
        },
      });
    }

    const updatedUser = await prisma.user.findFirst({
      where: { id: 1 },
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
