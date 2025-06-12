import React, { useState, useMemo } from 'react';
import { Exercise } from '../types/content';
import ExerciseCard from './ExerciseCard';
import ExerciseDetailModal from './ExerciseDetailModal';
import { Search, Filter, Target, Dumbbell, Clock } from 'lucide-react';

interface ExerciseGalleryProps {
  exercises: Exercise[];
  title?: string;
  showFilters?: boolean;
  variant?: 'grid' | 'list' | 'masonry';
}

const ExerciseGallery: React.FC<ExerciseGalleryProps> = ({
  exercises,
  title = "Exercise Library",
  showFilters = true,
  variant = 'grid'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique values for filters
  const difficulties = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.difficulty)))], [exercises]);
  const categories = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.category)))], [exercises]);
  const muscleGroups = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))], [exercises]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;

      return matchesSearch && matchesDifficulty && matchesCategory && matchesMuscleGroup;
    });
  }, [exercises, searchTerm, selectedDifficulty, selectedCategory, selectedMuscleGroup]);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
  };

  const getGridClasses = () => {
    switch (variant) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      case 'list':
        return 'space-y-4';
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">Discover and learn from our comprehensive exercise library</p>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search exercises by name, description, or target muscles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Muscle Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Muscle Group</label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {muscleGroups.map(muscleGroup => (
                  <option key={muscleGroup} value={muscleGroup}>
                    {muscleGroup === 'all' ? 'All Muscle Groups' : muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all' || selectedMuscleGroup !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedDifficulty !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Difficulty: {selectedDifficulty}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedMuscleGroup !== 'all' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  Muscle Group: {selectedMuscleGroup}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </span>
          {filteredExercises.length !== exercises.length && (
            <button
              onClick={clearFilters}
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {/* View Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['grid', 'list', 'masonry'].map((view) => (
              <button
                key={view}
                onClick={() => {/* Handle view change */}}
                className={`px-3 py-1 text-xs rounded ${
                  variant === view ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <div className={getGridClasses()}>
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className={variant === 'masonry' ? 'break-inside-avoid' : ''}>
              <ExerciseCard
                exercise={exercise}
                variant={variant === 'list' ? 'detailed' : 'gallery'}
                onClick={() => handleExerciseClick(exercise)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

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

export default ExerciseGallery; 