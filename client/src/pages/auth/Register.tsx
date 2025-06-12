"use client"

import React, { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Card } from "../../components/Card" 

import { supabase } from "../../lib/supabase"
import {
  validateRegistrationData,
  hashPassword,
  generateSalt,
  registrationRateLimiter
} from "../../utils/security";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleShowPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowPassword(e.target.checked);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Rate limiting (by email)
    if (!registrationRateLimiter.isAllowed(formData.email)) {
      setError("Too many registration attempts. Please try again later.");
      setIsLoading(false);
      return;
    }

    // Validate and sanitize registration data
    const { isValid, errors, sanitizedData } = validateRegistrationData(formData);
    if (!isValid) {
      setError(Object.values(errors).join(". "));
      setIsLoading(false);
      return;
    }

    try {
      if (!register) {
        throw new Error("Authentication service not available");
      }

      // Removed client-side password hashing. Supabase handles hashing securely on the server.
      // const salt = generateSalt();
      // const hashedPassword = await hashPassword(sanitizedData!.password, salt);

      // Call register with sanitized name, email, and the plaintext password
      const result = await register(
        sanitizedData!.name,
        sanitizedData!.email,
        sanitizedData!.password // Pass the plaintext password to Supabase
      );
      console.log("Registration result:", result);
      
      switch (result) {
        case "success":
          console.log("Registration successful, redirecting");
          navigate("/");
          break;

        case "confirm_email":
          console.log("Email confirmation needed");
          setSuccessMessage(
            "Registration successful! Please check your email to confirm your account before logging in."
          );
          // Clear form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
          });
          break;

        case "existing_user":
          console.log("User already exists");
          setError(
            "An account with this email already exists. Please sign in instead."
          );
          break;

        default:
          setError("An unexpected error occurred during registration.");
      }
    } catch (err: any) {
      console.error("Registration error in form handler:", err);
      
      let errorMessage = "An error occurred during registration";
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else if (err.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (err.message.includes("Password")) {
          errorMessage = err.message; // Use password-related error messages directly
        } else {
          errorMessage = err.message;
        }
      } else if (err?.error_description) {
        errorMessage = err.error_description;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <Card.Body>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
            {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{successMessage}</div>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="showPassword"
                  name="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={toggleShowPassword}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-900">
                  Show password
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Register