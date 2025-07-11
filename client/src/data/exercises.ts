import { Exercise, SetType } from '../types/content';
import { getExerciseImage } from './imageAssets';

// Helper function to create complete exercise objects with default values
const createExercise = (exercise: Partial<Exercise> & { id: string; name: string; description: string }): Exercise => {
  return {
    instructions: exercise.instructions || [],
    tips: exercise.tips || [],
    commonMistakes: exercise.commonMistakes || [],
    variations: exercise.variations || [],
    ...exercise,
    image: exercise.image || getExerciseImage(exercise.id, 'image'),
    gifUrl: exercise.gifUrl || `/images/exercises/${exercise.id}.gif`,
    videoUrl: exercise.videoUrl || getExerciseImage(exercise.id, 'video'),
    steps: exercise.steps || [],
    sets: exercise.sets || [],
    equipment: exercise.equipment || [],
    targetMuscles: exercise.targetMuscles || [],
    secondaryMuscles: exercise.secondaryMuscles || [],
    difficulty: exercise.difficulty || 'intermediate',
    category: exercise.category || 'strength',
    estimatedTime: exercise.estimatedTime || 10,
    caloriesBurn: exercise.caloriesBurn || 50,
    muscleGroup: exercise.muscleGroup || 'full-body'
  } as Exercise;
};

const addMissingProps = (exercise: any): Exercise => {
  return {
    instructions: [],
    tips: [],
    commonMistakes: [],
    variations: [],
    ...exercise,
    image: exercise.image || getExerciseImage(exercise.id, 'image'),
    gifUrl: exercise.gifUrl || `/images/exercises/${exercise.id}.gif`,
    videoUrl: exercise.videoUrl || getExerciseImage(exercise.id, 'video'),
    steps: exercise.steps || [],
    sets: exercise.sets || [],
    equipment: exercise.equipment || [],
    targetMuscles: exercise.targetMuscles || [],
    secondaryMuscles: exercise.secondaryMuscles || [],
    difficulty: exercise.difficulty || 'intermediate',
    category: exercise.category || 'strength',
    estimatedTime: exercise.estimatedTime || 10,
    caloriesBurn: exercise.caloriesBurn || 50,
    muscleGroup: exercise.muscleGroup || 'full-body'
  } as Exercise;
};

