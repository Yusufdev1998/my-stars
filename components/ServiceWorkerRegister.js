"use client";

import { useEffect, useState } from "react";

export default function ServiceWorkerRegister() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Handle install prompt for PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for successful PWA installation
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Don't render anything if not installable or if already installed as PWA
  if (!isInstallable || window.matchMedia("(display-mode: standalone)").matches) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Ilovani o'rnatish</h3>
          <p className="text-xs opacity-90">
            Yulduzlar Osmoni ilovasini o'zingizning qurilmangizga o'rnating
          </p>
        </div>
        <button
          onClick={handleInstallClick}
          className="ml-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition whitespace-nowrap text-sm"
        >
          O'rnatish
        </button>
      </div>
      <button
        onClick={() => setIsInstallable(false)}
        className="mt-2 w-full text-xs text-blue-200 hover:text-white"
      >
        Rad etish
      </button>
    </div>
  );
}
