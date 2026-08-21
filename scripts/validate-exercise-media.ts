import fs from 'fs';
import path from 'path';
import { EXERCISE_ASSETS } from '../src/data/exercise-assets';

function validateExerciseMedia() {
  const publicDir = path.join(process.cwd(), 'public');
  let errors = 0;
  
  console.log('--- Validating Exercise Media ---');

  for (const slug in EXERCISE_ASSETS) {
    const asset = EXERCISE_ASSETS[slug];

    if (asset.status === 'ready') {
      if (!asset.videoUrl) {
        console.error(`[ERROR] ${slug}: Missing videoUrl but status is ready`);
        errors++;
      } else if (asset.videoUrl.startsWith('/exercises/')) {
        const videoPath = path.join(publicDir, asset.videoUrl);
        if (!fs.existsSync(videoPath)) {
          console.error(`[ERROR] ${slug}: Video file not found at ${videoPath}`);
          errors++;
        }
      }

      if (asset.exerciseSlug !== slug) {
        console.error(`[ERROR] ${slug}: Mismatched video slug (${asset.exerciseSlug} != ${slug})`);
        errors++;
      }

      if (!asset.voiceoverUrl) {
        console.error(`[ERROR] ${slug}: Missing voiceoverUrl but status is ready`);
        errors++;
      } else if (asset.voiceoverUrl.startsWith('/exercises/')) {
        const audioPath = path.join(publicDir, asset.voiceoverUrl);
        if (!fs.existsSync(audioPath)) {
          console.error(`[ERROR] ${slug}: Voiceover file not found at ${audioPath}`);
          errors++;
        }
      }

      if (asset.voiceoverExerciseSlug !== slug) {
        console.error(`[ERROR] ${slug}: Mismatched voiceover slug (${asset.voiceoverExerciseSlug} != ${slug})`);
        errors++;
      }

      if (!asset.transcript) {
        console.error(`[ERROR] ${slug}: Missing transcript but status is ready`);
        errors++;
      }
    }
  }

  // Check for orphan or duplicate files in public/exercises/
  const exercisesDir = path.join(publicDir, 'exercises');
  if (fs.existsSync(exercisesDir)) {
    const files = fs.readdirSync(exercisesDir);
    for (const file of files) {
      if (file.endsWith('.mp4') || file.endsWith('.mp3')) {
        let isTracked = false;
        for (const slug in EXERCISE_ASSETS) {
          const asset = EXERCISE_ASSETS[slug];
          if (asset.videoUrl === `/exercises/${file}` || asset.voiceoverUrl === `/exercises/${file}`) {
            isTracked = true;
            break;
          }
        }
        if (!isTracked) {
          console.warn(`[WARN] Untracked or duplicate media file found: ${file}`);
        }
      }
    }
  }

  if (errors > 0) {
    console.error(`\nValidation Failed: ${errors} errors found.`);
    process.exit(1);
  } else {
    console.log('\nValidation Passed: All ready assets have verified media files and matching slugs.');
    process.exit(0);
  }
}

validateExerciseMedia();
