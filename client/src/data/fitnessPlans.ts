import { FitnessPlan, Exercise } from '../types/content';
import { getWorkoutPlanImage, imageAssets } from './imageAssets';
import { exercises } from './exercises';

export const fitnessPlans: FitnessPlan[] = [
  new FitnessPlan({
    id: 'weight-gain-resistance',
    title: 'Weight Gain Workout Plan (With Cardio & Resistance Training)',
    description: '• Focus: Muscle hypertrophy & strength\n• Duration: 6 days/week\n• Rest Between Sets: 45-90 seconds\n• Rest Days: 1 day (Sunday or any preferred day)\n• Cardio: 2-3 times per week (low to moderate intensity)',
    category: 'weight-gain',
    level: 'intermediate',
    duration: 12,
    image_url: imageAssets.fitnessPlansCategories["weight-gain-workout"],
    thumbnail_gif_url: "/images/gifs/weight-gain-workout-thumbnail.gif",
    full_gif_url: "/images/gifs/weight-gain-workout-full.gif",
    weekly_workouts: 6,
    estimated_calories_burn: 2000,
    difficulty: 4,
    target_audience: 'Individuals looking to gain muscle mass and overall body weight.',
    prerequisites: [
      'Basic understanding of weightlifting techniques',
      'Access to gym equipment (dumbbells, barbells, machines)',
      'Commitment to consistent training and high-calorie diet'
    ],
    equipment: ['barbell', 'dumbbells', 'resistance bands', 'machines', 'pull-up bar'],
    goals: [
      'Increase muscle mass by 5-10 pounds',
      'Improve major lifts (Squat, Bench, Deadlift)',
      'Enhance overall strength and endurance',
      'Develop a sustainable high-calorie nutrition strategy'
    ],
    schedule: [
      {
        day: 1,
        restDay: false,
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
        focusAreas: ['chest', 'shoulders', 'triceps', 'cardio']
      },
      {
        day: 2,
        restDay: false,
        exercises: [exercises[3], exercises[4], exercises[5]], // Squats, Romanian Deadlifts, Leg Press
        totalEstimatedTime: 70,
        totalCaloriesBurn: 350,
        focusAreas: ['legs', 'glutes', 'abs']
      },
      {
        day: 3,
        restDay: false,
        exercises: [exercises[6], exercises[7], exercises[8]], // Deadlifts, Pull-Ups, Bent-over Rows
        totalEstimatedTime: 65,
        totalCaloriesBurn: 320,
        focusAreas: ['back', 'biceps', 'forearms']
      },
      {
        day: 4,
        restDay: true,
        exercises: [],
        totalEstimatedTime: 0,
        totalCaloriesBurn: 0,
        focusAreas: ['rest']
      },
      {
        day: 5,
        restDay: false,
        exercises: [exercises[9], exercises[10], exercises[11]], // Dumbbell Snatch, Kettlebell Swings, Box Jumps
        totalEstimatedTime: 55,
        totalCaloriesBurn: 280,
        focusAreas: ['full body', 'power', 'explosive']
      },
      {
        day: 6,
        restDay: false,
        exercises: [exercises[12], exercises[13], exercises[14]], // Bulgarian Split Squats, Front Squats, Hip Thrusts
        totalEstimatedTime: 65,
        totalCaloriesBurn: 330,
        focusAreas: ['legs', 'glutes', 'endurance']
      },
      {
        day: 7,
        restDay: true,
        exercises: [],
        totalEstimatedTime: 0,
        totalCaloriesBurn: 0,
        focusAreas: ['rest']
      }
    ],
    status: 'published',
    created_at: '2024-05-20T10:00:00Z',
    tags: ['weight gain', 'muscle building', 'strength', 'intermediate', 'gym'],
    featured: true,
    rating: 4.7,
    reviewCount: 95,
    completionRate: 88,
    averageWorkoutTime: 60,
    muscleGroups: ['full-body', 'chest', 'back', 'legs', 'shoulders', 'arms', 'glutes'],
    equipmentRequired: ['barbell', 'dumbbells', 'machines', 'pull-up bar'],
    timeOfDay: 'any',
    location: 'gym',
    intensity: 'high'
  }),
  new FitnessPlan({
    id: 'weight-loss-cardio-strength',
    title: 'Weight Loss Workout Plan (With Cardio & Strength Training)',
    description: 'A 6-day/week program focused on fat loss, muscle retention, and endurance, combining HIIT and steady-state cardio with strength training.',
    category: 'weight-loss',
    level: 'intermediate',
    duration: 10,
    image_url: imageAssets.fitnessPlansCategories["weight-loss-workout"],
    thumbnail_gif_url: "/images/gifs/weight-loss-workout-thumbnail.gif",
    full_gif_url: "/images/gifs/weight-loss-workout-full.gif",
    weekly_workouts: 6,
    estimated_calories_burn: 1500,
    difficulty: 3,
    target_audience: 'Individuals focused on fat loss, muscle retention, and endurance.',
    prerequisites: [
      'Basic fitness level',
      'Commitment to consistent cardio and strength training'
    ],
    equipment: ['bodyweight', 'jump rope', 'dumbbells'],
    goals: [
      'Achieve sustainable fat loss',
      'Improve cardiovascular endurance',
      'Retain and build lean muscle mass',
      'Increase overall fitness level'
    ],
    schedule: [
      {
        day: 1,
        restDay: false,
        exercises: [exercises[0], exercises[1], exercises[2]], // Squats, Push-ups, Deadlifts
        totalEstimatedTime: 45,
        totalCaloriesBurn: 250,
        focusAreas: ['full body', 'cardio']
      },
      {
        day: 2,
        restDay: false,
        exercises: [exercises[3], exercises[4], exercises[5]], // Jump Squats, Mountain Climbers, Burpees (HIIT)
        totalEstimatedTime: 30,
        totalCaloriesBurn: 200,
        focusAreas: ['cardio', 'core']
      },
      {
        day: 3,
        restDay: false,
        exercises: [exercises[6], exercises[7], exercises[8]], // Bulgarian Split Squats, Romanian Deadlifts, Step-ups
        totalEstimatedTime: 50,
        totalCaloriesBurn: 280,
        focusAreas: ['lower body', 'cardio']
      },
      {
        day: 4,
        restDay: true,
        exercises: [],
        totalEstimatedTime: 0,
        totalCaloriesBurn: 0,
        focusAreas: ['rest']
      },
      {
        day: 5,
        restDay: false,
        exercises: [exercises[9], exercises[10], exercises[11]], // Pull-ups, Dumbbell Rows, Shoulder Press
        totalEstimatedTime: 45,
        totalCaloriesBurn: 220,
        focusAreas: ['upper body', 'HIIT']
      },
      {
        day: 6,
        restDay: false,
        exercises: [exercises[12], exercises[13], exercises[14]], // Russian Twists, Hanging Knee Raises, Side Planks
        totalEstimatedTime: 40,
        totalCaloriesBurn: 180,
        focusAreas: ['cardio', 'core']
      },
      {
        day: 7,
        restDay: true,
        exercises: [],
        totalEstimatedTime: 0,
        totalCaloriesBurn: 0,
        focusAreas: ['rest']
      }
    ],
    status: 'published',
    created_at: '2024-05-27T10:00:00Z',
    tags: ['weight loss', 'cardio', 'strength', 'fat burning', 'intermediate'],
    featured: true,
    rating: 4.6,
    reviewCount: 110,
    completionRate: 80,
    averageWorkoutTime: 40,
    muscleGroups: ['full-body', 'legs', 'core', 'upper body'],
    equipmentRequired: ['bodyweight', 'jump rope', 'dumbbells'],
    timeOfDay: 'any',
    location: 'any',
    intensity: 'high'
  }),
];

// Helper function to get a fitness plan by ID
export const getFitnessPlanById = (id: string): FitnessPlan | undefined => {
  return fitnessPlans.find(plan => plan.id === id);
};

// Helper function to get all fitness plans
export const getAllFitnessPlans = (): FitnessPlan[] => {
  return fitnessPlans;
};

// Helper function to get featured fitness plans
export const getFeaturedFitnessPlans = (): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.featured);
};

// Helper function to get fitness plans by level
export const getFitnessPlansByLevel = (level: string): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.level === level);
};

// Helper function to get fitness plans by category
export const getFitnessPlansByCategory = (category: string): FitnessPlan[] => {
  return fitnessPlans.filter(plan => plan.category === category);
}; 