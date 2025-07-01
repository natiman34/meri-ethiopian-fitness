"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { ErrorModal, SuccessModal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { AlertCircle } from "lucide-react";
import { validateRegistrationData, registrationRateLimiter } from "../../utils/security";
const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { showError, showSuccess, ToastContainer } = useToast();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const toggleShowPassword = (e) => {
        setShowPassword(e.target.checked);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrorDetails("");
        setSuccessMessage("");
        setShowErrorModal(false);
        setShowSuccessModal(false);
        setIsLoading(true);
        // Rate limiting (by email)
        if (!registrationRateLimiter.isAllowed(formData.email)) {
            const errorMsg = "Too many registration attempts. Please try again later.";
            setError(errorMsg);
            setShowErrorModal(true);
            showError(errorMsg, "Rate Limited");
            setIsLoading(false);
            return;
        }
        // Validate and sanitize registration data
        const { isValid, errors, sanitizedData } = validateRegistrationData(formData);
        if (!isValid) {
            const errorMsg = Object.values(errors).join(". ");
            setError(errorMsg);
            setShowErrorModal(true);
            showError(errorMsg, "Validation Error");
            setIsLoading(false);
            return;
        }
        try {
            if (!register) {
                throw new Error("Authentication service not available");
            }
            // Call register with sanitized name, email, and the plaintext password
            const result = await register(sanitizedData.name, sanitizedData.email, sanitizedData.password);
            console.log("Registration result:", result);
            switch (result) {
                case "success":
                    console.log("Registration successful, redirecting");
                    showSuccess("Registration successful! Welcome to መሪ Ethiopian Fitness!", "Welcome!");
                    setTimeout(() => navigate("/"), 1500);
                    break;
                case "confirm_email":
                    console.log("Email confirmation needed");
                    const successMsg = "Registration successful! Please check your email to confirm your account before logging in.";
                    setSuccessMessage(successMsg);
                    setShowSuccessModal(true);
                    showSuccess(successMsg, "Check Your Email");
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
                    const existingUserMsg = "An account with this email already exists. Please sign in instead.";
                    setError(existingUserMsg);
                    setShowErrorModal(true);
                    showError(existingUserMsg, "Account Exists");
                    break;
                default:
                    const unexpectedMsg = "An unexpected error occurred during registration.";
                    setError(unexpectedMsg);
                    setShowErrorModal(true);
                    showError(unexpectedMsg, "Registration Failed");
            }
        }
        catch (err) {
            console.error("Registration error in form handler:", err);
            // Prepare error details for modal
            const errorDetails = {
                message: err.message || "Unknown error",
                timestamp: new Date().toISOString(),
                ...(err.error_description && { description: err.error_description })
            };
            setErrorDetails(JSON.stringify(errorDetails, null, 2));
            let errorMessage = "An error occurred during registration";
            if (err instanceof Error) {
                // Handle specific error cases
                if (err.message.includes("User already registered")) {
                    errorMessage = "An account with this email already exists. Please sign in instead.";
                }
                else if (err.message.includes("Invalid email")) {
                    errorMessage = "Please enter a valid email address.";
                }
                else if (err.message.includes("Password")) {
                    errorMessage = err.message;
                }
                else {
                    errorMessage = err.message;
                }
            }
            else if (err?.error_description) {
                errorMessage = err.error_description;
            }
            else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            setShowErrorModal(true);
            showError(errorMessage, "Registration Failed");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(ToastContainer, {}), _jsx(ErrorModal, { isOpen: showErrorModal, onClose: () => setShowErrorModal(false), title: "Registration Failed", message: error, details: errorDetails }), _jsx(SuccessModal, { isOpen: showSuccessModal, onClose: () => setShowSuccessModal(false), title: "Registration Successful", message: successMessage }), _jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(Link, { to: "/", className: "inline-block", children: _jsxs("div", { className: "font-bold text-3xl flex items-center justify-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600", children: "Ethiopian" }), _jsx("span", { className: "text-green-600", children: "Fitness" })] }) }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Create your account" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Or", " ", _jsx(Link, { to: "/login", className: "font-medium text-green-600 hover:text-green-500", children: "sign in to your existing account" })] })] }), _jsx(Card, { children: _jsxs(Card.Body, { children: [error && !showErrorModal && (_jsxs("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center", children: [_jsx(AlertCircle, { size: 16, className: "mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm", children: error }), _jsx("button", { onClick: () => setShowErrorModal(true), className: "text-xs text-red-600 hover:text-red-800 underline mt-1", children: "View details" })] })] })), successMessage && !showSuccessModal && (_jsxs("div", { className: "mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center", children: [_jsx(AlertCircle, { size: 16, className: "mr-2" }), successMessage] })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsx("input", { id: "name", name: "name", type: "text", autoComplete: "name", required: true, value: formData.name, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", autoComplete: "new-password", required: true, value: formData.password, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: showPassword ? "text" : "password", autoComplete: "new-password", required: true, value: formData.confirmPassword, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "showPassword", name: "showPassword", type: "checkbox", checked: showPassword, onChange: toggleShowPassword, className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "showPassword", className: "ml-2 block text-sm text-gray-900", children: "Show password" })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isLoading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: isLoading ? "Registering..." : "Register" }) })] })] }) })] }) })] }));
};
export default Register;
