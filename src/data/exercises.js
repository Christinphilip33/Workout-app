export const exercises = [
  // ─── PUSH ───────────────────────────────────────────────────────────────────
  {
    id: "bench-press",
    name: "Bench Press",
    category: "Push",
    muscleGroups: ["Chest", "Triceps", "Front Deltoids"],
    description:
      "A compound barbell movement performed lying on a bench. The bar is lowered to the chest and pressed back to full arm extension, making it the cornerstone of upper-body pushing strength.",
    tips: {
      1: "Keep your feet flat on the floor and maintain a natural arch in your lower back. Grip the bar just outside shoulder width and unrack with control.",
      2: "Focus on leg drive — push your feet into the floor as you press. This transfers force through your whole body and adds stability to the lift.",
      3: "Try a slight elbow tuck (around 45–75°) to protect your shoulder joints under heavier loads. Retract and depress your scapulae before every rep.",
      4: "Experiment with paused reps at the chest to eliminate the stretch-reflex and build raw starting strength. Board presses can help you attack specific sticking points.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "incline-bench-press",
    name: "Incline Bench Press",
    category: "Push",
    muscleGroups: ["Upper Chest", "Front Deltoids", "Triceps"],
    description:
      "Performed on a bench set to 30–45°, this variation shifts emphasis to the upper chest and front deltoids. Essential for a well-rounded chest development.",
    tips: {
      1: "Set the bench between 30° and 45° — too steep turns it into a shoulder press. Keep your shoulder blades pinched together throughout the movement.",
      2: "Lower the bar to the upper chest, not the clavicle. The bar path should travel in a slight diagonal.",
      3: "Control the eccentric (lowering) phase over 2–3 seconds to maximise upper chest tension and reduce injury risk.",
      4: "Use dumbbells on some sessions to address left-right strength imbalances and allow a more natural wrist rotation at the top.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    category: "Push",
    muscleGroups: ["Front Deltoids", "Lateral Deltoids", "Triceps", "Upper Traps"],
    description:
      "A standing or seated overhead press with a barbell or dumbbells. Builds powerful shoulders and improves total-body pressing stability.",
    tips: {
      1: "Start with the bar at collarbone height with elbows slightly in front of the bar. Press straight up, moving your head back slightly to clear the bar path.",
      2: "Brace your core tightly before each rep — overhead pressing with a loose core can strain the lumbar spine.",
      3: "The standing variation recruits more stabiliser muscles and core than seated. Incorporate it once your technique is solid.",
      4: "Use the push press (a slight leg drive) to overload above your strict overhead press max — great for building strength in the top range.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "push-ups",
    name: "Push-ups",
    category: "Push",
    muscleGroups: ["Chest", "Triceps", "Front Deltoids", "Core"],
    description:
      "A bodyweight staple that requires no equipment. Trains the chest, triceps and shoulders through a full range of motion while also demanding core stability.",
    tips: {
      1: "Keep your body in a straight line from head to heels. Hands slightly wider than shoulder width, fingers pointing forward.",
      2: "Squeeze your glutes and brace your abs throughout. Sagging hips shift load away from the target muscles.",
      3: "Slow down the descent to 3–4 seconds to increase time under tension and get more out of each rep.",
      4: "Progress to archer push-ups, ring push-ups, or weighted push-ups to continue overloading once bodyweight feels easy.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    category: "Push",
    muscleGroups: ["Triceps", "Lower Chest", "Front Deltoids"],
    description:
      "A bodyweight or weighted dip performed on parallel bars. Excellent for adding mass to the triceps and lower chest.",
    tips: {
      1: "Keep your torso upright (more vertical = more triceps focus; leaning forward = more chest). Lower until upper arms are parallel to the floor.",
      2: "Avoid locking out aggressively at the top — keep a slight bend to maintain tricep tension.",
      3: "Add a weight belt or hold a dumbbell between your feet once bodyweight dips become too easy.",
      4: "If you feel shoulder impingement, try ring dips which allow your wrists to rotate naturally through the movement.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "lateral-raises",
    name: "Lateral Raises",
    category: "Push",
    muscleGroups: ["Lateral Deltoids", "Supraspinatus"],
    description:
      "An isolation exercise using dumbbells or cables to directly target the lateral head of the deltoid — the muscle responsible for shoulder width.",
    tips: {
      1: "Raise the dumbbells out to the side until they reach shoulder height. A very slight forward lean helps target the lateral delt more precisely.",
      2: "Lead with your elbows, not your wrists. Think of pouring a jug of water as you raise — this keeps the lateral delt engaged.",
      3: "Use lighter weight and higher reps (12–20). Lateral raises are an isolation movement — ego lifting here leads to rotator cuff strain.",
      4: "Cable lateral raises provide constant tension throughout the full range, making them superior to dumbbells for hypertrophy.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: "Push",
    muscleGroups: ["Triceps"],
    description:
      "A cable isolation exercise targeting all three heads of the triceps. A must-have finishing move for arm development.",
    tips: {
      1: "Stand close to the cable stack. Keep elbows pinned at your sides throughout — if they flare, the weight is too heavy.",
      2: "Fully extend your arms at the bottom and squeeze the triceps hard for a half-second before releasing.",
      3: "Try a rope attachment instead of a bar — it allows the hands to pronate at the bottom, improving the contraction.",
      4: "Single-arm pushdowns help identify and fix left-right strength imbalances in the triceps.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },

  // ─── PULL ───────────────────────────────────────────────────────────────────
  {
    id: "pull-ups",
    name: "Pull-ups",
    category: "Pull",
    muscleGroups: ["Lats", "Biceps", "Rear Deltoids", "Rhomboids"],
    description:
      "A fundamental bodyweight pulling movement. The pull-up taxes the entire back musculature and biceps, and is one of the best upper-body compound exercises.",
    tips: {
      1: "Dead hang first, then retract your shoulder blades before pulling. Lead with your chest toward the bar, not your chin.",
      2: "Use a full range of motion — all the way down to a dead hang and all the way up until your chin clears the bar.",
      3: "Add a slow eccentric (5-second lowering) to build strength when you can't yet do many reps. This builds the pulling muscles rapidly.",
      4: "Weighted pull-ups with a belt unlock significant strength and hypertrophy gains once bodyweight reps exceed 10–12 per set.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    category: "Pull",
    muscleGroups: ["Lats", "Rhomboids", "Rear Deltoids", "Biceps", "Erector Spinae"],
    description:
      "A heavy compound row where the torso is hinged forward and the barbell is pulled to the lower chest or navel. Builds a thick, powerful back.",
    tips: {
      1: "Hinge at the hips to roughly 45°, keep your back flat and chest up. Pull the bar toward your lower chest/upper abdomen.",
      2: "Row the bar in a straight vertical line. Imagine you're trying to tuck your elbows into your back pockets.",
      3: "Control the lowering phase — a slow eccentric extends time under tension for the lats and rhomboids.",
      4: "Experiment with grip width and angle (overhand vs underhand) to shift emphasis between lats, rhomboids and biceps.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Pull",
    muscleGroups: ["Lats", "Biceps", "Rear Deltoids"],
    description:
      "A cable machine exercise that mimics the pull-up pattern. Great for building lat width and working toward your first pull-up.",
    tips: {
      1: "Grip the bar slightly wider than shoulder width. Lean back slightly and pull the bar to your upper chest, not behind your neck.",
      2: "Initiate the pull by depressing your shoulder blades, not by flexing your biceps. Think 'elbows to hips'.",
      3: "A slow, controlled return to the start position stretches the lats under load — this is where a lot of growth stimulus comes from.",
      4: "Single-arm cable pulldowns allow full lat stretch and contraction without the opposite side compensating.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    category: "Pull",
    muscleGroups: ["Biceps", "Brachialis", "Brachioradialis"],
    description:
      "The classic arm-builder. Curling a barbell or dumbbells trains the biceps brachii and supporting elbow flexors.",
    tips: {
      1: "Keep your upper arms still at your sides throughout. If your elbows drift forward at the top, reduce the weight.",
      2: "Supinate your wrist (turn your palm up) as you curl — this maximises bicep recruitment.",
      3: "Perform incline dumbbell curls to place the bicep in a stretched position at the start — a highly effective stimulus for hypertrophy.",
      4: "Vary your grip: narrow grip hits the long head (outer peak), wide grip hits the short head (inner thickness).",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "face-pull",
    name: "Face Pull",
    category: "Pull",
    muscleGroups: ["Rear Deltoids", "Rhomboids", "External Rotators", "Upper Traps"],
    description:
      "A cable exercise pulling toward the face with a rope attachment. Critically important for shoulder health and rear delt development.",
    tips: {
      1: "Set the cable at head height. Pull the rope toward your forehead, flaring your elbows out wide. End position looks like a double-bicep pose.",
      2: "Focus on external rotation at the top — your thumbs should point back behind you. This is where the rotator cuff benefit comes from.",
      3: "High reps (15–25) work well here. This is a shoulder health exercise as much as a strength exercise.",
      4: "Include face pulls in every upper-body session as prehab. The rear delt and external rotators are chronically undertrained in most programmes.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    category: "Pull",
    muscleGroups: ["Rhomboids", "Lats", "Biceps", "Rear Deltoids"],
    description:
      "A horizontal cable row performed seated with a close or wide grip. Builds mid-back thickness and scapular retraction strength.",
    tips: {
      1: "Sit tall with a slight forward lean. Pull the handle to your navel, squeezing your shoulder blades together at the end of each rep.",
      2: "Avoid using momentum — don't rock your torso back on each rep. Isolation is the goal.",
      3: "Pause at the peak contraction for 1–2 seconds to maximise rhomboid and mid-trap activation.",
      4: "Alternate between close-grip (more lats) and wide-grip (more rear delt and rhomboid) variations across training blocks.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    category: "Pull",
    muscleGroups: ["Brachialis", "Brachioradialis", "Biceps"],
    description:
      "A neutral-grip curl that strongly targets the brachialis — the muscle under the bicep that pushes the bicep up and adds overall arm thickness.",
    tips: {
      1: "Hold the dumbbells with a neutral grip (palms facing each other) and curl without rotating the wrist. Keep elbows at your sides.",
      2: "The brachialis responds well to moderate-to-heavy loads and lower rep ranges (6–10) compared to the bicep.",
      3: "Cross-body hammer curls (curling across the torso) shift more load onto the brachioradialis forearm muscle.",
      4: "Incorporate rope hammer curls on a cable for constant tension throughout the full range of motion.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },

  // ─── LEGS ───────────────────────────────────────────────────────────────────
  {
    id: "squat",
    name: "Squat",
    category: "Legs",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Erector Spinae", "Core"],
    description:
      "The king of lower-body exercises. A barbell back squat (or goblet/front squat variation) trains the entire lower body and demands full-body stability.",
    tips: {
      1: "Stand with feet shoulder-width apart, toes slightly out. Break at the hips and knees simultaneously, keeping your chest up and knees tracking over your toes.",
      2: "Squat to at least parallel (thigh parallel to floor). Depth is critical for full glute and quad activation.",
      3: "Brace your core by taking a big breath and creating intra-abdominal pressure (Valsalva) before each rep. Hold it through the sticking point.",
      4: "Low-bar squatting allows more weight but requires greater hip flexibility. High-bar is more upright and quad-dominant — choose based on your goals.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: "Legs",
    muscleGroups: ["Hamstrings", "Glutes", "Erector Spinae", "Traps", "Lats", "Core"],
    description:
      "The most total-body compound lift. Picking a loaded barbell off the floor recruits nearly every major muscle group and is unrivalled for building raw strength.",
    tips: {
      1: "Set up with the bar over mid-foot, hip-width stance. Hinge down, grip just outside your legs, and push the floor away rather than thinking of it as a 'pull'.",
      2: "Keep the bar in contact with your legs on the way up. The moment the bar drifts forward, your lower back takes over unsafely.",
      3: "Lock out by squeezing your glutes at the top — do not hyperextend the lower back.",
      4: "Use a mixed grip or hook grip for heavier sets to prevent grip from being the limiting factor. Straps are acceptable on top sets.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "Legs",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
    description:
      "A machine-based pushing movement that isolates the lower body without spinal loading. Excellent for volume work or when the lower back needs recovery.",
    tips: {
      1: "Place your feet at shoulder width, mid-plate. Lower the platform until your knees are around 90° — don't let your lower back round off the seat.",
      2: "High foot placement targets glutes and hamstrings more; low foot placement puts more load through the quads.",
      3: "Avoid locking out your knees at the top — maintain tension in the legs throughout each rep.",
      4: "Use leg press for high-volume drop sets (3–4 drops, 10–15 reps each) to chase a deep quad pump without spinal fatigue.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "lunges",
    name: "Lunges",
    category: "Legs",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    description:
      "A unilateral leg exercise that trains each leg independently, correcting imbalances and building functional strength and balance.",
    tips: {
      1: "Step forward into a long stride and lower your back knee toward the floor. Keep your front shin as vertical as possible.",
      2: "Stay tall through the torso — leaning forward excessively shifts load to the hip flexors.",
      3: "Walking lunges (alternating steps forward) add a balance and coordination challenge and work well for conditioning.",
      4: "Add a Bulgarian split squat (rear foot elevated) to dramatically increase the range of motion and glute stretch.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Legs",
    muscleGroups: ["Hamstrings", "Glutes", "Erector Spinae"],
    description:
      "A hip-hinge movement with a slight knee bend that isolates the hamstrings through a deep stretch. One of the best hamstring exercises available.",
    tips: {
      1: "Hold the bar at hip height, soft knees, and hinge by pushing your hips back. Lower the bar along your legs until you feel a deep hamstring stretch.",
      2: "Keep your back flat and chest tall the entire way down. Rounding the lower back under load is dangerous here.",
      3: "The stretch at the bottom is where the most hypertrophic stimulus occurs — don't rush through it.",
      4: "Single-leg Romanian deadlifts (with a dumbbell) are excellent for improving hip stability and addressing bilateral imbalances.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    category: "Legs",
    muscleGroups: ["Hamstrings"],
    description:
      "A machine isolation exercise for the hamstrings. Best used to complement compound movements like deadlifts and squats.",
    tips: {
      1: "Lie face down, hook your ankles under the pad, and curl toward your glutes. Avoid lifting your hips off the bench.",
      2: "Pause at the top and squeeze the hamstrings for 1–2 seconds before lowering.",
      3: "Slow the eccentric (lowering) phase to 3 seconds — the hamstring is most prone to injury during rapid eccentric movements.",
      4: "The seated leg curl places the hamstring under a greater stretch than the lying version and may produce superior hypertrophy.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    category: "Legs",
    muscleGroups: ["Gastrocnemius", "Soleus"],
    description:
      "Raises performed standing or seated to isolate the calf muscles. The calves are slow-twitch dominant and respond best to high volume.",
    tips: {
      1: "Use the full range of motion — let your heel drop as low as possible (stretch) before rising fully onto your toes (contraction).",
      2: "Pause at the top for 2 seconds. Bouncing through reps short-circuits the calf contraction.",
      3: "Seated calf raises (knee bent) target the soleus more; standing raises target the gastrocnemius more. Train both.",
      4: "Calves respond well to high volume (4–6 sets of 15–20) multiple times per week due to their slow-twitch fibre composition.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    category: "Legs",
    muscleGroups: ["Glutes", "Hamstrings", "Hip Flexors"],
    description:
      "A barbell or bodyweight movement with the upper back on a bench. The premier glute isolation exercise, driving hip extension through a full range.",
    tips: {
      1: "Rest your upper back on a bench at mid-scapula. Drive through your heels and thrust your hips up until your body is flat. Squeeze your glutes hard at the top.",
      2: "Chin should be tucked — looking straight ahead prevents hyperextension of the lumbar spine at lockout.",
      3: "Use a barbell pad or folded mat under the barbell for comfort. This allows you to load heavier without discomfort.",
      4: "Pause hip thrusts (2-second hold at top) eliminate momentum and dramatically increase glute activation per rep.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    category: "Legs",
    muscleGroups: ["Quadriceps"],
    description:
      "A machine isolation movement that trains the quadriceps through knee extension. Best used as a finisher after compound leg work.",
    tips: {
      1: "Adjust the seat so your knee aligns with the machine's pivot point. Extend fully and hold briefly at the top.",
      2: "Avoid swinging or using momentum — control both the lifting and lowering phase.",
      3: "High reps (15–20) work well here as an accessory finisher. The quads respond to the pump.",
      4: "Slow the eccentric phase and try single-leg extensions to isolate and target each quad independently.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },

  // ─── CORE ───────────────────────────────────────────────────────────────────
  {
    id: "plank",
    name: "Plank",
    category: "Core",
    muscleGroups: ["Transverse Abdominis", "Rectus Abdominis", "Obliques", "Glutes"],
    description:
      "An isometric core exercise that trains anti-extension stability — the ability to resist the spine being pulled into extension. The foundation of all core training.",
    tips: {
      1: "Elbows under shoulders, body in a straight line. Squeeze your quads, glutes, and abs simultaneously. Don't let your hips sag or pike.",
      2: "Focus on quality over duration. A 20-second plank with perfect form is better than a 60-second plank with hips sagging.",
      3: "Progress to RKC planks: actively pull your elbows toward your toes and your toes toward your elbows. This dramatically increases core activation.",
      4: "Move to plank variations (weighted plank, plank with shoulder taps, or ab wheel rollouts) once you can hold 60 seconds easily.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "crunches",
    name: "Crunches",
    category: "Core",
    muscleGroups: ["Rectus Abdominis"],
    description:
      "A short-range flexion exercise targeting the rectus abdominis. Best used as an accessory movement alongside compound core work.",
    tips: {
      1: "Lie on your back with knees bent. Lift your shoulder blades off the floor, contracting the abs at the top. Your lower back stays on the floor.",
      2: "Don't pull on your neck — cross your arms on your chest or place fingers lightly behind your head.",
      3: "Focus on the contraction, not the range of motion. A short crunch with a strong squeeze beats a large uncontrolled movement.",
      4: "Cable crunches (kneeling, pulling a rope attachment down) allow progressive overload, which bodyweight crunches cannot provide.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    category: "Core",
    muscleGroups: ["Obliques", "Rectus Abdominis", "Hip Flexors"],
    description:
      "A rotational core exercise performed seated with feet raised, rotating a weight side to side. Builds rotational strength and oblique definition.",
    tips: {
      1: "Sit at a 45° angle, feet off the floor, and rotate your torso fully side to side. Hold a weight plate, dumbbell, or medicine ball.",
      2: "The rotation should come from the torso, not just the arms. Think about your chest turning toward each side.",
      3: "Keep the movement controlled — avoid slamming the weight to the floor on each side.",
      4: "Add weight progressively. Once you can do 20+ reps easily, increase the load rather than reps.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "Core",
    muscleGroups: ["Rectus Abdominis", "Hip Flexors", "Obliques"],
    description:
      "Hanging from a pull-up bar and raising the legs, this exercise trains the lower rectus abdominis and hip flexors under significant load.",
    tips: {
      1: "Hang from a pull-up bar with a full dead hang. Raise your legs until they are parallel to the floor (bent knee) or higher (straight leg).",
      2: "Avoid swinging — control the lowering phase over 2–3 seconds.",
      3: "Posterior pelvic tilt at the top (curling the tailbone toward the ceiling) maximises lower ab contraction.",
      4: "Progress from bent-knee raises → straight-leg raises → toes-to-bar → weighted leg raises for continuous overload.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "Core",
    muscleGroups: ["Rectus Abdominis", "Transverse Abdominis", "Obliques", "Lats"],
    description:
      "Rolling out on an ab wheel stretches the core to its full length while resisting extension — one of the most demanding core exercises for advanced athletes.",
    tips: {
      1: "Start from the knees. Keep your hips in line with your body and roll out as far as you can without your lower back arching.",
      2: "Pull back using your abs and lats — think of performing a straight-arm lat pulldown to return.",
      3: "Never let your lower back hyperextend. The moment you lose tension, stop and pull back.",
      4: "Standing rollouts (from feet) are the advanced version. Master kneeling rollouts first over several weeks.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    category: "Core",
    muscleGroups: ["Transverse Abdominis", "Rectus Abdominis", "Hip Flexors"],
    description:
      "A controlled supine exercise where opposite arm and leg are lowered simultaneously while the lower back is kept pressed into the floor. Superb for anti-extension core control.",
    tips: {
      1: "Lie on your back, arms pointing to the ceiling, hips and knees at 90°. Lower the opposite arm and leg toward the floor while exhaling fully.",
      2: "Press your lower back firmly into the floor throughout. The moment it lifts, you've lost the core brace.",
      3: "Move slowly and with full control — this is a technique-first exercise, not a speed drill.",
      4: "Add a resistance band or cable to the hands/feet for external resistance once bodyweight becomes easy.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "side-plank",
    name: "Side Plank",
    category: "Core",
    muscleGroups: ["Obliques", "Glutes", "Transverse Abdominis"],
    description:
      "An isometric lateral stabilisation exercise. Trains anti-lateral-flexion — resistance to the spine being pushed sideways. Essential for a balanced core.",
    tips: {
      1: "Stack your feet or stagger them. Prop on your elbow (directly under your shoulder) and keep your hips elevated and body straight.",
      2: "Push the floor away with your support elbow to stop your shoulder collapsing.",
      3: "Add hip dips (lowering and raising the hip) for a dynamic challenge once static holds are easy.",
      4: "Side plank with rotation (threading the top arm under your body) adds a thoracic rotation component.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },

  // ─── CARDIO ─────────────────────────────────────────────────────────────────
  {
    id: "running",
    name: "Running",
    category: "Cardio",
    muscleGroups: ["Quadriceps", "Hamstrings", "Calves", "Glutes", "Core"],
    description:
      "The most accessible form of cardiovascular training. Builds aerobic base, burns calories, and improves heart health.",
    tips: {
      1: "Land with your foot under your hips, not in front — overstriding is the leading cause of running injuries. Aim for a cadence of around 170–180 steps per minute.",
      2: "Build mileage gradually — no more than 10% increase in weekly distance per week to prevent overuse injuries.",
      3: "Add one tempo run per week (comfortably hard, 20–40 min) to push your lactate threshold and improve your pace.",
      4: "Incorporate interval training (e.g. 8 × 400m at 5K pace) to improve VO₂ max and running economy.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "cycling",
    name: "Cycling",
    category: "Cardio",
    muscleGroups: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
    description:
      "Low-impact cardiovascular exercise on a bike (stationary or outdoor). Easier on the joints than running while still delivering excellent aerobic conditioning.",
    tips: {
      1: "Set your seat height so there's a slight bend (25–30°) in the knee at the bottom of the pedal stroke. A too-low seat strains the knees.",
      2: "Aim for a cadence of 80–100 RPM. Grinding a high gear at low cadence puts more stress on the knee joint.",
      3: "Use the 80/20 rule: 80% of your cycling at low-moderate intensity, 20% at high intensity for optimal aerobic adaptation.",
      4: "Add sprint intervals (30 seconds max effort, 90 seconds recovery × 8) for a time-efficient VO₂ max stimulus.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "jump-rope",
    name: "Jump Rope",
    category: "Cardio",
    muscleGroups: ["Calves", "Shoulders", "Core", "Quadriceps"],
    description:
      "One of the most calorie-dense cardio options per minute. Improves coordination, footwork, and cardiovascular fitness simultaneously.",
    tips: {
      1: "Jump on the balls of your feet with knees slightly bent. Keep jumps small — just enough clearance for the rope.",
      2: "Keep elbows close to your sides and let the wrists rotate the rope, not your whole arms.",
      3: "Work in intervals: 30–60 seconds of skipping, 30 seconds rest. Build continuous duration over weeks.",
      4: "Learn double-unders (rope passes twice per jump) for a dramatic increase in intensity and calorie burn.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "rowing-machine",
    name: "Rowing Machine",
    category: "Cardio",
    muscleGroups: ["Back", "Legs", "Core", "Shoulders", "Biceps"],
    description:
      "Full-body cardiovascular exercise on an ergometer. Unique among cardio modalities in that it loads both the upper and lower body equally.",
    tips: {
      1: "Drive with the legs first, then lean back slightly, then pull the handle to your lower chest. The sequence is legs → body → arms on the way out, reversed on the way back.",
      2: "About 60% of the power in rowing should come from the legs. Don't row with only your arms and back.",
      3: "A damper setting of 3–5 is ideal for most people — higher is not harder, it's just slower.",
      4: "For conditioning, try the classic 500m sprint intervals: 4–6 × 500m with 2 minutes rest, targeting sub-2:00 split.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "stair-climber",
    name: "Stair Climber",
    category: "Cardio",
    muscleGroups: ["Glutes", "Quadriceps", "Hamstrings", "Calves"],
    description:
      "Stepping machine simulating stair climbing. Delivers a high caloric burn with a strong lower-body emphasis and minimal impact.",
    tips: {
      1: "Stand upright and avoid leaning heavily on the handrails — that reduces the workload significantly.",
      2: "Use a full step depth to engage the glutes properly. Short, choppy steps shift load predominantly to the quads.",
      3: "Try lateral step-ups (stepping sideways) to target the abductors and glutes from a different angle.",
      4: "High-intensity stair intervals (1 minute hard / 1 minute easy × 10) are extremely effective for glute development and calorie burning.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
  {
    id: "battle-ropes",
    name: "Battle Ropes",
    category: "Cardio",
    muscleGroups: ["Shoulders", "Core", "Arms", "Back"],
    description:
      "Heavy ropes used in waves, slams, or circles to deliver intense full-body conditioning. Excellent for upper-body cardiovascular work.",
    tips: {
      1: "Stand in an athletic stance, slight hip hinge. Alternate arm waves, keeping your core braced throughout.",
      2: "Focus on smooth, powerful waves that travel all the way to the anchor. Small flicks at the hands mean you've lost power.",
      3: "Work in short bursts (20–30 seconds) at maximum intensity followed by rest. Battle ropes are a power endurance tool.",
      4: "Try double-arm slams (raise both ropes overhead and slam down) for a total-body explosive conditioning drill.",
    },
    globalFormCues: "Maintain core tension and control the eccentric phase.",
    isCustom: false,
  },
]

export const CATEGORIES = ["Push", "Pull", "Legs", "Core", "Cardio"]

export const ALL_MUSCLE_GROUPS = [
  ...new Set(exercises.flatMap((e) => e.muscleGroups)),
].sort()
