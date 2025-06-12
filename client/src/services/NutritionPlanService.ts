import { NutritionPlan, type DayMeal, type CalorieRange, NutritionCategory } from "../types/content";
import { nutritionPlans, getAllNutritionPlans as getLocalAllNutritionPlans, getNutritionPlanById as getLocalNutritionPlanById, getNutritionPlansByCategory as getLocalNutritionPlansByCategory, getNutritionPlansByCalorieRange as getLocalNutritionPlansByCalorieRange } from "../data/nutritionPlans";
// import { supabase } from "@/lib/supabase"; // Comment out or remove if no longer needed

/**
 * NutritionPlanService class for handling nutrition plan operations
 * Implements the service layer in the three-tier architecture
 */
export class NutritionPlanService {
  private static instance: NutritionPlanService;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): NutritionPlanService {
    if (!NutritionPlanService.instance) {
      NutritionPlanService.instance = new NutritionPlanService();
    }
    return NutritionPlanService.instance;
  }

  // Get all nutrition plans
  public async getAllNutritionPlans(): Promise<NutritionPlan[]> {
    // return local data instead of fetching from Supabase
    return Promise.resolve(getLocalAllNutritionPlans().map(plan => new NutritionPlan(plan)));
  }

  // Get nutrition plan by ID
  public async getNutritionPlanById(planId: string): Promise<NutritionPlan | null> {
    // return local data instead of fetching from Supabase
    const localPlan = getLocalNutritionPlanById(planId);
    return Promise.resolve(localPlan ? new NutritionPlan(localPlan) : null);
  }

  // Create a new nutrition plan (Placeholder for local data, won't persist)
  public async createNutritionPlan(planData: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionPlan> {
    console.warn("createNutritionPlan is a placeholder and does not persist data in local mode.");
    const newPlan: NutritionPlan = new NutritionPlan({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...planData,
      // Ensure fields that might be missing from partial are defaulted if necessary
      user_id: planData.user_id || undefined,
      image_url: planData.image_url || undefined,
      thumbnail_gif_url: planData.thumbnail_gif_url || undefined,
      full_gif_url: planData.full_gif_url || undefined,
      status: planData.status || 'draft',
      tags: planData.tags || [],
      featured: planData.featured || false,
      rating: planData.rating || undefined,
      reviewCount: planData.reviewCount || undefined,
      meals: planData.meals || [],
      calorieRange: planData.calorieRange || { min: 0, max: 0 },
      createdBy: planData.createdBy || undefined,
    });
    // In a real app, you might add it to the local array, but for this demo, we just return it.
    return Promise.resolve(newPlan);
  }

  // Update an existing nutrition plan (Placeholder for local data, won't persist)
  public async updateNutritionPlan(plan: NutritionPlan): Promise<NutritionPlan> {
    console.warn("updateNutritionPlan is a placeholder and does not persist data in local mode.");
    // In a real app, you would find and update the plan in the local array.
    return Promise.resolve(new NutritionPlan(plan));
  }

  // Delete a nutrition plan (Placeholder for local data, won't persist)
  public async deleteNutritionPlan(planId: string): Promise<void> {
    console.warn("deleteNutritionPlan is a placeholder and does not persist data in local mode.");
    return Promise.resolve();
  }

  // Filter nutrition plans by category
  public async getNutritionPlansByCategory(categoryId: NutritionCategory): Promise<NutritionPlan[]> {
    return Promise.resolve(getLocalNutritionPlansByCategory(categoryId).map(plan => new NutritionPlan(plan)));
  }

  // Filter nutrition plans by calorie range
  public async getNutritionPlansByCalorieRange(min: number, max: number): Promise<NutritionPlan[]> {
    return Promise.resolve(getLocalNutritionPlansByCalorieRange(min, max).map(plan => new NutritionPlan(plan)));
  }
}
