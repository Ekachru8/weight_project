import { NextRequest, NextResponse } from "next/server";
import { getExerciseProvider } from "@/lib/exercise-provider";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const provider = getExerciseProvider();
    const exercise = await provider.getBySlug(slug);

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ exercise });
  } catch (error: any) {
    console.error(`GET /api/exercises/[slug] error for ${error.message}:`, error);
    
    if (error.message.includes("not configured")) {
      return NextResponse.json(
        { error: "Demonstrations are temporarily unavailable. Written guidance is still available." },
        { status: 503 }
      );
    }

    if (error.message.includes("Unauthorized") || error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: "Demonstrations are temporarily unavailable." },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}
