import re
import json

EXERCISES_READY = {
    "push-ups": {
        "name": "Push-ups",
        "custom_transcript": "Start in a strong high-plank position with your hands slightly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Then press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Keep your elbows angled slightly back. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "incline-push-ups": {
        "name": "Incline push-ups",
        "custom_transcript": "Place your hands on a stable elevated surface, such as a bench or sturdy table, and step your feet back until your body forms a straight line. Brace your core, bend your elbows, and lower your chest toward the surface with control. Press through your palms to return to the starting position. Keep your wrists aligned under your shoulders and avoid dropping your hips. Breathe in as you lower and breathe out as you press. Stop if you feel sharp pain or unusual discomfort."
    },
    "bodyweight-squats": {
        "name": "Bodyweight squats",
        "custom_transcript": "Stand with your feet about shoulder-width apart and keep your chest open. Brace your core, send your hips back, and bend your knees to lower into a comfortable squat. Keep your knees tracking in line with your toes, then press through your feet to stand tall. Breathe in as you lower and breathe out as you rise. Avoid collapsing your knees inward or rounding your lower back. Use a chair for support if needed, and stop if you feel sharp pain, dizziness, or unusual shortness of breath."
    },
    "knee-push-ups": {
        "name": "Knee push-ups",
        "custom_transcript": "Start on your hands and knees. Walk your hands forward until there is a straight line from your head to your knees. Brace your core, bend your elbows, and lower your chest toward the floor. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press. Keep your neck neutral. Avoid letting your lower back sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "wide-grip-push-ups": {
        "name": "Wide-grip push-ups",
        "custom_transcript": "Start in a strong high-plank position with your hands significantly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "reverse-lunges": {
        "name": "Reverse lunges",
        "custom_transcript": "Stand tall with your feet together. Step one foot back and lower your hips until both knees are bent at a 90-degree angle. Keep your front knee in line with your toes and your torso upright. Push off your back foot to return to the starting position. Breathe in as you lower and breathe out as you rise. Avoid letting your front knee collapse inward. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "forearm-plank": {
        "name": "Forearm plank",
        "custom_transcript": "Lie face down, then prop yourself up on your forearms and toes. Ensure your elbows are directly under your shoulders. Keep your body in a straight line from your head to your heels. Brace your core tightly and squeeze your glutes. Breathe steadily throughout the hold. Avoid letting your hips sag or raising them too high. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "jumping-jacks": {
        "name": "Jumping jacks",
        "custom_transcript": "Stand tall with your feet together and arms at your sides. Jump your feet wide while raising your arms overhead. Jump back to the starting position. Keep a steady pace and stay light on your feet. Breathe naturally throughout the movement. Avoid landing heavily on your heels. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "mountain-climbers": {
        "name": "Mountain climbers",
        "custom_transcript": "Start in a strong high-plank position with your hands directly under your shoulders. Brace your core and quickly alternate bringing one knee toward your chest, as if running in place. Keep your hips low and stable. Breathe naturally as you move. Avoid bouncing your hips too high or letting them sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    "glute-bridges": {
        "name": "Glute bridges",
        "custom_transcript": "Lie on your back with your knees bent and feet flat on the floor, hip-width apart. Brace your core and press through your heels to lift your hips until your body forms a straight line from your shoulders to your knees. Squeeze your glutes at the top, then lower with control. Breathe out as you lift and breathe in as you lower. Avoid arching your lower back excessively. Stop if you feel sharp pain or unusual discomfort."
    },
    "pike-push-ups": {
        "name": "Pike push-ups",
        "custom_transcript": "Start in a downward dog position with your hips high, forming an inverted V shape. Keep your legs and back straight. Bend your elbows and lower the top of your head toward the floor between your hands. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid rounding your back. Stop if you feel sharp pain, dizziness, or unusual shortness of breath."
    },
    "dumbbell-shoulder-press": {
        "name": "Dumbbell shoulder press",
        "custom_transcript": "Stand or sit tall, holding a dumbbell in each hand at shoulder height, palms facing forward. Brace your core and press the weights straight up overhead until your arms are fully extended. Lower the weights back to your shoulders with control. Breathe out as you press up and breathe in as you lower. Avoid arching your lower back or leaning back. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    }
}

filepath = r"src\data\exercise-assets.ts"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Extract all slugs and names
slugs_and_names = []
# We will match the existing object keys if possible or just parse the JSON-like structure
matches = re.finditer(r'exerciseSlug:\s*"([^"]+)",\s*exerciseName:\s*"([^"]+)"', content)
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
    if slug in EXERCISES_READY:
        status = "ready"
        videoUrl = f"/exercises/{slug}.mp4"
        voiceoverUrl = f"/exercises/{slug}-voiceover.mp3"
        videoSource = "generated"
        transcript = EXERCISES_READY[slug]["custom_transcript"]
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
