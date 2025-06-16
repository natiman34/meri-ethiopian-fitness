"use client"

import React, { useState } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ErrorBoundary from "./components/ErrorBoundary"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import BMI from "./pages/BMI"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ResetPassword from "./pages/auth/ResetPassword"
import SetNewPassword from "./pages/auth/SetNewPassword"
import VerifyResetOTP from "./pages/auth/VerifyResetOTP"
import Profile from "./pages/Profile"
import Dashboard from "./pages/admin/Dashboard"
import NutritionPlanDetail from "./pages/services/NutritionPlanDetail"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import ScrollToTop from "./components/utils/ScrollToTop"
import FitnessPlanDetail from "./pages/services/FitnessPlanDetail"
import ActivityTest from "./pages/ActivityTest"

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Close menu when route changes
  React.useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Check if current route is admin page (profile page will now show navbar)
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {!isAdminPage && <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />}
      <main className={`flex-grow ${!isAdminPage ? "pt-16 sm:pt-20" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services/*" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity-test" element={<ActivityTest />} />
          <Route path="/nutrition-plans/:id" element={<NutritionPlanDetail />} />
          <Route path="/fitness-plans/:id" element={<FitnessPlanDetail />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App


