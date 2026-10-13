import React, { createContext, useContext, useState, useEffect } from 'react';

const PWAContext = createContext();

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Check if user dismissed banner recently
      const dismissedUntil = localStorage.getItem('pwa_banner_dismissed_until');
      if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
        setShowBanner(true);
      }
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowBanner(false);
      console.log('Đồ Sơn Today PWA was successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show banner after 2 seconds if not installed and not dismissed (even on devices where beforeinstallprompt isn't fired yet)
    const timer = setTimeout(() => {
      if (!isStandalone) {
        const dismissedUntil = localStorage.getItem('pwa_banner_dismissed_until');
        if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
          setShowBanner(true);
        }
      }
    }, 2500);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => {
            console.log('PWA ServiceWorker registered with scope:', reg.scope);
          },
          (err) => {
            console.log('PWA ServiceWorker registration failed:', err);
          }
        );
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error during PWA install:', err);
      }
    } else {
      // Check if iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        setShowIOSModal(true);
      } else {
        alert(
          'Để cài đặt Đồ Sơn Today trên trình duyệt:\n\n' +
          '1. Nhấp vào biểu tượng Cài đặt (⊕ hoặc biểu tượng máy tính/điện thoại) trên thanh địa chỉ trình duyệt.\n' +
          '2. Hoặc mở menu trình duyệt (dấu 3 chấm) -> Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".'
        );
      }
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    // Dismiss for 7 days
    localStorage.setItem('pwa_banner_dismissed_until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        showBanner,
        installPWA,
        dismissBanner,
        showIOSModal,
        setShowIOSModal
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
