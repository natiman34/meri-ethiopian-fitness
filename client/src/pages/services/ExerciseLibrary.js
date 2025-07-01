"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { exercises } from "../../data/exercises";
import ExerciseGallery from "../../components/ExerciseGallery";
import ExerciseDetailModal from "../../components/ExerciseDetailModal";
import ExerciseCard from "../../components/ExerciseCard";
const ExerciseLibrary = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };
    // Get statistics
    const stats = {
        total: exercises.length,
        byDifficulty: {
            beginner: exercises.filter(e => e.difficulty === 'beginner').length,
            intermediate: exercises.filter(e => e.difficulty === 'intermediate').length,
            advanced: exercises.filter(e => e.difficulty === 'advanced').length,
        },
        byCategory: {
            strength: exercises.filter(e => e.category === 'strength').length,
            cardio: exercises.filter(e => e.category === 'cardio').length,
            flexibility: exercises.filter(e => e.category === 'flexibility').length,
            balance: exercises.filter(e => e.category === 'balance').length,
            plyometric: exercises.filter(e => e.category === 'plyometric').length,
        },
        byMuscleGroup: {
            chest: exercises.filter(e => e.muscleGroup === 'chest').length,
            back: exercises.filter(e => e.muscleGroup === 'back').length,
            legs: exercises.filter(e => e.muscleGroup === 'legs').length,
            shoulders: exercises.filter(e => e.muscleGroup === 'shoulders').length,
            arms: exercises.filter(e => e.muscleGroup === 'biceps' || e.muscleGroup === 'triceps').length,
            abs: exercises.filter(e => e.muscleGroup === 'abs').length,
            glutes: exercises.filter(e => e.muscleGroup === 'glutes').length,
            'full-body': exercises.filter(e => e.muscleGroup === 'full-body').length,
        }
    };
    return (_jsxs("div", { className: "pt-24 pb-16", children: [_jsx("div", { className: "bg-gradient-to-r from-green-600 to-green-800 text-white py-16 mb-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-6", children: "Exercise Library" }), _jsx("p", { className: "text-xl text-green-100 mb-8", children: "Discover our comprehensive collection of exercises with detailed instructions, GIF demonstrations, and expert tips to help you achieve your fitness goals." }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 mt-12", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-1", children: stats.total }), _jsx("div", { className: "text-green-200", children: "Total Exercises" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-1", children: stats.byDifficulty.beginner }), _jsx("div", { className: "text-green-200", children: "Beginner" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-1", children: stats.byDifficulty.intermediate }), _jsx("div", { className: "text-green-200", children: "Intermediate" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold mb-1", children: stats.byDifficulty.advanced }), _jsx("div", { className: "text-green-200", children: "Advanced" })] })] })] }) }) }), _jsxs("div", { className: "container mx-auto px-4 mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Exercise Categories" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Object.entries(stats.byCategory).map(([category, count]) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 capitalize", children: category.replace('-', ' ') }), _jsx("div", { className: "text-2xl font-bold text-green-600", children: count })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-600 h-2 rounded-full", style: { width: `${(count / stats.total) * 100}%` } }) })] }, category))) })] }), _jsxs("div", { className: "container mx-auto px-4 mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Target Muscle Groups" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(stats.byMuscleGroup).map(([muscle, count]) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 mb-1", children: count }), _jsx("div", { className: "text-sm text-gray-600 capitalize", children: muscle.replace('-', ' ') })] }, muscle))) })] }), _jsxs("div", { className: "container mx-auto px-4 mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Featured Exercises" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: exercises.slice(0, 8).map((exercise) => (_jsx(ExerciseCard, { exercise: exercise, variant: "detailed", onClick: () => handleExerciseClick(exercise) }, exercise.id))) })] }), _jsx("div", { className: "container mx-auto px-4", children: _jsx(ExerciseGallery, { exercises: exercises, title: "Complete Exercise Library", showFilters: true, variant: viewMode }) }), _jsx(ExerciseDetailModal, { exercise: selectedExercise, isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedExercise(null);
                } })] }));
};
export default ExerciseLibrary;
