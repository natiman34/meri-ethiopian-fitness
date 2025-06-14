"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Button from "../../components/ui/Button"
import ProtectedRoute from "../../components/auth/ProtectedRoute"
import Profile from "../Profile"

// Admin Components
import AdminOverview from "./AdminOverview"
import AdminUsers from "./AdminUsers"
import AdminFitness from "./AdminFitness"
import AdminNutrition from "./AdminNutrition"
import AdminContent from "./AdminContent"
import AdminFeedback from "./AdminFeedback"
import AdminSettings from "./AdminSettings"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar when route changes
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Redirect nutritionist admins to nutrition page
  useEffect(() => {
    if (user?.role === "admin_nutritionist" && location.pathname === "/admin") {
      navigate("/admin/nutrition", { replace: true })
    }
  }, [user?.role, location.pathname, navigate])

  // Determine user role for display
  const getRoleDisplay = () => {
    switch (user?.role) {
      case "admin_super":
        return "Super Admin"
      case "admin_nutritionist":
        return "Nutritionist Admin"
      case "admin_fitness":
        return "Fitness Admin"
      default:
        return "Admin"
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path))
  }

  const sidebar = (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col hidden md:flex">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <Link to="/admin" className="flex items-center">
          <div className="font-bold text-xl flex items-center">
            <span className="text-red-500">መሪ</span>
            <span className="text-yellow-500">Ethiopian</span>
            <span className="text-green-500">Fitness</span>
            <span className="ml-2 text-white"></span>
          </div>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-gray-700 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
            <span className="text-white font-bold">{user?.name?.charAt(0) || "A"}</span>
          </div>
          <div>
            <p className="font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-gray-400">{getRoleDisplay()}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-1 px-2">
          {/* Dashboard Link - Only for fitness admin */}
          {user?.role === "admin_fitness" && (
          <li>
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin") &&
                !isActive("/admin/users") &&
                !isActive("/admin/fitness") &&
                !isActive("/admin/nutrition") &&
                !isActive("/admin/content") &&
                !isActive("/admin/feedback") &&
                !isActive("/admin/settings")
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </li>
          )}

          {/* Only visible to super admin */}
          {user?.role === "admin_super" && (
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/users")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Users Management
              </Link>
            </li>
          )}

          {/* Fitness Plans Link - Only visible to fitness admin */}
          {user?.role === "admin_fitness" && (
            <li>
              <Link
                to="/admin/fitness"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/fitness")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Dumbbell className="mr-3 h-5 w-5" />
                Fitness Plans
              </Link>
            </li>
          )}

          {/* Nutrition Plans Link - Only visible to nutritionist admin */}
          {user?.role === "admin_nutritionist" && (
            <li>
              <Link
                to="/admin/nutrition"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/nutrition")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Utensils className="mr-3 h-5 w-5" />
                Nutrition Plans
              </Link>
            </li>
          )}

          {/* Content Management Link - Only for fitness admin */}
          {user?.role === "admin_fitness" && (
          <li>
            <Link
              to="/admin/content"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/content")
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Content Management
            </Link>
          </li>
          )}

          {/* Only visible to super admin */}
          {user?.role === "admin_super" && (
            <li>
              <Link
                to="/admin/feedback"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/feedback")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                User Feedback
              </Link>
            </li>
          )}

          {/* Only visible to super admin */}
          {user?.role === "admin_super" && (
          <li>
            <Link
              to="/admin/settings"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/settings")
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </li>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )

  const getTitleForPath = (path: string) => {
    switch (path) {
      case "/admin/users":
        return "Users Management"
      case "/admin/fitness":
        return "Fitness Plans"
      case "/admin/nutrition":
        return "Nutrition Plans"
      case "/admin/content":
        return "Content Management"
      case "/admin/feedback":
        return "User Feedback"
      case "/admin/settings":
        return "Settings"
      case "/admin/profile":
        return "Profile"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      {sidebar}

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
          <div className="relative z-10 h-full">{sidebar}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                className="md:hidden mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500" 
                onClick={toggleSidebar}
                aria-expanded={sidebarOpen}
                aria-controls="mobile-sidebar"
                aria-label="Toggle sidebar menu"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <h1 className="text-xl font-bold text-gray-900">
                {location.pathname === "/admin" && user?.role === "admin_fitness" && "Dashboard"}
                {location.pathname === "/admin" && user?.role === "admin_nutritionist" && "Nutrition Management"}
                {location.pathname === "/admin/users" && "Users Management"}
                {location.pathname === "/admin/fitness" && "Fitness Plans"}
                {location.pathname === "/admin/nutrition" && "Nutrition Plans"}
                {location.pathname === "/admin/content" && "Content Management"}
                {location.pathname === "/admin/feedback" && "User Feedback"}
                {location.pathname === "/admin/settings" && "Settings"}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-y-auto pt-16">
          <div className="">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {user?.role === "admin_nutritionist" ? <AdminNutrition /> : <AdminOverview />}
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fitness" 
                element={
                  <ProtectedRoute>
                    <AdminFitness />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nutrition" 
                element={
                  <ProtectedRoute>
                    <AdminNutrition />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content" 
                element={
                  <ProtectedRoute>
                    <AdminContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute>
                    <AdminFeedback />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
