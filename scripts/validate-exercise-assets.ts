import { EXERCISE_ASSETS } from '../src/data/exercise-assets';
import { prisma } from '../src/lib/prisma';

async function main() {
  const exercises = await prisma.exercise.findMany();
  let hasErrors = false;

  console.log('Validating exercise assets...');

  for (const ex of exercises) {
    const asset = EXERCISE_ASSETS[ex.slug];

    if (!asset) {
      console.error(`Missing asset entry entirely for slug: ${ex.slug}`);
      hasErrors = true;
      continue;
    }

    if (asset.status === 'ready') {
      if (!asset.videoUrl) {
        console.error(`Missing video URL for ready asset: ${ex.slug}`);
        hasErrors = true;
      }
      if (asset.exerciseSlug !== ex.slug) {
        console.error(`Mismatch exerciseSlug for ready asset: ${ex.slug} (found: ${asset.exerciseSlug})`);
        hasErrors = true;
      }
      if (!asset.voiceoverUrl) {
        console.error(`Missing voiceover URL for ready asset: ${ex.slug}`);
        hasErrors = true;
      }
      if (asset.voiceoverExerciseSlug !== ex.slug) {
        console.error(`Mismatch voiceoverExerciseSlug for ready asset: ${ex.slug} (found: ${asset.voiceoverExerciseSlug})`);
        hasErrors = true;
      }
    } else {
      console.warn(`Missing media: ${ex.slug}`);
    }
  }

  if (hasErrors) {
    console.error('Validation failed with errors.');
    process.exit(1);
  } else {
    console.log('Validation passed. All ready assets match their exact slugs.');
    process.exit(0);
  }
}

main();
