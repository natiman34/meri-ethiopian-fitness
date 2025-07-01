import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ChevronRight } from "lucide-react";
import EducationalContent from "./services/EducationalContent";
import MotivationalContent from "./services/MotivationalContent";
import FitnessPlanDetail from "./services/FitnessPlanDetail";
import NutritionPlanDetail from "./services/NutritionPlanDetail";
import EducationalContentDetail from "./services/EducationalContentDetail";
import MotivationalContentDetail from "./services/MotivationalContentDetail";
import FitnessAndNutritionPlans from "./services/FitnessAndNutritionPlans";
import PhysicalFitnessGuide from "./services/PhysicalFitnessGuide";
import BMICalculator from "./services/BMICalculator";
import FitnessAssessment from "./services/FitnessAssessment";
const ServicesOverview = () => {
    // Using mock data for demonstration
    const mockServices = [
        {
            title: "Fitness and Nutrition Plans",
            description: "Comprehensive workout routines and authentic Ethiopian nutrition plans designed by expert nutritionists, combining traditional cuisine with modern fitness science.",
            icon: "💪🍽️",
            link: "fitness-and-nutrition-plans",
        },
        {
            title: "Educational Content",
            description: "Learn about fitness, nutrition, and well-being with our expert articles and guides.",
            icon: "📚",
            link: "educational-content",
        },
        {
            title: "Motivational Content",
            description: "Stay inspired and motivated on your journey with daily tips and success stories.",
            icon: "🔥",
            link: "motivational-content",
        },
    ];
    return (_jsx("div", { className: "min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-extrabold text-gray-900 text-center mb-8", children: "Our Services" }), _jsx("p", { className: "text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto", children: "Explore our comprehensive range of services designed to help you achieve your fitness and wellness goals." }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8", children: mockServices.map((service, index) => (_jsxs(Card, { className: "transform transition duration-300 hover:scale-105", children: [_jsx("div", { className: "flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl mb-6", children: service.icon }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-3", children: service.title }), _jsx("p", { className: "text-gray-600 mb-6 flex-grow", children: service.description }), _jsx(Link, { to: service.link, className: "mt-auto", children: _jsxs(Button, { variant: "primary", size: "lg", className: "w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105", children: ["Learn More & Explore", _jsx(ChevronRight, { className: "ml-2 h-5 w-5" })] }) })] }, index))) })] }) }));
};
const Services = () => {
    console.log("Services component rendering. Current path:", window.location.pathname);
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ServicesOverview, {}) }), _jsx(Route, { path: "fitness-and-nutrition-plans", element: _jsx(FitnessAndNutritionPlans, {}) }), _jsx(Route, { path: "educational-content", element: _jsx(EducationalContent, {}) }), _jsx(Route, { path: "educational-content/physical-fitness", element: _jsx(PhysicalFitnessGuide, {}) }), _jsx(Route, { path: "educational-content/tools/bmi-calculator", element: _jsx(BMICalculator, {}) }), _jsx(Route, { path: "educational-content/tools/fitness-assessment", element: _jsx(FitnessAssessment, {}) }), _jsx(Route, { path: "educational-content/:id", element: _jsx(EducationalContentDetail, {}) }), _jsx(Route, { path: "motivational-content", element: _jsx(MotivationalContent, {}) }), _jsx(Route, { path: "motivational-content/:id", element: _jsx(MotivationalContentDetail, {}) }), _jsx(Route, { path: "fitness-plans/:id", element: _jsx(FitnessPlanDetail, {}) }), _jsx(Route, { path: "nutrition-plans/:id", element: _jsx(NutritionPlanDetail, {}) })] }));
};
export default Services;
