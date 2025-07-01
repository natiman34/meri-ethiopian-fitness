import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload, Link, Wand2, X, Image as ImageIcon } from 'lucide-react';
import { imageService } from '../../services/ImageService';
const ImageSelector = ({ currentImage, mealName, isEthiopian = false, onImageSelect, onImageClear, onError }) => {
    const [mode, setMode] = useState('url');
    const [customUrl, setCustomUrl] = useState('');
    const handleAutoSuggest = () => {
        const suggestedImage = imageService.suggestImage(mealName, isEthiopian);
        onImageSelect(suggestedImage);
    };
    const handleUrlSubmit = () => {
        if (!customUrl.trim())
            return;
        onImageSelect(customUrl);
        setCustomUrl('');
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        // Validate file type
        if (!file.type.startsWith('image/')) {
            onError?.('Please select an image file');
            return;
        }
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
            onError?.('Image size must be less than 5MB');
            return;
        }
        try {
            // Create local URL for preview
            const localUrl = URL.createObjectURL(file);
            onImageSelect(localUrl);
        }
        catch (error) {
            console.error('Error uploading image:', error);
            onError?.('Failed to upload image');
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Meal Image" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { type: "button", onClick: handleAutoSuggest, className: "px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700", children: [_jsx(Wand2, { className: "h-3 w-3 inline mr-1" }), "Auto-suggest"] }), _jsxs("button", { type: "button", onClick: () => setMode('url'), className: `px-3 py-1 text-xs rounded-md ${mode === 'url'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [_jsx(Link, { className: "h-3 w-3 inline mr-1" }), "URL"] }), _jsxs("button", { type: "button", onClick: () => setMode('upload'), className: `px-3 py-1 text-xs rounded-md ${mode === 'upload'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [_jsx(Upload, { className: "h-3 w-3 inline mr-1" }), "Upload"] })] })] }), currentImage && (_jsxs("div", { className: "relative", children: [_jsx("img", { src: currentImage, alt: "Current meal image", className: "w-full h-32 object-cover rounded-md border", onError: (e) => {
                            e.target.src = '/images/meals/default-meal.jpg';
                        } }), _jsx("button", { type: "button", onClick: onImageClear, className: "absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600", "aria-label": "Remove current image", children: _jsx(X, { className: "h-3 w-3" }) })] })), mode === 'url' && (_jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "url", value: customUrl, onChange: (e) => setCustomUrl(e.target.value), placeholder: "Enter image URL...", className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" }), _jsx("button", { type: "button", onClick: handleUrlSubmit, disabled: !customUrl.trim(), className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50", children: "Add" })] }) })), mode === 'upload' && (_jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-green-500 transition-colors", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "hidden", id: "image-upload" }), _jsxs("label", { htmlFor: "image-upload", className: "cursor-pointer", children: [_jsx(ImageIcon, { className: "h-8 w-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-600", children: "Click to upload an image" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "PNG, JPG, GIF up to 5MB" })] })] }) })), _jsx("div", { className: "text-xs text-gray-500", children: "\uD83D\uDCA1 Use auto-suggest for smart image selection or add a custom image URL" })] }));
};
export default ImageSelector;
