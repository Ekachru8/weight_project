import { NextResponse } from "next/server";
import { EXERCISES } from "@/data/exercises";
import { EXERCISE_ASSETS } from "@/data/exercise-assets";
import { generateExerciseImage } from "@/lib/image-generator";

export async function POST(req: Request) {
  try {
    const { exerciseSlug } = await req.json();

    if (!exerciseSlug) {
      return NextResponse.json({ error: "exerciseSlug is required" }, { status: 400 });
    }

    const exercise = EXERCISES.find(ex => ex.slug === exerciseSlug);
    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found in trusted catalog" }, { status: 404 });
    }

    // First do a dry-run prompt generation to see if we already have it
    // But since the new generateExerciseImage function does the hash generation,
    // we should just call it. Wait, the old route checked EXERCISE_ASSETS first.
    // Let's implement the prompt generation logic quickly here or just call the generator.
    // Let's re-use the check logic by just building a temporary prompt here to check the hash.
    const tempPrompt = `Create a professional fitness instruction image showing one realistic adult athlete performing exactly ${exercise.name}.
Exercise variation: ${exercise.name}.
Body position: ${exercise.instructions?.[0] || 'correct starting or mid-movement position clearly'}.
Movement pattern: ${exercise.movementPattern}.
Equipment: ${exercise.equipment}.
Target muscles: ${exercise.targetMuscles?.join(", ")}.
Correct form cues: ${exercise.formCues?.join("; ")}.
Show the full body from a clear side three-quarter angle in a clean home-workout studio. Use natural lighting, realistic anatomy, modest athletic clothing, and no text. This image is specifically for ${exercise.name}.`;

    const crypto = require("crypto");
    const hash = crypto.createHash("sha256").update(tempPrompt).digest("hex").slice(0, 16);
    
    // Check if we already have it ready
    const existingAsset = EXERCISE_ASSETS[exerciseSlug];
    if (existingAsset?.imageStatus === "ready" && existingAsset?.imagePromptHash === hash && existingAsset?.imageUrl) {
      return NextResponse.json({
        imageUrl: existingAsset.imageUrl,
        imageStatus: "ready",
        imagePromptHash: hash,
      });
    }

    // Attempt to generate the image
    const result = await generateExerciseImage(exercise);

    if (!result || !result.imageUrl) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    return NextResponse.json({
      exerciseSlug: exercise.slug,
      exerciseName: exercise.name,
      imageUrl: result.imageUrl,
      imageAlt: `${exercise.name} exercise form`,
      imageStatus: "ready",
      imageSource: "ai_generated",
      imagePromptHash: hash,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
