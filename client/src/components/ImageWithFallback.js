import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
const ImageWithFallback = ({ src, alt, fallbackSrc = "https://images.unsplash.com/photo-1598971639058-9992d6d0c7e6?w=400&h=300&fit=crop", className = "", onLoad, onError, loadingComponent, errorComponent }) => {
    const initialSrc = src || fallbackSrc;
    const [imageSrc, setImageSrc] = useState(initialSrc);
    const [isLoading, setIsLoading] = useState(!!initialSrc);
    const [hasError, setHasError] = useState(!initialSrc);
    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
        onLoad?.();
    };
    const handleError = () => {
        setIsLoading(false);
        if (imageSrc === src && fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(false);
        }
        else {
            setHasError(true);
        }
        onError?.();
    };
    if (hasError) {
        return (_jsx("div", { className: `flex items-center justify-center bg-gray-100 ${className}`, children: errorComponent || (_jsxs("div", { className: "text-center", children: [_jsx(ImageOff, { className: "h-8 w-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Image unavailable" })] })) }));
    }
    return (_jsxs("div", { className: `relative ${className}`, children: [isLoading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100", children: loadingComponent || (_jsx(Loader2, { className: "h-6 w-6 animate-spin text-gray-400" })) })), _jsx("img", { src: imageSrc, alt: alt, className: `w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`, onLoad: handleLoad, onError: handleError })] }));
};
export default ImageWithFallback;
