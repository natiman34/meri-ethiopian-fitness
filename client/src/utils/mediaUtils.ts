/**
 * Utility functions for handling media assets
 */

/**
 * Interface for exercise media objects
 */
export interface ExerciseMedia {
  id?: string;
  name?: string;
  image?: string;
  gifUrl?: string;
  videoUrl?: string;
  [key: string]: unknown;
}

/**
 * Interface for media validation result
 */
export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  loadTime?: number;
}

/**
 * Validates if an image exists by attempting to load it with timeout and error handling
 * @param url - The URL of the image to validate
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 * @returns Promise<MediaValidationResult> - Result of validation with timing info
 *
 * @example
 * ```typescript
 * const result = await validateImageExists('https://example.com/image.jpg');
 * if (result.isValid) {
 *   console.log(`Image loaded in ${result.loadTime}ms`);
 * } else {
 *   console.error('Image validation failed:', result.error);
 * }
 * ```
 */
export const validateImageExists = (
  url: string,
  timeout: number = 5000
): Promise<MediaValidationResult> => {
  return new Promise((resolve) => {
    // Input validation
    if (!url || typeof url !== 'string') {
      resolve({
        isValid: false,
        error: 'URL is required and must be a string'
      });
      return;
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      resolve({
        isValid: false,
        error: 'URL cannot be empty'
      });
      return;
    }

    // Basic URL format validation
    try {
      new URL(trimmedUrl);
    } catch {
      // If it's not a valid URL, it might be a relative path
      if (!trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('./')) {
        resolve({
          isValid: false,
          error: 'Invalid URL format'
        });
        return;
      }
    }

    const startTime = Date.now();
    const img = new Image();
    let resolved = false;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          isValid: false,
          error: `Image load timeout after ${timeout}ms`,
          loadTime: timeout
        });
      }
    }, timeout);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        resolve({
          isValid: true,
          loadTime: Date.now() - startTime
        });
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        resolve({
          isValid: false,
          error: 'Failed to load image',
          loadTime: Date.now() - startTime
        });
      }
    };

    img.src = trimmedUrl;
  });
};

/**
 * Ensures path starts with a forward slash for proper resolution from public directory
 * @param path - The path to normalize
 * @returns Normalized path or empty string if invalid input
 *
 * @example
 * ```typescript
 * normalizePath('images/exercise.jpg') // returns '/images/exercise.jpg'
 * normalizePath('/images/exercise.jpg') // returns '/images/exercise.jpg'
 * normalizePath('https://example.com/image.jpg') // returns 'https://example.com/image.jpg'
 * ```
 */
export const normalizePath = (path: string): string => {
  // Input validation
  if (!path || typeof path !== 'string') {
    return '';
  }

  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return '';
  }

  // If it's an external URL, return as is
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }

  // If it's a data URL, return as is
  if (trimmedPath.startsWith('data:')) {
    return trimmedPath;
  }

  // Ensure path starts with a slash for proper resolution from public directory
  return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
};

/**
 * Interface for preload options
 */
export interface PreloadOptions {
  maxAssets?: number;
  delayBetweenAssets?: number;
  prioritizeImages?: boolean;
  onProgress?: (loaded: number, total: number) => void;
  onError?: (url: string, error: string) => void;
}

/**
 * Preloads exercise media assets to improve user experience with proper error handling
 * @param exercises - Array of exercises to preload media for
 * @param options - Configuration options for preloading
 * @returns Promise<number> - Number of successfully preloaded assets
 *
 * @example
 * ```typescript
 * const loadedCount = await preloadExerciseMedia(exercises, {
 *   maxAssets: 5,
 *   onProgress: (loaded, total) => console.log(`${loaded}/${total} loaded`),
 *   onError: (url, error) => console.warn(`Failed to load ${url}: ${error}`)
 * });
 * ```
 */
export const preloadExerciseMedia = async (
  exercises: ExerciseMedia[],
  options: PreloadOptions = {}
): Promise<number> => {
  // Input validation
  if (!Array.isArray(exercises)) {
    console.warn('preloadExerciseMedia: exercises must be an array');
    return 0;
  }

  const {
    maxAssets = 10,
    delayBetweenAssets = 100,
    prioritizeImages = true,
    onProgress,
    onError
  } = options;

  // Only preload a reasonable number of assets to avoid overwhelming the browser
  const exercisesToPreload = exercises.slice(0, Math.max(1, maxAssets));
  let loadedCount = 0;
  const totalAssets = exercisesToPreload.reduce((count, exercise) => {
    return count + (exercise.image ? 1 : 0) + (exercise.gifUrl ? 1 : 0);
  }, 0);

  const preloadImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        onProgress?.(loadedCount, totalAssets);
        resolve(true);
      };
      img.onerror = () => {
        onError?.(url, 'Failed to load image');
        resolve(false);
      };
      img.src = normalizePath(url);
    });
  };

  const preloadPromises: Promise<boolean>[] = [];

  for (const exercise of exercisesToPreload) {
    // Preload static images first (highest priority)
    if (exercise.image) {
      if (prioritizeImages) {
        preloadPromises.push(preloadImage(exercise.image));
      } else {
        // Add delay for non-priority loading
        preloadPromises.push(
          new Promise(resolve =>
            setTimeout(() => preloadImage(exercise.image!).then(resolve), delayBetweenAssets)
          )
        );
      }
    }

    // Preload GIFs (lower priority)
    if (exercise.gifUrl) {
      preloadPromises.push(
        new Promise(resolve =>
          setTimeout(() => preloadImage(exercise.gifUrl!).then(resolve),
          prioritizeImages ? 1000 : delayBetweenAssets)
        )
      );
    }
  }

  // Wait for all preloading to complete
  await Promise.allSettled(preloadPromises);

  return loadedCount;
};

