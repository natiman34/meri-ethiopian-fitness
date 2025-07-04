import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { ChevronRight } from "lucide-react"
import EducationalContent from "./services/EducationalContent"
import MotivationalContent from "./services/MotivationalContent"
import FitnessPlanDetail from "./services/FitnessPlanDetail"
import NutritionPlanDetail from "./services/NutritionPlanDetail"
import EducationalContentDetail from "./services/EducationalContentDetail"
import MotivationalContentDetail from "./services/MotivationalContentDetail"
import FitnessAndNutritionPlans from "./services/FitnessAndNutritionPlans"
import PhysicalFitnessGuide from "./services/PhysicalFitnessGuide"
import BMICalculator from "./services/BMICalculator"
import FitnessAssessment from "./services/FitnessAssessment"

const ServicesOverview: React.FC = () => {
  // Using mock data for demonstration
  const mockServices = [
    {
      title: "Fitness and Nutrition Plans",
      description: "Comprehensive workout routines and authentic Ethiopian nutrition plans designed by expert nutritionists, combining traditional cuisine with modern fitness science.",
      icon: "💪🍽️",
      link: "fitness-and-nutrition-plans",
    },
    {
      title: "Educational Content",
      description: "Learn about fitness, nutrition, and well-being with our expert articles and guides.",
      icon: "📚",
      link: "educational-content",
    },
    {
      title: "Motivational Content",
      description: "Stay inspired and motivated on your journey with daily tips and success stories.",
      icon: "🔥",
      link: "motivational-content",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Our Services
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore our comprehensive range of services designed to help you achieve your fitness and wellness goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {mockServices.map((service, index) => (
            <Card key={index} className="transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h2>
              <p className="text-gray-600 mb-6 flex-grow">
                {service.description}
              </p>
              <Link to={service.link} className="mt-auto">
                <Button variant="primary" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Learn More & Explore
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const Services: React.FC = () => {
  console.log("Services component rendering. Current path:", window.location.pathname);
  return (
    <Routes>
      <Route path="/" element={<ServicesOverview />} />
      <Route path="fitness-and-nutrition-plans" element={<FitnessAndNutritionPlans />} />
      <Route path="educational-content" element={<EducationalContent />} />
      <Route path="educational-content/physical-fitness" element={<PhysicalFitnessGuide />} />
      <Route path="educational-content/tools/bmi-calculator" element={<BMICalculator />} />
      <Route path="educational-content/tools/fitness-assessment" element={<FitnessAssessment />} />
      <Route path="educational-content/:id" element={<EducationalContentDetail />} />
      <Route path="motivational-content" element={<MotivationalContent />} />
      <Route path="motivational-content/:id" element={<MotivationalContentDetail />} />
      <Route path="fitness-plans/:id" element={<FitnessPlanDetail />} />
      <Route path="nutrition-plans/:id" element={<NutritionPlanDetail />} />
    </Routes>
  )
}

export default Services
