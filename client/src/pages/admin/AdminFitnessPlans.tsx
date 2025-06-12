"use client"

import { useState, useEffect } from "react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { Plus, Edit, Trash2, Save, X, Dumbbell, UtensilsCrossed } from "lucide-react"
import { FitnessPlanService } from "../../services/FitnessPlanService"
import { FitnessPlan, FitnessCategory, FitnessLevel } from "../../types/content"
import { useAuth } from "../../contexts/AuthContext"

const AdminFitnessPlans = () => {
  const [plans, setPlans] = useState<FitnessPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Omit<FitnessPlan, 'id' | 'created_at'> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()

  const fitnessPlanService = FitnessPlanService.getInstance()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedPlans = await fitnessPlanService.getFitnessPlans()
      setPlans(fetchedPlans)
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

  const handleAddClick = () => {
    setCurrentPlan(new FitnessPlan({
      user_id: user?.id || null,
      title: "",
      description: "",
      category: "weight-loss", // Default category
      level: "beginner",      // Default level
      duration: 0,            // Default duration as number
      weekly_workouts: 0,
      difficulty: 0,
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
    setShowAddForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPlan) return

    setIsSaving(true)
    setError(null)
    try {
      if (currentPlan.id) {
        // Update existing plan
        await fitnessPlanService.updateFitnessPlan(currentPlan.id, currentPlan)
      } else {
        // Create new plan
        const newPlanInstance = new FitnessPlan({
          ...currentPlan,
          user_id: user?.id || null, // Ensure user_id is set
          created_at: new Date().toISOString(), // Ensure created_at is set for new plans
        })
        await fitnessPlanService.createFitnessPlan(newPlanInstance)
      }
      setShowAddForm(false)
      await fetchPlans() // Re-fetch to show updated list
    } catch (err: any) {
      console.error("Error saving fitness plan:", err)
      setError("Failed to save plan: " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this fitness plan?")) return

    setIsLoading(true) // Use global loading for delete
    setError(null)
    try {
      await fitnessPlanService.deleteFitnessPlan(planId)
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Fitness Plans Management</h2>
        <Button onClick={handleAddClick} leftIcon={<Plus size={16} />}>
          Add New Plan
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
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
                    {Object.values(FitnessCategory).map((cat) => (
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
                  {Object.values(FitnessLevel).map((lvl) => (
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