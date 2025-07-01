"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Users, Dumbbell, Utensils, MessageSquare, Settings, LogOut, Menu, X, } from "lucide-react";
import Button from "../../components/ui/Button";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Profile from "../Profile";
// Admin Components
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminFitness from "./AdminFitness";
import EnhancedFitnessDashboard from "./EnhancedFitnessDashboard";
import AdminNutrition from "./AdminNutrition";
import AdminContent from "./AdminContent";
import AdminFeedback from "./AdminFeedback";
import AdminSettings from "./AdminSettings";
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        }
        catch (error) {
            console.error("Failed to log out", error);
        }
    };
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    // Close sidebar when route changes
    React.useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);
    // Redirect nutritionist admins to nutrition page
    useEffect(() => {
        if (user?.role === "admin_nutritionist" && location.pathname === "/admin") {
            navigate("/admin/nutrition", { replace: true });
        }
    }, [user?.role, location.pathname, navigate]);
    // Determine user role for display
    const getRoleDisplay = () => {
        switch (user?.role) {
            case "admin_super":
                return "Super Admin";
            case "admin_nutritionist":
                return "Nutritionist Admin";
            case "admin_fitness":
                return "Fitness Admin";
            default:
                return "Admin";
        }
    };
    const isActive = (path) => {
        return location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));
    };
    const sidebar = (_jsxs("div", { className: "w-64 h-full bg-gray-800 text-white flex flex-col hidden md:flex", children: [_jsx("div", { className: "p-4 border-b border-gray-700", children: _jsx(Link, { to: "/admin", className: "flex items-center", children: _jsxs("div", { className: "font-bold text-xl flex items-center", children: [_jsx("span", { className: "text-red-500", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-500", children: "Ethiopian" }), _jsx("span", { className: "text-green-500", children: "Fitness" }), _jsx("span", { className: "ml-2 text-white" })] }) }) }), _jsx("div", { className: "p-4 border-b border-gray-700 mb-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3", children: _jsx("span", { className: "text-white font-bold", children: user?.name?.charAt(0) || "A" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: user?.name || "Admin User" }), _jsx("p", { className: "text-xs text-gray-400", children: getRoleDisplay() })] })] }) }), _jsx("nav", { className: "flex-grow", children: _jsxs("ul", { className: "space-y-1 px-2", children: [user?.role === "admin_super" && (_jsx("li", { children: _jsxs(Link, { to: "/admin/users", className: `flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/admin/users")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx(Users, { className: "mr-3 h-5 w-5" }), "Users Management"] }) })), user?.role === "admin_fitness" && (_jsx("li", { children: _jsxs(Link, { to: "/admin/fitness-dashboard", className: `flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/admin/fitness-dashboard")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx(Dumbbell, { className: "mr-3 h-5 w-5" }), "Enhanced Fitness Dashboard"] }) })), user?.role === "admin_nutritionist" && (_jsx("li", { children: _jsxs(Link, { to: "/admin/nutrition", className: `flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/admin/nutrition")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx(Utensils, { className: "mr-3 h-5 w-5" }), "Nutrition Plans"] }) })), user?.role === "admin_super" && (_jsx("li", { children: _jsxs(Link, { to: "/admin/feedback", className: `flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/admin/feedback")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx(MessageSquare, { className: "mr-3 h-5 w-5" }), "User Feedback"] }) })), user?.role === "admin_super" && (_jsx("li", { children: _jsxs(Link, { to: "/admin/settings", className: `flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/admin/settings")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx(Settings, { className: "mr-3 h-5 w-5" }), "Settings"] }) }))] }) }), _jsx("div", { className: "p-4 border-t border-gray-700", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center w-full px-4 py-2 text-gray-300 hover:text-white transition-colors", children: [_jsx(LogOut, { className: "mr-3 h-5 w-5" }), "Logout"] }) })] }));
    const getTitleForPath = (path) => {
        switch (path) {
            case "/admin/users":
                return "Users Management";
            case "/admin/fitness":
                return "Fitness Plans";
            case "/admin/fitness-dashboard":
                return "Enhanced Fitness Dashboard";
            case "/admin/nutrition":
                return "Nutrition Plans";
            case "/admin/content":
                return "Content Management";
            case "/admin/feedback":
                return "User Feedback";
            case "/admin/settings":
                return "Settings";
            case "/admin/profile":
                return "Profile";
            default:
                return "Dashboard";
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-100", children: [sidebar, sidebarOpen && (_jsxs("div", { className: "fixed inset-0 z-40 md:hidden", children: [_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-75", onClick: toggleSidebar }), _jsx("div", { className: "relative z-10 h-full", children: sidebar })] })), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden md:ml-64", children: [_jsx("header", { className: "bg-white shadow-sm z-10", children: _jsxs("div", { className: "px-4 sm:px-6 py-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { className: "md:hidden mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500", onClick: toggleSidebar, "aria-expanded": sidebarOpen, "aria-controls": "mobile-sidebar", "aria-label": "Toggle sidebar menu", children: sidebarOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) }), _jsxs("h1", { className: "text-xl font-bold text-gray-900", children: [location.pathname === "/admin" && user?.role === "admin_super" && "Super Admin Dashboard", location.pathname === "/admin" && user?.role === "admin_fitness" && "Fitness Admin Dashboard", location.pathname === "/admin" && user?.role === "admin_nutritionist" && "Nutrition Admin Dashboard", location.pathname === "/admin/users" && "Users Management", location.pathname === "/admin/fitness" && "Fitness Plans", location.pathname === "/admin/fitness-dashboard" && "Enhanced Fitness Dashboard", location.pathname === "/admin/nutrition" && "Nutrition Plans", location.pathname === "/admin/content" && "Content Management", location.pathname === "/admin/feedback" && "User Feedback", location.pathname === "/admin/settings" && "Settings"] })] }), _jsx("div", { className: "flex items-center space-x-3", children: _jsx(Link, { to: "/", children: _jsx(Button, { variant: "outline", size: "sm", children: "View Site" }) }) })] }) }), _jsx("main", { className: "flex-1 p-4 md:p-6 bg-gray-100 overflow-y-auto pt-16", children: _jsx("div", { className: "", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: user?.role === "admin_nutritionist" ? _jsx(AdminNutrition, {}) : _jsx(AdminOverview, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { children: _jsx(AdminUsers, {}) }) }), _jsx(Route, { path: "/fitness", element: _jsx(ProtectedRoute, { children: _jsx(AdminFitness, {}) }) }), _jsx(Route, { path: "/fitness-dashboard", element: _jsx(ProtectedRoute, { children: _jsx(EnhancedFitnessDashboard, {}) }) }), _jsx(Route, { path: "/nutrition", element: _jsx(ProtectedRoute, { children: _jsx(AdminNutrition, {}) }) }), _jsx(Route, { path: "/content", element: _jsx(ProtectedRoute, { children: _jsx(AdminContent, {}) }) }), _jsx(Route, { path: "/feedback", element: _jsx(ProtectedRoute, { children: _jsx(AdminFeedback, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(AdminSettings, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(Profile, {}) }) })] }) }) })] })] }));
};
export default Dashboard;
