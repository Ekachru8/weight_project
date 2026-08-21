import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/exercises?day=1&muscle=Chest
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");
    const muscle = searchParams.get("muscle");

    const where: Record<string, unknown> = {};
    if (day) where.dayNumber = Number(day);
    if (muscle) where.muscleGroup = { contains: muscle };

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }],
    });

    const { EXERCISE_ASSETS } = await import("@/data/exercise-assets");

    const mergedExercises = exercises.map(ex => {
      const asset = EXERCISE_ASSETS[ex.slug];
      if (asset) {
        return { ...ex, ...asset };
      }
      return ex;
    });

    return NextResponse.json(mergedExercises);
  } catch (error) {
    console.error("GET /api/exercises error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
