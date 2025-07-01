"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
const Toast = ({ message, type, isVisible, onClose, duration = 5000, title }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);
    if (!isVisible)
        return null;
    const getToastStyles = () => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "info":
                return "bg-blue-50 border-blue-200 text-blue-800";
            default:
                return "bg-gray-50 border-gray-200 text-gray-800";
        }
    };
    const getIcon = () => {
        switch (type) {
            case "success":
                return _jsx(CheckCircle, { size: 20, className: "text-green-600" });
            case "error":
                return _jsx(AlertCircle, { size: 20, className: "text-red-600" });
            case "warning":
                return _jsx(AlertTriangle, { size: 20, className: "text-yellow-600" });
            case "info":
                return _jsx(Info, { size: 20, className: "text-blue-600" });
            default:
                return _jsx(Info, { size: 20, className: "text-gray-600" });
        }
    };
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 max-w-sm w-full", children: _jsx("div", { className: `
          ${getToastStyles()}
          border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: getIcon() }), _jsxs("div", { className: "ml-3 flex-1", children: [title && (_jsx("h3", { className: "text-sm font-medium mb-1", children: title })), _jsx("p", { className: "text-sm leading-relaxed", children: message })] }), _jsx("div", { className: "ml-4 flex-shrink-0", children: _jsx("button", { onClick: onClose, className: "inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md p-1", children: _jsx(X, { size: 16 }) }) })] }) }) }));
};
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const showToast = (message, type = "info", title, duration) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type, title, duration }]);
    };
    const hideToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    const ToastContainer = () => (_jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: toasts.map(toast => (_jsx(Toast, { message: toast.message, type: toast.type, title: toast.title, duration: toast.duration, isVisible: true, onClose: () => hideToast(toast.id) }, toast.id))) }));
    return {
        showToast,
        hideToast,
        ToastContainer,
        showSuccess: (message, title) => showToast(message, "success", title),
        showError: (message, title) => showToast(message, "error", title),
        showWarning: (message, title) => showToast(message, "warning", title),
        showInfo: (message, title) => showToast(message, "info", title),
    };
};
export default Toast;
