import { supabase } from "@/lib/supabase"
import { FitnessPlan } from "@/models/FitnessPlan"

/**
 * FitnessPlanService class for handling fitness plan operations
 * Implements the service layer in the three-tier architecture
 */
export class FitnessPlanService {
  private static instance: FitnessPlanService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): FitnessPlanService {
    if (!FitnessPlanService.instance) {
      FitnessPlanService.instance = new FitnessPlanService()
    }
    return FitnessPlanService.instance
  }

  /**
   * Fetches all fitness plans, optionally filtered by status.
   * @param status 'draft' | 'published' | undefined
   * @returns A promise that resolves to an array of FitnessPlan objects.
   */
  public async getFitnessPlans(status?: 'draft' | 'published'): Promise<FitnessPlan[]> {
    let query = supabase.from('fitness_plans').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching fitness plans:", error)
      throw new Error(error.message || "Failed to fetch fitness plans.")
    }

    return data as FitnessPlan[]
  }

  /**
   * Fetches a single fitness plan by its ID.
   * @param id The ID of the fitness plan.
   * @returns A promise that resolves to a FitnessPlan object or null if not found.
   */
  public async getFitnessPlanById(id: string): Promise<FitnessPlan | null> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error("Error fetching fitness plan by ID:", error)
      throw new Error(error.message || "Failed to fetch fitness plan by ID.")
    }

    return data as FitnessPlan | null
  }

  /**
   * Creates a new fitness plan.
   * @param plan The fitness plan data to create. ID and created_at will be ignored.
   * @returns A promise that resolves to the created FitnessPlan object.
   */
  public async createFitnessPlan(plan: Omit<FitnessPlan, 'id' | 'created_at'>): Promise<FitnessPlan> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .insert(plan)
      .select()
      .single()

    if (error) {
      console.error("Error creating fitness plan:", error)
      throw new Error(error.message || "Failed to create fitness plan.")
    }

    return data as FitnessPlan
  }

  /**
   * Updates an existing fitness plan.
   * @param id The ID of the fitness plan to update.
   * @param updates The partial fitness plan data to update.
   * @returns A promise that resolves to the updated FitnessPlan object.
   */
  public async updateFitnessPlan(id: string, updates: Partial<FitnessPlan>): Promise<FitnessPlan> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("Error updating fitness plan:", error)
      throw new Error(error.message || "Failed to update fitness plan.")
    }

    return data as FitnessPlan
  }

  /**
   * Deletes a fitness plan by its ID.
   * @param id The ID of the fitness plan to delete.
   * @returns A promise that resolves when the deletion is successful.
   */
  public async deleteFitnessPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting fitness plan:", error)
      throw new Error(error.message || "Failed to delete fitness plan.")
    }
  }

  // Filter fitness plans by category
  public async getFitnessPlansByCategory(category: string): Promise<FitnessPlan[]> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching fitness plans by category:", error)
      throw new Error(error.message || "Failed to fetch fitness plans by category.")
    }

    return data as FitnessPlan[]
  }

  // Filter fitness plans by level
  public async getFitnessPlansByLevel(level: string): Promise<FitnessPlan[]> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('level', level)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching fitness plans by level:", error)
      throw new Error(error.message || "Failed to fetch fitness plans by level.")
    }

    return data as FitnessPlan[]
  }

  public async getFitnessPlansByCategoryAndLevel(category: string, level: string): Promise<FitnessPlan[]> {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('category', category)
      .eq('level', level)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching fitness plans by category and level:", error)
      throw new Error(error.message || "Failed to fetch fitness plans by category and level.")
    }

    return data as FitnessPlan[]
  }
}
