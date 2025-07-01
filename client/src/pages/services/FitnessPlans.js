"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { Loader2 } from "lucide-react";
// Only allow these categories
const allowedCategories = [
    "weight-loss",
    "weight-gain",
    "maintenance",
    "strength",
    "flexibility",
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
        icon: "/stretch",
        description: "Plans focused on improving flexibility and mobility"
    },
    'endurance': {
        color: "bg-orange-100 text-orange-800",
        icon: "🏃",
        description: "Plans focused on building cardiovascular endurance"
    }
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
const FitnessPlans = () => {
    const [fitnessPlans, setFitnessPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // const fetchedPlans = await FitnessPlanService.getFitnessPlans('published');
                const fetchedPlans = await FitnessPlanService.getFitnessPlans(); // Fetch all plans
                setFitnessPlans(fetchedPlans);
            }
            catch (err) {
                console.error("Failed to fetch fitness plans:", err);
                setError("Failed to load fitness plans. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);
    // Filter plans by allowed categories and selected filters
    const filteredPlans = fitnessPlans.filter(plan => 
    // allowedCategories.includes(plan.category) && // Temporarily commented out
    (selectedCategory === 'all' || plan.category === selectedCategory) &&
        (selectedLevel === 'all' || plan.level === selectedLevel));
    // Group plans by category, then by level
    const plansByCategory = {};
    filteredPlans.forEach(plan => {
        if (!plansByCategory[plan.category])
            plansByCategory[plan.category] = {};
        if (!plansByCategory[plan.category][plan.level])
            plansByCategory[plan.category][plan.level] = [];
        plansByCategory[plan.category][plan.level].push(plan);
    });
    return (_jsx("div", { className: "pt-24 pb-16", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Fitness Plans" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Choose a plan that matches your fitness level and goals." }), isLoading && (_jsxs("div", { className: "flex items-center justify-center h-48", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-green-500" }), _jsx("p", { className: "ml-3 text-gray-700", children: "Loading fitness plans..." })] })), error && (_jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error!" }), _jsxs("span", { className: "block sm:inline", children: [" ", error] })] })), !isLoading && !error && filteredPlans.length === 0 && (_jsxs("div", { className: "text-center py-10", children: [_jsx("p", { className: "text-xl text-gray-500", children: "No fitness plans found." }), _jsx("p", { className: "text-gray-400", children: "Try adjusting your filters or check back later!" })] })), !isLoading && !error && filteredPlans.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Filter by Category" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { onClick: () => setSelectedCategory('all'), className: `px-4 py-2 rounded-full text-sm font-semibold ${selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`, children: "All Categories" }), allowedCategories.map(category => (_jsxs("button", { onClick: () => setSelectedCategory(category), className: `px-4 py-2 rounded-full text-sm font-semibold ${selectedCategory === category ? categoryConfig[category].color : 'bg-gray-100 text-gray-800'}`, children: [categoryConfig[category].icon, " ", category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')] }, category)))] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Filter by Level" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("button", { onClick: () => setSelectedLevel('all'), className: `px-4 py-2 rounded-full text-sm font-semibold ${selectedLevel === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`, children: "All Levels" }), Object.entries(levelConfig).map(([level, config]) => (_jsx("button", { onClick: () => setSelectedLevel(level), className: `px-4 py-2 rounded-full text-sm font-semibold ${selectedLevel === level ? config.color : 'bg-gray-100 text-gray-800'}`, children: level.charAt(0).toUpperCase() + level.slice(1) }, level)))] })] }), allowedCategories.map(category => (_jsxs("div", { className: "mb-16", children: [_jsxs("div", { className: `inline-block px-4 py-2 rounded-full text-lg font-semibold mb-8 ${categoryConfig[category].color}`, children: [categoryConfig[category].icon, " ", category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')] }), plansByCategory[category] && Object.entries(levelConfig)
                                    .filter(([level]) => plansByCategory[category][level] && plansByCategory[category][level].length > 0)
                                    .sort(([, aConfig], [, bConfig]) => aConfig.order - bConfig.order) // Sort by level order
                                    .map(([level, config]) => (_jsxs("div", { className: "mb-10", children: [_jsxs("div", { className: `inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${config.color}`, children: [level.charAt(0).toUpperCase() + level.slice(1), " Level"] }), _jsx("div", { className: `grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-lg border ${config.borderColor}`, children: plansByCategory[category][level].map((plan) => (_jsx("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow", children: _jsxs(Link, { to: `/services/fitness/${plan.id}`, className: "block", children: [_jsx("div", { className: "relative mb-4", children: _jsx("img", { src: plan.image_url || "https://via.placeholder.com/400x200?text=No+Image", alt: plan.title, className: "w-full h-48 object-cover rounded-lg" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors", children: plan.title }), _jsx("p", { className: "text-gray-600 mb-4 line-clamp-3", children: plan.description }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [_jsx("span", { children: "Duration" }), _jsxs("span", { children: [plan.duration, " weeks"] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [_jsx("span", { children: "Workouts/Week" }), _jsxs("span", { children: [plan.weekly_workouts, " sessions"] })] }), plan.estimated_calories_burn && (_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [_jsx("span", { children: "Est. Calories Burn" }), _jsxs("span", { children: [plan.estimated_calories_burn, " kcal/week"] })] }))] }), _jsx("div", { className: "flex flex-wrap gap-2", children: plan.goals.map((goal, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full", children: goal }, index))) })] }) }, plan.id))) })] }, level)))] }, category)))] }))] }) }));
};
export default FitnessPlans;
