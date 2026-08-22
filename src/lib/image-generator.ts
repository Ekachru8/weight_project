import { OpenAI } from "openai";
import { storeImageBuffer } from "./storage-provider";

export async function generateImage({
  prompt,
  negativePrompt,
  slug,
  hash
}: {
  prompt: string;
  negativePrompt?: string;
  slug: string;
  hash: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("No API key found for image generation. Using a mock placeholder.");
    // 1x1 transparent WebP buffer
    const mockBuffer = Buffer.from("UklGRhIAAABXRUJQVlA4TA4AAAAvAAAAAIiI/gcA", "base64");
    const { permanentUrl } = await storeImageBuffer(mockBuffer, slug, hash);
    return { imageUrl: permanentUrl };
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_API_BASE || undefined,
    });

    // We'll use DALL-E 3 if available. Negative prompt isn't supported in standard DALL-E 3 API,
    // but we've embedded the constraints into the main prompt.
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const base64Data = response?.data?.[0]?.b64_json;
    if (!base64Data) {
      throw new Error("No image data returned from provider");
    }

    const buffer = Buffer.from(base64Data, "base64");
    
    // Store image buffer permanently
    const { permanentUrl } = await storeImageBuffer(buffer, slug, hash);
    
    return { imageUrl: permanentUrl };

  } catch (error) {
    console.error(`Failed to generate image for ${slug}:`, error);
    return null;
  }
}

export async function generateExerciseImage(exercise: any) {
  const prompt = `Create a professional fitness instruction image showing one realistic adult athlete performing exactly ${exercise.name}.
Exercise variation: ${exercise.name}.
Body position: ${exercise.instructions?.[0] || 'correct starting or mid-movement position clearly'}.
Movement pattern: ${exercise.movementPattern}.
Equipment: ${exercise.equipment}.
Target muscles: ${exercise.targetMuscles?.join(", ")}.
Correct form cues: ${exercise.formCues?.join("; ")}.
Show the full body from a clear side three-quarter angle in a clean home-workout studio. Use natural lighting, realistic anatomy, modest athletic clothing, and no text. This image is specifically for ${exercise.name}.`;

  const negativePrompt = `Do not show a different exercise, a different variation, animals, fantasy characters, unrelated equipment, random objects, distorted anatomy, extra limbs, multiple athletes, logos, text overlays, or incorrect posture.`;

  const crypto = require("crypto");
  const hash = crypto.createHash("sha256").update(prompt).digest("hex").slice(0, 16);

  const result = await generateImage({
    prompt,
    negativePrompt,
    slug: exercise.slug,
    hash
  });

  return { ...result, prompt, hash };
}
