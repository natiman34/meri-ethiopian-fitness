"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { nutritionPlanService } from '../../services/NutritionPlanService';
import { Loader2, AlertCircle, Utensils, Clock, Scale, Heart, CalendarDays } from 'lucide-react';
const NutritionPlanDetail = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (id) {
                    const fetchedPlan = await nutritionPlanService.getNutritionPlanById(id);
                    if (fetchedPlan) {
                        setPlan(fetchedPlan);
                        setSelectedDay(fetchedPlan.meals[0]?.day || 1); // Set default selected day
                    }
                    else {
                        setError("Nutrition plan not found.");
                    }
                }
                else {
                    setError("No nutrition plan ID provided.");
                }
            }
            catch (err) {
                console.error("Failed to fetch nutrition plan:", err);
                setError("Failed to load nutrition plan. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, [id]);
    if (isLoading) {
        return (_jsxs("div", { className: "pt-24 pb-16 flex items-center justify-center min-h-[50vh]", children: [_jsx(Loader2, { className: "animate-spin h-10 w-10 text-green-600 mr-3" }), _jsx("p", { className: "text-lg text-gray-600", children: "Loading nutrition plan details..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]", children: [_jsx(AlertCircle, { className: "h-12 w-12 text-red-500 mb-4" }), _jsxs("p", { className: "text-xl text-red-600 font-semibold", children: ["Error: ", error] }), _jsx(Link, { to: "/services/nutrition", className: "mt-6 text-green-600 hover:underline", children: "Return to Plans" })] }));
    }
    if (!plan) {
        return (_jsxs("div", { className: "pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]", children: [_jsx(AlertCircle, { className: "h-12 w-12 text-yellow-500 mb-4" }), _jsx("p", { className: "text-xl text-yellow-600 font-semibold", children: "Nutrition Plan Not Found" }), _jsx(Link, { to: "/services/nutrition", className: "mt-6 text-green-600 hover:underline", children: "Return to Plans" })] }));
    }
    const currentDayMeals = plan.meals.find(meal => meal.day === selectedDay);
    return (_jsx("div", { className: "pt-24 pb-16 bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [_jsx("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: _jsxs("div", { className: "text-center md:text-left", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: plan.title }), _jsx("p", { className: "text-lg text-gray-600 mb-4", children: plan.description }), _jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-500 gap-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [plan.duration, " days"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Scale, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [plan.calorieRange.min, "-", plan.calorieRange.max, " kcal/day"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Utensils, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: plan.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) })] })] })] }) }), plan.features && plan.features.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Key Features" }), _jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: plan.features.map((feature, index) => (_jsxs("li", { className: "flex items-center text-gray-700", children: [_jsx(Heart, { className: "h-4 w-4 mr-2 text-green-500 flex-shrink-0" }), feature] }, index))) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Daily Meal Breakdown" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: plan.meals.map((mealDay) => (_jsxs("button", { onClick: () => setSelectedDay(mealDay.day), className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedDay === mealDay.day
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: ["Day ", mealDay.day] }, mealDay.day))) }), currentDayMeals ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-800 flex items-center mb-4", children: [_jsx(CalendarDays, { className: "h-5 w-5 mr-2 text-green-600" }), currentDayMeals.name || `Meals for Day ${currentDayMeals.day}`] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-md", children: [_jsxs("p", { className: "font-semibold text-gray-800 mb-3 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83C\uDF05" }), " Breakfast"] }), _jsx("div", { className: "space-y-2", children: Array.isArray(currentDayMeals.breakfast) ? (currentDayMeals.breakfast.map((meal, index) => (_jsxs("div", { className: "bg-white p-3 rounded border-l-4 border-orange-400", children: [_jsx("p", { className: "font-medium text-gray-800", children: meal.name }), meal.nutritionInfo.calories > 0 && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [meal.nutritionInfo.calories, " cal |", meal.nutritionInfo.protein, "g protein |", meal.nutritionInfo.fat, "g fat |", meal.nutritionInfo.carbs, "g carbs"] })), meal.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: meal.description }))] }, index)))) : (_jsx("p", { className: "text-gray-700", children: currentDayMeals.breakfast })) })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-md", children: [_jsxs("p", { className: "font-semibold text-gray-800 mb-3 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\u2600\uFE0F" }), " Lunch"] }), _jsx("div", { className: "space-y-2", children: Array.isArray(currentDayMeals.lunch) ? (currentDayMeals.lunch.map((meal, index) => (_jsxs("div", { className: "bg-white p-3 rounded border-l-4 border-green-400", children: [_jsx("p", { className: "font-medium text-gray-800", children: meal.name }), meal.nutritionInfo.calories > 0 && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [meal.nutritionInfo.calories, " cal |", meal.nutritionInfo.protein, "g protein |", meal.nutritionInfo.fat, "g fat |", meal.nutritionInfo.carbs, "g carbs"] })), meal.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: meal.description }))] }, index)))) : (_jsx("p", { className: "text-gray-700", children: currentDayMeals.lunch })) })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-md", children: [_jsxs("p", { className: "font-semibold text-gray-800 mb-3 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83C\uDF19" }), " Dinner"] }), _jsx("div", { className: "space-y-2", children: Array.isArray(currentDayMeals.dinner) ? (currentDayMeals.dinner.map((meal, index) => (_jsxs("div", { className: "bg-white p-3 rounded border-l-4 border-blue-400", children: [_jsx("p", { className: "font-medium text-gray-800", children: meal.name }), meal.nutritionInfo.calories > 0 && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [meal.nutritionInfo.calories, " cal |", meal.nutritionInfo.protein, "g protein |", meal.nutritionInfo.fat, "g fat |", meal.nutritionInfo.carbs, "g carbs"] })), meal.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: meal.description }))] }, index)))) : (_jsx("p", { className: "text-gray-700", children: currentDayMeals.dinner })) })] }), currentDayMeals.snacks && currentDayMeals.snacks.length > 0 && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-md", children: [_jsxs("p", { className: "font-semibold text-gray-800 mb-3 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83C\uDF4E" }), " Snacks"] }), _jsx("div", { className: "space-y-2", children: Array.isArray(currentDayMeals.snacks) ? (currentDayMeals.snacks.map((meal, index) => (_jsxs("div", { className: "bg-white p-3 rounded border-l-4 border-purple-400", children: [_jsx("p", { className: "font-medium text-gray-800", children: meal.name }), meal.nutritionInfo.calories > 0 && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [meal.nutritionInfo.calories, " cal |", meal.nutritionInfo.protein, "g protein |", meal.nutritionInfo.fat, "g fat |", meal.nutritionInfo.carbs, "g carbs"] })), meal.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: meal.description }))] }, index)))) : (_jsx("p", { className: "text-gray-700", children: currentDayMeals.snacks.join(', ') })) })] })), _jsx("div", { className: "bg-green-50 p-4 rounded-md border-2 border-green-200", children: _jsxs("p", { className: "font-bold text-green-800 text-lg flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCCA" }), " Daily Total: ", currentDayMeals.totalCalories, " calories"] }) })] })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No meal details available for the selected day." }))] }), _jsx("div", { className: "text-center mt-12", children: _jsxs(Link, { to: "/services/fitness-and-nutrition-plans", className: "text-lg text-green-600 hover:underline flex items-center justify-center", children: [_jsx("span", { className: "mr-2", children: "\u2190" }), " Back to Fitness and Nutrition Plans"] }) })] }) }));
};
export default NutritionPlanDetail;