/**
 * Interface for media selection options
 */
export interface MediaSelectionOptions {
  preferLocal?: boolean;
  preferAnimated?: boolean;
  fallbackUrl?: string;
}

/**
 * Gets the most reliable media source for an exercise with proper validation
 * @param exercise - The exercise object containing media URLs
 * @param options - Options for media selection preferences
 * @returns The most reliable media source URL
 *
 * @example
 * ```typescript
 * const mediaUrl = getBestExerciseMedia(exercise, {
 *   preferLocal: true,
 *   preferAnimated: false,
 *   fallbackUrl: '/images/custom-placeholder.jpg'
 * });
 * ```
 */
export const getBestExerciseMedia = (
  exercise: ExerciseMedia,
  options: MediaSelectionOptions = {}
): string => {
  const {
    preferLocal = true,
    preferAnimated = true,
    fallbackUrl = "/images/placeholders/exercise.jpg"
  } = options;

  // Input validation
  if (!exercise || typeof exercise !== 'object') {
    return fallbackUrl;
  }

  const { image, gifUrl } = exercise;

  // Helper function to check if URL is local
  const isLocalUrl = (url: string): boolean => {
    return Boolean(url && !url.startsWith('http://') && !url.startsWith('https://'));
  };

  // Helper function to validate and normalize URL
  const getValidUrl = (url: string | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    return trimmed ? normalizePath(trimmed) : null;
  };

  const validImage = getValidUrl(image);
  const validGifUrl = getValidUrl(gifUrl);

  // Priority logic based on preferences
  if (preferLocal) {
    // Prioritize local images over external URLs
    if (validImage && isLocalUrl(validImage)) {
      return validImage;
    }

    if (validGifUrl && isLocalUrl(validGifUrl)) {
      return validGifUrl;
    }
  }

  if (preferAnimated) {
    // Prefer animated content (GIFs)
    if (validGifUrl) {
      return validGifUrl;
    }

    if (validImage) {
      return validImage;
    }
  } else {
    // Prefer static images
    if (validImage) {
      return validImage;
    }

    if (validGifUrl) {
      return validGifUrl;
    }
  }

  // If no local URLs and we prefer local, try external URLs
  if (preferLocal) {
    if (validGifUrl && !isLocalUrl(validGifUrl)) {
      return validGifUrl;
    }

    if (validImage && !isLocalUrl(validImage)) {
      return validImage;
    }
  }

  // Fallback to placeholder
  return fallbackUrl;
};

/**
 * Checks if the current environment supports the Image API
 * @returns boolean indicating if Image API is available
 */
export const isImageApiSupported = (): boolean => {
  return typeof Image !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Gets file extension from URL or path
 * @param url - The URL or path to extract extension from
 * @returns File extension (without dot) or empty string if not found
 *
 * @example
 * ```typescript
 * getFileExtension('/images/exercise.jpg') // returns 'jpg'
 * getFileExtension('https://example.com/video.mp4') // returns 'mp4'
 * ```
 */
export const getFileExtension = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    // Remove query parameters and fragments
    const cleanUrl = url.split('?')[0].split('#')[0];
    const lastDot = cleanUrl.lastIndexOf('.');
    const lastSlash = cleanUrl.lastIndexOf('/');

    // Make sure the dot is after the last slash (not in the path)
    if (lastDot > lastSlash && lastDot !== -1) {
      return cleanUrl.substring(lastDot + 1).toLowerCase();
    }

    return '';
  } catch {
    return '';
  }
};

/**
 * Checks if a URL points to an image based on file extension
 * @param url - The URL to check
 * @returns boolean indicating if URL appears to be an image
 */
export const isImageUrl = (url: string): boolean => {
  const extension = getFileExtension(url);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  return imageExtensions.includes(extension);
};

/**
 * Checks if a URL points to a video based on file extension
 * @param url - The URL to check
 * @returns boolean indicating if URL appears to be a video
 */
export const isVideoUrl = (url: string): boolean => {
  const extension = getFileExtension(url);
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v'];
  return videoExtensions.includes(extension);
};