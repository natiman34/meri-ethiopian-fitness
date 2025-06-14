import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Image, Play, Target, Dumbbell } from 'lucide-react';
import { Exercise, ExerciseFilters, RoutineDay } from '../../types/routine';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES, DIFFICULTY_LEVELS } from '../../types/routine';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  selectedDay?: RoutineDay;
  compact?: boolean;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  exercises,
  onExerciseSelect,
  selectedDay,
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Exercises', icon: Dumbbell },
    { id: 'strength', name: 'Strength', icon: Target },
    { id: 'cardio', name: 'Cardio', icon: Play },
    { id: 'flexibility', name: 'Flexibility', icon: Target },
    { id: 'ethiopian', name: 'Ethiopian Traditional', icon: Target }
  ];

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      // Search term filter
      if (searchTerm && !exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !exercise.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'ethiopian' && !exercise.isEthiopianTraditional) return false;
        if (selectedCategory !== 'ethiopian' && exercise.exerciseType !== selectedCategory) return false;
      }

      // Muscle groups filter
      if (filters.muscleGroups?.length) {
        if (!filters.muscleGroups.some(group => (exercise.muscleGroups || []).includes(group))) {
          return false;
        }
      }

      // Equipment filter
      if (filters.equipment?.length) {
        if (!filters.equipment.some(eq => (exercise.equipment || []).includes(eq))) {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficultyLevel && exercise.difficultyLevel !== filters.difficultyLevel) {
        return false;
      }

      return true;
    });
  }, [exercises, searchTerm, filters, selectedCategory]);

  const handleFilterChange = (key: keyof ExerciseFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{exercise.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
        </div>
        {exercise.imageUrl && (
          <div className="ml-3 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src={exercise.imageUrl} 
              alt={exercise.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Image className="w-6 h-6 text-gray-400 hidden" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {(exercise.muscleGroups || []).slice(0, 3).map(group => (
          <span key={group} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {group}
          </span>
        ))}
        {(exercise.muscleGroups || []).length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{(exercise.muscleGroups || []).length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded-full text-xs ${
            exercise.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800' :
            exercise.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {exercise.difficultyLevel}
          </span>
          {exercise.isEthiopianTraditional && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              Ethiopian
            </span>
          )}
        </div>
        
        <button
          onClick={() => onExerciseSelect(exercise)}
          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-medium text-gray-900 mb-4">Exercise Library</h3>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredExercises.slice(0, 10).map(exercise => (
              <div key={exercise.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div>
                  <p className="font-medium text-sm">{exercise.name}</p>
                  <p className="text-xs text-gray-500">{(exercise.muscleGroups || []).join(', ')}</p>
                </div>
                <button
                  onClick={() => onExerciseSelect(exercise)}
                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Exercise Library</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              } hover:bg-blue-200`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            {(Object.keys(filters).length > 0 || searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search exercises by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muscle Groups
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {MUSCLE_GROUPS.map(group => (
                  <label key={group} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.muscleGroups?.includes(group) || false}
                      onChange={(e) => {
                        const current = filters.muscleGroups || [];
                        const updated = e.target.checked
                          ? [...current, group]
                          : current.filter(g => g !== group);
                        handleFilterChange('muscleGroups', updated);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {EQUIPMENT_TYPES.map(equipment => (
                  <label key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.equipment?.includes(equipment) || false}
                      onChange={(e) => {
                        const current = filters.equipment || [];
                        const updated = e.target.checked
                          ? [...current, equipment]
                          : current.filter(eq => eq !== equipment);
                        handleFilterChange('equipment', updated);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficultyLevel || ''}
                onChange={(e) => handleFilterChange('difficultyLevel', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
          {selectedDay && (
            <p className="text-sm text-blue-600">
              Adding to: {selectedDay.dayName || `Day ${selectedDay.dayNumber}`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
