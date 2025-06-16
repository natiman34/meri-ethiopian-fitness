"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

const VerifyResetOTP: React.FC = () => {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get email from location state or URL params
    const emailFromState = location.state?.email
    const urlParams = new URLSearchParams(location.search)
    const emailFromUrl = urlParams.get('email')

    const userEmail = emailFromState || emailFromUrl
    if (userEmail) {
      setEmail(decodeURIComponent(userEmail))
    } else {
      // If no email provided, redirect back to reset password
      navigate('/reset-password')
    }
  }, [location, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate OTP format (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        setError("Please enter a valid 6-digit code.")
        return
      }

      if (!email) {
        setError("Email not found. Please start the password reset process again.")
        return
      }

      console.log("Verifying OTP:", { email, otp })

      // Verify OTP using Supabase's verifyOtp method
      // For password reset, we use 'recovery' type since we used resetPasswordForEmail
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      })

      if (error) {
        console.error("OTP verification error:", error)
        
        if (error.message?.includes("Token has expired")) {
          setError("The verification code has expired. Please request a new one.")
        } else if (error.message?.includes("Invalid token")) {
          setError("Invalid verification code. Please check and try again.")
        } else if (error.message?.includes("Token not found")) {
          setError("Verification code not found. Please request a new one.")
        } else {
          setError(error.message || "Invalid verification code. Please try again.")
        }
        return
      }

      console.log("OTP verification successful:", data)

      if (data.user && data.session) {
        console.log("OTP verification successful, session created:", {
          userId: data.user.id,
          email: data.user.email,
          hasAccessToken: !!data.session.access_token,
          hasRefreshToken: !!data.session.refresh_token
        });

        // CRITICAL: Store session tokens for password reset
        // These tokens will be used to authenticate the password update request
        const resetTokens = {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          email: email,
          userId: data.user.id,
          expiresAt: data.session.expires_at,
          tokenType: data.session.token_type
        }

        // Store in sessionStorage for security (will be cleared after password reset)
        sessionStorage.setItem('password_reset_tokens', JSON.stringify(resetTokens))

        console.log("Reset tokens stored successfully");

        // IMPORTANT: DO NOT sign out here - it invalidates the recovery tokens!
        // Instead, we'll let the SetNewPassword component handle the session
        // and sign out after the password is successfully updated

        setIsSuccess(true)

        // Navigate to set new password page after a short delay
        setTimeout(() => {
          navigate('/set-new-password', {
            state: {
              email,
              fromOtpVerification: true,
              hasValidTokens: true
            }
          })
        }, 2000)
      } else {
        setError("Verification successful but no session created. Please try again.")
      }

    } catch (err: any) {
      console.error("OTP verification error:", err)
      setError(err.message || "Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setIsLoading(true)

    try {
      // Use resetPasswordForEmail to resend the OTP
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-reset-otp?email=${encodeURIComponent(email)}&type=recovery`
      })

      if (error) {
        setError(error.message || "Failed to resend verification code.")
      } else {
        setError("Verification code resent successfully!")
        setTimeout(() => setError(""), 3000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.")
    } finally {
      setIsLoading(false)
    }
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your verification code has been confirmed. You will be redirected to set your new password.
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  isLoading={isLoading}
                  disabled={otp.length !== 6}
                >
                  Verify Code
                </Button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  className="text-sm text-green-600 hover:text-green-500 disabled:text-gray-400"
                  disabled={isLoading}
                >
                  Didn't receive the code? Resend
                </button>
              </div>
              
              <div className="text-center">
                <Link
                  to="/reset-password"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to email entry
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default VerifyResetOTP
