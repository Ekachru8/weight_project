import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkVideoJobStatus } from "@/lib/video-provider";
import { storeVideoAsset } from "@/lib/storage-provider";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId: jobIdStr } = await params;
    const jobId = parseInt(jobIdStr, 10);
    
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
    }

    const job = await prisma.videoJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "ready" || job.status === "failed") {
      // Return cached state if it's already in terminal state
      return NextResponse.json({
        status: job.status,
        videoUrl: job.videoUrl,
        errorMessage: job.errorMessage
      });
    }

    if (!job.providerJobId) {
       return NextResponse.json({
        status: job.status,
        message: "Job has no provider ID yet"
      });
    }

    // Check with provider
    const providerStatus = await checkVideoJobStatus(job.providerJobId);

    if (providerStatus.status === "failed") {
      // Handle failure
      await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          errorMessage: providerStatus.errorMessage
        }
      });
      await prisma.exercise.update({
        where: { slug: job.exerciseSlug },
        data: { videoStatus: "failed" }
      });

      return NextResponse.json({
        status: "failed",
        errorMessage: providerStatus.errorMessage
      });
    }

    if (providerStatus.status === "ready" && providerStatus.videoUrl) {
      // Validate and store the video URL
      const { permanentUrl } = await storeVideoAsset(providerStatus.videoUrl, job.exerciseSlug);

      // Update Database
      await prisma.videoJob.update({
        where: { id: job.id },
        data: {
          status: "ready",
          videoUrl: permanentUrl
        }
      });

      await prisma.exercise.update({
        where: { slug: job.exerciseSlug },
        data: {
          videoStatus: "ready",
          videoUrl: permanentUrl
        }
      });

      return NextResponse.json({
        status: "ready",
        videoUrl: permanentUrl
      });
    }

    // Still generating
    return NextResponse.json({
      status: "generating"
    });

  } catch (error: any) {
    console.error("Error polling job status:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
