"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [resetMethod, setResetMethod] = useState('otp');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address.");
                return;
            }
            console.log("Sending password reset OTP to email:", email);
            // Use resetPasswordForEmail with OTP-based recovery
            // This is the correct method for password reset, not signInWithOtp
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/verify-reset-otp?email=${encodeURIComponent(email)}&type=recovery`
            });
            if (error) {
                console.error("Password reset error:", error);
                // Provide user-friendly error messages
                if (error.message?.includes("User not found") ||
                    error.message?.includes("not found") ||
                    error.message?.includes("Unable to validate email address") ||
                    error.message?.includes("Invalid email")) {
                    setError("No account found with this email address. Please check your email or create a new account.");
                }
                else if (error.message?.includes("rate limit") || error.message?.includes("Too many")) {
                    setError("Too many password reset requests. Please wait a few minutes before trying again.");
                }
                else if (error.message?.includes("Email rate limit")) {
                    setError("Too many emails sent. Please wait before requesting another password reset.");
                }
                else {
                    // For security, don't reveal if email exists or not
                    setError("If an account with this email exists, you will receive a password reset code.");
                }
                return;
            }
            console.log("Password reset OTP sent successfully:", data);
            setResetMethod('otp');
            setIsSuccess(true);
        }
        catch (err) {
            console.error("Password reset error:", err);
            setError("If an account with this email exists, you will receive a password reset code.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const proceedToVerification = () => {
        // Navigate to OTP verification page with email
        navigate("/verify-reset-otp", { state: { email, type: 'recovery' } });
    };
    if (isSuccess) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsx("div", { className: "text-center", children: _jsx(Link, { to: "/", className: "inline-block", children: _jsxs("div", { className: "font-bold text-3xl flex items-center justify-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600", children: "Ethiopian" }), _jsx("span", { className: "text-green-600", children: "Fitness" }), _jsx("span", { className: "ml-2 text-gray-800" })] }) }) }), _jsx(Card, { children: _jsx(Card.Body, { children: _jsxs("div", { className: "text-center", children: [_jsx(CheckCircle, { className: "mx-auto h-12 w-12 text-green-500 mb-4" }), resetMethod === 'otp' ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "OTP Sent!" }), _jsx("p", { className: "text-gray-600 mb-4", children: "We've sent a 6-digit verification code to:" }), _jsx("p", { className: "font-medium text-gray-900 mb-6", children: email }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "The code will expire in 1 hour. Please check your email for the 6-digit code and enter it on the next page." }), _jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: proceedToVerification, variant: "primary", fullWidth: true, children: "Enter Verification Code" }), _jsx(Button, { onClick: () => setIsSuccess(false), variant: "outline", fullWidth: true, children: "Send Another Code" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Check your email" }), _jsx("p", { className: "text-gray-600 mb-4", children: "We've sent a password reset link to:" }), _jsx("p", { className: "font-medium text-gray-900 mb-6", children: email }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Click the link in the email to reset your password. The link will expire in 1 hour." }), _jsx("div", { className: "space-y-4", children: _jsx(Button, { onClick: () => setIsSuccess(false), variant: "outline", fullWidth: true, children: "Send Another Email" }) })] })), _jsx("div", { className: "mt-6", children: _jsxs(Link, { to: "/login", className: "inline-flex items-center text-sm text-green-600 hover:text-green-500", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }), "Back to login"] }) })] }) }) })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(Link, { to: "/", className: "inline-block", children: _jsxs("div", { className: "font-bold text-3xl flex items-center justify-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600", children: "Ethiopian" }), _jsx("span", { className: "text-green-600", children: "Fitness" }), _jsx("span", { className: "ml-2 text-gray-800" })] }) }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Reset your password" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Enter your email address and we'll send you a verification code to reset your password." })] }), _jsx(Card, { children: _jsxs(Card.Body, { children: [error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm", children: error })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500", placeholder: "Enter your email" }), _jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) })] })] }), _jsx("div", { children: _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isLoading, children: "Send Verification Code" }) }), _jsx("div", { className: "text-center", children: _jsxs(Link, { to: "/login", className: "inline-flex items-center text-sm text-green-600 hover:text-green-500", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }), "Back to login"] }) })] })] }) })] }) }));
};
export default ResetPassword;
