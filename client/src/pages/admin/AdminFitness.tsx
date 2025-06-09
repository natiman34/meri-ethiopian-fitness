"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, Plus, Filter, X } from "lucide-react"
import Button from "../../components/ui/Button"
import { FitnessPlan, FitnessCategory, FitnessLevel } from '../../models/FitnessPlan'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Dialog } from '@headlessui/react'

const AdminFitness = () => {
  const [plans, setPlans] = useState<FitnessPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FitnessCategory | "all">("all")
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "published">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<FitnessPlan | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newPlan, setNewPlan] = useState<Partial<FitnessPlan>>({
    title: '',
    description: '',
    category: 'weight-loss',
    level: 'beginner',
    duration: 30,
    weekly_workouts: 3,
    difficulty: 1,
    prerequisites: [],
    equipment: [],
    goals: [],
    schedule: [],
    status: 'draft'
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const itemsPerPage = 10

  const { user } = useAuth()

  useEffect(() => {
    fetchPlans();
  }, [currentPage]); // Add currentPage dependency for pagination

    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

      const { data: countData, error: countError, count } = await supabase
          .from('fitness_plans')
          .select('id', { count: 'exact' });

        if (countError) throw countError;
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

        const { data, error } = await supabase
          .from('fitness_plans')
          .select('*')
          .range(from, to)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching fitness plans:', error);
        setError('Failed to load fitness plans');
      } finally {
        setIsLoading(false);
      }
    };

  // Filter fitness plans based on search term, plan type, difficulty level, and status
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || plan.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || plan.level === selectedLevel
    const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const validateForm = (plan: Partial<FitnessPlan>) => {
    const errors: {[key: string]: string} = {}
    if (!plan.title?.trim()) errors.title = 'Title is required'
    if (!plan.description?.trim()) errors.description = 'Description is required'
    if (!plan.category) errors.category = 'Category is required'
    if (!plan.level) errors.level = 'Level is required'
    if (!plan.duration || plan.duration < 1) errors.duration = 'Duration must be at least 1 minute'
    if (!plan.weekly_workouts || plan.weekly_workouts < 1) errors.weekly_workouts = 'Weekly workouts must be at least 1'
    if (!plan.difficulty || plan.difficulty < 1 || plan.difficulty > 5) errors.difficulty = 'Difficulty must be between 1 and 5'
    if (!plan.prerequisites?.length) errors.prerequisites = 'At least one prerequisite is required'
    if (!plan.equipment?.length) errors.equipment = 'At least one equipment item is required'
    if (!plan.goals?.length) errors.goals = 'At least one goal is required'
    if (!plan.schedule?.length) errors.schedule = 'At least one day of schedule is required'
    return errors
  }

  const handleCreatePlan = async () => {
    const errors = validateForm(newPlan)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const planToInsert = {
        ...newPlan,
        user_id: user?.id || null,
      }

      const { data, error } = await supabase
        .from('fitness_plans')
        .insert([planToInsert])
        .select()
        .single()

      if (error) throw error
      if (data) {
        setPlans([data, ...plans])
        setIsCreateModalOpen(false)
        setNewPlan({
          title: '',
          description: '',
          category: 'weight-loss',
          level: 'beginner',
          duration: 30,
          weekly_workouts: 3,
          difficulty: 1,
          prerequisites: [],
          equipment: [],
          goals: [],
          schedule: [],
          status: 'draft'
        })
        setFormErrors({})
      }
    } catch (error) {
      console.error('Error creating fitness plan:', error)
      setError('Failed to create fitness plan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPlan = async (plan: FitnessPlan) => {
    const errors = validateForm(plan)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('fitness_plans')
        .update(plan)
        .eq('id', plan.id)

      if (error) throw error
      setPlans(plans.map(p => p.id === plan.id ? plan : p))
      setIsEditModalOpen(false)
      setEditingPlan(null)
      setFormErrors({})
    } catch (error) {
      console.error('Error updating fitness plan:', error)
      setError('Failed to update fitness plan')
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteModal = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('fitness_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(plans.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error('Error deleting fitness plan:', error);
      setError('Failed to delete fitness plan');
    } finally {
       setIsLoading(false);
       setIsDeleteModalOpen(false);
       setPlanToDelete(null);
    }
  };

  // Handlers for schedule
  const handleAddDay = (planType: 'new' | 'edit') => {
    const newDay = {
      day: planType === 'new' 
        ? (newPlan.schedule?.length || 0) + 1 
        : (editingPlan?.schedule?.length || 0) + 1,
      restDay: false,
      exercises: []
    }

    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        schedule: [...(prev.schedule || []), newDay]
      }))
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        schedule: [...(prev.schedule || []), newDay]
      }))
    }
  }

  const handleRemoveDay = (planType: 'new' | 'edit', dayIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).filter((_, i) => i !== dayIndex)
      }))
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).filter((_, i) => i !== dayIndex)
      }))
    }
  }

  const handleAddExercise = (planType: 'new' | 'edit', dayIndex: number) => {
    const newExercise = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      steps: [],
      targetMuscles: [],
      difficulty: 'beginner' as FitnessLevel
    }

    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? { ...day, exercises: [...day.exercises, newExercise] }
            : day
        )
      }))
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? { ...day, exercises: [...day.exercises, newExercise] }
            : day
        )
      }))
    }
  }

  const handleRemoveExercise = (planType: 'new' | 'edit', dayIndex: number, exerciseIndex: number) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? { ...day, exercises: day.exercises.filter((_, j) => j !== exerciseIndex) }
            : day
        )
      }))
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? { ...day, exercises: day.exercises.filter((_, j) => j !== exerciseIndex) }
            : day
        )
      }))
    }
  }

  const handleExerciseChange = (
    planType: 'new' | 'edit',
    dayIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    if (planType === 'new') {
      setNewPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? {
                ...day,
                exercises: day.exercises.map((exercise, j) => 
                  j === exerciseIndex 
                    ? { ...exercise, [field]: value }
                    : exercise
                )
              }
            : day
        )
      }))
    } else if (planType === 'edit' && editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        schedule: (prev.schedule || []).map((day, i) => 
          i === dayIndex 
            ? {
                ...day,
                exercises: day.exercises.map((exercise, j) => 
                  j === exerciseIndex 
                    ? { ...exercise, [field]: value }
                    : exercise
                )
              }
            : day
        )
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium">Delete Fitness Plan</Dialog.Title>
            <Dialog.Description className="mt-2">
              Are you sure you want to delete this fitness plan? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={() => {
                  if (planToDelete) {
                    handleDeletePlan(planToDelete);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Create New Plan Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Create New Fitness Plan</Dialog.Title>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handleCreatePlan()
            }} className="mt-4 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newPlan.title || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value as FitnessCategory })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="weight-gain">Weight Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="endurance">Endurance</option>
                  </select>
                  {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newPlan.description || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    value={newPlan.level}
                    onChange={(e) => setNewPlan({ ...newPlan, level: e.target.value as FitnessLevel })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {formErrors.level && <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.duration || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Weekly Workouts</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.weekly_workouts || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, weekly_workouts: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.weekly_workouts && <p className="mt-1 text-sm text-red-600">{formErrors.weekly_workouts}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newPlan.difficulty || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, difficulty: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.difficulty && <p className="mt-1 text-sm text-red-600">{formErrors.difficulty}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newPlan.status}
                    onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value as 'draft' | 'published' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Arrays */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
                  <div className="space-y-2">
                    {(newPlan.prerequisites || []).map((prereq, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => {
                            const newPrereqs = [...(newPlan.prerequisites || [])]
                            newPrereqs[index] = e.target.value
                            setNewPlan({ ...newPlan, prerequisites: newPrereqs })
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPrereqs = (newPlan.prerequisites || []).filter((_, i) => i !== index)
                            setNewPlan({ ...newPlan, prerequisites: newPrereqs })
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewPlan({ ...newPlan, prerequisites: [...(newPlan.prerequisites || []), ''] })}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      + Add Prerequisite
                    </button>
                  </div>
                  {formErrors.prerequisites && <p className="mt-1 text-sm text-red-600">{formErrors.prerequisites}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment</label>
                  <div className="space-y-2">
                    {(newPlan.equipment || []).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newEquipment = [...(newPlan.equipment || [])]
                            newEquipment[index] = e.target.value
                            setNewPlan({ ...newPlan, equipment: newEquipment })
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newEquipment = (newPlan.equipment || []).filter((_, i) => i !== index)
                            setNewPlan({ ...newPlan, equipment: newEquipment })
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewPlan({ ...newPlan, equipment: [...(newPlan.equipment || []), ''] })}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      + Add Equipment
                    </button>
                  </div>
                  {formErrors.equipment && <p className="mt-1 text-sm text-red-600">{formErrors.equipment}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Goals</label>
                  <div className="space-y-2">
                    {(newPlan.goals || []).map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...(newPlan.goals || [])]
                            newGoals[index] = e.target.value
                            setNewPlan({ ...newPlan, goals: newGoals })
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGoals = (newPlan.goals || []).filter((_, i) => i !== index)
                            setNewPlan({ ...newPlan, goals: newGoals })
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewPlan({ ...newPlan, goals: [...(newPlan.goals || []), ''] })}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      + Add Goal
                    </button>
                  </div>
                  {formErrors.goals && <p className="mt-1 text-sm text-red-600">{formErrors.goals}</p>}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Schedule</h3>
                {(newPlan.schedule || []).map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-md font-medium">Day {day.day}</h4>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.restDay}
                            onChange={(e) => {
                              const newSchedule = [...(newPlan.schedule || [])]
                              newSchedule[dayIndex] = { ...day, restDay: e.target.checked }
                              setNewPlan({ ...newPlan, schedule: newSchedule })
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-600">Rest Day</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDay('new', dayIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {!day.restDay && (
                      <div className="space-y-3">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <div key={exercise.id} className="border rounded-md p-3 bg-white">
                            <div className="flex justify-between items-center mb-2">
                              <input
                                type="text"
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'name', e.target.value)}
                                placeholder="Exercise name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise('new', dayIndex, exerciseIndex)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <textarea
                                value={exercise.description}
                                onChange={(e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'description', e.target.value)}
                                placeholder="Exercise description"
                                rows={2}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              />

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Steps</label>
                                {exercise.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-center space-x-2 mt-1">
                                    <input
                                      type="text"
                                      value={step}
                                      onChange={(e) => {
                                        const newSteps = [...exercise.steps]
                                        newSteps[stepIndex] = e.target.value
                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps)
                                      }}
                                      placeholder={`Step ${stepIndex + 1}`}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSteps = exercise.steps.filter((_, i) => i !== stepIndex)
                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps)
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSteps = [...exercise.steps, '']
                                    handleExerciseChange('new', dayIndex, exerciseIndex, 'steps', newSteps)
                                  }}
                                  className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                  + Add Step
                                </button>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Target Muscles</label>
                                {exercise.targetMuscles.map((muscle, muscleIndex) => (
                                  <div key={muscleIndex} className="flex items-center space-x-2 mt-1">
                                    <input
                                      type="text"
                                      value={muscle}
                                      onChange={(e) => {
                                        const newMuscles = [...exercise.targetMuscles]
                                        newMuscles[muscleIndex] = e.target.value
                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles)
                                      }}
                                      placeholder="Target muscle"
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newMuscles = exercise.targetMuscles.filter((_, i) => i !== muscleIndex)
                                        handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles)
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMuscles = [...exercise.targetMuscles, '']
                                    handleExerciseChange('new', dayIndex, exerciseIndex, 'targetMuscles', newMuscles)
                                  }}
                                  className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                  + Add Target Muscle
                                </button>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                <select
                                  value={exercise.difficulty}
                                  onChange={(e) => handleExerciseChange('new', dayIndex, exerciseIndex, 'difficulty', e.target.value as FitnessLevel)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                  <option value="beginner">Beginner</option>
                                  <option value="intermediate">Intermediate</option>
                                  <option value="advanced">Advanced</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddExercise('new', dayIndex)}
                          className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                        >
                          + Add Exercise
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddDay('new')}
                  className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                >
                  + Add Day
                </button>
                {formErrors.schedule && <p className="mt-1 text-sm text-red-600">{formErrors.schedule}</p>}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">Edit Fitness Plan</Dialog.Title>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {editingPlan && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditPlan(editingPlan);
              }} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingPlan.title}
                    onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingPlan.description || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={editingPlan.category}
                      onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value as FitnessCategory })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="flexibility">Flexibility</option>
                    </select>
                    {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      value={editingPlan.level}
                      onChange={(e) => setEditingPlan({ ...editingPlan, level: e.target.value as FitnessLevel })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {formErrors.level && <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input
                      type="text"
                      value={editingPlan.duration}
                      onChange={(e) => setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {formErrors.duration && <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editingPlan.status}
                      onChange={(e) => setEditingPlan({ ...editingPlan, status: e.target.value as "draft" | "published" })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Exercise List Section (Edit) */}
                 <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Exercises</h3>
                {(editingPlan.schedule || []).map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium">Day {dayIndex + 1}</h4>
                      <button type="button" onClick={() => handleRemoveDay('edit', dayIndex)}>
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Exercises</label>
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange('edit', dayIndex, exerciseIndex, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          <button type="button" onClick={() => handleRemoveExercise('edit', dayIndex, exerciseIndex)}>
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddExercise('edit', dayIndex)}
                        className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        + Add Exercise
                      </button>
                    </div>
                  </div>
                ))}
                 <button
                  type="button"
                  onClick={() => handleAddDay('edit')}
                  className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                >
                  + Add Day
                </button>
              </div>


                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Fitness Plans</h2>
          <Button
            className="flex items-center"
            onClick={() => {
              setIsCreateModalOpen(true)
              setNewPlan({
                title: '',
                description: '',
                category: 'weight-loss',
                level: 'beginner',
                duration: 30,
                weekly_workouts: 3,
                difficulty: 1,
                prerequisites: [],
                equipment: [],
                goals: [],
                schedule: [],
                status: 'draft'
              })
              setFormErrors({})
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search fitness plans..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 sr-only">Category Filter</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as FitnessCategory | "all")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="weight-gain">Weight Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="endurance">Endurance</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 sr-only">Level Filter</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as FitnessLevel | "all")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 sr-only">Status Filter</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as "all" | "draft" | "published")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Plans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workouts/Week</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plan.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                        plan.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        plan.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.duration} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.weekly_workouts} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            setEditingPlan(plan)
                            setIsEditModalOpen(true)
                            setFormErrors({})
                          }}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(plan.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPlans.length === 0 && !isLoading && (
            <div className="px-6 py-4 text-center text-gray-500">No fitness plans found matching your criteria.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default AdminFitness
