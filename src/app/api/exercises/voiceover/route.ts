import { NextRequest, NextResponse } from "next/server";
import { generateVoiceover } from "@/lib/voiceover";
import { getExerciseProvider } from "@/lib/exercise-provider";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseSlug, exerciseName, setupInstruction, movementInstruction, formCue, commonMistake } = body;

    if (!exerciseSlug || !exerciseName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optionally: Verify the exercise exists in the provider
    const provider = getExerciseProvider();
    const exercise = await provider.getBySlug(exerciseSlug);
    
    if (!exercise) {
      return NextResponse.json(
        { error: "Invalid exercise slug" },
        { status: 404 }
      );
    }

    // Construct professional transcript exactly as requested
    const safeSetup = setupInstruction || "Get into a comfortable starting position.";
    const safeMovement = movementInstruction || "Perform the movement smoothly.";
    const safeCue = formCue || "proper form";
    const safeMistake = commonMistake || "rushing the movement";

    const transcript = `Start in the correct position for ${exerciseName}. ${safeSetup} Move with control. ${safeMovement} Breathe naturally and focus on ${safeCue}. Avoid ${safeMistake}. Use the easier variation if needed. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.`;

    const result = await generateVoiceover({ exerciseSlug, transcript });

    if (result.status === "error") {
      return NextResponse.json(
        { error: result.error || "Failed to generate audio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      audioUrl: result.audioUrl,
      transcript
    });

  } catch (error) {
    console.error("POST /api/exercises/voiceover error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
