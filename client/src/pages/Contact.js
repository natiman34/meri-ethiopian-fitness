"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FeedbackService } from "../services/FeedbackService";
import { useAuth } from "../contexts/AuthContext";
const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { user } = useAuth(); // Get user from AuthContext
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);
        try {
            const feedbackService = FeedbackService.getInstance();
            const userId = user?.id || null; // Use authenticated user's ID if available
            const fullName = formData.name; // Use name from form for full_name
            const email = formData.email; // Use email from form
            const content = formData.message; // Use message from form for content
            const rating = null; // No rating in contact form
            await feedbackService.submitFeedback(userId, fullName, email, content, rating);
            setSubmitSuccess(true);
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        }
        catch (error) {
            console.error("Error submitting feedback:", error);
            // Check if the error is related to row-level security policy
            if (error.message && (error.message.includes("row-level security policy") ||
                error.message.includes("violates row-level security") ||
                error.message.includes("RLS") ||
                error.message.includes("First register or login in order to send feedback"))) {
                setSubmitError("First register or login in order to send feedback.");
            }
            else {
                setSubmitError(error.message || "Failed to send message. Please try again.");
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "pt-20 sm:pt-24 pb-12 sm:pb-16", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center", children: "Contact Us" }), _jsx("p", { className: "text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 text-center max-w-3xl mx-auto px-4", children: "Have questions about our services or need personalized advice? Reach out to our team and we'll get back to you as soon as possible." }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8", children: [_jsx("div", { className: "lg:col-span-1 order-2 lg:order-1", children: _jsx(Card, { className: "h-full", children: _jsxs(Card.Body, { className: "p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6", children: "Contact Information" }), _jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(MapPin, { className: "w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-800", children: "Visit Us" }), _jsx("p", { className: "text-gray-600 mt-1 text-sm sm:text-base", children: "Addis Ababa, Ethiopia" })] })] }), _jsxs("div", { className: "flex items-start", children: [_jsx(Phone, { className: "w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-800", children: "Call Us" }), _jsx("p", { className: "text-gray-600 mt-1 text-sm sm:text-base", children: "+251 911 123 456" })] })] }), _jsxs("div", { className: "flex items-start", children: [_jsx(Mail, { className: "w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-800", children: "Email Us" }), _jsx("p", { className: "text-gray-600 mt-1 text-sm sm:text-base", children: "support@merifitness.com" })] })] })] }), _jsxs("div", { className: "mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "font-medium text-gray-800 mb-3", children: "Business Hours" }), _jsx("p", { className: "text-gray-600 text-sm sm:text-base", children: "Monday - Friday: 8:00 AM - 6:00 PM" }), _jsx("p", { className: "text-gray-600 text-sm sm:text-base", children: "Saturday: 9:00 AM - 4:00 PM" }), _jsx("p", { className: "text-gray-600 text-sm sm:text-base", children: "Sunday: Closed" })] })] }) }) }), _jsx("div", { className: "lg:col-span-2 order-1 lg:order-2", children: _jsx(Card, { className: "h-full", children: _jsxs(Card.Body, { className: "p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6", children: "Send Us a Message" }), submitSuccess && (_jsx("div", { className: "mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 text-green-700 rounded-md text-sm sm:text-base", children: "Thank you for your message! We'll get back to you soon." })), submitError && (_jsx("div", { className: "mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 rounded-md text-sm sm:text-base", children: submitError })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Name *" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors", placeholder: "Enter your full name" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Email *" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors", placeholder: "Enter your email address" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", className: "block text-sm font-medium text-gray-700 mb-2", children: "Subject *" }), _jsx("input", { type: "text", id: "subject", name: "subject", value: formData.subject, onChange: handleChange, required: true, className: "w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors", placeholder: "What is this about?" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "Message *" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleChange, required: true, rows: 5, className: "w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none", placeholder: "Tell us how we can help you..." }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Please provide as much detail as possible" })] }), _jsx("div", { className: "pt-2", children: _jsx(Button, { type: "submit", variant: "primary", isLoading: isSubmitting, rightIcon: _jsx(Send, { size: 16 }), className: "w-full sm:w-auto min-h-[48px] px-6 py-3 text-base font-medium", children: isSubmitting ? 'Sending...' : 'Send Message' }) })] })] }) }) })] })] }) }) }));
};
export default Contact;
