"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FitnessPlan, FitnessCategory, FitnessLevel } from "../../types/content";
import { getAllFitnessPlans, getFeaturedFitnessPlans } from "../../data/fitnessPlans";
import { NutritionPlanService } from "../../services/NutritionPlanService";
import { getAllNutritionPlans as getLocalAllNutritionPlans, getFeaturedNutritionPlans as getLocalFeaturedNutritionPlans } from "../../data/nutritionPlans";
import { Loader2, AlertCircle, Dumbbell, Utensils, Star, Clock, Target, TrendingUp } from "lucide-react";
import WorkoutPlanCard from "../../components/WorkoutPlanCard";
import NutritionPlanCard from "../../components/NutritionPlanCard";
import { imageAssets } from "../../data/imageAssets";

const allowedCategories: FitnessCategory[] = [
  "weight-loss",
  "weight-gain",
  "maintenance",
  "strength",
  "flexibility",
  "endurance",
  "muscle-building",
  "functional"
];

const nutritionCategories: NutritionCategory[] = [
  "weight-loss",
  "weight-gain",
  "maintenance",
  "muscle-building",
  "endurance"
];

const categoryConfig: Record<FitnessCategory, {
  color: string;
  icon: string;
  description: string;
}> = {
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

const nutritionCategoryConfig: Record<NutritionCategory, {
  color: string;
  icon: string;
  description: string;
}> = {
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

const FitnessAndNutritionPlans: React.FC = () => {
  const [fitnessPlans, setFitnessPlans] = useState<FitnessPlan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFitnessCategory, setSelectedFitnessCategory] = useState<FitnessCategory | 'all'>('all');
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState<FitnessLevel | 'all'>('all');
  const [selectedNutritionCategory, setSelectedNutritionCategory] = useState<NutritionCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'fitness' | 'nutrition'>('fitness');

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the new fitness plans data
        const allFitnessPlans = getAllFitnessPlans();
        setFitnessPlans(allFitnessPlans);
        console.log('All fetched fitness plans:', allFitnessPlans);
        
        // Fetch nutrition plans using the updated service
        const fetchedNutritionPlans = await NutritionPlanService.getInstance().getAllNutritionPlans();
        setNutritionPlans(fetchedNutritionPlans);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError("Failed to load plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredFitnessPlans = fitnessPlans.filter(plan =>
    // allowedCategories.includes(plan.category) && // Temporarily commented out
    (selectedFitnessCategory === 'all' || plan.category === selectedFitnessCategory) &&
    (selectedFitnessLevel === 'all' || plan.level === selectedFitnessLevel)
  );

  console.log('Filtered Fitness Plans:', filteredFitnessPlans);

  const filteredNutritionPlans = nutritionPlans.filter(plan =>
    nutritionCategories.includes(plan.category) &&
    (selectedNutritionCategory === 'all' || plan.category === selectedNutritionCategory)
  );

  const featuredFitnessPlans = getFeaturedFitnessPlans();
  const featuredNutritionPlans = getLocalFeaturedNutritionPlans();

  // New category data with images (expanded beyond the original allowedCategories)
  const fitnessCategoriesData = [
    {
      name: "Weight Gain Workout Plan",
      key: "weight-gain" as FitnessCategory,
      image: imageAssets.fitnessPlansCategories["weight-gain-workout"],
      bgColor: "bg-purple-100",
      textColor: "text-purple-800"
    },
    {
      name: "Weight Loss Workout Plan",
      key: "weight-loss" as FitnessCategory,
      image: imageAssets.fitnessPlansCategories["weight-loss-workout"],
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fitness and Nutrition Plans</h1>
          <p className="text-lg text-gray-600 mb-8">
            Comprehensive plans combining workout routines and meal plans to help you achieve your health and fitness goals.
          </p>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('fitness')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'fitness'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Fitness Plans
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'nutrition'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Utensils className="w-4 h-4 mr-2" />
              Nutrition Plans
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-green-600 mr-3" />
              <p className="text-lg text-gray-600">Loading plans...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {activeTab === 'fitness' && (
                <div>
                  {/* Popular Categories Section */}
                  {/* Removed as per user request */}

                  {/* Display All Fitness Plans */}
                  {filteredFitnessPlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredFitnessPlans.map((plan) => (
                        <WorkoutPlanCard key={plan.id} plan={plan} showStats={false} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-xl text-gray-500">No fitness plans found for selected filters.</p>
                      <p className="text-gray-400">Try adjusting your filters!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  {/* Featured Nutrition Plans Section */}
                  {featuredNutritionPlans.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Star className="h-6 w-6 text-yellow-500 mr-2" />
                        Featured Nutrition Plans
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredNutritionPlans.map((plan) => (
                          <NutritionPlanCard
                            key={plan.id}
                            plan={plan}
                            variant="featured"
                            showStats={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filter Controls for Nutrition Plans */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setSelectedNutritionCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          selectedNutritionCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        All Categories
                      </button>
                      {nutritionCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedNutritionCategory(category)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            selectedNutritionCategory === category ? nutritionCategoryConfig[category].color : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {nutritionCategoryConfig[category].icon} {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display All Nutrition Plans */}
                  {filteredNutritionPlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNutritionPlans.map((plan) => (
                        <NutritionPlanCard key={plan.id} plan={plan} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-xl text-gray-500">No nutrition plans found for selected filters.</p>
                      <p className="text-gray-400">Try adjusting your filters!</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessAndNutritionPlans; 