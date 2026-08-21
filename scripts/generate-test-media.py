import os
import cv2
import numpy as np
from gtts import gTTS

TEST_EXERCISES = [
    {
        "slug": "push-ups",
        "name": "Push-ups",
        "instructions": ["Start in a high plank.", "Lower your body.", "Push back up."],
        "cues": ["straight back", "core tight"],
        "mistakes": ["sagging hips"]
    },
    {
        "slug": "squats",
        "name": "Squats",
        "instructions": ["Stand with feet shoulder-width apart.", "Lower hips.", "Stand back up."],
        "cues": ["chest up", "knees out"],
        "mistakes": ["knees caving in"]
    },
    {
        "slug": "reverse-lunges",
        "name": "Reverse Lunges",
        "instructions": ["Step one foot back.", "Lower your hips.", "Return to start."],
        "cues": ["upright torso", "knees 90 degrees"],
        "mistakes": ["knee passing toe"]
    },
    {
        "slug": "forearm-plank",
        "name": "Forearm Plank",
        "instructions": ["Rest on forearms and toes.", "Hold position."],
        "cues": ["straight line", "squeeze glutes"],
        "mistakes": ["hips too high"]
    },
    {
        "slug": "jumping-jacks",
        "name": "Jumping Jacks",
        "instructions": ["Jump feet wide.", "Bring arms up.", "Return to start."],
        "cues": ["light on feet", "full range of motion"],
        "mistakes": ["sluggish movement"]
    },
    {
        "slug": "dumbbell-shoulder-press",
        "name": "Dumbbell Press",
        "instructions": ["Hold dumbbells at shoulders.", "Press overhead.", "Lower slowly."],
        "cues": ["brace core", "controlled descent"],
        "mistakes": ["arching back"]
    }
]

out_dir = r"public\exercises"
os.makedirs(out_dir, exist_ok=True)

def build_transcript(ex):
    instructions = " ".join(ex["instructions"])
    cues = " and ".join(ex["cues"])
    mistakes = ", ".join(ex["mistakes"])
    return f"Set up for {ex['name']}. {instructions} Breathe naturally and keep your movements controlled. Focus on {cues}. Avoid {mistakes}. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."

# Generate video
width, height = 640, 360
fps = 30
duration = 2

for ex in TEST_EXERCISES:
    print(f"Generating for {ex['name']}...")
    # Video
    video_path = os.path.join(out_dir, f"{ex['slug']}.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    
    for i in range(fps * duration):
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        # Background color
        frame[:] = (50, 50, 50)
        # Text
        text = f"A person performing {ex['name']}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_size = cv2.getTextSize(text, font, 1, 2)[0]
        text_x = (width - text_size[0]) // 2
        text_y = (height + text_size[1]) // 2
        
        cv2.putText(frame, text, (text_x, text_y), font, 1, (255, 255, 255), 2, cv2.LINE_AA)
        
        # Subtext
        subtext = "HOMEFIT DEMONSTRATION"
        sub_size = cv2.getTextSize(subtext, font, 0.5, 1)[0]
        cv2.putText(frame, subtext, ((width - sub_size[0]) // 2, text_y + 40), font, 0.5, (0, 255, 255), 1, cv2.LINE_AA)
        
        out.write(frame)
    out.release()
    
    # Audio
    audio_path = os.path.join(out_dir, f"{ex['slug']}-voiceover.mp3")
    transcript = build_transcript(ex)
    tts = gTTS(text=transcript, lang='en', slow=False)
    tts.save(audio_path)

print("Done!")
