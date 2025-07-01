import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User, Edit2, Calendar } from 'lucide-react';
const ProfileNavigation = ({ activeSection, onSectionChange, userRole = 'user' }) => {
    const navigationItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: User,
            description: 'Profile summary and progress'
        },
        {
            id: 'personal-info',
            label: 'Personal Info',
            icon: Edit2,
            description: 'Edit your personal information'
        },
        ...(userRole === 'user' ? [
            {
                id: 'activity',
                label: 'Activity',
                icon: Calendar,
                description: 'Track your daily activities'
            }
        ] : [])
    ];
    return (_jsx("div", { className: "bg-white rounded-lg shadow-sm border mb-8", children: _jsxs("div", { className: "px-6 py-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Profile Sections" }), _jsx("div", { className: "hidden md:flex border-b border-gray-200", children: _jsx("nav", { className: "-mb-px flex space-x-8", children: navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs("button", { onClick: () => onSectionChange(item.id), className: `py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeSection === item.id
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: item.label })] }, item.id));
                        }) }) }), _jsx("div", { className: "md:hidden", children: _jsx("div", { className: "grid grid-cols-2 gap-2", children: navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsx("button", { onClick: () => onSectionChange(item.id), className: `p-3 rounded-lg border-2 transition-colors ${activeSection === item.id
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex flex-col items-center space-y-1", children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { className: "text-xs font-medium", children: item.label })] }) }, item.id));
                        }) }) }), _jsx("div", { className: "mt-4 hidden md:block", children: _jsx("p", { className: "text-sm text-gray-600", children: navigationItems.find(item => item.id === activeSection)?.description }) })] }) }));
};
export default ProfileNavigation;
