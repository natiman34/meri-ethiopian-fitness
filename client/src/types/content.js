export class FitnessPlan {
    id;
    user_id;
    title;
    description;
    category;
    level;
    duration; // in weeks
    image_url;
    thumbnail_gif_url;
    full_gif_url;
    weekly_workouts;
    estimated_calories_burn;
    difficulty; // 1-5 scale
    target_audience;
    prerequisites;
    equipment;
    goals;
    schedule;
    status;
    created_at;
    updated_at;
    tags;
    featured;
    rating;
    reviewCount;
    completionRate;
    averageWorkoutTime; // in minutes
    muscleGroups;
    equipmentRequired;
    timeOfDay;
    location;
    intensity;
    // Additional database fields
    muscle_groups;
    equipment_required;
    time_of_day;
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.user_id = data.user_id || data.planner_id || null; // Handle both user_id and planner_id
        this.title = data.title || data.name || ''; // Handle both title and name
        this.description = data.description || '';
        this.category = data.category || data.plan_type || 'maintenance'; // Handle both category and plan_type
        this.level = data.level || data.difficulty_level || 'beginner'; // Handle both level and difficulty_level
        this.duration = typeof data.duration === 'string' ? parseInt(data.duration) : (data.duration || 0); // Handle string duration
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
        this.schedule = data.schedule || data.exercise_list || []; // Handle both schedule and exercise_list
        this.status = data.status || 'draft';
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at;
        this.tags = data.tags || [];
        this.featured = data.featured || false;
        this.rating = data.rating;
        this.reviewCount = data.reviewCount || data.review_count;
        this.completionRate = data.completionRate || data.completion_rate;
        this.averageWorkoutTime = data.averageWorkoutTime || data.average_workout_time;
        // Handle both camelCase and snake_case for database compatibility
        this.muscleGroups = data.muscleGroups || data.muscle_groups || [];
        this.equipmentRequired = data.equipmentRequired || data.equipment_required || [];
        this.timeOfDay = data.timeOfDay || data.time_of_day;
        this.location = data.location;
        this.intensity = data.intensity || 'low';
        // Additional database fields
        this.muscle_groups = data.muscle_groups || data.muscleGroups || [];
        this.equipment_required = data.equipment_required || data.equipmentRequired || [];
        this.time_of_day = data.time_of_day || data.timeOfDay;
    }
    addExerciseToDay(dayIndex, exercise) {
        if (this.schedule[dayIndex]) {
            this.schedule[dayIndex].exercises.push(exercise);
        }
    }
    removeExerciseFromDay(dayIndex, exerciseId) {
        if (this.schedule[dayIndex]) {
            this.schedule[dayIndex].exercises = this.schedule[dayIndex].exercises.filter(ex => ex.id !== exerciseId);
        }
    }
    setRestDay(dayIndex, isRest) {
        if (this.schedule[dayIndex]) {
            this.schedule[dayIndex].restDay = isRest;
            if (isRest) {
                this.schedule[dayIndex].exercises = [];
            }
        }
    }
    getWorkoutsPerWeek() {
        return this.schedule.filter(day => !day.restDay).length;
    }
    toObject() {
        return { ...this };
    }
}
export class NutritionPlan {
    id;
    user_id;
    title;
    description;
    duration; // in days
    category;
    image;
    image_url;
    thumbnail_gif_url;
    full_gif_url;
    calorieRange;
    meals;
    features;
    createdBy;
    createdAt;
    updatedAt;
    status;
    tags;
    featured;
    rating;
    reviewCount;
    constructor(data) {
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
