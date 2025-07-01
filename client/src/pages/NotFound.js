import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
const NotFound = () => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[70vh] px-4 text-center", children: [_jsx("h1", { className: "text-9xl font-bold text-green-600", children: "404" }), _jsx("h2", { className: "text-3xl font-semibold mt-4 mb-6 text-gray-800", children: "Page Not Found" }), _jsx("p", { className: "text-lg text-gray-600 max-w-md mb-8", children: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." }), _jsx(Link, { to: "/", children: _jsx(Button, { variant: "primary", size: "lg", children: "Return to Homepage" }) })] }));
};
export default NotFound;
