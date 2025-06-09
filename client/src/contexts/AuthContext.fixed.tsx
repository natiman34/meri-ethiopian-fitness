"use client"

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from "react"
import { supabase } from "../lib/supabase"
import { Session, User as SupabaseUser, AuthError } from "@supabase/supabase-js"

// Define types for roles
type UserRole = "user" | "admin_super" | "admin_nutritionist" | "admin_fitness" | "nutritionist" | "planner"

// Define our custom User type with role
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Auth context type
interface AuthContextType {
  session: Session | null
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isContentManager: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<"success" | "confirm_email" | "existing_user">
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Ensure user profile exists in user_profiles table
  const ensureProfile = useCallback(async (sessionUser: SupabaseUser): Promise<User> => {
    try {
      if (!sessionUser?.id) {
        throw new Error("Invalid session user data")
      }

      console.log("Ensuring profile for user:", sessionUser.id)
      console.log("User metadata:", sessionUser.user_metadata)

      // Check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single()

      if (selectError) {
        if (selectError.code === "PGRST116") {
          // Record not found - this is expected for new users
          console.log("No existing profile found, will create new one")
        } else {
          console.error("Error checking existing profile:", selectError)
          throw selectError
        }
      }

      if (existingProfile) {
        console.log("Found existing profile:", existingProfile)
        const user: User = {
          id: sessionUser.id,
          name: existingProfile.full_name || "",
          email: sessionUser.email || "",
          role: (existingProfile.role || sessionUser.user_metadata?.role || "user") as UserRole
        }
        setUser(user)
        return user
      }

      // Create new profile if none exists
      console.log("Creating new profile for user")
      const newProfile = {
        id: sessionUser.id,
        email: sessionUser.email,
        full_name: sessionUser.user_metadata?.full_name || "",
        role: (sessionUser.user_metadata?.role || "user") as UserRole,
      }

      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert([newProfile])

      if (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }

      const user: User = {
        id: sessionUser.id,
        name: newProfile.full_name,
        email: sessionUser.email || "",
        role: newProfile.role
      }

      setUser(user)
      return user
    } catch (error) {
      console.error("Error in ensureProfile:", error)
      throw error
    }
  }, [])

  // Handle auth state changes
  useEffect(() => {
    console.log("Setting up auth state change handler")
    let isMounted = true

    const initAuth = async () => {
      try {
        setIsInitialized(false)
        setIsLoading(true)

        // Get initial session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          if (isMounted) {
            setUser(null)
            setSession(null)
          }
          return
        }

        const currentSession = data.session
        
        if (isMounted) {
          setSession(currentSession)
        }

        if (currentSession?.user) {
          console.log("Found existing session, loading user profile")
          try {
            const userProfile = await ensureProfile(currentSession.user)
            if (isMounted) {
              setUser(userProfile)
            }
          } catch (profileError) {
            console.error("Error loading initial profile:", profileError)
            if (isMounted) {
              setUser(null)
            }
          }
        } else {
          console.log("No active session found")
          if (isMounted) {
            setUser(null)
          }
        }
      } catch (err) {
        console.error("Unexpected error initializing auth:", err)
        if (isMounted) {
          setUser(null)
          setSession(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    // Initialize auth
    initAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event)

        if (isMounted) {
          setSession(newSession)
        }

        if (event === "SIGNED_IN" && newSession?.user) {
          console.log("User signed in, loading profile")
          try {
            const userProfile = await ensureProfile(newSession.user)
            if (isMounted) {
              setUser(userProfile)
            }
          } catch (error) {
            console.error("Error loading profile on sign in:", error)
            if (isMounted) {
              setUser(null)
            }
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out")
          if (isMounted) {
            setUser(null)
          }
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [ensureProfile])

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      console.log("Attempting login for:", email)
      
      // Simple direct login attempt
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        console.error("Sign in error:", error)
        throw new Error("Invalid email or password. Please check your credentials and try again.")
      }

      console.log("Sign in successful:", data)

      if (!data?.user) {
        throw new Error("No user data returned from login")
      }
      
      // Session is handled by auth state change listener
    } catch (error) {
      const err = error as Error | AuthError
      console.error("Login error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register function
  const register = useCallback(async (name: string, email: string, password: string): Promise<"success" | "confirm_email" | "existing_user"> => {
    setIsLoading(true)
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from("user_profiles")
        .select("email")
        .eq("email", email)
      
      if (existingUsers && existingUsers.length > 0) {
        return "existing_user"
      }
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "user" // Default role for new registrations
          }
        }
      })
      
      if (error) throw error
      
      // Check if email confirmation is required
      if (data?.user && !data.user.email_confirmed_at) {
        return "confirm_email"
      }
      
      return "success"
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }, [])

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error("No user logged in")
    
    setIsLoading(true)
    try {
      // Update in user_profiles table
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: updates.name,
          role: updates.role,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
      
      if (error) throw error
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Computed properties
  const isAuthenticated = !!user
  const isAdmin = isAuthenticated && (
    user?.role === "admin_super" || 
    user?.role === "admin_nutritionist" || 
    user?.role === "admin_fitness"
  )
  const isSuperAdmin = isAuthenticated && user?.role === "admin_super"
  const isContentManager = isAuthenticated && (
    isAdmin || user?.role === "nutritionist" || user?.role === "planner"
  )

  const contextValue: AuthContextType = {
    session,
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isContentManager,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {isInitialized ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  )
}

export default AuthContext
