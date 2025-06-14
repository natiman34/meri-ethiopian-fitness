import { supabase } from '../lib/supabase';
import { MealDB } from '../types/database';
import { Meal, NutritionInfo } from '../types/content';

export interface MealFilters {
  category?: string;
  cuisine_type?: string;
  is_ethiopian?: boolean;
  difficulty_level?: string;
  search?: string;
}

export class MealService {
  private static instance: MealService;

  private constructor() {}

  public static getInstance(): MealService {
    if (!MealService.instance) {
      MealService.instance = new MealService();
    }
    return MealService.instance;
  }

  // Convert database meal to frontend meal format
  private convertToMeal(dbMeal: MealDB): Meal {
    return {
      id: dbMeal.id,
      name: dbMeal.name,
      description: dbMeal.description || '',
      image: dbMeal.image_url || '',
      isEthiopian: dbMeal.is_ethiopian,
      nutritionInfo: dbMeal.nutritional_info,
      ingredients: dbMeal.ingredients,
      preparation: dbMeal.preparation || '',
    };
  }

  // Convert frontend meal to database format
  private convertToDBMeal(meal: Partial<Meal>, userId?: string): Omit<MealDB, 'id' | 'created_at' | 'updated_at'> {
    return {
      name: meal.name || '',
      description: meal.description || null,
      image_url: meal.image || null,
      is_ethiopian: meal.isEthiopian || false,
      ingredients: meal.ingredients || [],
      preparation: meal.preparation || null,
      nutritional_info: meal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 },
      category: null, // Will be set based on context
      cuisine_type: meal.isEthiopian ? 'ethiopian' : 'international',
      difficulty_level: 'medium',
      prep_time: null,
      cook_time: null,
      servings: 1,
      tags: [],
      created_by: userId || null,
      status: 'active',
    };
  }

  // Get all meals with optional filters
  public async getAllMeals(filters?: MealFilters): Promise<Meal[]> {
    try {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.cuisine_type) {
        query = query.eq('cuisine_type', filters.cuisine_type);
      }

      if (filters?.is_ethiopian !== undefined) {
        query = query.eq('is_ethiopian', filters.is_ethiopian);
      }

      if (filters?.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(meal => this.convertToMeal(meal));
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  }

  // Get meal by ID
  public async getMealById(id: string): Promise<Meal | null> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data ? this.convertToMeal(data) : null;
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
      throw error;
    }
  }

  // Create new meal
  public async createMeal(meal: Partial<Meal>, userId?: string): Promise<Meal> {
    try {
      const dbMeal = this.convertToDBMeal(meal, userId);
      
      const { data, error } = await supabase
        .from('meals')
        .insert([dbMeal])
        .select()
        .single();

      if (error) throw error;

      return this.convertToMeal(data);
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  }

  // Update existing meal
  public async updateMeal(id: string, meal: Partial<Meal>): Promise<Meal> {
    try {
      const updateData = {
        name: meal.name,
        description: meal.description || null,
        image_url: meal.image || null,
        is_ethiopian: meal.isEthiopian,
        ingredients: meal.ingredients || [],
        preparation: meal.preparation || null,
        nutritional_info: meal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 },
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.convertToMeal(data);
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  }

  // Delete meal (soft delete by setting status to archived)
  public async deleteMeal(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }

  // Get meals by category
  public async getMealsByCategory(category: string): Promise<Meal[]> {
    return this.getAllMeals({ category });
  }

  // Get Ethiopian meals
  public async getEthiopianMeals(): Promise<Meal[]> {
    return this.getAllMeals({ is_ethiopian: true });
  }

  // Search meals
  public async searchMeals(searchTerm: string): Promise<Meal[]> {
    return this.getAllMeals({ search: searchTerm });
  }

  // Bulk create meals (useful for importing data)
  public async bulkCreateMeals(meals: Partial<Meal>[], userId?: string): Promise<Meal[]> {
    try {
      const dbMeals = meals.map(meal => this.convertToDBMeal(meal, userId));
      
      const { data, error } = await supabase
        .from('meals')
        .insert(dbMeals)
        .select();

      if (error) throw error;

      return (data || []).map(meal => this.convertToMeal(meal));
    } catch (error) {
      console.error('Error bulk creating meals:', error);
      throw error;
    }
  }
}

export const mealService = MealService.getInstance();
