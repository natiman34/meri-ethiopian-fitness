import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1598971639058-9992d6d0c7e6?w=400&h=300&fit=crop",
  className = "",
  onLoad,
  onError,
  loadingComponent,
  errorComponent
}) => {
  
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
    } else {
     
      setHasError(true);
    }
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        {errorComponent || (
          <div className="text-center">
            <ImageOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Image unavailable</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {loadingComponent || (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          )}
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageWithFallback; 