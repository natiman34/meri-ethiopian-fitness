import { jsx as _jsx } from "react/jsx-runtime";
const Card = ({ children, className = "", hover = false }) => {
    return (_jsx("div", { className: `bg-white rounded-lg shadow-sm overflow-hidden ${hover ? "transition-all duration-200 hover:shadow-md" : ""} ${className}`, children: children }));
};
const CardTitle = ({ children, className = "" }) => {
    return _jsx("h3", { className: `text-xl font-semibold text-gray-900 ${className}`, children: children });
};
const CardBody = ({ children, className = "" }) => {
    return _jsx("div", { className: `p-6 ${className}`, children: children });
};
const CardFooter = ({ children, className = "" }) => {
    return _jsx("div", { className: `px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`, children: children });
};
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
export default Card;
