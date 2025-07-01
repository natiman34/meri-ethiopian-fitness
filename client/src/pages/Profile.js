"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { User, Mail, Edit2, Save, X, Ruler, Scale, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import ProfileNavigation from "../components/profile/ProfileNavigation";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parse } from 'date-fns';
import { supabase } from '../lib/supabase';
import { activityProgressService } from '../services/ActivityProgressService';
const getCalendarDays = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const firstDayOfWeek = (start.getDay() + 6) % 7;
    const lastDayOfWeek = (end.getDay() + 6) % 7;
    const startDate = new Date(start);
    startDate.setDate(start.getDate() - firstDayOfWeek);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));
    return eachDayOfInterval({ start: startDate, end: endDate });
};
const Profile = () => {
    const { user, updateProfile, isLoading: authLoading, authError } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || "",
    });
    const [activeSection, setActiveSection] = useState('overview');
    const [activities, setActivities] = useState({});
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // State for manually selected activity days (separate from database activities)
    const [selectedDays, setSelectedDays] = useState(new Set());
    const [isSavingProgress, setIsSavingProgress] = useState(false);
    const [saveError, setSaveError] = useState(null);
    useEffect(() => {
        setFormData({
            name: user?.name || "",
        });
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccessMessage('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            if (!user?.id) {
                throw new Error('User not found');
            }
            const updates = {
                name: formData.name,
            };
            await updateProfile(updates);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
        }
        catch (err) {
            setError(authError?.message || err.message || 'Failed to update profile. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const cancelEdit = () => {
        setFormData({
            name: user?.name || "",
        });
        setIsEditing(false);
        setError('');
        setSuccessMessage('');
    };
    const getBmiCategory = (bmi) => {
        if (bmi === null)
            return 'N/A';
        if (bmi < 18.5)
            return 'Underweight';
        if (bmi < 24.9)
            return 'Normal weight';
        if (bmi < 29.9)
            return 'Overweight';
        return 'Obese';
    };
    // *** Activity Calendar and Tracking Logic ***
    const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };
    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };
    // Function to save selected days to database
    const saveSelectedDays = useCallback(async (newSelectedDays) => {
        if (!user?.id) {
            console.log('No user ID available for saving selected days');
            return;
        }
        console.log('Saving selected days for user:', user.id, 'Days:', Array.from(newSelectedDays));
        setIsSavingProgress(true);
        setSaveError(null);
        try {
            await activityProgressService.saveSelectedDates(user.id, newSelectedDays);
            console.log('Successfully saved activity progress to database');
        }
        catch (error) {
            console.error('Failed to save activity progress:', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save activity progress');
        }
        finally {
            setIsSavingProgress(false);
        }
    }, [user?.id]);
    const handleDayClick = async (day) => {
        const dayString = format(day, 'yyyy-MM-dd');
        console.log('Day clicked:', dayString);
        setSelectedDays(prev => {
            const newSet = new Set(prev);
            const wasSelected = newSet.has(dayString);
            if (wasSelected) {
                // Day is already selected, remove it (toggle off)
                newSet.delete(dayString);
                console.log('Removed day from selection:', dayString);
            }
            else {
                // Day is not selected, add it (toggle on)
                newSet.add(dayString);
                console.log('Added day to selection:', dayString);
            }
            console.log('New selected days:', Array.from(newSet));
            // Save to database immediately after updating state
            saveSelectedDays(newSet);
            return newSet;
        });
    };
    // Function to reset all manually selected days
    const handleResetSelectedDays = async () => {
        const emptySet = new Set();
        setSelectedDays(emptySet);
        // Save empty set to database
        if (user?.id) {
            await saveSelectedDays(emptySet);
        }
    };
    // Function to fetch activities for the current month
    const fetchActivities = useCallback(async () => {
        if (!user) {
            setActivities({}); // Clear activities if no user
            setIsLoadingActivities(false);
            return;
        }
        setIsLoadingActivities(true);
        setFetchError(null);
        const startOfMonthISO = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const endOfMonthISO = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('id, date, type, details')
                .eq('user_id', user.id)
                .gte('date', startOfMonthISO)
                .lte('date', endOfMonthISO);
            if (error)
                throw error;
            const groupedActivities = {};
            if (data) {
                data.forEach(activity => {
                    const activityDate = format(parse(activity.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd');
                    if (!groupedActivities[activityDate]) {
                        groupedActivities[activityDate] = [];
                    }
                    groupedActivities[activityDate].push(activity);
                });
            }
            setActivities(groupedActivities);
        }
        catch (err) {
            setFetchError(err.message || 'Failed to load activities.');
            setActivities({});
        }
        finally {
            setIsLoadingActivities(false);
        }
    }, [currentMonth, user]);
    // Load selected days from database when user changes
    useEffect(() => {
        const loadSelectedDays = async () => {
            if (!user?.id) {
                console.log('No user ID available for loading selected days');
                return;
            }
            console.log('Loading selected days for user:', user.id);
            try {
                const savedSelectedDays = await activityProgressService.loadSelectedDates(user.id);
                setSelectedDays(savedSelectedDays);
                console.log('Successfully loaded selected days from database:', Array.from(savedSelectedDays));
            }
            catch (error) {
                console.error('Failed to load selected days:', error);
                // Don't show error to user, just use empty set
                setSelectedDays(new Set());
            }
        };
        if (user?.id) {
            loadSelectedDays();
        }
    }, [user?.id]);
    // Effect to fetch activities when the component mounts, month, or user changes
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);
    const renderOverviewSection = () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsx("div", { className: "md:col-span-1 flex flex-col gap-6", children: _jsx(Card, { children: _jsxs(Card.Body, { className: "flex flex-col items-center text-center", children: [_jsx("div", { className: "w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4", children: _jsx(User, { size: 64, className: "text-green-600" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: user?.name }), _jsx("p", { className: "text-gray-500 mb-4", children: user?.role }), _jsxs("div", { className: "w-full border-t border-gray-200 pt-4 mt-2", children: [_jsxs("div", { className: "flex items-center mb-3", children: [_jsx(Mail, { size: 16, className: "text-gray-500 mr-2" }), _jsx("span", { className: "text-gray-600", children: user?.email })] }), user?.role === 'user' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center mb-3", children: [_jsx(Ruler, { size: 16, className: "text-gray-500 mr-2" }), _jsxs("span", { className: "text-gray-600", children: ["Height: ", user?.height ? `${user.height} cm` : 'N/A'] })] }), _jsxs("div", { className: "flex items-center mb-3", children: [_jsx(Scale, { size: 16, className: "text-gray-500 mr-2" }), _jsxs("span", { className: "text-gray-600", children: ["Weight: ", user?.weight ? `${user.weight} kg` : 'N/A'] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-4 h-4 bg-green-600 rounded-full mr-2" }), _jsxs("span", { className: "text-gray-600 font-semibold", children: ["BMI: ", user?.bmi !== null && typeof user?.bmi === 'number' ? `${user.bmi.toFixed(2)} (${getBmiCategory(user.bmi)})` : 'N/A'] })] }), !user?.bmi && (_jsx("div", { className: "mt-2 text-sm text-blue-600 italic", children: "Calculate your BMI in the BMI section." }))] }))] })] }) }) }), _jsx("div", { className: "md:col-span-2 flex flex-col gap-6" })] }));
    const renderPersonalInfoSection = () => (_jsx("div", { className: "max-w-2xl mx-auto", children: _jsx(Card, { children: _jsxs(Card.Body, { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Personal Information" }), !isEditing && (_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(Edit2, { size: 16 }), onClick: () => setIsEditing(true), children: "Edit" }))] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md", children: error })), successMessage && (_jsx("div", { className: "mb-4 p-3 bg-green-50 text-green-700 rounded-md", children: successMessage })), isEditing ? (_jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, disabled: isLoading || authLoading, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed" })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Button, { type: "submit", disabled: isLoading || authLoading, leftIcon: isLoading || authLoading ? null : _jsx(Save, { size: 16 }), children: isLoading || authLoading ? 'Saving...' : 'Save Changes' }), _jsx(Button, { type: "button", variant: "outline", onClick: cancelEdit, disabled: isLoading || authLoading, leftIcon: _jsx(X, { size: 16 }), children: "Cancel" })] })] }) })) : (_jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Full Name:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: user?.name })] }), user?.role === 'user' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Height:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: user?.height ? `${user.height} cm` : 'N/A' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Weight:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: user?.weight ? `${user.weight} kg` : 'N/A' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "BMI:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: user?.bmi !== null && typeof user?.bmi === 'number' ?
                                                    `${user?.bmi.toFixed(2)} (${getBmiCategory(user?.bmi)})`
                                                    :
                                                        'N/A' }), !user?.bmi && (_jsx("p", { className: "text-sm text-blue-600 italic mt-1", children: "Calculate your BMI in the BMI section." }))] })] }))] }))] }) }) }));
    // Helper function to render the activity section
    const renderActivitySection = () => (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(Card, { children: _jsxs(Card.Body, { className: "p-6 md:p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Activity" }), isSavingProgress && (_jsxs("div", { className: "flex items-center space-x-2 text-sm text-blue-600", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" }), _jsx("span", { children: "Saving..." })] })), saveError && (_jsx("div", { className: "text-sm text-red-600", children: "Failed to save" }))] }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleResetSelectedDays, leftIcon: _jsx(RotateCcw, { size: 16 }), className: "text-gray-600 hover:bg-gray-100", disabled: selectedDays.size === 0 || isSavingProgress, children: "Reset" })] }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handlePreviousMonth, "aria-label": "Previous Month", className: "text-gray-600 hover:bg-gray-200", children: _jsx(ChevronLeft, { size: 20 }) }), _jsx("h3", { className: "text-base font-semibold text-gray-900", children: format(currentMonth, 'MMMM, yyyy') }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleNextMonth, "aria-label": "Next Month", className: "text-gray-600 hover:bg-gray-200", children: _jsx(ChevronRight, { size: 20 }) })] }), isLoadingActivities ? (_jsx("div", { className: "text-center text-gray-600 py-4", children: "Loading activities..." })) : fetchError ? (_jsxs("div", { className: "text-center text-red-600 py-4", children: ["Error: ", fetchError] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2", children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (_jsx("div", { className: "pb-1", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-px", children: days.map((day, index) => {
                                    const dayNumber = format(day, 'd');
                                    const fullDateISO = format(day, 'yyyy-MM-dd');
                                    const isCurrentMonth = isSameMonth(day, currentMonth);
                                    const today = isToday(day);
                                    // Check if this day has activities based on fetched data
                                    const hasActivity = activities[fullDateISO]?.length > 0;
                                    // Check if this day is manually selected
                                    const isManuallySelected = selectedDays.has(fullDateISO);
                                    return (_jsxs("div", { className: `flex flex-col items-center justify-center w-full aspect-square rounded-full cursor-pointer transition-all duration-200
                                           ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                           ${today ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}
                                           ${hasActivity ? 'border-2 border-green-600' : ''}
                                           ${isManuallySelected ? 'bg-blue-100 border-2 border-blue-500' : ''}
                                           ${hasActivity && isManuallySelected ? 'bg-purple-100 border-2 border-purple-500' : ''}
                                           text-sm
                                           `, onClick: () => handleDayClick(day), "aria-label": `Day ${dayNumber} ${format(day, 'MMMM')}${hasActivity ? ', with database activities' : ''}${isManuallySelected ? ', manually selected' : ''}`, children: [_jsx("span", { children: dayNumber }), _jsxs("div", { className: "flex space-x-0.5 mt-0.5", children: [hasActivity && _jsx("div", { className: "w-1.5 h-1.5 bg-green-600 rounded-full" }), isManuallySelected && _jsx("div", { className: "w-1.5 h-1.5 bg-blue-600 rounded-full" })] })] }, index));
                                }) })] }))] }) }) }));
    // Helper function to render the current section
    const renderCurrentSection = () => {
        switch (activeSection) {
            case 'overview':
                return renderOverviewSection();
            case 'personal-info':
                return renderPersonalInfoSection();
            case 'activity':
                return user?.role === 'user' ? renderActivitySection() : renderPersonalInfoSection();
            default:
                return renderOverviewSection();
        }
    };
    return (_jsx("div", { className: "pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8 mt-8", children: "My Profile" }), _jsx(ProfileNavigation, { activeSection: activeSection, onSectionChange: setActiveSection, userRole: user?.role }), _jsx("div", { className: "min-h-screen", children: renderCurrentSection() })] }) }) }));
};
export default Profile;
