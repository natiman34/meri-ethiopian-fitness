"use client"

import { useState, useEffect } from "react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import {
  Plus, Edit, Trash2, Save, X, Dumbbell, Upload, Link as LinkIcon,
  Image as ImageIcon, Play, Eye, Calendar, Clock, Target, Users,
  FileText, BarChart3, Settings, AlertCircle, CheckCircle
} from "lucide-react"
import { FitnessPlanService } from "../../services/FitnessPlanService"
import { FitnessPlan, FitnessCategory, FitnessLevel, Exercise, DaySchedule } from "../../types/content"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"

const FITNESS_CATEGORIES = [
  'weight-loss', 'weight-gain', 'maintenance', 'strength', 'flexibility', 'endurance',
  'muscle-building', 'powerlifting', 'bodybuilding', 'functional', 'beginner', 'home',
  'gym', 'men', 'women', 'fat-burning', 'leg',
];
const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced'];

const AdminFitnessPlans = () => {
  const [plans, setPlans] = useState<FitnessPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Omit<FitnessPlan, 'id' | 'created_at'> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage'>('overview')
  const [uploadingFile, setUploadingFile] = useState<'image' | 'thumbnail' | 'full' | null>(null)
  const [previewUrls, setPreviewUrls] = useState<{
    image?: string;
    thumbnail?: string;
    full?: string;
  }>({})
  const { user } = useAuth()

  const fitnessPlanService = FitnessPlanService.getInstance()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Try to fetch from Supabase database first
      try {
        const databasePlans = await fitnessPlanService.getFitnessPlans()
        setPlans(databasePlans)
      } catch (dbError) {
        console.warn("Database fetch failed, using local data:", dbError)
        // Fallback to local data if database is not available
        const localPlans = await fitnessPlanService.getFitnessPlans()
        setPlans(localPlans)
      }
    } catch (err: any) {
      console.error("Error fetching fitness plans:", err)
      setError("Failed to load fitness plans: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentPlan((prev) => ({
      ...prev!,
      [name]: value,
    }))
  }

  // File upload handlers
  const handleFileUpload = async (file: File, type: 'image' | 'thumbnail' | 'full') => {
    if (!currentPlan) return

    setUploadingFile(type)
    setError(null)

    try {
      // Validate file
      if (type === 'image' && !file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }
      if ((type === 'thumbnail' || type === 'full') && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('Please select an image or GIF file')
      }

      // Check file size (max 10MB for GIFs, 5MB for images)
      const maxSize = (type === 'thumbnail' || type === 'full') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      }

      const planId = currentPlan.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      let uploadedUrl: string

      if (type === 'image') {
        uploadedUrl = await fitnessPlanService.uploadImage(file, planId)
        setCurrentPlan(prev => ({ ...prev!, image_url: uploadedUrl }))
      } else if (type === 'thumbnail') {
        uploadedUrl = await fitnessPlanService.uploadGif(file, planId, 'thumbnail')
        setCurrentPlan(prev => ({ ...prev!, thumbnail_gif_url: uploadedUrl }))
      } else {
        uploadedUrl = await fitnessPlanService.uploadGif(file, planId, 'full')
        setCurrentPlan(prev => ({ ...prev!, full_gif_url: uploadedUrl }))
      }

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrls(prev => ({ ...prev, [type]: previewUrl }))

      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`)
    } catch (err: any) {
      console.error(`Error uploading ${type}:`, err)
      setError(`Failed to upload ${type}: ${err.message}`)
    } finally {
      setUploadingFile(null)
    }
  }

  const handleUrlInput = (url: string, type: 'image' | 'thumbnail' | 'full') => {
    if (!currentPlan) return

    if (type === 'image') {
      setCurrentPlan(prev => ({ ...prev!, image_url: url }))
    } else if (type === 'thumbnail') {
      setCurrentPlan(prev => ({ ...prev!, thumbnail_gif_url: url }))
    } else {
      setCurrentPlan(prev => ({ ...prev!, full_gif_url: url }))
    }

    setPreviewUrls(prev => ({ ...prev, [type]: url }))
  }

  const handleAddClick = () => {
    setCurrentPlan(new FitnessPlan({
      user_id: user?.id || null,
      title: "",
      description: "",
      category: "weight-loss", // Default category
      level: "beginner",      // Default level
      duration: 4,            // Default duration as number
      weekly_workouts: 3,
      difficulty: 1,
      prerequisites: [],
      equipment: [],
      goals: [],
      schedule: [],
      status: "draft",
      tags: [],
      featured: false,
      muscleGroups: [],
      equipmentRequired: [],
      intensity: "low",
      created_at: new Date().toISOString(),
    }))
    setPreviewUrls({})
    setActiveTab('create')
    setShowAddForm(true)
  }

  const handleEditClick = (plan: FitnessPlan) => {
    setCurrentPlan(new FitnessPlan({
      ...plan,
      user_id: plan.user_id,
      title: plan.title,
      category: plan.category,
      duration: plan.duration,
      description: plan.description,
      status: plan.status,
      // Ensure all properties are copied or defaulted if missing
      level: plan.level || "beginner",
      weekly_workouts: plan.weekly_workouts || 0,
      difficulty: plan.difficulty || 0,
      prerequisites: plan.prerequisites || [],
      equipment: plan.equipment || [],
      goals: plan.goals || [],
      schedule: plan.schedule || [],
      tags: plan.tags || [],
      featured: plan.featured || false,
      muscleGroups: plan.muscleGroups || [],
      equipmentRequired: plan.equipmentRequired || [],
      intensity: plan.intensity || "low",
      created_at: plan.created_at || new Date().toISOString(),
    }))

    // Set preview URLs for existing media
    setPreviewUrls({
      image: plan.image_url,
      thumbnail: plan.thumbnail_gif_url,
      full: plan.full_gif_url
    })

    setActiveTab('create')
    setShowAddForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPlan) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if ('id' in currentPlan && currentPlan.id) {
        // Update existing plan - try database first, fallback to local
        try {
          const { id, ...planData } = currentPlan;
          await fitnessPlanService.updateFitnessPlan(id as string, planData)
          setSuccess("Fitness plan updated successfully!")
        } catch (dbError) {
          console.warn("Database update failed, using local update:", dbError)
          await fitnessPlanService.updateFitnessPlan(currentPlan.id as string, currentPlan)
          setSuccess("Fitness plan updated successfully locally!")
        }
      } else {
        // Create new plan - try database first, fallback to local
        try {
          // Check for duplicates first
          const exists = await fitnessPlanService.checkFitnessPlanExists(
            currentPlan.title?.trim() || '',
            currentPlan.category,
            currentPlan.level
          );

          if (exists) {
            throw new Error(`A fitness plan with the title "${currentPlan.title}" already exists in ${currentPlan.category} category at ${currentPlan.level} level. Please choose a different title.`);
          }

          await fitnessPlanService.createFitnessPlan(currentPlan)
          setSuccess("Fitness plan created successfully!")
        } catch (dbError: any) {
          console.warn("Database create failed:", dbError)
          setError(dbError.message || "Failed to create fitness plan")
          return
        }
      }

      setShowAddForm(false)
      setActiveTab('overview')
      setPreviewUrls({})
      await fetchPlans() // Re-fetch to show updated list
    } catch (err: any) {
      console.error("Error saving fitness plan:", err)
      setError("Failed to save plan: " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this fitness plan? This action cannot be undone.")) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Try database delete first, fallback to local
      try {
        await fitnessPlanService.deleteFitnessPlan(planId)
        setSuccess("Fitness plan deleted successfully!")
      } catch (dbError) {
        console.warn("Database delete failed, using local delete:", dbError)
        await fitnessPlanService.deleteFitnessPlan(planId)
        setSuccess("Fitness plan deleted successfully locally!")
      }

      setPlans(plans.filter((plan) => plan.id !== planId)) // Optimistic update
    } catch (err: any) {
      console.error("Error deleting fitness plan:", err)
      setError("Failed to delete plan: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Dumbbell className="h-6 w-6 text-green-600 mr-3" />
            Admin Fitness Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Manage fitness plans with Supabase integration and GIF uploads</p>
        </div>
        <Button
          onClick={handleAddClick}
          leftIcon={<Plus size={16} />}
          className="bg-green-600 hover:bg-green-700"
        >
          Create New Plan
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'manage'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Plans
        </button>
      </div>

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
      {isLoading && activeTab === 'overview' && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          Loading fitness plans...
        </div>
      )}

      {showAddForm && currentPlan && (
        <Card className="mb-6">
          <Card.Body className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentPlan.title ? "Edit Fitness Plan" : "Add New Fitness Plan"}
            </h3>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentPlan.title}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentPlan.category}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    {FITNESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={currentPlan.level}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  {FITNESS_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (in weeks)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={currentPlan.duration}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, duration: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Plan Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
                  value={currentPlan.description}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="weekly_workouts" className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Workouts
                </label>
                <input
                  type="number"
                  id="weekly_workouts"
                  name="weekly_workouts"
                  value={currentPlan.weekly_workouts}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, weekly_workouts: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty (1-5)
                </label>
                <input
                  type="number"
                  id="difficulty"
                  name="difficulty"
                  value={currentPlan.difficulty}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, difficulty: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="target_audience"
                  name="target_audience"
                  value={currentPlan.target_audience || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-1">
                  Prerequisites (comma separated)
                </label>
                <input
                  type="text"
                  id="prerequisites"
                  name="prerequisites"
                  value={currentPlan.prerequisites.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, prerequisites: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment (comma separated)
                </label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={currentPlan.equipment.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, equipment: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                  Goals (comma separated)
                </label>
                <input
                  type="text"
                  id="goals"
                  name="goals"
                  value={currentPlan.goals.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, goals: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={currentPlan.tags.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, tags: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={currentPlan.image_url || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="thumbnail_gif_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail GIF URL
                </label>
                <input
                  type="text"
                  id="thumbnail_gif_url"
                  name="thumbnail_gif_url"
                  value={currentPlan.thumbnail_gif_url || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="full_gif_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Full GIF URL
                </label>
                <input
                  type="text"
                  id="full_gif_url"
                  name="full_gif_url"
                  value={currentPlan.full_gif_url || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={currentPlan.status}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={currentPlan.featured}
                    onChange={(e) => setCurrentPlan(prev => ({ ...prev!, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  Featured Plan
                </label>
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={currentPlan.rating || ''}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, rating: parseFloat(e.target.value) || undefined }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Count
                </label>
                <input
                  type="number"
                  id="reviewCount"
                  name="reviewCount"
                  value={currentPlan.reviewCount || ''}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, reviewCount: parseInt(e.target.value) || undefined }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="completionRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Rate (%)
                </label>
                <input
                  type="number"
                  id="completionRate"
                  name="completionRate"
                  value={currentPlan.completionRate || ''}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, completionRate: parseInt(e.target.value) || undefined }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  min="0"
                  max="100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="averageWorkoutTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Workout Time (minutes)
                </label>
                <input
                  type="number"
                  id="averageWorkoutTime"
                  name="averageWorkoutTime"
                  value={currentPlan.averageWorkoutTime || ''}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, averageWorkoutTime: parseInt(e.target.value) || undefined }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="muscleGroups" className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Groups (comma separated)
                </label>
                <input
                  type="text"
                  id="muscleGroups"
                  name="muscleGroups"
                  value={currentPlan.muscleGroups.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, muscleGroups: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="equipmentRequired" className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Required (comma separated)
                </label>
                <input
                  type="text"
                  id="equipmentRequired"
                  name="equipmentRequired"
                  value={currentPlan.equipmentRequired.join(',')}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev!, equipmentRequired: e.target.value.split(',').map(item => item.trim()) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Day
                </label>
                <select
                  id="timeOfDay"
                  name="timeOfDay"
                  value={currentPlan.timeOfDay || 'any'}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="any">Any</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={currentPlan.location || 'any'}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="any">Any</option>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="intensity" className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity
                </label>
                <select
                  id="intensity"
                  name="intensity"
                  value={currentPlan.intensity}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  leftIcon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} leftIcon={<Save size={16} />}>
                  {isSaving ? "Saving..." : "Save Plan"}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Fitness Plans</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.duration} weeks</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(plan)}
                        leftIcon={<Edit size={16} />}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        leftIcon={<Trash2 size={16} />}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && !isLoading && !error && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No fitness plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminFitnessPlans