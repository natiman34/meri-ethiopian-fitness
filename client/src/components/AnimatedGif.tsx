import React, { useState, useEffect, useRef } from 'react';

interface AnimatedGifProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const AnimatedGif: React.FC<AnimatedGifProps> = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/images/placeholders/exercise-gif.gif" 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Add cache-busting parameter for GIFs
    const cacheBustedSrc = src.includes('.gif') 
      ? `${src}?t=${Date.now()}&cb=${Math.random()}`
      : src;
    
    setCurrentSrc(cacheBustedSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    // Force GIF animation by reloading
    if (src.includes('.gif') && imgRef.current) {
      const img = imgRef.current;
      const originalSrc = img.src;
      
      console.log('Forcing GIF animation for:', src);
      
      // Clear the src and reload to force animation
      img.src = '';
      setTimeout(() => {
        img.src = originalSrc;
        console.log('GIF reloaded:', src);
      }, 50);
      
      // Additional force reload after a longer delay
      setTimeout(() => {
        if (img.src === originalSrc) {
          img.src = '';
          setTimeout(() => {
            img.src = originalSrc;
            console.log('Second GIF reload:', src);
          }, 10);
        }
      }, 200);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          imageRendering: 'auto',
          animation: 'none',
          display: isLoading ? 'none' : 'block'
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Image not available</div>
        </div>
      )}
    </div>
  );
};

export default AnimatedGif; 