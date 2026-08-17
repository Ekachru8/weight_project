import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTodayDayNumber, getDayName } from "@/lib/utils";

// GET /api/today — Get today's workout day info + exercises
export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { id: 1 } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dayNumber = getTodayDayNumber(user.createdAt);
    const dayName = getDayName(dayNumber);
    const isRestDay = dayNumber === 7;

    let exercises: unknown[] = [];
    if (!isRestDay) {
      exercises = await prisma.exercise.findMany({
        where: { dayNumber },
        orderBy: { sortOrder: "asc" },
      });
    }

    // Check if today is already logged
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const todayLog = await prisma.workoutLog.findUnique({
      where: { userId_date: { userId: 1, date: dateStr } },
    });

    return NextResponse.json({
      dayNumber,
      dayName,
      isRestDay,
      exercises,
      isCompleted: todayLog?.completed ?? false,
      isLogged: !!todayLog,
      date: dateStr,
    });
  } catch (error) {
    console.error("GET /api/today error:", error);
    return NextResponse.json(
      { error: "Failed to get today's workout" },
      { status: 500 }
    );
  }
}
