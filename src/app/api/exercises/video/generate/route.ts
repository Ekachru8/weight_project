import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildVideoPrompt, dispatchVideoJob } from "@/lib/video-provider";

export async function POST(request: Request) {
  try {
    const { exerciseSlug } = await request.json();

    if (!exerciseSlug) {
      return NextResponse.json({ error: "Missing exerciseSlug" }, { status: 400 });
    }

    // Look up the exercise
    const exercise = await prisma.exercise.findUnique({
      where: { slug: exerciseSlug }
    });

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    // Check if there's already a queued or generating job
    const existingJob = await prisma.videoJob.findFirst({
      where: {
        exerciseSlug,
        status: { in: ["queued", "generating"] }
      }
    });

    if (existingJob) {
      return NextResponse.json({ 
        message: "Job already running", 
        jobId: existingJob.id 
      });
    }

    // Generate prompt
    const prompt = await buildVideoPrompt(exerciseSlug);
    const promptVersion = "v1.0"; // Could be dynamically based on logic versioning

    // Create Job in queued state
    const job = await prisma.videoJob.create({
      data: {
        exerciseSlug,
        status: "queued",
        provider: process.env.VIDEO_GENERATION_PROVIDER || "mock-provider",
        prompt,
        promptVersion
      }
    });

    // Update exercise status to queued (or generating) so UI knows
    await prisma.exercise.update({
      where: { slug: exerciseSlug },
      data: { videoStatus: "queued" }
    });

    // Dispatch the actual job
    const providerJobId = await dispatchVideoJob(exerciseSlug, prompt);

    // Update the job with the provider ID and new status
    await prisma.videoJob.update({
      where: { id: job.id },
      data: {
        providerJobId,
        status: "generating"
      }
    });
    
    // Update exercise to generating
    await prisma.exercise.update({
      where: { slug: exerciseSlug },
      data: { videoStatus: "generating" }
    });

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    console.error("Error generating video:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
