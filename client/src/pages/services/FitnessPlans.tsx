"use client"

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FitnessPlan, FitnessCategory, FitnessLevel } from "../../types/content";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { Loader2, AlertCircle } from "lucide-react";

// Only allow these categories
const allowedCategories: FitnessCategory[] = [
  "weight-loss",
  "weight-gain",
  "maintenance",
  "strength",
  "flexibility",
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

const FitnessPlans: React.FC = () => {
  const [fitnessPlans, setFitnessPlans] = useState<FitnessPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FitnessCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | 'all'>('all');

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPlans = await FitnessPlanService.getFitnessPlans('published');
        setFitnessPlans(fetchedPlans);
      } catch (err) {
        console.error("Failed to fetch fitness plans:", err);
        setError("Failed to load fitness plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Filter plans by allowed categories and selected filters
  const filteredPlans = fitnessPlans.filter(plan =>
    allowedCategories.includes(plan.category) &&
    (selectedCategory === 'all' || plan.category === selectedCategory) &&
    (selectedLevel === 'all' || plan.level === selectedLevel)
  );

  // Group plans by category, then by level
  const plansByCategory: Record<string, Record<string, FitnessPlan[]>> = {};
  filteredPlans.forEach(plan => {
    if (!plansByCategory[plan.category]) plansByCategory[plan.category] = {};
    if (!plansByCategory[plan.category][plan.level]) plansByCategory[plan.category][plan.level] = [];
    plansByCategory[plan.category][plan.level].push(plan);
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Fitness Plans</h1>
        <p className="text-gray-600 mb-8">Choose a plan that matches your fitness level and goals.</p>

        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <p className="ml-3 text-gray-700">Loading fitness plans...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No fitness plans found.</p>
            <p className="text-gray-400">Try adjusting your filters or check back later!</p>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  All Categories
                </button>
                {allowedCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedCategory === category ? categoryConfig[category].color : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {categoryConfig[category].icon} {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Level</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedLevel === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  All Levels
                </button>
                {Object.entries(levelConfig).map(([level, config]) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level as FitnessLevel)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedLevel === level ? config.color : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Display plans grouped by category and level */}
            {allowedCategories.map(category => (
              <div key={category} className="mb-16">
                <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold mb-8 ${categoryConfig[category].color}`}>
                  {categoryConfig[category].icon} {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                {plansByCategory[category] && Object.entries(levelConfig)
                  .filter(([level]) => plansByCategory[category][level] && plansByCategory[category][level].length > 0)
                  .sort(([, aConfig], [, bConfig]) => aConfig.order - bConfig.order) // Sort by level order
                  .map(([level, config]) => (
                    <div key={level} className="mb-10">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${config.color}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)} Level
                      </div>
                      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-lg border ${config.borderColor}`}>
                        {plansByCategory[category][level].map((plan) => (
                          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <Link to={`/services/fitness/${plan.id}`} className="block">
                              <div className="relative mb-4">
                                <img 
                                  src={plan.image_url || "https://via.placeholder.com/400x200?text=No+Image"} 
                                  alt={plan.title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                              <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                                {plan.title}
                              </h2>
                              <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>Duration</span>
                                  <span>{plan.duration} weeks</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>Workouts/Week</span>
                                  <span>{plan.weekly_workouts} sessions</span>
                                </div>
                                {plan.estimated_calories_burn && (
                                  <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Est. Calories Burn</span>
                                    <span>{plan.estimated_calories_burn} kcal/week</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {plan.goals.map((goal, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {goal}
                                  </span>
                                ))}
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FitnessPlans;
