"use client"

import React from "react"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login")
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    console.log("User not admin, redirecting to home")
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
