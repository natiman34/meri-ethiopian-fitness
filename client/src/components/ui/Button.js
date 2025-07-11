import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
const Button = forwardRef(({ variant = "primary", size = "md", fullWidth = false, isLoading = false, leftIcon, rightIcon, className = "", children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none touch-manipulation active:scale-95";
    const variantStyles = {
        primary: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        secondary: "bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-950 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2",
        outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
        link: "bg-transparent text-green-600 hover:text-green-700 active:text-green-800 hover:underline p-0 h-auto",
        danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    };
    const sizeStyles = {
        sm: "text-xs px-3 py-2 min-h-[36px]",
        md: "text-sm px-4 py-2.5 min-h-[40px]",
        lg: "text-base px-6 py-3 min-h-[44px]",
        xl: "text-lg px-8 py-4 min-h-[48px]",
        icon: "p-2 min-h-[40px] min-w-[40px]",
    };
    const widthStyles = fullWidth ? "w-full" : "";
    const disabledStyles = disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";
    return (_jsxs("button", { ref: ref, disabled: disabled || isLoading, className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`, ...props, children: [isLoading && (_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), !isLoading && leftIcon && _jsx("span", { className: "mr-2", children: leftIcon }), children, !isLoading && rightIcon && _jsx("span", { className: "ml-2", children: rightIcon })] }));
});
Button.displayName = "Button";
export default Button;
