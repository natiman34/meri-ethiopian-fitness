"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, Plus, Filter, X } from "lucide-react"
import Button from "../../components/ui/Button"
import { NutritionPlan, DietType, PlanStatus, Meal, NutritionalInfo } from '../../types/database'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Dialog } from '@headlessui/react'



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
  const [newPlan, setNewPlan] = useState<Partial<NutritionPlan>>({
    name: '',
    description: '',
    duration: '',
    meal_plan: { meals: [] },
    calories: 0,
    diet_type: 'traditional',
    status: 'draft'
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
      setNutritionPlans(data || []);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      setError('Failed to load nutrition plans');
    } finally {
      setIsLoading(false);
    }
  }

  // Filter nutrition plans based on search term, diet type, and status
  const filteredPlans = nutritionPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || plan.diet_type === selectedCategory
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
      const planToInsert = {
        ...newPlan,
        nutritionist_id: user?.id,
        // Ensure meal_plan structure is correct if empty
        meal_plan: newPlan.meal_plan || { meals: [] },
        calories: newPlan.calories || 0 // Ensure calories is a number
      };

      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert([planToInsert as any]) // Cast to any to bypass TS issue with Partial
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNutritionPlans([data, ...nutritionPlans]);
        setIsCreateModalOpen(false);
        setNewPlan({
          name: '',
          description: '',
          duration: '',
          meal_plan: { meals: [] },
          calories: 0,
          diet_type: 'traditional',
          status: 'draft'
        });
      }
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      setError('Failed to create nutrition plan');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (plan: Partial<NutritionPlan>) => {
    const errors: {[key: string]: string} = {};
    if (!plan.name?.trim()) errors.name = 'Name is required';
    if (!plan.description?.trim()) errors.description = 'Description is required';
    if (!plan.duration?.trim()) errors.duration = 'Duration is required';
    if (!plan.diet_type) errors.diet_type = 'Diet type is required';
    // Calories can be 0, so no required validation for it directly
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
      const { error } = await supabase
        .from('nutrition_plans')
        .update(plan)
        .eq('id', plan.id);

      if (error) throw error;
      setNutritionPlans(nutritionPlans.map(p => p.id === plan.id ? plan : p));
      setIsEditModalOpen(false);
      setEditingPlan(null);
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
      const { error } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNutritionPlans(nutritionPlans.filter((plan) => plan.id !== id));
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      setError('Failed to delete nutrition plan');
    }
  }

  // Handlers for nested meal_plan
  const handleAddMeal = (planType: 'new' | 'edit') => {
    const newMeal: Meal = {
      name: '',
      ingredients: [],
      preparation: '',
      nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
    if (planType === 'new') {
      setNewPlan(prev => ({ ...prev, meal_plan: { meals: [...(prev.meal_plan?.meals || []), newMeal] } }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: { meals: [...((prev as NutritionPlan).meal_plan?.meals || []), newMeal] }
      }));
    }
  };

  const handleRemoveMeal = (planType: 'new' | 'edit', mealIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: { meals: (prev.meal_plan?.meals || []).filter((_, i) => i !== mealIndex) }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: { meals: ((prev as NutritionPlan).meal_plan?.meals || []).filter((_, i) => i !== mealIndex) }
      }));
    }
  };

  const handleMealChange = (planType: 'new' | 'edit', mealIndex: number, field: keyof Meal, value: any) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: { meals: (prev.meal_plan?.meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal) }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: { meals: ((prev as NutritionPlan).meal_plan?.meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal) }
      }));
    }
  };

  const handleNutritionalInfoChange = (planType: 'new' | 'edit', mealIndex: number, field: keyof NutritionalInfo, value: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: {
          meals: (prev.meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
              : meal
          )
        }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: {
          meals: ((prev as NutritionPlan).meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
              : meal
          )
        }
      }));
    }
  };

  const handleIngredientChange = (planType: 'new' | 'edit', mealIndex: number, ingredientIndex: number, value: string) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: {
          meals: (prev.meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
              : meal
          )
        }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: {
          meals: ((prev as NutritionPlan).meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
              : meal
          )
        }
      }));
    }
  };

  const handleAddIngredient = (planType: 'new' | 'edit', mealIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: {
          meals: (prev.meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: [...meal.ingredients, ''] }
              : meal
          )
        }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: {
          meals: ((prev as NutritionPlan).meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: [...meal.ingredients, ''] }
              : meal
          )
        }
      }));
    }
  };

  const handleRemoveIngredient = (planType: 'new' | 'edit', mealIndex: number, ingredientIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        meal_plan: {
          meals: (prev.meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
              : meal
          )
        }
      }));
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...(prev as NutritionPlan),
        meal_plan: {
          meals: ((prev as NutritionPlan).meal_plan?.meals || []).map((meal, i) =>
            i === mealIndex
              ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
              : meal
          )
        }
      }));
    }
  };


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
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Create New Nutrition Plan</Dialog.Title>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreatePlan();
            }} className="mt-4 space-y-4">
              {/* Plan Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newPlan.name || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
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
                  <label className="block text-sm font-medium text-gray-700">Diet Type</label>
                  <select
                    value={newPlan.diet_type}
                    onChange={(e) => setNewPlan({ ...newPlan, diet_type: e.target.value as DietType })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="traditional">Traditional</option>
                    <option value="high-protein">High Protein</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="balanced">Balanced</option>
                    <option value="high-energy">High Energy</option>
                  </select>
                  {formErrors.diet_type && <p className="mt-1 text-sm text-red-600">{formErrors.diet_type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={newPlan.duration || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Calories</label>
                <input
                  type="number"
                  value={newPlan.calories || 0}
                  onChange={(e) => setNewPlan({ ...newPlan, calories: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.calories && <p className="mt-1 text-sm text-red-600">{formErrors.calories}</p>}
              </div>

              {/* Meal Plan Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Plan</h3>
                {(newPlan.meal_plan?.meals || []).map((meal, mealIndex) => (
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
                <button
                  type="button"
                  onClick={() => handleAddMeal('new')}
                  className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                >
                  + Add Meal
                </button>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Edit Nutrition Plan</Dialog.Title>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {editingPlan && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditPlan(editingPlan);
              }} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
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
                    <label className="block text-sm font-medium text-gray-700">Diet Type</label>
                    <select
                      value={editingPlan.diet_type}
                      onChange={(e) => setEditingPlan({ ...editingPlan, diet_type: e.target.value as DietType })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="traditional">Traditional</option>
                      <option value="high-protein">High Protein</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="balanced">Balanced</option>
                      <option value="high-energy">High Energy</option>
                    </select>
                    {formErrors.diet_type && <p className="mt-1 text-sm text-red-600">{formErrors.diet_type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editingPlan.status}
                      onChange={(e) => setEditingPlan({ ...editingPlan, status: e.target.value as PlanStatus })}
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
                      type="text"
                      value={editingPlan.duration}
                      onChange={(e) => setEditingPlan({ ...editingPlan, duration: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calories</label>
                    <input
                      type="number"
                      value={editingPlan.calories}
                      onChange={(e) => setEditingPlan({ ...editingPlan, calories: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {formErrors.calories && <p className="mt-1 text-sm text-red-600">{formErrors.calories}</p>}
                  </div>
                </div>

                 {/* Meal Plan Section (Edit) */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Meal Plan</h3>
                {(editingPlan.meal_plan?.meals || []).map((meal, mealIndex) => (
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
                 <button
                  type="button"
                  onClick={() => handleAddMeal('edit')}
                  className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                >
                  + Add Meal
                </button>
              </div>


                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Nutrition Plans</h2>
        <Button className="flex items-center" onClick={() => {
          setIsCreateModalOpen(true);
          setNewPlan({
            name: '',
            description: '',
            duration: '',
            meal_plan: { meals: [] },
            calories: 0,
            diet_type: 'traditional',
            status: 'draft'
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
                <option value="traditional">Traditional</option>
                <option value="high-protein">High Protein</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="balanced">Balanced</option>
                <option value="high-energy">High Energy</option>
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Diet Type
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
                    <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.diet_type === "traditional"
                          ? "bg-blue-100 text-blue-800"
                          : plan.diet_type === "high-protein"
                            ? "bg-green-100 text-green-800"
                            : plan.diet_type === "vegetarian"
                              ? "bg-purple-100 text-purple-800"
                            : plan.diet_type === "balanced"
                              ? "bg-yellow-100 text-yellow-800"
                              : plan.diet_type === "high-energy"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plan.diet_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(plan.created_at).toLocaleDateString()}
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
    </div>
  )
}

export default AdminNutrition
