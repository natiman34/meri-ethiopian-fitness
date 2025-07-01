import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Star, Clock, Users, ChefHat } from "lucide-react";
import { nutritionPlanService } from "../../services/NutritionPlanService";
import NutritionPlanCard from "../../components/NutritionPlanCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
const NutritionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const categories = [
        { value: "all", label: "All Plans", icon: "🍽️" },
        { value: "weight-loss", label: "Weight Loss", icon: "🔥" },
        { value: "weight-gain", label: "Weight Gain", icon: "💪" },
        { value: "maintenance", label: "Maintenance", icon: "⚖️" },
        { value: "muscle-building", label: "Muscle Building", icon: "🏋️" },
        { value: "endurance", label: "Endurance", icon: "🏃" },
    ];
    useEffect(() => {
        fetchNutritionPlans();
    }, []);
    useEffect(() => {
        filterAndSortPlans();
    }, [plans, searchTerm, selectedCategory, sortBy]);
    const fetchNutritionPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedPlans = await nutritionPlanService.getAllNutritionPlans();
            setPlans(fetchedPlans);
        }
        catch (err) {
            console.error("Error fetching nutrition plans:", err);
            setError("Failed to load nutrition plans. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };
    const filterAndSortPlans = () => {
        let filtered = plans;
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(plan => plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(plan => plan.category === selectedCategory);
        }
        // Sort plans
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "popular":
                    return (b.rating || 0) - (a.rating || 0);
                case "duration":
                    return a.duration - b.duration;
                default:
                    return 0;
            }
        });
        setFilteredPlans(filtered);
    };
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
    if (loading) {
        return (_jsx("div", { className: "pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsx("div", { className: "flex justify-center items-center h-64", children: _jsx(LoadingSpinner, { size: "lg" }) }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsx("div", { className: "text-center", children: _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-red-800 mb-2", children: "Error Loading Plans" }), _jsx("p", { className: "text-red-600 mb-4", children: error }), _jsx("button", { onClick: fetchNutritionPlans, className: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors", children: "Try Again" })] }) }) }) }));
    }
    return (_jsx("div", { className: "pt-24 pb-16 bg-gray-50 min-h-screen", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Ethiopian Traditional Nutrition Plans" }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Discover authentic Ethiopian nutrition plans designed by our expert nutritionists. Each plan combines traditional Ethiopian cuisine with modern nutritional science." }), _jsxs("div", { className: "flex justify-center items-center mt-6 space-x-8 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(ChefHat, { className: "h-5 w-5 mr-2 text-green-600" }), _jsx("span", { children: "Expert Designed" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: "h-5 w-5 mr-2 text-yellow-500" }), _jsx("span", { children: "Culturally Authentic" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-5 w-5 mr-2 text-blue-600" }), _jsx("span", { children: "Community Tested" })] })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0", children: [_jsxs("div", { className: "relative flex-grow lg:max-w-md", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search nutrition plans...", className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: "flex flex-wrap items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "h-4 w-4 text-gray-500" }), _jsx("select", { value: selectedCategory, onChange: (e) => handleCategoryChange(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent", children: categories.map((category) => (_jsxs("option", { value: category.value, children: [category.icon, " ", category.label] }, category.value))) })] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [_jsx("option", { value: "newest", children: "Newest First" }), _jsx("option", { value: "popular", children: "Most Popular" }), _jsx("option", { value: "duration", children: "Shortest Duration" })] }), _jsxs("div", { className: "flex border border-gray-300 rounded-lg overflow-hidden", children: [_jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`, children: _jsx(Grid, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => setViewMode("list"), className: `p-2 ${viewMode === "list" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`, children: _jsx(List, { className: "h-4 w-4" }) })] })] })] }) }), _jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "text-gray-600", children: ["Showing ", filteredPlans.length, " of ", plans.length, " nutrition plans", selectedCategory !== "all" && (_jsxs("span", { className: "ml-2 text-green-600 font-medium", children: ["in ", categories.find(c => c.value === selectedCategory)?.label] }))] }), filteredPlans.length > 0 && (_jsxs("div", { className: "text-sm text-gray-500", children: [_jsx(Clock, { className: "inline h-4 w-4 mr-1" }), "Avg. duration: ", Math.round(filteredPlans.reduce((acc, plan) => acc + plan.duration, 0) / filteredPlans.length), " days"] }))] }), filteredPlans.length === 0 ? (_jsx("div", { className: "text-center py-16", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [_jsx(ChefHat, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No Plans Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: searchTerm || selectedCategory !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "No nutrition plans are currently available." }), (searchTerm || selectedCategory !== "all") && (_jsx("button", { onClick: () => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                }, className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors", children: "Clear Filters" }))] }) })) : (_jsx("div", { className: viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4", children: filteredPlans.map((plan, index) => (_jsx(NutritionPlanCard, { plan: plan, variant: index === 0 && viewMode === "grid" ? "featured" : viewMode === "list" ? "compact" : "default", showStats: true }, plan.id))) })), filteredPlans.length > 0 && (_jsxs("div", { className: "mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Ready to Start Your Nutrition Journey?" }), _jsx("p", { className: "text-green-100 mb-6 max-w-2xl mx-auto", children: "Join thousands of people who have transformed their health with our authentic Ethiopian nutrition plans. Each plan is carefully crafted to honor traditional cuisine while meeting modern nutritional needs." }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4", children: [_jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [plans.length, "+"] }), _jsx("div", { className: "text-sm text-green-100", children: "Nutrition Plans" })] }), _jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: "100%" }), _jsx("div", { className: "text-sm text-green-100", children: "Ethiopian Authentic" })] }), _jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: "Expert" }), _jsx("div", { className: "text-sm text-green-100", children: "Designed" })] })] })] }))] }) }));
};
export default NutritionPlans;