const rawExercises = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    description: 'A compound exercise for chest, shoulders, and triceps.',
    image: getExerciseImage('benchPress', 'image'),
    gifUrl: "/images/exercises/bench-press.gif",
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
    gifUrl: "/images/exercises/incline-dumbbell-press.gif",
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
    instructions: [],
    tips: [],
    commonMistakes: [],
    variations: [],
    estimatedTime: 10,
    caloriesBurn: 70,
    muscleGroup: 'chest'
  },
  {
    id: 'shoulder-press-db-bb',
    name: 'Shoulder Press (Dumbbell or Barbell)',
    description: 'A compound exercise that targets the deltoid muscles.',
    image: getExerciseImage('shoulderPress', 'image'),
    gifUrl: "/images/exercises/shoulder-press-db-bb.gif",
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
    instructions: [],
    tips: [],
    commonMistakes: [],
    variations: [],
    estimatedTime: 10,
    caloriesBurn: 65,
    muscleGroup: 'shoulders'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    description: 'An isolation exercise that targets the lateral deltoids.',
    image: getExerciseImage('lateralRaises', 'image'),
    gifUrl: "/images/exercises/lateral-raises.gif",
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
    instructions: [],
    tips: [],
    commonMistakes: [],
    variations: [],
    estimatedTime: 8,
    caloriesBurn: 50,
    muscleGroup: 'shoulders'
  },
  {
    id: 'triceps-dips',
    name: 'Triceps Dips',
    description: 'A compound exercise that primarily targets the triceps.',
    image: getExerciseImage('tricepsDips', 'image'),
    gifUrl: "/images/exercises/triceps-dips.gif",
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
    instructions: [
      'Keep your body upright throughout the movement',
      'Lower yourself until elbows reach 90 degrees',
      'Push through your palms to return to start',
      'Keep elbows close to your body'
    ],
    tips: [
      'Use assistance bands or machine if needed',
      'Focus on controlled movement',
      'Keep shoulders down and back'
    ],
    commonMistakes: [
      'Going too low and straining shoulders',
      'Flaring elbows out too wide',
      'Using momentum to bounce up'
    ],
    variations: [
      'Assisted dips',
      'Weighted dips',
      'Bench dips',
      'Ring dips'
    ],
    estimatedTime: 10,
    caloriesBurn: 70,
    muscleGroup: 'triceps'
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    description: 'An isolation exercise that targets the triceps muscles.',
    image: getExerciseImage('skullCrushers', 'image'),
    gifUrl: "/images/exercises/skull-crushers.gif",
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
    instructions: [
      'Keep upper arms stationary throughout the movement',
      'Control the weight on both the lowering and lifting phases',
      'Don\'t let the weight actually touch your forehead'
    ],
    tips: [
      'Use an EZ bar to reduce wrist strain',
      'Focus on feeling the stretch in your triceps',
      'Keep your core engaged for stability'
    ],
    commonMistakes: [
      'Moving the upper arms during the exercise',
      'Lowering the weight too fast',
      'Using too much weight'
    ],
    variations: [
      'Dumbbell skull crushers',
      'Incline skull crushers',
      'Cable skull crushers'
    ],
    estimatedTime: 10,
    caloriesBurn: 60,
    muscleGroup: 'triceps'
  },
  {
    id: 'light-jogging-rowing',
    name: 'Light Jogging or Rowing',
    description: 'Low-intensity cardiovascular activity for warm-up or active recovery.',
    image: getExerciseImage('lightJoggingOrRowing', 'image'),
    gifUrl: "/images/exercises/light-jogging-rowing.gif",
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
    instructions: [
      'Maintain steady breathing throughout',
      'Keep a conversational pace',
      'Focus on proper form over speed'
    ],
    tips: [
      'Start slow and gradually increase intensity',
      'Stay hydrated during the exercise',
      'Listen to your body and adjust pace as needed'
    ],
    commonMistakes: [
      'Starting too fast',
      'Poor posture during exercise',
      'Not maintaining consistent pace'
    ],
    variations: [
      'Treadmill jogging',
      'Outdoor jogging',
      'Rowing machine',
      'Stationary bike'
    ],
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
    gifUrl: "/images/exercises/Bodyweight Squat.gif",
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
    gifUrl: "/images/exercises/planks.gif",
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
    gifUrl: "/images/exercises/Burpees.gif",
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
    gifUrl: "/images/exercises/Mountain Climber.gif",
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
    gifUrl: "/images/exercises/Walking Lunge.gif",
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
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    description: 'A hip-hinge movement that targets the hamstrings and glutes.',
    image: getExerciseImage('romanianDeadlift', 'image'),
    gifUrl: "/images/exercises/Romanian Deadlift.gif",
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
    instructions: [
      'Keep the bar close to your body',
      'Hinge at the hips, not the knees',
      'Maintain a neutral spine',
      'Feel the stretch in your hamstrings'
    ],
    tips: [
      'Start with lighter weight to master the movement',
      'Focus on the hip hinge pattern',
      'Keep your chest up and shoulders back'
    ],
    commonMistakes: [
      'Squatting instead of hinging at hips',
      'Rounding the back',
      'Going too low without flexibility'
    ],
    variations: [
      'Single-leg Romanian deadlift',
      'Dumbbell Romanian deadlift',
      'Stiff-leg deadlift'
    ],
    estimatedTime: 12,
    caloriesBurn: 80,
    muscleGroup: 'legs'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    description: 'Machine-based lower body exercise for building leg strength.',
    image: getExerciseImage('legPress', 'image'),
    gifUrl: "/images/exercises/Leg Press.gif",
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
    gifUrl: "/images/exercises/Calf Raises.gif",
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
    gifUrl: "/images/exercises/Jump Squat.gif",
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
    gifUrl: "/images/exercises/Bulgarian Split Squat.gif",
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
    gifUrl: "/images/exercises/Step-Up.gif",
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
    gifUrl: "/images/exercises/Pull-Up.gif",
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
    gifUrl: "/images/exercises/Dumbbell Rows.gif",
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
    gifUrl: "/images/exercises/Russian Twists.gif",
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
  },
  // Additional exercises for Day 5-7 weight gain plan
  createExercise({
    id: 'dumbbell-snatch',
    name: 'Dumbbell Snatch',
    description: 'Explosive full-body movement for power development.',
    image: getExerciseImage('dumbbellSnatch', 'image'),
    gifUrl: "/images/exercises/Dumbbell Snatch.gif",
    videoUrl: getExerciseImage('dumbbellSnatch', 'video'),
    steps: [
      'Start with dumbbell between feet in squat position',
      'Explosively pull dumbbell overhead in one motion',
      'Catch dumbbell with arm extended overhead',
      'Lower with control and repeat'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 75,
        rpe: 8
      }
    ],
    equipment: ['dumbbells'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['shoulders', 'legs', 'core'],
    difficulty: 'advanced',
    category: 'power',
    instructions: [
      'Keep the dumbbell close to your body',
      'Use explosive hip drive',
      'Catch with arm fully extended',
      'Control the descent'
    ],
    tips: [
      'Start with lighter weight to learn the movement',
      'Focus on explosive power from hips',
      'Practice the catch position'
    ],
    commonMistakes: [
      'Using arms instead of hips for power',
      'Poor catch position',
      'Not controlling the descent'
    ],
    variations: [
      'Single-arm dumbbell snatch',
      'Kettlebell snatch',
      'Barbell snatch'
    ],
    estimatedTime: 12,
    caloriesBurn: 100,
    muscleGroup: 'full-body'
  }),
  createExercise({
    id: 'kettlebell-swings',
    name: 'Kettlebell Swings',
    description: 'Dynamic hip-hinge movement for power and conditioning.',
    image: getExerciseImage('kettlebellSwings', 'image'),
    gifUrl: "/images/exercises/Kettlebell Swings.gif",
    videoUrl: getExerciseImage('kettlebellSwings', 'video'),
    steps: [
      'Stand with feet shoulder-width apart, kettlebell in front',
      'Hinge at hips and swing kettlebell between legs',
      'Drive hips forward to swing kettlebell to chest height',
      'Let kettlebell swing back down and repeat'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['kettlebell'],
    targetMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'shoulders'],
    difficulty: 'intermediate',
    category: 'power',
    instructions: [
      'Hinge at hips, not knees',
      'Drive power from hips',
      'Keep core engaged',
      'Let gravity bring kettlebell down'
    ],
    tips: [
      'Start with lighter weight',
      'Focus on hip snap',
      'Keep shoulders back'
    ],
    commonMistakes: [
      'Squatting instead of hinging',
      'Using arms to lift',
      'Going too high with swing'
    ],
    variations: [
      'Single-arm kettlebell swing',
      'American kettlebell swing',
      'Alternating kettlebell swing'
    ],
    estimatedTime: 10,
    caloriesBurn: 90,
    muscleGroup: 'legs'
  }),
  createExercise({
    id: 'box-jumps',
    name: 'Box Jumps',
    description: 'Explosive jumping exercise for lower body power.',
    image: getExerciseImage('boxJumps', 'image'),
    gifUrl: "/images/exercises/Box Jumps.gif",
    videoUrl: getExerciseImage('boxJumps', 'video'),
    steps: [
      'Stand in front of box or platform',
      'Bend knees and swing arms back',
      'Jump explosively onto box',
      'Step down carefully and repeat'
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
    equipment: ['box', 'platform'],
    targetMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    difficulty: 'intermediate',
    category: 'plyometric',
    instructions: [
      'Land softly on the box',
      'Step down, don\'t jump down',
      'Use arms for momentum',
      'Keep knees aligned with toes'
    ],
    tips: [
      'Start with lower box height',
      'Focus on landing technique',
      'Rest between reps if needed'
    ],
    commonMistakes: [
      'Jumping down from box',
      'Landing with straight legs',
      'Using box that\'s too high'
    ],
    variations: [
      'Single-leg box jumps',
      'Lateral box jumps',
      'Box step-ups'
    ],
    estimatedTime: 10,
    caloriesBurn: 80,
    muscleGroup: 'legs'
  }),
  {
    id: 'battle-ropes',
    name: 'Battle Ropes',
    description: 'High-intensity cardio exercise using heavy ropes.',
    image: getExerciseImage('battleRopes', 'image'),
    gifUrl: "/images/exercises/Battle Ropes.gif",
    videoUrl: getExerciseImage('battleRopes', 'video'),
    steps: [
      'Hold rope ends with both hands',
      'Create waves by moving arms up and down alternately',
      'Keep core engaged and maintain rhythm',
      'Continue for specified time'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 75,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 30, // seconds
        restTime: 75,
        rpe: 8
      }
    ],
    equipment: ['battle ropes'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['core', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    category: 'cardio',
    instructions: ['Keep core tight', 'Maintain steady rhythm', 'Use full body motion'],
    tips: ['Start with shorter intervals', 'Focus on form over speed'],
    commonMistakes: ['Using only arms', 'Poor posture'],
    variations: ['Alternating waves', 'Spiral waves', 'Slams'],
    estimatedTime: 5,
    caloriesBurn: 120,
    muscleGroup: 'full-body'
  },
  {
    id: 'hanging-leg-raises',
    name: 'Hanging Leg Raises',
    description: 'Advanced core exercise performed hanging from a bar.',
    image: getExerciseImage('hangingLegRaises', 'image'),
    gifUrl: "/images/exercises/Hanging Leg Raises.gif",
    videoUrl: getExerciseImage('hangingLegRaises', 'video'),
    steps: [
      'Hang from pull-up bar with arms extended',
      'Keep legs straight and raise them up',
      'Lift until legs are parallel to floor',
      'Lower with control and repeat'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 15,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['pull-up bar'],
    targetMuscles: ['abs'],
    secondaryMuscles: ['core', 'forearms'],
    difficulty: 'advanced',
    category: 'strength',
    instructions: ['Keep core engaged', 'Control the movement', 'Don\'t swing'],
    tips: ['Start with bent knees if needed', 'Focus on slow controlled movement'],
    commonMistakes: ['Using momentum', 'Not full range of motion'],
    variations: ['Bent knee raises', 'Hanging knee tucks'],
    estimatedTime: 8,
    caloriesBurn: 60,
    muscleGroup: 'abs'
  },
  {
    id: 'front-squats',
    name: 'Front Squats',
    description: 'Squat variation with weight held in front for increased core engagement.',
    image: getExerciseImage('frontSquats', 'image'),
    gifUrl: "/images/exercises/Front Squats.gif",
    videoUrl: getExerciseImage('frontSquats', 'video'),
    steps: [
      'Hold barbell across front of shoulders',
      'Keep elbows high and chest up',
      'Squat down keeping weight on front',
      'Drive through heels to stand up'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 8,
        restTime: 90,
        rpe: 8
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
        rpe: 8
      }
    ],
    equipment: ['barbell', 'squat rack'],
    targetMuscles: ['legs', 'glutes'],
    secondaryMuscles: ['core', 'shoulders'],
    difficulty: 'advanced',
    category: 'strength',
    instructions: ['Keep elbows high', 'Maintain upright torso', 'Full depth squat'],
    tips: ['Start with lighter weight', 'Focus on mobility first'],
    commonMistakes: ['Dropping elbows', 'Leaning forward'],
    variations: ['Goblet squats', 'Cross-arm front squats'],
    estimatedTime: 12,
    caloriesBurn: 100,
    muscleGroup: 'legs'
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    description: 'Fundamental compound movement for full-body strength.',
    image: getExerciseImage('deadlifts', 'image'),
    gifUrl: "/images/exercises/Deadlifts.gif",
    videoUrl: getExerciseImage('deadlifts', 'video'),
    steps: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip bar',
      'Keep back straight and lift by extending hips and knees',
      'Stand tall then lower bar with control'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 6,
        restTime: 120,
        rpe: 8
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 6,
        restTime: 120,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 6,
        restTime: 120,
        rpe: 8
      }
    ],
    equipment: ['barbell', 'plates'],
    targetMuscles: ['back', 'glutes', 'legs'],
    secondaryMuscles: ['core', 'forearms'],
    difficulty: 'advanced',
    category: 'strength',
    instructions: ['Keep bar close to body', 'Neutral spine', 'Drive through heels'],
    tips: ['Start with lighter weight', 'Focus on form first'],
    commonMistakes: ['Rounding back', 'Bar drifting away'],
    variations: ['Sumo deadlift', 'Trap bar deadlift'],
    estimatedTime: 15,
    caloriesBurn: 120,
    muscleGroup: 'full-body'
  },
  {
    id: 'hip-thrusts',
    name: 'Hip Thrusts',
    description: 'Glute-focused exercise performed with back against bench.',
    image: getExerciseImage('hipThrusts', 'image'),
    gifUrl: "/images/exercises/Hip Thrusts.gif",
    videoUrl: getExerciseImage('hipThrusts', 'video'),
    steps: [
      'Sit with back against bench, barbell over hips',
      'Plant feet firmly on ground',
      'Drive hips up by squeezing glutes',
      'Lower with control and repeat'
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
    equipment: ['barbell', 'bench'],
    targetMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Squeeze glutes at top', 'Keep core engaged', 'Full range of motion'],
    tips: ['Use pad for comfort', 'Focus on glute activation'],
    commonMistakes: ['Not full hip extension', 'Using back instead of glutes'],
    variations: ['Single-leg hip thrust', 'Bodyweight hip thrust'],
    estimatedTime: 10,
    caloriesBurn: 80,
    muscleGroup: 'glutes'
  },
  {
    id: 'hanging-knee-tucks',
    name: 'Hanging Knee Tucks',
    description: 'Core exercise performed hanging from bar with knee movement.',
    image: getExerciseImage('hangingKneeTucks', 'image'),
    gifUrl: "/images/exercises/Hanging Knee Tucks.gif",
    videoUrl: getExerciseImage('hangingKneeTucks', 'video'),
    steps: [
      'Hang from pull-up bar with arms extended',
      'Bring knees up toward chest',
      'Squeeze abs at top of movement',
      'Lower knees with control'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 12,
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['pull-up bar'],
    targetMuscles: ['abs'],
    secondaryMuscles: ['core', 'forearms'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Control the movement', 'Engage core throughout', 'Don\'t swing'],
    tips: ['Start with small range if needed', 'Focus on abs not hip flexors'],
    commonMistakes: ['Using momentum', 'Not engaging core'],
    variations: ['Hanging leg raises', 'Hanging oblique crunches'],
    estimatedTime: 8,
    caloriesBurn: 50,
    muscleGroup: 'abs'
  },
  // Additional exercises for weight loss plan
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    description: 'High-intensity cardio exercise for fat burning and coordination.',
    image: getExerciseImage('jumpRope', 'image'),
    gifUrl: "/images/exercises/Jump Ropes.gif",
    videoUrl: getExerciseImage('jumpRope', 'video'),
    steps: [
      'Hold rope handles with arms at sides',
      'Rotate rope with wrists, not arms',
      'Jump with both feet together',
      'Land softly on balls of feet'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 60, // seconds
        restTime: 60,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 60, // seconds
        restTime: 60,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 60, // seconds
        restTime: 60,
        rpe: 8
      }
    ],
    equipment: ['jump rope'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['calves', 'core', 'shoulders'],
    difficulty: 'beginner',
    category: 'cardio',
    instructions: ['Keep elbows close to body', 'Use wrist rotation', 'Stay on balls of feet', 'Maintain rhythm'],
    tips: ['Start slow and build speed', 'Keep jumps low', 'Relax shoulders'],
    commonMistakes: ['Jumping too high', 'Using arms instead of wrists', 'Landing on heels'],
    variations: ['Single leg jumps', 'Double unders', 'Criss-cross'],
    estimatedTime: 5,
    caloriesBurn: 80,
    muscleGroup: 'full-body'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    description: 'Dynamic core exercise targeting abs and obliques.',
    image: getExerciseImage('bicycleCrunches', 'image'),
    gifUrl: "/images/exercises/Bicycle Crunches.gif",
    videoUrl: getExerciseImage('bicycleCrunches', 'video'),
    steps: [
      'Lie on back with hands behind head',
      'Lift shoulders off ground and bring knees to chest',
      'Rotate torso bringing elbow to opposite knee',
      'Alternate sides in cycling motion'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 20,
        restTime: 30,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 20,
        restTime: 30,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 20,
        restTime: 30,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['abs', 'obliques'],
    secondaryMuscles: ['core'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep lower back pressed to floor', 'Don\'t pull on neck', 'Control the movement', 'Breathe rhythmically'],
    tips: ['Focus on quality over speed', 'Keep core engaged', 'Don\'t rush the movement'],
    commonMistakes: ['Pulling on neck', 'Moving too fast', 'Not engaging core'],
    variations: ['Slow bicycle crunches', 'Weighted bicycle crunches'],
    estimatedTime: 5,
    caloriesBurn: 30,
    muscleGroup: 'abs'
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    description: 'Isometric core exercise targeting obliques and lateral stability.',
    image: getExerciseImage('sidePlank', 'image'),
    gifUrl: "/images/exercises/Side Plank.gif",
    videoUrl: getExerciseImage('sidePlank', 'video'),
    steps: [
      'Lie on side with forearm on ground',
      'Stack feet and lift hips off ground',
      'Keep body in straight line',
      'Hold position for specified time'
    ],
    sets: [
      {
        setNumber: 1,
        setType: 'working' as SetType,
        reps: 30, // seconds each side
        restTime: 30,
        rpe: 7
      },
      {
        setNumber: 2,
        setType: 'working' as SetType,
        reps: 30, // seconds each side
        restTime: 30,
        rpe: 8
      },
      {
        setNumber: 3,
        setType: 'working' as SetType,
        reps: 30, // seconds each side
        restTime: 30,
        rpe: 8
      }
    ],
    equipment: ['bodyweight'],
    targetMuscles: ['obliques', 'core'],
    secondaryMuscles: ['shoulders', 'glutes'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep body straight', 'Don\'t let hips sag', 'Engage core throughout', 'Breathe normally'],
    tips: ['Start with shorter holds', 'Keep top arm on hip or extended up', 'Focus on alignment'],
    commonMistakes: ['Letting hips drop', 'Rolling forward or back', 'Holding breath'],
    variations: ['Side plank with leg lift', 'Side plank with rotation', 'Modified side plank'],
    estimatedTime: 4,
    caloriesBurn: 25,
    muscleGroup: 'abs'
  },
  {
    id: 'plank-to-push-up',
    name: 'Plank to Push-up',
    description: 'Dynamic exercise combining plank hold with push-up movement.',
    image: getExerciseImage('plankToPushUp', 'image'),
    gifUrl: "/images/exercises/Plank to Push-up.gif",
    videoUrl: getExerciseImage('plankToPushUp', 'video'),
    steps: [
      'Start in forearm plank position',
      'Push up to high plank one arm at a time',
      'Lower back to forearm plank one arm at a time',
      'Repeat alternating lead arm'
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
    equipment: ['bodyweight'],
    targetMuscles: ['core', 'chest', 'shoulders'],
    secondaryMuscles: ['triceps', 'abs'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep core tight throughout', 'Move one arm at a time', 'Maintain straight body line', 'Control the movement'],
    tips: ['Start slow and focus on form', 'Keep hips stable', 'Alternate lead arm each rep'],
    commonMistakes: ['Moving too fast', 'Letting hips sag', 'Not alternating lead arm'],
    variations: ['Modified on knees', 'Plank to push-up with rotation'],
    estimatedTime: 6,
    caloriesBurn: 40,
    muscleGroup: 'full-body'
  }
];

// Apply missing properties to all exercises
export const exercises: Exercise[] = rawExercises.map(exercise => addMissingProps(exercise));

// Helper function to get an exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};



