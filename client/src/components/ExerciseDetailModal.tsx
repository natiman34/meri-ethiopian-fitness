import React, { useState } from 'react';
import { Exercise } from '../types/content';
import { X, Play, Pause, Volume2, VolumeX, Target, Clock, Dumbbell, AlertTriangle, Lightbulb, Users } from 'lucide-react';
import AnimatedGif from './AnimatedGif';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'tips' | 'variations'>('overview');
  const [videoError, setVideoError] = useState(false);

  if (!isOpen || !exercise) return null;

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

  const getMuscleGroupColor = (muscleGroup: string) => {
    switch (muscleGroup) {
      case 'chest': return 'bg-red-100 text-red-800';
      case 'back': return 'bg-blue-100 text-blue-800';
      case 'legs': return 'bg-green-100 text-green-800';
      case 'shoulders': return 'bg-purple-100 text-purple-800';
      case 'arms': return 'bg-orange-100 text-orange-800';
      case 'abs': return 'bg-yellow-100 text-yellow-800';
      case 'glutes': return 'bg-pink-100 text-pink-800';
      case 'full-body': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(exercise.category)}`}>
                  {exercise.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                  {exercise.muscleGroup}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Media Section */}
            <div className="relative h-80 bg-gray-100">
              {exercise.gifUrl ? (
                <AnimatedGif
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  staticImageSrc={exercise.image} // Use static image as fallback
                  className="w-full h-full"
                />
              ) : exercise.videoUrl ? (
                <video
                  src={exercise.videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => {
                    // If video fails, show the static image
                    setVideoError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {videoError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm text-center">
                    Video unavailable. Showing static image.
                  </div>
                </div>
              )}
              
              {/* Video controls overlay */}
              {exercise.videoUrl && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Exercise Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{exercise.name}</h2>
              <p className="text-gray-600 mb-6">{exercise.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{exercise.estimatedTime} min</div>
                </div>
                {exercise.caloriesBurn && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Target className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Calories</div>
                    <div className="font-semibold">{exercise.caloriesBurn} cal</div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Dumbbell className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Equipment</div>
                  <div className="font-semibold">{exercise.equipment.length}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Muscles</div>
                  <div className="font-semibold">{exercise.targetMuscles.length}</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: Target },
                    { id: 'instructions', label: 'Instructions', icon: Lightbulb },
                    { id: 'tips', label: 'Tips & Mistakes', icon: AlertTriangle },
                    { id: 'variations', label: 'Variations', icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                          activeTab === tab.id
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Target Muscles</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exercise.targetMuscles.map((muscle, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                      {exercise.secondaryMuscles.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Secondary Muscles</h4>
                          <div className="flex flex-wrap gap-2">
                            {exercise.secondaryMuscles.map((muscle, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Equipment Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {exercise.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {exercise.sets && exercise.sets.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Recommended Sets</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {exercise.sets.map((set, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className="font-medium">Set {set.setNumber}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    set.setType === 'warm-up' ? 'bg-blue-100 text-blue-800' :
                                    set.setType === 'working' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {set.setType}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span>{set.reps} reps</span>
                                  {set.weight && <span>{set.weight} kg</span>}
                                  <span>{set.restTime}s rest</span>
                                  {set.rpe && <span>RPE {set.rpe}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'instructions' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Step-by-Step Instructions</h3>
                      <ol className="space-y-3">
                        {exercise.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {exercise.instructions && exercise.instructions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                        <ul className="space-y-2">
                          {exercise.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2 mt-1">•</span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                        Pro Tips
                      </h3>
                      <ul className="space-y-2">
                        {exercise.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-600 mr-2 mt-1">💡</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        Common Mistakes to Avoid
                      </h3>
                      <ul className="space-y-2">
                        {exercise.commonMistakes.map((mistake, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2 mt-1">⚠️</span>
                            <span className="text-gray-700">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'variations' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exercise Variations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exercise.variations.map((variation, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <span className="text-gray-700 font-medium">{variation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal; 
