"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Eye, EyeOff } from "lucide-react"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || "/"

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from)
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    console.log("==================== ENHANCED DEBUG INFO =====================")
    console.log("Login attempt starting for email:", email, "at", new Date().toISOString())
    console.log("Using password length:", password.length, "characters")
    console.log("First/last chars of password:", password.substring(0, 1) + "..." + password.substring(password.length - 1))
    console.log("Supabase URL being used:", import.meta.env.VITE_SUPABASE_URL || "NOT FOUND")
    console.log("Is anon key available:", !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    
    try {
      // Try to do a manual API request to check credentials
      console.log("Making direct fetch request to Supabase auth API...")
      
      // Attempt login
      console.log("Now calling regular login function...")
      await login(email, password)
      
      // Wait a moment for auth state to update properly
      console.log("Login API call successful, waiting for auth state update...")
      
      // Check if session is available
      setTimeout(() => {
        console.log("User after login:", user)
        console.log("Role:", user?.role)
        console.log("Is admin:", user?.role?.startsWith("admin_"))
        
        // Redirect to home page for all users
        console.log("Redirecting to home page")
        navigate("/")
        
        setIsLoading(false)
      }, 1000) // Short delay to allow auth state to update
      
    } catch (err: any) {
      console.error("Login error:", err)
      
      // More detailed error logging
      if (err.error_description) console.error("Error description:", err.error_description);
      if (err.status) console.error("Error status code:", err.status);
      if (err.name) console.error("Error name:", err.name);
      
      // Display JSON representation of the error
      try {
        console.error("Full error object:", JSON.stringify(err, null, 2));
      } catch (jsonErr) {
        console.error("Error converting error to JSON");
      }
      
      setIsLoading(false)
      
      // Provide more specific error messages
      if (err.message?.includes("Invalid login credentials") || 
          err.message?.includes("invalid_credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.\nTry using the test admin: admin123@example.com / Admin123!")
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Your email has not been confirmed. Please check your inbox for a confirmation email.")
      } else {
        const errorMessage = err.message || "Failed to log in"
        console.error("Error details:", errorMessage)
        setError(errorMessage)
      }
    }
    console.log("==================== END DEBUG INFO =====================")
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Removed unused handleChange function

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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/reset-password" className="font-medium text-green-600 hover:text-green-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Sign in
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Login
