"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, Plus, Filter, X, Database } from "lucide-react"
import Button from "../../components/ui/Button"
import { NutritionPlan, Meal, NutritionCategory, NutritionInfo, CalorieRange, DayMeal } from '../../types/content'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Dialog } from '@headlessui/react'
import MealManager from '../../components/admin/MealManager'
import { ActivityLogService } from '../../services/ActivityLogService'
import type { NutritionStatus } from '../../types/content'



// Mapping between frontend categories and database diet_types
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

const AdminNutrition = () => {
  const { user } = useAuth();
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<NutritionPlan | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isMealManagerOpen, setIsMealManagerOpen] = useState(false)
  const [mealSelectionMode, setMealSelectionMode] = useState<{
    planType: 'new' | 'edit';
    mealIndex?: number;
  } | null>(null)
  const [newPlan, setNewPlan] = useState<Partial<NutritionPlan>>({
    title: '',
    description: '',
    duration: 0,
    category: 'maintenance',
    calorieRange: { min: 0, max: 0 },
    meals: [],
    status: 'draft',
    tags: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const itemsPerPage = 10

  useEffect(() => {
    fetchNutritionPlans()
  }, [currentPage])

  const fetchNutritionPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data: countData, error: countError, count } = await supabase
        .from('nutrition_plans')
        .select('id', { count: 'exact' });

      if (countError) throw countError;
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database format to frontend format
      const frontendPlans = (data || []).map((dbPlan: any) => ({
        id: dbPlan.id,
        title: dbPlan.name,
        description: dbPlan.description,
        duration: parseInt(dbPlan.duration) || 0,
        category: dietTypeToCategory(dbPlan.diet_type),
        calorieRange: { min: 0, max: dbPlan.calories || 0 },
        meals: dbPlan.meal_plan?.meals?.map((meal: any) => ({
          id: `meal-${Date.now()}-${Math.random()}`,
          name: meal.name,
          description: '',
          image: '',
          isEthiopian: false,
          ingredients: meal.ingredients || [],
          preparation: meal.preparation || '',
          nutritionalInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
        })) || [],
        status: dbPlan.status || 'draft',
        tags: [],
        featured: false,
        createdAt: dbPlan.created_at,
        updatedAt: dbPlan.updated_at,
      }));

      setNutritionPlans(frontendPlans);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      setError('Failed to load nutrition plans');
    } finally {
      setIsLoading(false);
    }
  }

  // Filter nutrition plans based on search term, diet type, and status
  const filteredPlans = nutritionPlans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || plan.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreatePlan = async () => {
    const errors = validateForm(newPlan as NutritionPlan);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Map frontend data to database schema
      const planToInsert = {
        nutritionist_id: user?.id,
        name: newPlan.title || '',
        description: newPlan.description || null,
        duration: newPlan.duration?.toString() || '0',
        diet_type: categoryToDietType(newPlan.category || 'maintenance'),
        calories: newPlan.calorieRange?.max || 2000,
        meal_plan: {
          meals: (newPlan.meals || []).map(meal => ({
            name: meal.name,
            ingredients: meal.ingredients || [],
            preparation: meal.preparation || '',
            nutritionalInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
          }))
        },
        status: 'published' // Auto-publish nutrition plans so they appear in public section
      };

      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert([planToInsert])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Convert database format back to frontend format for state update
        const frontendPlan = {
          id: data.id,
          title: data.name,
          description: data.description,
          duration: parseInt(data.duration) || 0,
          category: dietTypeToCategory(data.diet_type),
          calorieRange: { min: 0, max: data.calories || 0 },
          meals: data.meal_plan?.meals?.map((meal: any) => ({
            id: `meal-${Date.now()}-${Math.random()}`,
            name: meal.name,
            description: '',
            image: '',
            isEthiopian: false,
            ingredients: meal.ingredients || [],
            preparation: meal.preparation || '',
            nutritionalInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
          })) || [],
          status: data.status || 'draft',
          tags: [],
          featured: false,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        setNutritionPlans([frontendPlan, ...nutritionPlans]);
        setIsCreateModalOpen(false);
        setNewPlan({
          title: '',
          description: '',
          duration: 0,
          category: 'maintenance',
          calorieRange: { min: 0, max: 0 },
          meals: [],
          status: 'draft',
          tags: [],
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Log the activity
        await ActivityLogService.logNutritionAction(
          'New nutrition plan created',
          `${newPlan.title} added`,
          user?.id
        );

        await ActivityLogService.logAdminActivity(
          user?.id || '',
          'CREATE_NUTRITION_PLAN',
          {
            resource: 'nutrition_plan',
            resourceId: data.id,
            planTitle: newPlan.title,
            planCategory: newPlan.category,
            planDuration: newPlan.duration
          }
        );
      }
    } catch (error: any) {
      console.error('Error creating nutrition plan:', error);
      // Show specific error message for duplicates or general error
      const errorMessage = error.message || 'Failed to create nutrition plan';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (plan: Partial<NutritionPlan>) => {
    const errors: {[key: string]: string} = {};
    if (!plan.title?.trim()) errors.title = 'Title is required';
    if (!plan.description?.trim()) errors.description = 'Description is required';
    if (plan.duration === undefined || plan.duration <= 0) errors.duration = 'Duration is required and must be a positive number';
    if (!plan.category) errors.category = 'Category is required';
    if (!plan.calorieRange || plan.calorieRange.max === undefined || plan.calorieRange.max <= 0) errors.calorieRange = 'Maximum calorie value is required';
    return errors;
  };

  const handleEditPlan = async (plan: NutritionPlan) => {
    const errors = validateForm(plan);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Map frontend data to database schema
      const updateData = {
        name: plan.title,
        description: plan.description || null,
        duration: plan.duration?.toString() || '0',
        diet_type: categoryToDietType(plan.category),
        calories: plan.calorieRange?.max || 2000,
        meal_plan: {
          meals: (plan.meals || []).map(meal => ({
            name: meal.name,
            ingredients: meal.ingredients || [],
            preparation: meal.preparation || '',
            nutritionalInfo: meal.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
          }))
        },
        status: plan.status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('nutrition_plans')
        .update(updateData)
        .eq('id', plan.id);

      if (error) throw error;
      setNutritionPlans(nutritionPlans.map(p => p.id === plan.id ? plan : p));
      setIsEditModalOpen(false);
      setEditingPlan(null);

      // Log the activity
      await ActivityLogService.logNutritionAction(
        'Nutrition plan updated',
        `${plan.title} modified`,
        user?.id
      );

      await ActivityLogService.logAdminActivity(
        user?.id || '',
        'UPDATE_NUTRITION_PLAN',
        {
          resource: 'nutrition_plan',
          resourceId: plan.id,
          planTitle: plan.title,
          planCategory: plan.category
        }
      );
    } catch (error) {
      console.error('Error updating nutrition plan:', error);
      setError('Failed to update nutrition plan');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      // Get plan details before deletion for logging
      const deletedPlan = nutritionPlans.find(p => p.id === id);

      const { error } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNutritionPlans(nutritionPlans.filter((plan) => plan.id !== id));
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);

      // Log the activity
      await ActivityLogService.logNutritionAction(
        'Nutrition plan deleted',
        `${deletedPlan?.title || 'Unknown plan'} removed`,
        user?.id
      );

      await ActivityLogService.logAdminActivity(
        user?.id || '',
        'DELETE_NUTRITION_PLAN',
        {
          resource: 'nutrition_plan',
          resourceId: id,
          planTitle: deletedPlan?.title || 'Unknown',
          planCategory: deletedPlan?.category || 'Unknown'
        }
      );
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      setError('Failed to delete nutrition plan');
    }
  }

  // Handlers for nested meal_plan
  const handleAddMeal = (planType: 'new' | 'edit') => {
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: '',
      description: '',
      image: '',
      isEthiopian: false,
      nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ingredients: [],
      preparation: '',
    };
    const newDayMeal = mealToDayMeal(newMeal, (planType === 'new' ? (newPlan?.meals?.length ?? 0) : (editingPlan?.meals?.length ?? 0)) + 1);
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: [...(prev.meals || []), newDayMeal],
        calorieRange: prev.calorieRange || {min: 0, max: 0},
        createdAt: prev.createdAt || new Date().toISOString(),
        updatedAt: prev.updatedAt || new Date().toISOString(),
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: [...((prev as NutritionPlan).meals || []), newDayMeal]
      }));
    }
  };

  const handleRemoveMeal = (planType: 'new' | 'edit', mealIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).filter((_, i) => i !== mealIndex)
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: ((prev as NutritionPlan).meals || []).filter((_, i) => i !== mealIndex)
      }));
    }
  };

  const handleMealChange = (planType: 'new' | 'edit', mealIndex: number, field: keyof Meal, value: any) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal),
        calorieRange: prev.calorieRange || {min: 0, max: 0},
        createdAt: prev.createdAt || new Date().toISOString(),
        updatedAt: prev.updatedAt || new Date().toISOString(),
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: ((prev as NutritionPlan).meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal)
      }));
    }
  };

  const handleNutritionalInfoChange = (planType: 'new' | 'edit', mealIndex: number, field: keyof NutritionInfo, value: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).map((meal, i) =>
          i === mealIndex
            ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
            : meal
        )
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: ((prev as NutritionPlan).meals || []).map((meal, i) =>
          i === mealIndex
            ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
            : meal
        )
      }));
    }
  };

  const handleIngredientChange = (planType: 'new' | 'edit', mealIndex: number, ingredientIndex: number, value: string) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
              : meal
          )
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
              : meal
          )
      }));
    }
  };

  const handleAddIngredient = (planType: 'new' | 'edit', mealIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: [...meal.ingredients, ''] }
              : meal
          )
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: [...meal.ingredients, ''] }
              : meal
          )
      }));
    }
  };

  const handleRemoveIngredient = (planType: 'new' | 'edit', mealIndex: number, ingredientIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
              : meal
          )
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meals: (prev.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
              : meal
          )
      }));
    }
  };

  // Handle meal selection from database
  const handleMealSelect = (selectedMeal: Meal) => {
    if (!mealSelectionMode) return;
    const { planType, mealIndex } = mealSelectionMode;
    const newDayMeal = mealToDayMeal(selectedMeal, (planType === 'new' ? (newPlan?.meals?.length ?? 0) : (editingPlan?.meals?.length ?? 0)) + 1);
    if (mealIndex !== undefined) {
      if (planType === 'new') {
        setNewPlan(prev => ({
          ...prev,
          meals: (prev.meals || []).map((meal, i) => i === mealIndex ? newDayMeal : meal)
        }));
      } else if (planType === 'edit' && editingPlan) {
        setEditingPlan(prev => ({
          ...(prev as NutritionPlan),
          meals: (prev.meals || []).map((meal, i) => i === mealIndex ? newDayMeal : meal)
        }));
      }
    } else {
      if (planType === 'new') {
        setNewPlan(prev => ({
          ...prev,
          meals: [...(prev.meals || []), newDayMeal]
        }));
      } else if (planType === 'edit' && editingPlan) {
        setEditingPlan(prev => ({
          ...(prev as NutritionPlan),
          meals: [...(prev.meals || []), newDayMeal]
        }));
      }
    }
    setIsMealManagerOpen(false);
    setMealSelectionMode(null);
  };

  const openMealManager = (planType: 'new' | 'edit', mealIndex?: number) => {
    setMealSelectionMode({ planType, mealIndex });
    setIsMealManagerOpen(true);
  };

  // Helper to convert a Meal to a DayMeal
  const mealToDayMeal = (meal: Meal, day: number): DayMeal => ({
    day,
    breakfast: [meal],
    lunch: [],
    dinner: [],
    snacks: [],
    totalCalories: meal.nutritionInfo.calories,
    nutritionalInfo: meal.nutritionInfo,
  });

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium">Delete Nutrition Plan</Dialog.Title>
            <Dialog.Description className="mt-2">
              Are you sure you want to delete this nutrition plan? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={() => {
                  if (planToDelete) {
                    handleDeletePlan(planToDelete);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Create New Plan Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] rounded bg-white flex flex-col">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-medium">Create New Nutrition Plan</Dialog.Title>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreatePlan();
              }} className="space-y-4" id="create-nutrition-plan-form">
              {/* Plan Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newPlan.title || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newPlan.description || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value as NutritionCategory })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="weight-gain">Weight Gain</option>
                  </select>
                  {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="number"
                    value={newPlan.duration || 0}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Calorie Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Calories</label>
                <input
                  type="number"
                      value={newPlan.calorieRange?.min || 0}
                      onChange={(e) => setNewPlan({ ...newPlan, calorieRange: { ...newPlan.calorieRange, min: parseInt(e.target.value) || 0 } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Calories</label>
                    <input
                      type="number"
                      value={newPlan.calorieRange?.max || 0}
                      onChange={(e) => setNewPlan({ ...newPlan, calorieRange: { ...newPlan.calorieRange, max: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                {formErrors.calorieRange && <p className="mt-1 text-sm text-red-600">{formErrors.calorieRange}</p>}
              </div>

              {/* Meal Plan Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Plan</h3>
                {(newPlan.meals || []).map((meal, mealIndex) => (
                  <div key={mealIndex} className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium">Meal {mealIndex + 1}</h4>
                      <button type="button" onClick={() => handleRemoveMeal('new', mealIndex)}>
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meal Name</label>
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) => handleMealChange('new', mealIndex, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                      {(meal.ingredients || []).map((ingredient, ingredientIndex) => (
                        <div key={ingredientIndex} className="flex items-center mt-1">
                          <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange('new', mealIndex, ingredientIndex, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient('new', mealIndex, ingredientIndex)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddIngredient('new', mealIndex)}
                        className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        + Add Ingredient
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preparation</label>
                      <textarea
                        value={meal.preparation}
                        onChange={(e) => handleMealChange('new', mealIndex, 'preparation', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Nutritional Info</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Calories</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.calories || 0}
                            onChange={(e) => handleNutritionalInfoChange('new', mealIndex, 'calories', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.protein || 0}
                            onChange={(e) => handleNutritionalInfoChange('new', mealIndex, 'protein', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.carbs || 0}
                            onChange={(e) => handleNutritionalInfoChange('new', mealIndex, 'carbs', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.fat || 0}
                            onChange={(e) => handleNutritionalInfoChange('new', mealIndex, 'fat', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleAddMeal('new')}
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    + Add New Meal
                  </button>
                  <button
                    type="button"
                    onClick={() => openMealManager('new')}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <Database className="mr-1 h-4 w-4" />
                  </button>
                </div>
              </div>
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-nutrition-plan-form"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] rounded bg-white flex flex-col">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-medium">Edit Nutrition Plan</Dialog.Title>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {editingPlan && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEditPlan(editingPlan);
                }} className="space-y-4" id="edit-nutrition-plan-form">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingPlan.description || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={editingPlan.category}
                      onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value as NutritionCategory })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="weight-gain">Weight Gain</option>
                    </select>
                    {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editingPlan.status}
                      onChange={(e) => setEditingPlan({ ...editingPlan, status: e.target.value as NutritionStatus })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                       <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input
                      type="number"
                      value={editingPlan.duration}
                      onChange={(e) => setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calorie Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Calories</label>
                    <input
                      type="number"
                          value={editingPlan.calorieRange?.min || 0}
                          onChange={(e) => setEditingPlan({ ...editingPlan, calorieRange: { ...editingPlan.calorieRange, min: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Calories</label>
                        <input
                          type="number"
                          value={editingPlan.calorieRange?.max || 0}
                          onChange={(e) => setEditingPlan({ ...editingPlan, calorieRange: { ...editingPlan.calorieRange, max: parseInt(e.target.value) || 0 } })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    {formErrors.calorieRange && <p className="mt-1 text-sm text-red-600">{formErrors.calorieRange}</p>}
                  </div>
                </div>

                 {/* Meal Plan Section (Edit) */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Plan</h3>
                {(editingPlan.meals || []).map((meal, mealIndex) => (
                  <div key={mealIndex} className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium">Meal {mealIndex + 1}</h4>
                      <button type="button" onClick={() => handleRemoveMeal('edit', mealIndex)}>
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meal Name</label>
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) => handleMealChange('edit', mealIndex, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                      {(meal.ingredients || []).map((ingredient, ingredientIndex) => (
                        <div key={ingredientIndex} className="flex items-center mt-1">
                          <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange('edit', mealIndex, ingredientIndex, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient('edit', mealIndex, ingredientIndex)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                       <button
                        type="button"
                        onClick={() => handleAddIngredient('edit', mealIndex)}
                        className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        + Add Ingredient
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preparation</label>
                      <textarea
                        value={meal.preparation}
                        onChange={(e) => handleMealChange('edit', mealIndex, 'preparation', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                     <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Nutritional Info</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Calories</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.calories || 0}
                            onChange={(e) => handleNutritionalInfoChange('edit', mealIndex, 'calories', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.protein || 0}
                            onChange={(e) => handleNutritionalInfoChange('edit', mealIndex, 'protein', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.carbs || 0}
                            onChange={(e) => handleNutritionalInfoChange('edit', mealIndex, 'carbs', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                          <input
                            type="number"
                            value={meal.nutritionalInfo?.fat || 0}
                            onChange={(e) => handleNutritionalInfoChange('edit', mealIndex, 'fat', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                 <div className="flex space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleAddMeal('edit')}
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    + Add New Meal
                  </button>
                  <button
                    type="button"
                    onClick={() => openMealManager('edit')}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <Database className="mr-1 h-4 w-4" />
                  </button>
                </div>
              </div>
                </form>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-nutrition-plan-form"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0"></div>
        <Button className="flex items-center" onClick={() => {
          setIsCreateModalOpen(true);
          setNewPlan({
            title: '',
            description: '',
            duration: 0,
            category: 'maintenance',
            calorieRange: { min: 0, max: 0 },
            meals: [],
            status: 'draft',
            tags: [],
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }); // Reset form when opening create modal
          setFormErrors({});
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search nutrition plans..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="maintenance">Maintenance</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="weight-gain">Weight Gain</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Plans Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.category === "maintenance"
                          ? "bg-blue-100 text-blue-800"
                          : plan.category === "weight-loss"
                            ? "bg-green-100 text-green-800"
                            : plan.category === "weight-gain"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.duration} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.status === "published"
                          ? "bg-green-100 text-green-800"
                          : plan.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsEditModalOpen(true);
                          setFormErrors({});
                        }}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900" 
                        onClick={() => openDeleteModal(plan.id)}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPlans.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">No nutrition plans found matching your criteria.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Meal Manager Modal */}
      <Dialog open={isMealManagerOpen} onClose={() => setIsMealManagerOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">Select Meal from Database</Dialog.Title>
              <button onClick={() => setIsMealManagerOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <MealManager
              onMealSelect={handleMealSelect}
              selectionMode={true}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default AdminNutrition
