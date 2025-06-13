import React, { useState } from "react"
import { Target, Activity, Scale, CheckCircle, ArrowRight, ArrowLeft, BarChart3 } from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"

interface AssessmentData {
  personalInfo: {
    age: string
    gender: string
    activityLevel: string
  }
  measurements: {
    height: string
    weight: string
    restingHeartRate: string
    bloodPressure: string
  }
  fitnessTests: {
    pushUps: string
    sitUps: string
    flexibility: string
    cardio: string
  }
}

interface FitnessScore {
  component: string
  score: number
  rating: string
  color: string
  recommendations: string[]
}

const FitnessAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    personalInfo: { age: "", gender: "", activityLevel: "" },
    measurements: { height: "", weight: "", restingHeartRate: "", bloodPressure: "" },
    fitnessTests: { pushUps: "", sitUps: "", flexibility: "", cardio: "" }
  })
  const [results, setResults] = useState<FitnessScore[] | null>(null)

  const steps = [
    { number: 1, title: "Personal Information", icon: <Target className="h-5 w-5" /> },
    { number: 2, title: "Body Measurements", icon: <Scale className="h-5 w-5" /> },
    { number: 3, title: "Fitness Tests", icon: <Activity className="h-5 w-5" /> },
    { number: 4, title: "Results", icon: <BarChart3 className="h-5 w-5" /> }
  ]

  const updatePersonalInfo = (field: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateMeasurements = (field: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: value }
    }))
  }

  const updateFitnessTests = (field: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      fitnessTests: { ...prev.fitnessTests, [field]: value }
    }))
  }

  const calculateFitnessScores = (): FitnessScore[] => {
    const age = parseInt(assessmentData.personalInfo.age)
    const gender = assessmentData.personalInfo.gender
    const pushUps = parseInt(assessmentData.fitnessTests.pushUps)
    const sitUps = parseInt(assessmentData.fitnessTests.sitUps)
    const flexibility = parseInt(assessmentData.fitnessTests.flexibility)
    const cardioTime = parseFloat(assessmentData.fitnessTests.cardio)

    const scores: FitnessScore[] = []

    // Push-up assessment (Upper body strength)
    let pushUpRating = "Poor"
    let pushUpColor = "text-red-600"
    if (gender === "male") {
      if (age < 30) {
        if (pushUps >= 40) { pushUpRating = "Excellent"; pushUpColor = "text-green-600" }
        else if (pushUps >= 30) { pushUpRating = "Good"; pushUpColor = "text-blue-600" }
        else if (pushUps >= 20) { pushUpRating = "Fair"; pushUpColor = "text-yellow-600" }
      } else if (age < 40) {
        if (pushUps >= 35) { pushUpRating = "Excellent"; pushUpColor = "text-green-600" }
        else if (pushUps >= 25) { pushUpRating = "Good"; pushUpColor = "text-blue-600" }
        else if (pushUps >= 15) { pushUpRating = "Fair"; pushUpColor = "text-yellow-600" }
      }
    } else {
      if (age < 30) {
        if (pushUps >= 30) { pushUpRating = "Excellent"; pushUpColor = "text-green-600" }
        else if (pushUps >= 20) { pushUpRating = "Good"; pushUpColor = "text-blue-600" }
        else if (pushUps >= 10) { pushUpRating = "Fair"; pushUpColor = "text-yellow-600" }
      } else if (age < 40) {
        if (pushUps >= 25) { pushUpRating = "Excellent"; pushUpColor = "text-green-600" }
        else if (pushUps >= 15) { pushUpRating = "Good"; pushUpColor = "text-blue-600" }
        else if (pushUps >= 8) { pushUpRating = "Fair"; pushUpColor = "text-yellow-600" }
      }
    }

    scores.push({
      component: "Upper Body Strength",
      score: pushUps,
      rating: pushUpRating,
      color: pushUpColor,
      recommendations: [
        "Include push-ups, chest press, and shoulder exercises",
        "Progressive overload with increased repetitions",
        "Focus on proper form over quantity"
      ]
    })

    // Sit-up assessment (Core strength)
    let sitUpRating = "Poor"
    let sitUpColor = "text-red-600"
    if (sitUps >= 50) { sitUpRating = "Excellent"; sitUpColor = "text-green-600" }
    else if (sitUps >= 35) { sitUpRating = "Good"; sitUpColor = "text-blue-600" }
    else if (sitUps >= 20) { sitUpRating = "Fair"; sitUpColor = "text-yellow-600" }

    scores.push({
      component: "Core Strength",
      score: sitUps,
      rating: sitUpRating,
      color: sitUpColor,
      recommendations: [
        "Add planks, crunches, and rotational exercises",
        "Focus on controlled movements",
        "Include functional core training"
      ]
    })

    // Flexibility assessment
    let flexRating = "Poor"
    let flexColor = "text-red-600"
    if (flexibility >= 15) { flexRating = "Excellent"; flexColor = "text-green-600" }
    else if (flexibility >= 10) { flexRating = "Good"; flexColor = "text-blue-600" }
    else if (flexibility >= 5) { flexRating = "Fair"; flexColor = "text-yellow-600" }

    scores.push({
      component: "Flexibility",
      score: flexibility,
      rating: flexRating,
      color: flexColor,
      recommendations: [
        "Daily stretching routine (10-15 minutes)",
        "Include dynamic warm-up before exercise",
        "Consider yoga or Pilates classes"
      ]
    })

    // Cardiovascular assessment (1.5 mile run time)
    let cardioRating = "Poor"
    let cardioColor = "text-red-600"
    if (gender === "male") {
      if (cardioTime <= 10) { cardioRating = "Excellent"; cardioColor = "text-green-600" }
      else if (cardioTime <= 12) { cardioRating = "Good"; cardioColor = "text-blue-600" }
      else if (cardioTime <= 15) { cardioRating = "Fair"; cardioColor = "text-yellow-600" }
    } else {
      if (cardioTime <= 12) { cardioRating = "Excellent"; cardioColor = "text-green-600" }
      else if (cardioTime <= 14) { cardioRating = "Good"; cardioColor = "text-blue-600" }
      else if (cardioTime <= 17) { cardioRating = "Fair"; cardioColor = "text-yellow-600" }
    }

    scores.push({
      component: "Cardiovascular Endurance",
      score: cardioTime,
      rating: cardioRating,
      color: cardioColor,
      recommendations: [
        "Aim for 150+ minutes moderate cardio per week",
        "Include interval training 2-3 times per week",
        "Gradually increase duration and intensity"
      ]
    })

    return scores
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
    if (currentStep === 3) {
      const scores = calculateFitnessScores()
      setResults(scores)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(assessmentData.personalInfo.age && assessmentData.personalInfo.gender && assessmentData.personalInfo.activityLevel)
      case 2:
        return !!(assessmentData.measurements.height && assessmentData.measurements.weight && assessmentData.measurements.restingHeartRate)
      case 3:
        return !!(assessmentData.fitnessTests.pushUps && assessmentData.fitnessTests.sitUps && assessmentData.fitnessTests.flexibility && assessmentData.fitnessTests.cardio)
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Fitness Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete evaluation of your physical fitness across multiple components with personalized recommendations
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? "bg-blue-500 border-blue-500 text-white" 
                      : "bg-white border-gray-300 text-gray-500"
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      currentStep >= step.number ? "text-blue-500" : "text-gray-400"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      currentStep > step.number ? "bg-blue-500" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8 mb-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={assessmentData.personalInfo.age}
                      onChange={(e) => updatePersonalInfo("age", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={assessmentData.personalInfo.gender}
                      onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Activity Level</label>
                    <select
                      value={assessmentData.personalInfo.activityLevel}
                      onChange={(e) => updatePersonalInfo("activityLevel", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary (little to no exercise)</option>
                      <option value="light">Light (1-3 days per week)</option>
                      <option value="moderate">Moderate (3-5 days per week)</option>
                      <option value="active">Active (6-7 days per week)</option>
                      <option value="very-active">Very Active (2x per day, intense workouts)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Body Measurements */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Body Measurements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={assessmentData.measurements.height}
                      onChange={(e) => updateMeasurements("height", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={assessmentData.measurements.weight}
                      onChange={(e) => updateMeasurements("weight", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resting Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={assessmentData.measurements.restingHeartRate}
                      onChange={(e) => updateMeasurements("restingHeartRate", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (optional)</label>
                    <input
                      type="text"
                      value={assessmentData.measurements.bloodPressure}
                      onChange={(e) => updateMeasurements("bloodPressure", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="120/80"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fitness Tests */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fitness Tests</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Push-ups (maximum in 1 minute)
                      </label>
                      <input
                        type="number"
                        value={assessmentData.fitnessTests.pushUps}
                        onChange={(e) => updateFitnessTests("pushUps", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sit-ups (maximum in 1 minute)
                      </label>
                      <input
                        type="number"
                        value={assessmentData.fitnessTests.sitUps}
                        onChange={(e) => updateFitnessTests("sitUps", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sit-and-reach (cm)
                      </label>
                      <input
                        type="number"
                        value={assessmentData.fitnessTests.flexibility}
                        onChange={(e) => updateFitnessTests("flexibility", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1.5 Mile Run Time (minutes)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={assessmentData.fitnessTests.cardio}
                        onChange={(e) => updateFitnessTests("cardio", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="12.5"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Test Instructions:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Warm up properly before each test</li>
                      <li>• Perform tests on separate days if needed</li>
                      <li>• Use proper form for all exercises</li>
                      <li>• Stop if you experience pain or discomfort</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && results && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Fitness Assessment Results</h2>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{result.component}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-2xl font-bold mr-2">{result.score}</span>
                            <span className={`font-semibold ${result.color}`}>{result.rating}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.rating === "Excellent" ? "bg-green-100 text-green-800" :
                          result.rating === "Good" ? "bg-blue-100 text-blue-800" :
                          result.rating === "Fair" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {result.rating}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === 4 || !isStepComplete(currentStep)}
              className="flex items-center"
            >
              {currentStep === 3 ? "Calculate Results" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FitnessAssessment
