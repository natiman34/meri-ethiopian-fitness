"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import BMI from "./pages/BMI";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import SetNewPassword from "./pages/auth/SetNewPassword";
import VerifyResetOTP from "./pages/auth/VerifyResetOTP";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import NutritionPlanDetail from "./pages/services/NutritionPlanDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/utils/ScrollToTop";
import FitnessPlanDetail from "./pages/services/FitnessPlanDetail";
import ActivityTest from "./pages/ActivityTest";
function AppContent() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    // Close menu when route changes
    React.useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);
    // Check if current route is admin page (profile page will now show navbar)
    const isAdminPage = location.pathname.startsWith("/admin");
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-stone-50", children: [!isAdminPage && _jsx(Navbar, { menuOpen: menuOpen, toggleMenu: toggleMenu }), _jsx("main", { className: `flex-grow ${!isAdminPage ? "pt-16 sm:pt-20" : ""}`, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/services/*", element: _jsx(Services, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/bmi", element: _jsx(BMI, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(ResetPassword, {}) }), _jsx(Route, { path: "/verify-reset-otp", element: _jsx(VerifyResetOTP, {}) }), _jsx(Route, { path: "/set-new-password", element: _jsx(SetNewPassword, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/activity-test", element: _jsx(ActivityTest, {}) }), _jsx(Route, { path: "/nutrition-plans/:id", element: _jsx(NutritionPlanDetail, {}) }), _jsx(Route, { path: "/fitness-plans/:id", element: _jsx(FitnessPlanDetail, {}) }), _jsx(Route, { path: "/admin/*", element: _jsx(ProtectedRoute, { adminOnly: true, children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }), !isAdminPage && _jsx(Footer, {})] }));
}
function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsxs(Router, { children: [_jsx(ScrollToTop, {}), _jsx(AppContent, {})] }) }) }) }));
}
export default App;
