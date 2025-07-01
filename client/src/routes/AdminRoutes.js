import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { ChevronDown, Users, MessageSquare, Dumbbell, UtensilsCrossed, Settings, LogOut, UserCircle } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminFeedback from '../pages/admin/AdminFeedback';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminFitnessPlans from '../pages/admin/AdminFitnessPlans';
const AdminRoutes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, session, isLoading } = useAuth();
    const superAdminNavItems = [
        {
            href: "/admin/users",
            icon: _jsx(Users, { size: 20 }),
            label: "Users Management",
        },
        {
            href: "/admin/feedback",
            icon: _jsx(MessageSquare, { size: 20 }),
            label: "User Feedback",
        },
        {
            href: "/admin/fitness-plans",
            icon: _jsx(Dumbbell, { size: 20 }),
            label: "Fitness Plans",
        },
        {
            href: "/admin/nutrition-plans",
            icon: _jsx(UtensilsCrossed, { size: 20 }),
            label: "Nutrition Plans",
        },
        {
            href: "/admin/settings",
            icon: _jsx(Settings, { size: 20 }),
            label: "Settings",
        },
    ];
    const adminFitnessNavItems = [
        {
            href: "/admin/users",
            icon: _jsx(Users, { size: 20 }),
            label: "Users Management",
        },
        {
            href: "/admin/fitness-plans",
            icon: _jsx(Dumbbell, { size: 20 }),
            label: "Fitness Plans",
        },
        {
            href: "/admin/settings",
            icon: _jsx(Settings, { size: 20 }),
            label: "Settings",
        },
    ];
    const adminNutritionNavItems = [
        {
            href: "/admin/users",
            icon: _jsx(Users, { size: 20 }),
            label: "Users Management",
        },
        {
            href: "/admin/nutrition-plans",
            icon: _jsx(UtensilsCrossed, { size: 20 }),
            label: "Nutrition Plans",
        },
        {
            href: "/admin/settings",
            icon: _jsx(Settings, { size: 20 }),
            label: "Settings",
        },
    ];
    const currentNavItems = useMemo(() => {
        if (user?.role === "admin_super") {
            return superAdminNavItems;
        }
        else if (user?.role === "admin_fitness") {
            return adminFitnessNavItems;
        }
        else if (user?.role === "admin_nutritionist") {
            return adminNutritionNavItems;
        }
        return [];
    }, [user?.role]);
    const role = user?.role || '';
    if (isLoading) {
        return _jsx("div", { className: "flex items-center justify-center min-h-screen", children: "Loading..." });
    }
    if (!session || !user || !role || !currentNavItems.length) {
        navigate('/auth/login');
        return null;
    }
    const AdminLayout = ({ children }) => (_jsxs("div", { className: "flex min-h-screen bg-gray-100", children: [_jsxs("aside", { className: "w-64 bg-gray-800 text-white flex flex-col", children: [_jsx("div", { className: "p-6 text-2xl font-bold text-green-400 border-b border-gray-700", children: "Admin Panel" }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: currentNavItems.map((item) => (_jsxs(Link, { to: item.href, className: `flex items-center p-3 rounded-md transition-colors
                ${location.pathname === item.href ? "bg-green-600" : "hover:bg-gray-700"}
              `, children: [item.icon, _jsx("span", { className: "ml-3 text-lg", children: item.label })] }, item.href))) }), _jsx("div", { className: "p-4 border-t border-gray-700", children: _jsxs(Link, { to: "/logout", className: "flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors", children: [_jsx(LogOut, { size: 20, className: "mr-3" }), _jsx("span", { className: "text-lg", children: "Logout" })] }) })] }), _jsxs("main", { className: "flex-1 flex flex-col", children: [_jsxs("header", { className: "flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm", children: [_jsxs("h1", { className: "text-3xl font-semibold text-gray-800", children: ["Welcome, ", user.name, "!"] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium", children: [role.replace("admin_", "").replace(/\b\w/g, (char) => char.toUpperCase()), " Admin"] }), _jsx("div", { className: "relative", children: _jsxs(Button, { variant: "ghost", className: "flex items-center space-x-2", onClick: () => { }, children: [_jsx(UserCircle, { size: 24, className: "text-gray-600" }), _jsx("span", { className: "text-gray-800", children: user.name }), _jsx(ChevronDown, { size: 16, className: "text-gray-500" })] }) })] })] }), _jsx("div", { className: "flex-1 p-6 overflow-auto", children: children })] })] }));
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/admin", element: _jsx(AdminLayout, { children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/users", element: _jsx(AdminLayout, { children: _jsx(AdminUsers, {}) }) }), _jsx(Route, { path: "/admin/feedback", element: _jsx(AdminLayout, { children: _jsx(AdminFeedback, {}) }) }), _jsx(Route, { path: "/admin/settings", element: _jsx(AdminLayout, { children: _jsx(AdminSettings, {}) }) }), _jsx(Route, { path: "/admin/fitness-plans", element: _jsx(AdminLayout, { children: _jsx(AdminFitnessPlans, {}) }) })] }));
};
export default AdminRoutes;
