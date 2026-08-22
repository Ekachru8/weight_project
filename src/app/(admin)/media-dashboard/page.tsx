import { prisma } from "@/lib/prisma";
import MediaDashboardClient from "./MediaDashboardClient";

export default async function MediaDashboardPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { category: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      videoStatus: true,
      videoUrl: true,
    }
  });

  const jobs = await prisma.videoJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-black mb-8 text-accent">Media Generation Dashboard</h1>
      <MediaDashboardClient exercises={exercises} initialJobs={jobs} />
    </div>
  );
}
