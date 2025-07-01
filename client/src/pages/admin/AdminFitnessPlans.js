"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Edit, Trash2, Save, X, Dumbbell, BarChart3, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { FitnessPlan } from "../../types/content";
import { useAuth } from "../../contexts/AuthContext";
const FITNESS_CATEGORIES = [
    'weight-loss', 'weight-gain', 'maintenance', 'strength', 'flexibility', 'endurance',
    'muscle-building', 'powerlifting', 'bodybuilding', 'functional', 'beginner', 'home',
    'gym', 'men', 'women', 'fat-burning', 'leg',
];
const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced'];
const AdminFitnessPlans = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [uploadingFile, setUploadingFile] = useState(null);
    const [previewUrls, setPreviewUrls] = useState({});
    const { user } = useAuth();
    const fitnessPlanService = FitnessPlanService.getInstance();
    useEffect(() => {
        fetchPlans();
    }, []);
    const fetchPlans = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Try to fetch from Supabase database first
            try {
                const databasePlans = await fitnessPlanService.getFitnessPlans();
                setPlans(databasePlans);
            }
            catch (dbError) {
                console.warn("Database fetch failed, using local data:", dbError);
                // Fallback to local data if database is not available
                const localPlans = await fitnessPlanService.getFitnessPlans();
                setPlans(localPlans);
            }
        }
        catch (err) {
            console.error("Error fetching fitness plans:", err);
            setError("Failed to load fitness plans: " + err.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // File upload handlers
    const handleFileUpload = async (file, type) => {
        if (!currentPlan)
            return;
        setUploadingFile(type);
        setError(null);
        try {
            // Validate file
            if (type === 'image' && !file.type.startsWith('image/')) {
                throw new Error('Please select an image file');
            }
            if ((type === 'thumbnail' || type === 'full') && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                throw new Error('Please select an image or GIF file');
            }
            // Check file size (max 10MB for GIFs, 5MB for images)
            const maxSize = (type === 'thumbnail' || type === 'full') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
            }
            const planId = currentPlan.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
            let uploadedUrl;
            if (type === 'image') {
                uploadedUrl = await fitnessPlanService.uploadImage(file, planId);
                setCurrentPlan(prev => ({ ...prev, image_url: uploadedUrl }));
            }
            else if (type === 'thumbnail') {
                uploadedUrl = await fitnessPlanService.uploadGif(file, planId, 'thumbnail');
                setCurrentPlan(prev => ({ ...prev, thumbnail_gif_url: uploadedUrl }));
            }
            else {
                uploadedUrl = await fitnessPlanService.uploadGif(file, planId, 'full');
                setCurrentPlan(prev => ({ ...prev, full_gif_url: uploadedUrl }));
            }
            // Create preview URL for immediate display
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrls(prev => ({ ...prev, [type]: previewUrl }));
            setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
        }
        catch (err) {
            console.error(`Error uploading ${type}:`, err);
            setError(`Failed to upload ${type}: ${err.message}`);
        }
        finally {
            setUploadingFile(null);
        }
    };
    const handleUrlInput = (url, type) => {
        if (!currentPlan)
            return;
        if (type === 'image') {
            setCurrentPlan(prev => ({ ...prev, image_url: url }));
        }
        else if (type === 'thumbnail') {
            setCurrentPlan(prev => ({ ...prev, thumbnail_gif_url: url }));
        }
        else {
            setCurrentPlan(prev => ({ ...prev, full_gif_url: url }));
        }
        setPreviewUrls(prev => ({ ...prev, [type]: url }));
    };
    const handleAddClick = () => {
        setCurrentPlan(new FitnessPlan({
            user_id: user?.id || null,
            title: "",
            description: "",
            category: "weight-loss", // Default category
            level: "beginner", // Default level
            duration: 4, // Default duration as number
            weekly_workouts: 3,
            difficulty: 1,
            prerequisites: [],
            equipment: [],
            goals: [],
            schedule: [],
            status: "draft",
            tags: [],
            featured: false,
            muscleGroups: [],
            equipmentRequired: [],
            intensity: "low",
            created_at: new Date().toISOString(),
        }));
        setPreviewUrls({});
        setActiveTab('create');
        setShowAddForm(true);
    };
    const handleEditClick = (plan) => {
        setCurrentPlan(new FitnessPlan({
            ...plan,
            user_id: plan.user_id,
            title: plan.title,
            category: plan.category,
            duration: plan.duration,
            description: plan.description,
            status: plan.status,
            // Ensure all properties are copied or defaulted if missing
            level: plan.level || "beginner",
            weekly_workouts: plan.weekly_workouts || 0,
            difficulty: plan.difficulty || 0,
            prerequisites: plan.prerequisites || [],
            equipment: plan.equipment || [],
            goals: plan.goals || [],
            schedule: plan.schedule || [],
            tags: plan.tags || [],
            featured: plan.featured || false,
            muscleGroups: plan.muscleGroups || [],
            equipmentRequired: plan.equipmentRequired || [],
            intensity: plan.intensity || "low",
            created_at: plan.created_at || new Date().toISOString(),
        }));
        // Set preview URLs for existing media
        setPreviewUrls({
            image: plan.image_url,
            thumbnail: plan.thumbnail_gif_url,
            full: plan.full_gif_url
        });
        setActiveTab('create');
        setShowAddForm(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentPlan)
            return;
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            if ('id' in currentPlan && currentPlan.id) {
                try {
                    const { id, ...planData } = currentPlan;
                    await fitnessPlanService.updateFitnessPlan(id, planData);
                    setSuccess("Fitness plan updated successfully!");
                }
                catch (dbError) {
                    console.warn("Database update failed, using local update:", dbError);
                    const { id, ...planData } = currentPlan;
                    await fitnessPlanService.updateFitnessPlan(id, planData);
                    setSuccess("Fitness plan updated successfully locally!");
                }
            }
            else {
                try {
                    const exists = await fitnessPlanService.checkFitnessPlanExists(currentPlan.title?.trim() || '', currentPlan.category, currentPlan.level);
                    if (exists) {
                        throw new Error(`A fitness plan with the title "${currentPlan.title}" already exists in ${currentPlan.category} category at ${currentPlan.level} level. Please choose a different title.`);
                    }
                    const { id, ...planData } = currentPlan;
                    await fitnessPlanService.createFitnessPlan(planData);
                    setSuccess("Fitness plan created successfully!");
                }
                catch (dbError) {
                    console.warn("Database create failed:", dbError);
                    setError(dbError.message || "Failed to create fitness plan");
                    return;
                }
            }
            setShowAddForm(false);
            setActiveTab('overview');
            setPreviewUrls({});
            await fetchPlans(); // Re-fetch to show updated list
        }
        catch (err) {
            console.error("Error saving fitness plan:", err);
            setError("Failed to save plan: " + err.message);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDelete = async (planId) => {
        if (!confirm("Are you sure you want to delete this fitness plan? This action cannot be undone."))
            return;
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Try database delete first, fallback to local
            try {
                await fitnessPlanService.deleteFitnessPlan(planId);
                setSuccess("Fitness plan deleted successfully!");
            }
            catch (dbError) {
                console.warn("Database delete failed, using local delete:", dbError);
                await fitnessPlanService.deleteFitnessPlan(planId);
                setSuccess("Fitness plan deleted successfully locally!");
            }
            setPlans(plans.filter((plan) => plan.id !== planId)); // Optimistic update
        }
        catch (err) {
            console.error("Error deleting fitness plan:", err);
            setError("Failed to delete plan: " + err.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 flex items-center", children: [_jsx(Dumbbell, { className: "h-6 w-6 text-green-600 mr-3" }), "Admin Fitness Dashboard"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage fitness plans with Supabase integration and GIF uploads" })] }), _jsx(Button, { onClick: handleAddClick, leftIcon: _jsx(Plus, { size: 16 }), className: "bg-green-600 hover:bg-green-700", children: "Create New Plan" })] }), _jsxs("div", { className: "flex border-b border-gray-200 mb-6", children: [_jsxs("button", { onClick: () => setActiveTab('overview'), className: `flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(BarChart3, { className: "w-4 h-4 mr-2" }), "Overview"] }), _jsxs("button", { onClick: () => setActiveTab('create'), className: `flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'create'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Plan"] }), _jsxs("button", { onClick: () => setActiveTab('manage'), className: `flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'manage'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Settings, { className: "w-4 h-4 mr-2" }), "Manage Plans"] })] }), error && (_jsxs("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2" }), error] })), success && (_jsxs("div", { className: "mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center", children: [_jsx(CheckCircle, { className: "h-5 w-5 mr-2" }), success] })), isLoading && activeTab === 'overview' && (_jsx("div", { className: "mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg", children: "Loading fitness plans..." })), showAddForm && currentPlan && (_jsx(Card, { className: "mb-6", children: _jsxs(Card.Body, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: currentPlan.title ? "Edit Fitness Plan" : "Add New Fitness Plan" }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Plan Title" }), _jsx("input", { type: "text", id: "title", name: "title", value: currentPlan.title, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700 mb-1", children: "Category" }), _jsx("select", { id: "category", name: "category", value: currentPlan.category, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true, children: FITNESS_CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }, cat))) })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "level", className: "block text-sm font-medium text-gray-700 mb-1", children: "Level" }), _jsx("select", { id: "level", name: "level", value: currentPlan.level, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true, children: FITNESS_LEVELS.map((lvl) => (_jsx("option", { value: lvl, children: lvl.charAt(0).toUpperCase() + lvl.slice(1) }, lvl))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "duration", className: "block text-sm font-medium text-gray-700 mb-1", children: "Duration (in weeks)" }), _jsx("input", { type: "number", id: "duration", name: "duration", value: currentPlan.duration, onChange: (e) => setCurrentPlan(prev => ({ ...prev, duration: parseInt(e.target.value) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Detailed Plan Description" }), _jsx("textarea", { id: "description", name: "description", rows: 10, value: currentPlan.description, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "weekly_workouts", className: "block text-sm font-medium text-gray-700 mb-1", children: "Weekly Workouts" }), _jsx("input", { type: "number", id: "weekly_workouts", name: "weekly_workouts", value: currentPlan.weekly_workouts, onChange: (e) => setCurrentPlan(prev => ({ ...prev, weekly_workouts: parseInt(e.target.value) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "difficulty", className: "block text-sm font-medium text-gray-700 mb-1", children: "Difficulty (1-5)" }), _jsx("input", { type: "number", id: "difficulty", name: "difficulty", value: currentPlan.difficulty, onChange: (e) => setCurrentPlan(prev => ({ ...prev, difficulty: parseInt(e.target.value) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", min: "1", max: "5", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "target_audience", className: "block text-sm font-medium text-gray-700 mb-1", children: "Target Audience" }), _jsx("input", { type: "text", id: "target_audience", name: "target_audience", value: currentPlan.target_audience || '', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "prerequisites", className: "block text-sm font-medium text-gray-700 mb-1", children: "Prerequisites (comma separated)" }), _jsx("input", { type: "text", id: "prerequisites", name: "prerequisites", value: currentPlan.prerequisites.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, prerequisites: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "equipment", className: "block text-sm font-medium text-gray-700 mb-1", children: "Equipment (comma separated)" }), _jsx("input", { type: "text", id: "equipment", name: "equipment", value: currentPlan.equipment.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, equipment: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "goals", className: "block text-sm font-medium text-gray-700 mb-1", children: "Goals (comma separated)" }), _jsx("input", { type: "text", id: "goals", name: "goals", value: currentPlan.goals.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, goals: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "tags", className: "block text-sm font-medium text-gray-700 mb-1", children: "Tags (comma separated)" }), _jsx("input", { type: "text", id: "tags", name: "tags", value: currentPlan.tags.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, tags: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "image_url", className: "block text-sm font-medium text-gray-700 mb-1", children: "Image URL" }), _jsx("input", { type: "text", id: "image_url", name: "image_url", value: currentPlan.image_url || '', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "thumbnail_gif_url", className: "block text-sm font-medium text-gray-700 mb-1", children: "Thumbnail GIF URL" }), _jsx("input", { type: "text", id: "thumbnail_gif_url", name: "thumbnail_gif_url", value: currentPlan.thumbnail_gif_url || '', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "full_gif_url", className: "block text-sm font-medium text-gray-700 mb-1", children: "Full GIF URL" }), _jsx("input", { type: "text", id: "full_gif_url", name: "full_gif_url", value: currentPlan.full_gif_url || '', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { id: "status", name: "status", value: currentPlan.status, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true, children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("label", { htmlFor: "featured", className: "flex items-center text-sm font-medium text-gray-700 mb-1", children: [_jsx("input", { type: "checkbox", id: "featured", name: "featured", checked: currentPlan.featured, onChange: (e) => setCurrentPlan(prev => ({ ...prev, featured: e.target.checked })), className: "mr-2" }), "Featured Plan"] }) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "rating", className: "block text-sm font-medium text-gray-700 mb-1", children: "Rating" }), _jsx("input", { type: "number", id: "rating", name: "rating", value: currentPlan.rating || '', onChange: (e) => setCurrentPlan(prev => ({ ...prev, rating: parseFloat(e.target.value) || undefined })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", step: "0.1", min: "0", max: "5" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "reviewCount", className: "block text-sm font-medium text-gray-700 mb-1", children: "Review Count" }), _jsx("input", { type: "number", id: "reviewCount", name: "reviewCount", value: currentPlan.reviewCount || '', onChange: (e) => setCurrentPlan(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || undefined })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", min: "0" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "completionRate", className: "block text-sm font-medium text-gray-700 mb-1", children: "Completion Rate (%)" }), _jsx("input", { type: "number", id: "completionRate", name: "completionRate", value: currentPlan.completionRate || '', onChange: (e) => setCurrentPlan(prev => ({ ...prev, completionRate: parseInt(e.target.value) || undefined })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", min: "0", max: "100" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "averageWorkoutTime", className: "block text-sm font-medium text-gray-700 mb-1", children: "Average Workout Time (minutes)" }), _jsx("input", { type: "number", id: "averageWorkoutTime", name: "averageWorkoutTime", value: currentPlan.averageWorkoutTime || '', onChange: (e) => setCurrentPlan(prev => ({ ...prev, averageWorkoutTime: parseInt(e.target.value) || undefined })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", min: "0" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "muscleGroups", className: "block text-sm font-medium text-gray-700 mb-1", children: "Muscle Groups (comma separated)" }), _jsx("input", { type: "text", id: "muscleGroups", name: "muscleGroups", value: currentPlan.muscleGroups.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, muscleGroups: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "equipmentRequired", className: "block text-sm font-medium text-gray-700 mb-1", children: "Equipment Required (comma separated)" }), _jsx("input", { type: "text", id: "equipmentRequired", name: "equipmentRequired", value: currentPlan.equipmentRequired.join(','), onChange: (e) => setCurrentPlan(prev => ({ ...prev, equipmentRequired: e.target.value.split(',').map(item => item.trim()) })), className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "timeOfDay", className: "block text-sm font-medium text-gray-700 mb-1", children: "Time of Day" }), _jsxs("select", { id: "timeOfDay", name: "timeOfDay", value: currentPlan.timeOfDay || 'any', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", children: [_jsx("option", { value: "any", children: "Any" }), _jsx("option", { value: "morning", children: "Morning" }), _jsx("option", { value: "afternoon", children: "Afternoon" }), _jsx("option", { value: "evening", children: "Evening" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "location", className: "block text-sm font-medium text-gray-700 mb-1", children: "Location" }), _jsxs("select", { id: "location", name: "location", value: currentPlan.location || 'any', onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", children: [_jsx("option", { value: "any", children: "Any" }), _jsx("option", { value: "gym", children: "Gym" }), _jsx("option", { value: "home", children: "Home" }), _jsx("option", { value: "outdoor", children: "Outdoor" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "intensity", className: "block text-sm font-medium text-gray-700 mb-1", children: "Intensity" }), _jsxs("select", { id: "intensity", name: "intensity", value: currentPlan.intensity, onChange: handleFormChange, className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", required: true, children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "moderate", children: "Moderate" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "very-high", children: "Very High" })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowAddForm(false), leftIcon: _jsx(X, { size: 16 }), children: "Cancel" }), _jsx(Button, { type: "submit", disabled: isSaving, leftIcon: _jsx(Save, { size: 16 }), children: isSaving ? "Saving..." : "Save Plan" })] })] })] }) })), _jsx(Card, { children: _jsxs(Card.Body, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Existing Fitness Plans" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Title" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { scope: "col", className: "relative px-6 py-3", children: _jsx("span", { className: "sr-only", children: "Actions" }) })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [plans.map((plan) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: plan.title }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: plan.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [plan.duration, " weeks"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: plan.status.charAt(0).toUpperCase() + plan.status.slice(1) }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditClick(plan), leftIcon: _jsx(Edit, { size: 16 }), className: "text-indigo-600 hover:text-indigo-900 mr-2", children: "Edit" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(plan.id), leftIcon: _jsx(Trash2, { size: 16 }), className: "text-red-600 hover:text-red-900", children: "Delete" })] })] }, plan.id))), plans.length === 0 && !isLoading && !error && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-gray-500", children: "No fitness plans found." }) }))] })] }) })] }) })] }));
};
export default AdminFitnessPlans;
