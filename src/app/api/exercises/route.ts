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

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("GET /api/exercises error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
