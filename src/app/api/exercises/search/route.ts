import { NextRequest, NextResponse } from "next/server";
import { getExerciseProvider } from "@/lib/exercise-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const muscle = searchParams.get("muscle") || undefined;
    const equipment = searchParams.get("equipment") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    
    // Convert 'All' values to undefined so we don't query for literal 'All'
    const filters = {
      query,
      muscle: muscle !== "All" ? muscle : undefined,
      equipment: equipment !== "All" ? equipment : undefined,
      difficulty: difficulty !== "All" ? difficulty : undefined,
    };

    const provider = getExerciseProvider();
    const results = await provider.search(filters);
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("GET /api/exercises/search error:", error);
    
    // Log the real error on the server but hide API keys/stack traces from the client
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

    if (error.message.includes("Rate limit") || error.status === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
