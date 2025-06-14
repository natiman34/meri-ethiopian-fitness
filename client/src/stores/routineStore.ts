import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  UserRoutine, 
  Exercise, 
  RoutineTemplate, 
  RoutineProgress,
  ExerciseFilters,
  RoutineFilters,
  WorkoutSession 
} from '../types/routine';
import { supabase } from '../lib/supabase';

interface RoutineState {
  // Data
  routines: UserRoutine[];
  exercises: Exercise[];
  templates: RoutineTemplate[];
  progress: RoutineProgress[];
  currentWorkout: WorkoutSession | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRoutines: () => Promise<void>;
  fetchExercises: (filters?: ExerciseFilters) => Promise<void>;
  fetchTemplates: (filters?: RoutineFilters) => Promise<void>;
  createRoutine: (routine: Omit<UserRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<UserRoutine>;
  updateRoutine: (id: string, updates: Partial<UserRoutine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  duplicateRoutine: (id: string, name?: string) => Promise<UserRoutine>;
  
  // Exercise Management
  createExercise: (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Exercise>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  
  // Progress Tracking
  logWorkout: (workout: Omit<WorkoutSession, 'id'>) => Promise<void>;
  getProgress: (routineId: string, exerciseId?: string) => Promise<RoutineProgress[]>;
  
  // Workout Session
  startWorkout: (routineId: string, dayId: string) => Promise<void>;
  endWorkout: () => Promise<void>;
  updateWorkoutExercise: (exerciseId: string, updates: any) => void;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useRoutineStore = create<RoutineState>()(
  devtools(
    (set, get) => ({
      // Initial State
      routines: [],
      exercises: [],
      templates: [],
      progress: [],
      currentWorkout: null,
      isLoading: false,
      error: null,

      // Fetch Routines
      fetchRoutines: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('user_routines')
            .select(`
              *,
              days:routine_days(
                *,
                exercises:routine_exercises(
                  *,
                  exercise:exercises(*)
                )
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Map database fields to TypeScript interface
          const mappedRoutines = (data || []).map(routine => ({
            id: routine.id,
            userId: routine.user_id,
            name: routine.name,
            description: routine.description || '',
            difficultyLevel: routine.difficulty_level || 'beginner',
            durationWeeks: routine.duration_weeks || 4,
            daysPerWeek: routine.days_per_week || 3,
            estimatedDurationMinutes: routine.estimated_duration_minutes || 45,
            isPublic: routine.is_public || false,
            isTemplate: routine.is_template || false,
            tags: routine.tags || [],
            createdAt: routine.created_at,
            updatedAt: routine.updated_at,
            days: (routine.days || []).map(day => ({
              id: day.id,
              routineId: day.routine_id,
              dayNumber: day.day_number,
              dayName: day.day_name || '',
              focusMuscleGroups: day.focus_muscle_groups || [],
              estimatedDurationMinutes: day.estimated_duration_minutes || 45,
              restDay: day.rest_day || false,
              exercises: (day.exercises || []).map(exercise => ({
                id: exercise.id,
                routineDayId: exercise.routine_day_id,
                orderIndex: exercise.order_index || 0,
                sets: exercise.sets || 3,
                reps: exercise.reps || '10',
                weightKg: exercise.weight_kg,
                restSeconds: exercise.rest_seconds || 60,
                notes: exercise.notes || '',
                isSuperset: exercise.is_superset || false,
                supersetGroup: exercise.superset_group,
                exercise: {
                  id: exercise.exercise.id,
                  name: exercise.exercise.name,
                  description: exercise.exercise.description || '',
                  instructions: exercise.exercise.instructions || [],
                  muscleGroups: exercise.exercise.muscle_groups || [],
                  equipment: exercise.exercise.equipment || [],
                  difficultyLevel: exercise.exercise.difficulty_level || 'beginner',
                  exerciseType: exercise.exercise.exercise_type || 'strength',
                  isEthiopianTraditional: exercise.exercise.is_ethiopian_traditional || false,
                  imageUrl: exercise.exercise.image_url,
                  videoUrl: exercise.exercise.video_url,
                  createdAt: exercise.exercise.created_at,
                  updatedAt: exercise.exercise.updated_at
                }
              }))
            }))
          }));

          set({ routines: mappedRoutines, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Fetch Exercises
      fetchExercises: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          let query = supabase
            .from('exercises')
            .select('*')
            .order('name');

          // Apply filters
          if (filters?.muscleGroups?.length) {
            query = query.overlaps('muscle_groups', filters.muscleGroups);
          }
          if (filters?.equipment?.length) {
            query = query.overlaps('equipment', filters.equipment);
          }
          if (filters?.difficultyLevel) {
            query = query.eq('difficulty_level', filters.difficultyLevel);
          }
          if (filters?.exerciseType) {
            query = query.eq('exercise_type', filters.exerciseType);
          }
          if (filters?.isEthiopianTraditional !== undefined) {
            query = query.eq('is_ethiopian_traditional', filters.isEthiopianTraditional);
          }
          if (filters?.searchTerm) {
            query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
          }

          const { data, error } = await query;
          if (error) throw error;

          // Map database fields to TypeScript interface
          const mappedExercises = (data || []).map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description || '',
            instructions: exercise.instructions || [],
            muscleGroups: exercise.muscle_groups || [],
            equipment: exercise.equipment || [],
            difficultyLevel: exercise.difficulty_level || 'beginner',
            exerciseType: exercise.exercise_type || 'strength',
            isEthiopianTraditional: exercise.is_ethiopian_traditional || false,
            imageUrl: exercise.image_url,
            videoUrl: exercise.video_url,
            createdAt: exercise.created_at,
            updatedAt: exercise.updated_at
          }));

          set({ exercises: mappedExercises, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Fetch Templates
      fetchTemplates: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          let query = supabase
            .from('routine_templates')
            .select(`
              *,
              routine:routine_id(
                *,
                days:routine_days(
                  *,
                  exercises:routine_exercises(
                    *,
                    exercise:exercises(*)
                  )
                )
              )
            `)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

          // Apply filters
          if (filters?.difficultyLevel) {
            query = query.eq('difficulty_level', filters.difficultyLevel);
          }
          if (filters?.category) {
            query = query.eq('category', filters.category);
          }
          if (filters?.searchTerm) {
            query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
          }

          const { data, error } = await query;
          if (error) throw error;

          set({ templates: data || [], isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Create Routine
      createRoutine: async (routineData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          // Create routine
          const { data: routine, error: routineError } = await supabase
            .from('user_routines')
            .insert({
              name: routineData.name,
              description: routineData.description,
              difficulty_level: routineData.difficultyLevel,
              duration_weeks: routineData.durationWeeks,
              days_per_week: routineData.daysPerWeek,
              estimated_duration_minutes: routineData.estimatedDurationMinutes,
              is_public: routineData.isPublic || false,
              is_template: routineData.isTemplate || false,
              tags: routineData.tags || [],
              user_id: user.id
            })
            .select()
            .single();

          if (routineError) throw routineError;

          // Create days and exercises
          for (const day of routineData.days) {
            const { data: createdDay, error: dayError } = await supabase
              .from('routine_days')
              .insert({
                routine_id: routine.id,
                day_number: day.dayNumber,
                day_name: day.dayName,
                focus_muscle_groups: day.focusMuscleGroups,
                estimated_duration_minutes: day.estimatedDurationMinutes,
                rest_day: day.restDay
              })
              .select()
              .single();

            if (dayError) throw dayError;

            // Create exercises for this day
            if (day.exercises.length > 0) {
              const exercisesToInsert = day.exercises.map(exercise => ({
                routine_day_id: createdDay.id,
                exercise_id: exercise.exercise.id,
                order_index: exercise.orderIndex,
                sets: exercise.sets,
                reps: exercise.reps,
                weight_kg: exercise.weightKg,
                rest_seconds: exercise.restSeconds,
                notes: exercise.notes,
                is_superset: exercise.isSuperset,
                superset_group: exercise.supersetGroup
              }));

              const { error: exercisesError } = await supabase
                .from('routine_exercises')
                .insert(exercisesToInsert);

              if (exercisesError) throw exercisesError;
            }
          }

          // Fetch updated routines
          await get().fetchRoutines();
          set({ isLoading: false });

          return routine;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      // Update Routine
      updateRoutine: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updateData: any = {
            updated_at: new Date().toISOString()
          };

          // Map camelCase to snake_case
          if (updates.name !== undefined) updateData.name = updates.name;
          if (updates.description !== undefined) updateData.description = updates.description;
          if (updates.difficultyLevel !== undefined) updateData.difficulty_level = updates.difficultyLevel;
          if (updates.durationWeeks !== undefined) updateData.duration_weeks = updates.durationWeeks;
          if (updates.daysPerWeek !== undefined) updateData.days_per_week = updates.daysPerWeek;
          if (updates.estimatedDurationMinutes !== undefined) updateData.estimated_duration_minutes = updates.estimatedDurationMinutes;
          if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
          if (updates.isTemplate !== undefined) updateData.is_template = updates.isTemplate;
          if (updates.tags !== undefined) updateData.tags = updates.tags;

          const { error } = await supabase
            .from('user_routines')
            .update(updateData)
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            routines: state.routines.map(routine =>
              routine.id === id ? { ...routine, ...updates } : routine
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Delete Routine
      deleteRoutine: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('user_routines')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            routines: state.routines.filter(routine => routine.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Duplicate Routine
      duplicateRoutine: async (id, name) => {
        const routine = get().routines.find(r => r.id === id);
        if (!routine) throw new Error('Routine not found');

        const duplicatedRoutine = {
          ...routine,
          name: name || `${routine.name} (Copy)`,
          isPublic: false
        };

        // Remove id and timestamps to create new routine
        const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...routineData } = duplicatedRoutine;
        
        return await get().createRoutine(routineData);
      },

      // Create Exercise
      createExercise: async (exerciseData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('exercises')
            .insert({
              ...exerciseData,
              muscle_groups: exerciseData.muscleGroups,
              difficulty_level: exerciseData.difficultyLevel,
              exercise_type: exerciseData.exerciseType,
              is_ethiopian_traditional: exerciseData.isEthiopianTraditional,
              image_url: exerciseData.imageUrl,
              video_url: exerciseData.videoUrl
            })
            .select()
            .single();

          if (error) throw error;

          // Update local state
          set(state => ({
            exercises: [...state.exercises, data],
            isLoading: false
          }));

          return data;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      // Update Exercise
      updateExercise: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('exercises')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            exercises: state.exercises.map(exercise =>
              exercise.id === id ? { ...exercise, ...updates } : exercise
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Delete Exercise
      deleteExercise: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            exercises: state.exercises.filter(exercise => exercise.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Log Workout
      logWorkout: async (workout) => {
        set({ isLoading: true, error: null });
        try {
          // Implementation for logging workout progress
          // This would involve creating records in user_routine_progress table
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      // Get Progress
      getProgress: async (routineId, exerciseId) => {
        try {
          let query = supabase
            .from('user_routine_progress')
            .select('*')
            .eq('routine_id', routineId)
            .order('workout_date', { ascending: false });

          if (exerciseId) {
            query = query.eq('routine_exercise_id', exerciseId);
          }

          const { data, error } = await query;
          if (error) throw error;

          return data || [];
        } catch (error) {
          set({ error: (error as Error).message });
          return [];
        }
      },

      // Start Workout
      startWorkout: async (routineId, dayId) => {
        const routine = get().routines.find(r => r.id === routineId);
        const day = routine?.days.find(d => d.id === dayId);
        
        if (!routine || !day) throw new Error('Routine or day not found');

        const workout: WorkoutSession = {
          id: crypto.randomUUID(),
          routineId,
          dayId,
          userId: '', // Will be set from auth
          startTime: new Date().toISOString(),
          exercises: day.exercises.map(exercise => ({
            routineExerciseId: exercise.id,
            exercise: exercise.exercise,
            sets: Array.from({ length: exercise.sets || 3 }, (_, i) => ({
              setNumber: i + 1,
              reps: undefined,
              weightKg: exercise.weightKg,
              durationSeconds: undefined,
              completed: false,
              restSeconds: exercise.restSeconds
            })),
            notes: exercise.notes,
            completed: false
          })),
          completed: false
        };

        set({ currentWorkout: workout });
      },

      // End Workout
      endWorkout: async () => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const completedWorkout = {
          ...workout,
          endTime: new Date().toISOString(),
          completed: true
        };

        // Save workout to database
        await get().logWorkout(completedWorkout);
        set({ currentWorkout: null });
      },

      // Update Workout Exercise
      updateWorkoutExercise: (exerciseId, updates) => {
        set(state => {
          if (!state.currentWorkout) return state;

          return {
            currentWorkout: {
              ...state.currentWorkout,
              exercises: state.currentWorkout.exercises.map(exercise =>
                exercise.routineExerciseId === exerciseId
                  ? { ...exercise, ...updates }
                  : exercise
              )
            }
          };
        });
      },

      // Utility Functions
      clearError: () => set({ error: null }),
      
      reset: () => set({
        routines: [],
        exercises: [],
        templates: [],
        progress: [],
        currentWorkout: null,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'routine-store'
    }
  )
);
