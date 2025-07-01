"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Filter, X, Database } from "lucide-react";
import Button from "../../components/ui/Button";
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog } from '@headlessui/react';
import MealManager from '../../components/admin/MealManager';
import { ActivityLogService } from '../../services/ActivityLogService';
// Mapping between frontend categories and database diet_types
const categoryToDietType = (category) => {
    const mapping = {
        'weight-loss': 'balanced',
        'weight-gain': 'high-energy',
        'maintenance': 'balanced',
        'muscle-building': 'high-protein',
        'endurance': 'high-energy'
    };
    return mapping[category] || 'balanced';
};
const dietTypeToCategory = (dietType) => {
    const mapping = {
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
    const [nutritionPlans, setNutritionPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isMealManagerOpen, setIsMealManagerOpen] = useState(false);
    const [mealSelectionMode, setMealSelectionMode] = useState(null);
    const [newPlan, setNewPlan] = useState({
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
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;
    useEffect(() => {
        fetchNutritionPlans();
    }, [currentPage]);
    const fetchNutritionPlans = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const { data: countData, error: countError, count } = await supabase
                .from('nutrition_plans')
                .select('id', { count: 'exact' });
            if (countError)
                throw countError;
            setTotalPages(Math.ceil((count || 0) / itemsPerPage));
            const { data, error } = await supabase
                .from('nutrition_plans')
                .select('*')
                .range(from, to)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            // Convert database format to frontend format
            const frontendPlans = (data || []).map((dbPlan) => ({
                id: dbPlan.id,
                title: dbPlan.name,
                description: dbPlan.description,
                duration: parseInt(dbPlan.duration) || 0,
                category: dietTypeToCategory(dbPlan.diet_type),
                calorieRange: { min: 0, max: dbPlan.calories || 0 },
                meals: dbPlan.meal_plan?.meals?.map((meal) => ({
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
        }
        catch (error) {
            console.error('Error fetching nutrition plans:', error);
            setError('Failed to load nutrition plans');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Filter nutrition plans based on search term, diet type, and status
    const filteredPlans = nutritionPlans.filter((plan) => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || plan.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });
    const handleCreatePlan = async () => {
        const errors = validateForm(newPlan);
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
            if (error)
                throw error;
            if (data) {
                // Convert database format back to frontend format for state update
                const frontendPlan = {
                    id: data.id,
                    title: data.name,
                    description: data.description,
                    duration: parseInt(data.duration) || 0,
                    category: dietTypeToCategory(data.diet_type),
                    calorieRange: { min: 0, max: data.calories || 0 },
                    meals: data.meal_plan?.meals?.map((meal) => ({
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
                await ActivityLogService.logNutritionAction('New nutrition plan created', `${newPlan.title} added`, user?.id);
                await ActivityLogService.logAdminActivity(user?.id || '', 'CREATE_NUTRITION_PLAN', {
                    resource: 'nutrition_plan',
                    resourceId: data.id,
                    planTitle: newPlan.title,
                    planCategory: newPlan.category,
                    planDuration: newPlan.duration
                });
            }
        }
        catch (error) {
            console.error('Error creating nutrition plan:', error);
            // Show specific error message for duplicates or general error
            const errorMessage = error.message || 'Failed to create nutrition plan';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    const validateForm = (plan) => {
        const errors = {};
        if (!plan.title?.trim())
            errors.title = 'Title is required';
        if (!plan.description?.trim())
            errors.description = 'Description is required';
        if (plan.duration === undefined || plan.duration <= 0)
            errors.duration = 'Duration is required and must be a positive number';
        if (!plan.category)
            errors.category = 'Category is required';
        if (!plan.calorieRange || plan.calorieRange.max === undefined || plan.calorieRange.max <= 0)
            errors.calorieRange = 'Maximum calorie value is required';
        return errors;
    };
    const handleEditPlan = async (plan) => {
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
            if (error)
                throw error;
            setNutritionPlans(nutritionPlans.map(p => p.id === plan.id ? plan : p));
            setIsEditModalOpen(false);
            setEditingPlan(null);
            // Log the activity
            await ActivityLogService.logNutritionAction('Nutrition plan updated', `${plan.title} modified`, user?.id);
            await ActivityLogService.logAdminActivity(user?.id || '', 'UPDATE_NUTRITION_PLAN', {
                resource: 'nutrition_plan',
                resourceId: plan.id,
                planTitle: plan.title,
                planCategory: plan.category
            });
        }
        catch (error) {
            console.error('Error updating nutrition plan:', error);
            setError('Failed to update nutrition plan');
        }
        finally {
            setIsLoading(false);
        }
    };
    const openDeleteModal = (id) => {
        setPlanToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const handleDeletePlan = async (id) => {
        try {
            // Get plan details before deletion for logging
            const deletedPlan = nutritionPlans.find(p => p.id === id);
            const { error } = await supabase
                .from('nutrition_plans')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setNutritionPlans(nutritionPlans.filter((plan) => plan.id !== id));
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
            // Log the activity
            await ActivityLogService.logNutritionAction('Nutrition plan deleted', `${deletedPlan?.title || 'Unknown plan'} removed`, user?.id);
            await ActivityLogService.logAdminActivity(user?.id || '', 'DELETE_NUTRITION_PLAN', {
                resource: 'nutrition_plan',
                resourceId: id,
                planTitle: deletedPlan?.title || 'Unknown',
                planCategory: deletedPlan?.category || 'Unknown'
            });
        }
        catch (error) {
            console.error('Error deleting nutrition plan:', error);
            setError('Failed to delete nutrition plan');
        }
    };
    // Handlers for nested meal_plan
    const handleAddMeal = (planType) => {
        const newMeal = {
            id: `meal-${Date.now()}`,
            name: '',
            description: '',
            image: '',
            isEthiopian: false,
            ingredients: [],
            preparation: '',
            nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        };
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: [...(prev.meals || []), newMeal],
                calorieRange: prev.calorieRange || { min: 0, max: 0 },
                createdAt: prev.createdAt || new Date().toISOString(),
                updatedAt: prev.updatedAt || new Date().toISOString(),
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: [...(prev.meals || []), newMeal]
            }));
        }
    };
    const handleRemoveMeal = (planType, mealIndex) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).filter((_, i) => i !== mealIndex)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).filter((_, i) => i !== mealIndex)
            }));
        }
    };
    const handleMealChange = (planType, mealIndex, field, value) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal),
                calorieRange: prev.calorieRange || { min: 0, max: 0 },
                createdAt: prev.createdAt || new Date().toISOString(),
                updatedAt: prev.updatedAt || new Date().toISOString(),
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex ? { ...meal, [field]: value } : meal)
            }));
        }
    };
    const handleNutritionalInfoChange = (planType, mealIndex, field, value) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
                    : meal)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, nutritionalInfo: { ...(meal.nutritionalInfo || {}), [field]: value } }
                    : meal)
            }));
        }
    };
    const handleIngredientChange = (planType, mealIndex, ingredientIndex, value) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
                    : meal)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: meal.ingredients.map((ing, j) => j === ingredientIndex ? value : ing) }
                    : meal)
            }));
        }
    };
    const handleAddIngredient = (planType, mealIndex) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: [...meal.ingredients, ''] }
                    : meal)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: [...meal.ingredients, ''] }
                    : meal)
            }));
        }
    };
    const handleRemoveIngredient = (planType, mealIndex, ingredientIndex) => {
        if (planType === 'new') {
            setNewPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
                    : meal)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => ({
                ...prev,
                meals: (prev.meals || []).map((meal, i) => i === mealIndex
                    ? { ...meal, ingredients: meal.ingredients.filter((_, j) => j !== ingredientIndex) }
                    : meal)
            }));
        }
    };
    // Handle meal selection from database
    const handleMealSelect = (selectedMeal) => {
        if (!mealSelectionMode)
            return;
        const { planType, mealIndex } = mealSelectionMode;
        if (mealIndex !== undefined) {
            // Replace existing meal
            if (planType === 'new') {
                setNewPlan(prev => ({
                    ...prev,
                    meals: (prev.meals || []).map((meal, i) => i === mealIndex ? selectedMeal : meal)
                }));
            }
            else if (planType === 'edit' && editingPlan) {
                setEditingPlan(prev => ({
                    ...prev,
                    meals: (prev.meals || []).map((meal, i) => i === mealIndex ? selectedMeal : meal)
                }));
            }
        }
        else {
            // Add new meal
            if (planType === 'new') {
                setNewPlan(prev => ({
                    ...prev,
                    meals: [...(prev.meals || []), selectedMeal]
                }));
            }
            else if (planType === 'edit' && editingPlan) {
                setEditingPlan(prev => ({
                    ...prev,
                    meals: [...(prev.meals || []), selectedMeal]
                }));
            }
        }
        setIsMealManagerOpen(false);
        setMealSelectionMode(null);
    };
    const openMealManager = (planType, mealIndex) => {
        setMealSelectionMode({ planType, mealIndex });
        setIsMealManagerOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Dialog, { open: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-sm rounded bg-white p-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Delete Nutrition Plan" }), _jsx(Dialog.Description, { className: "mt-2", children: "Are you sure you want to delete this nutrition plan? This action cannot be undone." }), _jsxs("div", { className: "mt-4 flex justify-end space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", onClick: () => setIsDeleteModalOpen(false), children: "Cancel" }), _jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md", onClick: () => {
                                                if (planToDelete) {
                                                    handleDeletePlan(planToDelete);
                                                }
                                            }, children: "Delete" })] })] }) })] }), _jsxs(Dialog, { open: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl max-h-[90vh] rounded bg-white flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Create New Nutrition Plan" }), _jsx("button", { onClick: () => setIsCreateModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            handleCreatePlan();
                                        }, className: "space-y-4", id: "create-nutrition-plan-form", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Title" }), _jsx("input", { type: "text", value: newPlan.title || '', onChange: (e) => setNewPlan({ ...newPlan, title: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.title && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.title })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: newPlan.description || '', onChange: (e) => setNewPlan({ ...newPlan, description: e.target.value }), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Category" }), _jsxs("select", { value: newPlan.category, onChange: (e) => setNewPlan({ ...newPlan, category: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" })] }), formErrors.category && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.category })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Duration" }), _jsx("input", { type: "number", value: newPlan.duration || 0, onChange: (e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.duration && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.duration })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calorie Range" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Min Calories" }), _jsx("input", { type: "number", value: newPlan.calorieRange?.min || 0, onChange: (e) => setNewPlan({ ...newPlan, calorieRange: { ...newPlan.calorieRange, min: parseInt(e.target.value) || 0 } }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Max Calories" }), _jsx("input", { type: "number", value: newPlan.calorieRange?.max || 0, onChange: (e) => setNewPlan({ ...newPlan, calorieRange: { ...newPlan.calorieRange, max: parseInt(e.target.value) || 0 } }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] }), formErrors.calorieRange && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.calorieRange })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: "Meal Plan" }), (newPlan.meals || []).map((meal, mealIndex) => (_jsxs("div", { className: "border rounded-md p-4 space-y-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h4", { className: "text-md font-medium", children: ["Meal ", mealIndex + 1] }), _jsx("button", { type: "button", onClick: () => handleRemoveMeal('new', mealIndex), children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Meal Name" }), _jsx("input", { type: "text", value: meal.name, onChange: (e) => handleMealChange('new', mealIndex, 'name', e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Ingredients" }), (meal.ingredients || []).map((ingredient, ingredientIndex) => (_jsxs("div", { className: "flex items-center mt-1", children: [_jsx("input", { type: "text", value: ingredient, onChange: (e) => handleIngredientChange('new', mealIndex, ingredientIndex, e.target.value), className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleRemoveIngredient('new', mealIndex, ingredientIndex), className: "ml-2 text-red-600 hover:text-red-900", children: _jsx(X, { className: "h-4 w-4" }) })] }, ingredientIndex))), _jsx("button", { type: "button", onClick: () => handleAddIngredient('new', mealIndex), className: "mt-2 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Ingredient" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Preparation" }), _jsx("textarea", { value: meal.preparation, onChange: (e) => handleMealChange('new', mealIndex, 'preparation', e.target.value), rows: 2, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: "Nutritional Info" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calories" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.calories || 0, onChange: (e) => handleNutritionalInfoChange('new', mealIndex, 'calories', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Protein (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.protein || 0, onChange: (e) => handleNutritionalInfoChange('new', mealIndex, 'protein', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Carbs (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.carbs || 0, onChange: (e) => handleNutritionalInfoChange('new', mealIndex, 'carbs', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Fat (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.fat || 0, onChange: (e) => handleNutritionalInfoChange('new', mealIndex, 'fat', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] })] })] }, mealIndex))), _jsxs("div", { className: "flex space-x-2 mt-4", children: [_jsx("button", { type: "button", onClick: () => handleAddMeal('new'), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add New Meal" }), _jsx("button", { type: "button", onClick: () => openMealManager('new'), className: "flex items-center text-sm font-medium text-blue-600 hover:text-blue-500", children: _jsx(Database, { className: "mr-1 h-4 w-4" }) })] })] })] }) }), _jsx("div", { className: "border-t border-gray-200 p-6", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { type: "button", onClick: () => setIsCreateModalOpen(false), className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", children: "Cancel" }), _jsx("button", { type: "submit", form: "create-nutrition-plan-form", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md", disabled: isLoading, children: isLoading ? 'Creating...' : 'Create Plan' })] }) })] }) })] }), _jsxs(Dialog, { open: isEditModalOpen, onClose: () => setIsEditModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl max-h-[90vh] rounded bg-white flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Edit Nutrition Plan" }), _jsx("button", { onClick: () => setIsEditModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: editingPlan && (_jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            handleEditPlan(editingPlan);
                                        }, className: "space-y-4", id: "edit-nutrition-plan-form", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Title" }), _jsx("input", { type: "text", value: editingPlan.title, onChange: (e) => setEditingPlan({ ...editingPlan, title: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.title && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.title })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: editingPlan.description || '', onChange: (e) => setEditingPlan({ ...editingPlan, description: e.target.value }), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Category" }), _jsxs("select", { value: editingPlan.category, onChange: (e) => setEditingPlan({ ...editingPlan, category: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" })] }), formErrors.category && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.category })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Status" }), _jsxs("select", { value: editingPlan.status, onChange: (e) => setEditingPlan({ ...editingPlan, status: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Duration" }), _jsx("input", { type: "number", value: editingPlan.duration, onChange: (e) => setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.duration && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.duration })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calorie Range" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Min Calories" }), _jsx("input", { type: "number", value: editingPlan.calorieRange?.min || 0, onChange: (e) => setEditingPlan({ ...editingPlan, calorieRange: { ...editingPlan.calorieRange, min: parseInt(e.target.value) || 0 } }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Max Calories" }), _jsx("input", { type: "number", value: editingPlan.calorieRange?.max || 0, onChange: (e) => setEditingPlan({ ...editingPlan, calorieRange: { ...editingPlan.calorieRange, max: parseInt(e.target.value) || 0 } }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] }), formErrors.calorieRange && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.calorieRange })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: "Meal Plan" }), (editingPlan.meals || []).map((meal, mealIndex) => (_jsxs("div", { className: "border rounded-md p-4 space-y-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h4", { className: "text-md font-medium", children: ["Meal ", mealIndex + 1] }), _jsx("button", { type: "button", onClick: () => handleRemoveMeal('edit', mealIndex), children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Meal Name" }), _jsx("input", { type: "text", value: meal.name, onChange: (e) => handleMealChange('edit', mealIndex, 'name', e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Ingredients" }), (meal.ingredients || []).map((ingredient, ingredientIndex) => (_jsxs("div", { className: "flex items-center mt-1", children: [_jsx("input", { type: "text", value: ingredient, onChange: (e) => handleIngredientChange('edit', mealIndex, ingredientIndex, e.target.value), className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleRemoveIngredient('edit', mealIndex, ingredientIndex), className: "ml-2 text-red-600 hover:text-red-900", children: _jsx(X, { className: "h-4 w-4" }) })] }, ingredientIndex))), _jsx("button", { type: "button", onClick: () => handleAddIngredient('edit', mealIndex), className: "mt-2 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Ingredient" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Preparation" }), _jsx("textarea", { value: meal.preparation, onChange: (e) => handleMealChange('edit', mealIndex, 'preparation', e.target.value), rows: 2, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: "Nutritional Info" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Calories" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.calories || 0, onChange: (e) => handleNutritionalInfoChange('edit', mealIndex, 'calories', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Protein (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.protein || 0, onChange: (e) => handleNutritionalInfoChange('edit', mealIndex, 'protein', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Carbs (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.carbs || 0, onChange: (e) => handleNutritionalInfoChange('edit', mealIndex, 'carbs', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Fat (g)" }), _jsx("input", { type: "number", value: meal.nutritionalInfo?.fat || 0, onChange: (e) => handleNutritionalInfoChange('edit', mealIndex, 'fat', parseInt(e.target.value) || 0), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" })] })] })] })] }, mealIndex))), _jsxs("div", { className: "flex space-x-2 mt-4", children: [_jsx("button", { type: "button", onClick: () => handleAddMeal('edit'), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add New Meal" }), _jsx("button", { type: "button", onClick: () => openMealManager('edit'), className: "flex items-center text-sm font-medium text-blue-600 hover:text-blue-500", children: _jsx(Database, { className: "mr-1 h-4 w-4" }) })] })] })] })) }), _jsx("div", { className: "border-t border-gray-200 p-6", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { type: "button", onClick: () => setIsEditModalOpen(false), className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", children: "Cancel" }), _jsx("button", { type: "submit", form: "edit-nutrition-plan-form", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md", disabled: isLoading, children: isLoading ? 'Saving...' : 'Save Changes' })] }) })] }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsx("div", { className: "mb-4 sm:mb-0" }), _jsxs(Button, { className: "flex items-center", onClick: () => {
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
                        }, children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Create New Plan"] })] }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:space-x-4", children: [_jsxs("div", { className: "relative flex-grow mb-4 md:mb-0", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search nutrition plans...", className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Filter, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("select", { className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Filter, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("select", { className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Created At" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredPlans.map((plan) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: plan.title }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.category === "maintenance"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : plan.category === "weight-loss"
                                                            ? "bg-green-100 text-green-800"
                                                            : plan.category === "weight-gain"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : "bg-gray-100 text-gray-800"}`, children: plan.category.charAt(0).toUpperCase() + plan.category.slice(1) }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [plan.duration, " days"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(plan.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.status === "published"
                                                        ? "bg-green-100 text-green-800"
                                                        : plan.status === "draft"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"}`, children: plan.status.charAt(0).toUpperCase() + plan.status.slice(1) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "text-indigo-600 hover:text-indigo-900", onClick: () => {
                                                                setEditingPlan(plan);
                                                                setIsEditModalOpen(true);
                                                                setFormErrors({});
                                                            }, children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { className: "text-red-600 hover:text-red-900", onClick: () => openDeleteModal(plan.id), children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, plan.id))) })] }) }), filteredPlans.length === 0 && (_jsx("div", { className: "px-6 py-4 text-center text-gray-500", children: "No nutrition plans found matching your criteria." }))] }), _jsxs("div", { className: "flex justify-center items-center space-x-2", children: [_jsx(Button, { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1 || isLoading, variant: "outline", size: "sm", children: "Previous" }), _jsxs("span", { className: "text-sm text-gray-700", children: ["Page ", currentPage, " of ", totalPages] }), _jsx(Button, { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages || isLoading, variant: "outline", size: "sm", children: "Next" })] }), isLoading && (_jsx("div", { className: "flex justify-center items-center py-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }) })), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: _jsx("p", { children: error }) })), _jsxs(Dialog, { open: isMealManagerOpen, onClose: () => setIsMealManagerOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-6xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Select Meal from Database" }), _jsx("button", { onClick: () => setIsMealManagerOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsx(MealManager, { onMealSelect: handleMealSelect, selectionMode: true })] }) })] })] }));
};
export default AdminNutrition;
