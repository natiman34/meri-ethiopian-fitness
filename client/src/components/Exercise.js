import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import AnimatedGif from './AnimatedGif';
import { normalizePath } from '../utils/mediaUtils';
const Exercise = ({ name, description, image, gifUrl, steps, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const displayImageSrc = gifUrl || image;
    const isGif = displayImageSrc.toLowerCase().endsWith('.gif') || (gifUrl && gifUrl.length > 0);
    const normalizedImage = normalizePath(image);
    const normalizedGif = gifUrl ? normalizePath(gifUrl) : '';
    return (_jsx("div", { className: `exercise-card bg-white rounded-lg shadow-md overflow-hidden ${className}`, children: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: name }), _jsx("p", { className: "text-gray-600 mb-4", children: description }), _jsx("div", { className: "mb-4 h-64 bg-gray-100 rounded-md overflow-hidden", children: isGif ? (_jsx(AnimatedGif, { src: normalizedGif, alt: name, staticImageSrc: normalizedImage, className: "w-full h-full object-contain" })) : (imageError ? (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-gray-200", children: _jsx("span", { className: "text-gray-500", children: "Image not available" }) })) : (_jsx("img", { src: normalizedImage, alt: name, className: "w-full h-full object-cover", onError: () => setImageError(true) }))) }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-800 mb-2", children: "Instructions:" }), _jsx("ol", { className: "list-decimal pl-5 space-y-1", children: steps.map((step, index) => (_jsx("li", { className: "text-gray-600", children: step }, index))) })] })] }) }));
};
export default Exercise;
