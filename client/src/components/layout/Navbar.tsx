"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Menu, X, User, ChevronDown } from "lucide-react"

interface NavbarProps {
  menuOpen: boolean
  toggleMenu: () => void
}

const Navbar: React.FC<NavbarProps> = ({ menuOpen, toggleMenu }) => {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  // Close menu when location changes
  useEffect(() => {
    if (menuOpen) {
      toggleMenu()
    }
    setProfileOpen(false)
  }, [location.pathname, menuOpen, toggleMenu])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
  }

  const toggleProfile = () => {
    setProfileOpen(!profileOpen)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="text-green-700 font-bold text-xl md:text-2xl flex items-center">
              <span className="text-red-600">መሪ</span>
              <span className="text-yellow-600">Ethiopian</span>
              <span className="text-green-600">Fitness</span>
              <span className="ml-2 text-slate-800"></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/bmi"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              BMI
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Profile
            </NavLink>
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none"
                >
                  <User size={20} />
                  <span className="font-medium">{user.name}</span>
                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                      Profile
                    </Link>
                    {user.role !== "user" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden flex items-center text-gray-700 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-20 border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/bmi"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              BMI
            </NavLink>
            

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`
                  }
                >
                  Profile
                </NavLink>
                {user.role !== "user" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
