"use client"

import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { FitnessPlan } from "../../types/content";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import ExerciseDetailModal from "../../components/ExerciseDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  Play, 
  Pause,
  Volume2,
  VolumeX,

  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Heart
} from "lucide-react";

const EnhancedFitnessPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();

  // Check if this is a newly created plan (hide sidebar elements)
  const hideActions = searchParams.get('hideActions') === 'true' || searchParams.get('preview') === 'true';

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) {
        setError("Plan ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPlan = await FitnessPlanService.getFitnessPlanById(id);
        if (fetchedPlan) {
          setPlan(fetchedPlan);
          if (fetchedPlan.schedule.length > 0) {
            setSelectedDay(fetchedPlan.schedule[0].day);
          }
        } else {
          setError("Fitness plan not found.");
        }
      } catch (err) {
        console.error("Failed to fetch fitness plan:", err);
        setError("Failed to load fitness plan. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md flex items-center max-w-md">
          <AlertCircle className="h-8 w-8 mr-3 flex-shrink-0" />
          <div>
            <strong className="font-bold block">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
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
  const planImages = [
    plan.image_url || "https://via.placeholder.com/1200x400?text=Fitness+Plan",
    "https://via.placeholder.com/1200x400?text=Workout+Preview",
    "https://via.placeholder.com/1200x400?text=Results+Preview"
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % planImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + planImages.length) % planImages.length);
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[500px] mb-12">
        <div className="absolute inset-0">
          <img
            src={planImages[currentImageIndex]}
            alt={plan.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
        {/* Image Navigation */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={prevImage}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {planImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(plan.level)}`}>
                  {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)} Level
                </span>
                {plan.featured && (
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    ⭐ Featured Plan
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">{plan.title}</h1>

              {!hideActions && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <Calendar className="h-6 w-6 text-green-400 mb-1" />
                    <span className="text-sm text-gray-300 block">Duration</span>
                    <p className="font-semibold text-white text-lg">{plan.duration} Weeks</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <Clock className="h-6 w-6 text-blue-400 mb-1" />
                    <span className="text-sm text-gray-300 block">Weekly Sessions</span>
                    <p className="font-semibold text-white text-lg">{plan.weekly_workouts} Days</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3">
                    <Target className="h-6 w-6 text-purple-400 mb-1" />
                    <span className="text-sm text-gray-300 block">Difficulty</span>
                    <div className="flex items-center">
                      <div className="flex mr-2">{getDifficultyStars(plan.difficulty)}</div>
                    </div>
                  </div>

                  {plan.estimated_calories_burn && (
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3">
                      <TrendingUp className="h-6 w-6 text-red-400 mb-1" />
                      <span className="text-sm text-gray-300 block">Weekly Calories</span>
                      <p className="font-semibold text-white text-lg">{plan.estimated_calories_burn}</p>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">{plan.description}</p>

              {/* Action Buttons */}
              {!hideActions && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Start Plan
                  </Button>

                  <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${hideActions ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-8`}>
          {/* Left Sidebar - Plan Info */}
          {!hideActions && (
            <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Plan Overview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Target Audience</h3>
                  <p className="text-gray-600">{plan.target_audience}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Prerequisites</h3>
                  <ul className="space-y-1">
                    {plan.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Required Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {plan.equipment.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {plan.goals.map((goal, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                {plan.rating && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Rating</h3>
                    <div className="flex items-center">
                      <div className="flex mr-2">{getDifficultyStars(plan.rating)}</div>
                      <span className="text-gray-600">({plan.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Actions */}
            {!user ? (
              <Card>
                <Card.Body className="text-center">
                  <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Want to save this plan?</h3>
                  <p className="text-gray-600 mb-4">
                    Create an account to save this plan to your profile and track your progress.
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
            ) : (
              <Card>
                <Card.Body>
                  <h3 className="font-semibold text-lg mb-4">Plan Actions</h3>
                  <div className="space-y-3">
                    {/* Action buttons removed as requested */}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
          )}

          {/* Main Content - Workout Schedule */}
          <div className={hideActions ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Workout Schedule</h2>
              
              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 mb-8">
                {plan.schedule.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedDay === day.day
                        ? 'bg-green-600 text-white shadow-lg transform scale-105'
                        : day.restDay
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
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
                    <div className="text-center py-16">
                      <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Rest Day</h3>
                        <p className="text-gray-600">Take this day to recover and let your body heal. Rest is just as important as training!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Day {currentDaySchedule.day} Workout
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{currentDaySchedule.totalEstimatedTime} min</span>
                          </div>
                          {currentDaySchedule.totalCaloriesBurn && (
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span>{currentDaySchedule.totalCaloriesBurn} cal</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {currentDaySchedule.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                              <div className="relative">
                                <img
                                  src={exercise.gifUrl || exercise.image || "https://via.placeholder.com/300x200?text=Exercise"}
                                  alt={exercise.name}
                                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => handleExerciseClick(exercise)}
                                />
                                <div className="absolute top-2 right-2">
                                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="lg:w-2/3">
                              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                              <p className="text-gray-600 mb-4">{exercise.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <span className="text-sm text-gray-500 block">Target Muscles</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {exercise.targetMuscles.slice(0, 2).map((muscle, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{muscle}</span>
                                      ))}
                                      {exercise.targetMuscles.length > 2 && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">+{exercise.targetMuscles.length - 2}</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Difficulty */}
                              {exercise.difficulty && (
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-500">Difficulty</p>
                                  <p className="font-semibold text-lg capitalize">{exercise.difficulty}</p>
                                </div>
                              )}

                              {/* Sets/Reps/Duration */}
                              <div className="grid grid-cols-2 gap-4">
                                {exercise.sets && exercise.sets.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-500">Sets</p>
                                    <p className="font-semibold text-lg">{exercise.sets.length}</p>
                                  </div>
                                )}
                                {exercise.sets && exercise.sets.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-500">Reps</p>
                                    {exercise.sets.map((set, idx) => (
                                      <span key={idx} className="font-semibold text-lg mr-2">{set.reps}</span>
                                    ))}
                                  </div>
                                )}
                                {exercise.sets && exercise.sets.length > 0 && exercise.sets[0].duration && (
                                  <div>
                                    <p className="text-sm text-gray-500">Duration (per set)</p>
                                    <p className="font-semibold text-lg">{exercise.sets[0].duration}</p>
                                  </div>
                                )}
                              </div>

                              {/* Equipment */}
                              {exercise.equipment && exercise.equipment.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <span className="text-sm text-gray-500 block">Equipment</span>
                                  <div className="flex flex-wrap gap-2">
                                    {exercise.equipment.map((item, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => handleExerciseClick(exercise)}
                                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                              >
                                View Details
                                <ChevronRight className="h-4 w-4" />
                              </button>
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

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExercise(null);
        }}
      />
    </div>
  );
};

export default EnhancedFitnessPlanDetail; 