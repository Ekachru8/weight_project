import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";

export interface VoiceoverOptions {
  exerciseSlug: string;
  transcript: string;
}

export interface VoiceoverResult {
  audioUrl: string;
  status: "success" | "error";
  error?: string;
}

/**
 * Creates an exercise-specific narration using OpenAI TTS.
 * Caches the output locally in /public/exercises/ to avoid duplicate API calls.
 */
export async function generateVoiceover({ exerciseSlug, transcript }: VoiceoverOptions): Promise<VoiceoverResult> {
  const provider = process.env.TTS_PROVIDER || "openai";
  const apiKey = process.env.OPENAI_API_KEY || process.env.TTS_API_KEY;
  
  // Clean, professional, safe filename
  const safeSlug = exerciseSlug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const fileName = `${safeSlug}-voiceover.mp3`;
  const publicDir = path.join(process.cwd(), "public", "exercises");
  const publicPath = path.join(publicDir, fileName);
  const audioUrl = `/exercises/${fileName}`;

  try {
    // Basic caching: if it already exists, return the existing URL.
    try {
      await fs.access(publicPath);
      return { audioUrl, status: "success" };
    } catch {
      // File doesn't exist, proceed to generate
    }

    if (provider !== "openai" || !apiKey) {
      console.warn("No OpenAI API key configured. Returning existing or mock URL.");
      return { audioUrl, status: "success" };
    }

    console.log(`Generating professional voiceover for ${safeSlug} via OpenAI...`);
    
    const openai = new OpenAI({ apiKey });
    
    // Ensure directory exists
    try {
      await fs.mkdir(publicDir, { recursive: true });
    } catch (e) {
      // Ignore if it already exists
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx", // Onyx and Nova are good professional, calm voices for fitness
      input: transcript,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.writeFile(publicPath, buffer);

    return { audioUrl, status: "success" };
  } catch (error) {
    console.error(`Voiceover generation failed for ${safeSlug}:`, error);
    return { audioUrl: "", status: "error", error: "Failed to generate audio" };
  }
}

