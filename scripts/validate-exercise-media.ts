import { EXERCISES } from "../src/data/exercises";
import { EXERCISE_ASSETS } from "../src/data/exercise-assets";

async function main() {
  console.log("Validating exercise media against trusted catalog...\n");
  
  let missingImageCount = 0;
  let missingAudioCount = 0;
  let invalidStatusCount = 0;
  
  for (const exercise of EXERCISES) {
    const asset = EXERCISE_ASSETS[exercise.slug];
    
    if (!asset) {
      console.warn(`[MISSING] ${exercise.slug} has no entry in EXERCISE_ASSETS`);
      missingImageCount++;
      missingAudioCount++;
      continue;
    }

    if (asset.imageStatus !== "ready" || !asset.imageUrl) {
      console.warn(`[MISSING IMAGE] ${exercise.slug} is missing a generated image (status: ${asset.imageStatus})`);
      missingImageCount++;
    }

    if (asset.status !== "ready" || !asset.voiceoverUrl) {
      console.warn(`[MISSING AUDIO] ${exercise.slug} is missing generated audio (status: ${asset.status})`);
      missingAudioCount++;
    }
  }

  console.log("\n--- Validation Summary ---");
  console.log(`Total Exercises: ${EXERCISES.length}`);
  console.log(`Missing Images:  ${missingImageCount}`);
  console.log(`Missing Audio:   ${missingAudioCount}`);
  console.log(`Invalid Status:  ${invalidStatusCount}`);
  
  if (missingImageCount === 0 && missingAudioCount === 0) {
    console.log("\n✅ All exercises have successfully generated media assets!");
  } else {
    console.log("\n❌ Some exercises are missing media assets. Please run the generation scripts.");
  }
}

main().catch(console.error);
