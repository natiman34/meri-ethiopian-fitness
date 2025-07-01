"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(false); // Separate loading state for profile
    const [isInitialized, setIsInitialized] = useState(false);
    const [authError, setAuthError] = useState(null); // Track auth errors
    const [isPasswordResetMode, setIsPasswordResetMode] = useState(false); // Track password reset mode
    const ensureProfile = useCallback(async (sessionUser) => {
        if (!sessionUser?.id) {
            console.error("ensureProfile: Invalid session user data provided.", sessionUser);
            throw new Error("Invalid session user data");
        }
        setIsProfileLoading(true);
        setAuthError(null);
        const userId = sessionUser.id;
        try {
            console.log("ensureProfile: Starting profile check for user ID:", userId);
            let existingProfile = null;
            let selectError = null;
            // Simplified profile fetch with better error handling
            console.log(`ensureProfile: Attempting to select profile for user ID: ${userId}...`);
            const { data, error } = await supabase
                .from("user_profiles")
                .select("id, full_name, email, role, height, weight, bmi")
                .eq("id", userId)
                .single();
            if (error) {
                if (error.code === "PGRST116") {
                    console.log(`ensureProfile: Profile not found (PGRST116) - will create new profile.`);
                    existingProfile = null;
                    selectError = error;
                }
                else {
                    console.error(`ensureProfile: Database error:`, error);
                    throw error;
                }
            }
            else {
                console.log(`ensureProfile: Profile found successfully.`);
                existingProfile = data;
                selectError = null;
            }
            if (selectError && selectError.code !== "PGRST116") {
                console.error("ensureProfile: Select profile failed after retries with unhandled error:", selectError);
                throw selectError;
            }
            if (existingProfile) {
                console.log("ensureProfile: Found existing profile after select attempts:", existingProfile);
                return {
                    id: userId,
                    name: existingProfile.full_name || "",
                    email: existingProfile.email || sessionUser.email || "",
                    role: (existingProfile.role || sessionUser.user_metadata?.role || "user"),
                    height: existingProfile.height || null,
                    weight: existingProfile.weight || null,
                    bmi: existingProfile.bmi || null,
                };
            }
            console.log("ensureProfile: No existing profile found after select attempts, attempting to create new profile.");
            const newProfile = {
                id: userId,
                email: sessionUser.email || "",
                full_name: sessionUser.user_metadata?.full_name || "",
                role: (sessionUser.user_metadata?.role || "user"),
            };
            const { data: insertedProfile, error: insertError } = await supabase
                .from("user_profiles")
                .insert([newProfile])
                .select("id, full_name, email, role, height, weight, bmi")
                .single();
            if (insertError) {
                console.error("ensureProfile: Insert profile error:", insertError);
                if (insertError.code === '23505') {
                    console.warn("ensureProfile: Insert conflict (profile likely already exists), attempting to fetch profile again after insert failure.");
                    const { data: profileAfterConflict, error: selectAfterConflictError } = await supabase
                        .from("user_profiles")
                        .select("id, full_name, email, role, height, weight, bmi")
                        .eq("id", userId)
                        .single();
                    if (profileAfterConflict) {
                        console.log("ensureProfile: Successfully fetched profile after insert conflict.", profileAfterConflict);
                        return {
                            id: profileAfterConflict.id,
                            name: profileAfterConflict.full_name || "",
                            email: profileAfterConflict.email || sessionUser.email || "",
                            role: (profileAfterConflict.role || sessionUser.user_metadata?.role || "user"),
                            height: profileAfterConflict.height || null, // Include height
                            weight: profileAfterConflict.weight || null, // Include weight
                            bmi: profileAfterConflict.bmi || null, // Include bmi
                        };
                    }
                    else {
                        console.error("ensureProfile: Failed to fetch profile after insert conflict:", selectAfterConflictError);
                        throw insertError;
                    }
                }
                else {
                    throw insertError;
                }
            }
            if (insertedProfile) { // 'insertedProfile' here is from the insert operation with single()
                console.log("ensureProfile: Successfully created new profile and received data:", insertedProfile);
                return {
                    id: insertedProfile.id,
                    name: insertedProfile.full_name || "",
                    email: insertedProfile.email || sessionUser.email || "",
                    role: (insertedProfile.role || sessionUser.user_metadata?.role || "user"),
                    height: insertedProfile.height || null, // Include height
                    weight: insertedProfile.weight || null, // Include weight
                    bmi: insertedProfile.bmi || null, // Include bmi
                };
            }
            else {
                console.warn("ensureProfile: Insert seemed successful, but no data returned. Attempting to fetch profile after insert.");
                const { data: profileAfterInsert, error: selectAfterInsertError } = await supabase
                    .from("user_profiles")
                    .select("id, full_name, email, role, height, weight, bmi") // Ensure height, weight, bmi are selected after insert
                    .eq("id", userId)
                    .single();
                if (profileAfterInsert) {
                    console.log("ensureProfile: Successfully fetched profile after insert.", profileAfterInsert);
                    return {
                        id: profileAfterInsert.id,
                        name: profileAfterInsert.full_name || "",
                        email: profileAfterInsert.email || sessionUser.email || "",
                        role: (profileAfterInsert.role || sessionUser.user_metadata?.role || "user"),
                        height: profileAfterInsert.height || null, // Include height
                        weight: profileAfterInsert.weight || null, // Include weight
                        bmi: profileAfterInsert.bmi || null, // Include bmi
                    };
                }
                else {
                    console.error("ensureProfile: Failed to fetch profile after insert:", selectAfterInsertError);
                    throw new Error("Failed to retrieve profile after successful creation.");
                }
            }
        }
        catch (error) {
            console.error("ensureProfile: Caught exception:", error);
            setAuthError(error instanceof Error ? error : new Error("Failed to ensure user profile"));
            throw error;
        }
        finally {
            console.log("ensureProfile: Finished profile check for user ID:", userId);
            setIsProfileLoading(false);
        }
    }, []);
    useEffect(() => {
        console.log("AUTH_PROVIDER: Setting up auth state change handler");
        let isMounted = true;
        let authChangeTimeout;
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
                        }
                        catch (profileError) {
                            console.error("AUTH_PROVIDER: Error loading initial profile:", profileError);
                            if (isMounted) {
                                setAuthError(profileError instanceof Error ? profileError : new Error("Failed to load initial user profile"));
                                setUser(null); // Ensure user is null if profile load fails
                            }
                        }
                        finally { // Ensure loading states are turned off
                            if (isMounted) {
                                setIsProfileLoading(false);
                            }
                        }
                    }
                    else {
                        console.log("AUTH_PROVIDER: No initial session found.");
                        if (isMounted) {
                            setUser(null);
                        }
                    }
                }
            }
            catch (error) {
                console.error("AUTH_PROVIDER: Unexpected error during initial auth initialization:", error);
                if (isMounted) {
                    setAuthError(error instanceof Error ? error : new Error("Failed to initialize authentication"));
                    setUser(null);
                    setSession(null);
                }
            }
            finally { // Ensure loading states are turned off after initial check
                if (isMounted) {
                    setIsLoading(false);
                    setIsInitialized(true); // Mark as initialized regardless of auth status
                }
            }
        };
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log(`AUTH_PROVIDER: onAuthStateChange event: ${event}`, newSession ? 'Session data received' : 'No session data');
            if (authChangeTimeout) {
                clearTimeout(authChangeTimeout);
            }
            const delay = (event === "SIGNED_OUT") ? 0 : 100; // Process sign out immediately
            authChangeTimeout = setTimeout(async () => {
                if (!isMounted)
                    return;
                if (event === "SIGNED_OUT") {
                    console.log("AUTH_PROVIDER: User signed out - clearing states.");
                    setSession(null);
                    setUser(null);
                    setAuthError(null);
                    setIsLoading(false); // Ensure loading is false on sign out
                    setIsProfileLoading(false); // Ensure profile loading is false
                    return;
                }
                if (isPasswordResetMode && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
                    console.log(`AUTH_PROVIDER: Password reset mode - handling ${event} event`);
                    // Check if this is a legitimate password reset session
                    const isPasswordResetSession = sessionStorage.getItem('password_reset_tokens');
                    const isOnPasswordResetPage = window.location.pathname.includes('set-new-password');
                    if (isPasswordResetSession && isOnPasswordResetPage) {
                        console.log("AUTH_PROVIDER: Allowing password reset session to proceed");
                        // Allow the session for password reset, but don't set user state
                        setSession(newSession);
                        return;
                    }
                    else {
                        console.log("AUTH_PROVIDER: SECURITY - Blocking non-password-reset session during reset mode");
                        if (newSession) {
                            console.log("AUTH_PROVIDER: SECURITY - Force signing out unauthorized session");
                            setTimeout(async () => {
                                await supabase.auth.signOut();
                            }, 0);
                        }
                        return;
                    }
                }
                setSession(newSession);
                setAuthError(null); // Clear previous errors on a new auth event
                if (newSession?.user) {
                    console.log("AUTH_PROVIDER: Auth state changed (SIGNED_IN or other), ensuring profile...");
                    try {
                        setIsProfileLoading(true);
                        const userProfile = await ensureProfile(newSession.user);
                        if (isMounted) {
                            setUser(userProfile);
                            console.log("AUTH_PROVIDER: Profile loaded after state change.", userProfile);
                        }
                    }
                    catch (profileError) {
                        console.error("AUTH_PROVIDER: Error loading profile after state change:", profileError);
                        if (isMounted) {
                            setAuthError(profileError instanceof Error ? profileError : new Error("Failed to load user profile after auth change"));
                            setUser(null); // Ensure user is null if profile load fails
                        }
                    }
                    finally {
                        if (isMounted) {
                            setIsProfileLoading(false);
                        }
                    }
                }
                else { // Should not happen for SIGNED_IN but good fallback
                    console.log("AUTH_PROVIDER: Auth state changed, but no user in session.");
                    if (isMounted) {
                        setUser(null);
                    }
                }
                if (isMounted && isLoading)
                    setIsLoading(false);
            }, delay); // Apply debounce delay
        });
        initializeAuth();
        return () => {
            isMounted = false;
            if (authChangeTimeout) {
                clearTimeout(authChangeTimeout);
            }
            if (subscription) {
                subscription.unsubscribe();
                console.log("AUTH_PROVIDER: Auth state change listener unsubscribed.");
            }
            else {
                console.log("AUTH_PROVIDER: Auth listener subscription not found for unsubscribe.");
            }
        };
    }, [ensureProfile]); // Removed isLoading from dependencies
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            console.log("Attempting login for:", email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                console.error("Sign in error:", error);
                let errorMessage = "Login failed. Please try again.";
                if (error.message?.includes("Invalid login credentials")) {
                    errorMessage = "Invalid email or password. Please check your credentials and try again.";
                }
                else if (error.message?.includes("Email not confirmed")) {
                    errorMessage = "Your email has not been confirmed. Please check your inbox for a confirmation email.";
                }
                else if (error.message?.includes("Too many requests")) {
                    errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
                }
                else if (error.message?.includes("User not found")) {
                    errorMessage = "No account found with this email address. Please check your email or create a new account.";
                }
                else if (error.message) {
                    errorMessage = error.message;
                }
                const customError = new Error(errorMessage);
                setAuthError(customError);
                throw customError;
            }
            if (!data?.user) {
                const err = new Error("No user data returned from login");
                setAuthError(err);
                throw err;
            }
            console.log("Login successful for user:", data.user.email);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error("Login failed");
            setAuthError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(async () => {
        try {
            setUser(null);
            setSession(null);
            setAuthError(null);
            setIsLoading(true);
            await supabase.auth.signOut();
        }
        catch (error) {
            console.error("Error signing out:", error);
            setAuthError(error instanceof Error ? error : new Error("Failed to sign out"));
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const register = useCallback(async (name, email, password) => {
        setIsLoading(true);
        try {
            // Normalize email input
            const normalizedEmail = email.toLowerCase().trim();
            const trimmedName = name.trim();
            // Validate inputs
            if (!normalizedEmail || !trimmedName || !password) {
                throw new Error("All fields are required");
            }
            // Enhanced duplicate user check using secure database function
            console.log("Checking for existing user with email:", normalizedEmail);
            // Use the secure email_exists function to check for duplicates
            // This bypasses RLS policies while maintaining security
            try {
                console.log("Calling email_exists RPC function...");
                const { data: emailExistsResult, error: emailCheckError } = await supabase
                    .rpc('email_exists', { email_to_check: normalizedEmail });
                console.log("RPC result:", { emailExistsResult, emailCheckError });
                if (emailCheckError) {
                    console.warn("Error checking email existence:", emailCheckError);
                    console.log("RPC function may not exist or be accessible, falling back to direct check...");
                    // Fallback: Try direct table check with service role if possible
                    const { data: existingProfiles, error: profileCheckError } = await supabase
                        .from("user_profiles")
                        .select("email")
                        .eq("email", normalizedEmail)
                        .limit(1);
                    console.log("Direct check result:", { existingProfiles, profileCheckError });
                    if (profileCheckError) {
                        console.warn("Direct table check also failed:", profileCheckError);
                        console.log("RLS policies may be blocking access. This is expected during registration.");
                        console.log("Proceeding with registration - database constraints will prevent duplicates");
                    }
                    else if (existingProfiles && existingProfiles.length > 0) {
                        console.log("User already exists (found via direct table check)");
                        return "existing_user";
                    }
                }
                else if (emailExistsResult === true) {
                    console.log("User already exists (found via email_exists RPC function)");
                    return "existing_user";
                }
                else {
                    console.log("Email is available for registration (RPC function returned false)");
                }
            }
            catch (checkError) {
                console.warn("Email existence check failed with exception:", checkError);
                console.log("Proceeding with registration - database constraints and trigger will prevent duplicates");
            }
            // Attempt to register the user with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: normalizedEmail,
                password,
                options: {
                    data: {
                        full_name: trimmedName,
                        role: "user" // Default role for new registrations
                    }
                }
            });
            if (error) {
                console.error("Supabase Auth signUp error:", error);
                // Handle specific Supabase Auth errors that indicate existing user
                if (error.message.includes('User already registered') ||
                    error.message.includes('already been registered') ||
                    error.message.includes('Email address already registered') ||
                    error.message.includes('email address is already registered') ||
                    error.message.includes('duplicate key value') ||
                    error.code === '23505' || // PostgreSQL unique constraint violation
                    error.status === 422) {
                    console.log("Registration failed: User already exists in auth system");
                    return "existing_user";
                }
                // Handle rate limiting
                if (error.message.includes('rate limit') || error.status === 429) {
                    throw new Error("Too many registration attempts. Please try again later.");
                }
                // Handle database constraint violations (from our new unique constraint)
                if (error.message.includes('user_profiles_email_unique') ||
                    error.message.includes('violates unique constraint')) {
                    console.log("Registration failed: Email already exists (database constraint)");
                    return "existing_user";
                }
                throw error;
            }
            // Check if user was created successfully
            if (!data?.user) {
                throw new Error("User registration failed: No user data returned");
            }
            console.log("User registration successful:", {
                userId: data.user.id,
                email: data.user.email,
                emailConfirmed: !!data.user.email_confirmed_at
            });
            // Check if email confirmation is required
            if (data.user && !data.user.email_confirmed_at) {
                console.log("Registration successful, email confirmation required");
                return "confirm_email";
            }
            console.log("Registration successful and user is immediately confirmed");
            return "success";
        }
        catch (error) {
            console.error("Registration error:", error);
            // Handle specific error cases that indicate existing user
            if (error?.message?.includes('User already registered') ||
                error?.message?.includes('already been registered') ||
                error?.message?.includes('Email address already registered') ||
                error?.message?.includes('email address is already registered') ||
                error?.message?.includes('duplicate key value') ||
                error?.message?.includes('user_profiles_email_unique') ||
                error?.message?.includes('violates unique constraint') ||
                error?.code === '23505') { // PostgreSQL unique constraint violation
                console.log("Registration error indicates existing user:", error.message);
                return "existing_user";
            }
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Reset password function
    const resetPassword = useCallback(async (email) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            console.log("Starting password reset for email:", email);
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Please enter a valid email address.");
            }
            // Get the current origin and ensure it's properly formatted
            const origin = window.location.origin;
            const redirectUrl = `${origin}/set-new-password`;
            console.log("Current window.location.origin:", origin);
            console.log("Sending password reset with redirect URL:", redirectUrl);
            // Also log the port for debugging
            console.log("Current port:", window.location.port);
            // Note: We don't check user existence beforehand for security reasons
            // Supabase will handle user validation internally and only send emails to existing users
            // Check if we're in local development
            const isLocalDevelopment = origin.includes('localhost') || origin.includes('127.0.0.1');
            if (isLocalDevelopment) {
                console.log("Local development detected - email service not available");
                console.log("For local testing, please use the OTP reset method or check the browser console for reset instructions");
                // For local development, provide instructions
                throw new Error("Email service not available in local development. Please use the 'Reset with OTP' option or contact support.");
            }
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });
            if (error) {
                console.error("Supabase password reset error:", error);
                // Provide specific error messages based on Supabase error codes
                if (error.message?.includes("User not found") || error.message?.includes("not found")) {
                    throw new Error("No account found with this email address. Please check your email or create a new account.");
                }
                else if (error.message?.includes("rate limit") || error.message?.includes("Too many")) {
                    throw new Error("Too many password reset attempts. Please wait a few minutes before trying again.");
                }
                else if (error.message?.includes("Email rate limit")) {
                    throw new Error("Too many password reset emails sent. Please wait before requesting another.");
                }
                else {
                    throw new Error(error.message || "Failed to send password reset email. Please try again.");
                }
            }
            console.log("Password reset email sent successfully:", data);
            // The email has been sent successfully
            // Supabase will automatically send the email with the reset link
        }
        catch (error) {
            console.error("Password reset error:", error);
            setAuthError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Update profile function
    const updateProfile = useCallback(async (updates) => {
        if (!user)
            throw new Error("No user logged in");
        setIsLoading(true);
        setAuthError(null);
        try {
            // 1. Update email in Supabase Auth if provided and different from current
            if (updates.email && updates.email !== user.email) {
                console.log("Attempting to update email in Supabase Auth for user:", user.id);
                const { data: authUpdateData, error: authUpdateError } = await supabase.auth.updateUser({
                    email: updates.email
                });
                if (authUpdateError) {
                    console.error("Supabase Auth email update error:", authUpdateError);
                    setIsLoading(false);
                    setAuthError(authUpdateError);
                    throw authUpdateError;
                }
                console.log("Supabase Auth email update successful or pending confirmation.", authUpdateData);
            }
            // 2. Update profile details in user_profiles table
            console.log("Attempting to update profile in user_profiles table for user:", user.id);
            const profileUpdates = {
                updated_at: new Date().toISOString()
            };
            if (updates.name !== undefined)
                profileUpdates.full_name = updates.name; // Map name to full_name
            if (updates.role !== undefined)
                profileUpdates.role = updates.role;
            if (updates.email !== undefined) {
                profileUpdates.email = updates.email;
            }
            // Add height, weight, and bmi to updates if provided
            if (updates.height !== undefined)
                profileUpdates.height = updates.height;
            if (updates.weight !== undefined)
                profileUpdates.weight = updates.weight;
            if (updates.bmi !== undefined)
                profileUpdates.bmi = updates.bmi;
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
        }
        catch (error) {
            console.error("Profile update caught exception:", error);
            const err = error instanceof Error ? error : new Error("Profile update failed");
            setAuthError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, [user]);
    // Password reset mode control functions
    const setPasswordResetMode = useCallback((enabled) => {
        console.log("AUTH_PROVIDER: Setting password reset mode:", enabled);
        setIsPasswordResetMode(enabled);
    }, []);
    // Computed properties
    const isAuthenticated = !!session && !!user;
    const isAdmin = isAuthenticated && (user?.role === "admin_super" ||
        user?.role === "admin_nutritionist" ||
        user?.role === "admin_fitness" ||
        String(user?.role).startsWith("admin_") // Additional safety check
    );
    const isSuperAdmin = isAuthenticated && user?.role === "admin_super";
    const isContentManager = isAuthenticated && (isAdmin || user?.role === "nutritionist" || user?.role === "planner");
    // Log authentication state for debugging
    useEffect(() => {
        console.log("AUTH CONTEXT STATE:", {
            isAuthenticated,
            isAdmin,
            isSuperAdmin,
            userRole: user?.role,
            sessionExists: !!session
        });
    }, [isAuthenticated, isAdmin, isSuperAdmin, user?.role, session]);
    const contextValue = {
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
        updateProfile,
        setPasswordResetMode,
        isPasswordResetMode
    };
    return (_jsx(AuthContext.Provider, { value: contextValue, children: isInitialized ? (children) : (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "text-lg", children: "Loading..." }) })) }));
};
export default AuthContext;
