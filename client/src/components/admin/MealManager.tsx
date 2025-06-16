import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Button from '../ui/Button';
import { Meal, NutritionInfo } from '../../types/content';
import { mealService, MealFilters } from '../../services/MealService';
import { useAuth } from '../../contexts/AuthContext';
import ImageSelector from './ImageSelector';

interface MealManagerProps {
  onMealSelect?: (meal: Meal) => void;
  selectionMode?: boolean;
}

const MealManager: React.FC<MealManagerProps> = ({ onMealSelect, selectionMode = false }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MealFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  
 
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    description: '',
    image: '',
    isEthiopian: false,
    ingredients: [],
    preparation: '',
    nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchMeals();
  }, []);

  const applyFilters = React.useCallback(() => {
    let filtered = meals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ethiopian filter
    if (filters.is_ethiopian !== undefined) {
      filtered = filtered.filter(meal => meal.isEthiopian === filters.is_ethiopian);
    }

    setFilteredMeals(filtered);
  }, [meals, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchMeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMeals = await mealService.getAllMeals();
      setMeals(fetchedMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to load meals');
    } finally {
      setIsLoading(false);
    }
  };



  const validateForm = (meal: Partial<Meal>) => {
    const errors: {[key: string]: string} = {};
    if (!meal.name?.trim()) errors.name = 'Name is required';
    if (!meal.description?.trim()) errors.description = 'Description is required';
    if (!meal.ingredients?.length) errors.ingredients = 'At least one ingredient is required';
    if (!meal.preparation?.trim()) errors.preparation = 'Preparation instructions are required';
    return errors;
  };

  const handleCreateMeal = async () => {
    const errors = validateForm(newMeal);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const createdMeal = await mealService.createMeal(newMeal, user?.id);
      setMeals([createdMeal, ...meals]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating meal:', error);
      setError('Failed to create meal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMeal = async () => {
    if (!editingMeal) return;

    const errors = validateForm(editingMeal);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const updatedMeal = await mealService.updateMeal(editingMeal.id, editingMeal);
      setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
      setIsEditModalOpen(false);
      setEditingMeal(null);
    } catch (error) {
      console.error('Error updating meal:', error);
      setError('Failed to update meal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    setIsLoading(true);
    try {
      await mealService.deleteMeal(id);
      setMeals(meals.filter(meal => meal.id !== id));
      setIsDeleteModalOpen(false);
      setMealToDelete(null);
    } catch (error) {
      console.error('Error deleting meal:', error);
      setError('Failed to delete meal');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewMeal({
      name: '',
      description: '',
      image: '',
      isEthiopian: false,
      ingredients: [],
      preparation: '',
      nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    });
    setFormErrors({});
  };

  const handleAddIngredient = (meal: Partial<Meal>, setter: (meal: Partial<Meal>) => void) => {
    setter({
      ...meal,
      ingredients: [...(meal.ingredients || []), '']
    });
  };

  const handleRemoveIngredient = (meal: Partial<Meal>, index: number, setter: (meal: Partial<Meal>) => void) => {
    setter({
      ...meal,
      ingredients: (meal.ingredients || []).filter((_, i) => i !== index)
    });
  };

  const handleIngredientChange = (meal: Partial<Meal>, index: number, value: string, setter: (meal: Partial<Meal>) => void) => {
    const newIngredients = [...(meal.ingredients || [])];
    newIngredients[index] = value;
    setter({
      ...meal,
      ingredients: newIngredients
    });
  };

  const handleNutritionChange = (meal: Partial<Meal>, field: keyof NutritionInfo, value: number, setter: (meal: Partial<Meal>) => void) => {
    setter({
      ...meal,
      nutritionInfo: {
        ...(meal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
        [field]: value
      }
    });
  };

  // Helper functions for editing meal specifically
  const handleEditingMealIngredientChange = (index: number, value: string) => {
    if (!editingMeal) return;
    const newIngredients = [...(editingMeal.ingredients || [])];
    newIngredients[index] = value;
    setEditingMeal({
      ...editingMeal,
      ingredients: newIngredients
    });
  };

  const handleEditingMealRemoveIngredient = (index: number) => {
    if (!editingMeal) return;
    setEditingMeal({
      ...editingMeal,
      ingredients: (editingMeal.ingredients || []).filter((_, i) => i !== index)
    });
  };

  const handleEditingMealAddIngredient = () => {
    if (!editingMeal) return;
    setEditingMeal({
      ...editingMeal,
      ingredients: [...(editingMeal.ingredients || []), '']
    });
  };

  const handleEditingMealNutritionChange = (field: keyof NutritionInfo, value: number) => {
    if (!editingMeal) return;
    setEditingMeal({
      ...editingMeal,
      nutritionInfo: {
        ...(editingMeal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
        [field]: value
      }
    });
  };

  if (isLoading && meals.length === 0) {
    return (
      <div className="flex justify-center items-center py-8" role="status" aria-label="Loading meals">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="sr-only">Loading meals...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {selectionMode ? 'Select Meal' : 'Meal Management'}
        </h3>
        {!selectionMode && (
          <Button
            onClick={() => {
              setIsCreateModalOpen(true);
              resetForm();
            }}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Meal
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meals..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search meals by name or description"
            />
          </div>

          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.is_ethiopian === undefined ? 'all' : filters.is_ethiopian ? 'ethiopian' : 'international'}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  ...filters,
                  is_ethiopian: value === 'all' ? undefined : value === 'ethiopian'
                });
              }}
              aria-label="Filter meals by cuisine type"
            >
              <option value="all">All Cuisines</option>
              <option value="ethiopian">Ethiopian</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{meal.name}</h4>
                {meal.isEthiopian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Ethiopian
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>{meal.nutritionInfo?.calories || 0} cal</span>
                <span>{meal.ingredients?.length || 0} ingredients</span>
              </div>

              <div className="flex justify-between items-center">
                {selectionMode ? (
                  <Button
                    onClick={() => onMealSelect?.(meal)}
                    size="sm"
                    className="w-full"
                  >
                    Select Meal
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMeal(meal);
                        setIsEditModalOpen(true);
                        setFormErrors({});
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Edit ${meal.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMealToDelete(meal.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${meal.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeals.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No meals found matching your criteria.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Create Meal Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto" role="dialog" aria-labelledby="create-meal-title">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title id="create-meal-title" className="text-lg font-medium">Create New Meal</Dialog.Title>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close create meal dialog"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateMeal();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newMeal.name || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newMeal.description || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
              </div>

              <ImageSelector
                currentImage={newMeal.image}
                mealName={newMeal.name || ''}
                isEthiopian={newMeal.isEthiopian}
                onImageSelect={(imageUrl) => setNewMeal({ ...newMeal, image: imageUrl })}
                onImageClear={() => setNewMeal({ ...newMeal, image: '' })}
                onError={(message) => setError(message)}
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEthiopian"
                  checked={newMeal.isEthiopian || false}
                  onChange={(e) => setNewMeal({ ...newMeal, isEthiopian: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isEthiopian" className="ml-2 block text-sm text-gray-900">
                  Ethiopian Cuisine
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                {(newMeal.ingredients || []).map((ingredient, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(newMeal, index, e.target.value, setNewMeal)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(newMeal, index, setNewMeal)}
                      className="ml-2 text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove ingredient ${ingredient || 'empty'}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddIngredient(newMeal, setNewMeal)}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  + Add Ingredient
                </button>
                {formErrors.ingredients && <p className="mt-1 text-sm text-red-600">{formErrors.ingredients}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preparation</label>
                <textarea
                  value={newMeal.preparation || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, preparation: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.preparation && <p className="mt-1 text-sm text-red-600">{formErrors.preparation}</p>}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Nutritional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calories</label>
                    <input
                      type="number"
                      value={newMeal.nutritionInfo?.calories || 0}
                      onChange={(e) => handleNutritionChange(newMeal, 'calories', parseInt(e.target.value) || 0, setNewMeal)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                    <input
                      type="number"
                      value={newMeal.nutritionInfo?.protein || 0}
                      onChange={(e) => handleNutritionChange(newMeal, 'protein', parseFloat(e.target.value) || 0, setNewMeal)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                    <input
                      type="number"
                      value={newMeal.nutritionInfo?.carbs || 0}
                      onChange={(e) => handleNutritionChange(newMeal, 'carbs', parseFloat(e.target.value) || 0, setNewMeal)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                    <input
                      type="number"
                      value={newMeal.nutritionInfo?.fat || 0}
                      onChange={(e) => handleNutritionChange(newMeal, 'fat', parseFloat(e.target.value) || 0, setNewMeal)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
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
                  {isLoading ? 'Creating...' : 'Create Meal'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Meal Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto" role="dialog" aria-labelledby="edit-meal-title">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title id="edit-meal-title" className="text-lg font-medium">Edit Meal</Dialog.Title>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close edit meal dialog"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {editingMeal && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditMeal();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingMeal.name || ''}
                    onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingMeal.description || ''}
                    onChange={(e) => setEditingMeal({ ...editingMeal, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>

                <ImageSelector
                  currentImage={editingMeal.image}
                  mealName={editingMeal.name || ''}
                  isEthiopian={editingMeal.isEthiopian}
                  onImageSelect={(imageUrl) => setEditingMeal({ ...editingMeal, image: imageUrl })}
                  onImageClear={() => setEditingMeal({ ...editingMeal, image: '' })}
                  onError={(message) => setError(message)}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsEthiopian"
                    checked={editingMeal.isEthiopian || false}
                    onChange={(e) => setEditingMeal({ ...editingMeal, isEthiopian: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsEthiopian" className="ml-2 block text-sm text-gray-900">
                    Ethiopian Cuisine
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                  {(editingMeal.ingredients || []).map((ingredient, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleEditingMealIngredientChange(index, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleEditingMealRemoveIngredient(index)}
                        className="ml-2 text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Remove ingredient ${ingredient || 'empty'}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleEditingMealAddIngredient}
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    + Add Ingredient
                  </button>
                  {formErrors.ingredients && <p className="mt-1 text-sm text-red-600">{formErrors.ingredients}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Preparation</label>
                  <textarea
                    value={editingMeal.preparation || ''}
                    onChange={(e) => setEditingMeal({ ...editingMeal, preparation: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.preparation && <p className="mt-1 text-sm text-red-600">{formErrors.preparation}</p>}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Calories</label>
                      <input
                        type="number"
                        value={editingMeal.nutritionInfo?.calories || 0}
                        onChange={(e) => handleEditingMealNutritionChange('calories', parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                      <input
                        type="number"
                        value={editingMeal.nutritionInfo?.protein || 0}
                        onChange={(e) => handleEditingMealNutritionChange('protein', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                      <input
                        type="number"
                        value={editingMeal.nutritionInfo?.carbs || 0}
                        onChange={(e) => handleEditingMealNutritionChange('carbs', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                      <input
                        type="number"
                        value={editingMeal.nutritionInfo?.fat || 0}
                        onChange={(e) => handleEditingMealNutritionChange('fat', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6" role="dialog" aria-labelledby="delete-meal-title" aria-describedby="delete-meal-description">
            <Dialog.Title id="delete-meal-title" className="text-lg font-medium">Delete Meal</Dialog.Title>
            <Dialog.Description id="delete-meal-description" className="mt-2">
              Are you sure you want to delete this meal? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                onClick={() => {
                  if (mealToDelete) {
                    handleDeleteMeal(mealToDelete);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MealManager;
