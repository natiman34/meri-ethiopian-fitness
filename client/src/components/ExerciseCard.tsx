import React, { useState } from 'react';
import { Exercise } from '../types/content';
import { Play, Pause, Info, Target, Clock, Dumbbell } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  showDetails?: boolean;
  variant?: 'compact' | 'detailed' | 'gallery';
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onClick,
  showDetails = false,
  variant = 'detailed'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-blue-100 text-blue-800';
      case 'cardio': return 'bg-red-100 text-red-800';
      case 'flexibility': return 'bg-purple-100 text-purple-800';
      case 'balance': return 'bg-indigo-100 text-indigo-800';
      case 'plyometric': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <div className="relative h-32">
          <ImageWithFallback
            src={exercise.gifUrl || exercise.image}
            alt={exercise.name}
            className="w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 truncate">{exercise.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exercise.description}</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{exercise.estimatedTime} min</span>
            {exercise.caloriesBurn && (
              <>
                <span className="mx-2">•</span>
                <span>{exercise.caloriesBurn} cal</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'gallery') {
    return (
      <div 
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        onClick={onClick}
      >
        <div className="relative h-48">
          <ImageWithFallback
            src={exercise.gifUrl || exercise.image}
            alt={exercise.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exercise.category)}`}>
              {exercise.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
            <div className="flex items-center mt-1 text-white/80 text-sm">
              <Target className="h-3 w-3 mr-1" />
              <span>{exercise.targetMuscles.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gray-100">
          <ImageWithFallback
            src={exercise.gifUrl || exercise.image}
            alt={exercise.name}
            className="w-full h-full"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exercise.category)}`}>
              {exercise.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-gray-700" />
              ) : (
                <Play className="h-4 w-4 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          {onClick && (
            <button
              onClick={onClick}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exercise.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-green-600" />
            <span>{exercise.estimatedTime} min</span>
          </div>
          {exercise.caloriesBurn && (
            <div className="flex items-center text-sm text-gray-600">
              <Target className="h-4 w-4 mr-2 text-red-600" />
              <span>{exercise.caloriesBurn} cal</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Target Muscles</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.targetMuscles.map((muscle, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Equipment</h4>
              <div className="flex flex-wrap gap-1">
                {exercise.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {exercise.sets && exercise.sets.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended Sets</h4>
                <div className="space-y-1">
                  {exercise.sets.slice(0, 3).map((set, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">Set {set.setNumber}</span>
                      <span className="font-medium">{set.reps} reps</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard; 