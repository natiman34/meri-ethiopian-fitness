"use client"

import type React from "react"
import { useState } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { useAuth } from "../contexts/AuthContext"

interface BMIResult {
  bmi: number
  category: string
  recommendation: string
}

const BMI: React.FC = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth()
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const calculateBMI = () => {
    setError("")
    setSaveSuccess(false)

    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height)

    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setError("Please enter valid height and weight values")
      setResult(null)
      return
    }

    let bmiValue: number
    let heightInCm: number
    let weightInKg: number

    if (unit === "metric") {
      // Weight in kg, height in cm
      bmiValue = weightNum / Math.pow(heightNum / 100, 2)
      heightInCm = heightNum
      weightInKg = weightNum
    } else {
      // Weight in lbs, height in inches
      // Convert to metric for saving
      heightInCm = heightNum * 2.54 // inches to cm
      weightInKg = weightNum * 0.453592 // lbs to kg
      bmiValue = weightInKg / Math.pow(heightInCm / 100, 2)
    }

    bmiValue = Number.parseFloat(bmiValue.toFixed(1))

    let category: string
    let recommendation: string

    if (bmiValue < 18.5) {
      category = "Underweight"
      recommendation =
        "Consider consulting with a nutritionist for a healthy weight gain plan that incorporates traditional Ethiopian foods rich in calories and nutrients."
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = "Normal weight"
      recommendation =
        "Maintain your healthy weight by continuing to eat a balanced diet of traditional Ethiopian foods and staying physically active."
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = "Overweight"
      recommendation =
        "Consider making small adjustments to your diet and increasing physical activity. Our Ethiopian-focused nutrition plans can help you achieve a healthier weight."
    } else {
      category = "Obese"
      recommendation =
        "We recommend consulting with a healthcare provider. Our specialized Ethiopian fitness and nutrition plans can support you in achieving a healthier weight."
    }

    setResult({ bmi: bmiValue, category, recommendation })

    // Save BMI, height, and weight to user profile if logged in
    if (user) {
      setIsSaving(true)
      setSaveSuccess(false); // Reset success state
      setError(''); // Reset error state before saving
      console.log("Attempting to save BMI data to profile:", { height: heightInCm, weight: weightInKg, bmi: bmiValue });

      updateProfile({ height: heightInCm, weight: weightInKg, bmi: bmiValue })
        .then(() => {
          console.log("updateProfile call successful.");
          setSaveSuccess(true);
          setError(''); // Clear error on success
        })
        .catch((err) => {
          console.error("updateProfile call failed:", err);
          setError(`Failed to save BMI data: ${err.message || "Unknown error"}`);
          setSaveSuccess(false); // Ensure success is false on error
        })
        .finally(() => {
          console.log("updateProfile call finished.");
          setIsSaving(false);
        })
    } else {
      console.log("User not logged in, BMI data not saved.")
      // Optionally inform user they need to log in to save
       setError("Log in to save your BMI result."); // Inform user if not logged in
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBMI()
  }

  const resetForm = () => {
    setHeight("")
    setWeight("")
    setResult(null)
    setError("")
    setSaveSuccess(false)
  }

  const handleUnitChange = (newUnit: "metric" | "imperial") => {
    setUnit(newUnit)
    resetForm()
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">BMI Calculator</h1>
          <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Calculate your Body Mass Index (BMI) to get an indication of whether you have a healthy weight for your
            height.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <Card.Body>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Calculate Your BMI</h2>

                <div className="flex mb-6">
                  <button
                    className={`flex-1 py-2 text-center ${
                      unit === "metric" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleUnitChange("metric")}
                  >
                    Metric
                  </button>
                  <button
                    className={`flex-1 py-2 text-center ${
                      unit === "imperial" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleUnitChange("imperial")}
                  >
                    Imperial
                  </button>
                </div>

                {error && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
                {saveSuccess && !error && (
                  <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md">
                    BMI data saved to your profile!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height {unit === "metric" ? "(cm)" : "(inches)"}
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={unit === "metric" ? "e.g., 170" : "e.g., 67"}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      step="0.1"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      step="0.1"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" variant="primary" disabled={isSaving || authLoading}>
                      {isSaving ? "Calculating & Saving..." : "Calculate BMI"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving || authLoading}>
                      Reset
                    </Button>
                  </div>
                  {!user && (
                    <p className="mt-4 text-sm text-blue-600 italic">
                      Log in to save your BMI result to your profile.
                    </p>
                  )}
                </form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Results</h2>

                {result ? (
                  <div>
                    <div className="mb-8 text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">{result.bmi}</div>
                      <div className="text-xl font-medium text-gray-800">{result.category}</div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-2">What this means:</h3>
                      <p className="text-gray-600">{result.recommendation}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium text-gray-800 mb-2">BMI Categories:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Underweight</span>
                          <span className="font-medium">Below 18.5</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Normal weight</span>
                          <span className="font-medium">18.5 - 24.9</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Overweight</span>
                          <span className="font-medium">25 - 29.9</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Obesity</span>
                          <span className="font-medium">30 or greater</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Enter your height and weight to calculate your BMI.
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          <div className="mt-12 bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About BMI</h2>
            <p className="text-gray-700 mb-4">
              Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI =
              kg/m² where kg is a person's weight in kilograms and m² is their height in meters squared.
            </p>
            <p className="text-gray-700 mb-4">
              While BMI is a useful screening tool, it does have limitations. It doesn't account for factors like muscle
              mass, bone density, or ethnic differences. For Ethiopians, who often have different body compositions
              compared to Western populations, BMI results should be interpreted with these considerations in mind.
            </p>
            <p className="text-gray-700">
              Always consult with a healthcare professional for a comprehensive health assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BMI
