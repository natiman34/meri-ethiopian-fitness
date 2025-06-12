import { supabase } from "@/lib/supabase";
import { 
    FitnessPlan, 
    Exercise, 
    WorkoutSession, 
    ProgressMetrics, 
    DaySchedule,
} from "../types/content";
import { exercises } from "../data/exercises";

export class EnhancedWorkoutService {
    private static instance: EnhancedWorkoutService;

    private constructor() { }

    public static getInstance(): EnhancedWorkoutService {
        if (!EnhancedWorkoutService.instance) {
            EnhancedWorkoutService.instance = new EnhancedWorkoutService();
        }
        return EnhancedWorkoutService.instance;
    }

    /**
     * Get all exercises with detailed information
     */
    public async getAllExercises(): Promise<Exercise[]> {
        return exercises;
    }

    /**
     * Get exercises by muscle group
     */
    public async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
        return exercises.filter(exercise => exercise.muscleGroup === muscleGroup);
    }

    /**
     * Get exercises by difficulty level
     */
    public async getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<Exercise[]> {
        return exercises.filter(exercise => exercise.difficulty === difficulty);
    }

    /**
     * Get exercises by equipment
     */
    public async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
        return exercises.filter(exercise => exercise.equipment.includes(equipment));
    }

    /**
     * Create a custom workout plan
     */
    public async createCustomWorkoutPlan(planData: Partial<FitnessPlan>): Promise<FitnessPlan> {
        const { data, error } = await supabase
            .from('fitness_plans')
            .insert({
                ...planData,
                status: 'published',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating custom workout plan:", error);
            throw new Error(error.message || "Failed to create workout plan.");
        }

        return data as FitnessPlan;
    }

    /**
     * Get workout plan with detailed exercise information
     */
    public async getWorkoutPlanWithExercises(planId: string): Promise<FitnessPlan & { detailedExercises: Exercise[] }> {
        const { data: plan, error } = await supabase
            .from('fitness_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error) {
            console.error("Error fetching workout plan:", error);
            throw new Error(error.message || "Failed to fetch workout plan.");
        }

        // Get detailed exercise information for each exercise in the plan
        const detailedExercises: Exercise[] = [];
        plan.schedule.forEach((day: DaySchedule) => {
            day.exercises.forEach((exercise) => {
                const detailedExercise = exercises.find(e => e.id === exercise.id);
                if (detailedExercise) {
                    detailedExercises.push(detailedExercise);
                }
            });
        });

        return {
            ...plan,
            detailedExercises
        } as FitnessPlan & { detailedExercises: Exercise[] };
    }

    /**
     * Log a workout session
     */
    public async logWorkoutSession(sessionData: Omit<WorkoutSession, 'id'>): Promise<WorkoutSession> {
        const { data, error } = await supabase
            .from('workout_sessions')
            .insert({
                ...sessionData,
                id: Date.now().toString(),
                date: sessionData.date.toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error("Error logging workout session:", error);
            throw new Error(error.message || "Failed to log workout session.");
        }

        return data as WorkoutSession;
    }

    /**
     * Get user's workout history
     */
    public async getUserWorkoutHistory(userId: string): Promise<WorkoutSession[]> {
        const { data, error } = await supabase
            .from('workout_sessions')
            .select('*')
            .eq('userId', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching workout history:", error);
            throw new Error(error.message || "Failed to fetch workout history.");
        }

        return data.map(session => ({
            ...session,
            date: new Date(session.date)
        })) as WorkoutSession[];
    }

    /**
     * Track progress metrics
     */
    public async trackProgressMetrics(metrics: Omit<ProgressMetrics, 'date'>): Promise<ProgressMetrics> {
        const { data, error } = await supabase
            .from('progress_metrics')
            .insert({
                ...metrics,
                date: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error("Error tracking progress metrics:", error);
            throw new Error(error.message || "Failed to track progress metrics.");
        }

        return data as ProgressMetrics;
    }

    /**
     * Get user's progress for a specific exercise
     */
    public async getExerciseProgress(userId: string, exerciseId: string): Promise<ProgressMetrics[]> {
        const { data, error } = await supabase
            .from('progress_metrics')
            .select('*')
            .eq('userId', userId)
            .eq('exerciseId', exerciseId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching exercise progress:", error);
            throw new Error(error.message || "Failed to fetch exercise progress.");
        }

        return data.map(metric => ({
            ...metric,
            date: new Date(metric.date)
        })) as ProgressMetrics[];
    }

    /**
     * Calculate one rep max (1RM) using Epley formula
     */
    public calculateOneRepMax(weight: number, reps: number): number {
        if (reps === 1) return weight;
        return weight * (1 + reps / 30);
    }

    /**
     * Generate workout recommendations based on user progress
     */
    public async generateWorkoutRecommendations(userId: string): Promise<Exercise[]> {
        // Get user's recent progress
        await this.getUserWorkoutHistory(userId);
        
        // Analyze weak areas and recommend exercises
        const recommendations: Exercise[] = [];
        
        // For now, return a mix of exercises
        // In a real implementation, this would analyze user data
        const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'abs'];
        const randomMuscleGroup = muscleGroups[Math.floor(Math.random() * muscleGroups.length)];
        
        const muscleGroupExercises = await this.getExercisesByMuscleGroup(randomMuscleGroup);
        recommendations.push(...muscleGroupExercises.slice(0, 3));

        return recommendations;
    }

    /**
     * Create a workout plan from template
     */
    public async createWorkoutFromTemplate(
        templateName: string,
        userId: string,
        customizations?: {
            duration?: number;
            difficulty?: 'beginner' | 'intermediate' | 'advanced';
            focusAreas?: string[];
        }
    ): Promise<FitnessPlan> {
        // Get template exercises
        const templateExercises = await this.getTemplateExercises(templateName);
        
        // Create custom schedule
        const schedule: DaySchedule[] = this.createScheduleFromExercises(
            templateExercises,
            customizations?.duration || 4,
            customizations?.focusAreas || []
        );

        const planData: Partial<FitnessPlan> = {
            title: `${templateName} Workout Plan`,
            description: `Customized ${templateName} workout plan for your fitness goals.`,
            category: 'strength',
            level: customizations?.difficulty || 'beginner',
            duration: customizations?.duration || 4,
            weekly_workouts: 3,
            difficulty: 3,
            target_audience: 'General fitness enthusiasts',
            prerequisites: [],
            equipment: ['bodyweight'],
            goals: ['Build strength', 'Improve fitness', 'Stay active'],
            schedule,
            status: 'published',
            created_at: new Date().toISOString(),
            tags: [templateName, 'custom'],
            featured: false,
            muscleGroups: customizations?.focusAreas || [],
            equipmentRequired: ['bodyweight'],
            timeOfDay: 'any',
            location: 'home',
            intensity: 'moderate'
        };

        return await this.createCustomWorkoutPlan(planData);
    }

    /**
     * Get template exercises for different workout types
     */
    private async getTemplateExercises(templateName: string): Promise<Exercise[]> {
        switch (templateName.toLowerCase()) {
            case 'full-body':
                return exercises.filter(ex => 
                    ['push-up', 'squat', 'plank', 'burpee'].includes(ex.id)
                );
            case 'upper-body':
                return exercises.filter(ex =>
                    ['push-up', 'plank'].includes(ex.id)
                );
            case 'lower-body':
                return exercises.filter(ex => 
                    ['squat'].includes(ex.id)
                );
            case 'core':
                return exercises.filter(ex => 
                    ['plank', 'mountain-climber'].includes(ex.id)
                );
            case 'cardio':
                return exercises.filter(ex => 
                    ['burpee', 'mountain-climber'].includes(ex.id)
                );
            default:
                return exercises.slice(0, 5);
        }
    }

    /**
     * Create a workout schedule from exercises
     */
    private createScheduleFromExercises(
        exercises: Exercise[],
        duration: number,
        focusAreas: string[]
    ): DaySchedule[] {
        const schedule: DaySchedule[] = [];
        
        for (let week = 1; week <= duration; week++) {
            for (let day = 1; day <= 3; day++) {
                const dayExercises = exercises.slice((day - 1) * 2, day * 2);
                const totalTime = dayExercises.reduce((sum, ex) => sum + ex.estimatedTime, 0);
                const totalCalories = dayExercises.reduce((sum, ex) => sum + (ex.caloriesBurn || 0), 0);

                schedule.push({
                    day: (week - 1) * 3 + day,
                    restDay: false,
                    exercises: dayExercises,
                    totalEstimatedTime: totalTime,
                    totalCaloriesBurn: totalCalories,
                    focusAreas: focusAreas.length > 0 ? focusAreas : ['general fitness'],
                    notes: `Week ${week}, Day ${day}`
                });
            }
        }

        return schedule;
    }

    /**
     * Get workout analytics for a user
     */
    public async getUserWorkoutAnalytics(userId: string): Promise<{
        totalWorkouts: number;
        totalTime: number;
        totalCalories: number;
        averageWorkoutTime: number;
        mostFrequentExercises: string[];
        progressTrend: 'improving' | 'maintaining' | 'declining';
    }> {
        const sessions = await this.getUserWorkoutHistory(userId);
        
        if (sessions.length === 0) {
            return {
                totalWorkouts: 0,
                totalTime: 0,
                totalCalories: 0,
                averageWorkoutTime: 0,
                mostFrequentExercises: [],
                progressTrend: 'maintaining'
            };
        }

        const totalWorkouts = sessions.length;
        const totalTime = sessions.reduce((sum, session) => sum + session.totalTime, 0);
        const totalCalories = sessions.reduce((sum, session) => sum + (session.totalCaloriesBurn || 0), 0);
        const averageWorkoutTime = totalTime / totalWorkouts;

        // Get most frequent exercises
        const exerciseCounts: { [key: string]: number } = {};
        sessions.forEach(session => {
            session.exercises.forEach(exercise => {
                exerciseCounts[exercise.exerciseId] = (exerciseCounts[exercise.exerciseId] || 0) + 1;
            });
        });

        const mostFrequentExercises = Object.entries(exerciseCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([exerciseId]) => exerciseId);

        // Simple progress trend calculation
        const recentSessions = sessions.slice(0, 5);
        const olderSessions = sessions.slice(-5);
        const recentAvgTime = recentSessions.reduce((sum, s) => sum + s.totalTime, 0) / recentSessions.length;
        const olderAvgTime = olderSessions.reduce((sum, s) => sum + s.totalTime, 0) / olderSessions.length;
        
        let progressTrend: 'improving' | 'maintaining' | 'declining' = 'maintaining';
        if (recentAvgTime > olderAvgTime * 1.1) progressTrend = 'improving';
        else if (recentAvgTime < olderAvgTime * 0.9) progressTrend = 'declining';

        return {
            totalWorkouts,
            totalTime,
            totalCalories,
            averageWorkoutTime,
            mostFrequentExercises,
            progressTrend
        };
    }
}

export default EnhancedWorkoutService;