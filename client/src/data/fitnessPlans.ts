import { FitnessPlan, Exercise } from '../types/content';
import { getWorkoutPlanImage, imageAssets } from './imageAssets';
import { exercises } from './exercises';

export const fitnessPlans: FitnessPlan[] = [
  new FitnessPlan({
    id: 'weight-gain-resistance',
    title: '🏋️‍♂️ Weight Gain Workout Plan (With Cardio & Resistance Training)',
    description: `**Focus:** Muscle hypertrophy & strength
**Duration:** 6 days/week
**Rest Between Sets:** 45-90 seconds
**Rest Days:** 1 day (Sunday or any preferred day)
**Cardio:** 2-3 times per week (low to moderate intensity)

This comprehensive program is designed for individuals looking to build muscle mass and gain weight through structured resistance training combined with strategic cardio sessions.`,
    category: 'weight-gain',
    level: 'intermediate',
    duration: 8,
    image_url: imageAssets.fitnessPlansCategories["weight-gain-workout"],
    thumbnail_gif_url: "/images/gifs/weight-gain-workout-thumbnail.gif",
    full_gif_url: "/images/gifs/weight-gain-workout-full.gif",
    weekly_workouts: 6,
    estimated_calories_burn: 2000,
    difficulty: 4,
    target_audience: 'Individuals looking to gain muscle mass and overall body weight through structured resistance training.',
    prerequisites: [
      'Basic understanding of weightlifting techniques',
      'Access to gym equipment (dumbbells, barbells, machines)',
      'Commitment to consistent training and high-calorie diet',
      'Ability to train 6 days per week'
    ],
    equipment: ['barbell', 'dumbbells', 'resistance bands', 'machines', 'pull-up bar', 'bench'],
    goals: [
      'Increase muscle mass by 5-10 pounds over 8 weeks',
      'Improve major lifts (Squat, Bench, Deadlift) by 10-15%',
      'Enhance overall strength and muscular endurance',
      'Develop sustainable high-calorie nutrition habits',
      'Build functional strength for daily activities'
    ],
    schedule: [
      {
        day: 1,
        restDay: false,
        title: 'Day 1: Upper Body (Push - Chest, Shoulders, Triceps)',
        description: 'Focus on pushing movements targeting chest, shoulders, and triceps with light cardio finish.',
        exercises: [
          exercises.find(ex => ex.id === 'bench-press'),
          exercises.find(ex => ex.id === 'incline-dumbbell-press'),
          exercises.find(ex => ex.id === 'shoulder-press-db-bb'),
          exercises.find(ex => ex.id === 'lateral-raises'),
          exercises.find(ex => ex.id === 'triceps-dips'),
          exercises.find(ex => ex.id === 'skull-crushers'),
          exercises.find(ex => ex.id === 'light-jogging-rowing'),
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 75,
        totalCaloriesBurn: 400,
        focusAreas: ['chest', 'shoulders', 'triceps', 'cardio'],
        restBetweenSets: '45-90 seconds',
        notes: '**EXACT WORKOUT:** Bench Press: 4×8-12, Incline Dumbbell Press: 3×10-12, Shoulder Press (Dumbbell or Barbell): 3×10, Lateral Raises: 3×12-15, Triceps Dips: 3×8-12, Skull Crushers: 3×10-12, Light Jogging or Rowing: 10-15 min. **Rest Time Between Sets:** 45-90 sec'
      },
      {
        day: 2,
        restDay: false,
        title: 'Day 2: Lower Body (Legs & Abs)',
        description: 'Comprehensive lower body workout targeting legs, glutes, and core with cardio finish.',
        exercises: [
          exercises.find(ex => ex.id === 'squat'),
          exercises.find(ex => ex.id === 'romanian-deadlift'),
          exercises.find(ex => ex.id === 'leg-press'),
          exercises.find(ex => ex.id === 'lunge'),
          exercises.find(ex => ex.id === 'calf-raises'),
          exercises.find(ex => ex.id === 'plank'),
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 75,
        totalCaloriesBurn: 350,
        focusAreas: ['legs', 'glutes', 'abs', 'core'],
        restBetweenSets: '45-90 seconds',
        notes: '**EXACT WORKOUT:** Squats: 4×8-12, Romanian Deadlifts: 3×10, Leg Press: 3×12, Lunges: 3×10 (each leg), Calf Raises: 4×12-15, Plank: 3×45 sec. **Rest Time Between Sets:** 45-90 sec'
      },
      {
        day: 3,
        restDay: false,
        title: 'Day 3: Upper Body (Pull - Back & Biceps)',
        description: 'Pulling movements focusing on back development and bicep strength with cardio finish.',
        exercises: [
          exercises.find(ex => ex.id === 'romanian-deadlift'), 
          exercises.find(ex => ex.id === 'push-up'), 
          exercises.find(ex => ex.id === 'burpee'), 
          exercises.find(ex => ex.id === 'lateral-raises'), 
          exercises.find(ex => ex.id === 'triceps-dips'), 
          exercises.find(ex => ex.id === 'skull-crushers'), 
          exercises.find(ex => ex.id === 'light-jogging-rowing'),
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 75,
        totalCaloriesBurn: 320,
        focusAreas: ['back', 'biceps', 'forearms', 'cardio'],
        restBetweenSets: '45-90 seconds',
        notes: '**EXACT WORKOUT:** Deadlifts: 4×6-8, Pull-Ups: 3×8-10, Bent-over Rows: 3×10-12, Face Pulls: 3×12, Bicep Curls: 3×10-12, Hammer Curls: 3×10-12, Cardio: Rowing machine or Stairmaster (10 min). **Rest Time Between Sets:** 45-90 sec'
      },
      {
        day: 4,
        restDay: true,
        title: 'Day 4: Rest / Active Recovery',
        description: 'Complete rest or light activity for recovery and muscle repair.',
        exercises: [],
        totalEstimatedTime: 30,
        totalCaloriesBurn: 50,
        focusAreas: ['recovery', 'mobility'],
        restBetweenSets: 'N/A',
        notes: 'Light walking, yoga, foam rolling, and stretching. Focus on hydration and nutrition.'
      },
      {
        day: 5,
        restDay: false,
        title: 'Day 5: Full Body (Power & Explosive Movements)',
        description: 'Dynamic full-body workout focusing on power, explosiveness, and athletic performance.',
        exercises: [
          exercises.find(ex => ex.id === 'dumbbell-snatch'),
          exercises.find(ex => ex.id === 'kettlebell-swings'),
          exercises.find(ex => ex.id === 'box-jumps'),
          exercises.find(ex => ex.id === 'battle-ropes'),
          exercises.find(ex => ex.id === 'hanging-leg-raises'),
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 60,
        totalCaloriesBurn: 350,
        focusAreas: ['full body', 'power', 'explosive', 'core'],
        restBetweenSets: '45-90 seconds',
        notes: '**EXACT WORKOUT:** Dumbbell Snatch: 3×8, Kettlebell Swings: 3×15, Box Jumps: 3×12, Battle Ropes: 3×30 sec, Hanging Leg Raises: 3×15. **Rest Time Between Sets:** 45-90 sec'
      },
      {
        day: 6,
        restDay: false,
        title: 'Day 6: Lower Body (Strength & Endurance)',
        description: 'Intensive lower body session focusing on strength, endurance, and muscle development.',
        exercises: [
          exercises.find(ex => ex.id === 'bulgarian-split-squat'),
          exercises.find(ex => ex.id === 'front-squats'),
          exercises.find(ex => ex.id === 'deadlifts'),
          exercises.find(ex => ex.id === 'hip-thrusts'),
          exercises.find(ex => ex.id === 'calf-raises'),
          exercises.find(ex => ex.id === 'hanging-knee-tucks'),
          exercises.find(ex => ex.id === 'light-jogging-rowing'),
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 75,
        totalCaloriesBurn: 400,
        focusAreas: ['legs', 'glutes', 'endurance', 'cardio'],
        restBetweenSets: '45-90 seconds',
        notes: '**EXACT WORKOUT:** Bulgarian Split Squats: 3×10, Front Squats: 3×8, Deadlifts: 3×6, Hip Thrusts: 3×12, Calf Raises: 4×15, Hanging Knee Tucks: 3×12, Cardio: Light jogging (15 min). **Rest Time Between Sets:** 45-90 sec'
      },
      {
        day: 7,
        restDay: true,
        title: 'Day 7: Rest / Recovery',
        description: 'Complete rest day for muscle recovery and preparation for the next week.',
        exercises: [],
        totalEstimatedTime: 30,
        totalCaloriesBurn: 50,
        focusAreas: ['recovery', 'mobility'],
        restBetweenSets: 'N/A',
        notes: 'Mobility work, foam rolling, stretching, and complete rest. Focus on sleep and nutrition.'
      }
    ],
    status: 'published',
    created_at: '2024-05-20T10:00:00Z',
    tags: ['weight gain', 'muscle building', 'strength', 'intermediate', 'gym', 'hypertrophy', 'mass building'],
    featured: true,
    rating: 4.8,
    reviewCount: 127,
    completionRate: 92,
    averageWorkoutTime: 70,
    muscleGroups: ['full-body', 'chest', 'back', 'legs', 'shoulders', 'arms', 'glutes', 'core'],
    equipmentRequired: ['barbell', 'dumbbells', 'machines', 'pull-up bar', 'bench', 'cables'],
    timeOfDay: 'any',
    location: 'gym',
    intensity: 'high'
  }),
  new FitnessPlan({
    id: 'weight-loss-cardio-strength',
    title: '🏋️‍♀️ Weight Loss Workout Plan (With Cardio & Strength Training)',
    description: `**Focus:** Fat loss, muscle retention, and endurance
**Duration:** 6 days/week
**Rest Between Sets:** 30-60 seconds
**Rest Days:** 1 day (Sunday or any preferred day)
**Cardio:** 4-5 times per week (mix of HIIT & steady-state)

This comprehensive fat loss program combines high-intensity interval training with strength training to maximize calorie burn while preserving lean muscle mass.`,
    category: 'weight-loss',
    level: 'intermediate',
    duration: 12,
    image_url: imageAssets.fitnessPlansCategories["weight-loss-workout"],
    thumbnail_gif_url: "/images/gifs/weight-loss-workout-thumbnail.gif",
    full_gif_url: "/images/gifs/weight-loss-workout-full.gif",
    weekly_workouts: 6,
    estimated_calories_burn: 1800,
    difficulty: 3,
    target_audience: 'Individuals focused on fat loss, muscle retention, and cardiovascular endurance improvement.',
    prerequisites: [
      'Basic fitness level and exercise experience',
      'Commitment to consistent cardio and strength training',
      'Ability to perform high-intensity exercises',
      'Access to basic gym equipment or home setup'
    ],
    equipment: ['bodyweight', 'jump rope', 'dumbbells', 'step platform', 'battle ropes'],
    goals: [
      'Achieve sustainable fat loss of 1-2 pounds per week',
      'Improve cardiovascular endurance by 20-30%',
      'Retain and build lean muscle mass',
      'Increase overall fitness level and energy',
      'Develop healthy exercise habits for long-term success'
    ],
    schedule: [
      {
        day: 1,
        restDay: false,
        title: 'Day 1: Full-Body Strength + Cardio',
        description: 'Comprehensive full-body workout combining strength training with high-intensity cardio.',
        exercises: [
          exercises.find(ex => ex.id === 'squat'),
          exercises.find(ex => ex.id === 'push-up'),
          exercises.find(ex => ex.id === 'deadlifts'),
          exercises.find(ex => ex.id === 'shoulder-press-db-bb'),
          exercises.find(ex => ex.id === 'plank'),
          exercises.find(ex => ex.id === 'jump-rope'),
          exercises.find(ex => ex.id === 'light-jogging-rowing'), // For HIIT cardio
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 60,
        totalCaloriesBurn: 300,
        focusAreas: ['full body', 'cardio', 'strength'],
        restBetweenSets: '30-60 seconds',
        notes: '**EXACT WORKOUT:** Squats: 4×12, Push-ups: 3×15, Deadlifts: 3×10, Dumbbell Shoulder Press: 3×12, Plank: 3×45 sec, Jump Rope: 3×1 min, Cardio: 15-20 min HIIT (e.g., sprints or cycling). **Rest Time Between Sets:** 30-60 sec'
      },
      {
        day: 2,
        restDay: false,
        title: 'Day 2: Cardio + Core',
        description: 'High-intensity cardio session with core-focused exercises and HIIT training.',
        exercises: [
          exercises.find(ex => ex.id === 'light-jogging-rowing'), // For Morning Fasted Walk (30-45 min)
          exercises.find(ex => ex.id === 'jump-squat'), // HIIT: Jump Squats 30 sec
          exercises.find(ex => ex.id === 'mountain-climber'), // HIIT: Mountain Climbers 30 sec
          exercises.find(ex => ex.id === 'burpee'), // HIIT: Burpees 30 sec
          exercises.find(ex => ex.id === 'hanging-leg-raises'), // Core: Hanging Leg Raises
          exercises.find(ex => ex.id === 'bicycle-crunches'), // Core: Bicycle Crunches
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 50,
        totalCaloriesBurn: 250,
        focusAreas: ['cardio', 'core', 'HIIT'],
        restBetweenSets: '30 seconds',
        notes: '**EXACT WORKOUT:** Morning Fasted Walk (30-45 min), HIIT Workout (15 min): Jump Squats 30 sec, Mountain Climbers 30 sec, Burpees 30 sec, Rest 30 sec (Repeat for 4-5 rounds), Core Focus: Hanging Leg Raises (3×15), Bicycle Crunches (3×20)'
      },
      {
        day: 3,
        restDay: false,
        title: 'Day 3: Lower Body Strength + Cardio',
        description: 'Lower body focused strength training combined with cardio for maximum calorie burn.',
        exercises: [
          exercises.find(ex => ex.id === 'bulgarian-split-squat'), // Bulgarian Split Squats: 3×10
          exercises.find(ex => ex.id === 'romanian-deadlift'), // Romanian Deadlifts: 3×12
          exercises.find(ex => ex.id === 'step-up'), // Step-ups: 3×12
          exercises.find(ex => ex.id === 'calf-raises'), // Calf Raises: 3×15
          exercises.find(ex => ex.id === 'plank-to-push-up'), // Plank to Push-ups: 3×12
          exercises.find(ex => ex.id === 'light-jogging-rowing'), // Cardio: 20 min Stair Climber
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 60,
        totalCaloriesBurn: 280,
        focusAreas: ['lower body', 'cardio', 'strength'],
        restBetweenSets: '30-60 seconds',
        notes: '**EXACT WORKOUT:** Bulgarian Split Squats: 3×10, Romanian Deadlifts: 3×12, Step-ups: 3×12, Calf Raises: 3×15, Plank to Push-ups: 3×12, Cardio: 20 min Stair Climber'
      },
      {
        day: 4,
        restDay: true,
        title: 'Day 4: Active Recovery / Mobility',
        description: 'Light activity day focusing on recovery, flexibility, and mobility work.',
        exercises: [],
        totalEstimatedTime: 30,
        totalCaloriesBurn: 50,
        focusAreas: ['recovery', 'mobility'],
        restBetweenSets: 'N/A',
        notes: 'Light yoga, stretching, or walking. Focus on hydration and recovery nutrition.'
      },
      {
        day: 5,
        restDay: false,
        title: 'Day 5: Upper Body + HIIT',
        description: 'Upper body strength training combined with high-intensity interval training.',
        exercises: [
          exercises.find(ex => ex.id === 'pull-up'), // Pull-ups or Assisted Pull-ups: 3×8
          exercises.find(ex => ex.id === 'dumbbell-rows'), // Dumbbell Rows: 3×12
          exercises.find(ex => ex.id === 'shoulder-press-db-bb'), // Shoulder Press: 3×12
          exercises.find(ex => ex.id === 'triceps-dips'), // Triceps Dips: 3×12
          exercises.find(ex => ex.id === 'battle-ropes'), // Battle Ropes: 3×30 sec
          exercises.find(ex => ex.id === 'light-jogging-rowing'), // Cardio: 20 min steady-state run
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 60,
        totalCaloriesBurn: 270,
        focusAreas: ['upper body', 'HIIT', 'strength'],
        restBetweenSets: '30-60 seconds',
        notes: '**EXACT WORKOUT:** Pull-ups or Assisted Pull-ups: 3×8, Dumbbell Rows: 3×12, Shoulder Press: 3×12, Triceps Dips: 3×12, Battle Ropes: 3×30 sec, Cardio: 20 min steady-state run'
      },
      {
        day: 6,
        restDay: false,
        title: 'Day 6: Cardio + Core',
        description: 'Cardio-focused session with intensive core training for maximum calorie burn.',
        exercises: [
          exercises.find(ex => ex.id === 'light-jogging-rowing'), // 30-40 min moderate-intensity cycling
          exercises.find(ex => ex.id === 'russian-twists'), // Russian Twists: 3×15
          exercises.find(ex => ex.id === 'hanging-knee-tucks'), // Hanging Knee Raises: 3×12
          exercises.find(ex => ex.id === 'side-plank'), // Side Planks: 3×30 sec each side
        ].filter(Boolean) as Exercise[],
        totalEstimatedTime: 50,
        totalCaloriesBurn: 220,
        focusAreas: ['cardio', 'core', 'endurance'],
        restBetweenSets: '30 seconds',
        notes: '**EXACT WORKOUT:** 30-40 min moderate-intensity cycling, Core Workout: Russian Twists: 3×15, Hanging Knee Raises: 3×12, Side Planks: 3×30 sec each side'
      },
      {
        day: 7,
        restDay: true,
        title: 'Day 7: Rest / Light Activity',
        description: 'Complete rest day or very light activity for full recovery.',
        exercises: [],
        totalEstimatedTime: 0,
        totalCaloriesBurn: 0,
        focusAreas: ['rest', 'recovery'],
        restBetweenSets: 'N/A',
        notes: 'Walking, stretching, or foam rolling. Prepare for the next week of training.'
      }
    ],
    status: 'published',
    created_at: '2024-05-27T10:00:00Z',
    tags: ['weight loss', 'cardio', 'strength', 'fat burning', 'intermediate', 'HIIT', 'endurance'],
    featured: true,
    rating: 4.7,
    reviewCount: 142,
    completionRate: 85,
    averageWorkoutTime: 55,
    muscleGroups: ['full-body', 'legs', 'core', 'upper body', 'cardiovascular'],
    equipmentRequired: ['bodyweight', 'jump rope', 'dumbbells', 'step platform', 'battle ropes'],
    timeOfDay: 'any',
    location: 'gym or home',
    intensity: 'high'
  }),
];

export const getFitnessPlanById = (id: string): FitnessPlan | undefined => {
  return fitnessPlans.find(plan => plan.id === id);
};

export const getAllFitnessPlans = (): FitnessPlan[] => {
  return fitnessPlans;
};

export const getFeaturedFitnessPlans = (): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.featured);
};

export const getFitnessPlansByLevel = (level: string): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.level === level);
};

export const getFitnessPlansByCategory = (category: string): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.category === category);
}; 