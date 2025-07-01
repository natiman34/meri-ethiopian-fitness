/**
 * AuthService class for handling authentication-related operations
 * Implements the service layer in the three-tier architecture
 */
export class AuthService {
    static instance;
    currentUser = null;
    constructor() {
        // Private constructor to enforce singleton pattern
    }
    // Singleton pattern implementation
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    // Get the current authenticated user
    getCurrentUser() {
        return this.currentUser;
    }
    // Register a new user
    async register(name, email, password) {
        try {
            // This service is deprecated - authentication is now handled by AuthContext with Supabase
            // This method is kept for backward compatibility but should not be used
            console.warn("AuthService.register is deprecated. Use AuthContext instead.");
            throw new Error("This authentication method is deprecated. Please use the main authentication system.");
        }
        catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }
    // Login a user
    async login(email, password) {
        try {
            // This service is deprecated - authentication is now handled by AuthContext with Supabase
            // This method is kept for backward compatibility but should not be used
            console.warn("AuthService.login is deprecated. Use AuthContext instead.");
            throw new Error("This authentication method is deprecated. Please use the main authentication system.");
        }
        catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
    // Logout the current user
    async logout() {
        try {
            // This service is deprecated - authentication is now handled by AuthContext with Supabase
            // This method is kept for backward compatibility but should not be used
            console.warn("AuthService.logout is deprecated. Use AuthContext instead.");
            this.currentUser = null;
        }
        catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }
    // Check if the user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
    // Check if the current user has a specific role
    hasRole(role) {
        return this.currentUser?.role === role;
    }
    // Check if the current user has a specific permission
    hasPermission(permission) {
        return this.currentUser?.hasPermission(permission) || false;
    }
}
