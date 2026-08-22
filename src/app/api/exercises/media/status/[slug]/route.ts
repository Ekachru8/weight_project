import { NextResponse } from "next/server";
import { EXERCISE_ASSETS } from "@/data/exercise-assets";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    // Check static assets first (in case script updated them)
    const existingAsset = EXERCISE_ASSETS[slug];
    
    // Check if there's a running job in DB for audio (or image if it was stored there)
    const audioJob = await prisma.videoJob.findFirst({
      where: { exerciseSlug: slug },
      orderBy: { createdAt: 'desc' }
    });

    let audioStatus: string = existingAsset?.status || "unavailable";
    let audioUrl: string | null = existingAsset?.voiceoverUrl || null;
    let transcript: string = existingAsset?.transcript || "";

    if (audioJob) {
       // if job says ready, but asset says unavailable, job is more recent
       if (audioJob.audioStatus === "ready") {
          audioStatus = "ready";
          audioUrl = audioJob.audioUrl || audioUrl;
          transcript = audioJob.transcript || transcript;
       } else if (audioJob.audioStatus === "generating" || audioJob.audioStatus === "queued") {
          audioStatus = audioJob.audioStatus;
       } else if (audioJob.audioStatus === "failed") {
          audioStatus = "failed";
       }
    }

    const imageStatus = existingAsset?.imageStatus || "unavailable";
    const imageUrl = existingAsset?.imageUrl || null;

    return NextResponse.json({
      exerciseSlug: slug,
      audioStatus,
      audioUrl,
      transcript,
      imageStatus,
      imageUrl
    });
  } catch (error) {
    console.error("Failed to get media status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
