import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Dumbbell, Utensils, MessageSquare } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import { ActivityLogService } from "../../services/ActivityLogService"

interface DashboardStats {
  totalUsers: number
  totalFitnessPlans: number
  totalNutritionPlans: number
  totalFeedback: number
  userGrowth: number
  fitnessPlanGrowth: number
  nutritionPlanGrowth: number
  feedbackGrowth: number
}

interface GrowthData {
  name: string
  users: number
  fitnessPlans: number
  nutritionPlans: number
}

interface RecentActivity {
  id: string
  type: "user" | "fitness" | "nutrition" | "feedback"
  title: string
  description: string
  timestamp: string
}

const AdminOverview = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [growthData, setGrowthData] = useState<GrowthData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch dashboard stats
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_dashboard_stats')

        if (statsError) throw statsError
        setStats(statsData)

        // Fetch growth data
        const { data: growthData, error: growthError } = await supabase
          .rpc('get_growth_data', { months: 6 })

        if (growthError) throw growthError
        setGrowthData(growthData)

        // Fetch recent activity using the new service
        const activityData = await ActivityLogService.getRecentActivityLogs(4)
        setRecentActivity(activityData)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users size={20} className="text-blue-600" />
      case "fitness":
        return <Dumbbell size={20} className="text-green-600" />
      case "nutrition":
        return <Utensils size={20} className="text-yellow-600" />
      case "feedback":
        return <MessageSquare size={20} className="text-purple-600" />
      default:
        return null
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "user":
        return "bg-blue-100"
      case "fitness":
        return "bg-green-100"
      case "nutrition":
        return "bg-yellow-100"
      case "feedback":
        return "bg-purple-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Removed Stats Cards Section (Fitness Plans, Nutrition Plans, etc.) */}
      {/* Removed Charts (Growth Overview) Section */}
      {/* Removed Recent Activity Section */}
    </div>
  )
}

export default AdminOverview
