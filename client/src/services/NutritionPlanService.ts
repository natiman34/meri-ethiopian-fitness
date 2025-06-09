import { NutritionPlan, type DayMeal, type CalorieRange } from "../models/NutritionPlan"
import { supabase } from "@/lib/supabaseClient"

/**
 * NutritionPlanService class for handling nutrition plan operations
 * Implements the service layer in the three-tier architecture
 */
export class NutritionPlanService {
  private static instance: NutritionPlanService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): NutritionPlanService {
    if (!NutritionPlanService.instance) {
      NutritionPlanService.instance = new NutritionPlanService()
    }
    return NutritionPlanService.instance
  }

  // Get all nutrition plans
  public async getAllNutritionPlans(): Promise<NutritionPlan[]> {
    try {
      const { data, error } = await supabase.from("nutrition_plans").select("*")

      if (error) {
        console.error("Error fetching nutrition plans:", error)
        throw error
      }
      return data as NutritionPlan[]
    } catch (error) {
      console.error("Get nutrition plans error:", error)
      throw error
    }
  }

  // Get nutrition plan by ID
  public async getNutritionPlanById(planId: string): Promise<NutritionPlan | null> {
    try {
      const { data, error } = await supabase
        .from("nutrition_plans")
        .select("*")
        .eq("id", planId)
        .single()

      if (error) {
        console.error(`Error fetching nutrition plan with ID ${planId}:`, error)
        throw error
      }
      return data as NutritionPlan
    } catch (error) {
      console.error("Get nutrition plan error:", error)
      throw error
    }
  }

  // Create a new nutrition plan
  public async createNutritionPlan(
    title: string,
    description: string,
    duration: number,
    categoryId: string,
    image: string,
    calorieRange: CalorieRange,
    meals: DayMeal[],
    createdBy: string,
  ): Promise<NutritionPlan> {
    try {
      // Create a new NutritionPlan object
      const plan = new NutritionPlan(
        Date.now().toString(), // Generate a temporary ID
        title,
        description,
        duration,
        categoryId,
        image,
        calorieRange,
        meals,
        createdBy,
      )

      const { data, error } = await supabase
        .from("nutrition_plans")
        .insert(plan.toObject())
        .select()
        .single()

      if (error) {
        console.error("Error creating nutrition plan:", error)
        throw error
      }

      // Return the created plan with the server-assigned ID
      return NutritionPlan.fromObject(data)
    } catch (error) {
      console.error("Create nutrition plan error:", error)
      throw error
    }
  }

  // Update an existing nutrition plan
  public async updateNutritionPlan(plan: NutritionPlan): Promise<NutritionPlan> {
    try {
      const { data, error } = await supabase
        .from("nutrition_plans")
        .update(plan.toObject())
        .eq("id", plan.id)
        .select()
        .single()

      if (error) {
        console.error(`Error updating nutrition plan with ID ${plan.id}:`, error)
        throw error
      }

      // Return the updated plan
      return NutritionPlan.fromObject(data)
    } catch (error) {
      console.error("Update nutrition plan error:", error)
      throw error
    }
  }

  // Delete a nutrition plan
  public async deleteNutritionPlan(planId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("nutrition_plans")
        .delete()
        .eq("id", planId)

      if (error) {
        console.error(`Error deleting nutrition plan with ID ${planId}:`, error)
        throw error
      }
    } catch (error) {
      console.error("Delete nutrition plan error:", error)
      throw error
    }
  }

  // Filter nutrition plans by category
  public async getNutritionPlansByCategory(categoryId: string): Promise<NutritionPlan[]> {
    try {
      const { data, error } = await supabase
        .from("nutrition_plans")
        .select("*")
        .eq("category_id", categoryId)

      if (error) {
        console.error("Get nutrition plans by category error:", error)
        throw error
      }
      return data as NutritionPlan[]
    } catch (error) {
      console.error("Get nutrition plans by category error:", error)
      throw error
    }
  }

  // Filter nutrition plans by calorie range
  public async getNutritionPlansByCalorieRange(min: number, max: number): Promise<NutritionPlan[]> {
    try {
      const { data, error } = await supabase
        .from("nutrition_plans")
        .select("*")
        .gte("calorie_range_min", min)
        .lte("calorie_range_max", max)

      if (error) {
        console.error("Get nutrition plans by calorie range error:", error)
        throw error
      }
      return data as NutritionPlan[]
    } catch (error) {
      console.error("Get nutrition plans by calorie range error:", error)
      throw error
    }
  }
}
