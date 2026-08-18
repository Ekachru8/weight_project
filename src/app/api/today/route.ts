import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDayNumberForDate, getDayName } from "@/lib/utils";

// GET /api/today — Get today's workout day info + exercises
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localDateParam = searchParams.get("localDate");

    const user = await prisma.user.findFirst({ where: { id: 1 } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine the date to use (local if provided, otherwise server time)
    const today = localDateParam ? new Date(localDateParam) : new Date();
    // Ensure we don't have timezone shifts if localDateParam was passed as YYYY-MM-DD
    // but the constructor interprets it as UTC midnight.
    // If localDateParam is passed, we can assume it's the right day.
    
    // Actually, localDateParam is a string like "2024-05-22".
    let targetDate = today;
    if (localDateParam) {
      const [year, month, day] = localDateParam.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    }
    
    const dayNumber = getDayNumberForDate(targetDate, user.createdAt);
    const dayName = getDayName(dayNumber);
    const isRestDay = dayNumber === 7;

    let exercises: unknown[] = [];
    if (!isRestDay) {
      exercises = await prisma.exercise.findMany({
        where: { dayNumber },
        orderBy: { sortOrder: "asc" },
      });
    }

    // Format date string for the database lookup
    const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
    
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
