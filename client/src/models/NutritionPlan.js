export class NutritionPlan {
    id;
    user_id;
    title;
    description;
    duration; // in days
    category; // Use specific type
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
    constructor(plan) {
        this.id = plan.id;
        this.user_id = plan.user_id;
        this.title = plan.title;
        this.description = plan.description;
        this.duration = plan.duration;
        this.category = plan.category;
        this.image_url = plan.image_url;
        this.thumbnail_gif_url = plan.thumbnail_gif_url;
        this.full_gif_url = plan.full_gif_url;
        this.calorieRange = plan.calorieRange;
        this.meals = plan.meals;
        this.features = plan.features;
        this.createdBy = plan.createdBy;
        this.createdAt = plan.createdAt;
        this.updatedAt = plan.updatedAt;
        this.status = plan.status;
        this.tags = plan.tags;
        this.featured = plan.featured;
        this.rating = plan.rating;
        this.reviewCount = plan.reviewCount;
    }
    // Methods
    addMealToDay(day, mealType, meal) {
        const dayMeal = this.meals.find((m) => m.day === day);
        if (dayMeal) {
            dayMeal[mealType].push(meal);
            this.recalculateDayCalories(day);
        }
    }
    removeMealFromDay(day, mealType, mealId) {
        const dayMeal = this.meals.find((m) => m.day === day);
        if (dayMeal) {
            dayMeal[mealType] = dayMeal[mealType].filter((m) => m.id !== mealId);
            this.recalculateDayCalories(day);
        }
    }
    recalculateDayCalories(day) {
        const dayMeal = this.meals.find((m) => m.day === day);
        if (dayMeal) {
            const allMeals = [...dayMeal.breakfast, ...dayMeal.lunch, ...dayMeal.dinner, ...dayMeal.snacks];
            dayMeal.totalCalories = allMeals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0);
        }
    }
    getMealsPerDay(day) {
        const dayMeal = this.meals.find((m) => m.day === day);
        if (!dayMeal)
            return 0;
        return dayMeal.breakfast.length + dayMeal.lunch.length + dayMeal.dinner.length + dayMeal.snacks.length;
    }
    // Convert to a format suitable for storage or API
    toObject() {
        return {
            id: this.id,
            user_id: this.user_id,
            title: this.title,
            description: this.description,
            duration: this.duration,
            category: this.category,
            image_url: this.image_url,
            thumbnail_gif_url: this.thumbnail_gif_url,
            full_gif_url: this.full_gif_url,
            calorieRange: this.calorieRange,
            meals: this.meals,
            features: this.features,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.status,
            tags: this.tags,
            featured: this.featured,
            rating: this.rating,
            reviewCount: this.reviewCount,
        };
    }
    // Static factory method to create NutritionPlan from plain object
    static fromObject(obj) {
        return new NutritionPlan(obj);
    }
}
