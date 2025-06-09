"use client"

import { useState, useEffect } from "react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { Plus, Edit, Trash2, Save, X, Dumbbell, UtensilsCrossed } from "lucide-react"
import { FitnessPlanService } from "../../services/FitnessPlanService"
import { FitnessPlan } from "../../models/FitnessPlan"
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
    setCurrentPlan({
      user_id: user?.id || null,
      name: "",
      plan_type: "",
      duration: "",
      description: "",
      status: "draft",
    })
    setShowAddForm(true)
  }

  const handleEditClick = (plan: FitnessPlan) => {
    setCurrentPlan({
      user_id: plan.user_id,
      name: plan.name,
      plan_type: plan.plan_type,
      duration: plan.duration,
      description: plan.description,
      status: plan.status,
    })
    setShowAddForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPlan) return

    setIsSaving(true)
    setError(null)
    try {
      if ((currentPlan as FitnessPlan).id) {
        // Update existing plan
        await fitnessPlanService.updateFitnessPlan((currentPlan as FitnessPlan).id, currentPlan)
      } else {
        // Create new plan
        await fitnessPlanService.createFitnessPlan(currentPlan)
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
              {currentPlan.name ? "Edit Fitness Plan" : "Add New Fitness Plan"}
            </h3>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentPlan.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="plan_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Type (e.g., Weight Gain, Weight Loss)
                  </label>
                  <input
                    type="text"
                    id="plan_type"
                    name="plan_type"
                    value={currentPlan.plan_type}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (e.g., 6 days/week, 4 weeks)
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={currentPlan.duration}
                  onChange={handleFormChange}
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={currentPlan.status}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  leftIcon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Save size={16} />} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Plan"}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}

      {/* List of Fitness Plans */}
      <Card>
        <Card.Body className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Fitness Plans</h3>
          {plans.length === 0 && !isLoading && !error ? (
            <div className="text-center text-gray-500 py-8">No fitness plans found. Add one above!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.plan_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {plan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" leftIcon={<Edit size={16} />} onClick={() => handleEditClick(plan)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<Trash2 size={16} />} onClick={() => handleDelete(plan.id)} className="text-red-600">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminFitnessPlans