import React, { useState } from "react"
import { Calculator, Scale, TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"

interface BMIResult {
  bmi: number
  category: string
  healthRisk: string
  color: string
  recommendations: string[]
}

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [result, setResult] = useState<BMIResult | null>(null)
  const [showNutritionTips, setShowNutritionTips] = useState(false)

  const calculateBMI = () => {
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
      return
    }

    let bmi: number
    if (unit === "metric") {
      // BMI = weight (kg) / height² (m²)
      const heightInMeters = heightNum / 100
      bmi = weightNum / (heightInMeters * heightInMeters)
    } else {
      // BMI = (weight (lbs) / height² (inches²)) × 703
      bmi = (weightNum / (heightNum * heightNum)) * 703
    }

    const bmiResult = getBMICategory(bmi)
    setResult(bmiResult)
    setShowNutritionTips(true)
  }

  const getBMICategory = (bmi: number): BMIResult => {
    if (bmi < 18.5) {
      return {
        bmi,
        category: "Underweight",
        healthRisk: "Increased risk of nutritional deficiency and osteoporosis",
        color: "text-blue-600",
        recommendations: [
          "Consult with a healthcare provider about healthy weight gain",
          "Focus on nutrient-dense, calorie-rich foods",
          "Include strength training to build muscle mass",
          "Consider working with a registered dietitian"
        ]
      }
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        bmi,
        category: "Normal Weight",
        healthRisk: "Low risk of weight-related health problems",
        color: "text-green-600",
        recommendations: [
          "Maintain current healthy lifestyle",
          "Continue balanced diet and regular exercise",
          "Focus on overall fitness and well-being",
          "Regular health check-ups for prevention"
        ]
      }
    } else if (bmi >= 25 && bmi < 30) {
      return {
        bmi,
        category: "Overweight",
        healthRisk: "Increased risk of cardiovascular disease and diabetes",
        color: "text-yellow-600",
        recommendations: [
          "Aim for gradual weight loss of 1-2 pounds per week",
          "Increase physical activity to 150+ minutes per week",
          "Focus on portion control and balanced nutrition",
          "Consider consulting a healthcare provider"
        ]
      }
    } else {
      return {
        bmi,
        category: "Obese",
        healthRisk: "High risk of serious health complications",
        color: "text-red-600",
        recommendations: [
          "Consult healthcare provider for comprehensive weight management plan",
          "Consider medically supervised weight loss program",
          "Focus on sustainable lifestyle changes",
          "Address underlying health conditions"
        ]
      }
    }
  }

  const nutritionTips = [
    {
      title: "Balanced Macronutrients",
      description: "Aim for 45-65% carbohydrates, 20-35% fats, and 10-35% protein",
      icon: <Scale className="h-5 w-5 text-green-500" />
    },
    {
      title: "Hydration",
      description: "Drink at least 8 glasses of water daily, more if you're active",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Portion Control",
      description: "Use smaller plates and listen to your body's hunger cues",
      icon: <CheckCircle className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Whole Foods",
      description: "Choose minimally processed foods rich in nutrients",
      icon: <Info className="h-5 w-5 text-orange-500" />
    }
  ]

  const clearCalculation = () => {
    setHeight("")
    setWeight("")
    setResult(null)
    setShowNutritionTips(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              BMI Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your Body Mass Index and get personalized health recommendations 
              with integrated nutrition guidance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Calculator className="h-6 w-6 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Calculate Your BMI</h2>
              </div>

              {/* Unit Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Measurement System
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setUnit("metric")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      unit === "metric"
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                  >
                    Metric (kg/cm)
                  </button>
                  <button
                    onClick={() => setUnit("imperial")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      unit === "imperial"
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                  >
                    Imperial (lbs/in)
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height ({unit === "metric" ? "cm" : "inches"})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === "metric" ? "170" : "68"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight ({unit === "metric" ? "kg" : "lbs"})
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === "metric" ? "70" : "154"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={calculateBMI}
                  className="flex-1"
                  disabled={!height || !weight}
                >
                  Calculate BMI
                </Button>
                <Button
                  onClick={clearCalculation}
                  variant="outline"
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>

              {/* BMI Formula Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">BMI Formula:</h3>
                <p className="text-sm text-blue-700">
                  {unit === "metric" 
                    ? "BMI = Weight (kg) ÷ Height² (m²)"
                    : "BMI = (Weight (lbs) ÷ Height² (inches²)) × 703"
                  }
                </p>
              </div>
            </Card>

            {/* Results */}
            <Card className="p-8">
              {result ? (
                <div>
                  <div className="flex items-center mb-6">
                    <Scale className="h-6 w-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                  </div>

                  {/* BMI Score */}
                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold ${result.color} mb-2`}>
                      {result.bmi.toFixed(1)}
                    </div>
                    <div className={`text-xl font-semibold ${result.color} mb-2`}>
                      {result.category}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {result.healthRisk}
                    </p>
                  </div>

                  {/* BMI Categories Reference */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">BMI Categories:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Underweight:</span>
                        <span className="text-blue-600">&lt; 18.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Normal weight:</span>
                        <span className="text-green-600">18.5 - 24.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overweight:</span>
                        <span className="text-yellow-600">25.0 - 29.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Obese:</span>
                        <span className="text-red-600">≥ 30.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Recommendations:</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Enter your height and weight to calculate your BMI
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Nutrition Tips */}
          {showNutritionTips && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Nutrition Tips for Optimal Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nutritionTips.map((tip, index) => (
                  <Card key={index} className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tip.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Important Note */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
                <p className="text-yellow-700 text-sm">
                  BMI is a screening tool and doesn't directly measure body fat or health. 
                  It may not be accurate for athletes, elderly, or those with high muscle mass. 
                  Always consult with healthcare professionals for comprehensive health assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BMICalculator
