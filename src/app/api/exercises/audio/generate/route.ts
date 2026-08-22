import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateExerciseAudio } from "@/lib/audio-provider";

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

    // Validate the exercise slug against the known exercise list
    const { EXERCISES } = await import("@/data/exercises");
    const exercise = EXERCISES.find(ex => ex.slug === exerciseSlug);

    if (!exercise) {
      return NextResponse.json(
        { error: "Invalid exercise slug" },
        { status: 404 }
      );
    }

    try {
      const { EXERCISE_ASSETS } = await import("@/data/exercise-assets");
      const existingAsset = EXERCISE_ASSETS[exerciseSlug];
      // Check if we already have it
      if (existingAsset?.voiceoverUrl && existingAsset?.status === "ready") {
        return NextResponse.json({
          exerciseSlug: exercise.slug,
          audioUrl: existingAsset.voiceoverUrl,
          transcript: existingAsset.transcript,
          audioStatus: "ready"
        });
      }

      // Check if there's an existing job that's queued or generating
      let job = await prisma.videoJob.findFirst({
        where: {
          exerciseSlug: exercise.slug,
          audioStatus: { in: ["queued", "generating"] }
        }
      });

      if (!job) {
        job = await prisma.videoJob.create({
          data: {
            exerciseSlug: exercise.slug,
            status: "generating",
            audioStatus: "generating",
            provider: "openai-tts",
            prompt: "audio-generation",
            promptVersion: "1.0"
          }
        });

        // Fire and forget the generation
        generateExerciseAudio(exercise).then(async (result) => {
          await prisma.videoJob.update({
            where: { id: job!.id },
            data: {
              status: "ready",
              audioStatus: "ready",
              audioUrl: result.audioUrl,
              transcript: result.transcript
            }
          });
        }).catch(async (err) => {
          await prisma.videoJob.update({
            where: { id: job!.id },
            data: {
              status: "failed",
              audioStatus: "failed",
              errorMessage: err.message
            }
          });
        });
      }

      return NextResponse.json({
        jobId: job.id,
        status: "generating"
      });

    } catch (e: any) {
      console.error("Audio generation failed:", e);
      return NextResponse.json(
        { error: e.message || "Failed to generate audio" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("POST /api/exercises/audio/generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
