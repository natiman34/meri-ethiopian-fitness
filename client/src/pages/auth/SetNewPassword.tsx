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
  const [tokenExpiryWarning, setTokenExpiryWarning] = useState("")

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Helper function to check token expiration
  const checkTokenExpiry = (token: string): { isExpired: boolean, expiresIn: number, warning: string } => {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return { isExpired: true, expiresIn: 0, warning: "" };

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = payload.exp;

      if (!expiryTime) return { isExpired: false, expiresIn: Infinity, warning: "" };

      const expiresIn = expiryTime - currentTime;
      const isExpired = expiresIn <= 0;

      let warning = "";
      if (!isExpired && expiresIn < 300) { // Less than 5 minutes
        const minutes = Math.floor(expiresIn / 60);
        warning = `Your password reset link will expire in ${minutes < 1 ? 'less than 1 minute' : `${minutes} minute${minutes > 1 ? 's' : ''}`}. Please complete the password reset quickly.`;
      }

      return { isExpired, expiresIn, warning };
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return { isExpired: false, expiresIn: 0, warning: "" };
    }
  }

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

            // Additional security: Validate token structure and basic JWT format
            try {
              // Test token validity by attempting to decode (basic validation)
              const tokenParts = accessToken.split('.');
              if (tokenParts.length === 3) {
                // Check token expiration and validity
                const { isExpired, warning } = checkTokenExpiry(accessToken);

                if (isExpired) {
                  console.warn("Token has expired");
                  setError("Your password reset link has expired. Please request a new password reset.");
                  return;
                }

                if (warning) {
                  setTokenExpiryWarning(warning);
                  console.warn("Token expiry warning:", warning);
                }

                // Try to decode the payload for additional validation
                try {
                  const payload = JSON.parse(atob(tokenParts[1]));

                  // Check if it's a recovery token
                  if (payload.aud !== 'authenticated' && !payload.recovery_sent_at) {
                    console.warn("Token doesn't appear to be a valid recovery token");
                  }

                  console.log("Token structure validation passed");
                } catch (decodeError) {
                  console.warn("Could not decode token payload, but proceeding with basic validation");
                }

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

          // Check sessionStorage for tokens from OTP flow
          console.log("Checking sessionStorage for OTP tokens...");
          const storedTokens = sessionStorage.getItem('password_reset_tokens');
          if (storedTokens) {
            try {
              const parsedTokens = JSON.parse(storedTokens);
              console.log("Found tokens in sessionStorage:", {
                hasTokens: !!parsedTokens.accessToken,
                tokenLength: parsedTokens.accessToken?.length || 0,
                hasRefreshToken: !!parsedTokens.refreshToken,
                email: parsedTokens.email,
                userId: parsedTokens.userId
              });

              if (parsedTokens.accessToken) {
                // Validate the stored token
                const { isExpired, warning } = checkTokenExpiry(parsedTokens.accessToken);

                if (isExpired) {
                  console.warn("Stored OTP token has expired");
                  setError("Your password reset session has expired. Please request a new password reset.");
                  return;
                }

                if (warning) {
                  setTokenExpiryWarning(warning);
                  console.warn("OTP token expiry warning:", warning);
                }

                setResetTokens({
                  accessToken: parsedTokens.accessToken,
                  refreshToken: parsedTokens.refreshToken || null
                });
                setIsValidToken(true);
                console.log("OTP tokens validated successfully");
                return; // Exit early, tokens are valid
              }
            } catch (error) {
              console.error("Error parsing stored tokens:", error);
              sessionStorage.removeItem('password_reset_tokens'); // Clean up invalid tokens
            }
          }

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

      // Enhanced approach: Handle valid recovery tokens properly
      console.log("Attempting password update with reset tokens...");

      const storedTokens = sessionStorage.getItem('password_reset_tokens');
      const isFromOTP = !!storedTokens;

      console.log("Token details:", {
        hasAccessToken: !!resetTokens.accessToken,
        hasRefreshToken: !!resetTokens.refreshToken,
        accessTokenLength: resetTokens.accessToken?.length || 0,
        tokenPrefix: resetTokens.accessToken?.substring(0, 20) + "...",
        isFromOTP,
        storedTokensExist: !!storedTokens
      });

      let sessionData = null;
      let sessionError = null;

      if (isFromOTP) {
        // For OTP-based reset, the session might already be active
        console.log("OTP-based reset detected, checking current session...");

        const { data: currentSession } = await supabase.auth.getSession();

        if (currentSession.session && currentSession.session.user) {
          console.log("Valid session already exists from OTP verification");
          sessionData = currentSession;
        } else {
          console.log("No active session, attempting to restore from tokens...");

          // Try to restore the session from stored tokens
          const { data: restoredSession, error: restoreError } = await supabase.auth.setSession({
            access_token: resetTokens.accessToken,
            refresh_token: resetTokens.refreshToken || '',
          });

          sessionData = restoredSession;
          sessionError = restoreError;
        }
      } else {
        // For URL-based reset, establish session normally
        console.log("URL-based reset, establishing session...");

        const { data: urlSession, error: urlError } = await supabase.auth.setSession({
          access_token: resetTokens.accessToken,
          refresh_token: resetTokens.refreshToken || '',
        });

        sessionData = urlSession;
        sessionError = urlError;
      }

      if (sessionError) {
        console.error("Failed to establish reset session:", sessionError);
        console.error("Session error details:", {
          message: sessionError.message,
          status: sessionError.status,
          name: sessionError.name,
        });

        // Handle specific error cases with more detailed logging
        if (sessionError.message?.includes("expired") || sessionError.message?.includes("JWT expired")) {
          throw new Error("Your password reset link has expired. Please request a new password reset.");
        } else if (sessionError.message?.includes("invalid") || sessionError.message?.includes("Invalid JWT")) {
          throw new Error("Invalid password reset link. Please request a new password reset.");
        } else if (sessionError.message?.includes("403") || sessionError.message?.includes("Forbidden")) {
          throw new Error("Password reset authorization failed. The reset link may be invalid or expired. Please request a new password reset.");
        } else if (sessionError.message?.includes("session missing") || sessionError.message?.includes("Auth session missing")) {
          throw new Error("Password reset session could not be established. Please request a new password reset.");
        } else {
          console.error("Unexpected session error:", sessionError);
          throw new Error(`Unable to verify password reset authorization: ${sessionError.message || 'Unknown error'}. Please request a new password reset.`);
        }
      }

      if (!sessionData?.session?.user) {
        console.error("No valid session or user from reset tokens");
        console.error("Session data:", sessionData);
        throw new Error("Invalid password reset authorization. Please request a new password reset.");
      }

      console.log("Reset session established successfully. User:", {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        role: sessionData.session.user.role
      });

      // Update the password
      console.log("Updating password...");
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      // Check if password update was successful
      if (updateError) {
        console.error("Password update error:", updateError);
        console.error("Update error details:", {
          message: updateError.message,
          status: updateError.status,
          name: updateError.name,
        });

        // Handle specific password update errors
        if (updateError.message?.includes("weak") || updateError.message?.includes("password")) {
          throw new Error("Password is too weak. Please choose a stronger password with at least 8 characters.");
        } else if (updateError.message?.includes("same")) {
          throw new Error("New password must be different from your current password.");
        } else if (updateError.message?.includes("session") || updateError.message?.includes("auth")) {
          throw new Error("Password reset session expired. Please request a new password reset.");
        } else {
          throw new Error(`Failed to update password: ${updateError.message || 'Unknown error'}. Please try again or request a new password reset.`);
        }
      }

      if (!updateData) {
        console.warn("Password update completed but no confirmation data received");
        // Don't throw an error here, as the update might have succeeded
      }

      console.log("Password updated successfully:", updateData);

      // CRITICAL SECURITY: Immediately clear all sessions and tokens
      console.log("Clearing all sessions for security...");

      // Sign out to clear the reset session
      await supabase.auth.signOut();

      // Clear all local storage and session data
      localStorage.clear();
      sessionStorage.clear();

      console.log("All sessions cleared. Password reset complete.");

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

      // Provide user-friendly error messages
      if (err.message?.includes("weak") || err.message?.includes("password")) {
        setError("Password is too weak. Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.")
      } else if (err.message?.includes("expired")) {
        setError("Your password reset link has expired. Please request a new password reset.")
      } else if (err.message?.includes("invalid") || err.message?.includes("Invalid")) {
        setError("Invalid password reset link. Please request a new password reset.")
      } else if (err.message?.includes("session") || err.message?.includes("auth")) {
        setError("Your password reset session has expired. Please request a new password reset.")
      } else if (err.message?.includes("network") || err.message?.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError(err.message || "Failed to update password. Please request a new password reset if the problem persists.")
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Issue</h2>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/reset-password"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Request New Password Reset
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back to Login
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

            {tokenExpiryWarning && (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {tokenExpiryWarning}
                </div>
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