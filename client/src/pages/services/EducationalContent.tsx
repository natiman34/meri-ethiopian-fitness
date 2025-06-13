import React from "react"
import { Link } from "react-router-dom"
import { BookOpen, Target, Activity, Calculator, ArrowRight, Play, CheckCircle } from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import ImageWithFallback from "../../components/ImageWithFallback"

const EducationalContent: React.FC = () => {

  const educationalCategories = [
    {
      id: "physical-fitness",
      title: "Physical Fitness Guide",
      description: "Comprehensive guide to understanding and improving your physical fitness",
      icon: <Activity className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      topics: ["Metabolic Fitness", "Health-Related Fitness", "Fitness Testing"],
      link: "/services/educational-content/physical-fitness"
    }
  ]

  const featuredTools = [
    {
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index and understand what it means",
      icon: <Calculator className="h-6 w-6" />,
      link: "/services/educational-content/tools/bmi-calculator"
    },
    {
      title: "Fitness Assessment",
      description: "Complete fitness evaluation with multiple test components",
      icon: <Target className="h-6 w-6" />,
      link: "/services/educational-content/tools/fitness-assessment"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Educational Content Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Evidence-based fitness and nutrition education to empower your wellness journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services/educational-content/physical-fitness">
                <Button size="lg" className="bg-black text-green-700 hover:bg-green-50">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/services/educational-content/tools/fitness-assessment">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                  <Play className="mr-2 h-5 w-5" />
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Educational Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Educational Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into the science of fitness, nutrition, and wellness with our comprehensive guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {educationalCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    {category.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <Link to={category.link}>
                    <Button variant="primary" className="w-full">
                      Explore Content
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Interactive Fitness Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use our science-based calculators and assessment tools to track your progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {featuredTools.map((tool, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tool.description}
                </p>
                <Link to={tool.link}>
                  <Button variant="outline" size="sm">
                    Try Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Access Resources
            </h2>
            <p className="text-gray-600">
              Jump directly to specific topics or continue your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/services/educational-content/physical-fitness#metabolic-fitness" className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Metabolic Fitness</span>
              </div>
            </Link>
            <Link to="/services/educational-content/physical-fitness#body-composition" className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Body Composition</span>
              </div>
            </Link>
            <Link to="/services/educational-content/physical-fitness#strength-testing" className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Strength Testing</span>
              </div>
            </Link>
            <Link to="/services/educational-content/physical-fitness#flexibility" className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Flexibility Tests</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationalContent
