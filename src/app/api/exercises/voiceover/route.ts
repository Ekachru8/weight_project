import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EXERCISE_ASSETS } from "@/data/exercise-assets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseSlug } = body;

    if (!exerciseSlug) {
      return NextResponse.json(
        { error: "exerciseSlug is required" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: { slug: exerciseSlug },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Invalid exercise slug" },
        { status: 404 }
      );
    }

    const asset = EXERCISE_ASSETS[exerciseSlug];
    if (!asset || !asset.voiceoverUrl) {
      return NextResponse.json(
        { error: "Audio guidance unavailable", status: "unavailable" },
        { status: 404 }
      );
    }

    // Serve exact transcript from static assets
    const transcript = asset.transcript;

    const voicePrompt = `Speak in clear, warm, professional English with a calm fitness-coach tone. Use a steady instructional pace and brief pauses between steps. Do not sound dramatic or overexcited: ${transcript}`;

    console.log("----- AI VOICEOVER GENERATION INITIATED -----");
    console.log("Style Prompt:", voicePrompt);

    // Simulate AI Generation Delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the mapped URL and transcript
    return NextResponse.json({
      exerciseSlug: exercise.slug,
      voiceoverUrl: asset.voiceoverUrl,
      voiceoverExerciseSlug: asset.voiceoverExerciseSlug,
      transcript,
      status: asset.status
    });

  } catch (error) {
    console.error("POST /api/exercises/voiceover error:", error);
    return NextResponse.json(
      { error: "Failed to generate voiceover", status: "unavailable" },
      { status: 500 }
    );
  }
}
