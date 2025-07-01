import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { normalizePath } from '../utils/mediaUtils';
const AnimatedGif = ({ src, alt, fallbackSrc = "/images/placeholders/exercise.jpg", staticImageSrc, className = "" }) => {
    const [currentSrc, setCurrentSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [useFallbackType, setUseFallbackType] = useState(null);
    const imgRef = useRef(null);
    const loadAttempts = useRef(0);
    const isExternalUrl = src.startsWith('http');
    const cleanExternalUrl = (url) => {
        if (url.includes('pinterest.com') || url.includes('pinimg.com')) {
            return url.split('?')[0]; // Remove query parameters
        }
        return url;
    };
    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
        setUseFallbackType(null);
        loadAttempts.current = 0;
        let processedSrc = src;
        if (isExternalUrl) {
            processedSrc = cleanExternalUrl(src);
        }
        else {
            processedSrc = normalizePath(src);
        }
        if (!isExternalUrl && processedSrc.includes('.gif')) {
            const cacheBustedSrc = `${processedSrc}?t=${Date.now()}`;
            setCurrentSrc(cacheBustedSrc);
        }
        else {
            setCurrentSrc(processedSrc);
        }
    }, [src, isExternalUrl, alt]);
    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
        if (!isExternalUrl && src.includes('.gif') && imgRef.current) {
            const img = imgRef.current;
            img.style.animation = 'none';
            setTimeout(() => {
                img.style.animation = '';
            }, 10);
        }
    };
    const handleError = () => {
        loadAttempts.current += 1;
        if (!isExternalUrl && loadAttempts.current < 3) {
            const retrySrc = `${normalizePath(src)}?retry=${loadAttempts.current}&t=${Date.now()}`;
            setCurrentSrc(retrySrc);
            return;
        }
        if (staticImageSrc && loadAttempts.current === 3) {
            const normalizedStaticSrc = normalizePath(staticImageSrc);
            setCurrentSrc(normalizedStaticSrc);
            setUseFallbackType('static');
            return;
        }
        if ((staticImageSrc && loadAttempts.current > 3) || (!staticImageSrc && loadAttempts.current >= 3)) {
            const normalizedFallbackSrc = normalizePath(fallbackSrc);
            setCurrentSrc(normalizedFallbackSrc);
            setUseFallbackType('generic');
            setIsLoading(false);
            setHasError(true);
        }
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [isLoading && (_jsx("div", { className: "absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Loading..." }) })), _jsx("img", { ref: imgRef, src: currentSrc, alt: alt, className: "w-full h-full object-cover", onLoad: handleLoad, onError: handleError, style: {
                    imageRendering: 'auto',
                    visibility: isLoading ? 'hidden' : 'visible'
                } }), hasError && (_jsxs("div", { className: "absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4", children: [_jsx(ImageOff, { className: "h-8 w-8 text-gray-400 mb-2" }), _jsx("div", { className: "text-gray-500 text-sm text-center", children: useFallbackType === 'static'
                            ? 'Animated demonstration unavailable. Showing static image instead.'
                            : 'Exercise demonstration unavailable.' })] }))] }));
};
export default AnimatedGif;
