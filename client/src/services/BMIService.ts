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
  private async saveBMIResult(_bmi: BMI): Promise<void> {
    try {
      // BMI data is now saved through AuthContext.updateProfile with Supabase
      // This method is kept for backward compatibility but doesn't perform actual save
      console.warn("BMIService.saveBMIResult is deprecated. BMI data is saved through user profile updates.");
      // No-op - BMI saving is handled elsewhere
    } catch (error) {
      console.error("Save BMI error:", error)
      throw error
    }
  }

  // Get BMI history for a user
  public async getBMIHistory(_userId: string): Promise<BMI[]> {
    try {
      // This service method is deprecated - BMI history is now accessed through user profile data
      // This method is kept for backward compatibility but should not be used
      console.warn("BMIService.getBMIHistory is deprecated. BMI history is available through user profile.");
      return [];
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
