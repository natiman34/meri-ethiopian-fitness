export interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
  gifUrl: string;
  steps: string[];
  sets?: number;
  reps?: number;
  duration?: string;
  equipment?: string[];
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DaySchedule {
  day: number;
  restDay: boolean;
  exercises: Exercise[];
}

export type FitnessCategory = 'weight-loss' | 'weight-gain' | 'maintenance' | 'strength' | 'flexibility' | 'endurance';

export interface FitnessPlan {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  category: FitnessCategory;
  schedule: DaySchedule[];
  targetAudience: string;
  prerequisites: string[];
  equipment: string[];
  goals: string[];
  weeklyWorkouts: number;
  estimatedCaloriesBurn?: number;
  difficulty: number; // 1-5 scale
} 