"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { Save, Lock, User, Settings, MoonStar, Mail } from "lucide-react"
import { supabase } from '../../lib/supabase'

const AdminSettings = () => {
  const { user } = useAuth()

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess(false)
    setPasswordError(null)
    setIsSubmitting(true)

    if (!user) {
      setPasswordError("You must be logged in to change your password.");
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.currentPassword.trim() === '') {
      setPasswordError("Please enter your current password.");
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.")
      setIsSubmitting(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        setPasswordSuccess(false)
      }, 3000)
    } catch (error: any) {
      console.error("Failed to update password", error)
      setPasswordError(error.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6"></h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation - Only Password */}
        <div className="md:col-span-1">
          <Card>
            <Card.Body className="p-0">
              <nav className="divide-y divide-gray-200">
                <button
                  className={`w-full text-left px-4 py-3 flex items-center bg-green-50 text-green-700`}
                >
                  <Lock size={16} className="mr-3" />
                  Password
                </button>
              </nav>
            </Card.Body>
          </Card>
        </div>

        {/* Settings Content - Only Password */} 
        <div className="md:col-span-3">
          <Card>
            <Card.Body className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                  Password updated successfully!
                </div>
              )}
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {passwordError}
                </div>
              )}
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Save size={16} />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
