import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/workout-log?from=2025-01-01&to=2025-12-31
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = { userId: 1 };
    if (from && to) {
      where.date = { gte: from, lte: to };
    } else if (from) {
      where.date = { gte: from };
    } else if (to) {
      where.date = { lte: to };
    }

    const logs = await prisma.workoutLog.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/workout-log error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

// POST /api/workout-log — Log a day as completed or skipped
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, dayNumber, completed, notes } = body;

    if (!date || dayNumber === undefined || completed === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: date, dayNumber, completed" },
        { status: 400 }
      );
    }

    const log = await prisma.workoutLog.upsert({
      where: { userId_date: { userId: 1, date } },
      update: { completed, notes, dayNumber },
      create: {
        userId: 1,
        date,
        dayNumber,
        completed,
        notes,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("POST /api/workout-log error:", error);
    return NextResponse.json(
      { error: "Failed to log workout" },
      { status: 500 }
    );
  }
}
