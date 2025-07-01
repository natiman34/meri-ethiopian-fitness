import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Play, Pause, Info, Target, Clock } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
const ExerciseCard = ({ exercise, onClick, showDetails = false, variant = 'detailed' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getCategoryColor = (category) => {
        switch (category) {
            case 'strength': return 'bg-blue-100 text-blue-800';
            case 'cardio': return 'bg-red-100 text-red-800';
            case 'flexibility': return 'bg-purple-100 text-purple-800';
            case 'balance': return 'bg-indigo-100 text-indigo-800';
            case 'plyometric': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (variant === 'compact') {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden", onClick: onClick, role: "button", tabIndex: 0, onKeyDown: (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                    e.preventDefault();
                    onClick();
                }
            }, "aria-label": `View details for ${exercise.name} exercise`, children: [_jsxs("div", { className: "relative h-32", children: [_jsx(ImageWithFallback, { src: exercise.gifUrl || exercise.image, alt: exercise.name, className: "w-full h-full" }), _jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`, children: exercise.difficulty }) })] }), _jsxs("div", { className: "p-3", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate", children: exercise.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1 line-clamp-2", children: exercise.description }), _jsxs("div", { className: "flex items-center mt-2 text-xs text-gray-500", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: [exercise.estimatedTime, " min"] }), exercise.caloriesBurn && (_jsxs(_Fragment, { children: [_jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { children: [exercise.caloriesBurn, " cal"] })] }))] })] })] }));
    }
    if (variant === 'gallery') {
        return (_jsx("div", { className: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group", onClick: onClick, children: _jsxs("div", { className: "relative h-48", children: [_jsx(ImageWithFallback, { src: exercise.gifUrl || exercise.image, alt: exercise.name, className: "w-full h-full group-hover:scale-105 transition-transform duration-300" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsx("div", { className: "absolute top-3 left-3", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`, children: exercise.difficulty }) }), _jsx("div", { className: "absolute top-3 right-3", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exercise.category)}`, children: exercise.category }) }), _jsxs("div", { className: "absolute bottom-3 left-3 right-3", children: [_jsx("h3", { className: "text-white font-bold text-lg", children: exercise.name }), _jsxs("div", { className: "flex items-center mt-1 text-white/80 text-sm", children: [_jsx(Target, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: exercise.targetMuscles.slice(0, 2).join(', ') })] })] })] }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden", children: [_jsx("div", { className: "relative", children: _jsxs("div", { className: "h-48 bg-gray-100", children: [_jsx(ImageWithFallback, { src: exercise.gifUrl || exercise.image, alt: exercise.name, className: "w-full h-full" }), _jsxs("div", { className: "absolute top-3 left-3 flex gap-2", children: [_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`, children: exercise.difficulty }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exercise.category)}`, children: exercise.category })] }), _jsx("div", { className: "absolute top-3 right-3", children: _jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    setIsPlaying(!isPlaying);
                                }, className: "bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors", "aria-label": isPlaying ? 'Pause exercise animation' : 'Play exercise animation', children: isPlaying ? (_jsx(Pause, { className: "h-4 w-4 text-gray-700" })) : (_jsx(Play, { className: "h-4 w-4 text-gray-700" })) }) })] }) }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: exercise.name }), onClick && (_jsx("button", { onClick: onClick, className: "text-green-600 hover:text-green-700 transition-colors", "aria-label": `View more details about ${exercise.name}`, children: _jsx(Info, { className: "h-5 w-5" }) }))] }), _jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: exercise.description }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Clock, { className: "h-4 w-4 mr-2 text-green-600" }), _jsxs("span", { children: [exercise.estimatedTime, " min"] })] }), exercise.caloriesBurn && (_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Target, { className: "h-4 w-4 mr-2 text-red-600" }), _jsxs("span", { children: [exercise.caloriesBurn, " cal"] })] }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-2", children: "Target Muscles" }), _jsx("div", { className: "flex flex-wrap gap-1", children: exercise.targetMuscles.map((muscle, index) => (_jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: muscle }, index))) })] }), showDetails && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-2", children: "Equipment" }), _jsx("div", { className: "flex flex-wrap gap-1", children: exercise.equipment.map((item, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full", children: item }, index))) })] }), exercise.sets && exercise.sets.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-2", children: "Recommended Sets" }), _jsx("div", { className: "space-y-1", children: exercise.sets.slice(0, 3).map((set, index) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: ["Set ", set.setNumber] }), _jsxs("span", { className: "font-medium", children: [set.reps, " reps"] })] }, index))) })] }))] }))] })] }));
};
export default ExerciseCard;
