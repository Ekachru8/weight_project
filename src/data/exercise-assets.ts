export interface ExerciseAsset {
  exerciseSlug: string;
  exerciseName: string;
  videoUrl: string | null;
  videoSource: "pixabay" | "generated" | "local";
  videoSourcePage?: string;
  pixabayAssetId?: string;
  voiceoverUrl: string | null;
  voiceoverExerciseSlug: string;
  transcript: string;
  status: "ready" | "unavailable";
}

export const EXERCISE_ASSETS: Record<string, ExerciseAsset> = {
  "push-ups": {
    exerciseSlug: "push-ups",
    exerciseName: "Push-ups",
    videoUrl: "/exercises/push-ups.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "push-ups",
    transcript: "Start in a strong high-plank position with your hands slightly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Then press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Keep your elbows angled slightly back. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "incline-push-ups": {
    exerciseSlug: "incline-push-ups",
    exerciseName: "Incline push-ups",
    videoUrl: "/exercises/incline-push-ups.mp4",
    videoSource: "generated",
    voiceoverUrl: "/exercises/incline-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "incline-push-ups",
    transcript: "Place your hands on a stable elevated surface, such as a bench or sturdy table, and step your feet back until your body forms a straight line. Brace your core, bend your elbows, and lower your chest toward the surface with control. Press through your palms to return to the starting position. Keep your wrists aligned under your shoulders and avoid dropping your hips. Breathe in as you lower and breathe out as you press. Stop if you feel sharp pain or unusual discomfort.",
    status: "ready"
  },
  "knee-push-ups": {
    exerciseSlug: "knee-push-ups",
    exerciseName: "Knee push-ups",
    videoUrl: "/exercises/knee-push-ups.mp4",
    videoSource: "generated",
    voiceoverUrl: "/exercises/knee-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "knee-push-ups",
    transcript: "Start on your hands and knees. Walk your hands forward until there is a straight line from your head to your knees. Brace your core, bend your elbows, and lower your chest toward the floor. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press. Keep your neck neutral. Avoid letting your lower back sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "wide-grip-push-ups": {
    exerciseSlug: "wide-grip-push-ups",
    exerciseName: "Wide-grip push-ups",
    videoUrl: "/exercises/wide-grip-push-ups.mp4",
    videoSource: "generated",
    voiceoverUrl: "/exercises/wide-grip-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "wide-grip-push-ups",
    transcript: "Start in a strong high-plank position with your hands significantly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "diamond-push-ups": {
    exerciseSlug: "diamond-push-ups",
    exerciseName: "Diamond push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/diamond-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "diamond-push-ups",
    transcript: "Start in a strong position for Diamond push-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "decline-push-ups": {
    exerciseSlug: "decline-push-ups",
    exerciseName: "Decline push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/decline-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "decline-push-ups",
    transcript: "Start in a strong position for Decline push-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "chest-squeeze-press-with-dumbbells": {
    exerciseSlug: "chest-squeeze-press-with-dumbbells",
    exerciseName: "Chest squeeze press with dumbbells",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/chest-squeeze-press-with-dumbbells-voiceover.mp3",
    voiceoverExerciseSlug: "chest-squeeze-press-with-dumbbells",
    transcript: "Start in a strong position for Chest squeeze press with dumbbells. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "floor-dumbbell-press": {
    exerciseSlug: "floor-dumbbell-press",
    exerciseName: "Floor dumbbell press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/floor-dumbbell-press-voiceover.mp3",
    voiceoverExerciseSlug: "floor-dumbbell-press",
    transcript: "Start in a strong position for Floor dumbbell press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-chest-press": {
    exerciseSlug: "resistance-band-chest-press",
    exerciseName: "Resistance-band chest press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/resistance-band-chest-press-voiceover.mp3",
    voiceoverExerciseSlug: "resistance-band-chest-press",
    transcript: "Start in a strong position for Resistance-band chest press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "standing-wall-push-ups": {
    exerciseSlug: "standing-wall-push-ups",
    exerciseName: "Standing wall push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/standing-wall-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "standing-wall-push-ups",
    transcript: "Start in a strong position for Standing wall push-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pull-ups": {
    exerciseSlug: "pull-ups",
    exerciseName: "Pull-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/pull-ups-voiceover.mp3",
    voiceoverExerciseSlug: "pull-ups",
    transcript: "Start in a strong position for Pull-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "assisted-pull-ups": {
    exerciseSlug: "assisted-pull-ups",
    exerciseName: "Assisted pull-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/assisted-pull-ups-voiceover.mp3",
    voiceoverExerciseSlug: "assisted-pull-ups",
    transcript: "Start in a strong position for Assisted pull-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-rows": {
    exerciseSlug: "resistance-band-rows",
    exerciseName: "Resistance-band rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/resistance-band-rows-voiceover.mp3",
    voiceoverExerciseSlug: "resistance-band-rows",
    transcript: "Start in a strong position for Resistance-band rows. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "one-arm-dumbbell-rows": {
    exerciseSlug: "one-arm-dumbbell-rows",
    exerciseName: "One-arm dumbbell rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/one-arm-dumbbell-rows-voiceover.mp3",
    voiceoverExerciseSlug: "one-arm-dumbbell-rows",
    transcript: "Start in a strong position for One-arm dumbbell rows. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bent-over-dumbbell-rows": {
    exerciseSlug: "bent-over-dumbbell-rows",
    exerciseName: "Bent-over dumbbell rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bent-over-dumbbell-rows-voiceover.mp3",
    voiceoverExerciseSlug: "bent-over-dumbbell-rows",
    transcript: "Start in a strong position for Bent-over dumbbell rows. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "superman-holds": {
    exerciseSlug: "superman-holds",
    exerciseName: "Superman holds",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/superman-holds-voiceover.mp3",
    voiceoverExerciseSlug: "superman-holds",
    transcript: "Start in a strong position for Superman holds. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-snow-angels": {
    exerciseSlug: "reverse-snow-angels",
    exerciseName: "Reverse snow angels",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/reverse-snow-angels-voiceover.mp3",
    voiceoverExerciseSlug: "reverse-snow-angels",
    transcript: "Start in a strong position for Reverse snow angels. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bird-dog-rows": {
    exerciseSlug: "bird-dog-rows",
    exerciseName: "Bird-dog rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bird-dog-rows-voiceover.mp3",
    voiceoverExerciseSlug: "bird-dog-rows",
    transcript: "Start in a strong position for Bird-dog rows. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "doorway-rows": {
    exerciseSlug: "doorway-rows",
    exerciseName: "Doorway rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/doorway-rows-voiceover.mp3",
    voiceoverExerciseSlug: "doorway-rows",
    transcript: "Start in a strong position for Doorway rows. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "prone-y-t-w-raises": {
    exerciseSlug: "prone-y-t-w-raises",
    exerciseName: "Prone Y-T-W raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/prone-y-t-w-raises-voiceover.mp3",
    voiceoverExerciseSlug: "prone-y-t-w-raises",
    transcript: "Start in a strong position for Prone Y-T-W raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bodyweight-squats": {
    exerciseSlug: "bodyweight-squats",
    exerciseName: "Bodyweight squats",
    videoUrl: "/exercises/bodyweight-squats.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/bodyweight-squats-voiceover.mp3",
    voiceoverExerciseSlug: "bodyweight-squats",
    transcript: "Stand with your feet about shoulder-width apart and keep your chest open. Brace your core, send your hips back, and bend your knees to lower into a comfortable squat. Keep your knees tracking in line with your toes, then press through your feet to stand tall. Breathe in as you lower and breathe out as you rise. Avoid collapsing your knees inward or rounding your lower back. Use a chair for support if needed, and stop if you feel sharp pain, dizziness, or unusual shortness of breath.",
    status: "ready"
  },
  "sumo-squats": {
    exerciseSlug: "sumo-squats",
    exerciseName: "Sumo squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/sumo-squats-voiceover.mp3",
    voiceoverExerciseSlug: "sumo-squats",
    transcript: "Start in a strong position for Sumo squats. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pause-squats": {
    exerciseSlug: "pause-squats",
    exerciseName: "Pause squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/pause-squats-voiceover.mp3",
    voiceoverExerciseSlug: "pause-squats",
    transcript: "Start in a strong position for Pause squats. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "split-squats": {
    exerciseSlug: "split-squats",
    exerciseName: "Split squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/split-squats-voiceover.mp3",
    voiceoverExerciseSlug: "split-squats",
    transcript: "Start in a strong position for Split squats. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-lunges": {
    exerciseSlug: "reverse-lunges",
    exerciseName: "Reverse Lunges",
    videoUrl: "/exercises/reverse-lunges.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/reverse-lunges-voiceover.mp3",
    voiceoverExerciseSlug: "reverse-lunges",
    transcript: "Stand tall with your feet together. Step one foot back and lower your hips until both knees are bent at a 90-degree angle. Keep your front knee in line with your toes and your torso upright. Push off your back foot to return to the starting position. Breathe in as you lower and breathe out as you rise. Avoid letting your front knee collapse inward. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "forward-lunges": {
    exerciseSlug: "forward-lunges",
    exerciseName: "Forward lunges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/forward-lunges-voiceover.mp3",
    voiceoverExerciseSlug: "forward-lunges",
    transcript: "Start in a strong position for Forward lunges. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "walking-lunges": {
    exerciseSlug: "walking-lunges",
    exerciseName: "Walking lunges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/walking-lunges-voiceover.mp3",
    voiceoverExerciseSlug: "walking-lunges",
    transcript: "Start in a strong position for Walking lunges. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "step-ups": {
    exerciseSlug: "step-ups",
    exerciseName: "Step-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/step-ups-voiceover.mp3",
    voiceoverExerciseSlug: "step-ups",
    transcript: "Start in a strong position for Step-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "wall-sits": {
    exerciseSlug: "wall-sits",
    exerciseName: "Wall sits",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/wall-sits-voiceover.mp3",
    voiceoverExerciseSlug: "wall-sits",
    transcript: "Start in a strong position for Wall sits. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bulgarian-split-squats": {
    exerciseSlug: "bulgarian-split-squats",
    exerciseName: "Bulgarian split squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bulgarian-split-squats-voiceover.mp3",
    voiceoverExerciseSlug: "bulgarian-split-squats",
    transcript: "Start in a strong position for Bulgarian split squats. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "cossack-squats": {
    exerciseSlug: "cossack-squats",
    exerciseName: "Cossack squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/cossack-squats-voiceover.mp3",
    voiceoverExerciseSlug: "cossack-squats",
    transcript: "Start in a strong position for Cossack squats. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "calf-raises": {
    exerciseSlug: "calf-raises",
    exerciseName: "Calf raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/calf-raises-voiceover.mp3",
    voiceoverExerciseSlug: "calf-raises",
    transcript: "Start in a strong position for Calf raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "glute-bridges": {
    exerciseSlug: "glute-bridges",
    exerciseName: "Glute bridges",
    videoUrl: "/exercises/glute-bridges.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/glute-bridges-voiceover.mp3",
    voiceoverExerciseSlug: "glute-bridges",
    transcript: "Lie on your back with your knees bent and feet flat on the floor, hip-width apart. Brace your core and press through your heels to lift your hips until your body forms a straight line from your shoulders to your knees. Squeeze your glutes at the top, then lower with control. Breathe out as you lift and breathe in as you lower. Avoid arching your lower back excessively. Stop if you feel sharp pain or unusual discomfort.",
    status: "ready"
  },
  "single-leg-glute-bridges": {
    exerciseSlug: "single-leg-glute-bridges",
    exerciseName: "Single-leg glute bridges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/single-leg-glute-bridges-voiceover.mp3",
    voiceoverExerciseSlug: "single-leg-glute-bridges",
    transcript: "Start in a strong position for Single-leg glute bridges. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hip-thrusts-on-a-sofa": {
    exerciseSlug: "hip-thrusts-on-a-sofa",
    exerciseName: "Hip thrusts on a sofa",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/hip-thrusts-on-a-sofa-voiceover.mp3",
    voiceoverExerciseSlug: "hip-thrusts-on-a-sofa",
    transcript: "Start in a strong position for Hip thrusts on a sofa. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "donkey-kicks": {
    exerciseSlug: "donkey-kicks",
    exerciseName: "Donkey kicks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/donkey-kicks-voiceover.mp3",
    voiceoverExerciseSlug: "donkey-kicks",
    transcript: "Start in a strong position for Donkey kicks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "fire-hydrants": {
    exerciseSlug: "fire-hydrants",
    exerciseName: "Fire hydrants",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/fire-hydrants-voiceover.mp3",
    voiceoverExerciseSlug: "fire-hydrants",
    transcript: "Start in a strong position for Fire hydrants. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "standing-kickbacks": {
    exerciseSlug: "standing-kickbacks",
    exerciseName: "Standing kickbacks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/standing-kickbacks-voiceover.mp3",
    voiceoverExerciseSlug: "standing-kickbacks",
    transcript: "Start in a strong position for Standing kickbacks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "frog-pumps": {
    exerciseSlug: "frog-pumps",
    exerciseName: "Frog pumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/frog-pumps-voiceover.mp3",
    voiceoverExerciseSlug: "frog-pumps",
    transcript: "Start in a strong position for Frog pumps. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "curtsy-lunges": {
    exerciseSlug: "curtsy-lunges",
    exerciseName: "Curtsy lunges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/curtsy-lunges-voiceover.mp3",
    voiceoverExerciseSlug: "curtsy-lunges",
    transcript: "Start in a strong position for Curtsy lunges. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "banded-lateral-walks": {
    exerciseSlug: "banded-lateral-walks",
    exerciseName: "Banded lateral walks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/banded-lateral-walks-voiceover.mp3",
    voiceoverExerciseSlug: "banded-lateral-walks",
    transcript: "Start in a strong position for Banded lateral walks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pike-push-ups": {
    exerciseSlug: "pike-push-ups",
    exerciseName: "Pike push-ups",
    videoUrl: "/exercises/pike-push-ups.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/pike-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "pike-push-ups",
    transcript: "Start in a downward dog position with your hips high, forming an inverted V shape. Keep your legs and back straight. Bend your elbows and lower the top of your head toward the floor between your hands. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid rounding your back. Stop if you feel sharp pain, dizziness, or unusual shortness of breath.",
    status: "ready"
  },
  "dumbbell-shoulder-press": {
    exerciseSlug: "dumbbell-shoulder-press",
    exerciseName: "Dumbbell shoulder press",
    videoUrl: "/exercises/dumbbell-shoulder-press.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/dumbbell-shoulder-press-voiceover.mp3",
    voiceoverExerciseSlug: "dumbbell-shoulder-press",
    transcript: "Stand or sit tall, holding a dumbbell in each hand at shoulder height, palms facing forward. Brace your core and press the weights straight up overhead until your arms are fully extended. Lower the weights back to your shoulders with control. Breathe out as you press up and breathe in as you lower. Avoid arching your lower back or leaning back. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "arnold-press": {
    exerciseSlug: "arnold-press",
    exerciseName: "Arnold press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/arnold-press-voiceover.mp3",
    voiceoverExerciseSlug: "arnold-press",
    transcript: "Start in a strong position for Arnold press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "lateral-raises": {
    exerciseSlug: "lateral-raises",
    exerciseName: "Lateral raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/lateral-raises-voiceover.mp3",
    voiceoverExerciseSlug: "lateral-raises",
    transcript: "Start in a strong position for Lateral raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "front-raises": {
    exerciseSlug: "front-raises",
    exerciseName: "Front raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/front-raises-voiceover.mp3",
    voiceoverExerciseSlug: "front-raises",
    transcript: "Start in a strong position for Front raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bent-over-reverse-flyes": {
    exerciseSlug: "bent-over-reverse-flyes",
    exerciseName: "Bent-over reverse flyes",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bent-over-reverse-flyes-voiceover.mp3",
    voiceoverExerciseSlug: "bent-over-reverse-flyes",
    transcript: "Start in a strong position for Bent-over reverse flyes. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-shoulder-press": {
    exerciseSlug: "resistance-band-shoulder-press",
    exerciseName: "Resistance-band shoulder press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/resistance-band-shoulder-press-voiceover.mp3",
    voiceoverExerciseSlug: "resistance-band-shoulder-press",
    transcript: "Start in a strong position for Resistance-band shoulder press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "wall-handstand-hold": {
    exerciseSlug: "wall-handstand-hold",
    exerciseName: "Wall handstand hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/wall-handstand-hold-voiceover.mp3",
    voiceoverExerciseSlug: "wall-handstand-hold",
    transcript: "Start in a strong position for Wall handstand hold. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shoulder-taps": {
    exerciseSlug: "shoulder-taps",
    exerciseName: "Shoulder taps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/shoulder-taps-voiceover.mp3",
    voiceoverExerciseSlug: "shoulder-taps",
    transcript: "Start in a strong position for Shoulder taps. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "y-raises": {
    exerciseSlug: "y-raises",
    exerciseName: "Y-raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/y-raises-voiceover.mp3",
    voiceoverExerciseSlug: "y-raises",
    transcript: "Start in a strong position for Y-raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "close-grip-push-ups": {
    exerciseSlug: "close-grip-push-ups",
    exerciseName: "Close-grip push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/close-grip-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "close-grip-push-ups",
    transcript: "Start in a strong position for Close-grip push-ups. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "chair-tricep-dips": {
    exerciseSlug: "chair-tricep-dips",
    exerciseName: "Chair tricep dips",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/chair-tricep-dips-voiceover.mp3",
    voiceoverExerciseSlug: "chair-tricep-dips",
    transcript: "Start in a strong position for Chair tricep dips. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "overhead-tricep-extensions": {
    exerciseSlug: "overhead-tricep-extensions",
    exerciseName: "Overhead tricep extensions",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/overhead-tricep-extensions-voiceover.mp3",
    voiceoverExerciseSlug: "overhead-tricep-extensions",
    transcript: "Start in a strong position for Overhead tricep extensions. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dumbbell-bicep-curls": {
    exerciseSlug: "dumbbell-bicep-curls",
    exerciseName: "Dumbbell bicep curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/dumbbell-bicep-curls-voiceover.mp3",
    voiceoverExerciseSlug: "dumbbell-bicep-curls",
    transcript: "Start in a strong position for Dumbbell bicep curls. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hammer-curls": {
    exerciseSlug: "hammer-curls",
    exerciseName: "Hammer curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/hammer-curls-voiceover.mp3",
    voiceoverExerciseSlug: "hammer-curls",
    transcript: "Start in a strong position for Hammer curls. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "concentration-curls": {
    exerciseSlug: "concentration-curls",
    exerciseName: "Concentration curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/concentration-curls-voiceover.mp3",
    voiceoverExerciseSlug: "concentration-curls",
    transcript: "Start in a strong position for Concentration curls. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-curls": {
    exerciseSlug: "resistance-band-curls",
    exerciseName: "Resistance-band curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/resistance-band-curls-voiceover.mp3",
    voiceoverExerciseSlug: "resistance-band-curls",
    transcript: "Start in a strong position for Resistance-band curls. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "tricep-kickbacks": {
    exerciseSlug: "tricep-kickbacks",
    exerciseName: "Tricep kickbacks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/tricep-kickbacks-voiceover.mp3",
    voiceoverExerciseSlug: "tricep-kickbacks",
    transcript: "Start in a strong position for Tricep kickbacks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "isometric-bicep-holds": {
    exerciseSlug: "isometric-bicep-holds",
    exerciseName: "Isometric bicep holds",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/isometric-bicep-holds-voiceover.mp3",
    voiceoverExerciseSlug: "isometric-bicep-holds",
    transcript: "Start in a strong position for Isometric bicep holds. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "forearm-plank": {
    exerciseSlug: "forearm-plank",
    exerciseName: "Forearm Plank",
    videoUrl: "/exercises/forearm-plank.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/forearm-plank-voiceover.mp3",
    voiceoverExerciseSlug: "forearm-plank",
    transcript: "Lie face down, then prop yourself up on your forearms and toes. Ensure your elbows are directly under your shoulders. Keep your body in a straight line from your head to your heels. Brace your core tightly and squeeze your glutes. Breathe steadily throughout the hold. Avoid letting your hips sag or raising them too high. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "high-plank": {
    exerciseSlug: "high-plank",
    exerciseName: "High plank",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/high-plank-voiceover.mp3",
    voiceoverExerciseSlug: "high-plank",
    transcript: "Start in a strong position for High plank. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "side-plank": {
    exerciseSlug: "side-plank",
    exerciseName: "Side plank",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/side-plank-voiceover.mp3",
    voiceoverExerciseSlug: "side-plank",
    transcript: "Start in a strong position for Side plank. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dead-bug": {
    exerciseSlug: "dead-bug",
    exerciseName: "Dead bug",
    videoUrl: "/exercises/dead-bug.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/dead-bug-voiceover.mp3",
    voiceoverExerciseSlug: "dead-bug",
    transcript: "Lie flat on your back with your arms extended straight up and your knees bent at a 90-degree angle over your hips. Press your lower back firmly into the floor. Slowly lower your right arm and left leg toward the floor until they are just above it. Squeeze your core to bring them back up, then repeat on the opposite side. Breathe out as you extend and breathe in as you return. Keep your back flat against the floor. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "bird-dog": {
    exerciseSlug: "bird-dog",
    exerciseName: "Bird dog",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bird-dog-voiceover.mp3",
    voiceoverExerciseSlug: "bird-dog",
    transcript: "Start in a strong position for Bird dog. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "mountain-climbers": {
    exerciseSlug: "mountain-climbers",
    exerciseName: "Mountain climbers",
    videoUrl: "/exercises/mountain-climbers.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/mountain-climbers-voiceover.mp3",
    voiceoverExerciseSlug: "mountain-climbers",
    transcript: "Start in a strong high-plank position with your hands directly under your shoulders. Brace your core and quickly alternate bringing one knee toward your chest, as if running in place. Keep your hips low and stable. Breathe naturally as you move. Avoid bouncing your hips too high or letting them sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "bicycle-crunches": {
    exerciseSlug: "bicycle-crunches",
    exerciseName: "Bicycle crunches",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bicycle-crunches-voiceover.mp3",
    voiceoverExerciseSlug: "bicycle-crunches",
    transcript: "Start in a strong position for Bicycle crunches. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-crunches": {
    exerciseSlug: "reverse-crunches",
    exerciseName: "Reverse crunches",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/reverse-crunches-voiceover.mp3",
    voiceoverExerciseSlug: "reverse-crunches",
    transcript: "Start in a strong position for Reverse crunches. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "leg-raises": {
    exerciseSlug: "leg-raises",
    exerciseName: "Leg raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/leg-raises-voiceover.mp3",
    voiceoverExerciseSlug: "leg-raises",
    transcript: "Start in a strong position for Leg raises. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hollow-body-hold": {
    exerciseSlug: "hollow-body-hold",
    exerciseName: "Hollow-body hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/hollow-body-hold-voiceover.mp3",
    voiceoverExerciseSlug: "hollow-body-hold",
    transcript: "Start in a strong position for Hollow-body hold. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "russian-twists": {
    exerciseSlug: "russian-twists",
    exerciseName: "Russian twists",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/russian-twists-voiceover.mp3",
    voiceoverExerciseSlug: "russian-twists",
    transcript: "Start in a strong position for Russian twists. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bear-crawl": {
    exerciseSlug: "bear-crawl",
    exerciseName: "Bear crawl",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/bear-crawl-voiceover.mp3",
    voiceoverExerciseSlug: "bear-crawl",
    transcript: "Start in a strong position for Bear crawl. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "burpees": {
    exerciseSlug: "burpees",
    exerciseName: "Burpees",
    videoUrl: "/exercises/burpees.mp4",
    videoSource: "pixabay",
    voiceoverUrl: "/exercises/burpees-voiceover.mp3",
    voiceoverExerciseSlug: "burpees",
    transcript: "Stand with your feet shoulder-width apart. Lower into a squat, place your hands on the floor, and jump your feet back into a high plank. Perform a push-up, bringing your chest to the floor. Then jump your feet back up to your hands and explosively jump straight up, clapping overhead. Breathe out as you push up and jump, and breathe in on the way down. Keep a steady pace. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "squat-to-reach": {
    exerciseSlug: "squat-to-reach",
    exerciseName: "Squat to reach",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/squat-to-reach-voiceover.mp3",
    voiceoverExerciseSlug: "squat-to-reach",
    transcript: "Start in a strong position for Squat to reach. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "inchworms": {
    exerciseSlug: "inchworms",
    exerciseName: "Inchworms",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/inchworms-voiceover.mp3",
    voiceoverExerciseSlug: "inchworms",
    transcript: "Start in a strong position for Inchworms. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "devil-press": {
    exerciseSlug: "devil-press",
    exerciseName: "Devil press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/devil-press-voiceover.mp3",
    voiceoverExerciseSlug: "devil-press",
    transcript: "Start in a strong position for Devil press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dumbbell-thrusters": {
    exerciseSlug: "dumbbell-thrusters",
    exerciseName: "Dumbbell thrusters",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/dumbbell-thrusters-voiceover.mp3",
    voiceoverExerciseSlug: "dumbbell-thrusters",
    transcript: "Start in a strong position for Dumbbell thrusters. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "man-makers": {
    exerciseSlug: "man-makers",
    exerciseName: "Man makers",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/man-makers-voiceover.mp3",
    voiceoverExerciseSlug: "man-makers",
    transcript: "Start in a strong position for Man makers. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "plank-to-push-up": {
    exerciseSlug: "plank-to-push-up",
    exerciseName: "Plank to push-up",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/plank-to-push-up-voiceover.mp3",
    voiceoverExerciseSlug: "plank-to-push-up",
    transcript: "Start in a strong position for Plank to push-up. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "clean-and-press": {
    exerciseSlug: "clean-and-press",
    exerciseName: "Clean and press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/clean-and-press-voiceover.mp3",
    voiceoverExerciseSlug: "clean-and-press",
    transcript: "Start in a strong position for Clean and press. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-lunge-to-knee-drive": {
    exerciseSlug: "reverse-lunge-to-knee-drive",
    exerciseName: "Reverse lunge to knee drive",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/reverse-lunge-to-knee-drive-voiceover.mp3",
    voiceoverExerciseSlug: "reverse-lunge-to-knee-drive",
    transcript: "Start in a strong position for Reverse lunge to knee drive. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "jumping-jacks": {
    exerciseSlug: "jumping-jacks",
    exerciseName: "Jumping Jacks",
    videoUrl: "/exercises/jumping-jacks.mp4",
    videoSource: "generated",
    voiceoverUrl: "/exercises/jumping-jacks-voiceover.mp3",
    voiceoverExerciseSlug: "jumping-jacks",
    transcript: "Stand tall with your feet together and arms at your sides. Jump your feet wide while raising your arms overhead. Jump back to the starting position. Keep a steady pace and stay light on your feet. Breathe naturally throughout the movement. Avoid landing heavily on your heels. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "ready"
  },
  "high-knees": {
    exerciseSlug: "high-knees",
    exerciseName: "High knees",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/high-knees-voiceover.mp3",
    voiceoverExerciseSlug: "high-knees",
    transcript: "Start in a strong position for High knees. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "butt-kicks": {
    exerciseSlug: "butt-kicks",
    exerciseName: "Butt kicks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/butt-kicks-voiceover.mp3",
    voiceoverExerciseSlug: "butt-kicks",
    transcript: "Start in a strong position for Butt kicks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "skater-hops": {
    exerciseSlug: "skater-hops",
    exerciseName: "Skater hops",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/skater-hops-voiceover.mp3",
    voiceoverExerciseSlug: "skater-hops",
    transcript: "Start in a strong position for Skater hops. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "fast-feet": {
    exerciseSlug: "fast-feet",
    exerciseName: "Fast feet",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/fast-feet-voiceover.mp3",
    voiceoverExerciseSlug: "fast-feet",
    transcript: "Start in a strong position for Fast feet. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "squat-jumps": {
    exerciseSlug: "squat-jumps",
    exerciseName: "Squat jumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/squat-jumps-voiceover.mp3",
    voiceoverExerciseSlug: "squat-jumps",
    transcript: "Start in a strong position for Squat jumps. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "tuck-jumps": {
    exerciseSlug: "tuck-jumps",
    exerciseName: "Tuck jumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/tuck-jumps-voiceover.mp3",
    voiceoverExerciseSlug: "tuck-jumps",
    transcript: "Start in a strong position for Tuck jumps. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shadow-boxing": {
    exerciseSlug: "shadow-boxing",
    exerciseName: "Shadow boxing",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/shadow-boxing-voiceover.mp3",
    voiceoverExerciseSlug: "shadow-boxing",
    transcript: "Start in a strong position for Shadow boxing. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "stair-stepping": {
    exerciseSlug: "stair-stepping",
    exerciseName: "Stair stepping",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/stair-stepping-voiceover.mp3",
    voiceoverExerciseSlug: "stair-stepping",
    transcript: "Start in a strong position for Stair stepping. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "marching-in-place": {
    exerciseSlug: "marching-in-place",
    exerciseName: "Marching in place",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/marching-in-place-voiceover.mp3",
    voiceoverExerciseSlug: "marching-in-place",
    transcript: "Start in a strong position for Marching in place. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "cat-cow-stretch": {
    exerciseSlug: "cat-cow-stretch",
    exerciseName: "Cat-cow stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/cat-cow-stretch-voiceover.mp3",
    voiceoverExerciseSlug: "cat-cow-stretch",
    transcript: "Start in a strong position for Cat-cow stretch. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "childs-pose": {
    exerciseSlug: "childs-pose",
    exerciseName: "Child's pose",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/childs-pose-voiceover.mp3",
    voiceoverExerciseSlug: "childs-pose",
    transcript: "Start in a strong position for Child's pose. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "worlds-greatest-stretch": {
    exerciseSlug: "worlds-greatest-stretch",
    exerciseName: "World's greatest stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/worlds-greatest-stretch-voiceover.mp3",
    voiceoverExerciseSlug: "worlds-greatest-stretch",
    transcript: "Start in a strong position for World's greatest stretch. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hip-flexor-stretch": {
    exerciseSlug: "hip-flexor-stretch",
    exerciseName: "Hip flexor stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/hip-flexor-stretch-voiceover.mp3",
    voiceoverExerciseSlug: "hip-flexor-stretch",
    transcript: "Start in a strong position for Hip flexor stretch. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hamstring-stretch": {
    exerciseSlug: "hamstring-stretch",
    exerciseName: "Hamstring stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/hamstring-stretch-voiceover.mp3",
    voiceoverExerciseSlug: "hamstring-stretch",
    transcript: "Start in a strong position for Hamstring stretch. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "thoracic-rotations": {
    exerciseSlug: "thoracic-rotations",
    exerciseName: "Thoracic rotations",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/thoracic-rotations-voiceover.mp3",
    voiceoverExerciseSlug: "thoracic-rotations",
    transcript: "Start in a strong position for Thoracic rotations. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shoulder-circles": {
    exerciseSlug: "shoulder-circles",
    exerciseName: "Shoulder circles",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/shoulder-circles-voiceover.mp3",
    voiceoverExerciseSlug: "shoulder-circles",
    transcript: "Start in a strong position for Shoulder circles. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "ankle-mobility-rocks": {
    exerciseSlug: "ankle-mobility-rocks",
    exerciseName: "Ankle mobility rocks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/ankle-mobility-rocks-voiceover.mp3",
    voiceoverExerciseSlug: "ankle-mobility-rocks",
    transcript: "Start in a strong position for Ankle mobility rocks. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "9090-hip-switches": {
    exerciseSlug: "9090-hip-switches",
    exerciseName: "90/90 hip switches",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/9090-hip-switches-voiceover.mp3",
    voiceoverExerciseSlug: "9090-hip-switches",
    transcript: "Start in a strong position for 90/90 hip switches. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "deep-squat-hold": {
    exerciseSlug: "deep-squat-hold",
    exerciseName: "Deep squat hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: "/exercises/deep-squat-hold-voiceover.mp3",
    voiceoverExerciseSlug: "deep-squat-hold",
    transcript: "Start in a strong position for Deep squat hold. Brace your core and keep your chest lifted. Perform the movement with control, focusing on proper form. Breathe in during the lowering phase and out during the effort. Avoid rushing the movement or losing tension. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
};
