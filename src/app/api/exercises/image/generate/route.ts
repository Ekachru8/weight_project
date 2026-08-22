import { NextResponse } from "next/server";
import { EXERCISES } from "@/data/exercises";
import { EXERCISE_ASSETS } from "@/data/exercise-assets";
import { generateImage } from "@/lib/image-generator"; // Will implement a stub or real generator
import crypto from "crypto";

function buildExerciseImagePrompt(exercise: any) {
  return `
Create a professional fitness instruction image showing one realistic adult athlete performing exactly ${exercise.name}.

Exercise category: ${exercise.category}.
Equipment: ${exercise.equipment}.
Target muscles: ${exercise.targetMuscles.join(", ")}.
Movement pattern: ${exercise.movementPattern}.
Correct form: ${exercise.formCues.join("; ")}.

Show the correct starting or mid-movement position clearly. Use a clean premium home-workout or studio background, natural lighting, realistic anatomy, modest athletic clothing, and a clear camera angle that makes the movement easy to understand.

This image is specifically for ${exercise.name}. Do not show any other exercise.
  `.trim();
}

const negativePrompt = "Do not show a different exercise, a different variation, animals, fantasy characters, unrelated equipment, random objects, food, scenery, logos, text overlays, distorted anatomy, extra limbs, duplicate people, or an incorrect body position.";

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

    const prompt = buildExerciseImagePrompt(exercise);
    const hash = crypto.createHash("sha256").update(prompt).digest("hex").slice(0, 16);
    
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
    const result = await generateImage({
      prompt: prompt,
      negativePrompt: negativePrompt,
      slug: exerciseSlug,
      hash: hash,
    });

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
