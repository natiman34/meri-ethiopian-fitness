import React, { useState } from 'react';
import { Calendar, Clock, Target, Play, Edit3, Trash2, Copy, MoreVertical, Users, Star } from 'lucide-react';
import { UserRoutine } from '../../types/routine';

interface RoutineCardProps {
  routine: UserRoutine;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartWorkout: (dayIndex: number) => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onEdit,
  onDelete,
  onDuplicate,
  onStartWorkout
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const totalExercises = routine.days.reduce((total, day) => total + day.exercises.length, 0);
  const workoutDays = routine.days.filter(day => !day.restDay);
  const nextWorkoutDay = workoutDays[selectedDay] || workoutDays[0];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allMuscleGroups = Array.from(
    new Set(
      routine.days.flatMap(day =>
        day.exercises.flatMap(exercise => exercise.exercise.muscleGroups || [])
      )
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{routine.name}</h3>
            {routine.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{routine.description}</p>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Routine
                </button>
                <button
                  onClick={() => {
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags and Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(routine.difficultyLevel)}`}>
            {routine.difficultyLevel.charAt(0).toUpperCase() + routine.difficultyLevel.slice(1)}
          </span>
          {routine.isPublic && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Public
            </span>
          )}
          {routine.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {routine.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{routine.tags.length - 2}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{routine.daysPerWeek}</p>
            <p className="text-xs text-gray-600">Days/Week</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{totalExercises}</p>
            <p className="text-xs text-gray-600">Exercises</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {routine.estimatedDurationMinutes ? Math.round(routine.estimatedDurationMinutes) : '~45'}
            </p>
            <p className="text-xs text-gray-600">Minutes</p>
          </div>
        </div>

        {/* Muscle Groups */}
        {allMuscleGroups.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Targets:</p>
            <div className="flex flex-wrap gap-1">
              {allMuscleGroups.slice(0, 4).map(group => (
                <span key={group} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {group}
                </span>
              ))}
              {allMuscleGroups.length > 4 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                  +{allMuscleGroups.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Workout Days Selection */}
      {workoutDays.length > 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Select workout day:</p>
          <div className="flex flex-wrap gap-1">
            {workoutDays.map((day, index) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(index)}
                className={`px-3 py-1 text-xs rounded-md ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.dayName || `Day ${day.dayNumber}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        {nextWorkoutDay ? (
          <button
            onClick={() => {
              const dayIndex = routine.days.findIndex(d => d.id === nextWorkoutDay.id);
              onStartWorkout(dayIndex);
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Play className="w-4 h-4 mr-2" />
            Start {nextWorkoutDay.dayName || `Day ${nextWorkoutDay.dayNumber}`}
          </button>
        ) : (
          <div className="text-center py-3">
            <p className="text-sm text-gray-500">No workout days available</p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>0% completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default RoutineCard;
