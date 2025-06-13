/**
 * Utility functions for handling media assets
 */

/**
 * Validates if an image exists by attempting to load it
 * @param url The URL of the image to validate
 * @returns Promise that resolves to boolean indicating if image exists
 */
export const validateImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Ensures path starts with a forward slash for proper resolution from public directory
 * @param path The path to normalize
 * @returns Normalized path
 */
export const normalizePath = (path: string): string => {
  // If it's an external URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Ensure path starts with a slash for proper resolution from public directory
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * Preloads exercise media assets to improve user experience
 * @param exercises Array of exercises to preload media for
 */
export const preloadExerciseMedia = (exercises: any[]): void => {
  // Only preload a reasonable number of assets to avoid overwhelming the browser
  const exercisesToPreload = exercises.slice(0, 10);
  
  exercisesToPreload.forEach(exercise => {
    // Preload static images first (highest priority)
    if (exercise.image) {
      const img = new Image();
      img.src = normalizePath(exercise.image);
    }
    
    // Preload GIFs (lower priority)
    if (exercise.gifUrl) {
      setTimeout(() => {
        const img = new Image();
        img.src = normalizePath(exercise.gifUrl);
      }, 1000);
    }
  });
};

/**
 * Gets the most reliable media source for an exercise
 * @param exercise The exercise object
 * @returns The most reliable media source URL
 */
export const getBestExerciseMedia = (exercise: any): string => {
  // Prioritize local images over external URLs
  if (exercise.image && !exercise.image.startsWith('http')) {
    return normalizePath(exercise.image);
  }
  
  if (exercise.gifUrl && !exercise.gifUrl.startsWith('http')) {
    return normalizePath(exercise.gifUrl);
  }
  
  // If only external URLs are available, prefer GIF
  if (exercise.gifUrl) {
    return exercise.gifUrl;
  }
  
  if (exercise.image) {
    return exercise.image;
  }
  
  // Fallback to placeholder
  return "/images/placeholders/exercise.jpg";
};

/**
 * Debug function to check if an image exists at the specified path
 * @param imagePath Path to check
 * @returns Promise with the result and path information
 */
export const debugImagePath = async (imagePath: string): Promise<{exists: boolean, path: string, absolutePath: string}> => {
  const normalizedPath = normalizePath(imagePath);
  const exists = await validateImageExists(normalizedPath);
  
  // For debugging - log the path information
  console.log(`Image path check:
    Original: ${imagePath}
    Normalized: ${normalizedPath}
    Exists: ${exists}
  `);
  
  return {
    exists,
    path: normalizedPath,
    absolutePath: window.location.origin + normalizedPath
  };
};
