import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { weeklyWorkoutSchedule } from "@/lib/workout-schedule";
import { auth } from "@/lib/auth";

// GET /api/today — Get today's workout day info + exercises
export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    const { searchParams } = new URL(request.url);
    const localDateParam = searchParams.get("localDate");
    const weekdayParam = searchParams.get("weekday");

    let targetDate = new Date();
    if (localDateParam) {
      const [year, month, day] = localDateParam.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    }
    
    // Parse weekday from request, or fallback to the local targetDate's getDay()
    const weekday = weekdayParam !== null ? parseInt(weekdayParam, 10) : targetDate.getDay();
    const schedule = weeklyWorkoutSchedule[weekday];
    const isRestDay = weekday === 0;

    let exercises: any[] = [];
    if (!isRestDay && schedule?.exercises) {
      const rawExercises = await prisma.exercise.findMany({
        where: { slug: { in: schedule.exercises } },
      });
      // Sort exercises to match the exact order in the schedule
      exercises = schedule.exercises
        .map(slug => rawExercises.find(ex => ex.slug === slug))
        .filter(Boolean);
    }

    const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
    
    let isCompleted = false;
    let isLogged = false;

    if (userId) {
      const todayLog = await prisma.workoutLog.findUnique({
        where: { userId_date: { userId, date: dateStr } },
      });
      isCompleted = todayLog?.completed ?? false;
      isLogged = !!todayLog;
    }

    return NextResponse.json({
      dayNumber: weekday, // Map dayNumber to weekday for backwards compatibility if needed
      dayName: schedule.day,
      title: schedule.title,
      isRestDay,
      exercises,
      isCompleted,
      isLogged,
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
