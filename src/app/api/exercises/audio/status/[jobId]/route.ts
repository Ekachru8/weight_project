import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    if (job.audioStatus === "ready" || job.audioStatus === "failed") {
      // Return cached state if it's already in terminal state
      return NextResponse.json({
        status: job.audioStatus,
        audioUrl: job.audioUrl,
        transcript: job.transcript,
        errorMessage: job.errorMessage
      });
    }

    // Still generating
    return NextResponse.json({
      status: "generating"
    });

  } catch (error: any) {
    console.error("Error polling audio job status:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
