import { supabase } from '../lib/supabase';
import { 
  UserRoutine, 
  Exercise, 
  RoutineTemplate, 
  RoutineProgress,
  ExerciseFilters,
  RoutineFilters 
} from '../types/routine';

export class RoutineService {
  // Routine CRUD Operations
  static async getUserRoutines(userId: string): Promise<UserRoutine[]> {
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createRoutine(routine: Omit<UserRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<UserRoutine> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create routine
    const { data: createdRoutine, error: routineError } = await supabase
      .from('user_routines')
      .insert({
        user_id: user.id,
        name: routine.name,
        description: routine.description || '',
        difficulty_level: routine.difficultyLevel || 'beginner',
        duration_weeks: routine.durationWeeks || 4,
        days_per_week: routine.daysPerWeek || 3,
        estimated_duration_minutes: routine.estimatedDurationMinutes || 45,
        is_public: routine.isPublic || false,
        is_template: routine.isTemplate || false,
        tags: routine.tags || []
      })
      .select()
      .single();

    if (routineError) throw routineError;

    // Create days and exercises
    for (const day of routine.days) {
      const { data: createdDay, error: dayError } = await supabase
        .from('routine_days')
        .insert({
          routine_id: createdRoutine.id,
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

    return this.getUserRoutineById(createdRoutine.id);
  }

  static async getUserRoutineById(id: string): Promise<UserRoutine> {
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
      .eq('id', id)
      .single();

    if (error) throw error;

    // Map database fields to TypeScript interface
    const mappedRoutine = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description || '',
      difficultyLevel: data.difficulty_level || 'beginner',
      durationWeeks: data.duration_weeks || 4,
      daysPerWeek: data.days_per_week || 3,
      estimatedDurationMinutes: data.estimated_duration_minutes || 45,
      isPublic: data.is_public || false,
      isTemplate: data.is_template || false,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      days: (data.days || []).map(day => ({
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
    };

    return mappedRoutine;
  }

  static async updateRoutine(id: string, updates: Partial<UserRoutine>): Promise<void> {
    const { error } = await supabase
      .from('user_routines')
      .update({
        name: updates.name,
        description: updates.description,
        difficulty_level: updates.difficultyLevel,
        duration_weeks: updates.durationWeeks,
        days_per_week: updates.daysPerWeek,
        estimated_duration_minutes: updates.estimatedDurationMinutes,
        is_public: updates.isPublic,
        tags: updates.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteRoutine(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_routines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Exercise Operations
  static async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
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

    return mappedExercises;
  }

  static async createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        name: exercise.name,
        description: exercise.description,
        instructions: exercise.instructions,
        muscle_groups: exercise.muscleGroups,
        equipment: exercise.equipment,
        difficulty_level: exercise.difficultyLevel,
        exercise_type: exercise.exerciseType,
        is_ethiopian_traditional: exercise.isEthiopianTraditional,
        image_url: exercise.imageUrl,
        video_url: exercise.videoUrl
      })
      .select()
      .single();

    if (error) throw error;

    // Map database fields to TypeScript interface
    const mappedExercise = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      instructions: data.instructions || [],
      muscleGroups: data.muscle_groups || [],
      equipment: data.equipment || [],
      difficultyLevel: data.difficulty_level || 'beginner',
      exerciseType: data.exercise_type || 'strength',
      isEthiopianTraditional: data.is_ethiopian_traditional || false,
      imageUrl: data.image_url,
      videoUrl: data.video_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    return mappedExercise;
  }

  // Template Operations
  static async getTemplates(filters?: RoutineFilters): Promise<RoutineTemplate[]> {
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

    return data || [];
  }

  // Progress Tracking
  static async logWorkoutProgress(progress: Omit<RoutineProgress, 'id' | 'createdAt'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_routine_progress')
      .insert({
        user_id: user.id,
        routine_id: progress.routineId,
        routine_exercise_id: progress.routineExerciseId,
        workout_date: progress.workoutDate,
        sets_completed: progress.setsCompleted,
        reps_completed: progress.repsCompleted,
        weight_used_kg: progress.weightUsedKg,
        duration_minutes: progress.durationMinutes,
        difficulty_rating: progress.difficultyRating,
        notes: progress.notes
      });

    if (error) throw error;
  }

  static async getRoutineProgress(routineId: string, exerciseId?: string): Promise<RoutineProgress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('user_routine_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('routine_id', routineId)
      .order('workout_date', { ascending: false });

    if (exerciseId) {
      query = query.eq('routine_exercise_id', exerciseId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  // Utility Functions
  static async duplicateRoutine(routineId: string, newName?: string): Promise<UserRoutine> {
    const originalRoutine = await this.getUserRoutineById(routineId);
    
    const duplicatedRoutine = {
      ...originalRoutine,
      name: newName || `${originalRoutine.name} (Copy)`,
      isPublic: false,
      isTemplate: false
    };

    // Remove id and timestamps to create new routine
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...routineData } = duplicatedRoutine;
    
    return await this.createRoutine(routineData);
  }

  static async getPublicRoutines(filters?: RoutineFilters): Promise<UserRoutine[]> {
    let query = supabase
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
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.difficultyLevel) {
      query = query.eq('difficulty_level', filters.difficultyLevel);
    }
    if (filters?.daysPerWeek) {
      query = query.eq('days_per_week', filters.daysPerWeek);
    }
    if (filters?.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  // Ethiopian Traditional Exercises
  static async getEthiopianExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_ethiopian_traditional', true)
      .order('name');

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

    return mappedExercises;
  }

  // Routine Statistics
  static async getRoutineStats(userId: string) {
    const routines = await this.getUserRoutines(userId);
    
    const totalRoutines = routines.length;
    const totalExercises = routines.reduce((total, routine) => 
      total + routine.days.reduce((dayTotal, day) => dayTotal + day.exercises.length, 0), 0
    );
    
    const averageDuration = routines.length > 0 
      ? routines.reduce((total, routine) => total + (routine.estimatedDurationMinutes || 0), 0) / routines.length
      : 0;

    const publicRoutines = routines.filter(routine => routine.isPublic).length;

    return {
      totalRoutines,
      totalExercises,
      averageDuration: Math.round(averageDuration),
      publicRoutines
    };
  }
}
