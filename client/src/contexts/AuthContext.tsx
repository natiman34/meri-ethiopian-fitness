"use client"

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo } from "react"
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
  height?: number | null; // Add height field (e.g., in cm or inches)
  weight?: number | null; // Add weight field (e.g., in kg or lbs)
  bmi?: number | null;    // Add BMI field
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
  authError: Error | null
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
  const [isProfileLoading, setIsProfileLoading] = useState(false) // Separate loading state for profile
  const [isInitialized, setIsInitialized] = useState(false)
  const [authError, setAuthError] = useState<Error | null>(null) // Track auth errors

  // Ensure user profile exists in user_profiles table
  const ensureProfile = useCallback(async (sessionUser: SupabaseUser): Promise<User> => {
    if (!sessionUser?.id) {
      console.error("ensureProfile: Invalid session user data provided.", sessionUser);
      throw new Error("Invalid session user data")
    }

    setIsProfileLoading(true)
    setAuthError(null)

    const userId = sessionUser.id;

    try {
      console.log("ensureProfile: Starting profile check for user ID:", userId)

      // Attempt to select profile with a retry for initial load/timing issues
      let existingProfile = null;
      let selectError = null;
      const maxRetries = 3;
      const retryDelay = 100; // milliseconds

      for (let i = 0; i < maxRetries; i++) {
        console.log(`ensureProfile: Attempt ${i + 1} to select profile for user ID: ${userId}...`);
        const { data, error } = await supabase
        .from("user_profiles")
          .select("id, full_name, email, role, height, weight, bmi")
          .eq("id", userId)
        .single();

        if (!error || error.code === "PGRST116") {
          // Success or Profile not found (expected for new users)
          existingProfile = data;
          selectError = error;
          if (error?.code === "PGRST116") {
             console.log(`ensureProfile: Profile not found on attempt ${i + 1} (PGRST116).`);
          } else if (existingProfile) {
             console.log(`ensureProfile: Profile found on attempt ${i + 1}.`);
          }
          break; // Exit loop on success or expected not found error
        } else {
          console.warn(`ensureProfile: Select profile error on attempt ${i + 1}:`, error);
          // Retry only on specific potential timing/RLS errors, or general network errors
          if (error.code === '406' || error.code === '401' || error.code === 'JWT') { // Include common RLS/Auth related error codes
             console.warn(`ensureProfile: Retrying select after potential RLS/Auth error or timing issue.`);
             await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1))); // Exponential backoff
          } else {
            // Unhandled error, re-throw immediately
            console.error(`ensureProfile: Unhandled select error on attempt ${i + 1}, throwing:`, error);
            throw error;
          }
        }
      }

      if (selectError && selectError.code !== "PGRST116") {
         // If loop finished due to persistent unhandled error
         console.error("ensureProfile: Select profile failed after retries with unhandled error:", selectError);
         throw selectError;
      }

      if (existingProfile) {
        console.log("ensureProfile: Found existing profile after select attempts:", existingProfile)
            return {
                id: userId,
          name: existingProfile.full_name || "",
          email: existingProfile.email || sessionUser.email || "", // Prioritize DB email, fallback to session
          role: (existingProfile.role || sessionUser.user_metadata?.role || "user") as UserRole,
          height: existingProfile.height || null, // Include height
          weight: existingProfile.weight || null, // Include weight
          bmi: existingProfile.bmi || null,       // Include bmi
        }
      }

      // Create new profile if none found after retries (only if select returned no profile and error was PGRST116)
      console.log("ensureProfile: No existing profile found after select attempts, attempting to create new profile.")
      const newProfile = {
        id: userId,
        email: sessionUser.email || "", // Use session email as primary source for creation
        full_name: sessionUser.user_metadata?.full_name || "",
                role: (sessionUser.user_metadata?.role || "user") as UserRole,
      }

      // Attempt insert with retry for conflict
      const { data: insertedProfile, error: insertError } = await supabase
        .from("user_profiles")
        .insert([newProfile])
        .select("id, full_name, email, role, height, weight, bmi") // Ensure height, weight, bmi are selected on insert
        .single(); // Use single() here as well to get the inserted row

      if (insertError) {
        console.error("ensureProfile: Insert profile error:", insertError);
        // If insert fails with conflict (409 / 23505), try fetching again in case of a race condition
        if (insertError.code === '23505') { 
          console.warn("ensureProfile: Insert conflict (profile likely already exists), attempting to fetch profile again after insert failure.")
          const { data: profileAfterConflict, error: selectAfterConflictError } = await supabase
            .from("user_profiles")
            .select("id, full_name, email, role, height, weight, bmi") // Ensure height, weight, bmi are selected after conflict
            .eq("id", userId)
            .single();
          
          if (profileAfterConflict) {
            console.log("ensureProfile: Successfully fetched profile after insert conflict.", profileAfterConflict)
             return {
              id: profileAfterConflict.id,
              name: profileAfterConflict.full_name || "",
              email: profileAfterConflict.email || sessionUser.email || "",
              role: (profileAfterConflict.role || sessionUser.user_metadata?.role || "user") as UserRole,
              height: profileAfterConflict.height || null, // Include height
              weight: profileAfterConflict.weight || null, // Include weight
              bmi: profileAfterConflict.bmi || null,       // Include bmi
            }
          } else {
             console.error("ensureProfile: Failed to fetch profile after insert conflict:", selectAfterConflictError)
             // If we can't fetch after a conflict, something is wrong. Re-throw the original insert error.
             throw insertError 
          }
        } else {
          // Handle other insert errors
          throw insertError
        }
      }

      // If insert was successful, the data object from insert contains the new profile
      if (insertedProfile) { // 'insertedProfile' here is from the insert operation with single()
         console.log("ensureProfile: Successfully created new profile and received data:", insertedProfile);
         return {
          id: insertedProfile.id,
          name: insertedProfile.full_name || "",
          email: insertedProfile.email || sessionUser.email || "",
          role: (insertedProfile.role || sessionUser.user_metadata?.role || "user") as UserRole,
          height: insertedProfile.height || null, // Include height
          weight: insertedProfile.weight || null, // Include weight
          bmi: insertedProfile.bmi || null,       // Include bmi
        }
      } else {
        // This case should ideally not be reached if insert is successful with single(), but as a fallback:
         console.warn("ensureProfile: Insert seemed successful, but no data returned. Attempting to fetch profile after insert.");
          const { data: profileAfterInsert, error: selectAfterInsertError } = await supabase
            .from("user_profiles")
            .select("id, full_name, email, role, height, weight, bmi") // Ensure height, weight, bmi are selected after insert
            .eq("id", userId)
            .single();
          
          if (profileAfterInsert) {
            console.log("ensureProfile: Successfully fetched profile after insert.", profileAfterInsert)
        return {
              id: profileAfterInsert.id,
              name: profileAfterInsert.full_name || "",
              email: profileAfterInsert.email || sessionUser.email || "",
              role: (profileAfterInsert.role || sessionUser.user_metadata?.role || "user") as UserRole,
              height: profileAfterInsert.height || null, // Include height
              weight: profileAfterInsert.weight || null, // Include weight
              bmi: profileAfterInsert.bmi || null,       // Include bmi
            }
          } else {
             console.error("ensureProfile: Failed to fetch profile after insert:", selectAfterInsertError)
             // If we can't fetch after a successful insert (no data), throw a generic error
             throw new Error("Failed to retrieve profile after successful creation.")
          }
      }

    } catch (error) {
      console.error("ensureProfile: Caught exception:", error);
      setAuthError(error instanceof Error ? error : new Error("Failed to ensure user profile"))
      throw error
    } finally {
      console.log("ensureProfile: Finished profile check for user ID:", userId)
      setIsProfileLoading(false)
    }
  }, [])

  // Handle auth state changes
  useEffect(() => {
    console.log("AUTH_PROVIDER: Setting up auth state change handler")
    let isMounted = true
    let authChangeTimeout: NodeJS.Timeout

    // This function runs once on mount to get the initial session
    const initializeAuth = async () => {
      try {
        console.log("AUTH_PROVIDER: Initializing auth state.");
        setIsLoading(true);
        setIsInitialized(false);
        setAuthError(null);

        const { data: { session } } = await supabase.auth.getSession();
        console.log("AUTH_PROVIDER: Initial getSession completed. Session:", session ? 'Exists' : 'Null');

        if (isMounted) {
          setSession(session);
          if (session?.user) {
            console.log("AUTH_PROVIDER: Initial session found, ensuring profile...");
             try {
                setIsProfileLoading(true);
                const userProfile = await ensureProfile(session.user);
        if (isMounted) {
            setUser(userProfile);
                    console.log("AUTH_PROVIDER: Initial profile load successful.", userProfile);
                 }
             } catch (profileError) {
                 console.error("AUTH_PROVIDER: Error loading initial profile:", profileError);
                 if (isMounted) {
                     setAuthError(profileError instanceof Error ? profileError : new Error("Failed to load initial user profile"));
                     setUser(null); // Ensure user is null if profile load fails
                 }
             } finally { // Ensure loading states are turned off
                 if (isMounted) {
                     setIsProfileLoading(false);
                 }
             }
          } else {
            console.log("AUTH_PROVIDER: No initial session found.");
            if (isMounted) {
              setUser(null);
            }
          }
        }

      } catch (error) {
        console.error("AUTH_PROVIDER: Unexpected error during initial auth initialization:", error);
        if (isMounted) {
           setAuthError(error instanceof Error ? error : new Error("Failed to initialize authentication"));
           setUser(null);
        setSession(null);
      }
      } finally { // Ensure loading states are turned off after initial check
      if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true); // Mark as initialized regardless of auth status
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`AUTH_PROVIDER: onAuthStateChange event: ${event}`, newSession ? 'Session data received' : 'No session data');
        
        // Clear any existing timeout if event occurs before debounce finishes
        if (authChangeTimeout) {
            clearTimeout(authChangeTimeout);
        }

        // Debounce the auth state change to prevent rapid state updates, 
        // but process SIGNED_OUT immediately for faster UX
        const delay = (event === "SIGNED_OUT") ? 0 : 100; // Process sign out immediately

        authChangeTimeout = setTimeout(async () => {
          if (!isMounted) return

          // Handle sign out specifically first
          if (event === "SIGNED_OUT") {
            console.log("AUTH_PROVIDER: User signed out - clearing states.")
            setSession(null);
            setUser(null);
            setAuthError(null);
            setIsLoading(false); // Ensure loading is false on sign out
            setIsProfileLoading(false); // Ensure profile loading is false
            return;
          }

          // For SIGNED_IN or other events with a session
          setSession(newSession);
          setAuthError(null); // Clear previous errors on a new auth event

          if (newSession?.user) {
            console.log("AUTH_PROVIDER: Auth state changed (SIGNED_IN or other), ensuring profile...");
             try {
                setIsProfileLoading(true);
                // Use ensureProfile to get the user data after a state change
                const userProfile = await ensureProfile(newSession.user);
                if (isMounted) {
                    setUser(userProfile);
                    console.log("AUTH_PROVIDER: Profile loaded after state change.", userProfile);
                }
            } catch (profileError) {
                console.error("AUTH_PROVIDER: Error loading profile after state change:", profileError);
                 if (isMounted) {
                    setAuthError(profileError instanceof Error ? profileError : new Error("Failed to load user profile after auth change"));
                    setUser(null); // Ensure user is null if profile load fails
                 }
            } finally {
                 if (isMounted) {
                     setIsProfileLoading(false);
                 }
            }
          } else { // Should not happen for SIGNED_IN but good fallback
              console.log("AUTH_PROVIDER: Auth state changed, but no user in session.");
              if (isMounted) {
                  setUser(null);
              }
          }
          // isLoading might already be false from initAuth or sign out, 
          // but ensure it's false after processing a potential sign-in
          if (isMounted && isLoading) setIsLoading(false);

        }, delay); // Apply debounce delay
      }
    );

    // Start the initial auth check
    initializeAuth();

    return () => {
      isMounted = false;
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
      if (subscription) {
         subscription.unsubscribe();
        console.log("AUTH_PROVIDER: Auth state change listener unsubscribed.");
      } else {
         console.log("AUTH_PROVIDER: Auth listener subscription not found for unsubscribe.");
      }
    };
  }, [ensureProfile]); // Removed isLoading from dependencies

  // Login function with improved error handling
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setAuthError(null)
    try {
      console.log("Attempting login for:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password 
      })

      if (error) {
        console.error("Sign in error:", error)
        setAuthError(new Error("Invalid email or password. Please check your credentials and try again."))
        throw error
      }

      if (!data?.user) {
        const err = new Error("No user data returned from login")
        setAuthError(err)
        throw err
      }
      
      // Session is handled by auth state change listener
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Login failed")
      setAuthError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function with immediate state clearing
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear states immediately for better UX
      setUser(null)
      setSession(null)
      setAuthError(null)
      setIsLoading(true)
      
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
      setAuthError(error instanceof Error ? error : new Error("Failed to sign out"))
      throw error
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

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    try {
      console.log("Starting password reset for email:", email);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`,
        captchaToken: undefined // Disable captcha for now, can be enabled later
      });

      if (error) {
        console.error("Supabase password reset error:", error);
        
        // Provide specific error messages based on Supabase error codes
        switch (error.message) {
          case "User not found":
            throw new Error("No account found with this email address. Please check your email or create a new account.");
          case "Too many requests":
            throw new Error("Too many password reset attempts. Please wait a few minutes before trying again.");
          case "Email rate limit exceeded":
            throw new Error("Too many password reset emails sent. Please wait before requesting another.");
          default:
            throw error;
        }
      }

      console.log("Password reset email sent successfully:", data);
      
      // The email has been sent successfully
      // Supabase will automatically send the email with the reset link
      
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }, [])

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error("No user logged in")
    
    setIsLoading(true)
    setAuthError(null)

    try {
      let authError: Error | null = null;

      // 1. Update email in Supabase Auth if provided and different from current
      if (updates.email && updates.email !== user.email) {
        console.log("Attempting to update email in Supabase Auth for user:", user.id);
        const { data: authUpdateData, error: authUpdateError } = await supabase.auth.updateUser({
          email: updates.email
        });

        if (authUpdateError) {
          console.error("Supabase Auth email update error:", authUpdateError);
          authError = authUpdateError;
           setIsLoading(false);
           setAuthError(authUpdateError);
           throw authUpdateError;
        }
         console.log("Supabase Auth email update successful or pending confirmation.", authUpdateData);
      }
      
      // 2. Update profile details in user_profiles table
      console.log("Attempting to update profile in user_profiles table for user:", user.id);
      const profileUpdates: { [key: string]: any } = {
        updated_at: new Date().toISOString()
      };

      if (updates.name !== undefined) profileUpdates.full_name = updates.name; // Map name to full_name
      if (updates.role !== undefined) profileUpdates.role = updates.role;
      if (updates.email !== undefined) { 
         profileUpdates.email = updates.email; 
      }
      // Add height, weight, and bmi to updates if provided
      if (updates.height !== undefined) profileUpdates.height = updates.height;
      if (updates.weight !== undefined) profileUpdates.weight = updates.weight;
      if (updates.bmi !== undefined) profileUpdates.bmi = updates.bmi;

      const { error: profileUpdateError } = await supabase
        .from("user_profiles")
        .update(profileUpdates)
        .eq("id", user.id);
      
      if (profileUpdateError) {
        console.error("user_profiles table update error:", profileUpdateError);
        setAuthError(profileUpdateError);
        throw profileUpdateError;
      }
      
      console.log("user_profiles table update successful.");

      // 3. Update local state if updates were successful
      setUser(prev => prev ? { ...prev, ...updates } : null);

    } catch (error) {
      console.error("Profile update caught exception:", error);
      const err = error instanceof Error ? error : new Error("Profile update failed")
      if (!authError) setAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user])

  // Computed properties 
  const isAuthenticated = !!session && !!user
  const isAdmin = isAuthenticated && (
    user?.role === "admin_super" || 
    user?.role === "admin_nutritionist" || 
    user?.role === "admin_fitness" ||
    String(user?.role).startsWith("admin_") // Additional safety check
  )
  const isSuperAdmin = isAuthenticated && user?.role === "admin_super"
  const isContentManager = isAuthenticated && (
    isAdmin || user?.role === "nutritionist" || user?.role === "planner"
  )
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log("AUTH CONTEXT STATE:", { 
      isAuthenticated, 
      isAdmin, 
      isSuperAdmin, 
      userRole: user?.role,
      sessionExists: !!session
    })
  }, [isAuthenticated, isAdmin, isSuperAdmin, user?.role, session])

  const contextValue: AuthContextType = {
    session,
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isContentManager,
    isLoading: isLoading || isProfileLoading, // Combine loading states
    authError,
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {isInitialized ? (
        authError ? (
          <div className="text-red-500 p-4">
            Authentication error: {authError.message}
          </div>
        ) : (
          children
        )
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export default AuthContext
