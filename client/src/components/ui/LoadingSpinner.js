import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '', label = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };
    const colorClasses = {
        primary: 'text-green-600',
        white: 'text-white',
        gray: 'text-gray-400'
    };
    return (_jsx("div", { className: `inline-block ${className}`, role: "status", "aria-label": label, children: _jsxs("svg", { className: `animate-spin ${sizeClasses[size]} ${colorClasses[color]}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }));
};
export default LoadingSpinner;
