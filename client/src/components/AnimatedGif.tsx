import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { normalizePath, debugImagePath } from '../utils/mediaUtils';

interface AnimatedGifProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  staticImageSrc?: string;
  className?: string;
}

const AnimatedGif: React.FC<AnimatedGifProps> = ({ 
  src, 
  alt, 
  fallbackSrc = "/images/placeholders/exercise.jpg",
  staticImageSrc, 
  className = ""
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallbackType, setUseFallbackType] = useState<'static' | 'generic' | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const loadAttempts = useRef(0);
  const isExternalUrl = src.startsWith('http');

  // Function to clean up external URLs
  const cleanExternalUrl = (url: string): string => {
    if (url.includes('pinterest.com') || url.includes('pinimg.com')) {
      return url.split('?')[0]; // Remove query parameters
    }
    return url;
  };

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setUseFallbackType(null);
    loadAttempts.current = 0;
    
    let processedSrc = src;
    
    // Clean external URLs
    if (isExternalUrl) {
      processedSrc = cleanExternalUrl(src);
    } else {
      // Normalize path for local files
      processedSrc = normalizePath(src);
      
      // Debug the path to help diagnose issues
      debugImagePath(processedSrc).then(result => {
        console.log(`Image path check for ${alt}:`, result);
      });
    }
    
    // Only add cache-busting for local GIFs
    if (!isExternalUrl && processedSrc.includes('.gif')) {
      const cacheBustedSrc = `${processedSrc}?t=${Date.now()}`;
      setCurrentSrc(cacheBustedSrc);
    } else {
      setCurrentSrc(processedSrc);
    }
  }, [src, isExternalUrl, alt]);

  const handleLoad = () => {
    console.log('Image loaded successfully:', currentSrc);
    setIsLoading(false);
    setHasError(false);
    
    // Reset animation for local GIFs
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
    console.error(`Error loading image (attempt ${loadAttempts.current}):`, currentSrc);
    
    // For local files, try a few times with cache busting
    if (!isExternalUrl && loadAttempts.current < 3) {
      const retrySrc = `${normalizePath(src)}?retry=${loadAttempts.current}&t=${Date.now()}`;
      console.log('Retrying with:', retrySrc);
      setCurrentSrc(retrySrc);
      return;
    }
    
    // After retries or for external URLs, try the static image first
    if (staticImageSrc && loadAttempts.current === 3) {
      const normalizedStaticSrc = normalizePath(staticImageSrc);
      console.log('Using exercise-specific static image:', normalizedStaticSrc);
      setCurrentSrc(normalizedStaticSrc);
      setUseFallbackType('static');
      
      // Debug the static image path
      debugImagePath(normalizedStaticSrc).then(result => {
        console.log(`Static image path check for ${alt}:`, result);
      });
      return;
    }
    
    // If static image fails or doesn't exist, use generic fallback
    if ((staticImageSrc && loadAttempts.current > 3) || (!staticImageSrc && loadAttempts.current >= 3)) {
      const normalizedFallbackSrc = normalizePath(fallbackSrc);
      console.log('Using generic fallback image:', normalizedFallbackSrc);
      setCurrentSrc(normalizedFallbackSrc);
      setUseFallbackType('generic');
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          imageRendering: 'auto',
          visibility: isLoading ? 'hidden' : 'visible'
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
          <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
          <div className="text-gray-500 text-sm text-center">
            {useFallbackType === 'static' 
              ? 'Animated demonstration unavailable. Showing static image instead.' 
              : 'Exercise demonstration unavailable.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedGif; 
