"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";
const Modal = ({ isOpen, onClose, title, children, size = "md", showCloseButton = true, closeOnBackdrop = true, closeOnEscape = true }) => {
    useEffect(() => {
        if (!closeOnEscape || !isOpen)
            return;
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, closeOnEscape]);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "max-w-sm";
            case "md":
                return "max-w-md";
            case "lg":
                return "max-w-lg";
            case "xl":
                return "max-w-xl";
            default:
                return "max-w-md";
        }
    };
    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300", onClick: handleBackdropClick, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? "modal-title" : undefined, children: _jsxs("div", { className: `
          ${getSizeClasses()}
          w-full bg-white rounded-lg shadow-xl transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `, onClick: (e) => e.stopPropagation(), role: "document", children: [(title || showCloseButton) && (_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [title && (_jsx("h3", { id: "modal-title", className: "text-lg font-semibold text-gray-900", children: title })), showCloseButton && (_jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1", "aria-label": "Close modal", children: _jsx(X, { size: 20 }) }))] })), _jsx("div", { className: "p-4", children: children })] }) }));
};
export const ErrorModal = ({ isOpen, onClose, title = "Error", message, details }) => {
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, size: "md", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4", children: _jsx(X, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: message }), details && (_jsxs("details", { className: "mt-3 text-left", children: [_jsx("summary", { className: "text-xs text-gray-500 cursor-pointer hover:text-gray-700", children: "Technical Details" }), _jsx("pre", { className: "mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-32", children: details })] }))] }), _jsx("div", { className: "flex justify-center", children: _jsx(Button, { onClick: onClose, variant: "primary", children: "OK" }) })] }) }));
};
export const SuccessModal = ({ isOpen, onClose, title = "Success", message }) => {
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, size: "md", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4", children: _jsx("svg", { className: "h-6 w-6 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsx("div", { className: "mb-4", children: _jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: message }) }), _jsx("div", { className: "flex justify-center", children: _jsx(Button, { onClick: onClose, variant: "primary", children: "OK" }) })] }) }));
};
export default Modal;
