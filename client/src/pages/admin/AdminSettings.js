"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Save, Lock } from "lucide-react";
import { supabase } from '../../lib/supabase';
const AdminSettings = () => {
    const { user } = useAuth();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordSuccess(false);
        setPasswordError(null);
        setIsSubmitting(true);
        if (!user) {
            setPasswordError("You must be logged in to change your password.");
            setIsSubmitting(false);
            return;
        }
        if (passwordForm.currentPassword.trim() === '') {
            setPasswordError("Please enter your current password.");
            setIsSubmitting(false);
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match.");
            setIsSubmitting(false);
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            setIsSubmitting(false);
            return;
        }
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.newPassword,
            });
            if (error)
                throw error;
            setPasswordSuccess(true);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => {
                setPasswordSuccess(false);
            }, 3000);
        }
        catch (error) {
            console.error("Failed to update password", error);
            setPasswordError(error.message || "Failed to update password.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-6" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "md:col-span-1", children: _jsx(Card, { children: _jsx(Card.Body, { className: "p-0", children: _jsx("nav", { className: "divide-y divide-gray-200", children: _jsxs("button", { className: `w-full text-left px-4 py-3 flex items-center bg-green-50 text-green-700`, children: [_jsx(Lock, { size: 16, className: "mr-3" }), "Password"] }) }) }) }) }), _jsx("div", { className: "md:col-span-3", children: _jsx(Card, { children: _jsxs(Card.Body, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Change Password" }), passwordSuccess && (_jsx("div", { className: "mb-4 p-3 bg-green-50 text-green-700 rounded-md", children: "Password updated successfully!" })), passwordError && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md", children: passwordError })), _jsxs("form", { onSubmit: handlePasswordSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "currentPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Current Password" }), _jsx("input", { type: "password", id: "currentPassword", name: "currentPassword", className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", value: passwordForm.currentPassword, onChange: handlePasswordChange, required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "New Password" }), _jsx("input", { type: "password", id: "newPassword", name: "newPassword", className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", value: passwordForm.newPassword, onChange: handlePasswordChange, required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm New Password" }), _jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", className: "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500", value: passwordForm.confirmPassword, onChange: handlePasswordChange, required: true })] }), _jsx(Button, { type: "submit", variant: "primary", leftIcon: _jsx(Save, { size: 16 }), disabled: isSubmitting, children: isSubmitting ? "Updating..." : "Update Password" })] })] }) }) })] })] }));
};
export default AdminSettings;
