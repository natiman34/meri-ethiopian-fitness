import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import ExerciseCard from './ExerciseCard';
import ExerciseDetailModal from './ExerciseDetailModal';
import { Search, Target } from 'lucide-react';
const ExerciseGallery = ({ exercises, title = "Exercise Library", showFilters = true, variant = 'grid' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const difficulties = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.difficulty)))], [exercises]);
    const categories = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.category)))], [exercises]);
    const muscleGroups = useMemo(() => ['all', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))], [exercises]);
    const filteredExercises = useMemo(() => {
        return exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
            const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
            const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
            return matchesSearch && matchesDifficulty && matchesCategory && matchesMuscleGroup;
        });
    }, [exercises, searchTerm, selectedDifficulty, selectedCategory, selectedMuscleGroup]);
    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDifficulty('all');
        setSelectedCategory('all');
        setSelectedMuscleGroup('all');
    };
    const getGridClasses = () => {
        switch (variant) {
            case 'grid':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
            case 'list':
                return 'space-y-4';
            case 'masonry':
                return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4';
            default:
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600", children: "Discover and learn from our comprehensive exercise library" })] }), showFilters && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "relative mb-6", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Search exercises by name, description, or target muscles...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Difficulty" }), _jsx("select", { value: selectedDifficulty, onChange: (e) => setSelectedDifficulty(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", children: difficulties.map(difficulty => (_jsx("option", { value: difficulty, children: difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }, difficulty))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", children: categories.map(category => (_jsx("option", { value: category, children: category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1) }, category))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Muscle Group" }), _jsx("select", { value: selectedMuscleGroup, onChange: (e) => setSelectedMuscleGroup(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", children: muscleGroups.map(muscleGroup => (_jsx("option", { value: muscleGroup, children: muscleGroup === 'all' ? 'All Muscle Groups' : muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1) }, muscleGroup))) })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: clearFilters, className: "w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors", children: "Clear Filters" }) })] }), (searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all' || selectedMuscleGroup !== 'all') && (_jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Active filters:" }), searchTerm && (_jsxs("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full", children: ["Search: \"", searchTerm, "\""] })), selectedDifficulty !== 'all' && (_jsxs("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: ["Difficulty: ", selectedDifficulty] })), selectedCategory !== 'all' && (_jsxs("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full", children: ["Category: ", selectedCategory] })), selectedMuscleGroup !== 'all' && (_jsxs("span", { className: "px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full", children: ["Muscle Group: ", selectedMuscleGroup] }))] }))] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "text-gray-600", children: ["Showing ", filteredExercises.length, " of ", exercises.length, " exercises"] }), filteredExercises.length !== exercises.length && (_jsx("button", { onClick: clearFilters, className: "text-green-600 hover:text-green-700 text-sm underline", children: "Clear all filters" }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "View:" }), _jsx("div", { className: "flex bg-gray-100 rounded-lg p-1", children: ['grid', 'list', 'masonry'].map((view) => (_jsx("button", { onClick: () => { }, className: `px-3 py-1 text-xs rounded ${variant === view ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`, children: view.charAt(0).toUpperCase() + view.slice(1) }, view))) })] })] }), filteredExercises.length > 0 ? (_jsx("div", { className: getGridClasses(), children: filteredExercises.map((exercise) => (_jsx("div", { className: variant === 'masonry' ? 'break-inside-avoid' : '', children: _jsx(ExerciseCard, { exercise: exercise, variant: variant === 'list' ? 'detailed' : 'gallery', onClick: () => handleExerciseClick(exercise) }) }, exercise.id))) })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Target, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No exercises found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Try adjusting your search terms or filters to find what you're looking for." }), _jsx("button", { onClick: clearFilters, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Clear all filters" })] })), _jsx(ExerciseDetailModal, { exercise: selectedExercise, isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedExercise(null);
                } })] }));
};
export default ExerciseGallery;
