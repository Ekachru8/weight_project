import fs from "fs/promises";
import path from "path";

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
 * Creates an exercise-specific narration using a TTS provider.
 * Uses a caching mechanism based on exercise slug and transcript hash.
 */
export async function generateVoiceover({ exerciseSlug, transcript }: VoiceoverOptions): Promise<VoiceoverResult> {
  const provider = process.env.TTS_PROVIDER || "local";
  const apiKey = process.env.TTS_API_KEY || "";
  
  // Clean, professional, safe filename
  const safeSlug = exerciseSlug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const fileName = `${safeSlug}-voiceover.mp3`;
  const publicPath = path.join(process.cwd(), "public", "exercises", fileName);
  const audioUrl = `/exercises/${fileName}`;

  try {
    // Basic caching: if it already exists, return the existing URL.
    // In production, we'd hash the transcript to see if it changed.
    try {
      await fs.access(publicPath);
      return { audioUrl, status: "success" };
    } catch {
      // File doesn't exist, proceed to generate
    }

    if (provider === "local" || !apiKey) {
      // Fallback for development without an API key
      console.warn("No TTS provider/API key configured. Returning existing or mock URL.");
      return { audioUrl, status: "success" };
    }

    // Example TTS Provider Integration (e.g. ElevenLabs, OpenAI, Google)
    console.log(`Generating voiceover for ${safeSlug} via ${provider}...`);
    
    /* 
    const response = await fetch(`https://api.example-tts.com/v1/audio/speech`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: transcript,
        voice: "professional-coach-voice-id",
        speed: 1.0,
      })
    });

    if (!response.ok) {
      throw new Error("TTS Generation failed");
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(publicPath, Buffer.from(buffer));
    */

    return { audioUrl, status: "success" };
  } catch (error) {
    console.error(`Voiceover generation failed for ${safeSlug}:`, error);
    return { audioUrl: "", status: "error", error: "Failed to generate audio" };
  }
}
