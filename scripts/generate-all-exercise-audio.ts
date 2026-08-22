import { prisma } from '../src/lib/prisma';
import { generateExerciseAudio, buildExerciseTranscript } from '../src/lib/audio-provider';
import crypto from 'crypto';

function hashString(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

async function main() {
  console.log('Starting exercise audio generation...');

  const exercises = await prisma.exercise.findMany();
  console.log(`Found ${exercises.length} exercises to process.`);

  let generated = 0;
  let alreadyReady = 0;
  let failed = 0;
  let missingMetadata = 0;

  for (const exercise of exercises) {
    try {
      const transcript = buildExerciseTranscript(exercise);
      const transcriptHash = hashString(transcript).substring(0, 12);

      // Check if it's already ready with this specific hash
      if (
        exercise.audioStatus === 'ready' &&
        exercise.audioUrl &&
        exercise.transcript === transcript
      ) {
        console.log(`[SKIP] ${exercise.slug} - Audio already ready and matches transcript hash.`);
        alreadyReady++;
        continue;
      }

      console.log(`[GENERATE] Generating audio for ${exercise.slug}...`);
      await generateExerciseAudio(exercise);
      generated++;
      console.log(`[SUCCESS] ${exercise.slug} audio generated successfully.`);
    } catch (e: any) {
      console.error(`[ERROR] Failed to generate audio for ${exercise.slug}: ${e.message}`);
      if (e.message.includes('TTS provider not configured')) {
        missingMetadata++;
      } else {
        failed++;
      }
    }
    
    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n--- Generation Report ---');
  console.log(`Total exercises: ${exercises.length}`);
  console.log(`Generated: ${generated}`);
  console.log(`Already ready: ${alreadyReady}`);
  console.log(`Failed: ${failed}`);
  console.log(`Missing configuration: ${missingMetadata}`);
  console.log('-------------------------\n');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
