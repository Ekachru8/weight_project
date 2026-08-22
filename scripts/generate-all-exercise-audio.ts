import { EXERCISES } from "../src/data/exercises";
import { EXERCISE_ASSETS } from "../src/data/exercise-assets";
import { generateExerciseAudio } from "../src/lib/audio-provider";
import fs from "fs";
import path from "path";

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Starting audio generation for ${EXERCISES.length} exercises...`);
  
  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // We'll update a local copy of assets and then write it to the file
  const updatedAssets = { ...EXERCISE_ASSETS } as any;

  for (const exercise of EXERCISES) {
    const existing = updatedAssets[exercise.slug] || {};
    
    if (existing?.status === "ready" && existing?.voiceoverUrl) {
      console.log(`[SKIPPED] ${exercise.slug} already has audio.`);
      skippedCount++;
      continue;
    }

    console.log(`[GENERATING] ${exercise.slug}...`);
    
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await generateExerciseAudio(exercise);
        
        if (result && result.audioUrl) {
          updatedAssets[exercise.slug] = {
            ...existing,
            exerciseName: exercise.name,
            voiceoverUrl: result.audioUrl,
            status: "ready", // this indicates audio is ready in exercise-assets.ts
            transcript: result.transcript,
            transcriptHash: result.transcriptHash
          };
          success = true;
          successCount++;
          console.log(`  -> Success: ${result.audioUrl}`);
          break;
        } else {
           throw new Error("No URL returned");
        }
      } catch (err: any) {
        console.warn(`  -> Attempt ${attempt} failed: ${err.message}`);
        if (attempt < 3) await delay(2000);
      }
    }

    if (!success) {
      console.error(`[FAILED] Could not generate audio for ${exercise.slug} after 3 attempts.`);
      failedCount++;
      updatedAssets[exercise.slug] = {
        ...existing,
        status: "failed"
      };
    }

    // Save after each one so we don't lose progress
    const fileContent = `export const EXERCISE_ASSETS: Record<string, any> = ${JSON.stringify(updatedAssets, null, 2)};\n`;
    fs.writeFileSync(path.join(process.cwd(), "src/data/exercise-assets.ts"), fileContent, "utf8");

    // Rate limiting delay
    await delay(1000);
  }

  console.log(`\nGeneration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Failed:  ${failedCount}`);
}

main().catch(console.error);
