import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Target, Play, Edit3, Trash2, Copy, Star } from 'lucide-react';
import { UserRoutine, RoutineTemplate } from '../../types/routine';
import { useRoutineStore } from '../../stores/routineStore';
import RoutineBuilder from './RoutineBuilder';
import RoutineCard from './RoutineCard';
import TemplateCard from './TemplateCard';
import WorkoutSession from './WorkoutSession';

interface RoutineDashboardProps {
  userId: string;
}

const RoutineDashboard: React.FC<RoutineDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'my-routines' | 'templates' | 'create'>('my-routines');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<UserRoutine | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<UserRoutine | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const {
    routines,
    templates,
    currentWorkout,
    isLoading,
    error,
    fetchRoutines,
    fetchTemplates,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    duplicateRoutine,
    startWorkout,
    endWorkout,
    clearError
  } = useRoutineStore();

  useEffect(() => {
    fetchRoutines();
    fetchTemplates();
  }, [fetchRoutines, fetchTemplates]);

  const filteredRoutines = routines.filter(routine =>
    routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    routine.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoutine = async (routine: UserRoutine) => {
    try {
      await createRoutine(routine);
      setShowBuilder(false);
      setEditingRoutine(null);
    } catch (error) {
      console.error('Error creating routine:', error);
    }
  };

  const handleEditRoutine = (routine: UserRoutine) => {
    setEditingRoutine(routine);
    setShowBuilder(true);
  };

  const handleDeleteRoutine = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      await deleteRoutine(id);
    }
  };

  const handleDuplicateRoutine = async (id: string) => {
    try {
      await duplicateRoutine(id);
    } catch (error) {
      console.error('Error duplicating routine:', error);
    }
  };

  const handleStartWorkout = async (routine: UserRoutine, dayIndex: number) => {
    const day = routine.days[dayIndex];
    if (day && !day.restDay) {
      await startWorkout(routine.id, day.id);
      setSelectedRoutine(routine);
      setSelectedDay(dayIndex);
    }
  };

  const handleUseTemplate = async (template: RoutineTemplate) => {
    try {
      if (!template.routine) {
        console.error('Template routine data not found');
        return;
      }

      const routineData = {
        ...template.routine,
        name: `${template.name} - My Copy`,
        isPublic: false,
        isTemplate: false
      };

      // Remove id and timestamps to create new routine
      const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...cleanRoutineData } = routineData;

      await createRoutine(cleanRoutineData);
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  if (currentWorkout) {
    return (
      <WorkoutSession
        workout={currentWorkout}
        onComplete={endWorkout}
        onCancel={endWorkout}
      />
    );
  }

  if (showBuilder) {
    return (
      <RoutineBuilder
        initialRoutine={editingRoutine || undefined}
        onSave={handleCreateRoutine}
        onCancel={() => {
          setShowBuilder(false);
          setEditingRoutine(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fitness Routines</h1>
          <p className="text-gray-600 mt-2">Create, manage, and track your workout routines</p>
        </div>
        
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Routine
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('my-routines')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'my-routines'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          My Routines ({routines.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Templates ({templates.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={`Search ${activeTab === 'my-routines' ? 'routines' : 'templates'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          {/* My Routines Tab */}
          {activeTab === 'my-routines' && (
            <div>
              {filteredRoutines.length === 0 ? (
                <div className="text-center py-12">
                  {routines.length === 0 ? (
                    <>
                      <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No routines yet</h3>
                      <p className="text-gray-600 mb-6">Create your first workout routine to get started</p>
                      <button
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Routine
                      </button>
                    </>
                  ) : (
                    <>
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No routines found</h3>
                      <p className="text-gray-600">Try adjusting your search terms</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoutines.map(routine => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onEdit={() => handleEditRoutine(routine)}
                      onDelete={() => handleDeleteRoutine(routine.id)}
                      onDuplicate={() => handleDuplicateRoutine(routine.id)}
                      onStartWorkout={(dayIndex) => handleStartWorkout(routine, dayIndex)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onUse={() => handleUseTemplate(template)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {activeTab === 'my-routines' && routines.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{routines.length}</p>
              <p className="text-sm text-gray-600">Total Routines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {routines.reduce((total, routine) => total + routine.days.reduce((dayTotal, day) => dayTotal + day.exercises.length, 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Total Exercises</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(routines.reduce((total, routine) => total + (routine.estimatedDurationMinutes || 0), 0) / routines.length) || 0}
              </p>
              <p className="text-sm text-gray-600">Avg. Duration (min)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {routines.filter(routine => routine.isPublic).length}
              </p>
              <p className="text-sm text-gray-600">Public Routines</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineDashboard;
