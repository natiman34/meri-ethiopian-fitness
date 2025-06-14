import { Exercise, SetType } from '../types/content';
import { getExerciseImage } from './imageAssets';

export const exercises: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    description: 'A compound exercise for chest, shoulders, and triceps.',
    image: getExerciseImage('benchPress', 'image'),
    gifUrl: "https://i.pinimg.com/originals/25/de/3f/25de3f5a1a9253976220109a0ef2dfff.gif", // Pinterest GIF link
    videoUrl: getExerciseImage('benchPress', 'video'),
    steps: [
      'Lie on a flat bench, grasp barbell with overhand grip slightly wider than shoulder-width.',
      'Lower barbell slowly to mid-chest.',
      'Push barbell back up to starting position.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 8,
        restTime: 60,
        notes: 'Use lighter weight to warm up'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 8
      },
      {
        setNumber: 4,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 90,
        rpe: 9
      }
    ],
    equipment: ['barbell', 'bench'],
    targetMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep your feet flat on the floor',
      'Maintain a slight arch in your lower back',
      'Keep your wrists straight and elbows at about 45 degrees from your body'
    ],
    tips: [
      'Focus on controlled movement',
      'Breathe out when pushing the weight up',
      'Keep shoulders back and down throughout the movement'
    ],
    commonMistakes: [
      'Bouncing the bar off the chest',
      'Lifting hips off the bench',
      'Flaring elbows too wide'
    ],
    variations: [
      'Close-grip bench press',
      'Wide-grip bench press',
      'Dumbbell bench press'
    ],
    estimatedTime: 12,
    caloriesBurn: 80,
    muscleGroup: 'chest'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    description: 'Targets the upper chest muscles and shoulders.',
    image: getExerciseImage('inclineDumbbellPress', 'image'),
    gifUrl: getExerciseImage('inclineDumbbellPress', 'gif'),
    videoUrl: getExerciseImage('inclineDumbbellPress', 'video'),
    steps: [
      'Set an adjustable bench to a 30-45 degree incline.',
      'Sit with your back against the bench, holding a dumbbell in each hand at shoulder level.',
      'Press the dumbbells upward until your arms are extended.',
      'Lower the dumbbells back to shoulder level with control.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 8,
        restTime: 60,
        notes: 'Use lighter weight to warm up'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['dumbbells', 'incline bench'],
    targetMuscles: ['upper chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 10,
    caloriesBurn: 70,
    muscleGroup: 'chest'
  },
  {
    id: 'shoulder-press-db-bb',
    name: 'Shoulder Press (Dumbbell or Barbell)',
    description: 'A compound exercise that targets the deltoid muscles.',
    image: getExerciseImage('shoulderPress', 'image'),
    gifUrl: getExerciseImage('shoulderPress', 'gif'),
    videoUrl: getExerciseImage('shoulderPress', 'video'),
    steps: [
      'Sit on a bench with back support or stand with feet shoulder-width apart.',
      'Hold dumbbells at shoulder height with palms facing forward.',
      'Press the weights upward until arms are fully extended overhead.',
      'Lower the weights back to shoulder level with control.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 8,
        restTime: 60,
        notes: 'Use lighter weight to warm up'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['dumbbells', 'barbell'],
    targetMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'upper chest'],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 10,
    caloriesBurn: 65,
    muscleGroup: 'shoulders'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    description: 'An isolation exercise that targets the lateral deltoids.',
    image: getExerciseImage('lateralRaises', 'image'),
    gifUrl: getExerciseImage('lateralRaises', 'gif'),
    videoUrl: getExerciseImage('lateralRaises', 'video'),
    steps: [
      'Stand with feet shoulder-width apart, holding dumbbells at your sides.',
      'Keep a slight bend in your elbows and raise the dumbbells out to the sides.',
      'Lift until arms are parallel to the floor.',
      'Lower the weights back down with control.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 10,
        restTime: 60,
        notes: 'Use lighter weight to warm up'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['dumbbells'],
    targetMuscles: ['lateral deltoids'],
    secondaryMuscles: ['trapezius'],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 8,
    caloriesBurn: 50,
    muscleGroup: 'shoulders'
  },
  {
    id: 'triceps-dips',
    name: 'Triceps Dips',
    description: 'A compound exercise that primarily targets the triceps.',
    image: getExerciseImage('tricepsDips', 'image'),
    gifUrl: getExerciseImage('tricepsDips', 'gif'),
    videoUrl: getExerciseImage('tricepsDips', 'video'),
    steps: [
      'Position yourself on parallel bars with arms straight and shoulders over hands.',
      'Lower your body by bending your elbows until they reach a 90-degree angle.',
      'Push yourself back up to the starting position by extending your elbows.',
      'Keep your elbows close to your body throughout the movement.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 6,
        restTime: 60,
        notes: 'Use assistance if needed'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['parallel bars', 'dip station'],
    targetMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 10,
    caloriesBurn: 70,
    muscleGroup: 'arms'
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    description: 'An isolation exercise that targets the triceps muscles.',
    image: getExerciseImage('skullCrushers', 'image'),
    gifUrl: getExerciseImage('skullCrushers', 'gif'),
    videoUrl: getExerciseImage('skullCrushers', 'video'),
    steps: [
      'Lie on a flat bench holding an EZ bar or dumbbells with arms extended above chest.',
      'Keeping upper arms stationary, bend elbows to lower the weight toward your forehead.',
      'Extend your elbows to return to the starting position.',
      'Keep movements slow and controlled.'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 8,
        restTime: 60,
        notes: 'Use lighter weight to warm up'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['EZ bar', 'dumbbells', 'bench'],
    targetMuscles: ['triceps'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 10,
    caloriesBurn: 60,
    muscleGroup: 'arms'
  },
  {
    id: 'light-jogging-rowing',
    name: 'Light Jogging or Rowing',
    description: 'Low-intensity cardiovascular activity for warm-up or active recovery.',
    image: getExerciseImage('lightJoggingOrRowing', 'image'),
    gifUrl: getExerciseImage('lightJoggingOrRowing', 'gif'),
    videoUrl: getExerciseImage('lightJoggingOrRowing', 'video'),
    steps: [
      'For jogging: find an open space or treadmill, maintain a light pace.',
      'For rowing: set resistance, focus on proper form (legs, core, arms).'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'cardio' as SetType,
        reps: 15, // minutes
        restTime: 0,
        notes: 'Maintain a conversational pace'
      }
    ],
    equipment: ['treadmill', 'rowing machine', 'none'],
    targetMuscles: ['heart'],
    secondaryMuscles: ['legs', 'core', 'arms'],
    difficulty: 'intermediate',
    category: 'cardio',
    estimatedTime: 15,
    caloriesBurn: 100,
    muscleGroup: 'full-body'
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    image: getExerciseImage('pushUp', 'image'),
    gifUrl: getExerciseImage('pushUp', 'gif'),
    videoUrl: getExerciseImage('pushUp', 'video'),
    steps: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until your chest nearly touches the floor',
      'Push back up to the starting position',
      'Keep your core tight throughout the movement'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 5,
        restTime: 60,
        notes: 'Focus on form and control'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    secondaryMuscles: ['core', 'forearms'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep your body in a straight line from head to heels',
      'Breathe out as you push up',
      'Keep your elbows close to your body',
      'Don\'t let your hips sag or rise'
    ],
    tips: [
      'Start with knee push-ups if regular push-ups are too difficult',
      'Focus on controlled movement rather than speed',
      'Keep your neck neutral throughout the exercise'
    ],
    commonMistakes: [
      'Letting hips sag or rise',
      'Not going low enough',
      'Flaring elbows too wide',
      'Rushing through the movement'
    ],
    variations: [
      'Incline Push-Up',
      'Decline Push-Up',
      'Diamond Push-Up',
      'Wide Push-Up',
      'Pike Push-Up'
    ],
    estimatedTime: 5,
    caloriesBurn: 8,
    muscleGroup: 'chest'
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    description: 'A fundamental lower body exercise that targets the quadriceps, glutes, and hamstrings.',
    image: getExerciseImage('squat', 'image'),
    gifUrl: getExerciseImage('squat', 'gif'),
    videoUrl: getExerciseImage('squat', 'video'),
    steps: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees in line with toes',
      'Return to standing position'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 8,
        restTime: 60,
        notes: 'Focus on depth and form'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'calves'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep your weight in your heels',
      'Push your knees out in line with your toes',
      'Keep your chest up throughout the movement',
      'Go as low as you can while maintaining good form'
    ],
    tips: [
      'Practice the movement without weight first',
      'Focus on pushing through your heels',
      'Keep your core engaged throughout'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Not going low enough',
      'Rounding the back',
      'Lifting heels off the ground'
    ],
    variations: [
      'Jump Squat',
      'Single-Leg Squat',
      'Sumo Squat',
      'Pistol Squat',
      'Wall Sit'
    ],
    estimatedTime: 6,
    caloriesBurn: 10,
    muscleGroup: 'legs'
  },
  {
    id: 'plank',
    name: 'Plank',
    description: 'An isometric core exercise that strengthens the entire core and improves stability.',
    image: getExerciseImage('plank', 'image'),
    gifUrl: getExerciseImage('plank', 'gif'),
    videoUrl: getExerciseImage('plank', 'video'),
    steps: [
      'Start in a forearm plank position',
      'Keep your body in a straight line',
      'Engage your core muscles',
      'Hold the position for the specified time'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 60,
        rpe: 6
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 45, // seconds
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 60,
        rpe: 7
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['core', 'abs', 'obliques'],
    secondaryMuscles: ['shoulders', 'glutes'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep your body in a straight line from head to heels',
      'Engage your core muscles throughout',
      'Don\'t let your hips sag or rise',
      'Breathe normally throughout the hold'
    ],
    tips: [
      'Start with shorter holds and gradually increase time',
      'Focus on maintaining proper form over duration',
      'Keep your neck neutral'
    ],
    commonMistakes: [
      'Letting hips sag',
      'Raising hips too high',
      'Holding breath',
      'Not engaging core properly'
    ],
    variations: [
      'Side Plank',
      'Plank with Leg Lift',
      'Plank with Arm Lift',
      'Mountain Climber Plank',
      'Plank Jacks'
    ],
    estimatedTime: 4,
    caloriesBurn: 6,
    muscleGroup: 'abs'
  },
  {
    id: 'burpee',
    name: 'Burpee',
    description: 'A full-body exercise that combines a squat, push-up, and jump for maximum calorie burn.',
    image: getExerciseImage('burpee', 'image'),
    gifUrl: getExerciseImage('burpee', 'gif'),
    videoUrl: getExerciseImage('burpee', 'video'),
    steps: [
      'Start in a standing position',
      'Drop into a squat position and place hands on the ground',
      'Kick feet back into a plank position',
      'Perform a push-up',
      'Jump feet back to squat position',
      'Jump up with arms overhead'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 3,
        restTime: 60,
        notes: 'Focus on form and control'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 90,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 90,
        rpe: 9
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['chest', 'shoulders', 'legs', 'core'],
    difficulty: 'intermediate',
    category: 'cardio',
    instructions: [
      'Keep your core engaged throughout the movement',
      'Land softly when jumping',
      'Maintain proper form during the push-up',
      'Breathe rhythmically throughout'
    ],
    tips: [
      'Start slow and focus on form',
      'Gradually increase speed and intensity',
      'Modify by removing the push-up if needed'
    ],
    commonMistakes: [
      'Rushing through the movement',
      'Poor landing form',
      'Not engaging core properly',
      'Incomplete push-up'
    ],
    variations: [
      'Half Burpee (no push-up)',
      'Burpee with Pull-up',
      'Burpee with Box Jump',
      'Burpee with Mountain Climber'
    ],
    estimatedTime: 8,
    caloriesBurn: 15,
    muscleGroup: 'full-body'
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    description: 'A dynamic cardio exercise that targets the core while providing cardiovascular benefits.',
    image: getExerciseImage('mountainClimber', 'image'),
    gifUrl: getExerciseImage('mountainClimber', 'gif'),
    videoUrl: getExerciseImage('mountainClimber', 'video'),
    steps: [
      'Start in a plank position',
      'Drive one knee toward your chest',
      'Quickly switch legs',
      'Continue alternating legs in a running motion'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 20, // seconds
        restTime: 60,
        notes: 'Focus on form and control'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['core', 'abs', 'obliques'],
    secondaryMuscles: ['shoulders', 'hip flexors'],
    difficulty: 'beginner',
    category: 'cardio',
    instructions: [
      'Keep your core engaged throughout',
      'Maintain a straight line from head to heels',
      'Drive knees toward chest, not toward sides',
      'Keep your hips level'
    ],
    tips: [
      'Start slow and focus on form',
      'Gradually increase speed',
      'Keep your neck neutral'
    ],
    commonMistakes: [
      'Letting hips sag or rise',
      'Moving too fast with poor form',
      'Not engaging core properly',
      'Bringing knees to sides instead of chest'
    ],
    variations: [
      'Cross-Body Mountain Climber',
      'Mountain Climber with Push-up',
      'Slow Mountain Climber',
      'Mountain Climber with Twist'
    ],
    estimatedTime: 6,
    caloriesBurn: 12,
    muscleGroup: 'abs'
  },
  {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    description: 'A classic cardio exercise that improves cardiovascular fitness and coordination.',
    image: getExerciseImage('jumpingJack', 'image'),
    gifUrl: getExerciseImage('jumpingJack', 'gif'),
    videoUrl: getExerciseImage('jumpingJack', 'video'),
    steps: [
      'Start in a standing position with feet together',
      'Jump and spread legs apart while raising arms overhead',
      'Jump back to starting position',
      'Repeat the movement rhythmically'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 10,
        restTime: 30,
        notes: 'Focus on coordination'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 20,
        restTime: 60,
        rpe: 6
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 20,
        restTime: 60,
        rpe: 7
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['shoulders', 'legs', 'core'],
    difficulty: 'beginner',
    category: 'cardio',
    instructions: [
      'Land softly on the balls of your feet',
      'Keep your core engaged',
      'Coordinate arm and leg movements',
      'Breathe rhythmically'
    ],
    tips: [
      'Start slow to master coordination',
      'Focus on landing softly',
      'Keep your knees slightly bent'
    ],
    commonMistakes: [
      'Landing too hard',
      'Poor coordination',
      'Not engaging core',
      'Moving too fast initially'
    ],
    variations: [
      'Half Jack (arms only)',
      'Star Jump',
      'Power Jack',
      'Seal Jack'
    ],
    estimatedTime: 5,
    caloriesBurn: 10,
    muscleGroup: 'full-body'
  },
  {
    id: 'lunge',
    name: 'Walking Lunge',
    description: 'A dynamic lower body exercise that targets multiple muscle groups while improving balance.',
    image: getExerciseImage('lunge', 'image'),
    gifUrl: getExerciseImage('lunge', 'gif'),
    videoUrl: getExerciseImage('lunge', 'video'),
    steps: [
      'Start in a standing position',
      'Step forward with one leg',
      'Lower your body until both knees are bent at 90 degrees',
      'Push back to starting position',
      'Repeat with the other leg'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'warm-up' as SetType,
        reps: 5, // each leg
        restTime: 60,
        notes: 'Focus on form and balance'
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10, // each leg
        restTime: 90,
        rpe: 7
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10, // each leg
        restTime: 90,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'calves'],
    difficulty: 'beginner',
    category: 'strength',
    instructions: [
      'Keep your chest up throughout the movement',
      'Step far enough forward to create 90-degree angles',
      'Keep your front knee in line with your toes',
      'Engage your core for balance'
    ],
    tips: [
      'Start without weight to master form',
      'Focus on balance and control',
      'Keep your back knee close to the ground'
    ],
    commonMistakes: [
      'Front knee extending past toes',
      'Not stepping far enough forward',
      'Poor balance and coordination',
      'Rushing through the movement'
    ],
    variations: [
      'Reverse Lunge',
      'Side Lunge',
      'Curtsy Lunge',
      'Jumping Lunge'
    ],
    estimatedTime: 7,
    caloriesBurn: 12,
    muscleGroup: 'legs'
  },
  // Additional exercises for comprehensive fitness plans
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    description: 'A hip-hinge movement that targets the hamstrings and glutes.',
    image: getExerciseImage('romanianDeadlift', 'image'),
    gifUrl: getExerciseImage('romanianDeadlift', 'gif'),
    videoUrl: getExerciseImage('romanianDeadlift', 'video'),
    steps: [
      'Hold barbell with overhand grip, feet hip-width apart',
      'Keep legs slightly bent and hinge at hips',
      'Lower weight by pushing hips back',
      'Drive hips forward to return to start'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 75,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 75,
        rpe: 8
      }
    ],
    equipment: ['barbell', 'dumbbells'],
    targetMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower back', 'core'],
    difficulty: 'intermediate',
    category: 'strength',
    estimatedTime: 12,
    caloriesBurn: 80,
    muscleGroup: 'legs'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    description: 'Machine-based lower body exercise for building leg strength.',
    image: getExerciseImage('legPress', 'image'),
    gifUrl: getExerciseImage('legPress', 'gif'),
    videoUrl: getExerciseImage('legPress', 'video'),
    steps: [
      'Sit in leg press machine with back against pad',
      'Place feet shoulder-width apart on platform',
      'Lower weight by bending knees to 90 degrees',
      'Press through heels to extend legs'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 75,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 75,
        rpe: 8
      }
    ],
    equipment: ['leg press machine'],
    targetMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    difficulty: 'beginner',
    category: 'strength',
    instructions: [
      'Keep your back flat against the pad',
      'Don\'t lock knees at the top',
      'Control the weight on the way down'
    ],
    tips: [
      'Focus on pushing through your heels',
      'Keep knees in line with toes',
      'Don\'t go too deep if you have knee issues'
    ],
    commonMistakes: [
      'Placing feet too high or too low',
      'Not going through full range of motion',
      'Locking knees at the top'
    ],
    variations: [
      'Single-leg leg press',
      'High foot placement',
      'Low foot placement'
    ],
    estimatedTime: 10,
    caloriesBurn: 70,
    muscleGroup: 'legs'
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    description: 'Isolation exercise for calf muscle development.',
    image: getExerciseImage('calfRaises', 'image'),
    gifUrl: getExerciseImage('calfRaises', 'gif'),
    videoUrl: getExerciseImage('calfRaises', 'video'),
    steps: [
      'Stand with balls of feet on platform or floor',
      'Rise up on toes as high as possible',
      'Lower heels below starting position',
      'Repeat for full range of motion'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 45,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 45,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 45,
        rpe: 8
      },
      {
        setNumber: 4,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 45,
        rpe: 8
      }
    ],
    equipment: ['bodyweight', 'dumbbells', 'calf raise machine'],
    targetMuscles: ['calves'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    category: 'strength',
    instructions: [
      'Keep your body straight and core engaged',
      'Rise up as high as possible on your toes',
      'Lower slowly for full stretch'
    ],
    tips: [
      'Focus on the squeeze at the top',
      'Control the movement, don\'t bounce',
      'Add weight for increased difficulty'
    ],
    commonMistakes: [
      'Not going through full range of motion',
      'Bouncing at the bottom',
      'Leaning forward or backward'
    ],
    variations: [
      'Single-leg calf raises',
      'Seated calf raises',
      'Donkey calf raises'
    ],
    estimatedTime: 8,
    caloriesBurn: 40,
    muscleGroup: 'legs'
  },
  // Missing exercises for weight loss plan
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    description: 'Explosive squat variation for HIIT training and fat loss.',
    image: getExerciseImage('jumpSquat', 'image'),
    gifUrl: getExerciseImage('jumpSquat', 'gif'),
    videoUrl: getExerciseImage('jumpSquat', 'video'),
    steps: [
      'Stand with feet shoulder-width apart',
      'Lower into squat position',
      'Explode up jumping as high as possible',
      'Land softly and immediately go into next rep'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 30,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    difficulty: 'intermediate',
    category: 'plyometric',
    instructions: [
      'Keep chest up throughout movement',
      'Land softly on balls of feet',
      'Maintain proper squat form',
      'Use arms for momentum'
    ],
    tips: [
      'Focus on explosive upward movement',
      'Land quietly to reduce impact',
      'Keep core engaged throughout'
    ],
    commonMistakes: [
      'Landing too hard',
      'Not going low enough in squat',
      'Losing balance on landing'
    ],
    variations: [
      'Single-leg jump squat',
      'Jump squat with 180 turn',
      'Weighted jump squat'
    ],
    estimatedTime: 1,
    caloriesBurn: 15,
    muscleGroup: 'legs'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    description: 'Single-leg squat variation for lower body strength and stability.',
    image: getExerciseImage('bulgarianSplitSquat', 'image'),
    gifUrl: getExerciseImage('bulgarianSplitSquat', 'gif'),
    videoUrl: getExerciseImage('bulgarianSplitSquat', 'video'),
    steps: [
      'Stand 2-3 feet in front of bench or elevated surface',
      'Place top of one foot behind you on bench',
      'Lower into lunge position',
      'Push through front heel to return to start'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 10,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['bench', 'bodyweight'],
    targetMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep most weight on front leg',
      'Don\'t push off back foot',
      'Keep torso upright',
      'Control the descent'
    ],
    tips: [
      'Start with bodyweight only',
      'Focus on balance and control',
      'Keep front knee in line with toes'
    ],
    commonMistakes: [
      'Putting too much weight on back leg',
      'Leaning forward too much',
      'Not going low enough'
    ],
    variations: [
      'Weighted Bulgarian split squat',
      'Jump Bulgarian split squat',
      'Reverse Bulgarian split squat'
    ],
    estimatedTime: 8,
    caloriesBurn: 60,
    muscleGroup: 'legs'
  },
  {
    id: 'step-up',
    name: 'Step-Up',
    description: 'Functional lower body exercise using a bench or platform.',
    image: getExerciseImage('stepUp', 'image'),
    gifUrl: getExerciseImage('stepUp', 'gif'),
    videoUrl: getExerciseImage('stepUp', 'video'),
    steps: [
      'Stand in front of bench or sturdy platform',
      'Step up with one foot, placing entire foot on surface',
      'Push through heel to lift body up',
      'Step down with control and repeat'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 8
      }
    ],
    equipment: ['bench', 'platform'],
    targetMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    difficulty: 'beginner',
    category: 'strength',
    instructions: [
      'Use full foot contact on platform',
      'Don\'t push off bottom leg',
      'Keep chest up and core engaged',
      'Control both up and down movements'
    ],
    tips: [
      'Choose appropriate height platform',
      'Focus on the working leg',
      'Add weight for increased difficulty'
    ],
    commonMistakes: [
      'Using momentum from bottom leg',
      'Not using full range of motion',
      'Leaning forward too much'
    ],
    variations: [
      'Weighted step-up',
      'Lateral step-up',
      'Step-up with knee drive'
    ],
    estimatedTime: 6,
    caloriesBurn: 45,
    muscleGroup: 'legs'
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    description: 'Upper body pulling exercise for back and bicep development.',
    image: getExerciseImage('pullUp', 'image'),
    gifUrl: getExerciseImage('pullUp', 'gif'),
    videoUrl: getExerciseImage('pullUp', 'video'),
    steps: [
      'Hang from pull-up bar with palms facing away',
      'Pull body up until chin clears the bar',
      'Lower with control to full arm extension',
      'Repeat for desired reps'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['pull-up bar'],
    targetMuscles: ['back', 'biceps'],
    secondaryMuscles: ['core', 'forearms'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep core engaged throughout',
      'Pull with your back, not just arms',
      'Control the descent',
      'Full range of motion'
    ],
    tips: [
      'Use assistance if needed',
      'Focus on squeezing shoulder blades',
      'Don\'t swing or use momentum'
    ],
    commonMistakes: [
      'Not going full range of motion',
      'Using momentum to swing up',
      'Not engaging core'
    ],
    variations: [
      'Chin-Up',
      'Wide-Grip Pull-Up',
      'Assisted Pull-Up'
    ],
    estimatedTime: 8,
    caloriesBurn: 60,
    muscleGroup: 'back'
  },
  {
    id: 'dumbbell-rows',
    name: 'Dumbbell Rows',
    description: 'Back strengthening exercise using dumbbells.',
    image: getExerciseImage('dumbbellRows', 'image'),
    gifUrl: getExerciseImage('dumbbellRows', 'gif'),
    videoUrl: getExerciseImage('dumbbellRows', 'video'),
    steps: [
      'Hold dumbbell in one hand, place other hand on bench',
      'Keep back straight and core engaged',
      'Pull dumbbell to hip, squeezing shoulder blade',
      'Lower with control and repeat'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 45,
        rpe: 8
      }
    ],
    equipment: ['dumbbells', 'bench'],
    targetMuscles: ['back'],
    secondaryMuscles: ['biceps', 'core'],
    difficulty: 'beginner',
    category: 'strength',
    instructions: [
      'Keep back straight throughout',
      'Pull to hip, not chest',
      'Squeeze shoulder blade at top',
      'Control the weight'
    ],
    tips: [
      'Focus on pulling with back muscles',
      'Keep core tight for stability',
      'Don\'t rotate torso'
    ],
    commonMistakes: [
      'Pulling to chest instead of hip',
      'Using too much momentum',
      'Not squeezing shoulder blade'
    ],
    variations: [
      'Bent-over barbell row',
      'T-bar row',
      'Cable row'
    ],
    estimatedTime: 8,
    caloriesBurn: 50,
    muscleGroup: 'back'
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    description: 'Core exercise targeting obliques and rotational strength.',
    image: getExerciseImage('russianTwists', 'image'),
    gifUrl: getExerciseImage('russianTwists', 'gif'),
    videoUrl: getExerciseImage('russianTwists', 'video'),
    steps: [
      'Sit on floor with knees bent, feet slightly off ground',
      'Lean back to create V-shape with torso and thighs',
      'Rotate torso side to side, touching ground beside hips',
      'Keep core engaged throughout movement'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 30,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 30,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 30,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['abs', 'obliques'],
    secondaryMuscles: ['core'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: [
      'Keep feet off ground if possible',
      'Rotate from core, not arms',
      'Maintain V-shape position',
      'Control the movement'
    ],
    tips: [
      'Start with feet on ground if needed',
      'Focus on quality over speed',
      'Add weight for increased difficulty'
    ],
    commonMistakes: [
      'Moving too fast',
      'Not rotating from core',
      'Letting feet touch ground'
    ],
    variations: [
      'Weighted Russian twists',
      'Russian twists with medicine ball',
      'Feet elevated Russian twists'
    ],
    estimatedTime: 5,
    caloriesBurn: 25,
    muscleGroup: 'abs'
  }
];

// Helper function to get an exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};



