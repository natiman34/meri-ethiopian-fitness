"use client"

import { useState } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import BMI from "./pages/BMI"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Profile from "./pages/Profile"
import Dashboard from "./pages/admin/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import ScrollToTop from "./components/utils/ScrollToTop"

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-stone-50">
            <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
            <main className={`flex-grow ${menuOpen ? "pt-16" : ""}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services/*" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/bmi" element={<BMI />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
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
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
