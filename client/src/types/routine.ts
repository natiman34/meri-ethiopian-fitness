// Fitness Routine System Types
// Integrates with existing Ethiopian Fitness app types

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  exerciseType: 'strength' | 'cardio' | 'flexibility' | 'balance';
  isEthiopianTraditional: boolean;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineExercise {
  id: string;
  routineDayId: string;
  exercise: Exercise;
  orderIndex: number;
  sets?: number;
  reps?: string; // Can be "8-12", "AMRAP", "30 seconds", etc.
  weightKg?: number;
  restSeconds?: number;
  notes?: string;
  isSuperset: boolean;
  supersetGroup?: number;
  createdAt: string;
}

export interface RoutineDay {
  id: string;
  routineId: string;
  dayNumber: number;
  dayName?: string;
  focusMuscleGroups: string[];
  estimatedDurationMinutes?: number;
  restDay: boolean;
  exercises: RoutineExercise[];
  createdAt: string;
}

export interface UserRoutine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  estimatedDurationMinutes?: number;
  isPublic: boolean;
  isTemplate: boolean;
  tags: string[];
  days: RoutineDay[];
  createdAt: string;
  updatedAt: string;
}

export interface RoutineProgress {
  id: string;
  userId: string;
  routineId: string;
  routineExerciseId: string;
  workoutDate: string;
  setsCompleted?: number;
  repsCompleted?: number[];
  weightUsedKg?: number[];
  durationMinutes?: number;
  difficultyRating?: number; // 1-5 scale
  notes?: string;
  createdAt: string;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'weight_loss' | 'muscle_building' | 'ethiopian_traditional';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  targetAudience: string[];
  isFeatured: boolean;
  createdBy?: string;
  routine: UserRoutine;
  createdAt: string;
}

// Filter and Search Types
export interface ExerciseFilters {
  muscleGroups?: string[];
  equipment?: string[];
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  exerciseType?: 'strength' | 'cardio' | 'flexibility' | 'balance';
  isEthiopianTraditional?: boolean;
  searchTerm?: string;
}

export interface RoutineFilters {
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek?: number;
  durationWeeks?: number;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  searchTerm?: string;
}

// UI State Types
export interface RoutineBuilderState {
  currentRoutine: Partial<UserRoutine>;
  selectedDay: number;
  selectedExercises: Exercise[];
  isExerciseLibraryOpen: boolean;
  isEditingExercise: boolean;
  editingExerciseId?: string;
  filters: ExerciseFilters;
  searchTerm: string;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  dayId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  notes?: string;
  completed: boolean;
}

export interface WorkoutExercise {
  routineExerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  completed: boolean;
}

export interface WorkoutSet {
  setNumber: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  completed: boolean;
  restSeconds?: number;
}

// API Response Types
export interface RoutineResponse {
  routine: UserRoutine;
  totalExercises: number;
  estimatedDuration: number;
  muscleGroupsCovered: string[];
}

export interface ExerciseSearchResponse {
  exercises: Exercise[];
  total: number;
  page: number;
  limit: number;
  filters: ExerciseFilters;
}

export interface RoutineStatsResponse {
  totalRoutines: number;
  totalWorkouts: number;
  averageWorkoutDuration: number;
  favoriteExercises: Exercise[];
  progressTrend: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  date: string;
  value: number;
  metric: 'weight' | 'reps' | 'duration' | 'volume';
}

// Form Types
export interface CreateRoutineForm {
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  tags: string[];
  isPublic: boolean;
}

export interface AddExerciseForm {
  exerciseId: string;
  sets: number;
  reps: string;
  weightKg?: number;
  restSeconds: number;
  notes?: string;
}

// Error Types
export interface RoutineError {
  code: string;
  message: string;
  field?: string;
}

// Constants
export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Glutes', 'Calves'
] as const;

export const EQUIPMENT_TYPES = [
  'Bodyweight', 'Dumbbells', 'Barbell', 'Resistance Bands', 
  'Pull-up Bar', 'Kettlebell', 'Medicine Ball', 'Traditional Ethiopian'
] as const;

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const EXERCISE_TYPES = ['strength', 'cardio', 'flexibility', 'balance'] as const;
