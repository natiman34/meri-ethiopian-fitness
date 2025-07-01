"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ExerciseDetailModal from "../../components/ExerciseDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import { FitnessPlanService } from "../../services/FitnessPlanService";
import { Loader2, AlertCircle, Calendar, Clock, Target, TrendingUp, Star, Play, Bookmark, Share2, ChevronLeft, ChevronRight, CheckCircle, Heart } from "lucide-react";
const EnhancedFitnessPlanDetail = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { user } = useAuth();
    // Check if this is a newly created plan (hide sidebar elements)
    const hideActions = searchParams.get('hideActions') === 'true' || searchParams.get('preview') === 'true';
    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) {
                setError("Plan ID is missing.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const fitnessPlanService = FitnessPlanService.getInstance();
                const fetchedPlan = await fitnessPlanService.getFitnessPlanById(id);
                if (fetchedPlan) {
                    setPlan(fetchedPlan);
                    if (fetchedPlan.schedule.length > 0) {
                        setSelectedDay(fetchedPlan.schedule[0].day);
                    }
                }
                else {
                    setError("Fitness plan not found.");
                }
            }
            catch (err) {
                console.error("Failed to fetch fitness plan:", err);
                setError("Failed to load fitness plan. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, [id]);
    if (isLoading) {
        return (_jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-12 w-12 animate-spin text-green-500 mx-auto mb-4" }), _jsx("p", { className: "text-xl text-gray-700", children: "Loading plan details..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md flex items-center max-w-md", children: [_jsx(AlertCircle, { className: "h-8 w-8 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("strong", { className: "font-bold block", children: "Error:" }), _jsx("span", { className: "block sm:inline", children: error })] })] }) }));
    }
    if (!plan) {
        return (_jsx("div", { className: "pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsx("h1", { className: "text-3xl font-bold text-red-600", children: "Plan not found" }) }) }));
    }
    const currentDaySchedule = plan.schedule.find(day => day.day === selectedDay);
    const planImages = [
        plan.image_url || "https://via.placeholder.com/1200x400?text=Fitness+Plan",
        "https://via.placeholder.com/1200x400?text=Workout+Preview",
        "https://via.placeholder.com/1200x400?text=Results+Preview"
    ];
    const getLevelColor = (level) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getDifficultyStars = (difficulty) => {
        return Array.from({ length: 5 }, (_, i) => (_jsx(Star, { className: `h-5 w-5 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}` }, i)));
    };
    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % planImages.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + planImages.length) % planImages.length);
    };
    return (_jsxs("div", { className: "pt-24 pb-16", children: [_jsxs("div", { className: "relative h-[500px] mb-12", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("img", { src: planImages[currentImageIndex], alt: plan.title, className: "w-full h-full object-cover transition-opacity duration-500" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" })] }), _jsxs("div", { className: "absolute top-4 right-4 flex space-x-2", children: [_jsx("button", { onClick: prevImage, className: "bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsx("button", { onClick: nextImage, className: "bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors", children: _jsx(ChevronRight, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2", children: planImages.map((_, index) => (_jsx("button", { onClick: () => setCurrentImageIndex(index), className: `w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}` }, index))) }), _jsx("div", { className: "relative h-full flex items-center", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsxs("span", { className: `inline-block px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(plan.level)}`, children: [plan.level.charAt(0).toUpperCase() + plan.level.slice(1), " Level"] }), plan.featured && (_jsx("span", { className: "inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold", children: "\u2B50 Featured Plan" }))] }), _jsx("h1", { className: "text-5xl md:text-6xl font-bold text-white mb-6 leading-tight", children: plan.title }), !hideActions && (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3", children: [_jsx(Calendar, { className: "h-6 w-6 text-green-400 mb-1" }), _jsx("span", { className: "text-sm text-gray-300 block", children: "Duration" }), _jsxs("p", { className: "font-semibold text-white text-lg", children: [plan.duration, " Weeks"] })] }), _jsxs("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3", children: [_jsx(Clock, { className: "h-6 w-6 text-blue-400 mb-1" }), _jsx("span", { className: "text-sm text-gray-300 block", children: "Weekly Sessions" }), _jsxs("p", { className: "font-semibold text-white text-lg", children: [plan.weekly_workouts, " Days"] })] }), _jsxs("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3", children: [_jsx(Target, { className: "h-6 w-6 text-purple-400 mb-1" }), _jsx("span", { className: "text-sm text-gray-300 block", children: "Difficulty" }), _jsx("div", { className: "flex items-center", children: _jsx("div", { className: "flex mr-2", children: getDifficultyStars(plan.difficulty) }) })] }), plan.estimated_calories_burn && (_jsxs("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3", children: [_jsx(TrendingUp, { className: "h-6 w-6 text-red-400 mb-1" }), _jsx("span", { className: "text-sm text-gray-300 block", children: "Weekly Calories" }), _jsx("p", { className: "font-semibold text-white text-lg", children: plan.estimated_calories_burn })] }))] })), _jsx("p", { className: "text-xl text-white/90 leading-relaxed max-w-3xl", children: plan.description }), !hideActions && (_jsxs("div", { className: "flex flex-wrap gap-4 mt-8", children: [_jsxs(Button, { variant: "primary", size: "lg", className: "flex items-center gap-2", children: [_jsx(Play, { className: "h-5 w-5" }), "Start Plan"] }), _jsxs(Button, { variant: "outline", size: "lg", className: "flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20", children: [_jsx(Bookmark, { className: "h-5 w-5" }), "Save Plan"] }), _jsxs(Button, { variant: "outline", size: "lg", className: "flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20", children: [_jsx(Share2, { className: "h-5 w-5" }), "Share"] })] }))] }) }) })] }), _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: `grid grid-cols-1 ${hideActions ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-8`, children: [!hideActions && (_jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [_jsxs("h2", { className: "text-xl font-semibold mb-4 flex items-center", children: [_jsx(Target, { className: "h-5 w-5 mr-2 text-green-600" }), "Plan Overview"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Target Audience" }), _jsx("p", { className: "text-gray-600", children: plan.target_audience })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Prerequisites" }), _jsx("ul", { className: "space-y-1", children: plan.prerequisites.map((prereq, index) => (_jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-gray-600", children: prereq })] }, index))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Required Equipment" }), _jsx("div", { className: "flex flex-wrap gap-2", children: plan.equipment.map((item, index) => (_jsx("span", { className: "px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full", children: item }, index))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Goals" }), _jsx("div", { className: "flex flex-wrap gap-2", children: plan.goals.map((goal, index) => (_jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full", children: goal }, index))) })] }), plan.rating && (_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Rating" }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex mr-2", children: getDifficultyStars(plan.rating) }), _jsxs("span", { className: "text-gray-600", children: ["(", plan.reviewCount || 0, " reviews)"] })] })] }))] })] }), !user ? (_jsx(Card, { children: _jsxs(Card.Body, { className: "text-center", children: [_jsx(Heart, { className: "h-12 w-12 text-green-600 mx-auto mb-4" }), _jsx("h3", { className: "font-semibold text-lg mb-2", children: "Want to save this plan?" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Create an account to save this plan to your profile and track your progress." }), _jsx(Link, { to: "/register", children: _jsx(Button, { variant: "primary", fullWidth: true, children: "Sign Up Now" }) }), _jsxs("p", { className: "mt-4 text-sm text-gray-500", children: ["Already have an account? ", _jsx(Link, { to: "/login", className: "text-green-600", children: "Log in" })] })] }) })) : null] })), _jsx("div", { className: hideActions ? 'lg:col-span-1' : 'lg:col-span-3', children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Workout Schedule" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-8", children: plan.schedule.map((day) => (_jsxs("button", { onClick: () => setSelectedDay(day.day), className: `px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${selectedDay === day.day
                                                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                                : day.restDay
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'}`, children: ["Day ", day.day, " ", day.restDay ? '(Rest)' : ''] }, day.day))) }), currentDaySchedule && (_jsx("div", { children: currentDaySchedule.restDay ? (_jsx("div", { className: "text-center py-16", children: _jsxs("div", { className: "bg-gray-50 rounded-2xl p-12 max-w-md mx-auto", children: [_jsx(Heart, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-2", children: "Rest Day" }), _jsx("p", { className: "text-gray-600", children: "Take this day to recover and let your body heal. Rest is just as important as training!" })] }) })) : (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-900", children: ["Day ", currentDaySchedule.day, " Workout"] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [currentDaySchedule.totalEstimatedTime, " min"] })] }), currentDaySchedule.totalCaloriesBurn && (_jsxs("div", { className: "flex items-center", children: [_jsx(TrendingUp, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [currentDaySchedule.totalCaloriesBurn, " cal"] })] }))] })] }), currentDaySchedule.exercises.map((exercise, index) => (_jsx("div", { className: "border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [_jsx("div", { className: "lg:w-1/3", children: _jsxs("div", { className: "relative", children: [_jsx("img", { src: exercise.gifUrl || exercise.image || "https://via.placeholder.com/300x200?text=Exercise", alt: exercise.name, className: "w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity", onClick: () => handleExerciseClick(exercise) }), _jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: "px-2 py-1 bg-black/70 text-white text-xs rounded-full", children: index + 1 }) })] }) }), _jsxs("div", { className: "lg:w-2/3", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: exercise.name }), _jsx("p", { className: "text-gray-600 mb-4", children: exercise.description }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-4", children: exercise.targetMuscles && exercise.targetMuscles.length > 0 && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("span", { className: "text-sm text-gray-500 block", children: "Target Muscles" }), _jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [exercise.targetMuscles.slice(0, 2).map((muscle, idx) => (_jsx("span", { className: "px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full", children: muscle }, idx))), exercise.targetMuscles.length > 2 && (_jsxs("span", { className: "px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full", children: ["+", exercise.targetMuscles.length - 2] }))] })] })) }), exercise.difficulty && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Difficulty" }), _jsx("p", { className: "font-semibold text-lg capitalize", children: exercise.difficulty })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [exercise.sets && exercise.sets.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Sets" }), _jsx("p", { className: "font-semibold text-lg", children: exercise.sets.length })] })), exercise.sets && exercise.sets.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Reps" }), exercise.sets.map((set, idx) => (_jsx("span", { className: "font-semibold text-lg mr-2", children: set.reps }, idx)))] })), exercise.sets && exercise.sets.length > 0 && exercise.sets[0].duration && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Duration (per set)" }), _jsx("p", { className: "font-semibold text-lg", children: exercise.sets[0].duration })] }))] }), exercise.equipment && exercise.equipment.length > 0 && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("span", { className: "text-sm text-gray-500 block", children: "Equipment" }), _jsx("div", { className: "flex flex-wrap gap-2", children: exercise.equipment.map((item, idx) => (_jsx("span", { className: "px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full", children: item }, idx))) })] })), _jsxs("button", { onClick: () => handleExerciseClick(exercise), className: "text-green-600 hover:text-green-700 font-medium flex items-center gap-1", children: ["View Details", _jsx(ChevronRight, { className: "h-4 w-4" })] })] })] }) }, exercise.id)))] })) }))] }) })] }) }), _jsx(ExerciseDetailModal, { exercise: selectedExercise, isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedExercise(null);
                } })] }));
};
export default EnhancedFitnessPlanDetail;
