import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function checkSafetyFlags(healthNotes: string): boolean {
  if (!healthNotes) return false;
  const lower = healthNotes.toLowerCase();
  const dangerousKeywords = [
    "chest pain", "pressure", "faint", "dizziness", "shortness of breath",
    "injury", "surgery", "restriction", "pain", "unsafe"
  ];
  return dangerousKeywords.some(keyword => lower.includes(keyword));
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to use this feature" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fitnessReadiness, todaySchedule, availableExercises } = body;

    const healthNotes = fitnessReadiness?.healthNotes || "";
    const isUnsafe = checkSafetyFlags(healthNotes);

    if (isUnsafe) {
      return NextResponse.json({
        title: "Rest & Recovery",
        description: "Your safety comes first. I can provide only gentle general movement suggestions here, but because you mentioned a health concern, please speak with a qualified healthcare professional before starting or changing an exercise program.",
        intensity: "Rest",
        estimatedMinutes: 0,
        exercises: [],
        safetyNote: "Your safety comes first. I can provide only gentle general movement suggestions here, but because you mentioned a health concern, please speak with a qualified healthcare professional before starting or changing an exercise program. Stop immediately if you feel pain, dizziness, chest discomfort, or unusual shortness of breath."
      });
    }

    const {
      fitnessLevel,
      mobilityLevel,
      difficultMovements = [],
      intensityPreference,
      equipment = []
    } = fitnessReadiness;

    const selectedExercises = [];
    
    // Filter available exercises based on todaySchedule and comfort
    if (todaySchedule && todaySchedule.exercises) {
      // Start with the base schedule
      const baseSlugs = todaySchedule.exercises;

      // Swap out logic for comfort
      for (const slug of baseSlugs) {
        const ex = availableExercises.find((e: any) => e.slug === slug);
        if (!ex) continue;

        const isSquat = ex.slug.includes("squat");
        const isLunge = ex.slug.includes("lunge");
        const isFloor = ex.equipment === "Mat" || ex.name.toLowerCase().includes("floor") || ex.name.toLowerCase().includes("push-up") || ex.name.toLowerCase().includes("plank");
        const isOverhead = ex.name.toLowerCase().includes("overhead") || ex.name.toLowerCase().includes("press");
        const isHighImpact = ex.name.toLowerCase().includes("jump") || ex.name.toLowerCase().includes("burpee");

        let skip = false;

        // Apply filters
        if (difficultMovements.includes("Squatting") && isSquat) skip = true;
        if (difficultMovements.includes("Lunging") && isLunge) skip = true;
        if (difficultMovements.includes("Getting down to the floor") && isFloor) skip = true;
        if (difficultMovements.includes("Reaching overhead") && isOverhead) skip = true;
        if ((intensityPreference === "gentle" || intensityPreference === "light") && isHighImpact) skip = true;
        
        // Handle No Equipment
        if (equipment.includes("No equipment") && ex.equipment !== "Bodyweight" && ex.equipment !== "Mat") {
            skip = true;
        }

        // If skip is true, try to find an alternative for the same category that fits
        let finalEx = ex;
        if (skip) {
           const alternatives = availableExercises.filter((alt: any) => {
               if (alt.category !== ex.category) return false;
               if (difficultMovements.includes("Squatting") && alt.slug.includes("squat")) return false;
               if (difficultMovements.includes("Lunging") && alt.slug.includes("lunge")) return false;
               if (difficultMovements.includes("Getting down to the floor") && (alt.equipment === "Mat" || alt.name.toLowerCase().includes("floor") || alt.name.toLowerCase().includes("push-up") || alt.name.toLowerCase().includes("plank"))) return false;
               if (difficultMovements.includes("Reaching overhead") && (alt.name.toLowerCase().includes("overhead") || alt.name.toLowerCase().includes("press"))) return false;
               if ((intensityPreference === "gentle" || intensityPreference === "light") && (alt.name.toLowerCase().includes("jump") || alt.name.toLowerCase().includes("burpee"))) return false;
               if (equipment.includes("No equipment") && alt.equipment !== "Bodyweight" && alt.equipment !== "Mat") return false;
               return true;
           });
           if (alternatives.length > 0) {
               finalEx = alternatives[0];
           } else {
               continue; // omit if no alternative
           }
        }

        // Generate properties
        let sets = finalEx.defaultSets;
        const reps = finalEx.defaultReps;
        let restSeconds = 60;
        let modification = "Move within a comfortable range.";
        
        if (fitnessLevel === "new" || fitnessLevel === "beginner") {
            sets = Math.max(1, sets - 1);
            restSeconds = 90;
            modification = "Choose the easier variation if this feels challenging. Controlled movement matters more than speed.";
        } else if (intensityPreference === "challenging" && fitnessLevel !== "new") {
            sets = sets + 1;
            restSeconds = 45;
        }

        selectedExercises.push({
            exerciseSlug: finalEx.slug,
            sets,
            reps,
            restSeconds,
            modification,
            formCue: finalEx.formCues?.[0] || finalEx.description,
            stopCondition: "Stop if you feel sharp pain or unusual shortness of breath."
        });
      }
    }

    return NextResponse.json({
        title: "Customized " + (todaySchedule?.title || "Workout"),
        description: "Your workout has been adjusted to your current comfort level, movement preferences, equipment, and goals.",
        intensity: intensityPreference === "challenging" ? "Challenging" : (intensityPreference === "gentle" ? "Gentle" : "Moderate"),
        estimatedMinutes: selectedExercises.length * 5,
        exercises: selectedExercises,
        safetyNote: ""
    });

  } catch (error) {
    console.error("POST /api/today/assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate workout" },
      { status: 500 }
    );
  }
}
