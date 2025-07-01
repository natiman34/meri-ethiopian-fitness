/**
 * Progressive Web App utilities for mobile compatibility
 * Handles service worker registration, offline support, and PWA features
 */
class PWAManager {
    deferredPrompt = null;
    isInstalled = false;
    installPromptCallbacks = [];
    constructor() {
        this.init();
    }
    init() {
        // Check if app is already installed
        this.checkInstallStatus();
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.notifyInstallPromptCallbacks(true);
        });
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.notifyInstallPromptCallbacks(false);
            console.log('PWA: App installed successfully');
        });
    }
    checkInstallStatus() {
        // Check if running in standalone mode (installed)
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }
    notifyInstallPromptCallbacks(canInstall) {
        this.installPromptCallbacks.forEach(callback => callback(canInstall));
    }
    getInstallPrompt() {
        return {
            isInstallable: !!this.deferredPrompt,
            isInstalled: this.isInstalled,
            showInstallPrompt: this.showInstallPrompt.bind(this),
            hideInstallPrompt: this.hideInstallPrompt.bind(this)
        };
    }
    async showInstallPrompt() {
        if (!this.deferredPrompt) {
            throw new Error('Install prompt not available');
        }
        try {
            await this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('PWA: User accepted install prompt');
            }
            else {
                console.log('PWA: User dismissed install prompt');
            }
            this.deferredPrompt = null;
            this.notifyInstallPromptCallbacks(false);
        }
        catch (error) {
            console.error('PWA: Error showing install prompt', error);
        }
    }
    hideInstallPrompt() {
        this.deferredPrompt = null;
        this.notifyInstallPromptCallbacks(false);
    }
    onInstallPromptChange(callback) {
        this.installPromptCallbacks.push(callback);
        // Return unsubscribe function
        return () => {
            const index = this.installPromptCallbacks.indexOf(callback);
            if (index > -1) {
                this.installPromptCallbacks.splice(index, 1);
            }
        };
    }
}
// Service Worker registration
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker: Registered successfully', registration);
            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is available
                            console.log('Service Worker: New version available');
                            showUpdateAvailableNotification();
                        }
                    });
                }
            });
            return registration;
        }
        catch (error) {
            console.error('Service Worker: Registration failed', error);
            return null;
        }
    }
    return null;
};
// Show update notification
const showUpdateAvailableNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('App Update Available', {
            body: 'A new version of the app is available. Refresh to update.',
            icon: '/icons/icon-192x192.png',
            tag: 'app-update'
        });
    }
};
// Request notification permission
export const requestNotificationPermission = async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        return permission;
    }
    return 'denied';
};
// Check if device supports PWA features
export const checkPWASupport = () => {
    return {
        serviceWorker: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        pushManager: 'PushManager' in window,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        installPrompt: 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window
    };
};
// Offline storage for feedback
export const storeOfflineFeedback = (feedback) => {
    try {
        const offlineFeedback = JSON.parse(localStorage.getItem('offlineFeedback') || '[]');
        offlineFeedback.push({
            ...feedback,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            offline: true
        });
        localStorage.setItem('offlineFeedback', JSON.stringify(offlineFeedback));
        console.log('Feedback stored offline');
    }
    catch (error) {
        console.error('Error storing offline feedback:', error);
    }
};
// Get offline feedback
export const getOfflineFeedback = () => {
    try {
        return JSON.parse(localStorage.getItem('offlineFeedback') || '[]');
    }
    catch {
        return [];
    }
};
// Clear offline feedback
export const clearOfflineFeedback = () => {
    try {
        localStorage.removeItem('offlineFeedback');
    }
    catch (error) {
        console.error('Error clearing offline feedback:', error);
    }
};
// Network status detection
export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return isOnline;
};
// PWA Manager singleton
export const pwaManager = new PWAManager();
// Hook for PWA install prompt
export const usePWAInstall = () => {
    const [installPrompt, setInstallPrompt] = useState(pwaManager.getInstallPrompt());
    useEffect(() => {
        const unsubscribe = pwaManager.onInstallPromptChange((canInstall) => {
            setInstallPrompt(pwaManager.getInstallPrompt());
        });
        return unsubscribe;
    }, []);
    return installPrompt;
};
// Mobile-specific utilities
export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
export const isIOSDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};
export const isAndroidDevice = () => {
    return /Android/i.test(navigator.userAgent);
};
// Viewport utilities for mobile
export const getViewportHeight = () => {
    return window.visualViewport?.height || window.innerHeight;
};
export const getViewportWidth = () => {
    return window.visualViewport?.width || window.innerWidth;
};
// Safe area utilities for notched devices
export const getSafeAreaInsets = () => {
    const style = getComputedStyle(document.documentElement);
    return {
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
    };
};
// Import React hooks for the utility functions that need them
import { useState, useEffect } from 'react';
