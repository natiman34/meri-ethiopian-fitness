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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white pt-28 pb-20 md:pt-36 md:pb-28">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Embrace Ethiopian Wellness for a Healthier You
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Discover culturally relevant fitness and nutrition plans designed around Ethiopian foods and traditions to
              achieve your health goals.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" variant="primary">
                  Get Started
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => setShowMore(!showMore)}
              >
                Learn More{" "}
                {showMore ? <ChevronDown size={20} className="ml-2" /> : <ChevronRight size={20} className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Learn More Content */}
        {showMore && (
          <div className="container mx-auto px-4 mt-12 relative z-10 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Our Unique Approach</h3>
              <p className="mb-4">
                At መሪ Ethiopian Fitness and Nutrition, we combine traditional Ethiopian wisdom with modern fitness science. Our platform
                offers customized meal plans featuring nutritious Ethiopian dishes and fitness routines that respect
                cultural values while promoting optimal health.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start">
                  <Check size={20} className="mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Cultural Relevance</h4>
                    <p className="text-sm text-gray-200">
                      Fitness and nutrition plans that respect and incorporate Ethiopian traditions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={20} className="mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Expert Guidance</h4>
                    <p className="text-sm text-gray-200">
                      Created by Ethiopian nutritionists and fitness professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={20} className="mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Holistic Approach</h4>
                    <p className="text-sm text-gray-200">Balance of physical, mental, and nutritional wellness</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check size={20} className="mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">Community Support</h4>
                    <p className="text-sm text-gray-200">Join a community of Ethiopians on their health journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section - Simplified for this example */}
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
            {/* Feature cards would go here */}
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

      {/* CTA Section */}
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
