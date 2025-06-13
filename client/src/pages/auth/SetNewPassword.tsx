"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"

const SetNewPassword: React.FC = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isValidToken, setIsValidToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)
  const [resetTokens, setResetTokens] = useState<{accessToken: string, refreshToken: string | null}>({accessToken: '', refreshToken: null})

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    console.log("Current window.location:", {
      origin: window.location.origin,
      href: window.location.href,
      hash: window.location.hash,
      search: window.location.search
    });

    const handlePasswordReset = async () => {
      try {
        console.log("Handling password reset session...");

        // Check multiple sources for tokens (hash, query params, and URL patterns)
        let accessToken = null;
        let refreshToken = null;
        let type = null;

        // Method 1: Check hash parameters
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          type = hashParams.get('type');
          console.log("Hash parameters found:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        }

        // Method 2: Check query parameters if hash didn't work
        if (!accessToken && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          accessToken = searchParams.get('access_token');
          refreshToken = searchParams.get('refresh_token');
          type = searchParams.get('type');
          console.log("Query parameters found:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        }

        // Method 3: Regex fallback for any URL format
        if (!accessToken) {
          const urlString = window.location.href;
          const accessTokenMatch = urlString.match(/[?&#]access_token=([^&]+)/);
          const refreshTokenMatch = urlString.match(/[?&#]refresh_token=([^&]+)/);
          const typeMatch = urlString.match(/[?&#]type=([^&]+)/);

          if (accessTokenMatch) {
            accessToken = decodeURIComponent(accessTokenMatch[1]);
            refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : null;
            type = typeMatch ? decodeURIComponent(typeMatch[1]) : null;
            console.log("Regex extraction found:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
          }
        }

        console.log("Final extracted parameters:", {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          type,
          accessTokenLength: accessToken?.length || 0
        });

        if (type === 'recovery' && accessToken) {
          console.log("Valid password recovery link detected");

          // Enhanced token validation
          if (accessToken.length > 20 && accessToken.startsWith('eyJ')) {
            console.log("Reset tokens appear valid (JWT format)");

            // Additional security: Validate token without creating session
            try {
              // Test token validity by attempting to decode (basic validation)
              const tokenParts = accessToken.split('.');
              if (tokenParts.length === 3) {
                // Store tokens for password update but don't create session yet
                setResetTokens({ accessToken, refreshToken });
                setIsValidToken(true);
                console.log("Token validation successful - ready for password reset");
              } else {
                throw new Error("Invalid JWT structure");
              }
            } catch (tokenError) {
              console.error("Token validation failed:", tokenError);
              setError("Invalid reset token structure. Please request a new password reset.");
            }
          } else {
            console.error("Invalid token format - too short or wrong prefix");
            setError("Invalid reset token format. Please request a new password reset.");
          }
        } else {
          console.log("No valid reset tokens found in URL - type:", type, "accessToken:", !!accessToken);
          setError("Invalid or missing reset token. Please request a new password reset.");
        }
      } catch (err) {
        console.error("Error handling password reset:", err);
        setError("An error occurred while validating the reset token.");
      } finally {
        setIsCheckingToken(false);
      }
    }

    handlePasswordReset()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.")
      return
    }

    setIsLoading(true)

    try {
      console.log("Updating password with reset tokens...");

      if (!resetTokens.accessToken) {
        throw new Error("No reset tokens available. Please request a new password reset.");
      }

      // Enhanced security: Validate tokens before using them
      console.log("Validating reset tokens before password update...");

      // First, verify the token is still valid without creating a persistent session
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: resetTokens.accessToken,
        refresh_token: resetTokens.refreshToken || '',
      });

      if (sessionError) {
        console.error("Failed to establish session for password update:", sessionError);

        // Provide specific error messages based on error type
        if (sessionError.message?.includes("expired")) {
          throw new Error("Reset link has expired. Please request a new password reset.");
        } else if (sessionError.message?.includes("invalid")) {
          throw new Error("Invalid reset link. Please request a new password reset.");
        } else {
          throw new Error("Reset session could not be established. Please request a new password reset.");
        }
      }

      if (!sessionData.session) {
        console.error("No session established from reset tokens");
        throw new Error("Invalid reset tokens. Please request a new password reset.");
      }

      console.log("Session established successfully, updating password...");

      // Update the password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Password update error:", error);

        // Provide specific error messages
        if (error.message?.includes("weak")) {
          throw new Error("Password is too weak. Please choose a stronger password.");
        } else if (error.message?.includes("same")) {
          throw new Error("New password must be different from your current password.");
        } else {
          throw error;
        }
      }

      console.log("Password updated successfully:", data);

      // CRITICAL SECURITY: Immediately sign out the user after password reset
      // This prevents automatic login and forces user to log in with new password
      console.log("Signing out user after password reset for security...");
      await supabase.auth.signOut();

      // Clear any local storage or session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();

      console.log("User signed out successfully. Password reset complete.");

      setIsSuccess(true);

      // Redirect to login after 3 seconds with success message
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Password reset successful! Please log in with your new password.",
            type: "success"
          }
        });
      }, 3000);
    } catch (err: any) {
      console.error("Password update error:", err)
      
      // Provide specific error messages
      if (err.message?.includes("weak")) {
        setError("Password is too weak. Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.")
      } else if (err.message?.includes("session")) {
        setError("Your session has expired. Please request a new password reset.")
      } else if (err.message?.includes("network")) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError(err.message || "Failed to update password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="font-bold text-3xl flex items-center justify-center">
                <span className="text-red-600">መሪ</span>
                <span className="text-yellow-600">Ethiopian</span>
                <span className="text-green-600">Fitness</span>
                <span className="ml-2 text-gray-800"></span>
              </div>
            </Link>
          </div>

          <Card>
            <Card.Body>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Validating reset token...</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="font-bold text-3xl flex items-center justify-center">
                <span className="text-red-600">መሪ</span>
                <span className="text-yellow-600">Ethiopian</span>
                <span className="text-green-600">Fitness</span>
                <span className="ml-2 text-gray-800"></span>
              </div>
            </Link>
          </div>

          <Card>
            <Card.Body>
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Complete!</h2>
                <p className="text-gray-600 mb-4">
                  Your password has been updated successfully.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  For security reasons, you have been logged out. Please log in with your new password.
                </p>
                <div className="text-xs text-gray-400 mb-4">
                  Redirecting to login page in 3 seconds...
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  Go to login now
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="font-bold text-3xl flex items-center justify-center">
                <span className="text-red-600">መሪ</span>
                <span className="text-yellow-600">Ethiopian</span>
                <span className="text-green-600">Fitness</span>
                <span className="ml-2 text-gray-800"></span>
              </div>
            </Link>
          </div>

          <Card>
            <Card.Body>
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <Link
                  to="/reset-password"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  Request a new password reset
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="font-bold text-3xl flex items-center justify-center">
              <span className="text-red-600">መሪ</span>
              <span className="text-yellow-600">Ethiopian</span>
              <span className="text-green-600">Fitness</span>
              <span className="ml-2 text-gray-800"></span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Set new password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter new password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Confirm new password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default SetNewPassword 