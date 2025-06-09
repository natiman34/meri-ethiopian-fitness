import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { ChevronRight } from "lucide-react"
import FitnessPlans from "./services/FitnessPlans"
import NutritionPlans from "./services/NutritionPlans"
import EducationalContent from "./services/EducationalContent"
import MotivationalContent from "./services/MotivationalContent"
import FitnessPlanDetail from "./services/FitnessPlanDetail"
import NutritionPlanDetail from "./services/NutritionPlanDetail"
import EducationalContentDetail from "./services/EducationalContentDetail"
import MotivationalContentDetail from "./services/MotivationalContentDetail"

const ServicesOverview: React.FC = () => {
  // Using mock data for demonstration
  const mockServices = [
    {
      title: "Fitness Plans",
      description: "Customized workout routines for all levels and goals.",
      icon: "💪",
      link: "fitness-plans",
    },
    {
      title: "Nutrition Plans",
      description: "Personalized meal plans to fuel your body and achieve your health goals.",
      icon: "🥗",
      link: "nutrition-plans",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <Button variant="link" className="text-green-600 hover:text-green-800 flex items-center">
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4" />
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
  return (
    <Routes>
      <Route path="/" element={<ServicesOverview />} />
      <Route path="fitness-plans" element={<FitnessPlans />} />
      <Route path="fitness-plans/:id" element={<FitnessPlanDetail />} />
      <Route path="nutrition-plans" element={<NutritionPlans />} />
      <Route path="nutrition-plans/:id" element={<NutritionPlanDetail />} />
      <Route path="educational-content" element={<EducationalContent />} />
      <Route path="educational-content/:id" element={<EducationalContentDetail />} />
      <Route path="motivational-content" element={<MotivationalContent />} />
      <Route path="motivational-content/:id" element={<MotivationalContentDetail />} />
    </Routes>
  )
}

export default Services
