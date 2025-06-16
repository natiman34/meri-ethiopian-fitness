"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [resetMethod, setResetMethod] = useState<'otp' | 'email'>('otp')

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.")
        return
      }

      console.log("Sending password reset OTP to email:", email)

      // Use resetPasswordForEmail with OTP-based recovery
      // This is the correct method for password reset, not signInWithOtp
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-reset-otp?email=${encodeURIComponent(email)}&type=recovery`
      })

      if (error) {
        console.error("Password reset error:", error)

        // Provide user-friendly error messages
        if (error.message?.includes("User not found") ||
            error.message?.includes("not found") ||
            error.message?.includes("Unable to validate email address") ||
            error.message?.includes("Invalid email")) {
          setError("No account found with this email address. Please check your email or create a new account.")
        } else if (error.message?.includes("rate limit") || error.message?.includes("Too many")) {
          setError("Too many password reset requests. Please wait a few minutes before trying again.")
        } else if (error.message?.includes("Email rate limit")) {
          setError("Too many emails sent. Please wait before requesting another password reset.")
        } else {
          // For security, don't reveal if email exists or not
          setError("If an account with this email exists, you will receive a password reset code.")
        }
        return
      }

      console.log("Password reset OTP sent successfully:", data)
      setResetMethod('otp')
      setIsSuccess(true)

    } catch (err: any) {
      console.error("Password reset error:", err)
      setError("If an account with this email exists, you will receive a password reset code.")
    } finally {
      setIsLoading(false)
    }
  }

  const proceedToVerification = () => {
    // Navigate to OTP verification page with email
    navigate("/verify-reset-otp", { state: { email, type: 'recovery' } })
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
                {resetMethod === 'otp' ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">OTP Sent!</h2>
                    <p className="text-gray-600 mb-4">
                      We've sent a 6-digit verification code to:
                    </p>
                    <p className="font-medium text-gray-900 mb-6">{email}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      The code will expire in 1 hour. Please check your email for the 6-digit code and enter it on the next page.
                    </p>

                    <div className="space-y-4">
                      <Button
                        onClick={proceedToVerification}
                        variant="primary"
                        fullWidth
                      >
                        Enter Verification Code
                      </Button>

                      <Button
                        onClick={() => setIsSuccess(false)}
                        variant="outline"
                        fullWidth
                      >
                        Send Another Code
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h2>
                    <p className="text-gray-600 mb-4">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-medium text-gray-900 mb-6">{email}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Click the link in the email to reset your password. The link will expire in 1 hour.
                    </p>

                    <div className="space-y-4">
                      <Button
                        onClick={() => setIsSuccess(false)}
                        variant="outline"
                        fullWidth
                      >
                        Send Another Email
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </Link>
                </div>
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a verification code to reset your password.
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Send Verification Code
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword 