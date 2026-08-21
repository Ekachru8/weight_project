import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/weight-log — Fetch weight history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 50);

    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/weight-log error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight logs" },
      { status: 500 }
    );
  }
}

// POST /api/weight-log — Log a weight entry
export async function POST(request: Request) {
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
    const { date, weightKg } = body;

    if (!date || !weightKg) {
      return NextResponse.json(
        { error: "Missing required fields: date, weightKg" },
        { status: 400 }
      );
    }

    const log = await prisma.weightLog.upsert({
      where: { userId_date: { userId, date } },
      update: { weightKg: Number(weightKg) },
      create: {
        userId,
        date,
        weightKg: Number(weightKg),
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("POST /api/weight-log error:", error);
    return NextResponse.json(
      { error: "Failed to log weight" },
      { status: 500 }
    );
  }
}
