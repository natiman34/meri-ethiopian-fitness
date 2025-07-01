"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { ErrorModal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoginError, setHasLoginError] = useState(false);
    const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { showError, showSuccess, ToastContainer } = useToast();
    const from = location.state?.from?.pathname || "/";
    // Check for success message from password reset
    useEffect(() => {
        const state = location.state;
        if (state?.message && state?.type === 'success') {
            setSuccessMessage(state.message);
            // Clear the message from location state
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);
    useEffect(() => {
        // Only redirect if authenticated AND no error is being shown AND no login error occurred
        if (isAuthenticated && !error && !showErrorModal && !hasLoginError) {
            console.log("Auto-redirecting authenticated user to:", from);
            navigate(from);
        }
    }, [isAuthenticated, navigate, from, error, showErrorModal, hasLoginError]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrorDetails("");
        setShowErrorModal(false);
        setHasLoginError(false);
        setIsLoading(true);
        try {
            console.log("Login attempt starting for email:", email);
            // Attempt login
            await login(email, password);
            // If we get here, login was successful
            console.log("Login successful, showing success message");
            showSuccess("Login successful! Welcome back.", "Success");
            // Wait a moment for auth state to update properly
            setTimeout(() => {
                console.log("User after login:", user);
                console.log("Role:", user?.role);
                // Redirect based on user role
                if (user?.role?.startsWith("admin_")) {
                    navigate("/admin");
                }
                else {
                    navigate("/");
                }
                setIsLoading(false);
            }, 1000); // Short delay to allow auth state to update
        }
        catch (err) {
            console.error("Login error:", err);
            setIsLoading(false);
            setHasLoginError(true); // Set error flag to prevent redirects
            // Prepare error details for modal
            const errorDetails = {
                message: err.message || "Unknown error",
                status: err.status || "N/A",
                timestamp: new Date().toISOString(),
                ...(err.error_description && { description: err.error_description })
            };
            setErrorDetails(JSON.stringify(errorDetails, null, 2));
            // Provide user-friendly error messages
            let userMessage = "";
            if (err.message?.includes("Invalid login credentials") ||
                err.message?.includes("invalid_credentials")) {
                userMessage = "Invalid email or password. Please check your credentials and try again.";
            }
            else if (err.message?.includes("Email not confirmed")) {
                userMessage = "Your email has not been confirmed. Please check your inbox for a confirmation email.";
            }
            else if (err.message?.includes("Too many requests")) {
                userMessage = "Too many login attempts. Please wait a few minutes before trying again.";
            }
            else {
                userMessage = err.message || "An unexpected error occurred during login. Please try again.";
            }
            setError(userMessage);
            setShowErrorModal(true);
            // Also show toast for immediate feedback
            showError(userMessage, "Login Failed");
            // Ensure we stay on the login page
            console.log("Login failed, staying on login page");
        }
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // Clear error state when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (hasLoginError) {
            setHasLoginError(false);
            setError("");
            setShowErrorModal(false);
        }
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (hasLoginError) {
            setHasLoginError(false);
            setError("");
            setShowErrorModal(false);
        }
    };
    // Removed unused handleChange function
    return (_jsxs(_Fragment, { children: [_jsx(ToastContainer, {}), _jsx(ErrorModal, { isOpen: showErrorModal, onClose: () => setShowErrorModal(false), title: "Login Failed", message: error, details: errorDetails }), _jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(Link, { to: "/", className: "inline-block", children: _jsxs("div", { className: "font-bold text-3xl flex items-center justify-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600", children: "Ethiopian" }), _jsx("span", { className: "text-green-600", children: "Fitness" }), _jsx("span", { className: "ml-2 text-gray-800" })] }) }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Or", " ", _jsx(Link, { to: "/register", className: "font-medium text-green-600 hover:text-green-500", children: "create a new account" })] })] }), _jsx(Card, { children: _jsxs(Card.Body, { children: [successMessage && (_jsxs("div", { className: "mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center", children: [_jsx(AlertCircle, { size: 16, className: "mr-2" }), successMessage] })), error && !showErrorModal && (_jsxs("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center", children: [_jsx(AlertCircle, { size: 16, className: "mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm", children: error }), _jsx("button", { onClick: () => setShowErrorModal(true), className: "text-xs text-red-600 hover:text-red-800 underline mt-1", children: "View details" })] })] })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: handleEmailChange, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", autoComplete: "current-password", required: true, value: password, onChange: handlePasswordChange, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: toggleShowPassword, children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400" })) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Remember me" })] }), _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/reset-password", className: "font-medium text-green-600 hover:text-green-500", children: "Forgot your password?" }) })] }), _jsx("div", { children: _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isLoading, children: "Sign in" }) })] })] }) })] }) })] }));
};
export default Login;
