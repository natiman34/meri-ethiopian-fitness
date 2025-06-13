"use client"

import React, { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
  title?: string
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
  title
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />
      case "error":
        return <AlertCircle size={20} className="text-red-600" />
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />
      case "info":
        return <Info size={20} className="text-blue-600" />
      default:
        return <Info size={20} className="text-gray-600" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`
          ${getToastStyles()}
          border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}
            <p className="text-sm leading-relaxed">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Hook for easier usage
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: ToastType
    title?: string
    duration?: number
  }>>([])

  const showToast = (
    message: string,
    type: ToastType = "info",
    title?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type, title, duration }])
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          duration={toast.duration}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    hideToast,
    ToastContainer,
    showSuccess: (message: string, title?: string) => showToast(message, "success", title),
    showError: (message: string, title?: string) => showToast(message, "error", title),
    showWarning: (message: string, title?: string) => showToast(message, "warning", title),
    showInfo: (message: string, title?: string) => showToast(message, "info", title),
  }
}

export default Toast
