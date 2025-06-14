import React, { useState } from 'react';
import { Calendar, Clock, Target, Plus, Trash2, Edit3, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { RoutineDay, RoutineExercise } from '../../types/routine';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface DayEditorProps {
  days: RoutineDay[];
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
  onDayUpdate: (dayIndex: number, updatedDay: Partial<RoutineDay>) => void;
  onNext?: () => void;
  onBack?: () => void;
  compact?: boolean;
}

const DayEditor: React.FC<DayEditorProps> = ({
  days,
  selectedDayIndex,
  onDaySelect,
  onDayUpdate,
  onNext,
  onBack,
  compact = false
}) => {
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  const selectedDay = days[selectedDayIndex];

  const handleDayNameChange = (name: string) => {
    onDayUpdate(selectedDayIndex, { dayName: name });
  };

  const handleRestDayToggle = () => {
    onDayUpdate(selectedDayIndex, { 
      restDay: !selectedDay.restDay,
      exercises: selectedDay.restDay ? selectedDay.exercises : []
    });
  };

  const handleExerciseUpdate = (exerciseIndex: number, updates: Partial<RoutineExercise>) => {
    const updatedExercises = selectedDay.exercises.map((exercise, index) =>
      index === exerciseIndex ? { ...exercise, ...updates } : exercise
    );
    onDayUpdate(selectedDayIndex, { exercises: updatedExercises });
  };

  const handleExerciseDelete = (exerciseIndex: number) => {
    const updatedExercises = selectedDay.exercises.filter((_, index) => index !== exerciseIndex);
    onDayUpdate(selectedDayIndex, { exercises: updatedExercises });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedDay.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order indices
    const updatedExercises = items.map((exercise, index) => ({
      ...exercise,
      orderIndex: index
    }));

    onDayUpdate(selectedDayIndex, { exercises: updatedExercises });
  };

  const calculateDayDuration = (day: RoutineDay): number => {
    return day.exercises.reduce((total, exercise) => {
      const sets = exercise.sets || 3;
      const restTime = (exercise.restSeconds || 60) * (sets - 1);
      const workTime = sets * 45; // Estimate 45 seconds per set
      return total + workTime + restTime;
    }, 0) / 60; // Convert to minutes
  };

  const ExerciseItem: React.FC<{ exercise: RoutineExercise; index: number }> = ({ exercise, index }) => (
    <Draggable draggableId={exercise.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white border border-gray-200 rounded-lg p-4 ${
            snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-sm'
          } transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div {...provided.dragHandleProps} className="mt-1">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{exercise.exercise.name}</h4>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>{exercise.sets || 3} sets</span>
                  <span>•</span>
                  <span>{exercise.reps || '8-12'} reps</span>
                  {exercise.weightKg && (
                    <>
                      <span>•</span>
                      <span>{exercise.weightKg}kg</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{exercise.restSeconds || 60}s rest</span>
                </div>
                
                {editingExercise === exercise.id && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sets</label>
                      <input
                        type="number"
                        value={exercise.sets || 3}
                        onChange={(e) => handleExerciseUpdate(index, { sets: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                      <input
                        type="text"
                        value={exercise.reps || '8-12'}
                        onChange={(e) => handleExerciseUpdate(index, { reps: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="8-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={exercise.weightKg || ''}
                        onChange={(e) => handleExerciseUpdate(index, { 
                          weightKg: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        step="0.5"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rest (sec)</label>
                      <input
                        type="number"
                        value={exercise.restSeconds || 60}
                        onChange={(e) => handleExerciseUpdate(index, { restSeconds: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="15"
                      />
                    </div>
                  </div>
                )}
                
                {exercise.notes && (
                  <p className="mt-2 text-sm text-gray-600 italic">{exercise.notes}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingExercise(editingExercise === exercise.id ? null : exercise.id)}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleExerciseDelete(index)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-medium text-gray-900 mb-4">
          {selectedDay?.dayName || `Day ${selectedDay?.dayNumber}`}
        </h3>
        
        <div className="space-y-2">
          {selectedDay?.exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div>
                <p className="font-medium text-sm">{exercise.exercise.name}</p>
                <p className="text-xs text-gray-500">
                  {exercise.sets}×{exercise.reps} • {exercise.restSeconds}s rest
                </p>
              </div>
              <button
                onClick={() => handleExerciseDelete(index)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {selectedDay?.exercises.length === 0 && !selectedDay?.restDay && (
            <p className="text-sm text-gray-500 text-center py-4">
              No exercises added yet
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Routine Days Setup</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => onDaySelect(index)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                selectedDayIndex === index
                  ? 'bg-blue-600 text-white'
                  : day.restDay
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {day.dayName || `Day ${day.dayNumber}`}
              {day.restDay && <span className="ml-2 text-xs">(Rest)</span>}
            </button>
          ))}
        </div>

        {/* Day Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day Name
            </label>
            <input
              type="text"
              value={selectedDay?.dayName || ''}
              onChange={(e) => handleDayNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Day ${selectedDay?.dayNumber}`}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rest Day
              </label>
              <p className="text-sm text-gray-600">Mark this as a rest/recovery day</p>
            </div>
            <button
              onClick={handleRestDayToggle}
              className={`flex items-center ${
                selectedDay?.restDay ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {selectedDay?.restDay ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Day Stats */}
        {selectedDay && !selectedDay.restDay && (
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              <span>{selectedDay.exercises.length} exercises</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>~{Math.round(calculateDayDuration(selectedDay))} min</span>
            </div>
          </div>
        )}
      </div>

      {/* Exercises List */}
      {selectedDay && !selectedDay.restDay && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Exercises for {selectedDay.dayName || `Day ${selectedDay.dayNumber}`}
            </h3>
            <span className="text-sm text-gray-600">
              Drag to reorder exercises
            </span>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {selectedDay.exercises.map((exercise, index) => (
                    <ExerciseItem key={exercise.id} exercise={exercise} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {selectedDay.exercises.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises added yet</h3>
              <p className="text-gray-600">Add exercises from the library to build your workout</p>
            </div>
          )}
        </div>
      )}

      {selectedDay?.restDay && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rest Day</h3>
            <p className="text-gray-600">This day is marked for rest and recovery</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {(onNext || onBack) && (
        <div className="flex justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
            >
              Add Exercises
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DayEditor;
