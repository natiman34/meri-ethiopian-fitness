"use client"

import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { FitnessPlan } from "../../types/content";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { Loader2, AlertCircle } from "lucide-react";
import AnimatedGif from '../../components/AnimatedGif';

const FitnessPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const { user } = useAuth();

  // Check if this is a newly created plan (hide sidebar elements)
  const hideActions = searchParams.get('hideActions') === 'true' || searchParams.get('preview') === 'true';

  console.log("FitnessPlanDetail mounted. ID from params:", id);

  useEffect(() => {
    const fetchPlan = async () => {
      console.log("Fetching plan for ID:", id);
      if (!id) {
        setError("Plan ID is missing.");
        setIsLoading(false);
        console.log("Error: Plan ID is missing.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fitnessPlanService = FitnessPlanService.getInstance();
        console.log("Calling getFitnessPlanById with ID:", id);
        const fetchedPlan = await fitnessPlanService.getFitnessPlanById(id);
        console.log("Fetched plan result:", fetchedPlan);
        if (fetchedPlan) {
          setPlan(fetchedPlan);
          if (fetchedPlan.schedule.length > 0) {
            setSelectedDay(fetchedPlan.schedule[0].day);
          }
          console.log("Fetched plan successfully:", fetchedPlan);
        } else {
          setError("Fitness plan not found.");
          console.log("Error: Fitness plan not found for ID:", id);
        }
      } catch (err) {
        console.error("Failed to fetch fitness plan:", err);
        setError("Failed to load fitness plan. Please try again later.");
        console.log("Error fetching plan:", err);
      } finally {
        setIsLoading(false);
        console.log("Loading finished. IsLoading:", false);
      }
    };
    fetchPlan();
  }, [id]);

  console.log("Render Check: isLoading=", isLoading, ", error=", error, ", plan=", plan);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <p className="ml-4 text-xl text-gray-700">Loading plan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md flex items-center">
          <AlertCircle className="h-8 w-8 mr-3" />
          <strong className="font-bold mr-2">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-red-600">Plan not found</h1>
        </div>
      </div>
    );
  }

  const currentDaySchedule = plan.schedule.find(day => day.day === selectedDay);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-12">
        <div className="absolute inset-0">
          <img
            src={plan.image_url || "/images/placeholders/plan-hero.jpg"}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className={`inline-block mb-4 text-xs font-semibold px-3 py-1 rounded-full ${
                plan.level === 'beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : plan.level === 'intermediate' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)} Level
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{plan.title}</h1>
              
              {!hideActions && (
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-300">Duration</span>
                    <p className="font-semibold text-white">{plan.duration} Weeks</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-300">Weekly Sessions</span>
                    <p className="font-semibold text-white">{plan.weekly_workouts} Days</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-300">Difficulty</span>
                    <p className="font-semibold text-white">{plan.difficulty}/5</p>
                  </div>
                </div>
              )}
              
              <p className="text-lg text-white whitespace-pre-wrap">{plan.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${hideActions ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
          {/* Left Sidebar - Plan Info */}
          {!hideActions && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Plan Overview</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Target Audience</h3>
                    <p className="text-gray-600">{plan.target_audience}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Prerequisites</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {plan.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Required Equipment</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.equipment.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Goals</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.goals.map((goal, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {plan.estimated_calories_burn && (
                    <div>
                      <h3 className="font-medium text-gray-900">Estimated Weekly Calories Burn</h3>
                      <p className="text-gray-600">{plan.estimated_calories_burn} kcal</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Workout Schedule */}
          <div className={hideActions ? 'lg:col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Workout Schedule</h2>
              
              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {plan.schedule.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedDay === day.day
                        ? 'bg-green-600 text-white'
                        : day.restDay
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Day {day.day} {day.restDay ? '(Rest)' : ''}
                  </button>
                ))}
              </div>

              {/* Day Workout */}
              {currentDaySchedule && (
                <div>
                  {currentDaySchedule.restDay ? (
                    <div className="text-center py-12">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Rest Day</h3>
                      <p className="text-gray-600">Take this day to recover and let your body heal.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentDaySchedule.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="border rounded-lg p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                              <AnimatedGif
                                src={exercise.gifUrl || "/images/placeholders/exercise-gif.gif"}
                                alt={exercise.name}
                                className="w-full h-48 rounded-lg"
                              />
                            </div>
                            <div className="md:w-2/3">
                              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                              <p className="text-gray-600 mb-4">{exercise.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                {exercise.sets && (
                                  <div>
                                    <span className="text-sm text-gray-500">Sets</span>
                                    <p className="font-semibold">{exercise.sets.length}</p>
                                  </div>
                                )}
                                {exercise.estimatedTime && (
                                  <div>
                                    <span className="text-sm text-gray-500">Estimated Time</span>
                                    <p className="font-semibold">{exercise.estimatedTime} mins</p>
                                  </div>
                                )}
                                {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                                  <div>
                                    <span className="text-sm text-gray-500">Target Muscles</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {exercise.targetMuscles.map((muscle, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{muscle}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {exercise.difficulty && (
                                  <div>
                                    <span className="text-sm text-gray-500">Difficulty</span>
                                    <p className="font-semibold">{exercise.difficulty}</p>
                                  </div>
                                )}
                              </div>

                              {exercise.steps && exercise.steps.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Steps</h4>
                                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                                    {exercise.steps.map((step, idx) => (
                                      <li key={idx}>{step}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {!hideActions && (
        <div>
          <div className="space-y-6">
            {!user && (
              <Card>
                <Card.Body className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Want to save this plan?</h3>
                  <p className="text-gray-600 mb-4">
                    Create an account to save this plan to your profile.
                  </p>
                  <Link to="/register">
                    <Button variant="primary" fullWidth>
                      Sign Up Now
                    </Button>
                  </Link>
                  <p className="mt-4 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-green-600">Log in</Link>
                  </p>
                </Card.Body>
              </Card>
            )}
          
          <Card>
            <Card.Body>
              <h3 className="font-semibold text-lg mb-4">Tips for Success</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">Always warm up for 5-10 minutes before starting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">Stay hydrated throughout your workout</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">Focus on proper form rather than speed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">Listen to your body and modify exercises if needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">Don't skip rest days - they're essential for recovery</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
          
          {/* Ethiopian Meal Plan - Conditional based on fitness plan category */}
          {(plan.category === 'weight-loss' || plan.category === 'weight-gain') && (
            <Card>
              <Card.Body>
                {plan.category === 'weight-loss' ? (
                  <>
                    <h3 className="font-semibold text-lg mb-4">🥘 Ethiopian Meal Plan for Weight Loss</h3>
                    <p className="text-gray-700 mb-4">
                      The focus is on high-protein, fiber-rich, and balanced meals while controlling calorie intake.
                    </p>
                    <h2 className="font-semibold text-lg mb-4">🌅 Breakfast (High Protein & Fiber)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Kinche (Cracked wheat) + Low-fat yogurt</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Fetira (Ethiopian Crepe) with boiled eggs (without butter)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Shiro Firfir (Chickpea stew with small Injera pieces)</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🍛 Lunch (Protein & Healthy Carbs)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Tibs (Lean beef or chicken) with lots of vegetables & small Injera</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Doro Wat (Spicy Chicken Stew) with brown rice</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Lentil Stew with Cabbage & Carrots</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🍴 Snack (Healthy & Filling)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Avocado & Lemon Juice (No sugar)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Boiled Eggs & Roasted Chickpeas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Atmit (Oatmeal with Cinnamon & No Sugar)</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🥘 Dinner (Light & Nutritious)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Gomen (Collard Greens) with a small portion of Tibs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Shiro with a small Injera & side salad</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Firfir with Berbere & Tomato Sauce</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🍹 Post-Workout (Low-Calorie Protein Boost)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Greek Yogurt with Flaxseeds</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Smoothie with Spinach, Avocado, & Banana</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Boiled Sweet Potatoes & Lentils</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🔥 Additional Tips for Weight Loss</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Calorie Deficit: Eat slightly fewer calories than you burn</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Protein Intake: At least 1.2-1.6g per kg of body weight</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Fiber-Rich Foods: More vegetables, lentils, and whole grains</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Healthy Fats: Use olive oil, nuts, and seeds</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Hydration: Drink at least 3-4L of water daily</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Sleep: Aim for 7-9 hours per night for fat loss</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-4">🥘 Ethiopian Meal Plan for Weight Gain</h3>
                    <p className="text-gray-700 mb-4">
                      For optimal results with this fitness plan, consider these nutrition plans using
                       Ethiopian foods:
                    </p>
                    <h2 className="font-semibold text-lg mb-4">🌅 Breakfast (High Protein & Healthy Fats)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Kinche (Cracked wheat porridge) + Milk + Honey</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Scrambled Eggs with Kocho (False Banana Bread) & Avocado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Fetira (Ethiopian Crepe) with Peanut Butter & Honey</span>
                      </li>
                    </ul>

                     <h2 className="font-semibold text-lg mb-4">🍛 Lunch (High Carb & Protein)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Tibs (Beef or Lamb Stir-fry) with Injera & Gomen (Collard Greens)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Shiro (Chickpea Stew) with Injera & Avocado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Doro Wat (Spicy Chicken Stew) with Rice or Injera</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🍴 Snack (High Calories & Protein)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Roasted Chickpeas + Yogurt</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Atmit (Oatmeal with Milk & Honey)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Peanut Butter & Banana Smoothie</span>
                      </li>
                    </ul>

                     <h2 className="font-semibold text-lg mb-4">🥘 Dinner (Balanced Meal)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Firfir (Injera pieces soaked in spicy stew) with Eggs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Gored Gored (Raw Beef Cubes) with Injera & Berbere Sauce</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Genfo (Barley Porridge) with Butter & Honey</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🍹 Post-Workout (Protein & Carbs)</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Milk & Dates Smoothie</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Avocado Juice with Peanut Butter & Honey</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Boiled Eggs & Roasted Sweet Potatoes</span>
                      </li>
                    </ul>

                    <h2 className="font-semibold text-lg mb-4">🔥 Additional Tips for Weight Gain</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Increase Calories: Eat more frequently (every 3-4 hours)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Protein Intake: At least 1.6-2.2g per kg of body weight</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Healthy Fats: Add avocado, peanut butter, olive oil, and butter</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Hydration: Drink at least 3L of water daily</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">✅ Sleep: Aim for 7-9 hours per night for muscle recovery</span>
                      </li>
                    </ul>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default FitnessPlanDetail;
