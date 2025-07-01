import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Star, Clock, Heart, Scale } from 'lucide-react';
const categoryConfig = {
    'weight-loss': {
        color: "bg-blue-100 text-blue-800",
        icon: "🔥",
        description: "Plans focused on burning calories and fat loss"
    },
    'weight-gain': {
        color: "bg-purple-100 text-purple-800",
        icon: "💪",
        description: "Plans focused on muscle building and weight gain"
    },
    'maintenance': {
        color: "bg-green-100 text-green-800",
        icon: "⚖️",
        description: "Plans focused on maintaining current fitness level"
    },
    'muscle-building': {
        color: "bg-red-100 text-red-800",
        icon: "🏋️",
        description: "Plans focused on building strength and muscle mass"
    },
    'endurance-training': {
        color: "bg-yellow-100 text-yellow-800",
        icon: "🧘",
        description: "Plans focused on improving flexibility and mobility"
    },
    'endurance': {
        color: "bg-orange-100 text-orange-800",
        icon: "🏃",
        description: "Plans focused on building cardiovascular endurance"
    },
    'functional': {
        color: "bg-teal-100 text-teal-800",
        icon: "⚡",
        description: "Plans focused on functional movements and athletic performance"
    }
};
const NutritionPlanCard = ({ plan, variant = 'default', showStats = false, }) => {
    const displayCategory = categoryConfig[plan.category] || {
        color: "bg-gray-100 text-gray-800",
        icon: "🍽️",
        description: "General nutrition plan"
    };
    const cardClasses = {
        default: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300",
        featured: "bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 relative",
        compact: "bg-white rounded-lg shadow-sm flex items-center p-4 hover:shadow-md transition-shadow duration-300",
    };
    const renderContent = () => (_jsxs(_Fragment, { children: [variant === 'featured' && (_jsx("div", { className: "bg-gradient-to-r from-green-400 to-green-500 p-3 text-center", children: _jsxs("div", { className: "flex items-center justify-center text-white", children: [_jsx(Star, { className: "h-4 w-4 mr-2 fill-current" }), _jsx("span", { className: "font-semibold", children: "Featured Plan" })] }) })), variant !== 'compact' && (_jsx("div", { className: "p-2 bg-gray-50 border-b", children: _jsxs("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${displayCategory.color}`, children: [displayCategory.icon, " ", plan.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())] }) })), _jsxs("div", { className: variant === 'featured' ? "p-6" : "p-4", children: [_jsx("h3", { className: `font-semibold mb-2 ${variant === 'featured' ? "text-xl" : "text-lg"}`, children: plan.title }), variant !== 'compact' && (_jsx("p", { className: `text-sm mb-3 ${variant === 'featured' ? "text-green-100" : "text-gray-600"} line-clamp-2`, children: plan.description })), showStats && (_jsxs("div", { className: `flex items-center justify-between text-sm ${variant === 'featured' ? "text-green-100" : "text-gray-500"} mt-3`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: [plan.duration, " days"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Scale, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: [plan.calorieRange.min, "-", plan.calorieRange.max, " kcal"] })] })] })), variant === 'featured' && plan.features && (_jsx("div", { className: "mt-4", children: _jsx("ul", { className: "text-green-100 text-sm space-y-1", children: plan.features.map((feature, index) => (_jsxs("li", { className: "flex items-center", children: [_jsx(Heart, { className: "h-3 w-3 mr-2 fill-current text-green-300" }), feature] }, index))) }) })), variant === 'compact' && (_jsxs("div", { className: "ml-4 flex-grow", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: plan.title }), showStats && (_jsxs("div", { className: "flex items-center text-sm text-gray-500 mt-1", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: [plan.duration, " days"] }), _jsx(Scale, { className: "h-3 w-3 ml-4 mr-1" }), _jsxs("span", { children: [plan.calorieRange.min, "-", plan.calorieRange.max, " kcal"] })] }))] }))] })] }));
    if (variant === 'compact') {
        return (_jsx(Link, { to: `/services/nutrition-plans/${plan.id}`, className: cardClasses[variant], children: renderContent() }));
    }
    return (_jsx(Link, { to: `/services/nutrition-plans/${plan.id}`, className: cardClasses[variant], children: renderContent() }));
};
export default NutritionPlanCard;
