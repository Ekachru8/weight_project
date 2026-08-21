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
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "diamond-push-ups",
    transcript: "Set up for Diamond push-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "decline-push-ups": {
    exerciseSlug: "decline-push-ups",
    exerciseName: "Decline push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "decline-push-ups",
    transcript: "Set up for Decline push-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "chest-squeeze-press-with-dumbbells": {
    exerciseSlug: "chest-squeeze-press-with-dumbbells",
    exerciseName: "Chest squeeze press with dumbbells",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "chest-squeeze-press-with-dumbbells",
    transcript: "Set up for Chest squeeze press with dumbbells. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "floor-dumbbell-press": {
    exerciseSlug: "floor-dumbbell-press",
    exerciseName: "Floor dumbbell press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "floor-dumbbell-press",
    transcript: "Set up for Floor dumbbell press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-chest-press": {
    exerciseSlug: "resistance-band-chest-press",
    exerciseName: "Resistance-band chest press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "resistance-band-chest-press",
    transcript: "Set up for Resistance-band chest press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "standing-wall-push-ups": {
    exerciseSlug: "standing-wall-push-ups",
    exerciseName: "Standing wall push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "standing-wall-push-ups",
    transcript: "Set up for Standing wall push-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pull-ups": {
    exerciseSlug: "pull-ups",
    exerciseName: "Pull-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "pull-ups",
    transcript: "Set up for Pull-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "assisted-pull-ups": {
    exerciseSlug: "assisted-pull-ups",
    exerciseName: "Assisted pull-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "assisted-pull-ups",
    transcript: "Set up for Assisted pull-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-rows": {
    exerciseSlug: "resistance-band-rows",
    exerciseName: "Resistance-band rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "resistance-band-rows",
    transcript: "Set up for Resistance-band rows. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "one-arm-dumbbell-rows": {
    exerciseSlug: "one-arm-dumbbell-rows",
    exerciseName: "One-arm dumbbell rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "one-arm-dumbbell-rows",
    transcript: "Set up for One-arm dumbbell rows. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bent-over-dumbbell-rows": {
    exerciseSlug: "bent-over-dumbbell-rows",
    exerciseName: "Bent-over dumbbell rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bent-over-dumbbell-rows",
    transcript: "Set up for Bent-over dumbbell rows. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "superman-holds": {
    exerciseSlug: "superman-holds",
    exerciseName: "Superman holds",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "superman-holds",
    transcript: "Set up for Superman holds. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-snow-angels": {
    exerciseSlug: "reverse-snow-angels",
    exerciseName: "Reverse snow angels",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "reverse-snow-angels",
    transcript: "Set up for Reverse snow angels. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bird-dog-rows": {
    exerciseSlug: "bird-dog-rows",
    exerciseName: "Bird-dog rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bird-dog-rows",
    transcript: "Set up for Bird-dog rows. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "doorway-rows": {
    exerciseSlug: "doorway-rows",
    exerciseName: "Doorway rows",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "doorway-rows",
    transcript: "Set up for Doorway rows. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "prone-y-t-w-raises": {
    exerciseSlug: "prone-y-t-w-raises",
    exerciseName: "Prone Y-T-W raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "prone-y-t-w-raises",
    transcript: "Set up for Prone Y-T-W raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bodyweight-squats": {
    exerciseSlug: "bodyweight-squats",
    exerciseName: "Bodyweight squats",
    videoUrl: "/exercises/bodyweight-squats.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "sumo-squats",
    transcript: "Set up for Sumo squats. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pause-squats": {
    exerciseSlug: "pause-squats",
    exerciseName: "Pause squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "pause-squats",
    transcript: "Set up for Pause squats. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "split-squats": {
    exerciseSlug: "split-squats",
    exerciseName: "Split squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "split-squats",
    transcript: "Set up for Split squats. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-lunges": {
    exerciseSlug: "reverse-lunges",
    exerciseName: "Reverse Lunges",
    videoUrl: "/exercises/reverse-lunges.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "forward-lunges",
    transcript: "Set up for Forward lunges. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "walking-lunges": {
    exerciseSlug: "walking-lunges",
    exerciseName: "Walking lunges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "walking-lunges",
    transcript: "Set up for Walking lunges. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "step-ups": {
    exerciseSlug: "step-ups",
    exerciseName: "Step-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "step-ups",
    transcript: "Set up for Step-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "wall-sits": {
    exerciseSlug: "wall-sits",
    exerciseName: "Wall sits",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "wall-sits",
    transcript: "Set up for Wall sits. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bulgarian-split-squats": {
    exerciseSlug: "bulgarian-split-squats",
    exerciseName: "Bulgarian split squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bulgarian-split-squats",
    transcript: "Set up for Bulgarian split squats. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "cossack-squats": {
    exerciseSlug: "cossack-squats",
    exerciseName: "Cossack squats",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "cossack-squats",
    transcript: "Set up for Cossack squats. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "calf-raises": {
    exerciseSlug: "calf-raises",
    exerciseName: "Calf raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "calf-raises",
    transcript: "Set up for Calf raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "glute-bridges": {
    exerciseSlug: "glute-bridges",
    exerciseName: "Glute bridges",
    videoUrl: "/exercises/glute-bridges.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "single-leg-glute-bridges",
    transcript: "Set up for Single-leg glute bridges. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hip-thrusts-on-a-sofa": {
    exerciseSlug: "hip-thrusts-on-a-sofa",
    exerciseName: "Hip thrusts on a sofa",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "hip-thrusts-on-a-sofa",
    transcript: "Set up for Hip thrusts on a sofa. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "donkey-kicks": {
    exerciseSlug: "donkey-kicks",
    exerciseName: "Donkey kicks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "donkey-kicks",
    transcript: "Set up for Donkey kicks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "fire-hydrants": {
    exerciseSlug: "fire-hydrants",
    exerciseName: "Fire hydrants",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "fire-hydrants",
    transcript: "Set up for Fire hydrants. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "standing-kickbacks": {
    exerciseSlug: "standing-kickbacks",
    exerciseName: "Standing kickbacks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "standing-kickbacks",
    transcript: "Set up for Standing kickbacks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "frog-pumps": {
    exerciseSlug: "frog-pumps",
    exerciseName: "Frog pumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "frog-pumps",
    transcript: "Set up for Frog pumps. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "curtsy-lunges": {
    exerciseSlug: "curtsy-lunges",
    exerciseName: "Curtsy lunges",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "curtsy-lunges",
    transcript: "Set up for Curtsy lunges. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "banded-lateral-walks": {
    exerciseSlug: "banded-lateral-walks",
    exerciseName: "Banded lateral walks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "banded-lateral-walks",
    transcript: "Set up for Banded lateral walks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "pike-push-ups": {
    exerciseSlug: "pike-push-ups",
    exerciseName: "Pike push-ups",
    videoUrl: "/exercises/pike-push-ups.mp4",
    videoSource: "generated",
    voiceoverUrl: "/exercises/pike-push-ups-voiceover.mp3",
    voiceoverExerciseSlug: "pike-push-ups",
    transcript: "Start in a downward dog position with your hips high, forming an inverted V shape. Keep your legs and back straight. Bend your elbows and lower the top of your head toward the floor between your hands. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid rounding your back. Stop if you feel sharp pain, dizziness, or unusual shortness of breath.",
    status: "ready"
  },
  "dumbbell-shoulder-press": {
    exerciseSlug: "dumbbell-shoulder-press",
    exerciseName: "Dumbbell shoulder press",
    videoUrl: "/exercises/dumbbell-shoulder-press.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "arnold-press",
    transcript: "Set up for Arnold press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "lateral-raises": {
    exerciseSlug: "lateral-raises",
    exerciseName: "Lateral raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "lateral-raises",
    transcript: "Set up for Lateral raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "front-raises": {
    exerciseSlug: "front-raises",
    exerciseName: "Front raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "front-raises",
    transcript: "Set up for Front raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bent-over-reverse-flyes": {
    exerciseSlug: "bent-over-reverse-flyes",
    exerciseName: "Bent-over reverse flyes",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bent-over-reverse-flyes",
    transcript: "Set up for Bent-over reverse flyes. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-shoulder-press": {
    exerciseSlug: "resistance-band-shoulder-press",
    exerciseName: "Resistance-band shoulder press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "resistance-band-shoulder-press",
    transcript: "Set up for Resistance-band shoulder press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "wall-handstand-hold": {
    exerciseSlug: "wall-handstand-hold",
    exerciseName: "Wall handstand hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "wall-handstand-hold",
    transcript: "Set up for Wall handstand hold. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shoulder-taps": {
    exerciseSlug: "shoulder-taps",
    exerciseName: "Shoulder taps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "shoulder-taps",
    transcript: "Set up for Shoulder taps. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "y-raises": {
    exerciseSlug: "y-raises",
    exerciseName: "Y-raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "y-raises",
    transcript: "Set up for Y-raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "close-grip-push-ups": {
    exerciseSlug: "close-grip-push-ups",
    exerciseName: "Close-grip push-ups",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "close-grip-push-ups",
    transcript: "Set up for Close-grip push-ups. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "chair-tricep-dips": {
    exerciseSlug: "chair-tricep-dips",
    exerciseName: "Chair tricep dips",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "chair-tricep-dips",
    transcript: "Set up for Chair tricep dips. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "overhead-tricep-extensions": {
    exerciseSlug: "overhead-tricep-extensions",
    exerciseName: "Overhead tricep extensions",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "overhead-tricep-extensions",
    transcript: "Set up for Overhead tricep extensions. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dumbbell-bicep-curls": {
    exerciseSlug: "dumbbell-bicep-curls",
    exerciseName: "Dumbbell bicep curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "dumbbell-bicep-curls",
    transcript: "Set up for Dumbbell bicep curls. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hammer-curls": {
    exerciseSlug: "hammer-curls",
    exerciseName: "Hammer curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "hammer-curls",
    transcript: "Set up for Hammer curls. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "concentration-curls": {
    exerciseSlug: "concentration-curls",
    exerciseName: "Concentration curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "concentration-curls",
    transcript: "Set up for Concentration curls. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "resistance-band-curls": {
    exerciseSlug: "resistance-band-curls",
    exerciseName: "Resistance-band curls",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "resistance-band-curls",
    transcript: "Set up for Resistance-band curls. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "tricep-kickbacks": {
    exerciseSlug: "tricep-kickbacks",
    exerciseName: "Tricep kickbacks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "tricep-kickbacks",
    transcript: "Set up for Tricep kickbacks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "isometric-bicep-holds": {
    exerciseSlug: "isometric-bicep-holds",
    exerciseName: "Isometric bicep holds",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "isometric-bicep-holds",
    transcript: "Set up for Isometric bicep holds. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "forearm-plank": {
    exerciseSlug: "forearm-plank",
    exerciseName: "Forearm Plank",
    videoUrl: "/exercises/forearm-plank.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "high-plank",
    transcript: "Set up for High plank. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "side-plank": {
    exerciseSlug: "side-plank",
    exerciseName: "Side plank",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "side-plank",
    transcript: "Set up for Side plank. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dead-bug": {
    exerciseSlug: "dead-bug",
    exerciseName: "Dead bug",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "dead-bug",
    transcript: "Set up for Dead bug. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bird-dog": {
    exerciseSlug: "bird-dog",
    exerciseName: "Bird dog",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bird-dog",
    transcript: "Set up for Bird dog. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "mountain-climbers": {
    exerciseSlug: "mountain-climbers",
    exerciseName: "Mountain climbers",
    videoUrl: "/exercises/mountain-climbers.mp4",
    videoSource: "generated",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bicycle-crunches",
    transcript: "Set up for Bicycle crunches. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-crunches": {
    exerciseSlug: "reverse-crunches",
    exerciseName: "Reverse crunches",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "reverse-crunches",
    transcript: "Set up for Reverse crunches. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "leg-raises": {
    exerciseSlug: "leg-raises",
    exerciseName: "Leg raises",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "leg-raises",
    transcript: "Set up for Leg raises. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hollow-body-hold": {
    exerciseSlug: "hollow-body-hold",
    exerciseName: "Hollow-body hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "hollow-body-hold",
    transcript: "Set up for Hollow-body hold. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "russian-twists": {
    exerciseSlug: "russian-twists",
    exerciseName: "Russian twists",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "russian-twists",
    transcript: "Set up for Russian twists. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "bear-crawl": {
    exerciseSlug: "bear-crawl",
    exerciseName: "Bear crawl",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "bear-crawl",
    transcript: "Set up for Bear crawl. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "burpees": {
    exerciseSlug: "burpees",
    exerciseName: "Burpees",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "burpees",
    transcript: "Set up for Burpees. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "squat-to-reach": {
    exerciseSlug: "squat-to-reach",
    exerciseName: "Squat to reach",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "squat-to-reach",
    transcript: "Set up for Squat to reach. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "inchworms": {
    exerciseSlug: "inchworms",
    exerciseName: "Inchworms",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "inchworms",
    transcript: "Set up for Inchworms. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "devil-press": {
    exerciseSlug: "devil-press",
    exerciseName: "Devil press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "devil-press",
    transcript: "Set up for Devil press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "dumbbell-thrusters": {
    exerciseSlug: "dumbbell-thrusters",
    exerciseName: "Dumbbell thrusters",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "dumbbell-thrusters",
    transcript: "Set up for Dumbbell thrusters. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "man-makers": {
    exerciseSlug: "man-makers",
    exerciseName: "Man makers",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "man-makers",
    transcript: "Set up for Man makers. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "plank-to-push-up": {
    exerciseSlug: "plank-to-push-up",
    exerciseName: "Plank to push-up",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "plank-to-push-up",
    transcript: "Set up for Plank to push-up. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "clean-and-press": {
    exerciseSlug: "clean-and-press",
    exerciseName: "Clean and press",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "clean-and-press",
    transcript: "Set up for Clean and press. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "reverse-lunge-to-knee-drive": {
    exerciseSlug: "reverse-lunge-to-knee-drive",
    exerciseName: "Reverse lunge to knee drive",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "reverse-lunge-to-knee-drive",
    transcript: "Set up for Reverse lunge to knee drive. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
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
    voiceoverUrl: null,
    voiceoverExerciseSlug: "high-knees",
    transcript: "Set up for High knees. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "butt-kicks": {
    exerciseSlug: "butt-kicks",
    exerciseName: "Butt kicks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "butt-kicks",
    transcript: "Set up for Butt kicks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "skater-hops": {
    exerciseSlug: "skater-hops",
    exerciseName: "Skater hops",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "skater-hops",
    transcript: "Set up for Skater hops. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "fast-feet": {
    exerciseSlug: "fast-feet",
    exerciseName: "Fast feet",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "fast-feet",
    transcript: "Set up for Fast feet. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "squat-jumps": {
    exerciseSlug: "squat-jumps",
    exerciseName: "Squat jumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "squat-jumps",
    transcript: "Set up for Squat jumps. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "tuck-jumps": {
    exerciseSlug: "tuck-jumps",
    exerciseName: "Tuck jumps",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "tuck-jumps",
    transcript: "Set up for Tuck jumps. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shadow-boxing": {
    exerciseSlug: "shadow-boxing",
    exerciseName: "Shadow boxing",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "shadow-boxing",
    transcript: "Set up for Shadow boxing. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "stair-stepping": {
    exerciseSlug: "stair-stepping",
    exerciseName: "Stair stepping",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "stair-stepping",
    transcript: "Set up for Stair stepping. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "marching-in-place": {
    exerciseSlug: "marching-in-place",
    exerciseName: "Marching in place",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "marching-in-place",
    transcript: "Set up for Marching in place. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "cat-cow-stretch": {
    exerciseSlug: "cat-cow-stretch",
    exerciseName: "Cat-cow stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "cat-cow-stretch",
    transcript: "Set up for Cat-cow stretch. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "childs-pose": {
    exerciseSlug: "childs-pose",
    exerciseName: "Child's pose",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "childs-pose",
    transcript: "Set up for Child's pose. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "worlds-greatest-stretch": {
    exerciseSlug: "worlds-greatest-stretch",
    exerciseName: "World's greatest stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "worlds-greatest-stretch",
    transcript: "Set up for World's greatest stretch. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hip-flexor-stretch": {
    exerciseSlug: "hip-flexor-stretch",
    exerciseName: "Hip flexor stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "hip-flexor-stretch",
    transcript: "Set up for Hip flexor stretch. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "hamstring-stretch": {
    exerciseSlug: "hamstring-stretch",
    exerciseName: "Hamstring stretch",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "hamstring-stretch",
    transcript: "Set up for Hamstring stretch. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "thoracic-rotations": {
    exerciseSlug: "thoracic-rotations",
    exerciseName: "Thoracic rotations",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "thoracic-rotations",
    transcript: "Set up for Thoracic rotations. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "shoulder-circles": {
    exerciseSlug: "shoulder-circles",
    exerciseName: "Shoulder circles",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "shoulder-circles",
    transcript: "Set up for Shoulder circles. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "ankle-mobility-rocks": {
    exerciseSlug: "ankle-mobility-rocks",
    exerciseName: "Ankle mobility rocks",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "ankle-mobility-rocks",
    transcript: "Set up for Ankle mobility rocks. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "9090-hip-switches": {
    exerciseSlug: "9090-hip-switches",
    exerciseName: "90/90 hip switches",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "9090-hip-switches",
    transcript: "Set up for 90/90 hip switches. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
  "deep-squat-hold": {
    exerciseSlug: "deep-squat-hold",
    exerciseName: "Deep squat hold",
    videoUrl: null,
    videoSource: "generated",
    voiceoverUrl: null,
    voiceoverExerciseSlug: "deep-squat-hold",
    transcript: "Set up for Deep squat hold. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath.",
    status: "unavailable"
  },
};
