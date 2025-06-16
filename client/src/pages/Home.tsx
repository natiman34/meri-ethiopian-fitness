"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import { ChevronDown, ChevronRight, Check } from "lucide-react"

const Home: React.FC = () => {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="bg-cover bg-center opacity-20 h-full"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Embrace Ethiopian Wellness for a Healthier You
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 leading-relaxed">
              Discover culturally relevant fitness and nutrition plans designed around Ethiopian foods and traditions to
              achieve your health goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" fullWidth className="sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                fullWidth
                className="bg-transparent text-white border-white hover:bg-white/10 active:bg-white/20 sm:w-auto"
                onClick={() => setShowMore(!showMore)}
              >
                Learn More{" "}
                {showMore ? <ChevronDown size={20} className="ml-2" /> : <ChevronRight size={20} className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>

        {showMore && (
          <div className="container mx-auto px-4 mt-8 sm:mt-12 relative z-10 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Our Unique Approach</h3>
              <p className="mb-4 text-sm sm:text-base leading-relaxed">
                At መሪ Ethiopian Fitness and Nutrition, we combine traditional Ethiopian wisdom with modern fitness science. Our platform
                offers customized meal plans featuring nutritious Ethiopian dishes and fitness routines that respect
                cultural values while promoting optimal health.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="flex items-start">
                  <Check size={18} className="mr-2 sm:mr-3 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Cultural Relevance</h4>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      Fitness and nutrition plans that respect and incorporate Ethiopian traditions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={18} className="mr-2 sm:mr-3 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Expert Guidance</h4>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      Created by Ethiopian nutritionists and fitness professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={18} className="mr-2 sm:mr-3 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Holistic Approach</h4>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">Balance of physical, mental, and nutritional wellness</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={18} className="mr-2 sm:mr-3 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Community Support</h4>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">Join a community of Ethiopians on their health journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose መሪ Ethiopian Fitness and Nutrition?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed specifically for Ethiopians seeking healthier lifestyles
              through culturally appropriate methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="border border-gray-100">
              <Card.Body>
                <Card.Title className="text-center">Ethiopian Meal Plans</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Nutritionally balanced meal plans featuring traditional Ethiopian dishes.
                </p>
              </Card.Body>
            </Card>

            <Card hover className="border border-gray-100">
              <Card.Body>
                <Card.Title className="text-center">Customized Fitness</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Workout routines designed for all levels, accommodating Ethiopian lifestyles.
                </p>
              </Card.Body>
            </Card>

            <Card hover className="border border-gray-100">
              <Card.Body>
                <Card.Title className="text-center">Health Tracking</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Monitor your progress with our BMI calculator and personalized insights.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About መሪ Ethiopian Fitness and Nutrition</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ethiopia's premier health and wellness platform, dedicated to providing culturally
              relevant fitness and nutrition guidance.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-700 mb-6">
                  Our mission is to improve the health and wellbeing of Ethiopians by providing accessible, culturally
                  appropriate fitness and nutrition resources that respect traditional values while incorporating modern
                  health science.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Approach</h3>
                <p className="text-gray-700 mb-6">
                  We believe that sustainable health improvements come from approaches that respect cultural identity. That's
                  why all our fitness plans and nutritional guidance are designed specifically for Ethiopians, incorporating
                  traditional foods, practices, and values.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/about">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of services designed to help you achieve your fitness and wellness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card hover className="border border-gray-100">
              <Card.Body>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto">
                  💪🥗
                </div>
                <Card.Title className="text-center">Fitness & Nutrition Plans</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Comprehensive workout and meal plans for all levels and goals.
                </p>
                <div className="text-center mt-6">
                  <Link to="/services/fitness-and-nutrition-plans">
                    <Button variant="link" className="text-green-600 hover:text-green-800">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>

            <Card hover className="border border-gray-100">
              <Card.Body>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto">
                  📚
                </div>
                <Card.Title className="text-center">Educational Content</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Learn about fitness, nutrition, and well-being with our expert articles and guides.
                </p>
                <div className="text-center mt-6">
                  <Link to="/services/educational-content">
                    <Button variant="link" className="text-green-600 hover:text-green-800">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>

            <Card hover className="border border-gray-100">
              <Card.Body>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto">
                  🔥
                </div>
                <Card.Title className="text-center">Motivational Content</Card.Title>
                <p className="mt-4 text-gray-600 text-center">
                  Stay inspired and motivated on your journey with daily tips and success stories.
                </p>
                <div className="text-center mt-6">
                  <Link to="/services/motivational-content">
                    <Button variant="link" className="text-green-600 hover:text-green-800">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">BMI Calculator</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Calculate your Body Mass Index (BMI) to get a quick assessment of your weight relative to your height.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <Check size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Quick Assessment</h4>
                      <p className="text-sm text-gray-600">
                        Get instant feedback on your current weight status
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Personalized Recommendations</h4>
                      <p className="text-sm text-gray-600">
                        Receive tailored advice based on your BMI results
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Track Your Progress</h4>
                      <p className="text-sm text-gray-600">
                        Monitor changes in your BMI over time
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/bmi">
                    <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                      Calculate Your BMI
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-stone-50 p-8 rounded-lg shadow-md">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                    alt="BMI Calculator" 
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopians who have discovered the perfect balance of traditional foods and modern
            fitness. Your journey to better health starts here.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-black text-green-700 hover:bg-gray-100">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home


