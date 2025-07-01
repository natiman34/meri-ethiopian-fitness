import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Button from '../ui/Button';
import { mealService } from '../../services/MealService';
import { useAuth } from '../../contexts/AuthContext';
import ImageSelector from './ImageSelector';
const MealManager = ({ onMealSelect, selectionMode = false }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [mealToDelete, setMealToDelete] = useState(null);
    const [newMeal, setNewMeal] = useState({
        name: '',
        description: '',
        image: '',
        isEthiopian: false,
        ingredients: [],
        preparation: '',
        nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    });
    const [formErrors, setFormErrors] = useState({});
    useEffect(() => {
        fetchMeals();
    }, []);
    const applyFilters = React.useCallback(() => {
        let filtered = meals;
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(meal => meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                meal.description.toLowerCase().includes(searchTerm.toLowerCase()));
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
        }
        catch (error) {
            console.error('Error fetching meals:', error);
            setError('Failed to load meals');
        }
        finally {
            setIsLoading(false);
        }
    };
    const validateForm = (meal) => {
        const errors = {};
        if (!meal.name?.trim())
            errors.name = 'Name is required';
        if (!meal.description?.trim())
            errors.description = 'Description is required';
        if (!meal.ingredients?.length)
            errors.ingredients = 'At least one ingredient is required';
        if (!meal.preparation?.trim())
            errors.preparation = 'Preparation instructions are required';
        return errors;
    };
    const handleCreateMeal = async () => {
        const errors = validateForm(newMeal);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const createdMeal = await mealService.createMeal(newMeal, user?.id);
            setMeals([createdMeal, ...meals]);
            setIsCreateModalOpen(false);
            resetForm();
        }
        catch (error) {
            console.error('Error creating meal:', error);
            // Show specific error message for duplicates or general error
            const errorMessage = error.message || 'Failed to create meal';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleEditMeal = async () => {
        if (!editingMeal)
            return;
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
        }
        catch (error) {
            console.error('Error updating meal:', error);
            setError('Failed to update meal');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDeleteMeal = async (id) => {
        setIsLoading(true);
        try {
            await mealService.deleteMeal(id);
            setMeals(meals.filter(meal => meal.id !== id));
            setIsDeleteModalOpen(false);
            setMealToDelete(null);
        }
        catch (error) {
            console.error('Error deleting meal:', error);
            setError('Failed to delete meal');
        }
        finally {
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
    const handleAddIngredient = (meal, setter) => {
        setter({
            ...meal,
            ingredients: [...(meal.ingredients || []), '']
        });
    };
    const handleRemoveIngredient = (meal, index, setter) => {
        setter({
            ...meal,
            ingredients: (meal.ingredients || []).filter((_, i) => i !== index)
        });
    };
    const handleIngredientChange = (meal, index, value, setter) => {
        const newIngredients = [...(meal.ingredients || [])];
        newIngredients[index] = value;
        setter({
            ...meal,
            ingredients: newIngredients
        });
    };
    const handleNutritionChange = (meal, field, value, setter) => {
        setter({
            ...meal,
            nutritionInfo: {
                ...(meal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
                [field]: value
            }
        });
    };
    // Helper functions for editing meal specifically
    const handleEditingMealIngredientChange = (index, value) => {
        if (!editingMeal)
            return;
        const newIngredients = [...(editingMeal.ingredients || [])];
        newIngredients[index] = value;
        setEditingMeal({
            ...editingMeal,
            ingredients: newIngredients
        });
    };
    const handleEditingMealRemoveIngredient = (index) => {
        if (!editingMeal)
            return;
        setEditingMeal({
            ...editingMeal,
            ingredients: (editingMeal.ingredients || []).filter((_, i) => i !== index)
        });
    };
    const handleEditingMealAddIngredient = () => {
        if (!editingMeal)
            return;
        setEditingMeal({
            ...editingMeal,
            ingredients: [...(editingMeal.ingredients || []), '']
        });
    };
    const handleEditingMealNutritionChange = (field, value) => {
        if (!editingMeal)
            return;
        setEditingMeal({
            ...editingMeal,
            nutritionInfo: {
                ...(editingMeal.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
                [field]: value
            }
        });
    };
    if (isLoading && meals.length === 0) {
        return (_jsxs("div", { className: "flex justify-center items-center py-8", role: "status", "aria-label": "Loading meals", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }), _jsx("span", { className: "sr-only", children: "Loading meals..." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: selectionMode ? 'Select Meal' : 'Meal Management' }), !selectionMode && (_jsxs(Button, { onClick: () => {
                            setIsCreateModalOpen(true);
                            resetForm();
                        }, className: "flex items-center", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add New Meal"] }))] }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:space-x-4", children: [_jsxs("div", { className: "relative flex-grow mb-4 md:mb-0", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search meals...", className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), "aria-label": "Search meals by name or description" })] }), _jsx("div", { className: "flex space-x-4", children: _jsxs("select", { className: "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: filters.is_ethiopian === undefined ? 'all' : filters.is_ethiopian ? 'ethiopian' : 'international', onChange: (e) => {
                                    const value = e.target.value;
                                    setFilters({
                                        ...filters,
                                        is_ethiopian: value === 'all' ? undefined : value === 'ethiopian'
                                    });
                                }, "aria-label": "Filter meals by cuisine type", children: [_jsx("option", { value: "all", children: "All Cuisines" }), _jsx("option", { value: "ethiopian", children: "Ethiopian" }), _jsx("option", { value: "international", children: "International" })] }) })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredMeals.map((meal) => (_jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900", children: meal.name }), meal.isEthiopian && (_jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full", children: "Ethiopian" }))] }), _jsx("p", { className: "text-gray-600 text-sm mb-3 line-clamp-2", children: meal.description }), _jsxs("div", { className: "flex justify-between items-center text-sm text-gray-500 mb-3", children: [_jsxs("span", { children: [meal.nutritionInfo?.calories || 0, " cal"] }), _jsxs("span", { children: [meal.ingredients?.length || 0, " ingredients"] })] }), _jsx("div", { className: "flex justify-between items-center", children: selectionMode ? (_jsx(Button, { onClick: () => onMealSelect?.(meal), size: "sm", className: "w-full", children: "Select Meal" })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => {
                                                setEditingMeal(meal);
                                                setIsEditModalOpen(true);
                                                setFormErrors({});
                                            }, className: "text-indigo-600 hover:text-indigo-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": `Edit ${meal.name}`, children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => {
                                                setMealToDelete(meal.id);
                                                setIsDeleteModalOpen(true);
                                            }, className: "text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500", "aria-label": `Delete ${meal.name}`, children: _jsx(Trash2, { className: "h-4 w-4" }) })] })) })] }) }, meal.id))) }), filteredMeals.length === 0 && !isLoading && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No meals found matching your criteria." })), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: _jsx("p", { children: error }) })), _jsxs(Dialog, { open: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto", role: "dialog", "aria-labelledby": "create-meal-title", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Dialog.Title, { id: "create-meal-title", className: "text-lg font-medium", children: "Create New Meal" }), _jsx("button", { onClick: () => setIsCreateModalOpen(false), className: "p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500", "aria-label": "Close create meal dialog", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        handleCreateMeal();
                                    }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsx("input", { type: "text", value: newMeal.name || '', onChange: (e) => setNewMeal({ ...newMeal, name: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: newMeal.description || '', onChange: (e) => setNewMeal({ ...newMeal, description: e.target.value }), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsx(ImageSelector, { currentImage: newMeal.image, mealName: newMeal.name || '', isEthiopian: newMeal.isEthiopian, onImageSelect: (imageUrl) => setNewMeal({ ...newMeal, image: imageUrl }), onImageClear: () => setNewMeal({ ...newMeal, image: '' }), onError: (message) => setError(message) }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "isEthiopian", checked: newMeal.isEthiopian || false, onChange: (e) => setNewMeal({ ...newMeal, isEthiopian: e.target.checked }), className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "isEthiopian", className: "ml-2 block text-sm text-gray-900", children: "Ethiopian Cuisine" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ingredients" }), (newMeal.ingredients || []).map((ingredient, index) => (_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("input", { type: "text", value: ingredient, onChange: (e) => handleIngredientChange(newMeal, index, e.target.value, setNewMeal), className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleRemoveIngredient(newMeal, index, setNewMeal), className: "ml-2 text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500", "aria-label": `Remove ingredient ${ingredient || 'empty'}`, children: _jsx(X, { className: "h-4 w-4" }) })] }, index))), _jsx("button", { type: "button", onClick: () => handleAddIngredient(newMeal, setNewMeal), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Ingredient" }), formErrors.ingredients && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.ingredients })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Preparation" }), _jsx("textarea", { value: newMeal.preparation || '', onChange: (e) => setNewMeal({ ...newMeal, preparation: e.target.value }), rows: 4, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.preparation && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.preparation })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Nutritional Information" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calories" }), _jsx("input", { type: "number", value: newMeal.nutritionInfo?.calories || 0, onChange: (e) => handleNutritionChange(newMeal, 'calories', parseInt(e.target.value) || 0, setNewMeal), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Protein (g)" }), _jsx("input", { type: "number", value: newMeal.nutritionInfo?.protein || 0, onChange: (e) => handleNutritionChange(newMeal, 'protein', parseFloat(e.target.value) || 0, setNewMeal), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Carbs (g)" }), _jsx("input", { type: "number", value: newMeal.nutritionInfo?.carbs || 0, onChange: (e) => handleNutritionChange(newMeal, 'carbs', parseFloat(e.target.value) || 0, setNewMeal), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Fat (g)" }), _jsx("input", { type: "number", value: newMeal.nutritionInfo?.fat || 0, onChange: (e) => handleNutritionChange(newMeal, 'fat', parseFloat(e.target.value) || 0, setNewMeal), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx("button", { type: "button", onClick: () => setIsCreateModalOpen(false), className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md", disabled: isLoading, children: isLoading ? 'Creating...' : 'Create Meal' })] })] })] }) })] }), _jsxs(Dialog, { open: isEditModalOpen, onClose: () => setIsEditModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto", role: "dialog", "aria-labelledby": "edit-meal-title", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Dialog.Title, { id: "edit-meal-title", className: "text-lg font-medium", children: "Edit Meal" }), _jsx("button", { onClick: () => setIsEditModalOpen(false), className: "p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500", "aria-label": "Close edit meal dialog", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), editingMeal && (_jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        handleEditMeal();
                                    }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsx("input", { type: "text", value: editingMeal.name || '', onChange: (e) => setEditingMeal({ ...editingMeal, name: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: editingMeal.description || '', onChange: (e) => setEditingMeal({ ...editingMeal, description: e.target.value }), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsx(ImageSelector, { currentImage: editingMeal.image, mealName: editingMeal.name || '', isEthiopian: editingMeal.isEthiopian, onImageSelect: (imageUrl) => setEditingMeal({ ...editingMeal, image: imageUrl }), onImageClear: () => setEditingMeal({ ...editingMeal, image: '' }), onError: (message) => setError(message) }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "editIsEthiopian", checked: editingMeal.isEthiopian || false, onChange: (e) => setEditingMeal({ ...editingMeal, isEthiopian: e.target.checked }), className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "editIsEthiopian", className: "ml-2 block text-sm text-gray-900", children: "Ethiopian Cuisine" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ingredients" }), (editingMeal.ingredients || []).map((ingredient, index) => (_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("input", { type: "text", value: ingredient, onChange: (e) => handleEditingMealIngredientChange(index, e.target.value), className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleEditingMealRemoveIngredient(index), className: "ml-2 text-red-600 hover:text-red-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500", "aria-label": `Remove ingredient ${ingredient || 'empty'}`, children: _jsx(X, { className: "h-4 w-4" }) })] }, index))), _jsx("button", { type: "button", onClick: handleEditingMealAddIngredient, className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Ingredient" }), formErrors.ingredients && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.ingredients })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Preparation" }), _jsx("textarea", { value: editingMeal.preparation || '', onChange: (e) => setEditingMeal({ ...editingMeal, preparation: e.target.value }), rows: 4, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.preparation && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.preparation })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Nutritional Information" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calories" }), _jsx("input", { type: "number", value: editingMeal.nutritionInfo?.calories || 0, onChange: (e) => handleEditingMealNutritionChange('calories', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Protein (g)" }), _jsx("input", { type: "number", value: editingMeal.nutritionInfo?.protein || 0, onChange: (e) => handleEditingMealNutritionChange('protein', parseFloat(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Carbs (g)" }), _jsx("input", { type: "number", value: editingMeal.nutritionInfo?.carbs || 0, onChange: (e) => handleEditingMealNutritionChange('carbs', parseFloat(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Fat (g)" }), _jsx("input", { type: "number", value: editingMeal.nutritionInfo?.fat || 0, onChange: (e) => handleEditingMealNutritionChange('fat', parseFloat(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx("button", { type: "button", onClick: () => setIsEditModalOpen(false), className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md", disabled: isLoading, children: isLoading ? 'Saving...' : 'Save Changes' })] })] }))] }) })] }), _jsxs(Dialog, { open: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-sm rounded bg-white p-6", role: "dialog", "aria-labelledby": "delete-meal-title", "aria-describedby": "delete-meal-description", children: [_jsx(Dialog.Title, { id: "delete-meal-title", className: "text-lg font-medium", children: "Delete Meal" }), _jsx(Dialog.Description, { id: "delete-meal-description", className: "mt-2", children: "Are you sure you want to delete this meal? This action cannot be undone." }), _jsxs("div", { className: "mt-4 flex justify-end space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-500", onClick: () => setIsDeleteModalOpen(false), disabled: isLoading, children: "Cancel" }), _jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50", onClick: () => {
                                                if (mealToDelete) {
                                                    handleDeleteMeal(mealToDelete);
                                                }
                                            }, disabled: isLoading, children: isLoading ? 'Deleting...' : 'Delete' })] })] }) })] })] }));
};
export default MealManager;
