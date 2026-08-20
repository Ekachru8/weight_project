import { prisma } from "../src/lib/prisma";

const EXERCISES_DATA = [
  // CHEST
  {
    name: "Push-ups", category: "Chest", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Chest", "Shoulders", "Triceps"], movementPattern: "Horizontal Push",
    description: "A classic bodyweight exercise targeting the upper body.",
    formCues: ["Keep core tight", "Body in a straight line", "Elbows at 45 degrees"],
    instructions: ["Start in a high plank position.", "Lower your body until your chest nearly touches the floor.", "Push back up to the starting position."],
    commonMistakes: ["Flaring elbows out too wide", "Sagging lower back"],
    safetyTips: ["Warm up wrists and shoulders before starting.", "Modify on knees if needed."],
    defaultSets: 3, defaultReps: "10-20", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Incline push-ups", category: "Chest", difficulty: "Beginner", equipment: "Chair",
    targetMuscles: ["Chest", "Shoulders", "Triceps"], movementPattern: "Horizontal Push",
    description: "An easier variation of the push-up using an elevated surface.",
    formCues: ["Hands shoulder-width apart", "Body straight"],
    instructions: ["Place hands on a stable chair or bench.", "Lower your chest to the edge.", "Press back up."],
    commonMistakes: ["Using an unstable surface"],
    safetyTips: ["Ensure the chair will not slide."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Knee push-ups", category: "Chest", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Chest", "Triceps"], movementPattern: "Horizontal Push",
    description: "A modified push-up performed on the knees.",
    formCues: ["Hips in line with shoulders and knees"],
    instructions: ["Start on hands and knees.", "Walk hands forward until body is straight from knees to head.", "Lower chest to the floor and push up."],
    commonMistakes: ["Leaving hips behind"],
    safetyTips: ["Use a mat to cushion your knees."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Wide-grip push-ups", category: "Chest", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Chest", "Shoulders"], movementPattern: "Horizontal Push",
    description: "A push-up variation that targets the outer chest.",
    formCues: ["Hands wider than shoulder-width"],
    instructions: ["Set hands wider than normal.", "Perform a push-up with controlled form."],
    commonMistakes: ["Going too deep and straining shoulders"],
    safetyTips: ["Avoid if you have shoulder pain."],
    defaultSets: 3, defaultReps: "8-15", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Diamond push-ups", category: "Chest", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Triceps", "Inner Chest"], movementPattern: "Horizontal Push",
    description: "A challenging push-up that emphasizes the triceps and inner chest.",
    formCues: ["Index fingers and thumbs touching to form a diamond"],
    instructions: ["Place hands together under your chest.", "Lower your body, keeping elbows close to sides.", "Press up."],
    commonMistakes: ["Flaring elbows out"],
    safetyTips: ["Requires good wrist mobility."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Decline push-ups", category: "Chest", difficulty: "Advanced", equipment: "Chair",
    targetMuscles: ["Upper Chest", "Shoulders", "Triceps"], movementPattern: "Horizontal Push",
    description: "A push-up performed with feet elevated, emphasizing the upper chest.",
    formCues: ["Core engaged to prevent arching"],
    instructions: ["Place feet on a chair and hands on the floor.", "Perform a push-up."],
    commonMistakes: ["Arching the lower back"],
    safetyTips: ["Do not perform if you feel dizzy from having your head lower than your feet."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Chest squeeze press with dumbbells", category: "Chest", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Inner Chest"], movementPattern: "Horizontal Push",
    description: "Pressing dumbbells while squeezing them together to activate the chest.",
    formCues: ["Squeeze dumbbells together continuously"],
    instructions: ["Lie on the floor or a bench with dumbbells.", "Press them together over your chest.", "Lower them to your chest while keeping them pressed together, then push back up."],
    commonMistakes: ["Separating the dumbbells"],
    safetyTips: ["Start with light weight to master the squeeze."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Floor dumbbell press", category: "Chest", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Chest", "Triceps", "Shoulders"], movementPattern: "Horizontal Push",
    description: "A chest press performed on the floor.",
    formCues: ["Elbows at a 45-degree angle"],
    instructions: ["Lie on your back with knees bent.", "Hold dumbbells with elbows on the floor.", "Press the weights up until arms are straight, then lower back to the floor."],
    commonMistakes: ["Bouncing elbows off the floor"],
    safetyTips: ["Control the descent to protect elbows."],
    defaultSets: 4, defaultReps: "8-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Resistance-band chest press", category: "Chest", difficulty: "Beginner", equipment: "Resistance Band",
    targetMuscles: ["Chest", "Shoulders", "Triceps"], movementPattern: "Horizontal Push",
    description: "A standing chest press using a resistance band.",
    formCues: ["Maintain an athletic stance"],
    instructions: ["Anchor the band behind you at chest height.", "Hold the handles and step forward to create tension.", "Press handles forward until arms are fully extended, then return slowly."],
    commonMistakes: ["Letting the band snap back quickly"],
    safetyTips: ["Ensure the anchor point is secure."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Standing wall push-ups", category: "Chest", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Chest", "Shoulders", "Triceps"], movementPattern: "Horizontal Push",
    description: "A very accessible push-up performed against a wall.",
    formCues: ["Keep heels on the floor or slightly raised"],
    instructions: ["Stand facing a wall, a little more than arm's length away.", "Place hands on the wall.", "Bend elbows to bring your chest to the wall, then push back."],
    commonMistakes: ["Standing too close to the wall"],
    safetyTips: ["Great for rehab or absolute beginners."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 3
  },

  // BACK
  {
    name: "Pull-ups", category: "Back", difficulty: "Advanced", equipment: "Pull-up Bar",
    targetMuscles: ["Lats", "Biceps", "Upper Back"], movementPattern: "Vertical Pull",
    description: "A foundational upper-body exercise for back strength.",
    formCues: ["Pull chest to the bar", "Engage lats"],
    instructions: ["Grip the bar slightly wider than shoulder-width.", "Hang with arms fully extended.", "Pull yourself up until your chin is over the bar, then lower with control."],
    commonMistakes: ["Using momentum (kipping)", "Not going all the way down"],
    safetyTips: ["Ensure the pull-up bar is securely mounted."],
    defaultSets: 3, defaultReps: "5-10", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Assisted pull-ups", category: "Back", difficulty: "Intermediate", equipment: "Resistance Band",
    targetMuscles: ["Lats", "Biceps"], movementPattern: "Vertical Pull",
    description: "A pull-up using a resistance band for assistance.",
    formCues: ["Keep core tight", "Pull smoothly"],
    instructions: ["Loop a band around the pull-up bar.", "Place your foot or knee in the band.", "Perform a pull-up with the band's assistance."],
    commonMistakes: ["Letting the band snap you up"],
    safetyTips: ["Be careful when stepping out of the band."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Resistance-band rows", category: "Back", difficulty: "Beginner", equipment: "Resistance Band",
    targetMuscles: ["Mid Back", "Rhomboids", "Biceps"], movementPattern: "Horizontal Pull",
    description: "A pulling exercise that improves posture.",
    formCues: ["Squeeze shoulder blades together"],
    instructions: ["Anchor the band in front of you.", "Hold handles and step back.", "Pull the band to your torso, squeezing your back, then release."],
    commonMistakes: ["Shrugging shoulders up"],
    safetyTips: ["Keep shoulders depressed."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "One-arm dumbbell rows", category: "Back", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Lats", "Rhomboids", "Biceps"], movementPattern: "Horizontal Pull",
    description: "A unilateral rowing exercise.",
    formCues: ["Keep back flat", "Pull to the hip"],
    instructions: ["Support yourself on a bench or chair.", "Hold a dumbbell in one hand.", "Pull the dumbbell up toward your hip, then lower it under control."],
    commonMistakes: ["Twisting the torso excessively"],
    safetyTips: ["Keep a neutral spine."],
    defaultSets: 3, defaultReps: "10-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Bent-over dumbbell rows", category: "Back", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Mid Back", "Lats", "Lower Back"], movementPattern: "Horizontal Pull",
    description: "A bilateral row targeting the entire back.",
    formCues: ["Hinge at the hips", "Keep back straight"],
    instructions: ["Hold two dumbbells.", "Hinge forward at the hips until your torso is nearly parallel to the floor.", "Row both dumbbells to your hips, then lower."],
    commonMistakes: ["Rounding the lower back"],
    safetyTips: ["Engage your core to protect your lower back."],
    defaultSets: 3, defaultReps: "10-12", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Superman holds", category: "Back", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Lower Back", "Glutes", "Upper Back"], movementPattern: "Spinal Extension",
    description: "A bodyweight exercise for the lower back and posterior chain.",
    formCues: ["Squeeze glutes and lower back"],
    instructions: ["Lie face down on a mat.", "Simultaneously lift your arms, chest, and legs off the floor.", "Hold for 2-3 seconds, then lower."],
    commonMistakes: ["Hyperextending the neck"],
    safetyTips: ["Look down at the floor to keep the neck neutral."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Reverse snow angels", category: "Back", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Rhomboids", "Lower Back", "Shoulders"], movementPattern: "Spinal Extension",
    description: "Improves shoulder mobility and back strength.",
    formCues: ["Keep arms straight"],
    instructions: ["Lie face down.", "Lift chest and arms off the floor.", "Sweep arms from straight overhead down to your hips, then back up."],
    commonMistakes: ["Resting arms on the floor between reps"],
    safetyTips: ["Move slowly and with control."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Bird-dog rows", category: "Back", difficulty: "Advanced", equipment: "Dumbbells",
    targetMuscles: ["Core", "Back", "Glutes"], movementPattern: "Horizontal Pull",
    description: "A core-intensive rowing variation.",
    formCues: ["Keep hips square to the floor"],
    instructions: ["Get on hands and knees.", "Extend one leg straight back.", "With the opposite arm, row a dumbbell up to your hip.", "Lower and repeat."],
    commonMistakes: ["Losing balance and twisting"],
    safetyTips: ["Master the bodyweight bird-dog first."],
    defaultSets: 3, defaultReps: "8-10", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Doorway rows", category: "Back", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Mid Back", "Biceps"], movementPattern: "Horizontal Pull",
    description: "A convenient bodyweight row using a sturdy doorframe.",
    formCues: ["Lean back with arms straight", "Pull chest to the doorway"],
    instructions: ["Stand in a doorway, grab the frame.", "Place feet close to the frame and lean back until arms are straight.", "Pull yourself up to the frame."],
    commonMistakes: ["Sagging the hips"],
    safetyTips: ["Ensure your grip on the doorframe is secure."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Prone Y-T-W raises", category: "Back", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Lower traps", "Mid Back", "Rear Delts"], movementPattern: "Scapular Retraction",
    description: "A sequence of arm raises to strengthen the upper back and improve posture.",
    formCues: ["Thumbs pointing up"],
    instructions: ["Lie face down.", "Raise arms in a Y shape, lower.", "Raise in a T shape, lower.", "Bend elbows and raise in a W shape, lower."],
    commonMistakes: ["Using momentum instead of muscle control"],
    safetyTips: ["Keep chest slightly elevated but do not strain the lower back."],
    defaultSets: 3, defaultReps: "8-10 cycles", estimatedCaloriesPerMinute: 4
  },

  // LEGS
  {
    name: "Bodyweight squats", category: "Legs", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes", "Hamstrings"], movementPattern: "Squat",
    description: "The fundamental lower-body movement.",
    formCues: ["Keep chest up", "Drive through the heels"],
    instructions: ["Stand with feet shoulder-width apart.", "Push hips back and bend knees to lower down.", "Stand back up, squeezing glutes."],
    commonMistakes: ["Knees caving inward", "Heels lifting off the floor"],
    safetyTips: ["Only go as deep as you can with good form."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Sumo squats", category: "Legs", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Inner Thighs", "Glutes", "Quads"], movementPattern: "Squat",
    description: "A wide-stance squat that targets the inner thighs.",
    formCues: ["Toes pointed outward", "Knees track over toes"],
    instructions: ["Take a wide stance with toes pointed out.", "Squat down, keeping your torso upright.", "Push back up."],
    commonMistakes: ["Leaning too far forward"],
    safetyTips: ["Don't force a stance wider than comfortable."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Pause squats", category: "Legs", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes"], movementPattern: "Squat",
    description: "Squats with a brief pause at the bottom to build strength and control.",
    formCues: ["Hold the bottom position for 2 seconds"],
    instructions: ["Perform a normal squat.", "Pause at the bottom of the movement for 2-3 seconds.", "Drive explosively back up."],
    commonMistakes: ["Relaxing at the bottom of the squat"],
    safetyTips: ["Keep core fully engaged during the pause."],
    defaultSets: 3, defaultReps: "10-12", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Split squats", category: "Legs", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes"], movementPattern: "Lunge",
    description: "A stationary lunge targeting one leg at a time.",
    formCues: ["Keep torso upright", "Lower straight down"],
    instructions: ["Stand in a staggered stance.", "Lower your hips until both knees are bent at a 90-degree angle.", "Push back up to the starting position."],
    commonMistakes: ["Letting the front knee shoot past the toes excessively"],
    safetyTips: ["Maintain balance by keeping feet hip-width apart, not on a tightrope."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Reverse lunges", category: "Legs", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes", "Hamstrings"], movementPattern: "Lunge",
    description: "A safer lunge variation that reduces knee stress.",
    formCues: ["Step back and lower down"],
    instructions: ["Stand tall.", "Take a large step backward with one foot.", "Lower hips until both knees are bent at 90 degrees.", "Push off the back foot to return to the start."],
    commonMistakes: ["Stepping back too narrowly"],
    safetyTips: ["Keep chest up and core engaged."],
    defaultSets: 3, defaultReps: "10-15/side", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Forward lunges", category: "Legs", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes"], movementPattern: "Lunge",
    description: "A dynamic lunge stepping forward.",
    formCues: ["Land softly on the front foot"],
    instructions: ["Take a large step forward.", "Lower hips until both knees are bent at 90 degrees.", "Push off the front foot to return."],
    commonMistakes: ["Crashing down on the front knee"],
    safetyTips: ["Requires more deceleration control than reverse lunges."],
    defaultSets: 3, defaultReps: "10-15/side", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Walking lunges", category: "Legs", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes", "Hamstrings"], movementPattern: "Lunge",
    description: "Continuous forward lunges across the floor.",
    formCues: ["Keep moving continuously or pause in the middle to balance"],
    instructions: ["Step forward into a lunge.", "Push off the back foot and step directly into the next lunge with the other leg."],
    commonMistakes: ["Losing balance"],
    safetyTips: ["Make sure you have a clear path."],
    defaultSets: 3, defaultReps: "20 steps", estimatedCaloriesPerMinute: 9
  },
  {
    name: "Step-ups", category: "Legs", difficulty: "Intermediate", equipment: "Chair",
    targetMuscles: ["Glutes", "Quads"], movementPattern: "Step-up",
    description: "A unilateral leg exercise using an elevated surface.",
    formCues: ["Drive through the heel of the elevated foot"],
    instructions: ["Place one foot on a sturdy chair or box.", "Press through that foot to lift your body up.", "Step back down slowly."],
    commonMistakes: ["Pushing off too much with the bottom foot"],
    safetyTips: ["Ensure the chair is very stable and won't slip."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Wall sits", category: "Legs", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Quads"], movementPattern: "Isometric",
    description: "An isometric hold that builds endurance in the quads.",
    formCues: ["Back flat against the wall", "Thighs parallel to the floor"],
    instructions: ["Slide down a wall until thighs are parallel to the ground.", "Ensure knees are above ankles.", "Hold the position."],
    commonMistakes: ["Resting hands on thighs"],
    safetyTips: ["Keep breathing evenly during the hold."],
    defaultSets: 3, defaultReps: "30-60 sec", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Bulgarian split squats", category: "Legs", difficulty: "Advanced", equipment: "Chair",
    targetMuscles: ["Quads", "Glutes"], movementPattern: "Lunge",
    description: "A brutal unilateral leg exercise with the rear foot elevated.",
    formCues: ["Keep most of the weight on the front leg"],
    instructions: ["Stand a few feet in front of a chair.", "Place one foot behind you on the chair.", "Lower your hips until your front thigh is parallel to the floor.", "Push back up."],
    commonMistakes: ["Standing too close or too far from the chair"],
    safetyTips: ["Start without weight to master the balance."],
    defaultSets: 3, defaultReps: "8-12/side", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Cossack squats", category: "Legs", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Quads", "Glutes", "Inner Thighs"], movementPattern: "Squat",
    description: "A deep lateral squat requiring strength and mobility.",
    formCues: ["Keep the heel of the bent leg on the floor"],
    instructions: ["Take a very wide stance.", "Squat deep to one side, keeping the other leg straight with the toes pointing up.", "Push back to center and repeat on the other side."],
    commonMistakes: ["Rounding the back excessively"],
    safetyTips: ["Only go as deep as your mobility allows."],
    defaultSets: 3, defaultReps: "8-10/side", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Calf raises", category: "Legs", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Calves"], movementPattern: "Plantar Flexion",
    description: "An isolation exercise for the calf muscles.",
    formCues: ["Rise up onto the balls of your feet", "Pause at the top"],
    instructions: ["Stand tall.", "Push through the balls of your feet to raise your heels as high as possible.", "Slowly lower back down."],
    commonMistakes: ["Bouncing at the bottom"],
    safetyTips: ["Perform on a step for a deeper stretch, but hold a railing for balance."],
    defaultSets: 4, defaultReps: "15-20", estimatedCaloriesPerMinute: 4
  },

  // GLUTES
  {
    name: "Glute bridges", category: "Glutes", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Glutes", "Hamstrings", "Core"], movementPattern: "Hip Hinge",
    description: "A basic floor exercise to activate and strengthen the glutes.",
    formCues: ["Squeeze glutes at the top", "Don't overextend lower back"],
    instructions: ["Lie on your back with knees bent and feet flat on the floor.", "Push through your heels to lift your hips until your body forms a straight line from knees to shoulders.", "Lower slowly."],
    commonMistakes: ["Arching the lower back instead of using glutes"],
    safetyTips: ["Keep your core braced."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Single-leg glute bridges", category: "Glutes", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Glutes", "Hamstrings"], movementPattern: "Hip Hinge",
    description: "A unilateral variation of the glute bridge.",
    formCues: ["Keep hips level"],
    instructions: ["Lie on your back, knees bent.", "Extend one leg straight out.", "Push through the heel of the planted foot to lift hips.", "Lower slowly."],
    commonMistakes: ["Letting the hip of the extended leg drop"],
    safetyTips: ["Keep movements controlled."],
    defaultSets: 3, defaultReps: "10-15/side", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Hip thrusts on a sofa", category: "Glutes", difficulty: "Intermediate", equipment: "Chair",
    targetMuscles: ["Glutes"], movementPattern: "Hip Hinge",
    description: "A powerful glute builder with a greater range of motion than floor bridges.",
    formCues: ["Chin tucked", "Pivot from the shoulder blades"],
    instructions: ["Rest your upper back against a sofa or sturdy chair.", "Plant feet flat on the floor.", "Drop your hips down, then drive them up forcefully, squeezing the glutes."],
    commonMistakes: ["Throwing the head back"],
    safetyTips: ["Ensure the sofa/chair won't move."],
    defaultSets: 4, defaultReps: "10-15", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Donkey kicks", category: "Glutes", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Glutes"], movementPattern: "Hip Extension",
    description: "An isolation exercise for the gluteus maximus.",
    formCues: ["Kick the heel straight up to the ceiling"],
    instructions: ["Get on hands and knees.", "Keep one knee bent at 90 degrees and push the sole of your foot up toward the ceiling.", "Lower the knee back down."],
    commonMistakes: ["Arching the lower back heavily"],
    safetyTips: ["Keep the core tight to isolate the glutes."],
    defaultSets: 3, defaultReps: "15-20/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Fire hydrants", category: "Glutes", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Gluteus Medius"], movementPattern: "Hip Abduction",
    description: "An isolation exercise targeting the outer glutes.",
    formCues: ["Lift knee to the side", "Keep torso still"],
    instructions: ["Get on hands and knees.", "Keeping the knee bent, raise one leg out to the side.", "Lower back to the start."],
    commonMistakes: ["Leaning too far to the opposite side"],
    safetyTips: ["Move slowly to maintain balance."],
    defaultSets: 3, defaultReps: "15-20/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Standing kickbacks", category: "Glutes", difficulty: "Beginner", equipment: "Resistance Band",
    targetMuscles: ["Glutes"], movementPattern: "Hip Extension",
    description: "A standing exercise to isolate the glutes, optionally using a band.",
    formCues: ["Squeeze glute at the top of the movement"],
    instructions: ["Stand tall, holding a wall for balance.", "Keep leg straight and kick it backward.", "Squeeze the glute, then return."],
    commonMistakes: ["Leaning forward excessively"],
    safetyTips: ["Keep torso upright."],
    defaultSets: 3, defaultReps: "15-20/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Frog pumps", category: "Glutes", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Glutes"], movementPattern: "Hip Hinge",
    description: "A high-rep glute bridge variation with soles of feet touching.",
    formCues: ["Keep feet together", "Tuck chin"],
    instructions: ["Lie on your back, bring soles of feet together so knees fall open.", "Push edges of feet into the floor to lift hips.", "Lower and repeat rapidly."],
    commonMistakes: ["Pushing off the heels instead of the sides of the feet"],
    safetyTips: ["Keep lower back flat at the bottom."],
    defaultSets: 3, defaultReps: "20-30", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Curtsy lunges", category: "Glutes", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Gluteus Medius", "Quads"], movementPattern: "Lunge",
    description: "A lunge that steps diagonally behind, targeting the side glutes.",
    formCues: ["Step back and across"],
    instructions: ["Stand tall.", "Step one foot behind and outside the other foot.", "Lower your hips, then push back to start."],
    commonMistakes: ["Twisting the front knee"],
    safetyTips: ["Keep front knee tracking straight forward."],
    defaultSets: 3, defaultReps: "10-15/side", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Banded lateral walks", category: "Glutes", difficulty: "Intermediate", equipment: "Resistance Band",
    targetMuscles: ["Gluteus Medius"], movementPattern: "Hip Abduction",
    description: "A moving exercise with a band to light up the outer glutes.",
    formCues: ["Keep tension on the band at all times"],
    instructions: ["Place a band around your thighs or ankles.", "Get into a quarter squat.", "Take small, controlled steps to the side."],
    commonMistakes: ["Dragging the trailing foot"],
    safetyTips: ["Keep knees pushed out against the band."],
    defaultSets: 3, defaultReps: "15-20 steps/side", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Step-ups", category: "Glutes", difficulty: "Intermediate", equipment: "Chair",
    targetMuscles: ["Glutes", "Quads"], movementPattern: "Step-up",
    description: "Already listed under Legs, but highly effective for glutes when focused on the heel drive.",
    formCues: ["Lean slightly forward to engage glutes"],
    instructions: ["Place foot on chair.", "Drive through the heel to step up.", "Lower slowly."],
    commonMistakes: ["Bouncing off the back foot"],
    safetyTips: ["Ensure chair is stable."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 7
  },

  // SHOULDERS
  {
    name: "Pike push-ups", category: "Shoulders", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Shoulders", "Triceps"], movementPattern: "Vertical Push",
    description: "A bodyweight exercise that simulates an overhead press.",
    formCues: ["Keep hips high", "Head travels forward slightly"],
    instructions: ["Start in a downward dog position.", "Bend elbows to lower the top of your head toward the floor between your hands.", "Press back up."],
    commonMistakes: ["Flaring elbows out wide"],
    safetyTips: ["Don't let your head crash into the floor."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Dumbbell shoulder press", category: "Shoulders", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Shoulders", "Triceps"], movementPattern: "Vertical Push",
    description: "A foundational exercise for building shoulder strength and size.",
    formCues: ["Press weights straight overhead", "Keep core braced"],
    instructions: ["Sit or stand holding dumbbells at shoulder height.", "Press them up until arms are fully extended.", "Lower back to shoulders under control."],
    commonMistakes: ["Leaning back too far and arching the spine"],
    safetyTips: ["Avoid pushing the head too far forward."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Arnold press", category: "Shoulders", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Shoulders"], movementPattern: "Vertical Push",
    description: "A shoulder press variation that incorporates rotation to hit all heads of the deltoid.",
    formCues: ["Rotate palms forward as you press up"],
    instructions: ["Hold dumbbells in front of your chest with palms facing you.", "As you press up, rotate your hands so palms face forward at the top.", "Reverse the motion on the way down."],
    commonMistakes: ["Using momentum instead of controlled rotation"],
    safetyTips: ["Start with lighter weights than a standard press."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Lateral raises", category: "Shoulders", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Lateral Deltoid"], movementPattern: "Isolation",
    description: "Isolates the side of the shoulders for width.",
    formCues: ["Slight bend in the elbows", "Pouring water motion at the top"],
    instructions: ["Stand holding dumbbells at your sides.", "Raise arms out to the sides until parallel with the floor.", "Lower slowly."],
    commonMistakes: ["Swinging the weights up", "Shrugging the traps"],
    safetyTips: ["Keep shoulders down and relaxed."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Front raises", category: "Shoulders", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Front Deltoid"], movementPattern: "Isolation",
    description: "Isolates the front of the shoulders.",
    formCues: ["Raise weights straight in front of you"],
    instructions: ["Stand holding dumbbells in front of your thighs.", "Raise them forward to shoulder height.", "Lower slowly."],
    commonMistakes: ["Leaning back to lift the weight"],
    safetyTips: ["Keep core tight to prevent swaying."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Bent-over reverse flyes", category: "Shoulders", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Rear Deltoids", "Rhomboids"], movementPattern: "Isolation",
    description: "Targets the back of the shoulders for balanced shoulder development.",
    formCues: ["Hinge forward", "Squeeze shoulder blades together"],
    instructions: ["Hinge at the hips with a flat back.", "Holding dumbbells, raise arms out to the sides like wings.", "Lower under control."],
    commonMistakes: ["Standing up too upright"],
    safetyTips: ["Use light weight to isolate the small muscles."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Resistance-band shoulder press", category: "Shoulders", difficulty: "Beginner", equipment: "Resistance Band",
    targetMuscles: ["Shoulders", "Triceps"], movementPattern: "Vertical Push",
    description: "A joint-friendly overhead press using bands.",
    formCues: ["Step on the band", "Press straight up"],
    instructions: ["Stand on the middle of a resistance band.", "Hold the handles at shoulder height.", "Press overhead, then return to shoulders."],
    commonMistakes: ["Letting the band snap down quickly"],
    safetyTips: ["Check the band for tears before using."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Wall handstand hold", category: "Shoulders", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Shoulders", "Core"], movementPattern: "Isometric",
    description: "An advanced static hold that builds massive shoulder endurance.",
    formCues: ["Push the floor away", "Keep body tight"],
    instructions: ["Kick up or walk your feet up a wall into a handstand.", "Hold the position, keeping arms straight and core tight."],
    commonMistakes: ["Arching the lower back excessively"],
    safetyTips: ["Ensure you know how to safely bail out of the handstand."],
    defaultSets: 3, defaultReps: "20-40 sec", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Shoulder taps", category: "Shoulders", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Shoulders", "Core"], movementPattern: "Stability",
    description: "A plank variation that works shoulder stability and core anti-rotation.",
    formCues: ["Keep hips completely still"],
    instructions: ["Start in a high plank position.", "Lift one hand to tap the opposite shoulder.", "Return hand to floor and switch sides."],
    commonMistakes: ["Rocking hips side to side"],
    safetyTips: ["Widen your feet for better balance."],
    defaultSets: 3, defaultReps: "20 taps", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Y-raises", category: "Shoulders", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Lower Traps", "Shoulders"], movementPattern: "Isolation",
    description: "Improves shoulder mobility and lower trap strength.",
    formCues: ["Thumbs pointing up"],
    instructions: ["Lie face down on a mat.", "Extend arms forward and slightly outward in a Y shape.", "Lift arms toward the ceiling, hold, and lower."],
    commonMistakes: ["Using the lower back to lift"],
    safetyTips: ["Keep chest close to the floor."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 4
  },

  // ARMS
  {
    name: "Close-grip push-ups", category: "Arms", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Triceps", "Chest"], movementPattern: "Horizontal Push",
    description: "A push-up with hands close together to target the triceps.",
    formCues: ["Keep elbows tucked against your ribs"],
    instructions: ["Place hands narrower than shoulder-width.", "Perform a push-up, keeping elbows pointing backward."],
    commonMistakes: ["Flaring elbows out"],
    safetyTips: ["If wrists hurt, try on dumbbells or push-up bars."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Diamond push-ups", category: "Arms", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Triceps", "Inner Chest"], movementPattern: "Horizontal Push",
    description: "Already listed under Chest, but highly effective for triceps.",
    formCues: ["Hands form a diamond"],
    instructions: ["Place hands under your chest, index fingers and thumbs touching.", "Perform a push-up."],
    commonMistakes: ["Sagging hips"],
    safetyTips: ["Can be hard on the wrists; modify if needed."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Chair tricep dips", category: "Arms", difficulty: "Beginner", equipment: "Chair",
    targetMuscles: ["Triceps", "Shoulders"], movementPattern: "Vertical Push",
    description: "A bodyweight exercise using a chair to isolate the triceps.",
    formCues: ["Keep back close to the chair"],
    instructions: ["Sit on the edge of a sturdy chair, place hands beside hips.", "Slide off the chair and lower your body by bending elbows to 90 degrees.", "Push back up."],
    commonMistakes: ["Letting elbows flare out", "Moving too far away from the chair"],
    safetyTips: ["Ensure chair will not slip backward."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Overhead tricep extensions", category: "Arms", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Triceps"], movementPattern: "Isolation",
    description: "An overhead movement that stretches and strengthens the long head of the triceps.",
    formCues: ["Keep elbows pointing up and still"],
    instructions: ["Hold a dumbbell overhead with both hands.", "Bend elbows to lower the weight behind your head.", "Extend arms back to the top."],
    commonMistakes: ["Moving the elbows back and forth"],
    safetyTips: ["Keep core tight to prevent arching the back."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Dumbbell bicep curls", category: "Arms", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Biceps"], movementPattern: "Isolation",
    description: "The classic exercise for building bicep size.",
    formCues: ["Keep elbows pinned to your sides"],
    instructions: ["Stand holding dumbbells, palms facing forward.", "Curl the weights toward your shoulders.", "Lower slowly."],
    commonMistakes: ["Swinging the torso to lift the weight"],
    safetyTips: ["Control the negative (downward) phase."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Hammer curls", category: "Arms", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Biceps", "Brachialis", "Forearms"], movementPattern: "Isolation",
    description: "A curl variation with neutral grip to build arm thickness.",
    formCues: ["Palms face each other"],
    instructions: ["Stand holding dumbbells with palms facing your sides.", "Curl weights to shoulders while maintaining the neutral grip.", "Lower slowly."],
    commonMistakes: ["Using momentum"],
    safetyTips: ["Keep wrists straight."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Concentration curls", category: "Arms", difficulty: "Intermediate", equipment: "Dumbbells",
    targetMuscles: ["Biceps"], movementPattern: "Isolation",
    description: "A seated curl that strictly isolates the bicep.",
    formCues: ["Rest elbow on the inside of the thigh"],
    instructions: ["Sit on a chair, hold a dumbbell in one hand.", "Rest your elbow on your inner thigh.", "Curl the weight up, then lower fully."],
    commonMistakes: ["Leaning back as you curl"],
    safetyTips: ["Focus on the squeeze at the top."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Resistance-band curls", category: "Arms", difficulty: "Beginner", equipment: "Resistance Band",
    targetMuscles: ["Biceps"], movementPattern: "Isolation",
    description: "A curl using a band, providing continuous tension.",
    formCues: ["Squeeze at the top where tension is highest"],
    instructions: ["Step on the center of the band.", "Hold handles with palms up.", "Curl toward shoulders, then slowly resist the band on the way down."],
    commonMistakes: ["Letting the band snap down quickly"],
    safetyTips: ["Adjust tension by stepping wider or narrower."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Tricep kickbacks", category: "Arms", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Triceps"], movementPattern: "Isolation",
    description: "A bent-over exercise isolating the triceps.",
    formCues: ["Keep upper arm parallel to the floor"],
    instructions: ["Hinge forward at the hips.", "Row elbows up to your sides and hold them there.", "Extend your hands back until arms are straight, then bend elbows back to 90 degrees."],
    commonMistakes: ["Dropping the elbows"],
    safetyTips: ["Use light weight to maintain form."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Isometric bicep holds", category: "Arms", difficulty: "Beginner", equipment: "Dumbbells",
    targetMuscles: ["Biceps"], movementPattern: "Isometric",
    description: "Holding a curl midway to increase time under tension.",
    formCues: ["Hold elbows at exactly 90 degrees"],
    instructions: ["Curl the dumbbells halfway up.", "Hold this 90-degree position statically."],
    commonMistakes: ["Letting the arms drop slowly"],
    safetyTips: ["Breathe continuously through the hold."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 4
  },

  // CORE
  {
    name: "Forearm plank", category: "Core", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Core", "Shoulders"], movementPattern: "Stability",
    description: "A static hold to build deep core stability.",
    formCues: ["Body in a straight line", "Squeeze glutes and brace core"],
    instructions: ["Rest on forearms and toes.", "Keep hips level with shoulders and hold the position."],
    commonMistakes: ["Sagging hips", "Piking hips into the air"],
    safetyTips: ["Look at the floor slightly ahead of your hands to keep neck neutral."],
    defaultSets: 3, defaultReps: "30-60 sec", estimatedCaloriesPerMinute: 4
  },
  {
    name: "High plank", category: "Core", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Core", "Shoulders", "Arms"], movementPattern: "Stability",
    description: "A plank performed on the hands, similar to the top of a push-up.",
    formCues: ["Hands directly under shoulders"],
    instructions: ["Get into the top of a push-up position.", "Brace your core, squeeze glutes, and hold."],
    commonMistakes: ["Locking the elbows too hard"],
    safetyTips: ["Keep a micro-bend in the elbows."],
    defaultSets: 3, defaultReps: "45-60 sec", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Side plank", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Obliques", "Core"], movementPattern: "Stability",
    description: "A lateral static hold targeting the obliques.",
    formCues: ["Keep hips pushed up"],
    instructions: ["Lie on your side.", "Prop yourself up on one forearm and the side of your foot.", "Hold your body in a straight line."],
    commonMistakes: ["Letting the hips sag toward the floor"],
    safetyTips: ["Stack your feet or stagger them for better balance."],
    defaultSets: 3, defaultReps: "30-45 sec/side", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Dead bug", category: "Core", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Deep Core"], movementPattern: "Anti-extension",
    description: "An excellent exercise for learning core bracing while moving limbs.",
    formCues: ["Press lower back firmly into the floor"],
    instructions: ["Lie on your back, arms reaching up, knees bent at 90 degrees.", "Slowly extend one leg and the opposite arm toward the floor.", "Return to start and switch sides."],
    commonMistakes: ["Letting the lower back arch off the floor"],
    safetyTips: ["If your back arches, do not lower your limbs as far down."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Bird dog", category: "Core", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Core", "Lower Back", "Glutes"], movementPattern: "Anti-rotation",
    description: "A kneeling exercise promoting core stability and balance.",
    formCues: ["Keep back flat like a table"],
    instructions: ["Get on hands and knees.", "Extend one arm forward and the opposite leg straight back.", "Hold for a second, return, and switch."],
    commonMistakes: ["Arching the back excessively", "Twisting the hips"],
    safetyTips: ["Move slowly and with control."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Mountain climbers", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Core", "Cardio", "Shoulders"], movementPattern: "Dynamic Core",
    description: "A dynamic plank that raises the heart rate while working the core.",
    formCues: ["Keep hips low"],
    instructions: ["Start in a high plank.", "Quickly drive one knee toward your chest, then switch legs in a running motion."],
    commonMistakes: ["Bouncing the hips up and down"],
    safetyTips: ["Keep weight shifted forward over your hands."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 9
  },
  {
    name: "Bicycle crunches", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Obliques", "Abs"], movementPattern: "Spinal Flexion / Rotation",
    description: "A rotational crunch targeting the obliques and rectus abdominis.",
    formCues: ["Bring shoulder to knee, not just the elbow"],
    instructions: ["Lie on your back, hands lightly behind head, legs lifted.", "Twist to bring right elbow toward left knee while extending the right leg.", "Switch sides continuously."],
    commonMistakes: ["Pulling on the neck", "Rushing through the movement"],
    safetyTips: ["Keep lower back pressed into the mat."],
    defaultSets: 3, defaultReps: "15-20/side", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Reverse crunches", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Lower Abs"], movementPattern: "Spinal Flexion",
    description: "Targets the lower abdominal region by curling the hips upward.",
    formCues: ["Use abs to lift hips, not momentum"],
    instructions: ["Lie on your back with knees bent.", "Contract your abs to curl your hips off the floor, bringing knees toward your chest.", "Lower slowly."],
    commonMistakes: ["Using leg swing momentum to throw the hips up"],
    safetyTips: ["Control the descent to protect the lower back."],
    defaultSets: 3, defaultReps: "12-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Leg raises", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Lower Abs", "Hip Flexors"], movementPattern: "Hip Flexion",
    description: "A challenging core move involving raising straight legs from the floor.",
    formCues: ["Press lower back into the mat completely"],
    instructions: ["Lie flat on your back, legs straight.", "Lift both legs until they are pointing at the ceiling.", "Slowly lower them back down without letting your back arch."],
    commonMistakes: ["Arching the lower back"],
    safetyTips: ["Place hands under your glutes for lower back support if needed."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 5
  },
  {
    name: "Hollow-body hold", category: "Core", difficulty: "Advanced", equipment: "Mat",
    targetMuscles: ["Core"], movementPattern: "Isometric",
    description: "A gymnastics staple that builds tremendous deep core strength.",
    formCues: ["Create a 'banana' shape with your body", "Lower back glued to floor"],
    instructions: ["Lie on your back.", "Lift arms overhead and legs off the floor.", "Press your lower back into the floor and hold."],
    commonMistakes: ["Letting the lower back come off the floor"],
    safetyTips: ["If your back lifts, raise your legs higher to reduce leverage."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Russian twists", category: "Core", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Obliques", "Core"], movementPattern: "Rotation",
    description: "A seated rotational exercise.",
    formCues: ["Lean back to 45 degrees", "Follow your hands with your eyes"],
    instructions: ["Sit on the floor, lean back slightly, and lift feet off the ground.", "Clasp hands and twist your torso to touch the floor on one side, then the other."],
    commonMistakes: ["Only moving the arms without twisting the torso"],
    safetyTips: ["Keep chest proud and back straight."],
    defaultSets: 3, defaultReps: "15-20/side", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Bear crawl", category: "Core", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Core", "Shoulders", "Quads"], movementPattern: "Dynamic Core",
    description: "A full-body crawl that heavily taxes the core.",
    formCues: ["Keep knees hovering just one inch off the ground", "Back flat"],
    instructions: ["Start on hands and knees.", "Lift knees slightly off the floor.", "Crawl forward by moving opposite hand and foot together."],
    commonMistakes: ["Raising hips too high into the air"],
    safetyTips: ["Keep movements small and controlled."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 8
  },

  // FULL BODY
  {
    name: "Burpees", category: "Full Body", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Full Body", "Cardio"], movementPattern: "Explosive",
    description: "A highly intense full-body conditioning exercise.",
    formCues: ["Chest to the floor", "Jump at the top"],
    instructions: ["Drop into a squat position, place hands on the floor.", "Jump feet back into a plank.", "Perform a push-up.", "Jump feet forward and stand up, jumping into the air."],
    commonMistakes: ["Sagging hips during the push-up phase"],
    safetyTips: ["Modify by stepping back instead of jumping if needed."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 12
  },
  {
    name: "Squat to reach", category: "Full Body", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Legs", "Core", "Shoulders"], movementPattern: "Squat/Reach",
    description: "A low-impact full-body warmup or workout movement.",
    formCues: ["Sink hips low, reach high"],
    instructions: ["Perform a deep squat and touch the floor.", "Stand up explosively and reach both arms high onto your tiptoes."],
    commonMistakes: ["Rounding the back when touching the floor"],
    safetyTips: ["Keep chest up."],
    defaultSets: 3, defaultReps: "15-20", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Inchworms", category: "Full Body", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Core", "Shoulders", "Hamstrings"], movementPattern: "Dynamic",
    description: "A mobility and core exercise.",
    formCues: ["Keep legs as straight as possible"],
    instructions: ["Stand tall.", "Hinge forward, place hands on the floor.", "Walk hands forward into a high plank.", "Walk hands back to feet and stand up."],
    commonMistakes: ["Rushing the movement"],
    safetyTips: ["Bend knees slightly if hamstrings are very tight."],
    defaultSets: 3, defaultReps: "8-10", estimatedCaloriesPerMinute: 6
  },
  {
    name: "Devil press", category: "Full Body", difficulty: "Advanced", equipment: "Dumbbells",
    targetMuscles: ["Full Body"], movementPattern: "Explosive",
    description: "A brutal combination of a burpee and a double dumbbell snatch.",
    formCues: ["Use hips to pop the weights overhead"],
    instructions: ["Hold dumbbells, drop to the floor into a push-up with hands on dumbbells.", "Jump feet in.", "Swing dumbbells between legs and violently extend hips to snatch them overhead."],
    commonMistakes: ["Pressing the weights up with arms instead of using hip momentum"],
    safetyTips: ["Requires very good core bracing."],
    defaultSets: 3, defaultReps: "8-12", estimatedCaloriesPerMinute: 14
  },
  {
    name: "Dumbbell thrusters", category: "Full Body", difficulty: "Advanced", equipment: "Dumbbells",
    targetMuscles: ["Quads", "Glutes", "Shoulders"], movementPattern: "Squat to Press",
    description: "A seamless transition from a front squat into an overhead press.",
    formCues: ["Use leg drive to push the weights up"],
    instructions: ["Hold dumbbells at shoulder height.", "Perform a full squat.", "As you stand up rapidly, press the dumbbells overhead in one fluid motion."],
    commonMistakes: ["Pausing between the squat and the press"],
    safetyTips: ["Keep torso upright during the squat."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 11
  },
  {
    name: "Man makers", category: "Full Body", difficulty: "Advanced", equipment: "Dumbbells",
    targetMuscles: ["Full Body"], movementPattern: "Complex",
    description: "A heavy complex involving push-ups, rows, and a thruster.",
    formCues: ["Keep core tight during the renegade row"],
    instructions: ["In a plank holding dumbbells, do a push-up.", "Row right arm, row left arm.", "Jump feet forward.", "Stand and press dumbbells overhead."],
    commonMistakes: ["Rushing the rows and twisting the hips"],
    safetyTips: ["Take it one step at a time with strict form."],
    defaultSets: 3, defaultReps: "6-8", estimatedCaloriesPerMinute: 12
  },
  {
    name: "Plank to push-up", category: "Full Body", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Core", "Chest", "Shoulders"], movementPattern: "Push/Core",
    description: "Transitioning between forearm plank and high plank.",
    formCues: ["Minimize hip sway"],
    instructions: ["Start in a forearm plank.", "Place one hand flat on the floor, then the other, pushing up into a high plank.", "Lower back down to forearms one arm at a time."],
    commonMistakes: ["Rocking hips wildly from side to side"],
    safetyTips: ["Widen your feet for a more stable base."],
    defaultSets: 3, defaultReps: "10-12", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Clean and press", category: "Full Body", difficulty: "Advanced", equipment: "Dumbbells",
    targetMuscles: ["Full Body"], movementPattern: "Explosive",
    description: "A classic weightlifting movement bringing weight from floor to overhead.",
    formCues: ["Keep weights close to body"],
    instructions: ["Start with dumbbells at shins.", "Explosively stand and pull weights to shoulders.", "Press overhead.", "Return to start."],
    commonMistakes: ["Curling the weight up instead of using hip drive"],
    safetyTips: ["Keep back flat during the pull."],
    defaultSets: 3, defaultReps: "8-10", estimatedCaloriesPerMinute: 10
  },
  {
    name: "Reverse lunge to knee drive", category: "Full Body", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Legs", "Core", "Cardio"], movementPattern: "Lunge/Dynamic",
    description: "A dynamic lunge that incorporates balance and explosive power.",
    formCues: ["Drive knee up forcefully"],
    instructions: ["Step back into a reverse lunge.", "As you stand up, explosively drive the back knee up toward your chest, balancing on one leg.", "Return to lunge."],
    commonMistakes: ["Losing balance"],
    safetyTips: ["Focus your eyes on a fixed point to help balance."],
    defaultSets: 3, defaultReps: "10-12/side", estimatedCaloriesPerMinute: 9
  },

  // CARDIO
  {
    name: "Jumping jacks", category: "Cardio", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Calves"], movementPattern: "Jumping",
    description: "A classic aerobic exercise.",
    formCues: ["Land softly on the balls of your feet"],
    instructions: ["Jump legs out while sweeping arms overhead.", "Jump legs back together and bring arms down."],
    commonMistakes: ["Slapping arms down lazily"],
    safetyTips: ["Stay light on your feet to protect joints."],
    defaultSets: 3, defaultReps: "45-60 sec", estimatedCaloriesPerMinute: 8
  },
  {
    name: "High knees", category: "Cardio", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Hip Flexors"], movementPattern: "Running",
    description: "Running in place while driving the knees high.",
    formCues: ["Drive knees up to waist height", "Pump arms"],
    instructions: ["Run in place, lifting your knees as high as possible with each step."],
    commonMistakes: ["Leaning back"],
    safetyTips: ["Keep torso upright and core engaged."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 10
  },
  {
    name: "Butt kicks", category: "Cardio", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Hamstrings"], movementPattern: "Running",
    description: "Running in place focusing on hamstring flexion.",
    formCues: ["Kick heels up to touch your glutes"],
    instructions: ["Jog in place, kicking your heels up toward your glutes with each step."],
    commonMistakes: ["Kicking slowly without aerobic intent"],
    safetyTips: ["Keep a quick pace."],
    defaultSets: 3, defaultReps: "45-60 sec", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Skater hops", category: "Cardio", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Gluteus Medius", "Legs"], movementPattern: "Lateral Jump",
    description: "Side-to-side leaps mimicking a speed skater.",
    formCues: ["Jump wide, land soft", "Absorb impact"],
    instructions: ["Leap laterally onto one foot, sweeping the other leg behind you.", "Instantly leap back to the other side."],
    commonMistakes: ["Landing stiff-legged"],
    safetyTips: ["Start with small hops and build width as balance improves."],
    defaultSets: 3, defaultReps: "30-45 sec", estimatedCaloriesPerMinute: 9
  },
  {
    name: "Fast feet", category: "Cardio", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Calves"], movementPattern: "Agility",
    description: "An athletic stance drill moving feet as fast as possible.",
    formCues: ["Stay low", "Move feet like a blur"],
    instructions: ["Get into a quarter squat stance.", "Tap your feet on the ground as rapidly as possible in place."],
    commonMistakes: ["Standing up tall"],
    safetyTips: ["Keep weight on the balls of your feet."],
    defaultSets: 3, defaultReps: "20-30 sec", estimatedCaloriesPerMinute: 10
  },
  {
    name: "Squat jumps", category: "Cardio", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Legs"], movementPattern: "Explosive Squat",
    description: "An explosive plyometric movement.",
    formCues: ["Land softly with bent knees"],
    instructions: ["Perform a bodyweight squat.", "Explode upward, jumping into the air.", "Land softly directly into the next squat."],
    commonMistakes: ["Landing with straight, stiff legs"],
    safetyTips: ["Protect your knees by absorbing the landing impact."],
    defaultSets: 3, defaultReps: "10-15", estimatedCaloriesPerMinute: 11
  },
  {
    name: "Tuck jumps", category: "Cardio", difficulty: "Advanced", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Core", "Legs"], movementPattern: "Explosive Jump",
    description: "A high-intensity plyometric jump bringing knees to chest.",
    formCues: ["Drive knees to chest, don't drop chest to knees"],
    instructions: ["Jump straight up as high as possible.", "Tuck your knees up toward your chest in mid-air.", "Land softly."],
    commonMistakes: ["Heavy landings"],
    safetyTips: ["Very high impact; avoid if you have knee issues."],
    defaultSets: 3, defaultReps: "8-10", estimatedCaloriesPerMinute: 12
  },
  {
    name: "Shadow boxing", category: "Cardio", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Cardio", "Shoulders", "Core"], movementPattern: "Boxing",
    description: "Throwing punches in the air for cardiovascular endurance.",
    formCues: ["Keep hands up", "Twist torso with punches"],
    instructions: ["Stand in a fighting stance.", "Throw light, fast combinations of jabs, crosses, hooks, and uppercuts."],
    commonMistakes: ["Locking out the elbows entirely on punches"],
    safetyTips: ["Do not overextend elbows."],
    defaultSets: 3, defaultReps: "60-90 sec", estimatedCaloriesPerMinute: 8
  },
  {
    name: "Stair stepping", category: "Cardio", difficulty: "Beginner", equipment: "Chair",
    targetMuscles: ["Cardio", "Legs"], movementPattern: "Step",
    description: "Continuous stepping up and down to raise heart rate.",
    formCues: ["Pace yourself"],
    instructions: ["Use a low, stable step or bottom stair.", "Step up with right foot, then left.", "Step down with right, then left.", "Switch lead leg halfway."],
    commonMistakes: ["Tripping over the step"],
    safetyTips: ["Ensure the step is secure."],
    defaultSets: 3, defaultReps: "60 sec", estimatedCaloriesPerMinute: 7
  },
  {
    name: "Marching in place", category: "Cardio", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Cardio"], movementPattern: "Marching",
    description: "A low-impact alternative to high knees or running.",
    formCues: ["Lift knees high", "Pump arms aggressively"],
    instructions: ["Stand tall.", "March in place, lifting knees to hip height and swinging arms."],
    commonMistakes: ["Slouching posture"],
    safetyTips: ["Great for active recovery or low-impact days."],
    defaultSets: 3, defaultReps: "60-90 sec", estimatedCaloriesPerMinute: 5
  },

  // MOBILITY
  {
    name: "Cat-cow stretch", category: "Mobility", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Spine", "Core"], movementPattern: "Spinal Flexion/Extension",
    description: "A gentle flow between spinal flexion and extension.",
    formCues: ["Move slowly with your breath"],
    instructions: ["Start on hands and knees.", "Inhale, arch your back, and look up (Cow).", "Exhale, round your spine, and tuck your chin (Cat)."],
    commonMistakes: ["Forcing the stretch into pain"],
    safetyTips: ["Keep movements fluid and painless."],
    defaultSets: 2, defaultReps: "10 cycles", estimatedCaloriesPerMinute: 2
  },
  {
    name: "Child’s pose", category: "Mobility", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Lower Back", "Lats", "Hips"], movementPattern: "Static Stretch",
    description: "A restorative resting pose.",
    formCues: ["Sink hips back to heels", "Reach fingers forward"],
    instructions: ["Kneel, sit back on your heels, and reach arms forward on the floor.", "Rest your forehead on the mat and breathe deeply."],
    commonMistakes: ["Holding breath"],
    safetyTips: ["Relax completely into the stretch."],
    defaultSets: 1, defaultReps: "30-60 sec hold", estimatedCaloriesPerMinute: 2
  },
  {
    name: "World’s greatest stretch", category: "Mobility", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Hips", "Thoracic Spine", "Hamstrings"], movementPattern: "Dynamic Stretch",
    description: "A complex movement stretching multiple tight areas simultaneously.",
    formCues: ["Take your time in each position"],
    instructions: ["Step into a deep lunge.", "Place both hands on the floor inside the front foot.", "Rotate torso and reach the inside arm up to the ceiling.", "Return hand, then push hips back to stretch the front hamstring."],
    commonMistakes: ["Rushing through the phases"],
    safetyTips: ["Do not force rotation beyond comfort."],
    defaultSets: 2, defaultReps: "5 cycles/side", estimatedCaloriesPerMinute: 4
  },
  {
    name: "Hip flexor stretch", category: "Mobility", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Hip Flexors"], movementPattern: "Static Stretch",
    description: "Crucial for undoing tightness from sitting.",
    formCues: ["Tuck the pelvis under (posterior tilt)"],
    instructions: ["Kneel on one knee, other foot forward.", "Tuck your tailbone and gently lean forward until you feel a stretch in the front of the kneeling hip."],
    commonMistakes: ["Arching the lower back to lean further forward"],
    safetyTips: ["Use a mat to cushion the knee."],
    defaultSets: 2, defaultReps: "30 sec/side", estimatedCaloriesPerMinute: 2
  },
  {
    name: "Hamstring stretch", category: "Mobility", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Hamstrings"], movementPattern: "Static Stretch",
    description: "A basic stretch for the back of the thighs.",
    formCues: ["Hinge from the hips, don't round the back"],
    instructions: ["Sit on the floor with one leg extended, the other bent inward.", "Reach toward the toes of the straight leg."],
    commonMistakes: ["Rounding the spine aggressively to reach toes"],
    safetyTips: ["Keep the leg slightly bent if it causes knee pain."],
    defaultSets: 2, defaultReps: "30 sec/side", estimatedCaloriesPerMinute: 2
  },
  {
    name: "Thoracic rotations", category: "Mobility", difficulty: "Beginner", equipment: "Mat",
    targetMuscles: ["Thoracic Spine"], movementPattern: "Rotation",
    description: "Improves upper back mobility and posture.",
    formCues: ["Follow your hand with your eyes"],
    instructions: ["Lie on your side, knees bent at 90 degrees.", "Extend both arms forward.", "Sweep the top arm open across your body toward the floor on the other side, twisting the upper back."],
    commonMistakes: ["Letting the knees lift off the floor"],
    safetyTips: ["Keep knees glued together."],
    defaultSets: 2, defaultReps: "8-10/side", estimatedCaloriesPerMinute: 3
  },
  {
    name: "Shoulder circles", category: "Mobility", difficulty: "Beginner", equipment: "Bodyweight",
    targetMuscles: ["Shoulder joint"], movementPattern: "Dynamic Stretch",
    description: "A simple dynamic warmup for the shoulder capsule.",
    formCues: ["Make large, smooth circles"],
    instructions: ["Stand tall.", "Make large circles with straight arms forward, then backward."],
    commonMistakes: ["Shrugging shoulders into the ears"],
    safetyTips: ["Start small if there is clicking or pain."],
    defaultSets: 2, defaultReps: "15 circles/direction", estimatedCaloriesPerMinute: 3
  },
  {
    name: "Ankle mobility rocks", category: "Mobility", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Ankles", "Calves"], movementPattern: "Dynamic Stretch",
    description: "Improves dorsiflexion, crucial for squatting deep.",
    formCues: ["Keep heel firmly planted"],
    instructions: ["Get into a half-kneeling position.", "Push the front knee forward over the toes as far as possible without the heel lifting.", "Rock back and repeat."],
    commonMistakes: ["Letting the heel pop up"],
    safetyTips: ["Apply gentle pressure."],
    defaultSets: 2, defaultReps: "10-15 rocks/side", estimatedCaloriesPerMinute: 3
  },
  {
    name: "90/90 hip switches", category: "Mobility", difficulty: "Intermediate", equipment: "Mat",
    targetMuscles: ["Hips", "Glutes"], movementPattern: "Internal/External Rotation",
    description: "A floor exercise to improve hip internal and external rotation.",
    formCues: ["Keep torso upright"],
    instructions: ["Sit on floor with both legs bent at 90 degrees, one internally rotated, one externally rotated.", "Pivot on your heels to flip both legs to the other side."],
    commonMistakes: ["Leaning back too far onto hands"],
    safetyTips: ["If hips are tight, use hands for support."],
    defaultSets: 2, defaultReps: "10 switches", estimatedCaloriesPerMinute: 3
  },
  {
    name: "Deep squat hold", category: "Mobility", difficulty: "Intermediate", equipment: "Bodyweight",
    targetMuscles: ["Hips", "Ankles", "Lower Back"], movementPattern: "Static Stretch",
    description: "A resting squat position to open the hips and lower back.",
    formCues: ["Chest up, heels on the floor"],
    instructions: ["Drop down into the deepest squat you can manage.", "Keep heels down.", "Use elbows to gently push knees outward.", "Hold and breathe."],
    commonMistakes: ["Rounding the back completely"],
    safetyTips: ["Hold onto a doorway or heavy object if you fall backward."],
    defaultSets: 2, defaultReps: "30-60 sec hold", estimatedCaloriesPerMinute: 3
  }
];

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

async function main() {
  console.log("Seeding database with updated Exercise Library...");

  // Create default user (schema requires equipment now to default, but user has default)
  await prisma.user.upsert({
    where: { email: "demo@homefit.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@homefit.app",
      age: 30,
      gender: "male",
      heightCm: 180,
      weightKg: 85,
      targetWeightKg: 75,
      activityLevel: "moderate",
      goal: "lose",
      dietPreference: "both",
      onboardingDone: true,
      equipment: "Dumbbells, Resistance Band, Yoga Mat"
    },
  });

  // Seed Exercises
  for (let i = 0; i < EXERCISES_DATA.length; i++) {
    const ex = EXERCISES_DATA[i];
    const slug = slugify(ex.name);
    await prisma.exercise.upsert({
      where: { slug },
      update: {
        ...ex,
      },
      create: {
        slug,
        ...ex,
        videoStatus: "not_started"
      }
    });
    console.log(`Created exercise: ${ex.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
