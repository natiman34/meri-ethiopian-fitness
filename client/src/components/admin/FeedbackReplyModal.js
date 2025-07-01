"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { X, Send, Mail } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
const FeedbackReplyModal = ({ isOpen, onClose, feedback, onSendReply, isLoading = false }) => {
    const [replyMessage, setReplyMessage] = useState("");
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const handleSendReply = async () => {
        if (!feedback || !replyMessage.trim()) {
            setError("Please enter a reply message");
            return;
        }
        setIsSending(true);
        setError(null);
        try {
            await onSendReply(feedback.id, replyMessage.trim());
            setReplyMessage("");
            onClose();
        }
        catch (err) {
            setError(err.message || "Failed to send reply");
        }
        finally {
            setIsSending(false);
        }
    };
    const handleClose = () => {
        if (!isSending) {
            setReplyMessage("");
            setError(null);
            onClose();
        }
    };
    if (!isOpen || !feedback)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4", children: _jsxs("div", { className: "bg-white w-full h-full sm:rounded-lg sm:shadow-xl sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Mail, { className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" }), _jsx("h2", { className: "text-lg sm:text-xl font-semibold text-gray-900", children: "Reply to Feedback" })] }), _jsxs("button", { onClick: handleClose, disabled: isSending, className: "text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-2 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center", children: [_jsx(X, { size: 20, className: "sm:hidden" }), _jsx(X, { size: 24, className: "hidden sm:block" })] })] }), _jsxs("div", { className: "p-4 sm:p-6 flex-1", children: [_jsx(Card, { className: "mb-4 sm:mb-6 bg-gray-50", children: _jsxs(Card.Body, { className: "p-3 sm:p-4", children: [_jsxs("div", { className: "mb-3", children: [_jsx("h3", { className: "font-medium text-gray-900 text-sm sm:text-base", children: feedback.full_name }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600", children: feedback.email })] }), _jsx("div", { className: "mb-3", children: _jsx("p", { className: "text-gray-700 whitespace-pre-wrap text-sm sm:text-base", children: feedback.content }) }), feedback.rating && (_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-xs sm:text-sm text-gray-600 mr-2", children: "Rating:" }), _jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => (_jsx("span", { className: `text-base sm:text-lg ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`, children: "\u2605" }, i))) })] }))] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "replyMessage", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Reply" }), _jsx("textarea", { id: "replyMessage", value: replyMessage, onChange: (e) => setReplyMessage(e.target.value), placeholder: "Type your reply to the user here...", rows: window.innerWidth < 640 ? 8 : 6, disabled: isSending, className: "w-full px-3 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none", style: { fontSize: '16px' } }), _jsxs("p", { className: "text-xs sm:text-sm text-gray-500 mt-2", children: ["This message will be sent to ", feedback.email] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: _jsx("p", { className: "text-sm text-red-600", children: error }) }))] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0", children: [_jsx(Button, { variant: "secondary", onClick: handleClose, disabled: isSending, className: "min-h-[48px] px-6 py-3 text-base font-medium order-2 sm:order-1", children: "Cancel" }), _jsx(Button, { onClick: handleSendReply, disabled: isSending || !replyMessage.trim(), className: "flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-medium order-1 sm:order-2", children: isSending ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Sending..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { size: 16, className: "mr-2" }), "Send Reply"] })) })] })] }) }));
};
export default FeedbackReplyModal;
