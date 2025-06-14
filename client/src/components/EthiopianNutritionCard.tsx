import React, { useState } from 'react';
import { NutritionPlan } from '../types/content';
import { getEthiopianDishImage } from '../data/imageAssets';
import ImageWithFallback from './ImageWithFallback';
import { Calendar, Clock, Target, TrendingUp, TrendingDown, Info, ChefHat, Globe } from 'lucide-react';

interface EthiopianNutritionCardProps {
  plan: NutritionPlan;
  variant?: 'default' | 'featured';
  showStats?: boolean;
}

const EthiopianNutritionCard: React.FC<EthiopianNutritionCardProps> = ({
  plan,
  variant = 'default',
  showStats = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const isWeightGain = plan.category === 'weight-gain';
  const categoryIcon = isWeightGain ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  const categoryColor = isWeightGain ? 'text-purple-600' : 'text-blue-600';
  const categoryBg = isWeightGain ? 'bg-purple-100' : 'bg-blue-100';

  // Extract Ethiopian dish names from meal descriptions
  const getEthiopianDishFromMeal = (mealDescription: string): string => {
    const dishNames = ['genfo', 'injera', 'kitfo', 'shinbra', 'fatira', 'abish', 'dallen', 'ambaza', 'gomen'];
    const foundDish = dishNames.find(dish => 
      mealDescription.toLowerCase().includes(dish.toLowerCase())
    );
    return foundDish || 'injera'; // Default to injera
  };

  const selectedDayMeals = plan.meals.find(meal => meal.day === selectedDay);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      variant === 'featured' ? 'ring-2 ring-yellow-400' : ''
    }`}>
      {/* Header with Ethiopian flag colors accent */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Ethiopian Traditional</span>
            </div>
            {variant === 'featured' && (
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{plan.description}</p>

          {/* Category and Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${categoryBg} ${categoryColor}`}>
              {categoryIcon}
              <span className="text-sm font-medium capitalize">
                {plan.category.replace('-', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {plan.calorieRange.min}-{plan.calorieRange.max} cal/day
            </div>
          </div>

          {/* Quick Stats */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Calendar className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                <div className="text-sm font-medium text-gray-900">{plan.duration}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="text-center">
                <ChefHat className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                <div className="text-sm font-medium text-gray-900">{plan.meals.length}</div>
                <div className="text-xs text-gray-500">Meal Plans</div>
              </div>
              <div className="text-center">
                <Target className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                <div className="text-sm font-medium text-gray-900">{plan.features.length}</div>
                <div className="text-xs text-gray-500">Benefits</div>
              </div>
            </div>
          )}

          {/* Interactive Day Selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sample Meal Plan</span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
              >
                <Info className="h-4 w-4" />
                <span>{showDetails ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>
            
            <div className="flex space-x-2 mb-3">
              {plan.meals.slice(0, 3).map((meal) => (
                <button
                  key={meal.day}
                  onClick={() => setSelectedDay(meal.day)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedDay === meal.day
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Day {meal.day}
                </button>
              ))}
            </div>

            {/* Meal Preview with Ethiopian Dish Images */}
            {selectedDayMeals && (
              <div className="space-y-3">
                {/* Breakfast */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={getEthiopianDishImage(getEthiopianDishFromMeal(selectedDayMeals.breakfast[0]?.name || ''))}
                      alt="Ethiopian breakfast"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Breakfast</div>
                    <div className="text-sm text-gray-900 truncate">
                      {selectedDayMeals.breakfast[0]?.name || 'Traditional Ethiopian breakfast'}
                    </div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={getEthiopianDishImage(getEthiopianDishFromMeal(selectedDayMeals.lunch[0]?.name || ''))}
                      alt="Ethiopian lunch"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lunch</div>
                    <div className="text-sm text-gray-900 truncate">
                      {selectedDayMeals.lunch[0]?.name || 'Traditional Ethiopian lunch'}
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={getEthiopianDishImage(getEthiopianDishFromMeal(selectedDayMeals.dinner[0]?.name || ''))}
                      alt="Ethiopian dinner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dinner</div>
                    <div className="text-sm text-gray-900 truncate">
                      {selectedDayMeals.dinner[0]?.name || 'Traditional Ethiopian dinner'}
                    </div>
                  </div>
                </div>

                {/* Total Calories */}
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Daily Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {selectedDayMeals.totalCalories} cal
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Features (Expandable) */}
          {showDetails && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EthiopianNutritionCard;
