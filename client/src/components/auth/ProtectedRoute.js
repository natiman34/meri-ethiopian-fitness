"use client";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    if (isLoading) {
        return _jsx("div", { className: "flex justify-center items-center h-screen", children: "Loading..." });
    }
    if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (adminOnly && !isAdmin) {
        console.log("User not admin, redirecting to home");
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
