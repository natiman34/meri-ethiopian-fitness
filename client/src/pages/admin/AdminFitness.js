"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash2, Plus, X } from "lucide-react";
import Button from "../../components/ui/Button";
import { FitnessPlan } from '../../types/content';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog } from '@headlessui/react';
import { FitnessPlanService } from '../../services/FitnessPlanService';
const AdminFitness = () => {
    const [plans, setPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({
        title: '',
        description: '',
        category: 'weight-loss',
        level: 'beginner',
        duration: 30,
        weekly_workouts: 3,
        difficulty: 1,
        prerequisites: [],
        equipment: [],
        goals: [],
        schedule: [],
        status: 'draft',
        tags: [],
        featured: false,
        rating: undefined,
        reviewCount: undefined,
        completionRate: undefined,
        averageWorkoutTime: undefined,
        muscleGroups: [],
        equipmentRequired: [],
        timeOfDay: 'any',
        location: 'any',
        intensity: 'low',
        created_at: new Date().toISOString(),
    });
    const [formErrors, setFormErrors] = useState({});
    const itemsPerPage = 10;
    const { user } = useAuth();
    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const { error: countError, count } = await supabase
                .from('fitness_plans')
                .select('id', { count: 'exact' });
            if (countError)
                throw countError;
            setTotalPages(Math.ceil((count || 0) / itemsPerPage));
            const { data, error } = await supabase
                .from('fitness_plans')
                .select('*')
                .range(from, to)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            // Transform database data to frontend format
            const transformedPlans = (data || []).map(planData => {
                // Create a new FitnessPlan instance with proper field mapping
                return new FitnessPlan({
                    ...planData,
                    // Map database fields to frontend fields
                    user_id: planData.planner_id || planData.user_id,
                    title: planData.title || planData.name,
                    category: planData.category || planData.plan_type,
                    level: planData.level || planData.difficulty_level,
                    schedule: planData.schedule || planData.exercise_list || [],
                    muscleGroups: planData.muscle_groups || [],
                    equipmentRequired: planData.equipment_required || [],
                    timeOfDay: planData.time_of_day,
                    reviewCount: planData.review_count,
                    completionRate: planData.completion_rate,
                    averageWorkoutTime: planData.average_workout_time,
                });
            });
            setPlans(transformedPlans);
        }
        catch (error) {
            console.error('Error fetching fitness plans:', error);
            setError('Failed to load fitness plans');
        }
        finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage]);
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);
    // Filter fitness plans based on search term, plan type, difficulty level, and status
    const filteredPlans = plans.filter((plan) => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || plan.category === selectedCategory;
        const matchesLevel = selectedLevel === "all" || plan.level === selectedLevel;
        const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
    const validateForm = (plan) => {
        const errors = {};
        if (!plan.title?.trim())
            errors.title = 'Title is required';
        if (!plan.description?.trim())
            errors.description = 'Description is required';
        if (!plan.category)
            errors.category = 'Category is required';
        if (!plan.level)
            errors.level = 'Level is required';
        if (plan.duration === undefined || plan.duration < 1)
            errors.duration = 'Duration must be at least 1 week';
        if (plan.weekly_workouts === undefined || plan.weekly_workouts < 1)
            errors.weekly_workouts = 'Weekly workouts must be at least 1';
        if (plan.difficulty === undefined || plan.difficulty < 1 || plan.difficulty > 5)
            errors.difficulty = 'Difficulty must be between 1 and 5';
        // Make these fields optional for now to allow basic plan creation
        // if (!plan.prerequisites?.length) errors.prerequisites = 'At least one prerequisite is required'
        // if (!plan.equipment?.length) errors.equipment = 'At least one equipment item is required'
        // if (!plan.goals?.length) errors.goals = 'At least one goal is required'
        // if (!plan.schedule?.length) errors.schedule = 'At least one day of schedule is required'
        return errors;
    };
    const handleCreatePlan = async () => {
        const errors = validateForm(newPlan);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // Use the FitnessPlanService with duplicate checking
            const planData = {
                ...newPlan,
                user_id: user?.id || null,
            };
            // Check for duplicates first
            const exists = await FitnessPlanService.getInstance().checkFitnessPlanExists(newPlan.title?.trim() || '', newPlan.category, newPlan.level);
            if (exists) {
                throw new Error(`A fitness plan with the title "${newPlan.title}" already exists in ${newPlan.category} category at ${newPlan.level} level. Please choose a different title.`);
            }
            // Transform frontend data to database format
            const planToInsert = {
                planner_id: user?.id || null,
                name: newPlan.title || '',
                title: newPlan.title || '',
                description: newPlan.description || '',
                duration: newPlan.duration?.toString() || '30',
                plan_type: newPlan.category || 'weight-loss',
                category: newPlan.category || 'weight-loss',
                difficulty_level: newPlan.level || 'beginner',
                level: newPlan.level || 'beginner',
                exercise_list: newPlan.schedule || [],
                schedule: newPlan.schedule || [],
                weekly_workouts: newPlan.weekly_workouts || 3,
                difficulty: newPlan.difficulty || 1,
                prerequisites: newPlan.prerequisites || [],
                equipment: newPlan.equipment || [],
                goals: newPlan.goals || [],
                status: newPlan.status || 'draft',
                tags: newPlan.tags || [],
                featured: newPlan.featured || false,
                muscle_groups: newPlan.muscleGroups || [],
                equipment_required: newPlan.equipmentRequired || [],
                time_of_day: newPlan.timeOfDay || 'any',
                location: newPlan.location || 'any',
                intensity: newPlan.intensity || 'low',
                created_at: new Date().toISOString(),
            };
            const { data, error } = await supabase
                .from('fitness_plans')
                .insert([planToInsert])
                .select()
                .single();
            if (error) {
                // Handle database constraint violations
                if (error.code === '23505') { // Unique constraint violation
                    if (error.message.includes('unique_fitness_plan_title')) {
                        throw new Error(`A fitness plan with the title "${newPlan.title}" already exists. Please choose a different title.`);
                    }
                    if (error.message.includes('unique_fitness_plan_title_category_level')) {
                        throw new Error(`A fitness plan with the title "${newPlan.title}" already exists in ${newPlan.category} category at ${newPlan.level} level. Please choose a different title.`);
                    }
                }
                throw error;
            }
            if (data) {
                setPlans([new FitnessPlan(data), ...plans]);
                setIsCreateModalOpen(false);
                setNewPlan({
                    title: '',
                    description: '',
                    category: 'weight-loss',
                    level: 'beginner',
                    duration: 30,
                    weekly_workouts: 3,
                    difficulty: 1,
                    prerequisites: [],
                    equipment: [],
                    goals: [],
                    schedule: [],
                    status: 'draft',
                    tags: [],
                    featured: false,
                    rating: undefined,
                    reviewCount: undefined,
                    completionRate: undefined,
                    averageWorkoutTime: undefined,
                    muscleGroups: [],
                    equipmentRequired: [],
                    timeOfDay: 'any',
                    location: 'any',
                    intensity: 'low',
                });
                setFormErrors({});
            }
        }
        catch (error) {
            console.error('Error creating fitness plan:', error);
            // Show specific error message for duplicates or general error
            const errorMessage = error.message || 'Failed to create fitness plan';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
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
            // Transform frontend data to database format
            const planToUpdate = {
                planner_id: plan.user_id,
                name: plan.title,
                title: plan.title,
                description: plan.description,
                duration: plan.duration?.toString() || '30',
                plan_type: plan.category,
                category: plan.category,
                difficulty_level: plan.level,
                level: plan.level,
                exercise_list: plan.schedule,
                schedule: plan.schedule,
                weekly_workouts: plan.weekly_workouts,
                difficulty: plan.difficulty,
                prerequisites: plan.prerequisites,
                equipment: plan.equipment,
                goals: plan.goals,
                status: plan.status,
                tags: plan.tags,
                featured: plan.featured,
                muscle_groups: plan.muscleGroups,
                equipment_required: plan.equipmentRequired,
                time_of_day: plan.timeOfDay,
                location: plan.location,
                intensity: plan.intensity,
                updated_at: new Date().toISOString(),
            };
            const { data, error } = await supabase
                .from('fitness_plans')
                .update(planToUpdate)
                .eq('id', plan.id)
                .select()
                .single();
            if (error)
                throw error;
            if (data) {
                setPlans(plans.map(p => p.id === plan.id ? new FitnessPlan(data) : p));
            }
            setIsEditModalOpen(false);
            setEditingPlan(null);
            setFormErrors({});
        }
        catch (error) {
            console.error('Error updating fitness plan:', error);
            setError('Failed to update fitness plan');
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
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('fitness_plans')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setPlans(plans.filter((plan) => plan.id !== id));
        }
        catch (error) {
            console.error('Error deleting fitness plan:', error);
            setError('Failed to delete fitness plan');
        }
        finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
        }
    };
    const handleAddDay = (planType) => {
        const newDay = {
            day: planType === 'new'
                ? (newPlan.schedule?.length || 0) + 1
                : (editingPlan?.schedule?.length || 0) + 1,
            restDay: false,
            exercises: [],
            totalEstimatedTime: 0,
            focusAreas: [],
            notes: undefined,
            totalCaloriesBurn: undefined,
        };
        if (planType === 'new') {
            setNewPlan((prev) => ({
                ...prev,
                schedule: [...(prev?.schedule || []), newDay]
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => {
                if (!prev)
                    return null;
                return new FitnessPlan({
                    ...prev.toObject(),
                    schedule: [...(prev.schedule || []), newDay]
                });
            });
        }
    };
    const handleRemoveDay = (planType, dayIndex) => {
        if (planType === 'new') {
            setNewPlan((prev) => ({
                ...prev,
                schedule: (prev?.schedule || []).filter((_, i) => i !== dayIndex)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => {
                if (!prev)
                    return null;
                return new FitnessPlan({
                    ...prev.toObject(),
                    schedule: (prev.schedule || []).filter((_, i) => i !== dayIndex)
                });
            });
        }
    };
    const handleAddExercise = (planType, dayIndex) => {
        const newExercise = {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            image: '',
            gifUrl: '',
            videoUrl: undefined,
            steps: [],
            sets: [],
            equipment: [],
            targetMuscles: [],
            secondaryMuscles: [],
            difficulty: 'beginner',
            category: 'strength',
            instructions: [],
            tips: [],
            commonMistakes: [],
            variations: [],
            estimatedTime: 0,
            caloriesBurn: undefined,
            muscleGroup: 'full-body',
        };
        if (planType === 'new') {
            setNewPlan((prev) => ({
                ...prev,
                schedule: (prev?.schedule || []).map((day, i) => i === dayIndex
                    ? { ...day, exercises: [...day.exercises, newExercise] }
                    : day)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => {
                if (!prev)
                    return null;
                return new FitnessPlan({
                    ...prev.toObject(),
                    schedule: (prev.schedule || []).map((day, i) => i === dayIndex
                        ? { ...day, exercises: [...day.exercises, newExercise] }
                        : day)
                });
            });
        }
    };
    const handleRemoveExercise = (planType, dayIndex, exerciseIndex) => {
        if (planType === 'new') {
            setNewPlan((prev) => ({
                ...prev,
                schedule: (prev?.schedule || []).map((day, i) => i === dayIndex
                    ? { ...day, exercises: day.exercises.filter((_, j) => j !== exerciseIndex) }
                    : day)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => {
                if (!prev)
                    return null;
                return new FitnessPlan({
                    ...prev.toObject(),
                    schedule: (prev.schedule || []).map((day, i) => i === dayIndex
                        ? { ...day, exercises: day.exercises.filter((_, j) => j !== exerciseIndex) }
                        : day)
                });
            });
        }
    };
    const handleExerciseChange = (planType, dayIndex, exerciseIndex, field, value) => {
        if (planType === 'new') {
            setNewPlan((prev) => ({
                ...prev,
                schedule: (prev?.schedule || []).map((day, i) => i === dayIndex
                    ? { ...day, exercises: day.exercises.map((exercise, j) => j === exerciseIndex ? { ...exercise, [field]: value } : exercise) }
                    : day)
            }));
        }
        else if (planType === 'edit' && editingPlan) {
            setEditingPlan(prev => {
                if (!prev)
                    return null;
                return new FitnessPlan({
                    ...prev.toObject(),
                    schedule: (prev.schedule || []).map((day, i) => i === dayIndex
                        ? { ...day, exercises: day.exercises.map((exercise, j) => j === exerciseIndex ? { ...exercise, [field]: value } : exercise) }
                        : day)
                });
            });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Dialog, { open: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-sm rounded bg-white p-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Delete Fitness Plan" }), _jsx(Dialog.Description, { className: "mt-2", children: "Are you sure you want to delete this fitness plan? This action cannot be undone." }), _jsxs("div", { className: "mt-4 flex justify-end space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", onClick: () => setIsDeleteModalOpen(false), children: "Cancel" }), _jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md", onClick: () => {
                                                if (planToDelete) {
                                                    handleDeletePlan(planToDelete);
                                                }
                                            }, children: "Delete" })] })] }) })] }), _jsxs(Dialog, { open: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-4xl rounded bg-white p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Create New Fitness Plan" }), _jsx("button", { onClick: () => setIsCreateModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        handleCreatePlan();
                                    }, className: "mt-4 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Title" }), _jsx("input", { type: "text", value: newPlan.title || '', onChange: (e) => setNewPlan({ ...newPlan, title: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.title && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.title })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Category" }), _jsxs("select", { value: newPlan.category, onChange: (e) => setNewPlan({ ...newPlan, category: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "strength", children: "Strength" }), _jsx("option", { value: "flexibility", children: "Flexibility" }), _jsx("option", { value: "endurance", children: "Endurance" })] }), formErrors.category && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.category })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: newPlan.description || '', onChange: (e) => setNewPlan({ ...newPlan, description: e.target.value }), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Level" }), _jsxs("select", { value: newPlan.level, onChange: (e) => setNewPlan({ ...newPlan, level: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "beginner", children: "Beginner" }), _jsx("option", { value: "intermediate", children: "Intermediate" }), _jsx("option", { value: "advanced", children: "Advanced" })] }), formErrors.level && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.level })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Duration (minutes)" }), _jsx("input", { type: "number", min: "1", value: newPlan.duration || '', onChange: (e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.duration && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.duration })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Weekly Workouts" }), _jsx("input", { type: "number", min: "1", value: newPlan.weekly_workouts || '', onChange: (e) => setNewPlan({ ...newPlan, weekly_workouts: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.weekly_workouts && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.weekly_workouts })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Difficulty (1-5)" }), _jsx("input", { type: "number", min: "1", max: "5", value: newPlan.difficulty || '', onChange: (e) => setNewPlan({ ...newPlan, difficulty: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.difficulty && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.difficulty })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Status" }), _jsxs("select", { value: newPlan.status, onChange: (e) => setNewPlan({ ...newPlan, status: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Prerequisites" }), _jsxs("div", { className: "space-y-2", children: [(newPlan.prerequisites || []).map((prereq, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", value: prereq, onChange: (e) => {
                                                                                const newPrereqs = [...(newPlan.prerequisites || [])];
                                                                                newPrereqs[index] = e.target.value;
                                                                                setNewPlan({ ...newPlan, prerequisites: newPrereqs });
                                                                            }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => {
                                                                                const newPrereqs = (newPlan.prerequisites || []).filter((_, i) => i !== index);
                                                                                setNewPlan({ ...newPlan, prerequisites: newPrereqs });
                                                                            }, children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }, index))), _jsx("button", { type: "button", onClick: () => setNewPlan({ ...newPlan, prerequisites: [...(newPlan.prerequisites || []), ''] }), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Prerequisite" })] }), formErrors.prerequisites && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.prerequisites })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Equipment" }), _jsxs("div", { className: "space-y-2", children: [(newPlan.equipment || []).map((item, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", value: item, onChange: (e) => {
                                                                                const newEquipment = [...(newPlan.equipment || [])];
                                                                                newEquipment[index] = e.target.value;
                                                                                setNewPlan({ ...newPlan, equipment: newEquipment });
                                                                            }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => {
                                                                                const newEquipment = (newPlan.equipment || []).filter((_, i) => i !== index);
                                                                                setNewPlan({ ...newPlan, equipment: newEquipment });
                                                                            }, children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }, index))), _jsx("button", { type: "button", onClick: () => setNewPlan({ ...newPlan, equipment: [...(newPlan.equipment || []), ''] }), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Equipment" })] }), formErrors.equipment && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.equipment })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Goals" }), _jsxs("div", { className: "space-y-2", children: [(newPlan.goals || []).map((goal, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", value: goal, onChange: (e) => {
                                                                                const newGoals = [...(newPlan.goals || [])];
                                                                                newGoals[index] = e.target.value;
                                                                                setNewPlan({ ...newPlan, goals: newGoals });
                                                                            }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => {
                                                                                const newGoals = (newPlan.goals || []).filter((_, i) => i !== index);
                                                                                setNewPlan({ ...newPlan, goals: newGoals });
                                                                            }, children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }, index))), _jsx("button", { type: "button", onClick: () => setNewPlan({ ...newPlan, goals: [...(newPlan.goals || []), ''] }), className: "text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Goal" })] }), formErrors.goals && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.goals })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: "Schedule" }), (newPlan.schedule || []).map((day, dayIndex) => (_jsxs("div", { className: "border rounded-md p-4 space-y-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("h4", { className: "text-md font-medium", children: ["Day ", day.day] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: day.restDay, onChange: (e) => {
                                                                                        const newSchedule = [...(newPlan.schedule || [])];
                                                                                        newSchedule[dayIndex] = { ...day, restDay: e.target.checked };
                                                                                        setNewPlan({ ...newPlan, schedule: newSchedule });
                                                                                    }, className: "rounded border-gray-300 text-green-600 focus:ring-green-500" }), _jsx("span", { className: "text-sm text-gray-600", children: "Rest Day" })] })] }), _jsx("button", { type: "button", onClick: () => handleRemoveDay('new', dayIndex), className: "text-red-500 hover:text-red-700", children: _jsx(X, { className: "h-4 w-4" }) })] }), !day.restDay && (_jsxs("div", { className: "space-y-3", children: [day.exercises.map((exercise, exerciseIndex) => (_jsxs("div", { className: "border rounded-md p-3 bg-white", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("input", { type: "text", value: exercise.name, onChange: (e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'name', e.target.value), placeholder: "Exercise name", className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleRemoveExercise('new', dayIndex, exerciseIndex), className: "ml-2 text-red-500 hover:text-red-700", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: exercise.description, onChange: (e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'description', e.target.value), placeholder: "Exercise description", rows: 2, className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Steps" }), exercise.steps.map((step, stepIndex) => (_jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("input", { type: "text", value: step, onChange: (e) => {
                                                                                                        const newSteps = [...exercise.steps];
                                                                                                        newSteps[stepIndex] = e.target.value;
                                                                                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps);
                                                                                                    }, placeholder: `Step ${stepIndex + 1}`, className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => {
                                                                                                        const newSteps = exercise.steps.filter((_, i) => i !== stepIndex);
                                                                                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps);
                                                                                                    }, className: "text-red-500 hover:text-red-700", children: _jsx(X, { className: "h-4 w-4" }) })] }, stepIndex))), _jsx("button", { type: "button", onClick: () => {
                                                                                                const newSteps = [...exercise.steps, ''];
                                                                                                handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps);
                                                                                            }, className: "mt-2 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Step" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Target Muscles" }), exercise.targetMuscles.map((muscle, muscleIndex) => (_jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("input", { type: "text", value: muscle, onChange: (e) => {
                                                                                                        const newMuscles = [...exercise.targetMuscles];
                                                                                                        newMuscles[muscleIndex] = e.target.value;
                                                                                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles);
                                                                                                    }, placeholder: "Target muscle", className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => {
                                                                                                        const newMuscles = exercise.targetMuscles.filter((_, i) => i !== muscleIndex);
                                                                                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles);
                                                                                                    }, className: "text-red-500 hover:text-red-700", children: _jsx(X, { className: "h-4 w-4" }) })] }, muscleIndex))), _jsx("button", { type: "button", onClick: () => {
                                                                                                const newMuscles = [...exercise.targetMuscles, ''];
                                                                                                handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles);
                                                                                            }, className: "mt-2 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Target Muscle" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Difficulty" }), _jsxs("select", { value: exercise.difficulty, onChange: (e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'difficulty', e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "beginner", children: "Beginner" }), _jsx("option", { value: "intermediate", children: "Intermediate" }), _jsx("option", { value: "advanced", children: "Advanced" })] })] })] })] }, exercise.id))), _jsx("button", { type: "button", onClick: () => handleAddExercise('new', dayIndex), className: "mt-2 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Exercise" })] }))] }, dayIndex))), _jsx("button", { type: "button", onClick: () => handleAddDay('new'), className: "mt-4 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Day" }), formErrors.schedule && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.schedule })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setIsCreateModalOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", disabled: isLoading, children: isLoading ? 'Creating...' : 'Create Plan' })] })] })] }) })] }), _jsxs(Dialog, { open: isEditModalOpen, onClose: () => setIsEditModalOpen(false), className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/30", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl rounded bg-white p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Dialog.Title, { className: "text-lg font-medium", children: "Edit Fitness Plan" }), _jsx("button", { onClick: () => setIsEditModalOpen(false), children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), editingPlan && (_jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        if (editingPlan)
                                            handleEditPlan(editingPlan);
                                    }, className: "mt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Title" }), _jsx("input", { type: "text", value: editingPlan?.title || '', onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), title: e.target.value }) : null), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.title && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.title })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { value: editingPlan?.description || '', onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), description: e.target.value }) : null), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.description && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Category" }), _jsxs("select", { value: editingPlan?.category || '', onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), category: e.target.value }) : null), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "strength", children: "Strength" }), _jsx("option", { value: "flexibility", children: "Flexibility" }), _jsx("option", { value: "endurance", children: "Endurance" })] }), formErrors.category && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.category })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Level" }), _jsxs("select", { value: editingPlan?.level || '', onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), level: e.target.value }) : null), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "beginner", children: "Beginner" }), _jsx("option", { value: "intermediate", children: "Intermediate" }), _jsx("option", { value: "advanced", children: "Advanced" })] }), formErrors.level && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.level })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Duration" }), _jsx("input", { type: "text", value: editingPlan?.duration || 0, onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), duration: parseInt(e.target.value) || 0 }) : null), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), formErrors.duration && _jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.duration })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Status" }), _jsxs("select", { value: editingPlan?.status || '', onChange: (e) => setEditingPlan(prev => prev ? new FitnessPlan({ ...prev.toObject(), status: e.target.value }) : null), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: "Exercises" }), (editingPlan.schedule || []).map((day, dayIndex) => (_jsxs("div", { className: "border rounded-md p-4 space-y-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h4", { className: "text-md font-medium", children: ["Day ", dayIndex + 1] }), _jsx("button", { type: "button", onClick: () => handleRemoveDay('edit', dayIndex), children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Exercises" }), day.exercises.map((exercise, exerciseIndex) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", value: exercise.name, onChange: (e) => handleExerciseChange('edit', dayIndex, exerciseIndex, 'name', e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: () => handleRemoveExercise('edit', dayIndex, exerciseIndex), children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }, exerciseIndex))), _jsx("button", { type: "button", onClick: () => handleAddExercise('edit', dayIndex), className: "mt-4 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Exercise" })] })] }, dayIndex))), _jsx("button", { type: "button", onClick: () => handleAddDay('edit'), className: "mt-4 text-sm font-medium text-green-600 hover:text-green-500", children: "+ Add Day" })] }), _jsxs("div", { className: "mt-6 flex justify-end space-x-2", children: [_jsx("button", { type: "button", onClick: () => setIsEditModalOpen(false), className: "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md", disabled: isLoading, children: isLoading ? 'Saving...' : 'Save Changes' })] })] }))] }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 sm:mb-0", children: "Fitness Plans" }), _jsxs(Button, { className: "flex items-center", onClick: () => {
                                    setIsCreateModalOpen(true);
                                    setNewPlan({
                                        title: '',
                                        description: '',
                                        category: 'weight-loss',
                                        level: 'beginner',
                                        duration: 30,
                                        weekly_workouts: 3,
                                        difficulty: 1,
                                        prerequisites: [],
                                        equipment: [],
                                        goals: [],
                                        schedule: [],
                                        status: 'draft',
                                        tags: [],
                                        featured: false,
                                        rating: undefined,
                                        reviewCount: undefined,
                                        completionRate: undefined,
                                        averageWorkoutTime: undefined,
                                        muscleGroups: [],
                                        equipmentRequired: [],
                                        timeOfDay: 'any',
                                        location: 'any',
                                        intensity: 'low',
                                    });
                                    setFormErrors({});
                                }, children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Create New Plan"] })] }), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:space-x-4", children: [_jsxs("div", { className: "relative flex-grow mb-4 md:mb-0", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search fitness plans...", className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 sr-only", children: "Category Filter" }), _jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "weight-loss", children: "Weight Loss" }), _jsx("option", { value: "weight-gain", children: "Weight Gain" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "strength", children: "Strength" }), _jsx("option", { value: "flexibility", children: "Flexibility" }), _jsx("option", { value: "endurance", children: "Endurance" })] })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 sr-only", children: "Level Filter" }), _jsxs("select", { value: selectedLevel, onChange: (e) => setSelectedLevel(e.target.value), className: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Levels" }), _jsx("option", { value: "beginner", children: "Beginner" }), _jsx("option", { value: "intermediate", children: "Intermediate" }), _jsx("option", { value: "advanced", children: "Advanced" })] })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 sr-only", children: "Status Filter" }), _jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Level" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Workouts/Week" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredPlans.map((plan) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: plan.title }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "inline-flex px-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800", children: plan.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 text-xs font-semibold rounded-full ${plan.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                                                plan.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'}`, children: plan.level.charAt(0).toUpperCase() + plan.level.slice(1) }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [plan.duration, " minutes"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [plan.weekly_workouts, " days"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`, children: plan.status.charAt(0).toUpperCase() + plan.status.slice(1) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { className: "text-indigo-600 hover:text-indigo-900", onClick: () => {
                                                                        setEditingPlan(plan);
                                                                        setIsEditModalOpen(true);
                                                                        setFormErrors({});
                                                                    }, children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { className: "text-red-600 hover:text-red-900", onClick: () => openDeleteModal(plan.id), children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, plan.id))) })] }) }), filteredPlans.length === 0 && !isLoading && (_jsx("div", { className: "px-6 py-4 text-center text-gray-500", children: "No fitness plans found matching your criteria." }))] }), totalPages > 1 && (_jsx("div", { className: "flex justify-center mt-4", children: _jsxs("nav", { className: "relative z-0 inline-flex rounded-md shadow-sm -space-x-px", "aria-label": "Pagination", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage === 1, className: "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page
                                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                        : 'text-gray-500 hover:bg-gray-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, className: "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] }) }))] }), isLoading && (_jsx("div", { className: "flex justify-center items-center py-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }) })), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-4", children: _jsx("p", { children: error }) }))] }));
};
export default AdminFitness;
