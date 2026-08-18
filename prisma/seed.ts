import { prisma } from "../src/lib/prisma";
async function main() {
  // Create default user
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "HomeFit User",
      equipment: "Dumbbells, Resistance Band, Yoga Mat",
    },
  });

  // Clear existing exercises for clean re-seed
  await prisma.exercise.deleteMany();

  const exercises = [
    // ─── Day 1 — Chest ───
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Dumbbell Floor Press",
      muscleGroup: "Chest",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Lie on the floor, press dumbbells up with elbows at 45°, lower until triceps touch the ground.",
      sortOrder: 1,
    },
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Dumbbell Floor Fly",
      muscleGroup: "Chest",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Lie on floor, arms extended, lower dumbbells in a wide arc until elbows touch down, squeeze chest to return.",
      sortOrder: 2,
    },
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Push-Ups",
      muscleGroup: "Chest",
      equipment: "Bodyweight",
      sets: 3,
      reps: "15",
      formCue:
        "Hands shoulder-width, body straight as a plank, lower chest to floor. Drop to knees if needed.",
      sortOrder: 3,
    },
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Resistance Band Chest Press",
      muscleGroup: "Chest",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15",
      formCue:
        "Anchor band behind you at chest height, press forward with both hands, squeeze chest at full extension.",
      sortOrder: 4,
    },
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Dumbbell Pullover",
      muscleGroup: "Chest",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Lie on floor, hold one dumbbell overhead with both hands, lower behind head in an arc, pull back with chest and lats.",
      sortOrder: 5,
    },
    {
      dayNumber: 1,
      dayName: "Chest",
      name: "Incline Push-Ups",
      muscleGroup: "Chest",
      equipment: "Bodyweight",
      sets: 2,
      reps: "15",
      formCue:
        "Hands elevated on a sturdy chair, body straight, lower chest toward edge. Targets lower chest.",
      sortOrder: 6,
    },

    // ─── Day 2 — Back ───
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Dumbbell Bent-Over Row",
      muscleGroup: "Back",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Hinge at hips 45°, pull dumbbells to ribcage, squeeze shoulder blades together at the top.",
      sortOrder: 1,
    },
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Single-Arm Dumbbell Row",
      muscleGroup: "Back",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12/side",
      formCue:
        "One hand on a chair for support, row dumbbell to hip, keep torso square and core braced.",
      sortOrder: 2,
    },
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Resistance Band Seated Row",
      muscleGroup: "Back",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15",
      formCue:
        "Sit on floor, band looped under feet, pull handles to lower ribs, squeeze back at peak contraction.",
      sortOrder: 3,
    },
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Resistance Band Pull-Apart",
      muscleGroup: "Upper Back",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15",
      formCue:
        "Hold band at shoulder width, arms straight in front, pull apart until band touches chest. Control the return.",
      sortOrder: 4,
    },
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Bent-Over Reverse Fly",
      muscleGroup: "Rear Delts / Upper Back",
      equipment: "Dumbbells",
      sets: 3,
      reps: "15",
      formCue:
        "Hinge forward, light dumbbells hanging down, raise arms out to sides squeezing rear delts. Use light weight.",
      sortOrder: 5,
    },
    {
      dayNumber: 2,
      dayName: "Back",
      name: "Superman Hold",
      muscleGroup: "Lower Back",
      equipment: "Yoga Mat",
      sets: 3,
      reps: "15 sec",
      formCue:
        "Lie face down on mat, lift arms and legs off ground simultaneously, hold and squeeze lower back and glutes.",
      sortOrder: 6,
    },

    // ─── Day 3 — Legs ───
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Dumbbell Goblet Squat",
      muscleGroup: "Quads / Glutes",
      equipment: "Dumbbells",
      sets: 4,
      reps: "15",
      formCue:
        "Hold one dumbbell at chest level, squat deep with chest up and knees tracking over toes.",
      sortOrder: 1,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Dumbbell Romanian Deadlift",
      muscleGroup: "Hamstrings / Glutes",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Hold dumbbells in front of thighs, hinge at hips pushing butt back, slight knee bend, feel hamstring stretch.",
      sortOrder: 2,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Dumbbell Walking/Reverse Lunges",
      muscleGroup: "Quads / Glutes",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12/leg",
      formCue:
        "Step forward or backward into a lunge, both knees at 90°, keep torso upright, push through front heel.",
      sortOrder: 3,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Bulgarian Split Squat",
      muscleGroup: "Quads / Glutes",
      equipment: "Dumbbells",
      sets: 3,
      reps: "10/leg",
      formCue:
        "Rear foot elevated on a chair, lower until front thigh is parallel to floor, keep shin vertical.",
      sortOrder: 4,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Resistance Band Lateral Walk",
      muscleGroup: "Glutes / Hip Abductors",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15 steps/side",
      formCue:
        "Band around ankles or just above knees, stay in a quarter-squat, step sideways keeping tension on band.",
      sortOrder: 5,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Calf Raises",
      muscleGroup: "Calves",
      equipment: "Bodyweight",
      sets: 3,
      reps: "20",
      formCue:
        "Stand on edge of a step or flat ground, rise onto toes squeezing calves, lower with control. Hold dumbbells for extra load.",
      sortOrder: 6,
    },
    {
      dayNumber: 3,
      dayName: "Legs",
      name: "Glute Bridge",
      muscleGroup: "Glutes / Hamstrings",
      equipment: "Dumbbells",
      sets: 3,
      reps: "15",
      formCue:
        "Lie on back, feet flat, place dumbbell on hips, drive hips up squeezing glutes at top, lower with control.",
      sortOrder: 7,
    },

    // ─── Day 4 — Shoulders ───
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Dumbbell Shoulder Press",
      muscleGroup: "Shoulders",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Seated or standing, press dumbbells overhead from shoulder level, fully extend arms without locking elbows.",
      sortOrder: 1,
    },
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Dumbbell Lateral Raise",
      muscleGroup: "Side Delts",
      equipment: "Dumbbells",
      sets: 3,
      reps: "15",
      formCue:
        "Arms at sides, raise dumbbells out to shoulder height with a slight bend in elbows, lower slowly.",
      sortOrder: 2,
    },
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Dumbbell Front Raise",
      muscleGroup: "Front Delts",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Arms in front of thighs, raise one or both dumbbells to shoulder height with straight arms, lower with control.",
      sortOrder: 3,
    },
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Bent-Over Rear Delt Fly",
      muscleGroup: "Rear Delts",
      equipment: "Dumbbells",
      sets: 3,
      reps: "15",
      formCue:
        "Hinge at hips, dumbbells hanging, raise arms out to sides focusing on rear delts. Keep core tight.",
      sortOrder: 4,
    },
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Resistance Band Face Pull",
      muscleGroup: "Rear Delts / Rotator Cuff",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15",
      formCue:
        "Anchor band at face height, pull toward face with elbows high, externally rotate hands at the end.",
      sortOrder: 5,
    },
    {
      dayNumber: 4,
      dayName: "Shoulders",
      name: "Arnold Press",
      muscleGroup: "Shoulders",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Start with palms facing you at shoulder level, rotate palms outward as you press overhead. Reverse on the way down.",
      sortOrder: 6,
    },

    // ─── Day 5 — Arms (Biceps & Triceps) ───
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Dumbbell Bicep Curl",
      muscleGroup: "Biceps",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Stand tall, curl dumbbells up with palms facing up, keep elbows pinned to sides, squeeze at top.",
      sortOrder: 1,
    },
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Dumbbell Hammer Curl",
      muscleGroup: "Biceps / Forearms",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Palms facing each other (neutral grip), curl up keeping wrists straight, targets brachialis and forearms.",
      sortOrder: 2,
    },
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Resistance Band Curl",
      muscleGroup: "Biceps",
      equipment: "Resistance Band",
      sets: 3,
      reps: "15",
      formCue:
        "Stand on band, curl handles up with palms facing up, constant tension throughout the movement.",
      sortOrder: 3,
    },
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Dumbbell Overhead Triceps Extension",
      muscleGroup: "Triceps",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Hold one dumbbell overhead with both hands, lower behind head bending elbows, press back up. Keep elbows close.",
      sortOrder: 4,
    },
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Dumbbell Triceps Kickback",
      muscleGroup: "Triceps",
      equipment: "Dumbbells",
      sets: 3,
      reps: "12",
      formCue:
        "Hinge forward, upper arm parallel to floor, extend forearm back squeezing triceps, lower slowly.",
      sortOrder: 5,
    },
    {
      dayNumber: 5,
      dayName: "Arms",
      name: "Diamond/Close-Grip Push-Ups",
      muscleGroup: "Triceps",
      equipment: "Bodyweight",
      sets: 3,
      reps: "12",
      formCue:
        "Hands close together forming a diamond, lower chest to hands, push up focusing on triceps. Drop to knees if needed.",
      sortOrder: 6,
    },

    // ─── Day 6 — Core ───
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Plank",
      muscleGroup: "Core",
      equipment: "Yoga Mat",
      sets: 3,
      reps: "30–45 sec",
      formCue:
        "Forearms and toes on mat, body in a straight line, brace core and glutes. Don't let hips sag or pike.",
      sortOrder: 1,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Side Plank",
      muscleGroup: "Obliques",
      equipment: "Yoga Mat",
      sets: 2,
      reps: "20–30 sec/side",
      formCue:
        "Stack feet or stagger, forearm on mat, lift hips creating a straight line. Hold each side equally.",
      sortOrder: 2,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Russian Twist",
      muscleGroup: "Obliques",
      equipment: "Dumbbells",
      sets: 3,
      reps: "20",
      formCue:
        "Sit with knees bent, lean back slightly, hold one dumbbell, rotate torso side to side. Feet off ground for extra challenge.",
      sortOrder: 3,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Leg Raises",
      muscleGroup: "Lower Abs",
      equipment: "Yoga Mat",
      sets: 3,
      reps: "15",
      formCue:
        "Lie flat, hands under hips, raise straight legs to 90°, lower slowly without arching lower back.",
      sortOrder: 4,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Bicycle Crunches",
      muscleGroup: "Core / Obliques",
      equipment: "Yoga Mat",
      sets: 3,
      reps: "20",
      formCue:
        "Hands behind head, bring opposite elbow to knee while extending the other leg. Alternate with control.",
      sortOrder: 5,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Dead Bug",
      muscleGroup: "Core / Stability",
      equipment: "Yoga Mat",
      sets: 3,
      reps: "12/side",
      formCue:
        "Lie on back, arms extended up, knees at 90°. Extend opposite arm and leg while keeping lower back pressed to floor.",
      sortOrder: 6,
    },
    {
      dayNumber: 6,
      dayName: "Core",
      name: "Resistance Band Woodchopper",
      muscleGroup: "Obliques / Core",
      equipment: "Resistance Band",
      sets: 3,
      reps: "12/side",
      formCue:
        "Anchor band low, pull diagonally across body from low to high with rotation. Control the return. Do both sides.",
      sortOrder: 7,
    },
  ];

  await prisma.exercise.createMany({
    data: exercises,
  });

  console.log(`✅ Seeded ${exercises.length} exercises across 6 days`);
  console.log("✅ Default user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
