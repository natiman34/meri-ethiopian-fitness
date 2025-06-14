import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Check, Clock, Target, RotateCcw } from 'lucide-react';
import { WorkoutSession as WorkoutSessionType, WorkoutExercise, WorkoutSet } from '../../types/routine';

interface WorkoutSessionProps {
  workout: WorkoutSessionType;
  onComplete: () => void;
  onCancel: () => void;
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({
  workout,
  onComplete,
  onCancel
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
      if (isResting && restTimer > 0) {
        setRestTimer(prev => prev - 1);
      } else if (isResting && restTimer === 0) {
        setIsResting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetComplete = (reps: number, weight?: number) => {
    // Mark current set as complete
    const updatedSet = {
      ...currentSet,
      reps,
      weightKg: weight,
      completed: true
    };

    // Update the workout
    // This would typically update the store
    
    // Start rest timer if not the last set
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setRestTimer(currentSet.restSeconds || 60);
      setIsResting(true);
      setCurrentSetIndex(prev => prev + 1);
    } else {
      // Move to next exercise
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSetIndex(0);
      } else {
        // Workout complete
        onComplete();
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const completedSets = workout.exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed).length, 0
  );
  
  const totalSets = workout.exercises.reduce((total, exercise) => 
    total + exercise.sets.length, 0
  );

  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Active Workout</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedSets} / {totalSets} sets</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center space-x-6 text-center">
          <div>
            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-gray-900">{formatTime(workoutTimer)}</p>
            <p className="text-xs text-gray-600">Total Time</p>
          </div>
          
          {isResting && (
            <div>
              <RotateCcw className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-orange-600">{formatTime(restTimer)}</p>
              <p className="text-xs text-gray-600">Rest Time</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Exercise */}
      {currentExercise && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentExercise.exercise.name}
            </h2>
            <p className="text-gray-600">
              Set {currentSetIndex + 1} of {currentExercise.sets.length}
            </p>
          </div>

          {/* Exercise Image */}
          {currentExercise.exercise.imageUrl && (
            <div className="mb-6 text-center">
              <img
                src={currentExercise.exercise.imageUrl}
                alt={currentExercise.exercise.name}
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
            </div>
          )}

          {/* Current Set */}
          {currentSet && !isResting && (
            <div className="text-center mb-6">
              <div className="bg-blue-50 rounded-lg p-6 mb-4">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {currentSet.reps || 'Enter'} reps
                </p>
                {currentSet.weightKg && (
                  <p className="text-lg text-gray-600">
                    @ {currentSet.weightKg} kg
                  </p>
                )}
              </div>

              <SetInputForm
                onComplete={handleSetComplete}
                suggestedReps={currentSet.reps}
                suggestedWeight={currentSet.weightKg}
              />
            </div>
          )}

          {/* Rest Period */}
          {isResting && (
            <div className="text-center mb-6">
              <div className="bg-orange-50 rounded-lg p-6 mb-4">
                <p className="text-2xl font-bold text-orange-600 mb-2">Rest Time</p>
                <p className="text-4xl font-bold text-orange-600 mb-2">
                  {formatTime(restTimer)}
                </p>
                <p className="text-gray-600">Get ready for your next set</p>
              </div>

              <button
                onClick={skipRest}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Skip Rest
              </button>
            </div>
          )}

          {/* Exercise Progress */}
          <div className="grid grid-cols-4 gap-2">
            {currentExercise.sets.map((set, index) => (
              <div
                key={index}
                className={`p-2 rounded text-center text-sm ${
                  set.completed
                    ? 'bg-green-100 text-green-800'
                    : index === currentSetIndex
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Set {index + 1}
                {set.completed && <Check className="w-4 h-4 mx-auto mt-1" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Workout Overview</h3>
        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <div
              key={exercise.routineExerciseId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === currentExerciseIndex
                  ? 'bg-blue-50 border border-blue-200'
                  : exercise.completed
                  ? 'bg-green-50'
                  : 'bg-gray-50'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{exercise.exercise.name}</p>
                <p className="text-sm text-gray-600">
                  {exercise.sets.length} sets • {exercise.sets.filter(s => s.completed).length} completed
                </p>
              </div>
              {exercise.completed && <Check className="w-5 h-5 text-green-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Set Input Form Component
interface SetInputFormProps {
  onComplete: (reps: number, weight?: number) => void;
  suggestedReps?: number;
  suggestedWeight?: number;
}

const SetInputForm: React.FC<SetInputFormProps> = ({
  onComplete,
  suggestedReps,
  suggestedWeight
}) => {
  const [reps, setReps] = useState(suggestedReps || 0);
  const [weight, setWeight] = useState(suggestedWeight || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reps > 0) {
      onComplete(reps, weight > 0 ? weight : undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reps Completed
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.5"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
      >
        Complete Set
      </button>
    </form>
  );
};

export default WorkoutSession;
