import React, { useState, useEffect } from "react"
import { Search, Filter, Grid, List, Star, Clock, Users, ChefHat } from "lucide-react"
import { NutritionPlan, NutritionCategory } from "../../types/content"
import { nutritionPlanService } from "../../services/NutritionPlanService"
import NutritionPlanCard from "../../components/NutritionPlanCard"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const NutritionPlans: React.FC = () => {
  const [plans, setPlans] = useState<NutritionPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<NutritionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<NutritionCategory | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "duration">("newest")

  const categories: { value: NutritionCategory | "all"; label: string; icon: string }[] = [
    { value: "all", label: "All Plans", icon: "🍽️" },
    { value: "weight-loss", label: "Weight Loss", icon: "🔥" },
    { value: "weight-gain", label: "Weight Gain", icon: "💪" },
    { value: "maintenance", label: "Maintenance", icon: "⚖️" },
    { value: "muscle-building", label: "Muscle Building", icon: "🏋️" },
    { value: "endurance", label: "Endurance", icon: "🏃" },
  ]

  useEffect(() => {
    fetchNutritionPlans()
  }, [])

  useEffect(() => {
    filterAndSortPlans()
  }, [plans, searchTerm, selectedCategory, sortBy])

  const fetchNutritionPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPlans = await nutritionPlanService.getAllNutritionPlans()
      setPlans(fetchedPlans)
    } catch (err) {
      console.error("Error fetching nutrition plans:", err)
      setError("Failed to load nutrition plans. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPlans = () => {
    let filtered = plans

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(plan => plan.category === selectedCategory)
    }

    // Sort plans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "popular":
          return (b.rating || 0) - (a.rating || 0)
        case "duration":
          return a.duration - b.duration
        default:
          return 0
      }
    })

    setFilteredPlans(filtered)
  }

  const handleCategoryChange = (category: NutritionCategory | "all") => {
    setSelectedCategory(category)
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Plans</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchNutritionPlans}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ethiopian Traditional Nutrition Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic Ethiopian nutrition plans designed by our expert nutritionists.
            Each plan combines traditional Ethiopian cuisine with modern nutritional science.
          </p>
          <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-green-600" />
              <span>Expert Designed</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Culturally Authentic</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <span>Community Tested</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-grow lg:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search nutrition plans..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as NutritionCategory | "all")}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "popular" | "duration")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="duration">Shortest Duration</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Showing {filteredPlans.length} of {plans.length} nutrition plans
            {selectedCategory !== "all" && (
              <span className="ml-2 text-green-600 font-medium">
                in {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
          </div>
          {filteredPlans.length > 0 && (
            <div className="text-sm text-gray-500">
              <Clock className="inline h-4 w-4 mr-1" />
              Avg. duration: {Math.round(filteredPlans.reduce((acc, plan) => acc + plan.duration, 0) / filteredPlans.length)} days
            </div>
          )}
        </div>

        {/* Plans Grid/List */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No nutrition plans are currently available."}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredPlans.map((plan, index) => (
              <NutritionPlanCard
                key={plan.id}
                plan={plan}
                variant={index === 0 && viewMode === "grid" ? "featured" : viewMode === "list" ? "compact" : "default"}
                showStats={true}
              />
            ))}
          </div>
        )}

        {/* Call to Action Section */}
        {filteredPlans.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Nutrition Journey?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join thousands of people who have transformed their health with our authentic Ethiopian nutrition plans.
              Each plan is carefully crafted to honor traditional cuisine while meeting modern nutritional needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{plans.length}+</div>
                <div className="text-sm text-green-100">Nutrition Plans</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-green-100">Ethiopian Authentic</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">Expert</div>
                <div className="text-sm text-green-100">Designed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NutritionPlans
