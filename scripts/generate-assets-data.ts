import fs from 'fs';

const names = [
  "Push-ups",
  "Incline push-ups",
  "Knee push-ups",
  "Wide-grip push-ups",
  "Diamond push-ups",
  "Decline push-ups",
  "Chest squeeze press with dumbbells",
  "Floor dumbbell press",
  "Resistance-band chest press",
  "Standing wall push-ups",
  "Pull-ups",
  "Assisted pull-ups",
  "Resistance-band rows",
  "One-arm dumbbell rows",
  "Bent-over dumbbell rows",
  "Superman holds",
  "Reverse snow angels",
  "Bird-dog rows",
  "Doorway rows",
  "Prone Y-T-W raises",
  "Bodyweight squats",
  "Sumo squats",
  "Pause squats",
  "Split squats",
  "Reverse lunges",
  "Forward lunges",
  "Walking lunges",
  "Step-ups",
  "Wall sits",
  "Bulgarian split squats",
  "Cossack squats",
  "Calf raises",
  "Glute bridges",
  "Single-leg glute bridges",
  "Hip thrusts on a sofa",
  "Donkey kicks",
  "Fire hydrants",
  "Standing kickbacks",
  "Frog pumps",
  "Curtsy lunges",
  "Banded lateral walks",
  "Pike push-ups",
  "Dumbbell shoulder press",
  "Arnold press",
  "Lateral raises",
  "Front raises",
  "Bent-over reverse flyes",
  "Resistance-band shoulder press",
  "Wall handstand hold",
  "Shoulder taps",
  "Y-raises",
  "Close-grip push-ups",
  "Chair tricep dips",
  "Overhead tricep extensions",
  "Dumbbell bicep curls",
  "Hammer curls",
  "Concentration curls",
  "Resistance-band curls",
  "Tricep kickbacks",
  "Isometric bicep holds",
  "Forearm plank",
  "High plank",
  "Side plank",
  "Dead bug",
  "Bird dog",
  "Mountain climbers",
  "Bicycle crunches",
  "Reverse crunches",
  "Leg raises",
  "Hollow-body hold",
  "Russian twists",
  "Bear crawl",
  "Burpees",
  "Squat to reach",
  "Inchworms",
  "Devil press",
  "Dumbbell thrusters",
  "Man makers",
  "Plank to push-up",
  "Clean and press",
  "Reverse lunge to knee drive",
  "Jumping jacks",
  "High knees",
  "Butt kicks",
  "Skater hops",
  "Fast feet",
  "Squat jumps",
  "Tuck jumps",
  "Shadow boxing",
  "Stair stepping",
  "Marching in place",
  "Cat-cow stretch",
  "Child's pose",
  "World's greatest stretch",
  "Hip flexor stretch",
  "Hamstring stretch",
  "Thoracic rotations",
  "Shoulder circles",
  "Ankle mobility rocks",
  "90/90 hip switches",
  "Deep squat hold"
];

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

async function main() {
  const { EXERCISE_ASSETS } = await import('../src/data/exercise-assets');
  
  const newAssets: any = {};
  
  names.forEach(name => {
    const slug = slugify(name);
    if (EXERCISE_ASSETS[slug]) {
      newAssets[slug] = EXERCISE_ASSETS[slug];
    } else {
      newAssets[slug] = {
        id: slug,
        slug: slug,
        name: name,
        category: '',
        equipment: '',
        videoSource: 'generated',
        videoSourcePage: '',
        pixabayAssetId: '',
        videoUrl: '',
        voiceoverUrl: '',
        videoExerciseSlug: slug,
        voiceoverExerciseSlug: slug,
        videoStatus: 'missing',
        voiceoverStatus: 'missing'
      };
    }
  });

  const content = `export interface ExerciseAssetMetadata {
  id: string;
  slug: string;
  name: string;
  category: string;
  equipment: string;
  videoSource: string;
  videoSourcePage: string;
  pixabayAssetId: string;
  videoUrl: string;
  voiceoverUrl: string;
  videoExerciseSlug: string;
  voiceoverExerciseSlug?: string;
  videoStatus: string;
  voiceoverStatus: string;
  transcriptUrl?: string;
}

export const EXERCISE_ASSETS: Record<string, ExerciseAssetMetadata> = ${JSON.stringify(newAssets, null, 2)};
`;

  fs.writeFileSync('src/data/exercise-assets.ts', content);
  console.log('Wrote to src/data/exercise-assets.ts');
}

main().then(() => process.exit(0));
