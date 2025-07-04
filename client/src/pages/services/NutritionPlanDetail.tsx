"use client"

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { nutritionPlanService } from '../../services/NutritionPlanService';
import { NutritionPlan, DayMeal, CalorieRange } from '../../types/content';
import { Loader2, AlertCircle, Utensils, Clock, Scale, Heart, CalendarDays } from 'lucide-react';


const NutritionPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

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
          } else {
            setError("Nutrition plan not found.");
          }
        } else {
          setError("No nutrition plan ID provided.");
        }
      } catch (err) {
        console.error("Failed to fetch nutrition plan:", err);
        setError("Failed to load nutrition plan. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-10 w-10 text-green-600 mr-3" />
        <p className="text-lg text-gray-600">Loading nutrition plan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-600 font-semibold">Error: {error}</p>
        <Link to="/services/nutrition" className="mt-6 text-green-600 hover:underline">
          Return to Plans
        </Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-xl text-yellow-600 font-semibold">Nutrition Plan Not Found</p>
        <Link to="/services/nutrition" className="mt-6 text-green-600 hover:underline">
          Return to Plans
        </Link>
      </div>
    );
  }

  const currentDayMeals = plan.meals.find(meal => meal.day === selectedDay);

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{plan.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{plan.description}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{plan.duration} days</span>
              </div>
              <div className="flex items-center">
                <Scale className="h-4 w-4 mr-1" />
                <span>{plan.calorieRange.min}-{plan.calorieRange.max} kcal/day</span>
              </div>
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-1" />
                <span>{plan.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Heart className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Daily Meal Plan Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Meal Breakdown</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {plan.meals.map((mealDay) => (
              <button
                key={mealDay.day}
                onClick={() => setSelectedDay(mealDay.day)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDay === mealDay.day
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day {mealDay.day}
              </button>
            ))}
          </div>

          {currentDayMeals ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <CalendarDays className="h-5 w-5 mr-2 text-green-600" />
                {currentDayMeals.name || `Meals for Day ${currentDayMeals.day}`}
              </h3>

              {/* Breakfast */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🌅</span> Breakfast
                </p>
                <div className="space-y-2">
                  {Array.isArray(currentDayMeals.breakfast) ? (
                    currentDayMeals.breakfast.map((meal, index) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-orange-400">
                        <p className="font-medium text-gray-800">{meal.name}</p>
                        {meal.nutritionInfo.calories > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {meal.nutritionInfo.calories} cal |
                            {meal.nutritionInfo.protein}g protein |
                            {meal.nutritionInfo.fat}g fat |
                            {meal.nutritionInfo.carbs}g carbs
                          </p>
                        )}
                        {meal.description && (
                          <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">{currentDayMeals.breakfast}</p>
                  )}
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">☀️</span> Lunch
                </p>
                <div className="space-y-2">
                  {Array.isArray(currentDayMeals.lunch) ? (
                    currentDayMeals.lunch.map((meal, index) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-green-400">
                        <p className="font-medium text-gray-800">{meal.name}</p>
                        {meal.nutritionInfo.calories > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {meal.nutritionInfo.calories} cal |
                            {meal.nutritionInfo.protein}g protein |
                            {meal.nutritionInfo.fat}g fat |
                            {meal.nutritionInfo.carbs}g carbs
                          </p>
                        )}
                        {meal.description && (
                          <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">{currentDayMeals.lunch}</p>
                  )}
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🌙</span> Dinner
                </p>
                <div className="space-y-2">
                  {Array.isArray(currentDayMeals.dinner) ? (
                    currentDayMeals.dinner.map((meal, index) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <p className="font-medium text-gray-800">{meal.name}</p>
                        {meal.nutritionInfo.calories > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {meal.nutritionInfo.calories} cal |
                            {meal.nutritionInfo.protein}g protein |
                            {meal.nutritionInfo.fat}g fat |
                            {meal.nutritionInfo.carbs}g carbs
                          </p>
                        )}
                        {meal.description && (
                          <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">{currentDayMeals.dinner}</p>
                  )}
                </div>
              </div>

              {/* Snacks */}
              {currentDayMeals.snacks && currentDayMeals.snacks.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🍎</span> Snacks
                  </p>
                  <div className="space-y-2">
                    {Array.isArray(currentDayMeals.snacks) ? (
                      currentDayMeals.snacks.map((meal, index) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-purple-400">
                          <p className="font-medium text-gray-800">{meal.name}</p>
                          {meal.nutritionInfo.calories > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              {meal.nutritionInfo.calories} cal |
                              {meal.nutritionInfo.protein}g protein |
                              {meal.nutritionInfo.fat}g fat |
                              {meal.nutritionInfo.carbs}g carbs
                            </p>
                          )}
                          {meal.description && (
                            <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">{currentDayMeals.snacks.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Daily Total */}
              <div className="bg-green-50 p-4 rounded-md border-2 border-green-200">
                <p className="font-bold text-green-800 text-lg flex items-center">
                  <span className="mr-2">📊</span> Daily Total: {currentDayMeals.totalCalories} calories
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No meal details available for the selected day.
            </div>
          )}
        </div>

        {/* Back to Plans Link */}
        <div className="text-center mt-12">
          <Link to="/services/fitness-and-nutrition-plans" className="text-lg text-green-600 hover:underline flex items-center justify-center">
            <span className="mr-2">←</span> Back to Fitness and Nutrition Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanDetail;
