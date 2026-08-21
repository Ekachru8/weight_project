import os
import cv2
import numpy as np
from gtts import gTTS

TEST_EXERCISES = [
    {
        "slug": "push-ups",
        "name": "Push-ups",
        "custom_transcript": "Start in a strong high-plank position with your hands slightly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Then press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Keep your elbows angled slightly back. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "incline-push-ups",
        "name": "Incline push-ups",
        "custom_transcript": "Place your hands on a stable elevated surface, such as a bench or sturdy table, and step your feet back until your body forms a straight line. Brace your core, bend your elbows, and lower your chest toward the surface with control. Press through your palms to return to the starting position. Keep your wrists aligned under your shoulders and avoid dropping your hips. Breathe in as you lower and breathe out as you press. Stop if you feel sharp pain or unusual discomfort."
    },
    {
        "slug": "bodyweight-squats",
        "name": "Bodyweight squats",
        "custom_transcript": "Stand with your feet about shoulder-width apart and keep your chest open. Brace your core, send your hips back, and bend your knees to lower into a comfortable squat. Keep your knees tracking in line with your toes, then press through your feet to stand tall. Breathe in as you lower and breathe out as you rise. Avoid collapsing your knees inward or rounding your lower back. Use a chair for support if needed, and stop if you feel sharp pain, dizziness, or unusual shortness of breath."
    },
    {
        "slug": "knee-push-ups",
        "name": "Knee push-ups",
        "custom_transcript": "Start on your hands and knees. Walk your hands forward until there is a straight line from your head to your knees. Brace your core, bend your elbows, and lower your chest toward the floor. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press. Keep your neck neutral. Avoid letting your lower back sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "wide-grip-push-ups",
        "name": "Wide-grip push-ups",
        "custom_transcript": "Start in a strong high-plank position with your hands significantly wider than your shoulders. Keep your head, hips, and heels in one straight line, and brace your core. Bend your elbows and lower your chest with control. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid letting your hips sag or rise. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "reverse-lunges",
        "name": "Reverse lunges",
        "custom_transcript": "Stand tall with your feet together. Step one foot back and lower your hips until both knees are bent at a 90-degree angle. Keep your front knee in line with your toes and your torso upright. Push off your back foot to return to the starting position. Breathe in as you lower and breathe out as you rise. Avoid letting your front knee collapse inward. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "forearm-plank",
        "name": "Forearm plank",
        "custom_transcript": "Lie face down, then prop yourself up on your forearms and toes. Ensure your elbows are directly under your shoulders. Keep your body in a straight line from your head to your heels. Brace your core tightly and squeeze your glutes. Breathe steadily throughout the hold. Avoid letting your hips sag or raising them too high. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "jumping-jacks",
        "name": "Jumping jacks",
        "custom_transcript": "Stand tall with your feet together and arms at your sides. Jump your feet wide while raising your arms overhead. Jump back to the starting position. Keep a steady pace and stay light on your feet. Breathe naturally throughout the movement. Avoid landing heavily on your heels. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "mountain-climbers",
        "name": "Mountain climbers",
        "custom_transcript": "Start in a strong high-plank position with your hands directly under your shoulders. Brace your core and quickly alternate bringing one knee toward your chest, as if running in place. Keep your hips low and stable. Breathe naturally as you move. Avoid bouncing your hips too high or letting them sag. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    },
    {
        "slug": "glute-bridges",
        "name": "Glute bridges",
        "custom_transcript": "Lie on your back with your knees bent and feet flat on the floor, hip-width apart. Brace your core and press through your heels to lift your hips until your body forms a straight line from your shoulders to your knees. Squeeze your glutes at the top, then lower with control. Breathe out as you lift and breathe in as you lower. Avoid arching your lower back excessively. Stop if you feel sharp pain or unusual discomfort."
    },
    {
        "slug": "pike-push-ups",
        "name": "Pike push-ups",
        "custom_transcript": "Start in a downward dog position with your hips high, forming an inverted V shape. Keep your legs and back straight. Bend your elbows and lower the top of your head toward the floor between your hands. Press through your palms to return to the starting position. Breathe in as you lower and breathe out as you press up. Avoid rounding your back. Stop if you feel sharp pain, dizziness, or unusual shortness of breath."
    },
    {
        "slug": "dumbbell-shoulder-press",
        "name": "Dumbbell shoulder press",
        "custom_transcript": "Stand or sit tall, holding a dumbbell in each hand at shoulder height, palms facing forward. Brace your core and press the weights straight up overhead until your arms are fully extended. Lower the weights back to your shoulders with control. Breathe out as you press up and breathe in as you lower. Avoid arching your lower back or leaning back. Stop if you feel sharp pain, dizziness, chest discomfort, or unusual shortness of breath."
    }
]

out_dir = r"public\exercises"
os.makedirs(out_dir, exist_ok=True)

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
    transcript = ex["custom_transcript"]
    tts = gTTS(text=transcript, lang='en', slow=False)
    tts.save(audio_path)

print("Done!")
