"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
const EducationalContentDetail = () => {
    const { id } = useParams();
    return (_jsx("div", { className: "pt-24 pb-16", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Educational Content Detail" }), _jsxs("p", { className: "mt-4", children: ["Viewing educational content with ID: ", id] })] }) }));
};
export default EducationalContentDetail;
