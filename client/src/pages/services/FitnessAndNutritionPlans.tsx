"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FitnessPlan, FitnessCategory, FitnessLevel, NutritionPlan, NutritionCategory } from "../../types/content";
import { getAllFitnessPlans, getFeaturedFitnessPlans } from "../../data/fitnessPlans";
import { nutritionPlanService } from "../../services/NutritionPlanService";
import { getAllNutritionPlans as getLocalAllNutritionPlans, getFeaturedNutritionPlans as getLocalFeaturedNutritionPlans } from "../../data/nutritionPlans";
import { Loader2, AlertCircle, Dumbbell, Utensils, Star, Clock, Target, TrendingUp, Globe } from "lucide-react";
import WorkoutPlanCard from "../../components/WorkoutPlanCard";
import EthiopianNutritionCard from "../../components/EthiopianNutritionCard";
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

        // Fetch nutrition plans from enhanced service (includes database + local data)
        const allNutritionPlans = await nutritionPlanService.getAllNutritionPlans();
        setNutritionPlans(allNutritionPlans);
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
                  {/* Fitness Plans Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <Dumbbell className="h-6 w-6 text-green-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Comprehensive Fitness Plans</h2>
                    </div>
                    <p className="text-gray-600 max-w-3xl">
                      Professional workout programs designed for specific fitness goals. Each plan includes detailed
                      exercise instructions, progressive training schedules, and comprehensive guidance for optimal results.
                    </p>
                  </div>

                  {/* Weight Gain Section */}
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">💪</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Weight Gain & Muscle Building Plans</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredFitnessPlans
                        .filter(plan => plan.category === 'weight-gain')
                        .map((plan) => (
                          <WorkoutPlanCard key={plan.id} plan={plan} showStats={true} />
                        ))}
                    </div>
                  </div>

                  {/* Weight Loss Section */}
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">🔥</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Weight Loss & Fat Burning Plans</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredFitnessPlans
                        .filter(plan => plan.category === 'weight-loss')
                        .map((plan) => (
                          <WorkoutPlanCard key={plan.id} plan={plan} showStats={true} />
                        ))}
                    </div>
                  </div>

                  {/* Other Fitness Plans */}
                  {filteredFitnessPlans.filter(plan => !['weight-gain', 'weight-loss'].includes(plan.category)).length > 0 && (
                    <div className="mb-12">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">⚡</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Additional Fitness Plans</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFitnessPlans
                          .filter(plan => !['weight-gain', 'weight-loss'].includes(plan.category))
                          .map((plan) => (
                            <WorkoutPlanCard key={plan.id} plan={plan} showStats={false} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* No Plans Message */}
                  {filteredFitnessPlans.length === 0 && (
                    <div className="text-center py-10">
                      <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500">No fitness plans found for selected filters.</p>
                      <p className="text-gray-400">Try adjusting your filters or check back later!</p>
                    </div>
                  )}

                  {/* Educational Section for Fitness Plans */}
                  <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Dumbbell className="h-5 w-5 text-green-600 mr-2" />
                      About Our Fitness Plans
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <span className="text-purple-600 mr-2">💪</span>
                          Weight Gain & Muscle Building
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Our weight gain plans focus on progressive overload and muscle hypertrophy:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• <strong>6 days/week training:</strong> Optimal frequency for muscle growth</li>
                          <li>• <strong>45-90 second rest:</strong> Perfect for hypertrophy and strength</li>
                          <li>• <strong>Compound movements:</strong> Deadlifts, squats, bench press</li>
                          <li>• <strong>Progressive overload:</strong> Systematic strength increases</li>
                          <li>• <strong>Cardio integration:</strong> Maintains conditioning while building mass</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <span className="text-blue-600 mr-2">🔥</span>
                          Weight Loss & Fat Burning
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Our weight loss plans maximize calorie burn while preserving muscle:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• <strong>6 days/week training:</strong> High frequency for maximum calorie burn</li>
                          <li>• <strong>30-60 second rest:</strong> Elevated heart rate for fat loss</li>
                          <li>• <strong>HIIT integration:</strong> High-intensity intervals for efficiency</li>
                          <li>• <strong>Strength preservation:</strong> Maintains muscle during fat loss</li>
                          <li>• <strong>Cardio variety:</strong> Steady-state and interval training</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-2" />
                        Plan Features
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-green-600 mr-2" />
                          Detailed timing
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-blue-600 mr-2" />
                          Specific targets
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-purple-600 mr-2" />
                          Progressive difficulty
                        </div>
                        <div className="flex items-center">
                          <Dumbbell className="h-4 w-4 text-red-600 mr-2" />
                          Equipment guidance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  {/* Ethiopian Traditional Nutrition Plans Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="h-6 w-6 text-green-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Ethiopian Traditional Nutrition Plans</h2>
                    </div>
                    <p className="text-gray-600 max-w-3xl">
                      Discover authentic Ethiopian nutrition plans featuring traditional foods and cultural dishes.
                      These plans are designed with balanced macronutrients using ingredients like Teff, Injera,
                      traditional spices, and time-honored cooking methods for optimal health and cultural authenticity.
                    </p>
                  </div>

                  {/* Filter Controls */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
                      <select
                        value={selectedNutritionCategory}
                        onChange={(e) => setSelectedNutritionCategory(e.target.value as NutritionCategory | 'all')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {nutritionCategories.map((category) => (
                          <option key={category} value={category}>
                            {nutritionCategoryConfig[category]?.icon} {category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* All Nutrition Plans */}
                  {filteredNutritionPlans.length > 0 ? (
                    <div className="mb-12">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Utensils className="h-5 w-5 text-green-600 mr-2" />
                        Ethiopian Nutrition Plans ({filteredNutritionPlans.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNutritionPlans.map((plan, index) => (
                          <NutritionPlanCard
                            key={plan.id}
                            plan={plan}
                            variant={index === 0 ? "featured" : "default"}
                            showStats={true}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500">No nutrition plans found for selected category.</p>
                      <p className="text-gray-400">Try selecting a different category or check back later!</p>
                    </div>
                  )}

                  {/* Educational Section */}
                  <div className="mt-12 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="h-5 w-5 text-green-600 mr-2" />
                      About Ethiopian Nutrition
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">For Healthy Weight Gain</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Ethiopian weight gain plans focus on calorie surplus from balanced macronutrients:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• <strong>Carbohydrates (4 cal/gram):</strong> Barley flour, Teff, Injera</li>
                          <li>• <strong>Proteins (4 cal/gram):</strong> Lentils, Chickpeas, Beef, Fish, Dairy</li>
                          <li>• <strong>Fats (9 cal/gram):</strong> Butter, Niger Seed, Sesame</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">For Healthy Weight Loss</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Ethiopian weight loss plans create caloric deficit with nutrient-dense foods:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• <strong>Fruits & Vegetables:</strong> Rich in vitamins, minerals, antioxidants</li>
                          <li>• <strong>Lean Proteins:</strong> Fish, chicken breast, legumes</li>
                          <li>• <strong>Healthy Fats:</strong> Nuts, seeds, olive oil</li>
                          <li>• <strong>Whole Grains:</strong> Brown rice, quinoa, oatmeal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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