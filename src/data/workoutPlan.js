/**
 * WINTER ARC — 90-DAY BUILT-IN WORKOUT PLAN
 * 12-Week progressive overload with Deload/Test Weeks on W4, W8, W12.
 * 60-Minute Structure: 10m Warmup -> 45m Main -> 5m Cooldown.
 */

export const WEEKDAY_TEMPLATES = {
  1: { // Monday
    name: "Push Day — Chest, Shoulders, Triceps",
    shortName: "PUSH DAY",
    target: "Chest, Anterior Delts, Triceps",
    focus: "Hypertrophy & Upper Body Pressing",
    warmup: [
      { name: "Arm Circles & Band Dislocates", duration: "3 min", tip: "Open shoulder capsules gently" },
      { name: "Scapular Push-ups & Bear Crawl", duration: "4 min", tip: "Activate serratus anterior" },
      { name: "Light Push-up Walkouts", duration: "3 min", tip: "Fire up wrists, core, and pecs" }
    ],
    exercises: [
      { id: "push-1", name: "Standard / Deficit Push-ups", target: "Chest & Triceps", baseSets: 4, baseReps: 12, formTip: "Elbows tucked 45 degrees, full chest-to-ground lockout." },
      { id: "push-2", name: "Pike Push-ups / Handstand Push-ups", target: "Shoulders (Delts)", baseSets: 3, baseReps: 10, formTip: "Elevate feet if intermediate, gaze slightly forward." },
      { id: "push-3", name: "Parallel Bar / Bench Dips", target: "Lower Chest & Triceps", baseSets: 3, baseReps: 12, formTip: "Controlled 2-second negative, torso leaned slightly forward." },
      { id: "push-4", name: "Overhead Dumbbell / Pike Press", target: "Anterior & Lateral Delts", baseSets: 3, baseReps: 10, formTip: "Ribs braced, zero lower-back hyperextension." },
      { id: "push-5", name: "Diamond Push-ups", target: "Tricep Medial Head", baseSets: 3, baseReps: 12, formTip: "Hands close under sternum, drive through palms." },
      { id: "push-6", name: "Overhead Tricep Extension", target: "Tricep Long Head", baseSets: 3, baseReps: 15, formTip: "Keep elbows pinned close to ears throughout the stroke." }
    ],
    cooldown: [
      { name: "Doorway Chest Stretch", duration: "2 min", tip: "Deep breaths, expand ribcage" },
      { name: "Cross-body Shoulder Stretch", duration: "2 min", tip: "Depress shoulder blades down" },
      { name: "Overhead Tricep Band Stretch", duration: "1 min", tip: "Sink hips back slightly" }
    ]
  },
  2: { // Tuesday
    name: "Pull Day — Back & Biceps",
    shortName: "PULL DAY",
    target: "Lats, Upper Back, Rear Delts, Biceps",
    focus: "Vertical & Horizontal Pulling Strength",
    warmup: [
      { name: "Dead Hang on Pull-up Bar", duration: "3 min", tip: "Decompress spine and engage grip" },
      { name: "Cat-Cow & Thoracic Rotations", duration: "4 min", tip: "Mobilize thoracic spine" },
      { name: "Band Pull-aparts", duration: "3 min", tip: "Squeeze rhomboids and warm rear delts" }
    ],
    exercises: [
      { id: "pull-1", name: "Pull-ups / Inverted Bodyweight Rows", target: "Lats & Mid-Back", baseSets: 4, baseReps: 8, formTip: "Hollow-body posture, pull chest to bar, do not kick." },
      { id: "pull-2", name: "Bent-Over Dumbbell / Barbell Rows", target: "Rhomboids & Lats", baseSets: 4, baseReps: 10, formTip: "Spine neutral, pull to belly button, pause 1 sec at top." },
      { id: "pull-3", name: "Face Pulls with Band / Cable", target: "Rear Delts & Rotator Cuff", baseSets: 3, baseReps: 15, formTip: "Pull toward forehead, externally rotate thumbs back." },
      { id: "pull-4", name: "Single-Arm Dumbbell Row", target: "Lat Width & Unilateral Balance", baseSets: 3, baseReps: 10, formTip: "Square hips to floor, initiate with lat contract." },
      { id: "pull-5", name: "Incline / Standing Bicep Curls", target: "Biceps Brachii", baseSets: 3, baseReps: 12, formTip: "Zero swinging, full supination at the contraction." },
      { id: "pull-6", name: "Hammer Curls", target: "Brachialis & Forearms", baseSets: 3, baseReps: 12, formTip: "Neutral grip, crush handles to build grip endurance." }
    ],
    cooldown: [
      { name: "Lat Prayer Stretch", duration: "2 min", tip: "Sink chest toward floor on bench or box" },
      { name: "Thread the Needle", duration: "2 min", tip: "Rotate mid-spine and relax neck" },
      { name: "Forearm Flexor / Extensor Stretch", duration: "1 min", tip: "Gentle palm pull back" }
    ]
  },
  3: { // Wednesday
    name: "Legs — Quads, Hams, Glutes, Calves",
    shortName: "LEG DAY",
    target: "Quads, Hamstrings, Glutes, Calves",
    focus: "Lower Body Force Production",
    warmup: [
      { name: "World's Greatest Stretch", duration: "4 min", tip: "Open hips, groin, and thoracic spine" },
      { name: "90/90 Hip Flow", duration: "3 min", tip: "Internal & external hip rotation" },
      { name: "Bodyweight Squats with Pause", duration: "3 min", tip: "Open knees, push through whole foot" }
    ],
    exercises: [
      { id: "leg-1", name: "Barbell / Heavy Goblet Squats", target: "Quads & Glutes", baseSets: 4, baseReps: 10, formTip: "Hips below parallel, knees tracking toes, proud chest." },
      { id: "leg-2", name: "Romanian Deadlifts (RDL)", target: "Hamstrings & Glute-Ham Tie", baseSets: 4, baseReps: 10, formTip: "Hinge at hips, soft knees, push glutes to back wall." },
      { id: "leg-3", name: "Walking Dumbbell Lunges", target: "Quads & Stabilizers", baseSets: 3, baseReps: 12, formTip: "Vertical torso, back knee gently kisses the mat." },
      { id: "leg-4", name: "Bulgarian Split Squats", target: "Unilateral Quad & Glute", baseSets: 3, baseReps: 10, formTip: "Foot elevated, sink back into front hip." },
      { id: "leg-5", name: "Standing / Deficit Calf Raises", target: "Gastrocnemius & Soleus", baseSets: 4, baseReps: 15, formTip: "Full pause at stretch, explosion onto big toes." },
      { id: "leg-6", name: "Weighted Wall Sit", target: "Isometric Quad Endurance", baseSets: 3, baseReps: 45, formTip: "90-degree thigh angle, arms across chest, endure." }
    ],
    cooldown: [
      { name: "Couch Stretch (Quad & Hip Flexor)", duration: "2 min", tip: "Squeeze glute of back leg hard" },
      { name: "Seated Pike Hamstring Stretch", duration: "2 min", tip: "Reach with belly rather than forehead" },
      { name: "Figure-Four Glute Stretch", duration: "1 min", tip: "Relax breathing to drop heart rate" }
    ]
  },
  4: { // Thursday
    name: "Core + Cardio — Engine & Armor",
    shortName: "CORE + CARDIO",
    target: "Rectus Abdominis, Obliques, VO2 Max",
    focus: "Midsection Armor & 15-Min MetCon HIIT",
    warmup: [
      { name: "Jump Rope / High Knees", duration: "4 min", tip: "Gradually bring heart rate into Zone 2" },
      { name: "Inchworms to Plank", duration: "3 min", tip: "Warm core, shoulders, and hamstrings" },
      { name: "Bird-Dogs & Deadbugs", duration: "3 min", tip: "Lock cross-body stability" }
    ],
    exercises: [
      { id: "core-1", name: "Hanging Leg Raises / L-Sit Tucks", target: "Lower Abdominals", baseSets: 4, baseReps: 12, formTip: "Avoid swing, curl pelvis upward toward chest." },
      { id: "core-2", name: "Hardstyle Forearm Plank", target: "Deep Core & Transverse", baseSets: 3, baseReps: 60, formTip: "Squeeze glutes, dig toes and elbows into ground." },
      { id: "core-3", name: "Bicycle Crunches (Slow Tempo)", target: "Obliques & Rotational Core", baseSets: 3, baseReps: 20, formTip: "2-sec pause per side, shoulder blades off ground." },
      { id: "core-4", name: "15-Min HIIT: Burpees", target: "Anaerobic Engine", baseSets: 4, baseReps: 15, formTip: "Chest to floor, snap hips, vertical jump explosion." },
      { id: "core-5", name: "Mountain Climbers (Fast Cadence)", target: "Core & Cardiovascular", baseSets: 4, baseReps: 30, formTip: "Keep hips level, drive knees straight between arms." },
      { id: "core-6", name: "Tuck / Jump Squats", target: "Explosive Leg Power", baseSets: 4, baseReps: 15, formTip: "Soft silent landings, absorb force into quads." }
    ],
    cooldown: [
      { name: "Cobra to Child's Pose Flow", duration: "2 min", tip: "Decompress abdominal wall and lower spine" },
      { name: "Deep Belly Box Breathing (4-4-4-4)", duration: "3 min", tip: "Engage parasympathetic reset" }
    ]
  },
  5: { // Friday
    name: "Full Body Strength — Raw Power",
    shortName: "FULL BODY",
    target: "Posterior Chain, Push/Pull Compounds",
    focus: "Compound Synergy & Peak Load",
    warmup: [
      { name: "Kettlebell / Dumbbell Halos", duration: "3 min", tip: "Prepare shoulders in all planes" },
      { name: "Glute Bridges & Cossack Squats", duration: "4 min", tip: "Awaken glutes and adductors" },
      { name: "Empty Barbell Deadlift Walkthrough", duration: "3 min", tip: "Rehearse hip-hinge brace" }
    ],
    exercises: [
      { id: "fb-1", name: "Conventional / Trap Bar Deadlifts", target: "Entire Posterior Chain", baseSets: 4, baseReps: 6, formTip: "Pack lats, pull slack out of bar, drive earth away." },
      { id: "fb-2", name: "Push Press / Military Press", target: "Shoulders, Triceps, Core", baseSets: 4, baseReps: 8, formTip: "Dip knees 2 inches, drive overhead in one snap." },
      { id: "fb-3", name: "Pendlay / Barbell Chest-Supported Rows", target: "Upper Back & Lats", baseSets: 4, baseReps: 8, formTip: "Torso parallel to floor, strict pull from dead stop." },
      { id: "fb-4", name: "Front Squats / Zercher Squats", target: "Quads & Thoracic Erectors", baseSets: 3, baseReps: 8, formTip: "Elbows high, stay upright like a stone column." },
      { id: "fb-5", name: "Push-up to Renegade Row", target: "Chest, Lats & Anti-Rotation", baseSets: 3, baseReps: 10, formTip: "Feet wide for balance, hips cannot sway." },
      { id: "fb-6", name: "Farmer's Walk / Heavy Holds", target: "Grip, Traps & Core Bracing", baseSets: 3, baseReps: 45, formTip: "Walk tall, shoulders pinned down, short swift steps." }
    ],
    cooldown: [
      { name: "Lying Spinal Twist", duration: "2 min", tip: "Let gravity rotate spine naturally" },
      { name: "Pigeon Pose (Each side)", duration: "2 min", tip: "Deep release for piriformis and outer glute" },
      { name: "Seated Forward Fold", duration: "1 min", tip: "Breathe into posterior ribs" }
    ]
  },
  6: { // Saturday
    name: "Active Recovery + Mobility — Protect the Streak",
    shortName: "MOBILITY / RECOVERY",
    target: "Fascia, Joints, Nervous System Reset",
    focus: "Tissue Restoration & Streak Defense",
    warmup: [
      { name: "Gentle Joint Circles & Neck Rolls", duration: "5 min", tip: "Fluid movement through all joints" },
      { name: "Cat-Cow & Pelvic Tilts", duration: "5 min", tip: "Slow rhythmic spinal waves" }
    ],
    exercises: [
      { id: "rec-1", name: "Sun Salutation Vinyasa Flow", target: "Full Body Mobility", baseSets: 3, baseReps: 5, formTip: "Link breath with movement. Inhale reach, exhale fold." },
      { id: "rec-2", name: "Deep Squat (Malasana) Hold", target: "Ankles, Hips & Pelvic Floor", baseSets: 3, baseReps: 90, formTip: "Palms together, press knees outward with elbows." },
      { id: "rec-3", name: "Foam Roll: Quads, IT Band, Lats", target: "Myofascial Release", baseSets: 1, baseReps: 10, formTip: "Spend 2 min per muscle group, pause on tender spots." },
      { id: "rec-4", name: "Couch Stretch & Dragon Pose", target: "Psoas & Hip Flexors", baseSets: 2, baseReps: 60, formTip: "Sink hips low, tuck tailbone to release hip tension." },
      { id: "rec-5", name: "Shoulder CARs (Controlled Articular Rotations)", target: "Shoulder Glenohumeral Joint", baseSets: 2, baseReps: 6, formTip: "Make largest circle possible without moving torso." },
      { id: "rec-6", name: "Brisk Outdoor / Incline Walk", target: "Zone 1 Aerobic Flush", baseSets: 1, baseReps: 1200, formTip: "Nasal breathing only, swing arms naturally." }
    ],
    cooldown: [
      { name: "Legs Up the Wall (Viparita Karani)", duration: "5 min", tip: "Elevate legs to drain venous pooling and calm nervous system" }
    ]
  },
  0: { // Sunday (0 in JS Date.getDay())
    name: "Endurance Engine + Core Finisher",
    shortName: "ENDURANCE",
    target: "Cardiorespiratory Capacity, Mental Grit",
    focus: "30-40 Min Sustained Effort + Finisher",
    warmup: [
      { name: "Dynamic Leg Swings (Front/Back & Side)", duration: "3 min", tip: "Mobilize hips dynamically" },
      { name: "Ankle Alphabet & Calf Bounces", duration: "3 min", tip: "Prep Achilles tendons" },
      { name: "Jogging in Place with Butt Kicks", duration: "4 min", tip: "Gradual ramp into endurance gear" }
    ],
    exercises: [
      { id: "end-1", name: "Sustained Steady-State Run or Ruck / Jump Rope", target: "Aerobic Heart Base", baseSets: 1, baseReps: 2100, formTip: "Maintain steady rhythm for 35 min. Steady breathing, steady cadence." },
      { id: "end-2", name: "Hollow Body Rockers", target: "Anterior Core & Gymnastic Tension", baseSets: 3, baseReps: 20, formTip: "Lower back glued to floor, toes pointed, arms overhead." },
      { id: "end-3", name: "Russian Twists with Plate / Medicine Ball", target: "Obliques & Rotational Power", baseSets: 3, baseReps: 25, formTip: "Feet off floor, touch weight firmly on either side." },
      { id: "end-4", name: "Prone Swimmers / Back Extensions", target: "Spinal Erectors & Posterior Core", baseSets: 3, baseReps: 15, formTip: "Lift chest and thighs, alternate arm and leg fluttering." },
      { id: "end-5", name: "Side Plank with Hip Dips", target: "Quadratus Lumborum & Obliques", baseSets: 3, baseReps: 12, formTip: "Keep straight line from crown of head to ankle." },
      { id: "end-6", name: "Dead Hang Grip Challenge", target: "Grip Endurance & Shoulder Health", baseSets: 2, baseReps: 60, formTip: "Hold until forearms burn. Don't drop until timer beeps." }
    ],
    cooldown: [
      { name: "Standing Quad Pull", duration: "2 min", tip: "Tuck hips, pull heel close to glute" },
      { name: "Downward Facing Dog to Calf Pedal", duration: "2 min", tip: "Alternate pressing heels to floor" },
      { name: "Child's Pose with Side Reach", duration: "2 min", tip: "Reach hands 45 deg right then left" }
    ]
  }
};

