import type React from "react"

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About መሪ Ethiopian Fitness and Nutrition</h1>
          <p className="text-lg text-gray-700 mb-8">
           መሪ Ethiopian Fitness and Nutrition is Ethiopia's premier health and wellness platform, dedicated to providing culturally
            relevant fitness and nutrition guidance to help Ethiopians achieve their health goals.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            Our mission is to improve the health and wellbeing of Ethiopians by providing accessible, culturally
            appropriate fitness and nutrition resources that respect traditional values while incorporating modern
            health science.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Our team consists of certified Ethiopian nutritionists, fitness experts, and health professionals who
            understand the unique health challenges and dietary preferences of Ethiopians.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">Our Approach</h2>
          <p className="text-gray-700 mb-6">
            We believe that sustainable health improvements come from approaches that respect cultural identity. That's
            why all our fitness plans and nutritional guidance are designed specifically for Ethiopians, incorporating
            traditional foods, practices, and values.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
