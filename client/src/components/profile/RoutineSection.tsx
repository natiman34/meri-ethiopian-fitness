import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Target, Clock, Play, TrendingUp, Award } from 'lucide-react';
import { useRoutineStore } from '../../stores/routineStore';
import RoutineDashboard from '../routine/RoutineDashboard';

interface RoutineSectionProps {
  userId: string;
  isOwnProfile: boolean;
}

const RoutineSection: React.FC<RoutineSectionProps> = ({ userId, isOwnProfile }) => {
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [activeRoutines, setActiveRoutines] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(3);

  const {
    routines,
    isLoading,
    fetchRoutines,
    startWorkout
  } = useRoutineStore();

  useEffect(() => {
    if (isOwnProfile) {
      fetchRoutines();
    }
  }, [fetchRoutines, isOwnProfile]);

  useEffect(() => {
    setActiveRoutines(routines.length);
    // Calculate total workouts from progress data
    // This would typically come from workout history
    setTotalWorkouts(42); // Placeholder
  }, [routines]);

  const recentRoutines = routines.slice(0, 3);
  const weeklyProgress = 2; // Placeholder - would come from actual workout data

  const handleQuickStart = async (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      const firstWorkoutDay = routine.days.find(day => !day.restDay);
      if (firstWorkoutDay) {
        await startWorkout(routineId, firstWorkoutDay.id);
      }
    }
  };

  if (showFullDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Fitness Routines</h2>
          <button
            onClick={() => setShowFullDashboard(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Profile
          </button>
        </div>
        <RoutineDashboard userId={userId} />
      </div>
    );
  }

  if (!isOwnProfile) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Routines</h3>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Routine information is private</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Fitness Routines</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFullDashboard(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Routine
            </button>
            <button
              onClick={() => setShowFullDashboard(true)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              View All
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{activeRoutines}</p>
            <p className="text-sm text-gray-600">Active Routines</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{weeklyProgress}/{weeklyGoal}</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{totalWorkouts}</p>
            <p className="text-sm text-gray-600">Total Workouts</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">7</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weekly Goal Progress</span>
            <span className="text-sm text-gray-600">{weeklyProgress} of {weeklyGoal} workouts</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Routines */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Recent Routines</h4>
          <button
            onClick={() => setShowFullDashboard(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading routines...</span>
          </div>
        ) : recentRoutines.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No routines yet</h4>
            <p className="text-gray-600 mb-4">Create your first workout routine to get started</p>
            <button
              onClick={() => setShowFullDashboard(true)}
              className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Routine
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRoutines.map(routine => {
              const totalExercises = routine.days.reduce((total, day) => total + day.exercises.length, 0);
              const nextWorkoutDay = routine.days.find(day => !day.restDay);
              
              return (
                <div key={routine.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{routine.name}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {routine.daysPerWeek} days/week
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {totalExercises} exercises
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        ~{routine.estimatedDurationMinutes || 45} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      routine.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                      routine.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {routine.difficultyLevel}
                    </span>
                    
                    {nextWorkoutDay && (
                      <button
                        onClick={() => handleQuickStart(routine.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowFullDashboard(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Create New Routine</span>
          </button>
          
          <button
            onClick={() => setShowFullDashboard(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Target className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Browse Templates</span>
          </button>
        </div>
      </div>

      {/* Ethiopian Traditional Highlight */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-yellow-600 font-bold">🇪🇹</span>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800">Ethiopian Traditional Workouts</h4>
            <p className="text-sm text-yellow-700">Discover authentic Ethiopian fitness practices</p>
          </div>
        </div>
        <button
          onClick={() => setShowFullDashboard(true)}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Explore Traditional Routines
        </button>
      </div>
    </div>
  );
};

export default RoutineSection;
