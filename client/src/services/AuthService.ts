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
      // This service is deprecated - authentication is now handled by AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("AuthService.register is deprecated. Use AuthContext instead.");
      throw new Error("This authentication method is deprecated. Please use the main authentication system.");
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Login a user
  public async login(email: string, password: string): Promise<User> {
    try {
      // This service is deprecated - authentication is now handled by AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("AuthService.login is deprecated. Use AuthContext instead.");
      throw new Error("This authentication method is deprecated. Please use the main authentication system.");
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout the current user
  public async logout(): Promise<void> {
    try {
      // This service is deprecated - authentication is now handled by AuthContext with Supabase
      // This method is kept for backward compatibility but should not be used
      console.warn("AuthService.logout is deprecated. Use AuthContext instead.");
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
