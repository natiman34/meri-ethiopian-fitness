/**
 * NutritionPlan class representing a meal plan in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
import { NutritionPlan as INutritionPlan, CalorieRange, DayMeal, Meal } from "../types/content";

export class NutritionPlan implements INutritionPlan {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  duration: number; // in days
  category: "weight-loss" | "weight-gain" | "maintenance" | "muscle-building" | "endurance"; // Use specific type
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

  constructor(
    plan: INutritionPlan
  ) {
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
  addMealToDay(day: number, mealType: "breakfast" | "lunch" | "dinner" | "snacks", meal: Meal): void {
    const dayMeal = this.meals.find((m) => m.day === day);
    if (dayMeal) {
      dayMeal[mealType].push(meal);
      this.recalculateDayCalories(day);
    }
  }

  removeMealFromDay(day: number, mealType: "breakfast" | "lunch" | "dinner" | "snacks", mealId: string): void {
    const dayMeal = this.meals.find((m) => m.day === day);
    if (dayMeal) {
      dayMeal[mealType] = dayMeal[mealType].filter((m) => m.id !== mealId);
      this.recalculateDayCalories(day);
    }
  }

  private recalculateDayCalories(day: number): void {
    const dayMeal = this.meals.find((m) => m.day === day);
    if (dayMeal) {
      const allMeals = [...dayMeal.breakfast, ...dayMeal.lunch, ...dayMeal.dinner, ...dayMeal.snacks];

      dayMeal.totalCalories = allMeals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0);
    }
  }

  getMealsPerDay(day: number): number {
    const dayMeal = this.meals.find((m) => m.day === day);
    if (!dayMeal) return 0;

    return dayMeal.breakfast.length + dayMeal.lunch.length + dayMeal.dinner.length + dayMeal.snacks.length;
  }

  // Convert to a format suitable for storage or API
  toObject(): INutritionPlan {
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
  static fromObject(obj: INutritionPlan): NutritionPlan {
    return new NutritionPlan(obj);
  }
}
