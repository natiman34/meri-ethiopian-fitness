import { User, UserRole, type BMIResult } from "../models/User"
import { Admin } from "../models/Admin"
import { WorkoutPlanner } from "../models/WorkoutPlanner"
import { Nutritionist } from "../models/Nutritionist"

/**
 * UserService class for handling user-related operations
 * Implements the service layer in the three-tier architecture
 */
export class UserService {
  private static instance: UserService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  // Get user by ID
  public async getUserById(userId: string): Promise<User> {
    try {
      // This service method is deprecated - user data is now managed through AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("UserService.getUserById is deprecated. Use AuthContext and Supabase directly.");
      throw new Error("This user service method is deprecated. Please use the main authentication system.");
    } catch (error) {
      console.error("Get user error:", error)
      throw error
    }
  }

  // Update user profile
  public async updateUserProfile(user: User): Promise<User> {
    try {
      // This service method is deprecated - user profile updates are now handled through AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("UserService.updateUserProfile is deprecated. Use AuthContext.updateProfile instead.");
      throw new Error("This user service method is deprecated. Please use the main authentication system.");
    } catch (error) {
      console.error("Update user profile error:", error)
      throw error
    }
  }

  // Get all users (admin only)
  public async getAllUsers(): Promise<User[]> {
    try {
      // This service method is deprecated - user management is now handled through Supabase directly
      // This method is kept for backward compatibility but should not be used
      console.warn("UserService.getAllUsers is deprecated. Use Supabase admin queries directly.");
      throw new Error("This user service method is deprecated. Please use Supabase admin functionality.");
    } catch (error) {
      console.error("Get users error:", error)
      throw error
    }
  }

  // Delete user (admin only)
  public async deleteUser(userId: string): Promise<void> {
    try {
      // This service method is deprecated - user management is now handled through Supabase directly
      // This method is kept for backward compatibility but should not be used
      console.warn("UserService.deleteUser is deprecated. Use Supabase admin queries directly.");
      throw new Error("This user service method is deprecated. Please use Supabase admin functionality.");
    } catch (error) {
      console.error("Delete user error:", error)
      throw error
    }
  }

  // Add BMI result to user
  public async addBMIResultToUser(userId: string, bmiResult: BMIResult): Promise<User> {
    try {
      // This service method is deprecated - BMI data is now handled through AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("UserService.addBMIResultToUser is deprecated. Use AuthContext.updateProfile instead.");
      throw new Error("This user service method is deprecated. Please use the main authentication system.");
    } catch (error) {
      console.error("Add BMI result error:", error)
      throw error
    }
  }
}
