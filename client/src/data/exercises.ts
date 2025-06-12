import { Exercise, SetType } from '../types/content';
import { getExerciseImage } from './imageAssets';

export const exercises: Exercise[] = [
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
    difficulty: 'beginner',
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
    difficulty: 'beginner',
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
    difficulty: 'beginner',
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
  {
    id: 'bench-press',
    name: 'Bench Press',
    description: 'A compound exercise for chest, shoulders, and triceps.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/bench-press.gif",
    videoUrl: "",
    steps: ['Lie on a flat bench, grasp barbell with overhand grip slightly wider than shoulder-width.', 'Lower barbell slowly to mid-chest.', 'Push barbell back up to starting position.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 8, weight: 60, restTime: 60, rpe: 7 },
      { setNumber: 2, setType: 'working' as SetType, reps: 10, weight: 60, restTime: 60, rpe: 7 },
      { setNumber: 3, setType: 'working' as SetType, reps: 12, weight: 60, restTime: 60, rpe: 7 },
      { setNumber: 4, setType: 'working' as SetType, reps: 8, weight: 60, restTime: 60, rpe: 7 }
    ],
    equipment: ['barbell', 'bench'],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Maintain a slight arch in lower back.', 'Keep feet flat on floor.', 'Control the movement.'],
    tips: ['Use a spotter for heavy lifts.', 'Warm up properly.'],
    commonMistakes: ['Bouncing the bar off chest.', 'Flaring elbows out too wide.'],
    variations: ['Incline Bench Press', 'Decline Bench Press', 'Dumbbell Bench Press'],
    estimatedTime: 10,
    caloriesBurn: 15,
    muscleGroup: 'chest'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    description: 'Targets upper chest and shoulders.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/incline-dumbbell-press.gif",
    videoUrl: "",
    steps: ['Lie on an incline bench, hold dumbbells above chest.', 'Lower dumbbells to sides of upper chest.', 'Press dumbbells back up.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 10, weight: 20, restTime: 60, rpe: 7 },
      { setNumber: 2, setType: 'working' as SetType, reps: 12, weight: 20, restTime: 60, rpe: 7 },
      { setNumber: 3, setType: 'working' as SetType, reps: 10, weight: 20, restTime: 60, rpe: 7 }
    ],
    equipment: ['dumbbells', 'incline bench'],
    targetMuscles: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps'],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep elbows slightly tucked.', 'Control the descent.'],
    tips: ['Adjust bench angle for different emphasis.'],
    commonMistakes: ['Arching back too much.', 'Using too heavy weights.'],
    variations: ['Incline Barbell Press'],
    estimatedTime: 8,
    caloriesBurn: 12,
    muscleGroup: 'chest'
  },
  {
    id: 'shoulder-press-db-bb',
    name: 'Shoulder Press (Dumbbell or Barbell)',
    description: 'Builds strength in shoulders and triceps.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/shoulder-press-db-bb.gif",
    videoUrl: "",
    steps: ['Sit or stand, hold weights at shoulder height.', 'Press weights overhead until arms are fully extended.', 'Lower back to starting position.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 10, weight: 30, restTime: 60, rpe: 7 },
      { setNumber: 2, setType: 'working' as SetType, reps: 10, weight: 30, restTime: 60, rpe: 7 },
      { setNumber: 3, setType: 'working' as SetType, reps: 10, weight: 30, restTime: 60, rpe: 7 }
    ],
    equipment: ['dumbbells', 'barbell', 'bench (optional)'],
    targetMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep core engaged.', 'Avoid locking elbows.'],
    tips: ['Use a spotter for barbell press.'],
    commonMistakes: ['Using momentum.', 'Flaring elbows.'],
    variations: ['Arnold Press', 'Machine Shoulder Press'],
    estimatedTime: 8,
    caloriesBurn: 10,
    muscleGroup: 'shoulders'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    description: 'Isolates side deltoids for wider shoulders.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/lateral-raises.gif",
    videoUrl: "",
    steps: ['Stand with dumbbells at sides.', 'Raise arms out to sides until parallel to floor, slight bend in elbows.', 'Lower slowly.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 12, weight: 10, restTime: 45, rpe: 6 },
      { setNumber: 2, setType: 'working' as SetType, reps: 15, weight: 10, restTime: 45, rpe: 6 },
      { setNumber: 3, setType: 'working' as SetType, reps: 12, weight: 10, restTime: 45, rpe: 6 }
    ],
    equipment: ['dumbbells'],
    targetMuscles: ['shoulders'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    category: 'strength',
    instructions: ['Keep torso still.', 'Focus on muscle contraction.'],
    tips: ['Don\'t swing the weights.'],
    commonMistakes: ['Using too heavy weights.', 'Shrugging shoulders.'],
    variations: ['Cable Lateral Raises'],
    estimatedTime: 6,
    caloriesBurn: 8,
    muscleGroup: 'shoulders'
  },
  {
    id: 'triceps-dips',
    name: 'Triceps Dips',
    description: 'Effective bodyweight exercise for triceps.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/triceps-dips.gif",
    videoUrl: "",
    steps: ['Place hands on parallel bars or bench, lower body by bending elbows.', 'Push back up.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 8, restTime: 60, rpe: 7 },
      { setNumber: 2, setType: 'working' as SetType, reps: 12, restTime: 60, rpe: 7 },
      { setNumber: 3, setType: 'working' as SetType, reps: 8, restTime: 60, rpe: 7 }
    ],
    equipment: ['parallel bars', 'bench'],
    targetMuscles: ['triceps', 'chest', 'shoulders'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep body upright.', 'Control descent.'],
    tips: ['Lean forward to target chest more, stay upright for triceps.'],
    commonMistakes: ['Not going deep enough.', 'Flaring elbows too wide.'],
    variations: ['Bench Dips'],
    estimatedTime: 7,
    caloriesBurn: 10,
    muscleGroup: 'triceps'
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    description: 'Isolates triceps.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/skull-crushers.gif",
    videoUrl: "",
    steps: ['Lie on bench, hold EZ bar or dumbbells above chest, arms extended.', 'Lower weight towards forehead by bending elbows.', 'Extend arms back up.'],
    sets: [
      { setNumber: 1, setType: 'working' as SetType, reps: 10, weight: 20, restTime: 60, rpe: 7 },
      { setNumber: 2, setType: 'working' as SetType, reps: 12, weight: 20, restTime: 60, rpe: 7 },
      { setNumber: 3, setType: 'working' as SetType, reps: 10, weight: 20, restTime: 60, rpe: 7 }
    ],
    equipment: ['EZ bar', 'dumbbells', 'bench'],
    targetMuscles: ['triceps'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    category: 'strength',
    instructions: ['Keep upper arms stationary.', 'Control movement.'],
    tips: ['Use a spotter or lighter weight when learning.'],
    commonMistakes: ['Moving upper arms.', 'Using too heavy weight.'],
    variations: ['Dumbbell Skull Crushers', 'Cable Skull Crushers'],
    estimatedTime: 7,
    caloriesBurn: 9,
    muscleGroup: 'triceps'
  },
  {
    id: 'light-jogging-rowing',
    name: 'Light Jogging or Rowing',
    description: 'Low-intensity cardio for warm-up or active recovery.',
    image: getExerciseImage('pushUp', 'image'), // Placeholder, replace with actual image
    gifUrl: "/images/exercises/light-jogging-rowing.gif",
    videoUrl: "",
    steps: ['Perform light jogging outdoors or on a treadmill, or use a rowing machine at a comfortable pace.'],
    sets: [
      { setNumber: 1, setType: 'warm-up' as SetType, reps: 10, restTime: 0, notes: '10-15 minutes continuous' }
    ],
    equipment: ['bodyweight', 'treadmill', 'rowing machine'],
    targetMuscles: ['full-body'],
    secondaryMuscles: ['legs', 'cardiovascular'],
    difficulty: 'beginner',
    category: 'cardio',
    instructions: ['Maintain a conversational pace.', 'Focus on steady breathing.'],
    tips: ['Listen to music or a podcast.'],
    commonMistakes: ['Going too fast.', 'Not warming up properly.'],
    variations: ['Cycling', 'Elliptical'],
    estimatedTime: 15,
    caloriesBurn: 80,
    muscleGroup: 'full-body'
  }
]; 