import React from 'react';
import { Calendar, Clock, Target, Star, Download, Users, Crown } from 'lucide-react';
import { RoutineTemplate } from '../../types/routine';

interface TemplateCardProps {
  template: RoutineTemplate;
  onUse: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  const routine = template.routine;
  const totalExercises = routine.days.reduce((total, day) => total + day.exercises.length, 0);
  const workoutDays = routine.days.filter(day => !day.restDay).length;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-red-100 text-red-800';
      case 'weight_loss': return 'bg-orange-100 text-orange-800';
      case 'muscle_building': return 'bg-purple-100 text-purple-800';
      case 'ethiopian_traditional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              {template.isFeatured && (
                <Crown className="w-4 h-4 text-yellow-500 ml-2" />
              )}
            </div>
            {template.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
            )}
          </div>
        </div>

        {/* Category and Difficulty */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
            {formatCategory(template.category)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficultyLevel)}`}>
            {template.difficultyLevel.charAt(0).toUpperCase() + template.difficultyLevel.slice(1)}
          </span>
          {template.isFeatured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>

        {/* Target Audience */}
        {template.targetAudience.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Perfect for:</p>
            <div className="flex flex-wrap gap-1">
              {template.targetAudience.map(audience => (
                <span key={audience} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {audience.charAt(0).toUpperCase() + audience.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{template.daysPerWeek}</p>
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
            <p className="text-lg font-semibold text-gray-900">{template.durationWeeks}</p>
            <p className="text-xs text-gray-600">Weeks</p>
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

        {/* Sample Day Preview */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Sample workout:</p>
          <div className="bg-gray-50 rounded-lg p-3">
            {routine.days.find(day => !day.restDay && day.exercises.length > 0) ? (
              <div>
                {routine.days
                  .find(day => !day.restDay && day.exercises.length > 0)
                  ?.exercises.slice(0, 3)
                  .map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between text-xs text-gray-600 mb-1 last:mb-0">
                      <span className="font-medium">{exercise.exercise.name}</span>
                      <span>{exercise.sets}×{exercise.reps}</span>
                    </div>
                  ))}
                {routine.days.find(day => !day.restDay && day.exercises.length > 0)!.exercises.length > 3 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{routine.days.find(day => !day.restDay && day.exercises.length > 0)!.exercises.length - 3} more exercises
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No exercises available</p>
            )}
          </div>
        </div>

        {/* Ethiopian Traditional Badge */}
        {template.category === 'ethiopian_traditional' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold text-sm">🇪🇹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Ethiopian Traditional</p>
                <p className="text-xs text-yellow-700">Authentic Ethiopian fitness practices</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onUse}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Use This Template
        </button>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
            {template.createdBy && (
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                By Expert
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
