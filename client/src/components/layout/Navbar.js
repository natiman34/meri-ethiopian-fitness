"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, User, ChevronDown } from "lucide-react";
const Navbar = ({ menuOpen, toggleMenu }) => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            }
            else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        }
        else {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, [menuOpen]);
    useEffect(() => {
        if (menuOpen) {
            toggleMenu();
        }
        setProfileOpen(false);
    }, [location.pathname, menuOpen, toggleMenu]);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                toggleMenu();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [menuOpen, toggleMenu]);
    const handleLogout = useCallback(() => {
        logout();
        setProfileOpen(false);
        if (menuOpen) {
            toggleMenu();
        }
    }, [logout, menuOpen, toggleMenu]);
    const toggleProfile = useCallback(() => {
        setProfileOpen(!profileOpen);
    }, [profileOpen]);
    const handleMenuToggle = useCallback(() => {
        toggleMenu();
    }, [toggleMenu]);
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: `fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`, children: _jsx("div", { className: "container mx-auto px-4 md:px-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Link, { to: "/", className: "flex items-center", children: _jsxs("div", { className: "text-green-700 font-bold text-lg sm:text-xl md:text-2xl flex items-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600 ml-1", children: "Ethiopian" }), _jsx("span", { className: "text-green-600 ml-1", children: "Fitness" })] }) }), _jsxs("nav", { className: "hidden md:flex items-center space-x-1", children: [_jsx(NavLink, { to: "/", className: ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`, children: "Home" }), _jsx(NavLink, { to: "/about", className: ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`, children: "About" }), _jsx(NavLink, { to: "/services", className: ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`, children: "Services" }), _jsx(NavLink, { to: "/contact", className: ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`, children: "Contact" }), _jsx(NavLink, { to: "/bmi", className: ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`, children: "BMI" })] }), _jsx("div", { className: "hidden md:flex items-center space-x-4", children: user ? (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: toggleProfile, className: "flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none", children: [_jsx(User, { size: 20 }), _jsx("span", { className: "font-medium", children: user.name }), _jsx(ChevronDown, { size: 16 })] }), profileOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200", children: [_jsx(Link, { to: "/profile", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-green-50", children: "Profile" }), user.role !== "user" && (_jsx(Link, { to: "/admin", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-green-50", children: "Dashboard" })), _jsx("button", { onClick: handleLogout, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50", children: "Logout" })] }))] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors", children: "Login" }), _jsx(Link, { to: "/register", className: "px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors", children: "Register" })] })) }), _jsx("button", { onClick: handleMenuToggle, className: "md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md transition-colors", "aria-label": menuOpen ? "Close menu" : "Open menu", "aria-expanded": menuOpen, children: menuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] }) }) }), menuOpen && (_jsx("div", { className: "md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300", onClick: handleMenuToggle, "aria-hidden": "true" })), menuOpen && (_jsxs("div", { className: `md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`, children: [_jsxs("div", { className: "flex justify-between items-center px-4 py-4 border-b border-gray-200", children: [_jsx(Link, { to: "/", className: "flex items-center", onClick: handleMenuToggle, children: _jsxs("div", { className: "text-green-700 font-bold text-lg flex items-center", children: [_jsx("span", { className: "text-red-600", children: "\u1218\u122A" }), _jsx("span", { className: "text-yellow-600 ml-1", children: "Ethiopian" }), _jsx("span", { className: "text-green-600 ml-1", children: "Fitness" })] }) }), _jsx("button", { onClick: handleMenuToggle, className: "flex items-center justify-center w-10 h-10 text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md transition-colors", "aria-label": "Close menu", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "px-4 py-6 space-y-2 max-h-screen overflow-y-auto", children: [_jsx(NavLink, { to: "/", onClick: handleMenuToggle, className: ({ isActive }) => `block px-4 py-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100"}`, children: "Home" }), _jsx(NavLink, { to: "/about", onClick: handleMenuToggle, className: ({ isActive }) => `block px-4 py-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100"}`, children: "About" }), _jsx(NavLink, { to: "/services", onClick: handleMenuToggle, className: ({ isActive }) => `block px-4 py-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100"}`, children: "Services" }), _jsx(NavLink, { to: "/contact", onClick: handleMenuToggle, className: ({ isActive }) => `block px-4 py-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100"}`, children: "Contact" }), _jsx(NavLink, { to: "/bmi", onClick: handleMenuToggle, className: ({ isActive }) => `block px-4 py-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100"}`, children: "BMI Calculator" }), user ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "pt-4 border-t border-gray-200", children: _jsx("div", { className: "px-4 py-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx(User, { size: 20, className: "text-gray-500 mr-3" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: user.name })] }) }) }), _jsx(Link, { to: "/profile", onClick: handleMenuToggle, className: "block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100 transition-colors touch-manipulation", children: "Profile" }), user.role !== "user" && (_jsx(Link, { to: "/admin", onClick: handleMenuToggle, className: "block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 active:bg-green-100 transition-colors touch-manipulation", children: "Dashboard" })), _jsx("button", { onClick: handleLogout, className: "block w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation", children: "Logout" })] })) : (_jsxs("div", { className: "pt-6 border-t border-gray-200 space-y-3", children: [_jsx(Link, { to: "/login", onClick: handleMenuToggle, className: "block w-full px-4 py-3 text-center rounded-lg text-lg font-medium text-gray-700 border border-gray-300 hover:text-green-600 hover:border-green-300 hover:bg-green-50 active:bg-green-100 transition-colors touch-manipulation", children: "Login" }), _jsx(Link, { to: "/register", onClick: handleMenuToggle, className: "block w-full px-4 py-3 text-center rounded-lg text-lg font-medium text-white bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors touch-manipulation", children: "Sign Up" })] }))] })] }))] }));
};
export default Navbar;
