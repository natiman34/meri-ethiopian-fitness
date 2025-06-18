"use client"

import { useState, useEffect } from "react"
import {
  Plus, Edit, Trash2, Save, X, Dumbbell, Upload,
  Image as ImageIcon, Eye, Calendar, Clock,
  Target, Users, FileText, BarChart3, Settings,
  AlertCircle, CheckCircle, Search,
  Filter, RefreshCw, ExternalLink, Copy, Download
} from "lucide-react"
import { FitnessPlan } from "../../types/content"

// Type definitions for better compatibility
type FitnessCategoryType = 'weight-loss' | 'weight-gain' | 'maintenance' | 'strength' | 'flexibility' | 'endurance' | 'muscle-building' | 'functional'
type FitnessLevelType = 'beginner' | 'intermediate' | 'advanced'
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Dialog } from "@headlessui/react"
import { ActivityLogService } from "../../services/ActivityLogService"

const EnhancedFitnessDashboard = () => {
  const [plans, setPlans] = useState<FitnessPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<FitnessPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Partial<FitnessPlan> | null>(null)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState<'image' | null>(null)
  const [previewUrls, setPreviewUrls] = useState<{
    image?: string;
  }>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | FitnessCategoryType>('all')
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchPlans()
  }, [])

  useEffect(() => {
    // Filter plans based on search and filters
    let filtered = plans

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(plan => plan.category === categoryFilter)
    }

    setFilteredPlans(filtered)
  }, [plans, searchTerm, statusFilter, categoryFilter])

  // Check admin permissions
  useEffect(() => {
    if (!isAdmin) {
      setError('You do not have permission to access this dashboard.')
    }
  }, [isAdmin])

  const fetchPlans = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPlans(data?.map(plan => new FitnessPlan(plan)) || [])
    } catch (err: any) {
      console.error("Error fetching fitness plans:", err)
      setError("Failed to load fitness plans: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const testStorageConnection = async () => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) throw error
      console.log('Available buckets:', buckets)

      const fitnessAssetsBucket = buckets.find(bucket => bucket.id === 'fitness-assets')
      if (fitnessAssetsBucket) {
        console.log('✅ fitness-assets bucket found:', fitnessAssetsBucket)
        setSuccess('Storage connection verified')
      } else {
        console.error('❌ fitness-assets bucket not found')
        setError('Storage bucket not found')
      }
    } catch (err: any) {
      console.error('Storage test failed:', err)
      setError('Storage connection failed: ' + err.message)
    }
  }



  const handleFileUpload = async (file: File, type: 'image') => {
    try {
      setUploadingFile(type)
      setError(null) // Clear any previous errors

      // Validate file
      if (!file) {
        throw new Error('No file selected')
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please select a JPEG, PNG, or WebP image')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `fitness-plans/${type}/${fileName}`

      console.log(`Uploading ${type} to:`, filePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fitness-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload successful:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('fitness-assets')
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl)

      setPreviewUrls(prev => ({
        ...prev,
        [type]: publicUrl
      }))

      setCurrentPlan(prev => ({
        ...prev,
        [`${type}_url`]: publicUrl
      }))

      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`)
    } catch (err: any) {
      console.error(`Error uploading ${type}:`, err)
      setError(`Failed to upload ${type}: ${err.message || 'Unknown error occurred'}`)
    } finally {
      setUploadingFile(null)
    }
  }

  const handleCreatePlan = async () => {
    if (!currentPlan) return

    // Basic validation
    if (!currentPlan.title || !currentPlan.description || !currentPlan.category || !currentPlan.level) {
      setError('Please fill in all required fields (title, description, category, level)')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Get current user for RLS policy compliance
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }
      const planToInsert = {
        // Required fields for the existing table structure
        name: currentPlan.title, // Map title to name (required field)
        description: currentPlan.description,
        duration: currentPlan.duration?.toString() || '30', // Convert to string as expected by table
        plan_type: currentPlan.category || 'weight-loss', // Map category to plan_type (required field)
        exercise_list: currentPlan.schedule || [], // Map schedule to exercise_list (required field)
        difficulty_level: currentPlan.level || 'beginner', // Map level to difficulty_level

        // Additional fields we added
        title: currentPlan.title,
        category: currentPlan.category,
        level: currentPlan.level,
        weekly_workouts: currentPlan.weekly_workouts,
        difficulty: currentPlan.difficulty,
        prerequisites: currentPlan.prerequisites || [],
        equipment: currentPlan.equipment || [],
        goals: currentPlan.goals || [],
        schedule: currentPlan.schedule || [],
        status: currentPlan.status || 'published', // Default to published
        tags: currentPlan.tags || [],
        featured: currentPlan.featured || false,
        muscle_groups: currentPlan.muscle_groups || [],
        equipment_required: currentPlan.equipment_required || [],
        time_of_day: currentPlan.time_of_day,
        location: currentPlan.location,
        intensity: currentPlan.intensity,
        image_url: currentPlan.image_url,
        user_id: user?.id,
        planner_id: user?.id // Map user_id to planner_id as well
      }

      console.log('Creating plan with data:', planToInsert)

      // Try insert without select first (more reliable)
      const { error: insertError } = await supabase
        .from('fitness_plans')
        .insert([planToInsert])

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw insertError
      }

      // Insert was successful, fetch the latest plan to get the ID
      const { data: latestPlans, error: fetchError } = await supabase
        .from('fitness_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (!fetchError && latestPlans && latestPlans.length > 0) {
        console.log('Plan created successfully:', latestPlans[0])
        setPlans([new FitnessPlan(latestPlans[0]), ...plans])
      } else {
        // Create a temporary plan object for display
        const tempPlan = new FitnessPlan({
          ...planToInsert,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        })
        setPlans([tempPlan, ...plans])
      }

      setIsCreateModalOpen(false)
      setCurrentPlan(null)
      setPreviewUrls({})
      setSuccess('Fitness plan created successfully')

      // Log the activity
      await ActivityLogService.logFitnessAction(
        'New fitness plan created',
        `${currentPlan.title} added`,
        user?.id
      )

      await ActivityLogService.logAdminActivity(
        user?.id || '',
        'CREATE_FITNESS_PLAN',
        {
          resource: 'fitness_plan',
          resourceId: latestPlans?.[0]?.id || 'unknown',
          planTitle: currentPlan.title,
          planCategory: currentPlan.category,
          planLevel: currentPlan.level
        }
      )
    } catch (err: any) {
      console.error('Error creating fitness plan:', err)
      setError('Failed to create fitness plan: ' + (err.message || err.details || JSON.stringify(err)))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPlan = async () => {
    if (!currentPlan?.id) {
      setError('No plan selected for editing')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // First, verify the plan exists
      const { data: existingPlan, error: checkError } = await supabase
        .from('fitness_plans')
        .select('id')
        .eq('id', currentPlan.id)
        .single()

      if (checkError || !existingPlan) {
        throw new Error('Plan not found or multiple plans with same ID')
      }

      // Get current user for RLS policy compliance
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const planToUpdate = {
        // Core required fields
        name: currentPlan.title || '',
        description: currentPlan.description || '',
        duration: currentPlan.duration?.toString() || '30',
        plan_type: currentPlan.category || 'weight-loss',
        exercise_list: currentPlan.schedule || [],
        difficulty_level: currentPlan.level || 'beginner',

        // Additional fields
        title: currentPlan.title || '',
        category: currentPlan.category || 'weight-loss',
        level: currentPlan.level || 'beginner',
        weekly_workouts: currentPlan.weekly_workouts || 3,
        difficulty: currentPlan.difficulty || 1,
        prerequisites: currentPlan.prerequisites || [],
        equipment: currentPlan.equipment || [],
        goals: currentPlan.goals || [],
        schedule: currentPlan.schedule || [],
        status: currentPlan.status || 'draft',
        tags: currentPlan.tags || [],
        featured: currentPlan.featured || false,
        muscle_groups: currentPlan.muscle_groups || [],
        equipment_required: currentPlan.equipment_required || [],
        time_of_day: currentPlan.time_of_day || 'any',
        location: currentPlan.location || 'any',
        intensity: currentPlan.intensity || 'low',
        image_url: currentPlan.image_url || null,
        updated_at: new Date().toISOString(),
        // Ensure user_id is set for RLS policy compliance
        user_id: user.id
      }

      // Try update without select first (more reliable)
      const { error: updateError } = await supabase
        .from('fitness_plans')
        .update(planToUpdate)
        .eq('id', currentPlan.id)

      if (updateError) throw updateError

      // Update was successful, now fetch the updated plan
      const { data: updatedPlan, error: fetchError } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('id', currentPlan.id)
        .single()

      if (fetchError) {
        console.error('Error fetching updated plan:', fetchError)
        // Update with merged data as fallback
        const mergedPlan = { ...currentPlan, ...planToUpdate }
        setPlans(plans.map(p => p.id === currentPlan.id ? new FitnessPlan(mergedPlan) : p))
      } else {
        // Use the fetched updated plan
        setPlans(plans.map(p => p.id === currentPlan.id ? new FitnessPlan(updatedPlan) : p))
      }

      setIsEditModalOpen(false)
      setCurrentPlan(null)
      setPreviewUrls({})
      setSuccess('Fitness plan updated successfully')

      // Log the activity
      await ActivityLogService.logFitnessAction(
        'Fitness plan updated',
        `${currentPlan.title} modified`,
        user?.id
      )

      await ActivityLogService.logAdminActivity(
        user?.id || '',
        'UPDATE_FITNESS_PLAN',
        {
          resource: 'fitness_plan',
          resourceId: currentPlan.id,
          planTitle: currentPlan.title,
          planCategory: currentPlan.category,
          planLevel: currentPlan.level
        }
      )
    } catch (err: any) {
      console.error('Error updating fitness plan:', err)
      setError('Failed to update fitness plan: ' + (err.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlan = async () => {
    if (!planToDelete) return

    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('fitness_plans')
        .delete()
        .eq('id', planToDelete)

      if (error) throw error

      // Get plan details before deletion for logging
      const deletedPlan = plans.find(p => p.id === planToDelete)

      setPlans(plans.filter(p => p.id !== planToDelete))
      setIsDeleteModalOpen(false)
      setPlanToDelete(null)
      setSuccess('Fitness plan deleted successfully')

      // Log the activity
      await ActivityLogService.logFitnessAction(
        'Fitness plan deleted',
        `${deletedPlan?.title || 'Unknown plan'} removed`,
        user?.id
      )

      await ActivityLogService.logAdminActivity(
        user?.id || '',
        'DELETE_FITNESS_PLAN',
        {
          resource: 'fitness_plan',
          resourceId: planToDelete,
          planTitle: deletedPlan?.title || 'Unknown',
          planCategory: deletedPlan?.category || 'Unknown'
        }
      )
    } catch (err: any) {
      console.error('Error deleting fitness plan:', err)
      setError('Failed to delete fitness plan: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <Button
            onClick={fetchPlans}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setCurrentPlan({
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
                status: 'published', // Default to published so it shows in main UI
                tags: [],
                featured: false,
                muscle_groups: [],
                equipment_required: [],
                time_of_day: 'any',
                location: 'any',
                intensity: 'low'
              })
              setIsCreateModalOpen(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search plans by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | FitnessCategoryType)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="weight-gain">Weight Gain</option>
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="muscle-building">Muscle Building</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredPlans.length} of {plans.length} plans
          </div>
        </Card.Body>
      </Card>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Plans Table */}
      <Card>
        <Card.Body className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                          Loading plans...
                        </div>
                      ) : (
                        <div>
                          <Dumbbell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          {plans.length === 0 ? 'No fitness plans found. Create your first plan!' : 'No plans match your search criteria.'}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                  <tr key={plan.id}>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={async () => {
                          try {
                            const newStatus = plan.status === 'published' ? 'draft' : 'published'
                            const { error } = await supabase
                              .from('fitness_plans')
                              .update({ status: newStatus })
                              .eq('id', plan.id)

                            if (error) throw error

                            // Update local state
                            setPlans(plans.map(p => p.id === plan.id ? { ...p, status: newStatus } : p))
                            setSuccess(`Plan ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
                          } catch (err: any) {
                            setError('Failed to update status: ' + err.message)
                          }
                        }}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                          plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                        title={`Click to ${plan.status === 'published' ? 'unpublish' : 'publish'}`}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {plan.image_url && (
                          <button
                            onClick={() => window.open(plan.image_url, '_blank')}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Image"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </button>
                        )}
                        {!plan.image_url && (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => window.open(`/services/fitness-plans/${plan.id}?hideActions=true`, '_blank')}
                          className="text-green-600 hover:text-green-900"
                          title="Preview without sidebar elements"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPlan(plan)
                            setIsEditModalOpen(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setPlanToDelete(plan.id)
                            setIsDeleteModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
          setCurrentPlan(null)
          setPreviewUrls({})
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                {isCreateModalOpen ? 'Create New Fitness Plan' : 'Edit Fitness Plan'}
              </Dialog.Title>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setIsEditModalOpen(false)
                  setCurrentPlan(null)
                  setPreviewUrls({})
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              isCreateModalOpen ? handleCreatePlan() : handleEditPlan()
            }}>
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={currentPlan?.title || ''}
                      onChange={(e) => setCurrentPlan(prev => ({ ...prev!, title: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={currentPlan?.category || 'weight-loss'}
                      onChange={(e) => setCurrentPlan(prev => ({ ...prev!, category: e.target.value as FitnessCategoryType }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="weight-loss">Weight Loss</option>
                      <option value="weight-gain">Weight Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="strength">Strength</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="endurance">Endurance</option>
                      <option value="muscle-building">Muscle Building</option>
                      <option value="functional">Functional</option>
                    </select>
                  </div>
                </div>

                {/* Media Upload Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Media Upload</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan Image</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                              <span>Upload Image</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload(file, 'image')
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      {previewUrls.image && (
                        <img src={previewUrls.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      value={currentPlan?.level || 'beginner'}
                      onChange={(e) => setCurrentPlan(prev => ({ ...prev!, level: e.target.value as FitnessLevelType }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={currentPlan?.status || 'draft'}
                      onChange={(e) => setCurrentPlan(prev => ({ ...prev!, status: e.target.value as 'draft' | 'published' }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={currentPlan?.description || ''}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, description: e.target.value }))}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      setIsEditModalOpen(false)
                      setCurrentPlan(null)
                      setPreviewUrls({})
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Saving...' : isCreateModalOpen ? 'Create Plan' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium">Delete Fitness Plan</Dialog.Title>
            <Dialog.Description className="mt-2">
              Are you sure you want to delete this fitness plan? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeletePlan}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>


    </div>
  )
}

export default EnhancedFitnessDashboard 