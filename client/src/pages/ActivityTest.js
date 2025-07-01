import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { activityProgressService } from '../services/ActivityProgressService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
const ActivityTest = () => {
    const { user, isAuthenticated } = useAuth();
    const [selectedDates, setSelectedDates] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Test dates
    const testDates = [
        '2024-01-15',
        '2024-01-16',
        '2024-01-17',
        '2024-01-18',
        '2024-01-19'
    ];
    // Load selected dates on component mount
    useEffect(() => {
        const loadDates = async () => {
            if (!user?.id)
                return;
            try {
                setIsLoading(true);
                setError(null);
                console.log('ActivityTest: Loading selected dates for user:', user.id);
                const dates = await activityProgressService.loadSelectedDates(user.id);
                setSelectedDates(dates);
                console.log('ActivityTest: Loaded dates:', Array.from(dates));
                setSuccess(`Loaded ${dates.size} selected dates`);
            }
            catch (err) {
                console.error('ActivityTest: Error loading dates:', err);
                setError(err instanceof Error ? err.message : 'Failed to load dates');
            }
            finally {
                setIsLoading(false);
            }
        };
        if (isAuthenticated && user?.id) {
            loadDates();
        }
    }, [user?.id, isAuthenticated]);
    const handleToggleDate = async (date) => {
        if (!user?.id)
            return;
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            const newSelectedDates = new Set(selectedDates);
            if (newSelectedDates.has(date)) {
                newSelectedDates.delete(date);
                console.log('ActivityTest: Removed date:', date);
            }
            else {
                newSelectedDates.add(date);
                console.log('ActivityTest: Added date:', date);
            }
            console.log('ActivityTest: Saving dates:', Array.from(newSelectedDates));
            await activityProgressService.saveSelectedDates(user.id, newSelectedDates);
            setSelectedDates(newSelectedDates);
            setSuccess(`Successfully saved ${newSelectedDates.size} selected dates`);
            console.log('ActivityTest: Successfully saved dates');
        }
        catch (err) {
            console.error('ActivityTest: Error saving dates:', err);
            setError(err instanceof Error ? err.message : 'Failed to save dates');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleClearAll = async () => {
        if (!user?.id)
            return;
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            console.log('ActivityTest: Clearing all dates');
            await activityProgressService.clearSelectedDates(user.id);
            setSelectedDates(new Set());
            setSuccess('Successfully cleared all selected dates');
            console.log('ActivityTest: Successfully cleared all dates');
        }
        catch (err) {
            console.error('ActivityTest: Error clearing dates:', err);
            setError(err instanceof Error ? err.message : 'Failed to clear dates');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleReload = async () => {
        if (!user?.id)
            return;
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            console.log('ActivityTest: Reloading dates from database');
            const dates = await activityProgressService.loadSelectedDates(user.id);
            setSelectedDates(dates);
            setSuccess(`Reloaded ${dates.size} selected dates from database`);
            console.log('ActivityTest: Reloaded dates:', Array.from(dates));
        }
        catch (err) {
            console.error('ActivityTest: Error reloading dates:', err);
            setError(err instanceof Error ? err.message : 'Failed to reload dates');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isAuthenticated) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx(Card, { children: _jsxs(Card.Body, { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Activity Test" }), _jsx("p", { className: "text-gray-600", children: "Please log in to test activity progress functionality." })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-4xl mx-auto px-4", children: _jsx(Card, { children: _jsxs(Card.Body, { className: "p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Activity Progress Test" }), _jsxs("div", { className: "mb-6", children: [_jsxs("p", { className: "text-gray-600 mb-2", children: ["User: ", user?.name, " (", user?.id, ")"] }), _jsxs("p", { className: "text-gray-600", children: ["Selected dates: ", selectedDates.size] })] }), isLoading && (_jsx("div", { className: "mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md", children: _jsx("p", { className: "text-blue-800", children: "Loading..." }) })), error && (_jsx("div", { className: "mb-4 p-3 bg-red-100 border border-red-300 rounded-md", children: _jsxs("p", { className: "text-red-800", children: ["Error: ", error] }) })), success && (_jsx("div", { className: "mb-4 p-3 bg-green-100 border border-green-300 rounded-md", children: _jsx("p", { className: "text-green-800", children: success }) })), _jsxs("div", { className: "mb-6 flex gap-4", children: [_jsx(Button, { onClick: handleReload, disabled: isLoading, variant: "outline", children: "Reload from DB" }), _jsx(Button, { onClick: handleClearAll, disabled: isLoading || selectedDates.size === 0, variant: "outline", children: "Clear All" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: testDates.map(date => (_jsx("div", { className: `p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedDates.has(date)
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-white border-gray-300 hover:border-gray-400'}`, onClick: () => handleToggleDate(date), children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-semibold", children: date }), _jsx("p", { className: "text-sm text-gray-600", children: selectedDates.has(date) ? 'Selected' : 'Click to select' })] }) }, date))) }), _jsxs("div", { className: "mt-8 p-4 bg-gray-100 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Debug Info:" }), _jsx("pre", { className: "text-sm text-gray-700", children: JSON.stringify({
                                        userId: user?.id,
                                        selectedDatesArray: Array.from(selectedDates),
                                        selectedDatesCount: selectedDates.size,
                                        isAuthenticated,
                                        isLoading
                                    }, null, 2) })] })] }) }) }) }));
};
export default ActivityTest;
