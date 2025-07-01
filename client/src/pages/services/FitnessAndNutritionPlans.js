"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getAllFitnessPlans, getFeaturedFitnessPlans } from "../../data/fitnessPlans";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { nutritionPlanService } from "../../services/NutritionPlanService";
import { getFeaturedNutritionPlans as getLocalFeaturedNutritionPlans } from "../../data/nutritionPlans";
import { Loader2, AlertCircle, Dumbbell, Utensils, Star, Clock, Target, TrendingUp, Globe } from "lucide-react";
import WorkoutPlanCard from "../../components/WorkoutPlanCard";
import NutritionPlanCard from "../../components/NutritionPlanCard";
import { imageAssets } from "../../data/imageAssets";
const allowedCategories = [
    "weight-loss",
    "weight-gain",
    "maintenance",
    "strength",
    "flexibility",
    "endurance",
    "muscle-building",
    "functional"
];
const nutritionCategories = [
    "weight-loss",
    "weight-gain",
    "maintenance",
    "muscle-building",
    "endurance"
];
const categoryConfig = {
    'weight-loss': {
        color: "bg-blue-100 text-blue-800",
        icon: "🔥",
        description: "Plans focused on burning calories and fat loss"
    },
    'weight-gain': {
        color: "bg-purple-100 text-purple-800",
        icon: "💪",
        description: "Plans focused on muscle building and weight gain"
    },
    'maintenance': {
        color: "bg-green-100 text-green-800",
        icon: "⚖️",
        description: "Plans focused on maintaining current fitness level"
    },
    'strength': {
        color: "bg-red-100 text-red-800",
        icon: "🏋️",
        description: "Plans focused on building strength and muscle mass"
    },
    'flexibility': {
        color: "bg-yellow-100 text-yellow-800",
        icon: "🧘",
        description: "Plans focused on improving flexibility and mobility"
    },
    'endurance': {
        color: "bg-orange-100 text-orange-800",
        icon: "🏃",
        description: "Plans focused on building cardiovascular endurance"
    },
    'muscle-building': {
        color: "bg-indigo-100 text-indigo-800",
        icon: "💪",
        description: "Plans focused on building muscle mass and definition"
    },
    'functional': {
        color: "bg-teal-100 text-teal-800",
        icon: "⚡",
        description: "Plans focused on functional movements and athletic performance"
    }
};
const nutritionCategoryConfig = {
    'weight-loss': {
        color: "bg-blue-100 text-blue-800",
        icon: "📉",
        description: "Nutrition plans for weight reduction"
    },
    'weight-gain': {
        color: "bg-purple-100 text-purple-800",
        icon: "📈",
        description: "Nutrition plans for healthy weight increase"
    },
    'maintenance': {
        color: "bg-green-100 text-green-800",
        icon: "🥗",
        description: "Nutrition plans to maintain current weight and health"
    },
    'muscle-building': {
        color: "bg-indigo-100 text-indigo-800",
        icon: "🍗",
        description: "Nutrition plans to support muscle growth"
    },
    'endurance': {
        color: "bg-orange-100 text-orange-800",
        icon: "🔋",
        description: "Nutrition plans for enhanced athletic endurance"
    },
};
const levelConfig = {
    beginner: {
        color: "bg-green-100 text-green-800",
        borderColor: "border-green-200",
        order: 1,
    },
    intermediate: {
        color: "bg-yellow-100 text-yellow-800",
        borderColor: "border-yellow-200",
        order: 2,
    },
    advanced: {
        color: "bg-red-100 text-red-800",
        borderColor: "border-red-200",
        order: 3,
    },
};
const FitnessAndNutritionPlans = () => {
    const [fitnessPlans, setFitnessPlans] = useState([]);
    const [nutritionPlans, setNutritionPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFitnessCategory, setSelectedFitnessCategory] = useState('all');
    const [selectedFitnessLevel, setSelectedFitnessLevel] = useState('all');
    const [selectedNutritionCategory, setSelectedNutritionCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('fitness');
    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Use enhanced fitness plan service that combines local and database plans
                const fitnessPlanService = FitnessPlanService.getInstance();
                console.log('Fetching published fitness plans...');
                const allFitnessPlans = await fitnessPlanService.getFitnessPlans('published');
                console.log('Fetched fitness plans:', allFitnessPlans.length, 'plans');
                console.log('Fitness plans data:', allFitnessPlans);
                setFitnessPlans(allFitnessPlans);
                // Fetch nutrition plans from enhanced service (includes database + local data)
                const allNutritionPlans = await nutritionPlanService.getAllNutritionPlans();
                setNutritionPlans(allNutritionPlans);
            }
            catch (err) {
                console.error("Failed to fetch plans:", err);
                setError("Failed to load plans. Please try again later.");
                // Fallback to local data if service fails
                try {
                    const localFitnessPlans = getAllFitnessPlans().filter(plan => plan.status === 'published');
                    setFitnessPlans(localFitnessPlans);
                }
                catch (fallbackErr) {
                    console.error("Fallback also failed:", fallbackErr);
                }
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);
    const filteredFitnessPlans = fitnessPlans.filter(plan => 
    // allowedCategories.includes(plan.category) && // Temporarily commented out
    (selectedFitnessCategory === 'all' || plan.category === selectedFitnessCategory) &&
        (selectedFitnessLevel === 'all' || plan.level === selectedFitnessLevel));
    // Debug logging
    console.log('All fitness plans:', fitnessPlans.length, fitnessPlans);
    console.log('Filtered fitness plans:', filteredFitnessPlans.length, filteredFitnessPlans);
    console.log('Weight loss plans:', filteredFitnessPlans.filter(plan => plan.category === 'weight-loss'));
    console.log('Selected category:', selectedFitnessCategory, 'Selected level:', selectedFitnessLevel);
    const filteredNutritionPlans = nutritionPlans.filter(plan => nutritionCategories.includes(plan.category) &&
        (selectedNutritionCategory === 'all' || plan.category === selectedNutritionCategory));
    const featuredFitnessPlans = getFeaturedFitnessPlans();
    const featuredNutritionPlans = getLocalFeaturedNutritionPlans();
    // New category data with images (expanded beyond the original allowedCategories)
    const fitnessCategoriesData = [
        {
            name: "Weight Gain Workout Plan",
            key: "weight-gain",
            image: imageAssets.fitnessPlansCategories["weight-gain-workout"],
            bgColor: "bg-purple-100",
            textColor: "text-purple-800"
        },
        {
            name: "Weight Loss Workout Plan",
            key: "weight-loss",
            image: imageAssets.fitnessPlansCategories["weight-loss-workout"],
            bgColor: "bg-blue-100",
            textColor: "text-blue-800"
        },
    ];
    return (_jsx("div", { className: "pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900", children: "Fitness and Nutrition Plans" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm", children: "\uD83D\uDD04 Refresh Plans" })] }), _jsx("p", { className: "text-lg text-gray-600 mb-8", children: "Comprehensive plans combining workout routines and meal plans to help you achieve your health and fitness goals." }), _jsxs("div", { className: "flex border-b border-gray-200 mb-8", children: [_jsxs("button", { onClick: () => setActiveTab('fitness'), className: `flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fitness'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Dumbbell, { className: "w-4 h-4 mr-2" }), "Fitness Plans"] }), _jsxs("button", { onClick: () => setActiveTab('nutrition'), className: `flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'nutrition'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Utensils, { className: "w-4 h-4 mr-2" }), "Nutrition Plans"] })] }), isLoading && (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "animate-spin h-8 w-8 text-green-600 mr-3" }), _jsx("p", { className: "text-lg text-gray-600", children: "Loading plans..." })] })), error && (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(AlertCircle, { className: "h-8 w-8 text-red-500 mr-3" }), _jsx("p", { className: "text-lg text-red-600", children: error })] })), !isLoading && !error && (_jsxs(_Fragment, { children: [activeTab === 'fitness' && (_jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx(Dumbbell, { className: "h-6 w-6 text-green-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Comprehensive Fitness Plans" })] }), _jsx("p", { className: "text-gray-600 max-w-3xl", children: "Professional workout programs designed for specific fitness goals. Each plan includes detailed exercise instructions, progressive training schedules, and comprehensive guidance for optimal results." })] }), _jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-purple-600 font-bold", children: "\uD83D\uDCAA" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "Weight Gain & Muscle Building Plans" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredFitnessPlans
                                                    .filter(plan => plan.category === 'weight-gain')
                                                    .map((plan) => (_jsx(WorkoutPlanCard, { plan: plan, showStats: true }, plan.id))) })] }), _jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-blue-600 font-bold", children: "\uD83D\uDD25" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "Weight Loss & Fat Burning Plans" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredFitnessPlans
                                                    .filter(plan => plan.category === 'weight-loss')
                                                    .map((plan) => (_jsx(WorkoutPlanCard, { plan: plan, showStats: true }, plan.id))) })] }), filteredFitnessPlans.filter(plan => !['weight-gain', 'weight-loss'].includes(plan.category)).length > 0 && (_jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-green-600 font-bold", children: "\u26A1" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "Additional Fitness Plans" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredFitnessPlans
                                                    .filter(plan => !['weight-gain', 'weight-loss'].includes(plan.category))
                                                    .map((plan) => (_jsx(WorkoutPlanCard, { plan: plan, showStats: false }, plan.id))) })] })), filteredFitnessPlans.length === 0 && (_jsxs("div", { className: "text-center py-10", children: [_jsx(Dumbbell, { className: "h-12 w-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-xl text-gray-500", children: "No fitness plans found for selected filters." }), _jsx("p", { className: "text-gray-400", children: "Try adjusting your filters or check back later!" })] })), _jsxs("div", { className: "mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [_jsx(Dumbbell, { className: "h-5 w-5 text-green-600 mr-2" }), "About Our Fitness Plans"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-900 mb-2 flex items-center", children: [_jsx("span", { className: "text-purple-600 mr-2", children: "\uD83D\uDCAA" }), "Weight Gain & Muscle Building"] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Our weight gain plans focus on progressive overload and muscle hypertrophy:" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "6 days/week training:" }), " Optimal frequency for muscle growth"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "45-90 second rest:" }), " Perfect for hypertrophy and strength"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Compound movements:" }), " Deadlifts, squats, bench press"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Progressive overload:" }), " Systematic strength increases"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Cardio integration:" }), " Maintains conditioning while building mass"] })] })] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-900 mb-2 flex items-center", children: [_jsx("span", { className: "text-blue-600 mr-2", children: "\uD83D\uDD25" }), "Weight Loss & Fat Burning"] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Our weight loss plans maximize calorie burn while preserving muscle:" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "6 days/week training:" }), " High frequency for maximum calorie burn"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "30-60 second rest:" }), " Elevated heart rate for fat loss"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "HIIT integration:" }), " High-intensity intervals for efficiency"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Strength preservation:" }), " Maintains muscle during fat loss"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Cardio variety:" }), " Steady-state and interval training"] })] })] })] }), _jsxs("div", { className: "mt-6 p-4 bg-white rounded-lg border border-gray-200", children: [_jsxs("h4", { className: "font-medium text-gray-900 mb-2 flex items-center", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-500 mr-2" }), "Plan Features"] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-green-600 mr-2" }), "Detailed timing"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Target, { className: "h-4 w-4 text-blue-600 mr-2" }), "Specific targets"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-purple-600 mr-2" }), "Progressive difficulty"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Dumbbell, { className: "h-4 w-4 text-red-600 mr-2" }), "Equipment guidance"] })] })] })] })] })), activeTab === 'nutrition' && (_jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx(Globe, { className: "h-6 w-6 text-green-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Ethiopian Traditional Nutrition Plans" })] }), _jsx("p", { className: "text-gray-600 max-w-3xl", children: "Discover authentic Ethiopian nutrition plans featuring traditional foods and cultural dishes. These plans are designed with balanced macronutrients using ingredients like Teff, Injera, traditional spices, and time-honored cooking methods for optimal health and cultural authenticity." })] }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Filter by Category:" }), _jsxs("select", { value: selectedNutritionCategory, onChange: (e) => setSelectedNutritionCategory(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [_jsx("option", { value: "all", children: "All Categories" }), nutritionCategories.map((category) => (_jsxs("option", { value: category, children: [nutritionCategoryConfig[category]?.icon, " ", category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())] }, category)))] })] }) }), filteredNutritionPlans.length > 0 ? (_jsxs("div", { className: "mb-12", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-900 mb-6 flex items-center", children: [_jsx(Utensils, { className: "h-5 w-5 text-green-600 mr-2" }), "Ethiopian Nutrition Plans (", filteredNutritionPlans.length, ")"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredNutritionPlans.map((plan, index) => (_jsx(NutritionPlanCard, { plan: plan, variant: index === 0 ? "featured" : "default", showStats: true }, plan.id))) })] })) : (_jsxs("div", { className: "text-center py-10", children: [_jsx(Utensils, { className: "h-12 w-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-xl text-gray-500", children: "No nutrition plans found for selected category." }), _jsx("p", { className: "text-gray-400", children: "Try selecting a different category or check back later!" })] })), _jsxs("div", { className: "mt-12 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [_jsx(Globe, { className: "h-5 w-5 text-green-600 mr-2" }), "About Ethiopian Nutrition"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "For Healthy Weight Gain" }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Ethiopian weight gain plans focus on calorie surplus from balanced macronutrients:" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Carbohydrates (4 cal/gram):" }), " Barley flour, Teff, Injera"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Proteins (4 cal/gram):" }), " Lentils, Chickpeas, Beef, Fish, Dairy"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Fats (9 cal/gram):" }), " Butter, Niger Seed, Sesame"] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "For Healthy Weight Loss" }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Ethiopian weight loss plans create caloric deficit with nutrient-dense foods:" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Fruits & Vegetables:" }), " Rich in vitamins, minerals, antioxidants"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Lean Proteins:" }), " Fish, chicken breast, legumes"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Healthy Fats:" }), " Nuts, seeds, olive oil"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "Whole Grains:" }), " Brown rice, quinoa, oatmeal"] })] })] })] })] })] }))] }))] }) }) }));
};
export default FitnessAndNutritionPlans;
