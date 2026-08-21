export const weeklyWorkoutSchedule: Record<number, { day: string; title: string; category: string; exercises?: string[] }> = {
  0: { day: "Sunday", title: "Rest Day", category: "REST", exercises: [] },
  1: {
    day: "Monday",
    title: "Chest",
    category: "CHEST",
    exercises: [
      "push-ups",
      "incline-push-ups",
      "wide-grip-push-ups",
      "diamond-push-ups",
    ],
  },
  2: {
    day: "Tuesday",
    title: "Back",
    category: "BACK",
    exercises: [
      "pull-ups",
      "resistance-band-rows",
      "one-arm-dumbbell-rows",
      "superman-holds",
    ],
  },
  3: {
    day: "Wednesday",
    title: "Legs",
    category: "LEGS",
    exercises: [
      "bodyweight-squats",
      "reverse-lunges",
      "bulgarian-split-squats",
      "calf-raises",
    ],
  },
  4: {
    day: "Thursday",
    title: "Shoulders",
    category: "SHOULDERS",
    exercises: [
      "pike-push-ups",
      "shoulder-taps",
      "lateral-raises",
      "front-raises",
    ],
  },
  5: {
    day: "Friday",
    title: "Arms",
    category: "ARMS",
    exercises: [
      "diamond-push-ups",
      "chair-tricep-dips",
      "bicep-curls",
      "hammer-curls",
    ],
  },
  6: {
    day: "Saturday",
    title: "Core & Full Body",
    category: "CORE_FULL_BODY",
    exercises: [
      "forearm-plank",
      "dead-bug",
      "mountain-climbers",
      "burpees",
    ],
  },
};
