import { NutritionPlan, type DayMeal, type CalorieRange, NutritionCategory } from "../types/content";
import { nutritionPlans, getAllNutritionPlans as getLocalAllNutritionPlans, getNutritionPlanById as getLocalNutritionPlanById, getNutritionPlansByCategory as getLocalNutritionPlansByCategory, getNutritionPlansByCalorieRange as getLocalNutritionPlansByCalorieRange } from "../data/nutritionPlans";
import { supabase } from "../lib/supabase";

// Mapping functions between database and frontend formats
const dietTypeToCategory = (dietType: string): NutritionCategory => {
  const mapping: Record<string, NutritionCategory> = {
    'traditional': 'maintenance',
    'high-protein': 'muscle-building',
    'vegetarian': 'weight-loss',
    'balanced': 'maintenance',
    'high-energy': 'weight-gain'
  };
  return mapping[dietType] || 'maintenance';
};

const categoryToDietType = (category: NutritionCategory): string => {
  const mapping: Record<NutritionCategory, string> = {
    'weight-loss': 'balanced',
    'weight-gain': 'high-energy',
    'maintenance': 'balanced',
    'muscle-building': 'high-protein',
    'endurance': 'high-energy'
  };
  return mapping[category] || 'balanced';
};

/**
 * NutritionPlanService class for handling nutrition plan operations
 * Implements the service layer in the three-tier architecture
 */
export class NutritionPlanService {
  private static instance: NutritionPlanService;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Convert database nutrition plan to frontend format
  private convertDbPlanToFrontend(dbPlan: any): NutritionPlan {
    return new NutritionPlan({
      id: dbPlan.id,
      title: dbPlan.name,
      description: dbPlan.description || '',
      duration: parseInt(dbPlan.duration) || 0,
      category: dietTypeToCategory(dbPlan.diet_type),
      image_url: '/images/plans/ethiopian-nutrition.jpg', // Default image
      calorieRange: { min: 0, max: dbPlan.calories || 0 },
      meals: dbPlan.meal_plan?.meals?.map((meal: any, index: number) => ({
        day: index + 1,
        name: `Day ${index + 1}`,
        breakfast: meal.name.toLowerCase().includes('breakfast') ? [this.convertMealToFrontend(meal)] : [],
        lunch: meal.name.toLowerCase().includes('lunch') || (!meal.name.toLowerCase().includes('breakfast') && !meal.name.toLowerCase().includes('dinner')) ? [this.convertMealToFrontend(meal)] : [],
        dinner: meal.name.toLowerCase().includes('dinner') ? [this.convertMealToFrontend(meal)] : [],
        snacks: [],
        totalCalories: meal.nutritionalInfo?.calories || 0,
        ingredients: meal.ingredients || [],
        preparation: meal.preparation || '',
        nutritionalInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
      })) || [],
      features: [
        'Authentic Ethiopian cuisine',
        'Balanced macronutrients',
        'Traditional ingredients',
        'Cultural authenticity',
        'Nutritionally optimized'
      ],
      createdBy: 'Nutrition Admin',
      createdAt: dbPlan.created_at,
      updatedAt: dbPlan.updated_at,
      status: dbPlan.status === 'published' ? 'published' : 'draft',
      tags: ['ethiopian', 'traditional', 'healthy'],
      featured: false, // Can be updated later based on admin settings
      rating: 4.5,
      reviewCount: 0
    });
  }

  // Convert meal from database format to frontend format
  private convertMealToFrontend(meal: any) {
    return {
      id: `meal-${Date.now()}-${Math.random()}`,
      name: meal.name,
      description: meal.preparation || '',
      image: '/images/meals/ethiopian-meal.jpg', // Default image
      isEthiopian: true,
      nutritionInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ingredients: meal.ingredients || [],
      preparation: meal.preparation || ''
    };
  }

  // Singleton pattern implementation
  public static getInstance(): NutritionPlanService {
    if (!NutritionPlanService.instance) {
      NutritionPlanService.instance = new NutritionPlanService();
    }
    return NutritionPlanService.instance;
  }

  // Get all nutrition plans (combining database and local data)
  public async getAllNutritionPlans(): Promise<NutritionPlan[]> {
    try {
      // Fetch from Supabase database
      const { data: dbPlans, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching nutrition plans from database:', error);
        // Fallback to local data if database fails
        return getLocalAllNutritionPlans().map(plan => new NutritionPlan(plan));
      }

      // Convert database plans to frontend format
      const convertedDbPlans = (dbPlans || []).map(plan => this.convertDbPlanToFrontend(plan));

      // Get local plans
      const localPlans = getLocalAllNutritionPlans().map(plan => new NutritionPlan(plan));

      // Combine database and local plans
      return [...convertedDbPlans, ...localPlans];
    } catch (error) {
      console.error('Error in getAllNutritionPlans:', error);
      // Fallback to local data
      return getLocalAllNutritionPlans().map(plan => new NutritionPlan(plan));
    }
  }

  // Get nutrition plan by ID (check local first for Ethiopian plans, then database)
  public async getNutritionPlanById(planId: string): Promise<NutritionPlan | null> {
    try {
      // Check if it's a local Ethiopian plan ID (starts with 'eth-')
      if (planId.startsWith('eth-')) {
        const localPlan = getLocalNutritionPlanById(planId);
        return localPlan ? new NutritionPlan(localPlan) : null;
      }

      // Try to fetch from database for UUID-based IDs
      const { data: dbPlan, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!error && dbPlan) {
        return this.convertDbPlanToFrontend(dbPlan);
      }

      return null;
    } catch (error) {
      console.error('Error fetching nutrition plan by ID:', error);
      // Fallback to local data for Ethiopian plans
      if (planId.startsWith('eth-')) {
        const localPlan = getLocalNutritionPlanById(planId);
        return localPlan ? new NutritionPlan(localPlan) : null;
      }
      return null;
    }
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

  // Filter nutrition plans by category (combining database and local data)
  public async getNutritionPlansByCategory(categoryId: NutritionCategory): Promise<NutritionPlan[]> {
    try {
      // Convert frontend category to database diet_type
      const dietType = categoryToDietType(categoryId);

      // Fetch from Supabase database
      const { data: dbPlans, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('diet_type', dietType)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching nutrition plans by category:', error);
        // Fallback to local data
        return getLocalNutritionPlansByCategory(categoryId).map(plan => new NutritionPlan(plan));
      }

      // Convert database plans to frontend format
      const convertedDbPlans = (dbPlans || []).map(plan => this.convertDbPlanToFrontend(plan));

      // Get local plans for this category
      const localPlans = getLocalNutritionPlansByCategory(categoryId).map(plan => new NutritionPlan(plan));

      // Combine database and local plans
      return [...convertedDbPlans, ...localPlans];
    } catch (error) {
      console.error('Error in getNutritionPlansByCategory:', error);
      // Fallback to local data
      return getLocalNutritionPlansByCategory(categoryId).map(plan => new NutritionPlan(plan));
    }
  }

  // Filter nutrition plans by calorie range
  public async getNutritionPlansByCalorieRange(min: number, max: number): Promise<NutritionPlan[]> {
    return Promise.resolve(getLocalNutritionPlansByCalorieRange(min, max).map(plan => new NutritionPlan(plan)));
  }
}

// Export singleton instance
export const nutritionPlanService = NutritionPlanService.getInstance();