/**
 * Test week overrides (Weeks 4, 8, 12)
 * Deload volume, test max push-ups, plank time, 5K time for Beat-Your-Best board!
 */
export const TEST_WEEK_TEMPLATES = {
  push: {
    titleSuffix: " [DELOAD & MAX PUSH-UP TEST]",
    specialExercise: { id: "test-push", name: "MAX PUSH-UPS TO FAILURE (Record on Board)", target: "Push Muscle Test", baseSets: 1, baseReps: 1, formTip: "Strict form, unbroken, chest touches 2-inch fist. Record your best!" }
  },
  core: {
    titleSuffix: " [DELOAD & MAX PLANK TEST]",
    specialExercise: { id: "test-plank", name: "MAX FOREARM PLANK TO FAILURE (Record on Board)", target: "Core Endurance Test", baseSets: 1, baseReps: 1, formTip: "Hips level, glutes squeezed. Clock starts on elbow drop. Record your best!" }
  },
  endurance: {
    titleSuffix: " [DELOAD & 5K TIME TRIAL TEST]",
    specialExercise: { id: "test-5k", name: "5K (3.1 MILES) TIME TRIAL (Record on Board)", target: "VO2 Max Endurance Test", baseSets: 1, baseReps: 1, formTip: "Run flat or on treadmill. Give 100% effort. Record your time!" }
  }
};

