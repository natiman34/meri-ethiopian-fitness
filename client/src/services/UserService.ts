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
      // In a real implementation, this would make an API call to the backend
      const response = await fetch(`/api/users/${userId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get user")
      }

      const userData = await response.json()

      // Create the appropriate user type based on the role
      let user: User

      switch (userData.role) {
        case UserRole.ADMIN_SUPER:
          user = new Admin(
            userData.id,
            userData.name,
            userData.email,
            userData.role,
            userData.createdAt,
            userData.lastLogin,
            userData.adminLevel || "super",
          )
          break
        case UserRole.ADMIN_FITNESS:
          user = new WorkoutPlanner(
            userData.id,
            userData.name,
            userData.email,
            userData.createdAt,
            userData.lastLogin,
            userData.specialization || "general",
            userData.certification || "certified",
          )
          break
        case UserRole.ADMIN_NUTRITIONIST:
          user = new Nutritionist(
            userData.id,
            userData.name,
            userData.email,
            userData.createdAt,
            userData.lastLogin,
            userData.specialization || "general",
            userData.certification || "certified",
          )
          break
        default:
          user = new User(
            userData.id,
            userData.name,
            userData.email,
            userData.role || UserRole.USER,
            userData.createdAt,
            userData.lastLogin,
            userData.bmiResults || [],
          )
      }

      return user
    } catch (error) {
      console.error("Get user error:", error)
      throw error
    }
  }

  // Update user profile
  public async updateUserProfile(user: User): Promise<User> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user.toObject()),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update user profile")
      }

      const updatedUserData = await response.json()

      // Return the updated user with the same type
      if (user instanceof Admin) {
        return Admin.fromObject(updatedUserData)
      } else if (user instanceof WorkoutPlanner) {
        return WorkoutPlanner.fromObject(updatedUserData)
      } else if (user instanceof Nutritionist) {
        return Nutritionist.fromObject(updatedUserData)
      } else {
        return User.fromObject(updatedUserData)
      }
    } catch (error) {
      console.error("Update user profile error:", error)
      throw error
    }
  }

  // Get all users (admin only)
  public async getAllUsers(): Promise<User[]> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch("/api/users")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get users")
      }

      const usersData = await response.json()

      // Convert the data to User objects based on their roles
      return usersData.map((userData: any) => {
        switch (userData.role) {
          case UserRole.ADMIN_SUPER:
            return Admin.fromObject(userData)
          case UserRole.ADMIN_FITNESS:
            return WorkoutPlanner.fromObject(userData)
          case UserRole.ADMIN_NUTRITIONIST:
            return Nutritionist.fromObject(userData)
          default:
            return User.fromObject(userData)
        }
      })
    } catch (error) {
      console.error("Get users error:", error)
      throw error
    }
  }

  // Delete user (admin only)
  public async deleteUser(userId: string): Promise<void> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Delete user error:", error)
      throw error
    }
  }

  // Add BMI result to user
  public async addBMIResultToUser(userId: string, bmiResult: BMIResult): Promise<User> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch(`/api/users/${userId}/bmi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bmiResult),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add BMI result")
      }

      const updatedUserData = await response.json()

      // Return the updated user
      return User.fromObject(updatedUserData)
    } catch (error) {
      console.error("Add BMI result error:", error)
      throw error
    }
  }
}
