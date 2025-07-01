import { supabase } from '../lib/supabase';
export class MealService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!MealService.instance) {
            MealService.instance = new MealService();
        }
        return MealService.instance;
    }
    // Convert database meal to frontend meal format
    convertToMeal(dbMeal) {
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
    convertToDBMeal(meal, userId) {
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
    async getAllMeals(filters) {
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
            if (error)
                throw error;
            return (data || []).map(meal => this.convertToMeal(meal));
        }
        catch (error) {
            console.error('Error fetching meals:', error);
            throw error;
        }
    }
    // Get meal by ID
    async getMealById(id) {
        try {
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .eq('id', id)
                .eq('status', 'active')
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return null; // Not found
                throw error;
            }
            return data ? this.convertToMeal(data) : null;
        }
        catch (error) {
            console.error('Error fetching meal by ID:', error);
            throw error;
        }
    }
    // Check if meal with same name already exists
    async checkMealExists(name, cuisineType) {
        try {
            let query = supabase
                .from('meals')
                .select('id')
                .eq('status', 'active')
                .ilike('name', name.trim());
            if (cuisineType) {
                query = query.eq('cuisine_type', cuisineType);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            return (data && data.length > 0);
        }
        catch (error) {
            console.error('Error checking meal existence:', error);
            throw error;
        }
    }
    // Create new meal with duplicate checking
    async createMeal(meal, userId) {
        try {
            // Validate required fields
            if (!meal.name?.trim()) {
                throw new Error('Meal name is required');
            }
            // Check for duplicates
            const cuisineType = meal.isEthiopian ? 'ethiopian' : 'international';
            const exists = await this.checkMealExists(meal.name.trim(), cuisineType);
            if (exists) {
                throw new Error(`A meal with the name "${meal.name.trim()}" already exists in ${cuisineType} cuisine. Please choose a different name.`);
            }
            const dbMeal = this.convertToDBMeal(meal, userId);
            const { data, error } = await supabase
                .from('meals')
                .insert([dbMeal])
                .select()
                .single();
            if (error) {
                // Handle database constraint violations
                if (error.code === '23505') { // Unique constraint violation
                    if (error.message.includes('unique_meal_name')) {
                        throw new Error(`A meal with the name "${meal.name}" already exists. Please choose a different name.`);
                    }
                    if (error.message.includes('unique_meal_name_cuisine')) {
                        throw new Error(`A meal with the name "${meal.name}" already exists in ${cuisineType} cuisine. Please choose a different name.`);
                    }
                }
                throw error;
            }
            return this.convertToMeal(data);
        }
        catch (error) {
            console.error('Error creating meal:', error);
            throw error;
        }
    }
    // Update existing meal
    async updateMeal(id, meal) {
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
            if (error)
                throw error;
            return this.convertToMeal(data);
        }
        catch (error) {
            console.error('Error updating meal:', error);
            throw error;
        }
    }
    // Delete meal (soft delete by setting status to archived)
    async deleteMeal(id) {
        try {
            const { error } = await supabase
                .from('meals')
                .update({ status: 'archived', updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    }
    // Get meals by category
    async getMealsByCategory(category) {
        return this.getAllMeals({ category });
    }
    // Get Ethiopian meals
    async getEthiopianMeals() {
        return this.getAllMeals({ is_ethiopian: true });
    }
    // Search meals
    async searchMeals(searchTerm) {
        return this.getAllMeals({ search: searchTerm });
    }
    // Bulk create meals (useful for importing data)
    async bulkCreateMeals(meals, userId) {
        try {
            const dbMeals = meals.map(meal => this.convertToDBMeal(meal, userId));
            const { data, error } = await supabase
                .from('meals')
                .insert(dbMeals)
                .select();
            if (error)
                throw error;
            return (data || []).map(meal => this.convertToMeal(meal));
        }
        catch (error) {
            console.error('Error bulk creating meals:', error);
            throw error;
        }
    }
}
export const mealService = MealService.getInstance();
