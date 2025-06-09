import { BMI } from "../models/BMI"
import type { User } from "../models/User"

/**
 * BMIService class for handling BMI-related operations
 * Implements the service layer in the three-tier architecture
 */
export class BMIService {
  private static instance: BMIService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): BMIService {
    if (!BMIService.instance) {
      BMIService.instance = new BMIService()
    }
    return BMIService.instance
  }

  // Calculate BMI for a user
  public calculateBMI(height: number, weight: number, userId: string): BMI {
    // Create a new BMI object
    const bmi = new BMI(height, weight, userId)

    // In a real implementation, this would save the BMI result to the backend
    this.saveBMIResult(bmi)

    return bmi
  }

  // Save BMI result to the backend
  private async saveBMIResult(bmi: BMI): Promise<void> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch("/api/bmi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bmi.toObject()),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save BMI result")
      }
    } catch (error) {
      console.error("Save BMI error:", error)
      throw error
    }
  }

  // Get BMI history for a user
  public async getBMIHistory(userId: string): Promise<BMI[]> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch(`/api/bmi/history/${userId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get BMI history")
      }

      const bmiData = await response.json()

      // Convert the data to BMI objects
      return bmiData.map((data: any) => BMI.fromObject(data))
    } catch (error) {
      console.error("Get BMI history error:", error)
      throw error
    }
  }

  // Get food recommendations based on BMI
  public getFoodRecommendations(bmi: BMI): string[] {
    return bmi.getFoodRecommendations()
  }

  // Get fitness recommendations based on BMI
  public getFitnessRecommendations(bmi: BMI): string[] {
    return bmi.getFitnessRecommendations()
  }

  // Add BMI result to user
  public addBMIResultToUser(user: User, bmi: BMI): void {
    if (bmi.bmiValue !== null && bmi.category !== null) {
      user.addBMIResult({
        id: Date.now().toString(),
        height: bmi.height,
        weight: bmi.weight,
        bmi: bmi.bmiValue,
        category: bmi.category,
        date: bmi.date.toISOString(),
      })
    }
  }
}
