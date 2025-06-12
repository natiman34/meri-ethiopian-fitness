export type SetType = 'warm-up' | 'working' | 'drop' | 'failure' | 'pyramid' | 'superset' | 'giant-set';

export interface ExerciseSet {
  setNumber: number;
  setType: SetType;
  reps: number;
  weight?: number; // in kg/lbs
  restTime: number; // in seconds
  duration?: string; // Add duration to ExerciseSet
  rpe?: number; // Rate of Perceived Exertion (1-10)
  tempo?: string; // e.g., "2-0-2" (eccentric-pause-concentric)
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
  gifUrl: string;
  videoUrl?: string;
  steps: string[];
  sets: ExerciseSet[];
  equipment: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'plyometric';
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  variations: string[];
  estimatedTime: number; // in minutes
  caloriesBurn?: number; // per set
  muscleGroup: 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'abs' | 'glutes' | 'full-body';
}

export interface DaySchedule {
  day: number;
  restDay: boolean;
  exercises: Exercise[];
  totalEstimatedTime: number; // in minutes
  totalCaloriesBurn?: number;
  focusAreas: string[];
  notes?: string;
}

export type FitnessCategory = 
  'weight-loss' |
  'weight-gain' |
  'maintenance' |
  'strength' |
  'flexibility' |
  'endurance' |
  'muscle-building' |
  'powerlifting' |
  'bodybuilding' |
  'functional' |
  'beginner' |
  'home' |
  'gym' |
  'men' |
  'women' |
  'fat-burning' |
  'leg';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export class FitnessPlan {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  category: FitnessCategory;
  level: FitnessLevel;
  duration: number; // in weeks
  image_url?: string;
  thumbnail_gif_url?: string;
  full_gif_url?: string;
  weekly_workouts: number;
  estimated_calories_burn?: number;
  difficulty: number; // 1-5 scale
  target_audience?: string;
  prerequisites: string[];
  equipment: string[];
  goals: string[];
  schedule: DaySchedule[];
  status: 'draft' | 'published';
  created_at: string;
  tags: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  completionRate?: number;
  averageWorkoutTime?: number; // in minutes
  muscleGroups: string[];
  equipmentRequired: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';
  location?: 'gym' | 'home' | 'outdoor' | 'any';
  intensity: 'low' | 'moderate' | 'high' | 'very-high';

  constructor(data: Partial<FitnessPlan>) {
    this.id = data.id || Date.now().toString();
    this.user_id = data.user_id !== undefined ? data.user_id : null; // Ensure user_id is explicitly set or null
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || 'maintenance';
    this.level = data.level || 'beginner';
    this.duration = data.duration || 0;
    this.image_url = data.image_url;
    this.thumbnail_gif_url = data.thumbnail_gif_url;
    this.full_gif_url = data.full_gif_url;
    this.weekly_workouts = data.weekly_workouts || 0;
    this.estimated_calories_burn = data.estimated_calories_burn;
    this.difficulty = data.difficulty || 0;
    this.target_audience = data.target_audience;
    this.prerequisites = data.prerequisites || [];
    this.equipment = data.equipment || [];
    this.goals = data.goals || [];
    this.schedule = data.schedule || [];
    this.status = data.status || 'draft';
    this.created_at = data.created_at || new Date().toISOString();
    this.tags = data.tags || [];
    this.featured = data.featured || false;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
    this.completionRate = data.completionRate;
    this.averageWorkoutTime = data.averageWorkoutTime;
    this.muscleGroups = data.muscleGroups || [];
    this.equipmentRequired = data.equipmentRequired || [];
    this.timeOfDay = data.timeOfDay;
    this.location = data.location;
    this.intensity = data.intensity || 'low';
  }

  addExerciseToDay(dayIndex: number, exercise: Exercise) {
    if (this.schedule[dayIndex]) {
      this.schedule[dayIndex].exercises.push(exercise);
    }
  }

  removeExerciseFromDay(dayIndex: number, exerciseId: string) {
    if (this.schedule[dayIndex]) {
      this.schedule[dayIndex].exercises = this.schedule[dayIndex].exercises.filter(ex => ex.id !== exerciseId);
    }
  }

  setRestDay(dayIndex: number, isRest: boolean) {
    if (this.schedule[dayIndex]) {
      this.schedule[dayIndex].restDay = isRest;
      if (isRest) {
        this.schedule[dayIndex].exercises = [];
      }
    }
  }

  getWorkoutsPerWeek(): number {
    return this.schedule.filter(day => !day.restDay).length;
  }

  toObject(): FitnessPlan {
    return { ...this };
  }
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  date: Date;
  exercises: {
    exerciseId: string;
    sets: {
      setNumber: number;
      reps: number;
      weight: number;
      restTime: number;
      rpe?: number;
      completed: boolean;
      notes?: string;
    }[];
    totalTime: number;
    caloriesBurn?: number;
  }[];
  totalTime: number;
  totalCaloriesBurn?: number;
  notes?: string;
  rating?: number; // 1-5
  completed: boolean;
}

export interface ProgressMetrics {
  userId: string;
  exerciseId: string;
  date: Date;
  oneRepMax?: number;
  personalBest?: {
    weight: number;
    reps: number;
    date: Date;
  };
  volume: number; // total weight lifted
  averageWeight: number;
  averageReps: number;
  totalSets: number;
  restTime: number;
  rpe: number;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: string[]; // exercise IDs
  description: string;
  image: string;
  primaryMovements: string[];
  secondaryMovements: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: 'free-weights' | 'machines' | 'cardio' | 'bodyweight' | 'resistance-bands' | 'other';
  description: string;
  image: string;
  exercises: string[]; // exercise IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  spaceRequired: 'minimal' | 'moderate' | 'large';
  cost: 'free' | 'low' | 'medium' | 'high';
}

export type NutritionCategory = 'weight-loss' | 'weight-gain' | 'maintenance' | 'muscle-building' | 'endurance';
export type NutritionLevel = 'beginner' | 'intermediate' | 'advanced';
export type NutritionStatus = 'draft' | 'published' | 'archived';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  isEthiopian: boolean;
  nutritionInfo: NutritionInfo;
  ingredients: string[];
  preparation: string;
}

export interface DayMeal {
  day: number;
  name?: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
  totalCalories: number;
  ingredients?: string[];
  preparation?: string;
  nutritionalInfo?: NutritionInfo;
}

export interface CalorieRange {
  min: number;
  max: number;
}

export class NutritionPlan {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  duration: number; // in days
  category: NutritionCategory;
  image?: string;
  image_url?: string;
  thumbnail_gif_url?: string;
  full_gif_url?: string;
  calorieRange: CalorieRange;
  meals: DayMeal[];
  features?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  tags: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;

  constructor(data: Partial<NutritionPlan>) {
    this.id = data.id || Date.now().toString();
    this.user_id = data.user_id;
    this.title = data.title || '';
    this.description = data.description || '';
    this.duration = data.duration || 0;
    this.category = data.category || 'maintenance';
    this.image = data.image;
    this.image_url = data.image_url;
    this.thumbnail_gif_url = data.thumbnail_gif_url;
    this.full_gif_url = data.full_gif_url;
    this.calorieRange = data.calorieRange || { min: 0, max: 0 };
    this.meals = data.meals || [];
    this.features = data.features || [];
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'draft';
    this.tags = data.tags || [];
    this.featured = data.featured || false;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
  }
} 