/**
 * Calculate scaled workout for any arc day (1 - 90)
 * Increases difficulty by ~10% (reps or sets) per week
 * Detects Deload/Test weeks on W4, W8, W12
 */
export function getWorkoutForDay(arcDay, dateObj = new Date()) {
  const safeDay = Math.max(1, Math.min(90, arcDay));
  const week = Math.ceil(safeDay / 7); // 1 to 13
  const isDeload = week === 4 || week === 8 || week === 12;

  // Determine weekday from dateObj
  const weekday = dateObj.getDay(); // 0 = Sun, 1 = Mon ...
  const baseTemplate = WEEKDAY_TEMPLATES[weekday] || WEEKDAY_TEMPLATES[1];

  // Progressive Overload multiplier: ~10% per week, except deload weeks which drop volume by 30%
  const overloadFactor = isDeload ? 0.75 : 1 + (week - 1) * 0.08;

  // Clone and scale exercises
  const scaledExercises = baseTemplate.exercises.map((ex) => {
    let scaledSets = ex.baseSets;
    let scaledReps = Math.round(ex.baseReps * overloadFactor);

    // Format reps string nicely (seconds or reps)
    let displayReps = `${scaledReps} reps`;
    if (ex.name.toLowerCase().includes("sit") || ex.name.toLowerCase().includes("plank") || ex.name.toLowerCase().includes("hang") || ex.name.toLowerCase().includes("hold")) {
      displayReps = `${Math.round(ex.baseReps * (isDeload ? 0.8 : 1 + (week - 1) * 0.06))}s hold`;
    } else if (ex.name.toLowerCase().includes("run") || ex.name.toLowerCase().includes("walk")) {
      const minutes = Math.round((ex.baseReps * (isDeload ? 0.75 : 1 + (week - 1) * 0.04)) / 60);
      displayReps = `${minutes} min`;
    }

    return {
      ...ex,
      sets: scaledSets,
      reps: scaledReps,
      displayReps,
      displaySets: `${scaledSets} SETS`
    };
  });

  // If Deload week, insert test exercise if appropriate
  let finalTitle = baseTemplate.name;
  if (isDeload) {
    if (weekday === 1) { // Monday push test
      finalTitle += " [TEST WEEK: MAX PUSH-UPS]";
      scaledExercises.unshift(TEST_WEEK_TEMPLATES.push.specialExercise);
    } else if (weekday === 4) { // Thursday plank test
      finalTitle += " [TEST WEEK: MAX PLANK]";
      scaledExercises.unshift(TEST_WEEK_TEMPLATES.core.specialExercise);
    } else if (weekday === 0) { // Sunday 5k test
      finalTitle += " [TEST WEEK: 5K TRIAL]";
      scaledExercises.unshift(TEST_WEEK_TEMPLATES.endurance.specialExercise);
    } else {
      finalTitle += " [DELOAD WEEK — RECOVERY FOCUS]";
    }
  }

  return {
    arcDay: safeDay,
    week,
    isDeload,
    weekday,
    title: finalTitle,
    shortName: baseTemplate.shortName,
    target: baseTemplate.target,
    focus: baseTemplate.focus,
    warmup: baseTemplate.warmup,
    exercises: scaledExercises,
    cooldown: baseTemplate.cooldown
  };
}
