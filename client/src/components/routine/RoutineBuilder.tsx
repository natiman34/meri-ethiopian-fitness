import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Save, Play, Calendar, Clock, Target } from 'lucide-react';
import { UserRoutine, RoutineDay, Exercise, ExerciseFilters } from '../../types/routine';
import { useRoutineStore } from '../../stores/routineStore';
import ExerciseLibrary from './ExerciseLibrary';
import DayEditor from './DayEditor';
import RoutinePreview from './RoutinePreview';

interface RoutineBuilderProps {
  initialRoutine?: Partial<UserRoutine>;
  onSave: (routine: UserRoutine) => void;
  onCancel: () => void;
}

const RoutineBuilder: React.FC<RoutineBuilderProps> = ({
  initialRoutine,
  onSave,
  onCancel
}) => {
  const [routine, setRoutine] = useState<Partial<UserRoutine>>({
    name: '',
    description: '',
    difficultyLevel: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 3,
    isPublic: false,
    tags: [],
    days: [],
    ...initialRoutine
  });

  const [currentStep, setCurrentStep] = useState<'basic' | 'days' | 'exercises' | 'preview'>('basic');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { exercises, fetchExercises } = useRoutineStore();

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routine.name || !routine.daysPerWeek) return;

    // Initialize days based on daysPerWeek
    const days: RoutineDay[] = Array.from({ length: routine.daysPerWeek }, (_, index) => ({
      id: `day-${index + 1}`,
      routineId: routine.id || '',
      dayNumber: index + 1,
      dayName: `Day ${index + 1}`,
      focusMuscleGroups: [],
      restDay: false,
      exercises: [],
      createdAt: new Date().toISOString()
    }));

    setRoutine(prev => ({ ...prev, days }));
    setCurrentStep('days');
  };

  const handleDayUpdate = (dayIndex: number, updatedDay: Partial<RoutineDay>) => {
    setRoutine(prev => ({
      ...prev,
      days: prev.days?.map((day, index) => 
        index === dayIndex ? { ...day, ...updatedDay } : day
      ) || []
    }));
  };

  const handleAddExerciseToDay = (dayIndex: number, exercise: Exercise) => {
    const newExercise = {
      id: `exercise-${Date.now()}`,
      routineDayId: routine.days?.[dayIndex]?.id || '',
      exercise,
      orderIndex: routine.days?.[dayIndex]?.exercises.length || 0,
      sets: 3,
      reps: '8-12',
      restSeconds: 60,
      isSuperset: false,
      createdAt: new Date().toISOString()
    };

    handleDayUpdate(dayIndex, {
      exercises: [...(routine.days?.[dayIndex]?.exercises || []), newExercise]
    });
  };

  const handleSaveRoutine = async () => {
    if (!routine.name || !routine.days?.length) return;

    setIsLoading(true);
    try {
      const completeRoutine: UserRoutine = {
        id: routine.id || crypto.randomUUID(),
        userId: '', // Will be set by the API
        name: routine.name,
        description: routine.description || '',
        difficultyLevel: routine.difficultyLevel || 'beginner',
        durationWeeks: routine.durationWeeks || 4,
        daysPerWeek: routine.daysPerWeek || 3,
        estimatedDurationMinutes: calculateEstimatedDuration(),
        isPublic: routine.isPublic || false,
        isTemplate: false,
        tags: routine.tags || [],
        days: routine.days,
        createdAt: routine.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(completeRoutine);
    } catch (error) {
      console.error('Error saving routine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEstimatedDuration = (): number => {
    if (!routine.days) return 0;
    
    return routine.days.reduce((total, day) => {
      const exerciseTime = day.exercises.reduce((dayTotal, exercise) => {
        const sets = exercise.sets || 3;
        const restTime = (exercise.restSeconds || 60) * (sets - 1);
        const workTime = sets * 45; // Estimate 45 seconds per set
        return dayTotal + workTime + restTime;
      }, 0);
      
      return Math.max(total, exerciseTime / 60); // Convert to minutes
    }, 0);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routine Name *
            </label>
            <input
              type="text"
              value={routine.name}
              onChange={(e) => setRoutine(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Upper Body Strength"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={routine.description}
              onChange={(e) => setRoutine(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your routine goals and approach..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={routine.difficultyLevel}
                onChange={(e) => setRoutine(prev => ({ 
                  ...prev, 
                  difficultyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days per Week *
              </label>
              <select
                value={routine.daysPerWeek}
                onChange={(e) => setRoutine(prev => ({ 
                  ...prev, 
                  daysPerWeek: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num} days</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (weeks)
              </label>
              <input
                type="number"
                value={routine.durationWeeks}
                onChange={(e) => setRoutine(prev => ({ 
                  ...prev, 
                  durationWeeks: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="52"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={routine.isPublic}
              onChange={(e) => setRoutine(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Make this routine public (others can view and copy)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Set Up Days
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[
          { key: 'basic', label: 'Basic Info', icon: Target },
          { key: 'days', label: 'Days Setup', icon: Calendar },
          { key: 'exercises', label: 'Add Exercises', icon: Plus },
          { key: 'preview', label: 'Preview', icon: Play }
        ].map(({ key, label, icon: Icon }, index) => (
          <div key={key} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === key 
                ? 'bg-blue-600 text-white' 
                : index < ['basic', 'days', 'exercises', 'preview'].indexOf(currentStep)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`ml-2 text-sm ${
              currentStep === key ? 'text-blue-600 font-medium' : 'text-gray-600'
            }`}>
              {label}
            </span>
            {index < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {renderStepIndicator()}
      
      {currentStep === 'basic' && renderBasicInfo()}
      
      {currentStep === 'days' && (
        <DayEditor
          days={routine.days || []}
          selectedDayIndex={selectedDayIndex}
          onDaySelect={setSelectedDayIndex}
          onDayUpdate={handleDayUpdate}
          onNext={() => setCurrentStep('exercises')}
          onBack={() => setCurrentStep('basic')}
        />
      )}
      
      {currentStep === 'exercises' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExerciseLibrary
              exercises={exercises}
              onExerciseSelect={(exercise) => handleAddExerciseToDay(selectedDayIndex, exercise)}
              selectedDay={routine.days?.[selectedDayIndex]}
            />
          </div>
          <div>
            <DayEditor
              days={routine.days || []}
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
              onDayUpdate={handleDayUpdate}
              compact
            />
          </div>
        </div>
      )}
      
      {currentStep === 'preview' && (
        <RoutinePreview
          routine={routine as UserRoutine}
          onSave={handleSaveRoutine}
          onEdit={() => setCurrentStep('exercises')}
          isLoading={isLoading}
        />
      )}
      
      {currentStep !== 'basic' && currentStep !== 'preview' && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              if (currentStep === 'days') setCurrentStep('basic');
              if (currentStep === 'exercises') setCurrentStep('days');
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (currentStep === 'days') setCurrentStep('exercises');
              if (currentStep === 'exercises') setCurrentStep('preview');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentStep === 'exercises' ? 'Preview Routine' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineBuilder;
