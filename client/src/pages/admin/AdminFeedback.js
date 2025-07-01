"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Search, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { FeedbackService } from '../../services/FeedbackService';
import useMobileFeatures from '../../hooks/useMobileFeatures';
import '../../styles/mobile-feedback.css';
const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const feedbackService = FeedbackService.getInstance();
    // Mobile features
    const { isMobile, isTablet, containerRef, isPulling, isRefreshing, completeRefresh, triggerHapticFeedback } = useMobileFeatures({
        enablePullToRefresh: true,
        enableSwipe: true
    });
    useEffect(() => {
        fetchFeedback();
    }, []);
    const fetchFeedback = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const feedbackData = await feedbackService.getAllFeedback();
            setFeedback(feedbackData.map(item => ({
                id: item.id,
                user_id: item.userId,
                full_name: item.name,
                email: item.email,
                content: item.content,
                rating: item.rating,
                is_resolved: item.resolved,
                reply_message: item.replyMessage,
                resolved_at: item.resolvedAt?.toISOString() || null,
                created_at: item.date.toISOString(),
                updated_at: item.updatedAt.toISOString()
            })));
        }
        catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Failed to load feedback. ' + err.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleMarkResolved = async (feedbackId) => {
        setActionLoading(feedbackId);
        try {
            await feedbackService.markFeedbackAsResolved(feedbackId);
            await fetchFeedback(); // Refresh the list
        }
        catch (err) {
            setError('Failed to mark feedback as resolved: ' + err.message);
        }
        finally {
            setActionLoading(null);
        }
    };
    const handleMarkUnresolved = async (feedbackId) => {
        setActionLoading(feedbackId);
        try {
            await feedbackService.markFeedbackAsUnresolved(feedbackId);
            await fetchFeedback(); // Refresh the list
        }
        catch (err) {
            setError('Failed to mark feedback as unresolved: ' + err.message);
        }
        finally {
            setActionLoading(null);
        }
    };
    // Filter feedback based on search term and status
    const filteredFeedback = feedback.filter((item) => {
        const matchesSearch = item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'resolved' && item.is_resolved) ||
            (filterStatus === 'unresolved' && !item.is_resolved);
        return matchesSearch && matchesStatus;
    });
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    // Handle pull to refresh
    const handleRefresh = async () => {
        triggerHapticFeedback('light');
        await fetchFeedback();
        completeRefresh();
    };
    // Use refresh when pull to refresh is triggered
    useEffect(() => {
        if (isRefreshing) {
            handleRefresh();
        }
    }, [isRefreshing]);
    return (_jsxs("div", { ref: containerRef, className: "p-4 sm:p-6 admin-feedback-container", children: [isPulling && (_jsxs("div", { className: "fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white text-center py-2 text-sm", children: [_jsx(RefreshCw, { className: "inline-block w-4 h-4 mr-2 animate-spin" }), "Pull to refresh..."] })), _jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 admin-feedback-header", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-gray-900 admin-feedback-title", children: "User Feedback Management" }), (isMobile || isTablet) && (_jsxs(Button, { variant: "secondary", size: "sm", onClick: handleRefresh, disabled: isLoading, className: "flex items-center min-h-[44px] px-3 py-2", children: [_jsx(RefreshCw, { size: 16, className: `mr-2 ${isLoading ? 'animate-spin' : ''}` }), "Refresh"] }))] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm sm:text-base", children: error })), isLoading && (_jsx("div", { className: "mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm sm:text-base", children: "Loading feedback..." })), _jsx(Card, { className: "mb-4 sm:mb-6", children: _jsx(Card.Body, { className: "p-3 sm:p-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { size: 16, className: "text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search feedback by name, email, or content...", className: "pl-10 py-3 pr-4 w-full text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500", value: searchTerm, onChange: handleSearch })] }), _jsxs("div", { className: "space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { className: "space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 block sm:inline", children: "Filter by status:" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs(Button, { variant: filterStatus === 'all' ? 'primary' : 'secondary', size: "sm", onClick: () => setFilterStatus('all'), className: "min-h-[44px] px-3 py-2", children: ["All (", feedback.length, ")"] }), _jsxs(Button, { variant: filterStatus === 'unresolved' ? 'primary' : 'secondary', size: "sm", onClick: () => setFilterStatus('unresolved'), className: "flex items-center min-h-[44px] px-3 py-2", children: [_jsx(Clock, { size: 14, className: "mr-1" }), _jsx("span", { className: "hidden sm:inline", children: "Unresolved" }), _jsx("span", { className: "sm:hidden", children: "Pending" }), _jsxs("span", { className: "ml-1", children: ["(", feedback.filter(f => !f.is_resolved).length, ")"] })] }), _jsxs(Button, { variant: filterStatus === 'resolved' ? 'primary' : 'secondary', size: "sm", onClick: () => setFilterStatus('resolved'), className: "flex items-center min-h-[44px] px-3 py-2", children: [_jsx(CheckCircle, { size: 14, className: "mr-1" }), "Resolved (", feedback.filter(f => f.is_resolved).length, ")"] })] })] }), _jsxs("span", { className: "text-sm text-gray-600 text-center sm:text-left", children: ["Showing ", filteredFeedback.length, " of ", feedback.length, " feedback items"] })] })] }) }) }), _jsx("div", { className: "space-y-3 sm:space-y-4", children: filteredFeedback.length > 0 ? (filteredFeedback.map((item) => (_jsx(Card, { className: `border-gray-100 ${item.is_resolved ? 'bg-green-50' : 'bg-white'}`, children: _jsx(Card.Body, { className: "p-3 sm:p-4", children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start space-x-3 flex-1", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${item.is_resolved ? 'bg-green-100' : 'bg-gray-100'}`, children: item.is_resolved ? (_jsx(CheckCircle, { size: 18, className: "text-green-600" })) : (_jsx(Clock, { size: 18, className: "text-orange-600" })) }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-medium text-gray-900 truncate", children: item.full_name }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: item.email }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(item.created_at).toLocaleString() })] }), _jsx("div", { className: "mt-2 sm:mt-0 sm:ml-4 flex-shrink-0", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.is_resolved
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-orange-100 text-orange-800'}`, children: item.is_resolved ? 'Resolved' : 'Unresolved' }) })] }) })] }) }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-700 whitespace-pre-wrap text-sm sm:text-base", children: item.content }), item.rating && (_jsxs("div", { className: "mt-2 flex items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Rating:" }), _jsx("div", { className: "ml-2 flex", children: [...Array(5)].map((_, i) => (_jsx("span", { className: `text-lg ${i < item.rating ? "text-yellow-400" : "text-gray-300"}`, children: "\u2605" }, i))) })] }))] }), item.reply_message && (_jsxs("div", { className: "p-3 bg-blue-50 border-l-4 border-blue-400 rounded", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-blue-800", children: "Admin Reply" }), item.resolved_at && (_jsxs("span", { className: "text-xs text-blue-600 ml-2", children: ["\u2022 ", new Date(item.resolved_at).toLocaleString()] }))] }), _jsx("p", { className: "text-sm text-blue-700 whitespace-pre-wrap", children: item.reply_message })] })), _jsx("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2", children: item.is_resolved ? (_jsxs(Button, { variant: "secondary", size: "sm", onClick: () => handleMarkUnresolved(item.id), disabled: actionLoading === item.id, className: "flex items-center justify-center min-h-[44px] px-4 py-2", children: [actionLoading === item.id ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" })) : (_jsx(XCircle, { size: 14, className: "mr-2" })), _jsx("span", { className: "hidden sm:inline", children: "Mark Unresolved" }), _jsx("span", { className: "sm:hidden", children: "Unresolved" })] })) : (_jsxs(Button, { variant: "primary", size: "sm", onClick: () => handleMarkResolved(item.id), disabled: actionLoading === item.id, className: "flex items-center justify-center min-h-[44px] px-4 py-2", children: [actionLoading === item.id ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" })) : (_jsx(CheckCircle, { size: 14, className: "mr-2" })), _jsx("span", { className: "hidden sm:inline", children: "Mark Resolved" }), _jsx("span", { className: "sm:hidden", children: "Resolved" })] })) })] }) }) }, item.id)))) : (_jsx(Card, { children: _jsx(Card.Body, { className: "p-4 text-center text-gray-500", children: "No feedback found matching your search criteria." }) })) })] }));
};
export default AdminFeedback;
