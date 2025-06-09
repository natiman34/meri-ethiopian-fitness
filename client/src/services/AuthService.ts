import { User, UserRole } from "../models/User"
import { Admin } from "../models/Admin"
import { WorkoutPlanner } from "../models/WorkoutPlanner"
import { Nutritionist } from "../models/Nutritionist"

/**
 * AuthService class for handling authentication-related operations
 * Implements the service layer in the three-tier architecture
 */
export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Get the current authenticated user
  public getCurrentUser(): User | null {
    return this.currentUser
  }

  // Register a new user
  public async register(name: string, email: string, password: string): Promise<User> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const userData = await response.json()

      // Create a User object from the response data
      const user = new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role || UserRole.USER,
        userData.createdAt,
        userData.lastLogin,
      )

      this.currentUser = user
      return user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Login a user
  public async login(email: string, password: string): Promise<User> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
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

      this.currentUser = user
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout the current user
  public async logout(): Promise<void> {
    try {
      // In a real implementation, this would make an API call to the backend
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Logout failed")
      }

      this.currentUser = null
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  // Check if the current user has a specific role
  public hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role
  }

  // Check if the current user has a specific permission
  public hasPermission(permission: string): boolean {
    return this.currentUser?.hasPermission(permission) || false
  }
}
