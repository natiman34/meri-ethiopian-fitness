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

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    console.log("Current window.location.origin:", window.location.origin);
    const checkToken = async () => {
      try {
        console.log("Checking password reset token...");
        
        // Get the access token and refresh token from URL hash parameters
        const hash = window.location.hash.substring(1); // Remove the leading #
        const hashParams = new URLSearchParams(hash);
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type'); // Keep type for consistency, though not strictly needed for token validation
        
        console.log("URL hash parameters:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (!accessToken) {
          setError("Invalid or missing reset token. Please request a new password reset.");
          setIsCheckingToken(false);
          return;
        }

        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          console.error("Token validation error:", error);
          
          // Provide specific error messages
          if (error.message?.includes("expired")) {
            setError("The password reset link has expired. Please request a new password reset.");
          } else if (error.message?.includes("invalid")) {
            setError("Invalid reset token. Please request a new password reset.");
          } else {
            setError("Invalid or expired reset token. Please request a new password reset.");
          }
          
          setIsCheckingToken(false);
          return;
        }

        if (data.session) {
          console.log("Valid session established for password reset");
          setIsValidToken(true);
        } else {
          console.error("No session established after token validation");
          setError("Invalid or expired reset token. Please request a new password reset.");
        }
      } catch (err) {
        console.error("Error checking token:", err);
        setError("An error occurred while validating the reset token.");
      } finally {
        setIsCheckingToken(false);
      }
    }

    checkToken()
  }, [searchParams])

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
      console.log("Updating password for user...");
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error("Password update error:", error);
        throw error
      }

      console.log("Password updated successfully:", data);
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Password updated successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been reset. You will be redirected to the login page in a few seconds.
                </p>
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