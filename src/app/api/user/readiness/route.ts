import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json({ fitnessReadiness: null });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ fitnessReadiness: user.fitnessReadiness });
  } catch (error) {
    console.error("GET /api/user/readiness error:", error);
    return NextResponse.json(
      { error: "Failed to get readiness profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to use this feature" },
        { status: 401 }
      );
    }

    const { fitnessReadiness } = await request.json();
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fitnessReadiness },
    });
    return NextResponse.json({ fitnessReadiness: user.fitnessReadiness });
  } catch (error) {
    console.error("POST /api/user/readiness error:", error);
    return NextResponse.json(
      { error: "Failed to update readiness profile" },
      { status: 500 }
    );
  }
}
