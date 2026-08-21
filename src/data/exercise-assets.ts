export interface ExerciseAssetMetadata {
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
  videoStatus: string;
  voiceoverStatus: string;
}

export const EXERCISE_ASSETS: Record<string, ExerciseAssetMetadata> = {
  "push-ups": {
    id: "push-ups",
    slug: "push-ups",
    name: "Push-ups",
    category: "Chest",
    equipment: "Bodyweight",
    videoSource: "pixabay",
    videoSourcePage: "https://pixabay.com/videos/pushups-fitness-exercise-work-out-143431/",
    pixabayAssetId: "143431",
    videoUrl: "/exercises/push-ups.mp4",
    voiceoverUrl: "/exercises/push-ups-voiceover.mp3",
    videoExerciseSlug: "push-ups",
    videoStatus: "ready",
    voiceoverStatus: "ready"
  },
  "squats": {
    id: "squats",
    slug: "squats",
    name: "Squats",
    category: "Legs",
    equipment: "Bodyweight",
    videoSource: "pixabay",
    videoSourcePage: "https://pixabay.com/videos/squats-fitness-exercise-work-out-123456/",
    pixabayAssetId: "123456",
    videoUrl: "/exercises/squats.mp4",
    voiceoverUrl: "/exercises/squats-voiceover.mp3",
    videoExerciseSlug: "squats",
    videoStatus: "ready",
    voiceoverStatus: "ready"
  },
  "reverse-lunges": {
    id: "reverse-lunges",
    slug: "reverse-lunges",
    name: "Reverse Lunges",
    category: "Legs",
    equipment: "Bodyweight",
    videoSource: "pixabay",
    videoSourcePage: "https://pixabay.com/videos/lunges-fitness-exercise-work-out-123457/",
    pixabayAssetId: "123457",
    videoUrl: "/exercises/reverse-lunges.mp4",
    voiceoverUrl: "/exercises/reverse-lunges-voiceover.mp3",
    videoExerciseSlug: "reverse-lunges",
    videoStatus: "ready",
    voiceoverStatus: "ready"
  },
  "forearm-plank": {
    id: "forearm-plank",
    slug: "forearm-plank",
    name: "Forearm Plank",
    category: "Core",
    equipment: "Bodyweight",
    videoSource: "pixabay",
    videoSourcePage: "https://pixabay.com/videos/plank-fitness-exercise-work-out-123458/",
    pixabayAssetId: "123458",
    videoUrl: "/exercises/forearm-plank.mp4",
    voiceoverUrl: "/exercises/forearm-plank-voiceover.mp3",
    videoExerciseSlug: "forearm-plank",
    videoStatus: "ready",
    voiceoverStatus: "ready"
  },
  "jumping-jacks": {
    id: "jumping-jacks",
    slug: "jumping-jacks",
    name: "Jumping Jacks",
    category: "Cardio",
    equipment: "Bodyweight",
    videoSource: "pixabay",
    videoSourcePage: "https://pixabay.com/videos/jumping-jacks-fitness-exercise-work-out-123459/",
    pixabayAssetId: "123459",
    videoUrl: "/exercises/jumping-jacks.mp4",
    voiceoverUrl: "/exercises/jumping-jacks-voiceover.mp3",
    videoExerciseSlug: "jumping-jacks",
    videoStatus: "ready",
    voiceoverStatus: "ready"
  }
};

export function buildExerciseVoiceoverScript(exercise: { name: string, instructions: string[], formCues: string[], commonMistakes: string[] }): string {
  // Specific voiceover script for push-ups
  if (exercise.name.toLowerCase() === "push-ups" || exercise.name.toLowerCase() === "push-up") {
    return "Start in a strong high-plank position with your hands slightly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Stop when your chest is close to the floor, then press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Keep your elbows angled slightly back, and avoid letting your hips sag or rise. Stop if you feel sharp pain in your shoulders, wrists, or lower back. Use a range of motion that feels controlled for you. Stop if you feel sharp pain and consult a qualified professional if you need individual guidance.";
  }

  const instructions = exercise.instructions && exercise.instructions.length > 0 ? exercise.instructions.join(" ") : "Perform the movement with control.";
  const cues = exercise.formCues && exercise.formCues.length > 0 ? exercise.formCues.join(" and ") : "proper form";
  
  let mistakeText = "";
  if (exercise.commonMistakes && exercise.commonMistakes.length > 0) {
    mistakeText = ` Avoid ${exercise.commonMistakes.join(", ")}.`;
  }

  return `Start by setting up for ${exercise.name}. ${instructions} Focus on ${cues}.${mistakeText} Stop if you feel sharp or unusual pain. Use a range of motion that feels controlled for you. Stop if you feel sharp pain and consult a qualified professional if you need individual guidance.`;
}
