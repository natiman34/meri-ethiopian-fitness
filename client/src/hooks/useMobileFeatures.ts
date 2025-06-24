import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for mobile-specific features
 * Provides touch gestures, pull-to-refresh, and mobile navigation patterns
 */

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

interface MobileFeaturesOptions {
  enableSwipe?: boolean;
  enablePullToRefresh?: boolean;
  swipeThreshold?: number;
  pullThreshold?: number;
}

export const useMobileFeatures = (options: MobileFeaturesOptions = {}) => {
  const {
    enableSwipe = true,
    enablePullToRefresh = true,
    swipeThreshold = 50,
    pullThreshold = 100
  } = options;

  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Touch gesture states
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({ direction: null, distance: 0 });

  // Pull to refresh states
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const pullStartY = useRef<number>(0);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTabletDevice = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(userAgent);
      
      setIsMobile(isMobileDevice && !isTabletDevice);
      setIsTablet(isTabletDevice);
    };

    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkDevice();
    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enableSwipe) return;
    
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setIsSwipeActive(true);
  }, [enableSwipe]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enableSwipe || !touchStart) return;
    
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Calculate swipe direction and distance
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let direction: SwipeDirection['direction'] = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    setSwipeDirection({ direction, distance });

    // Handle pull to refresh
    if (enablePullToRefresh && direction === 'down' && window.scrollY === 0) {
      const pullDist = Math.max(0, deltaY);
      setPullDistance(pullDist);
      setIsPulling(pullDist > 10);
      
      if (pullDist > pullThreshold) {
        e.preventDefault();
      }
    }
  }, [enableSwipe, enablePullToRefresh, touchStart, pullThreshold]);

  const handleTouchEnd = useCallback(() => {
    if (!enableSwipe) return;
    
    setIsSwipeActive(false);
    
    // Handle pull to refresh trigger
    if (enablePullToRefresh && pullDistance > pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      // Trigger refresh callback will be handled by parent component
    }
    
    // Reset pull states
    setTimeout(() => {
      setIsPulling(false);
      setPullDistance(0);
    }, 300);
    
    // Reset touch states
    setTimeout(() => {
      setTouchStart(null);
      setTouchEnd(null);
      setSwipeDirection({ direction: null, distance: 0 });
    }, 100);
  }, [enableSwipe, enablePullToRefresh, pullDistance, pullThreshold, isRefreshing]);

  // Attach touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || (!enableSwipe && !enablePullToRefresh)) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enableSwipe, enablePullToRefresh]);

  // Swipe detection helper
  const getSwipeDirection = useCallback((): SwipeDirection['direction'] => {
    if (!touchStart || !touchEnd) return null;
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < swipeThreshold) return null;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, [touchStart, touchEnd, swipeThreshold]);

  // Haptic feedback (if supported)
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Refresh completion handler
  const completeRefresh = useCallback(() => {
    setIsRefreshing(false);
    setIsPulling(false);
    setPullDistance(0);
  }, []);

  // Mobile-specific utilities
  const preventZoom = useCallback((e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';

  return {
    // Device info
    isMobile,
    isTablet,
    orientation,
    isLandscape,
    isPortrait,
    
    // Touch gestures
    swipeDirection: getSwipeDirection(),
    isSwipeActive,
    touchStart,
    touchEnd,
    
    // Pull to refresh
    isPulling,
    pullDistance,
    isRefreshing,
    completeRefresh,
    
    // Utilities
    containerRef,
    triggerHapticFeedback,
    preventZoom,
    scrollToTop,
    
    // Computed values
    pullProgress: Math.min(pullDistance / pullThreshold, 1),
    shouldTriggerRefresh: pullDistance > pullThreshold,
  };
};

export default useMobileFeatures;
