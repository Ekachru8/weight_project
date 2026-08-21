import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseSlug, exerciseName, category, targetMuscles, equipment, instructions, formCues } = body;

    if (!exerciseSlug || !exerciseName) {
      return NextResponse.json(
        { error: "exerciseSlug and exerciseName are required" },
        { status: 400 }
      );
    }

    // Validate the exercise slug against the known exercise list
    const exercise = await prisma.exercise.findUnique({
      where: { slug: exerciseSlug },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Invalid exercise slug", status: "unavailable" },
        { status: 404 }
      );
    }

    const { EXERCISE_ASSETS } = await import("@/data/exercise-assets");
    const asset = EXERCISE_ASSETS[exercise.slug];

    if (!asset || !asset.videoUrl) {
      return NextResponse.json(
        { error: "Video demonstration coming soon", status: "unavailable" },
        { status: 404 }
      );
    }

    // Save it under the same exercise slug if needed, but we rely on the static map primarily now.
    // We'll update Prisma to keep it in sync for any queries that don't merge.
    await prisma.exercise.update({
      where: { slug: exercise.slug },
      data: {
        videoUrl: asset.videoUrl,
        videoStatus: "ready",
        videoExerciseSlug: exercise.slug
      }
    });

    return NextResponse.json({
      exerciseSlug: exercise.slug,
      videoUrl: asset.videoUrl,
      status: "ready"
    });

  } catch (error) {
    console.error("POST /api/exercises/video error:", error);
    return NextResponse.json(
      { error: "Failed to generate video", status: "unavailable" },
      { status: 500 }
    );
  }
}
