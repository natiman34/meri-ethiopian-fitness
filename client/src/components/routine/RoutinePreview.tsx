import React from 'react';
import { Calendar, Clock, Target, Users, Save, Edit3, Play, Star, Share2 } from 'lucide-react';
import { UserRoutine } from '../../types/routine';

interface RoutinePreviewProps {
  routine: UserRoutine;
  onSave: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

const RoutinePreview: React.FC<RoutinePreviewProps> = ({
  routine,
  onSave,
  onEdit,
  isLoading = false
}) => {
  const totalExercises = routine.days.reduce((total, day) => total + day.exercises.length, 0);
  const workoutDays = routine.days.filter(day => !day.restDay).length;
  const restDays = routine.days.filter(day => day.restDay).length;
  
  const allMuscleGroups = Array.from(
    new Set(
      routine.days.flatMap(day => 
        day.exercises.flatMap(exercise => exercise.exercise.muscleGroups)
      )
    )
  );

  const averageDuration = routine.days.reduce((total, day) => {
    if (day.restDay) return total;
    const dayDuration = day.exercises.reduce((dayTotal, exercise) => {
      const sets = exercise.sets || 3;
      const restTime = (exercise.restSeconds || 60) * (sets - 1);
      const workTime = sets * 45; // Estimate 45 seconds per set
      return dayTotal + workTime + restTime;
    }, 0);
    return total + dayDuration;
  }, 0) / (workoutDays * 60); // Convert to minutes

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{routine.name}</h1>
            {routine.description && (
              <p className="text-gray-600 mb-4">{routine.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(routine.difficultyLevel)}`}>
                {routine.difficultyLevel.charAt(0).toUpperCase() + routine.difficultyLevel.slice(1)}
              </span>
              {routine.isPublic && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Public
                </span>
              )}
              {routine.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Routine'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{routine.daysPerWeek}</p>
            <p className="text-sm text-gray-600">Days/Week</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalExercises}</p>
            <p className="text-sm text-gray-600">Total Exercises</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(averageDuration)}</p>
            <p className="text-sm text-gray-600">Avg. Duration (min)</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{allMuscleGroups.length}</p>
            <p className="text-sm text-gray-600">Muscle Groups</p>
          </div>
        </div>
      </div>

      {/* Muscle Groups Coverage */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Muscle Groups Targeted</h2>
        <div className="flex flex-wrap gap-2">
          {allMuscleGroups.map(group => (
            <span key={group} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {group}
            </span>
          ))}
        </div>
      </div>

      {/* Days Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Routine Overview</h2>
        
        <div className="space-y-4">
          {routine.days.map((day, index) => (
            <div key={day.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {day.dayNumber}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {day.dayName || `Day ${day.dayNumber}`}
                    </h3>
                    {day.restDay ? (
                      <p className="text-sm text-gray-600">Rest & Recovery Day</p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {day.exercises.length} exercises • {day.focusMuscleGroups.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                {!day.restDay && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ~{Math.round(day.exercises.reduce((total, exercise) => {
                        const sets = exercise.sets || 3;
                        const restTime = (exercise.restSeconds || 60) * (sets - 1);
                        const workTime = sets * 45;
                        return total + workTime + restTime;
                      }, 0) / 60)} min
                    </p>
                    <p className="text-xs text-gray-600">Estimated duration</p>
                  </div>
                )}
              </div>

              {!day.restDay && day.exercises.length > 0 && (
                <div className="space-y-2">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                      <div>
                        <p className="font-medium text-gray-900">{exercise.exercise.name}</p>
                        <p className="text-sm text-gray-600">
                          {exercise.sets || 3} sets × {exercise.reps || '8-12'} reps
                          {exercise.weightKg && ` @ ${exercise.weightKg}kg`}
                          • {exercise.restSeconds || 60}s rest
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.exercise.muscleGroups.slice(0, 2).map(group => (
                          <span key={group} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {day.restDay && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2" />
                  <p>Focus on recovery, stretching, and light activities</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Saving Routine...' : 'Save & Start Using'}
          </button>
          
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Make Changes
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Once saved, you can start workouts, track progress, and share with others
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start with lighter weights and focus on proper form</li>
          <li>• Allow adequate rest between sets and workouts</li>
          <li>• Track your progress and gradually increase intensity</li>
          <li>• Listen to your body and adjust as needed</li>
          {routine.difficultyLevel === 'beginner' && (
            <li>• Consider working with a trainer for the first few sessions</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoutinePreview;
