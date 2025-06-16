import { FitnessPlan, FitnessCategory, FitnessLevel } from '../types/content';
import { getAllFitnessPlans, getFitnessPlanById, getFeaturedFitnessPlans, getFitnessPlansByLevel, getFitnessPlansByCategory } from '../data/fitnessPlans';
import { supabase } from "../lib/supabase";

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
   * Fetches all fitness plans from both local data and database, optionally filtered by status.
   * @param status 'draft' | 'published' | undefined
   * @returns A promise that resolves to an array of FitnessPlan objects.
   */
  public async getFitnessPlans(status?: string): Promise<FitnessPlan[]> {
    try {
      // Get local plans
      const localPlans = getAllFitnessPlans();

      // Get database plans
      let query = supabase
        .from('fitness_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: dbPlans, error } = await query;

      if (error) {
        console.warn('Error fetching database plans, using local only:', error);
        // Fall back to local plans only
        const filteredLocalPlans = status
          ? localPlans.filter(plan => plan.status === status)
          : localPlans;
        return filteredLocalPlans.map(plan => new FitnessPlan(plan as FitnessPlan));
      }

      console.log('Database plans fetched:', dbPlans?.length || 0, 'plans')
      console.log('Database plans:', dbPlans)

      // Combine local and database plans, avoiding duplicates
      const allPlans = [...localPlans];
      const localPlanIds = new Set(localPlans.map(plan => plan.id));

      if (dbPlans) {
        dbPlans.forEach(dbPlan => {
          if (!localPlanIds.has(dbPlan.id)) {
            allPlans.push(dbPlan as FitnessPlan);
          }
        });
      }

      const filteredPlans = status
        ? allPlans.filter(plan => plan.status === status)
        : allPlans;

      console.log('Filtered plans:', filteredPlans.length, 'plans with status:', status)
      console.log('Final plans to return:', filteredPlans)

      return filteredPlans.map(plan => new FitnessPlan(plan as FitnessPlan));
    } catch (error) {
      console.error('Error fetching fitness plans:', error);
      throw new Error('Failed to fetch fitness plans');
    }
  }

  /**
   * Fetches a single fitness plan by its ID from both database and local data.
   * @param id The ID of the fitness plan.
   * @returns A promise that resolves to a FitnessPlan object or null if not found.
   */
  public async getFitnessPlanById(id: string): Promise<FitnessPlan | null> {
    try {
      console.log('Searching for plan with ID:', id);

      // First try to get from database
      const { data: dbPlan, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && dbPlan) {
        console.log('Found plan in database:', dbPlan);
        return new FitnessPlan(dbPlan);
      }

      if (error) {
        console.log('Database error (trying local):', error);
      }

      // Fallback to local data
      const localPlan = getFitnessPlanById(id);
      if (localPlan) {
        console.log('Found plan in local data:', localPlan);
        return new FitnessPlan(localPlan as FitnessPlan);
      }

      console.log('Plan not found in database or local data');
      return null;
    } catch (error) {
      console.error('Error fetching fitness plan:', error);
      throw new Error('Failed to fetch fitness plan');
    }
  }

  /**
   * Creates a new fitness plan.
   * @param plan The fitness plan data to create. ID and created_at will be ignored.
   * @returns A promise that resolves to the created FitnessPlan object.
   */
  public async createFitnessPlan(plan: Omit<FitnessPlan, 'id' | 'created_at'>): Promise<FitnessPlan> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPlanData = {
        ...plan,
        id: `plan-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: plan.status || 'draft',
        featured: plan.featured || false,
        rating: plan.rating || undefined,
        reviewCount: plan.reviewCount || 0,
        completionRate: plan.completionRate || 0,
        user_id: plan.user_id || null,
        image_url: plan.image_url || undefined,
        thumbnail_gif_url: plan.thumbnail_gif_url || undefined,
        full_gif_url: plan.full_gif_url || undefined,
        estimated_calories_burn: plan.estimated_calories_burn || undefined,
        difficulty: plan.difficulty || 1,
        target_audience: plan.target_audience || undefined,
        prerequisites: plan.prerequisites || [],
        equipment: plan.equipment || [],
        goals: plan.goals || [],
        schedule: plan.schedule || [],
        tags: plan.tags || [],
        averageWorkoutTime: plan.averageWorkoutTime || undefined,
        muscleGroups: plan.muscleGroups || [],
        equipmentRequired: plan.equipmentRequired || [],
        timeOfDay: plan.timeOfDay || undefined,
        location: plan.location || undefined,
        intensity: plan.intensity || 'low',
      };
      
      const newPlan = new FitnessPlan(newPlanData);
      
      // In a real application, this would be saved to a database
      console.log('Created new fitness plan:', newPlan);
      
      return newPlan;
    } catch (error) {
      console.error('Error creating fitness plan:', error);
      throw new Error('Failed to create fitness plan');
    }
  }

  /**
   * Updates an existing fitness plan.
   * @param id The ID of the fitness plan to update.
   * @param updates The partial fitness plan data to update.
   * @returns A promise that resolves to the updated FitnessPlan object.
   */
  public async updateFitnessPlan(id: string, updates: Partial<FitnessPlan>): Promise<FitnessPlan> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const planData = getFitnessPlanById(id);
      if (!planData) {
        throw new Error('Fitness plan not found');
      }
      
      const updatedPlanData = {
        ...planData,
        ...updates
      };
      
      const updatedPlan = new FitnessPlan(updatedPlanData);

      // In a real application, this would be saved to a database
      console.log('Updated fitness plan:', updatedPlan);
      
      return updatedPlan;
    } catch (error) {
      console.error('Error updating fitness plan:', error);
      throw new Error('Failed to update fitness plan');
    }
  }

  /**
   * Deletes a fitness plan by its ID.
   * @param id The ID of the fitness plan to delete.
   * @returns A promise that resolves when the deletion is successful.
   */
  public async deleteFitnessPlan(id: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const plan = getFitnessPlanById(id);
      if (!plan) {
        throw new Error('Fitness plan not found');
      }
      
      // In a real application, this would be deleted from a database
      console.log('Deleted fitness plan:', id);
    } catch (error) {
      console.error('Error deleting fitness plan:', error);
      throw new Error('Failed to delete fitness plan');
    }
  }

  // Filter fitness plans by category
  public async getFitnessPlansByCategory(category: FitnessCategory): Promise<FitnessPlan[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return getFitnessPlansByCategory(category).map(plan => new FitnessPlan(plan as FitnessPlan));
    } catch (error) {
      console.error('Error fetching fitness plans by category:', error);
      throw new Error('Failed to fetch fitness plans by category');
    }
  }

  // Filter fitness plans by level
  public async getFitnessPlansByLevel(level: FitnessLevel): Promise<FitnessPlan[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return getFitnessPlansByLevel(level).map(plan => new FitnessPlan(plan as FitnessPlan));
    } catch (error) {
      console.error('Error fetching fitness plans by level:', error);
      throw new Error('Failed to fetch fitness plans by level');
    }
  }

  public async getFitnessPlansByCategoryAndLevel(category: FitnessCategory, level: FitnessLevel): Promise<FitnessPlan[]> {
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

    return (data || []).map(plan => new FitnessPlan(plan as FitnessPlan));
  }

  static async getFeaturedFitnessPlans(): Promise<FitnessPlan[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return getFeaturedFitnessPlans().map(plan => new FitnessPlan(plan as FitnessPlan));
    } catch (error) {
      console.error('Error fetching featured fitness plans:', error);
      throw new Error('Failed to fetch featured fitness plans');
    }
  }

  static async searchFitnessPlans(query: string): Promise<FitnessPlan[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const allPlans = getAllFitnessPlans();
      const searchTerm = query.toLowerCase();
      
      return allPlans.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm) ||
        plan.description.toLowerCase().includes(searchTerm) ||
        plan.category.toLowerCase().includes(searchTerm) ||
        plan.goals.some(goal => goal.toLowerCase().includes(searchTerm)) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ).map(plan => new FitnessPlan(plan as FitnessPlan));
    } catch (error) {
      console.error('Error searching fitness plans:', error);
      throw new Error('Failed to search fitness plans');
    }
  }
}
