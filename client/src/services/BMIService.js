import { BMI } from "../models/BMI";
/**
 * BMIService class for handling BMI-related operations
 * Implements the service layer in the three-tier architecture
 */
export class BMIService {
    static instance;
    constructor() {
        // Private constructor to enforce singleton pattern
    }
    // Singleton pattern implementation
    static getInstance() {
        if (!BMIService.instance) {
            BMIService.instance = new BMIService();
        }
        return BMIService.instance;
    }
    // Calculate BMI for a user
    calculateBMI(height, weight, userId) {
        // Create a new BMI object
        const bmi = new BMI(height, weight, userId);
        // In a real implementation, this would save the BMI result to the backend
        this.saveBMIResult(bmi);
        return bmi;
    }
    // Save BMI result to the backend
    async saveBMIResult(_bmi) {
        try {
            // BMI data is now saved through AuthContext.updateProfile with Supabase
            // This method is kept for backward compatibility but doesn't perform actual save
            console.warn("BMIService.saveBMIResult is deprecated. BMI data is saved through user profile updates.");
            // No-op - BMI saving is handled elsewhere
        }
        catch (error) {
            console.error("Save BMI error:", error);
            throw error;
        }
    }
    // Get BMI history for a user
    async getBMIHistory(_userId) {
        try {
            // This service method is deprecated - BMI history is now accessed through user profile data
            // This method is kept for backward compatibility but should not be used
            console.warn("BMIService.getBMIHistory is deprecated. BMI history is available through user profile.");
            return [];
        }
        catch (error) {
            console.error("Get BMI history error:", error);
            throw error;
        }
    }
    // Get food recommendations based on BMI
    getFoodRecommendations(bmi) {
        return bmi.getFoodRecommendations();
    }
    // Get fitness recommendations based on BMI
    getFitnessRecommendations(bmi) {
        return bmi.getFitnessRecommendations();
    }
    // Add BMI result to user
    addBMIResultToUser(user, bmi) {
        if (bmi.bmiValue !== null && bmi.category !== null) {
            user.addBMIResult({
                id: Date.now().toString(),
                height: bmi.height,
                weight: bmi.weight,
                bmi: bmi.bmiValue,
                category: bmi.category,
                date: bmi.date.toISOString(),
            });
        }
    }
}
