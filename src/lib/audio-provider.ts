import { OpenAI } from "openai";
import crypto from "crypto";
import { prisma } from "./prisma";

// Create a getter for OpenAI to avoid throwing on module load if not configured
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_API_BASE || undefined,
  });
}

function hashString(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export function buildExerciseTranscript(exercise: any) {
  const name = exercise.name;
  
  const startingPosition = exercise.instructions?.[0] || "Get into a comfortable starting position.";
  
  const movementSteps = exercise.instructions?.slice(1).join(" ") || "Perform the movement smoothly and with control.";
  
  const breathingInstruction = "Breathe in as you lower and breathe out as you rise.";
  
  const formCue = exercise.formCues?.[0] || "maintain proper form";
  
  const commonMistake = exercise.commonMistakes?.[0] || "rushing the movement";
  
  // Clean up casing/punctuation for seamless reading
  const cleanFirstLetter = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
  const ensureDot = (str: string) => str.endsWith(".") ? str : str + ".";

  return `Let's go through ${name}. ${ensureDot(startingPosition)} ${ensureDot(movementSteps)} ${breathingInstruction} Focus on ${cleanFirstLetter(formCue)}, and avoid ${cleanFirstLetter(commonMistake)}. Use a lighter weight or reduce your range of motion if needed, and stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.`;
}

export async function generateExerciseAudio(exercise: any) {
  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.error("Exercise audio generation is not configured. Add a server-side TTS provider and persistent media storage.");
    throw new Error("TTS provider not configured");
  }

  const transcript = buildExerciseTranscript(exercise);
  const transcriptHash = hashString(transcript).substring(0, 12);
  const voice = process.env.TTS_VOICE || "alloy";

  try {
    // Check if we already have this specific transcript hashed for this exercise
    const existingJob = await prisma.videoJob.findFirst({
      where: {
        exerciseSlug: exercise.slug,
        audioStatus: "ready"
      }
    });

    if (existingJob && existingJob.audioUrl && existingJob.transcript === transcript) {
      return {
        exerciseSlug: exercise.slug,
        audioUrl: existingJob.audioUrl,
        transcript,
        audioStatus: "ready",
        transcriptHash
      };
    }

    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error("TTS provider not configured");
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any,
      input: transcript,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    
    // In a real app, upload this buffer to S3 / object storage.
    const { storeAudioBuffer } = await import("./storage-provider");
    const { permanentUrl } = await storeAudioBuffer(buffer, exercise.slug, transcriptHash);

    // Save to Prisma
    await prisma.videoJob.create({
      data: {
        exerciseSlug: exercise.slug,
        audioUrl: permanentUrl,
        audioStatus: "ready",
        transcript: transcript,
        providerJobId: `tts-${transcriptHash}`,
        status: "ready",
        provider: "openai-tts",
        prompt: "audio-generation",
        promptVersion: "1.0"
      }
    });

    await prisma.exercise.update({
      where: { slug: exercise.slug },
      data: {
        audioUrl: permanentUrl,
        audioStatus: "ready",
        transcript: transcript
      }
    });

    return {
      exerciseSlug: exercise.slug,
      audioUrl: permanentUrl,
      transcript,
      audioStatus: "ready",
      transcriptHash
    };

  } catch (error) {
    console.error(`Audio generation failed for ${exercise.slug}:`, error);
    
    await prisma.exercise.update({
      where: { slug: exercise.slug },
      data: { audioStatus: "failed" }
    });
    
    throw error;
  }
}
