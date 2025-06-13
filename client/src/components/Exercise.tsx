import React, { useState } from 'react';
import AnimatedGif from './AnimatedGif';
import { normalizePath } from '../utils/mediaUtils';

interface ExerciseProps {
  name: string;
  description: string;
  image: string;
  gifUrl?: string;
  steps: string[];
  className?: string;
}

const Exercise: React.FC<ExerciseProps> = ({
  name,
  description,
  image,
  gifUrl,
  steps,
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);

  // Determine which image source to use - prefer GIF if available
  const displayImageSrc = gifUrl || image;
  const isGif = displayImageSrc.toLowerCase().endsWith('.gif') || (gifUrl && gifUrl.length > 0);

  // Normalize paths
  const normalizedImage = normalizePath(image);
  const normalizedGif = gifUrl ? normalizePath(gifUrl) : '';

  return (
    <div className={`exercise-card bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4 h-64 bg-gray-100 rounded-md overflow-hidden">
          {isGif ? (
            <AnimatedGif 
              src={normalizedGif} 
              alt={name} 
              staticImageSrc={normalizedImage} // Pass the static image as fallback
              className="w-full h-full object-contain"
            />
          ) : (
            imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Image not available</span>
              </div>
            ) : (
              <img
                src={normalizedImage}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Instructions:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            {steps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Exercise;

