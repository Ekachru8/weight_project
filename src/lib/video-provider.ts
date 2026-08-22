import { prisma } from "./prisma";

export async function buildVideoPrompt(exerciseSlug: string): Promise<string> {
  const ex = await prisma.exercise.findUnique({ where: { slug: exerciseSlug } });
  if (!ex) throw new Error("Exercise not found");

  // Construct a prompt, e.g. for a text-to-video model
  const prompt = `A high-quality, photorealistic fitness demonstration video of a person performing ${ex.name}. 
The person is wearing standard athletic wear in a clean, modern home gym environment. 
Equipment used: ${ex.equipment}. 
The movement pattern is ${ex.movementPattern}. 
They are performing the exercise with perfect form. 
Negative prompt: animals, fantasy, distortion, extra limbs, low quality, cartoon, anime.`;

  return prompt;
}

export async function dispatchVideoJob(exerciseSlug: string, prompt: string): Promise<string> {
  // Simulate dispatching to an external API (like Luma, Runway, etc.)
  // We return a mock job ID.
  const providerJobId = `mock-job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return providerJobId;
}

export async function checkVideoJobStatus(providerJobId: string): Promise<{
  status: "generating" | "ready" | "failed";
  videoUrl?: string;
  errorMessage?: string;
}> {
  // Simulate polling. For a mock, we can just say if it's been a few seconds, it's ready.
  // We'll base it on the timestamp in the providerJobId
  const parts = providerJobId.split('-');
  const timestamp = parseInt(parts[2], 10);
  const now = Date.now();
  const elapsed = now - timestamp;

  // Simulate a 5 second generation time
  if (elapsed < 5000) {
    return { status: "generating" };
  }

  // 10% chance to fail for testing
  if (Math.random() < 0.1) {
    return { status: "failed", errorMessage: "Simulated provider error: Generation timed out or failed safety filters." };
  }

  // Success
  return { 
    status: "ready", 
    videoUrl: `https://mock-provider.com/videos/${providerJobId}.mp4` 
  };
}
