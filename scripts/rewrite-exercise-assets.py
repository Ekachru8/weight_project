import re
import json

TEST_SLUGS = {
    "push-ups": {
        "instructions": ["Start in a high plank.", "Lower your body.", "Push back up."],
        "cues": ["straight back", "core tight"],
        "mistakes": ["sagging hips"]
    },
    "squats": {
        "instructions": ["Stand with feet shoulder-width apart.", "Lower hips.", "Stand back up."],
        "cues": ["chest up", "knees out"],
        "mistakes": ["knees caving in"]
    },
    "reverse-lunges": {
        "instructions": ["Step one foot back.", "Lower your hips.", "Return to start."],
        "cues": ["upright torso", "knees 90 degrees"],
        "mistakes": ["knee passing toe"]
    },
    "forearm-plank": {
        "instructions": ["Rest on forearms and toes.", "Hold position."],
        "cues": ["straight line", "squeeze glutes"],
        "mistakes": ["hips too high"]
    },
    "jumping-jacks": {
        "instructions": ["Jump feet wide.", "Bring arms up.", "Return to start."],
        "cues": ["light on feet", "full range of motion"],
        "mistakes": ["sluggish movement"]
    },
    "dumbbell-shoulder-press": {
        "instructions": ["Hold dumbbells at shoulders.", "Press overhead.", "Lower slowly."],
        "cues": ["brace core", "controlled descent"],
        "mistakes": ["arching back"]
    }
}

def build_transcript(name, ex_data):
    instructions = " ".join(ex_data["instructions"])
    cues = " and ".join(ex_data["cues"])
    mistakes = ", ".join(ex_data["mistakes"])
    return f"Set up for {name}. {instructions} Breathe naturally and keep your movements controlled. Focus on {cues}. Avoid {mistakes}. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."

filepath = r"src\data\exercise-assets.ts"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Extract all slugs and names
slugs_and_names = []
matches = re.finditer(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', content)
for m in matches:
    slugs_and_names.append((m.group(1), m.group(2)))

new_content = """export interface ExerciseAsset {
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
"""

for slug, name in slugs_and_names:
    if slug in TEST_SLUGS:
        status = "ready"
        videoUrl = f"/exercises/{slug}.mp4"
        voiceoverUrl = f"/exercises/{slug}-voiceover.mp3"
        videoSource = "generated"
        transcript = build_transcript(name, TEST_SLUGS[slug])
    else:
        status = "unavailable"
        videoUrl = "null"
        voiceoverUrl = "null"
        videoSource = "generated"
        transcript = f"Set up for {name}. Breathe naturally and keep your movements controlled. Focus on proper form. Avoid rushing the movement. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."

    t_safe = json.dumps(transcript)
    
    video_val = f'"{videoUrl}"' if videoUrl != "null" else "null"
    audio_val = f'"{voiceoverUrl}"' if voiceoverUrl != "null" else "null"

    entry = f"""  "{slug}": {{
    exerciseSlug: "{slug}",
    exerciseName: "{name}",
    videoUrl: {video_val},
    videoSource: "{videoSource}",
    voiceoverUrl: {audio_val},
    voiceoverExerciseSlug: "{slug}",
    transcript: {t_safe},
    status: "{status}"
  }},
"""
    new_content += entry

new_content += "};\n"

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Rewrote exercise-assets.ts")
