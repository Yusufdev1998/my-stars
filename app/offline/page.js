"use client";

import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16H5m13-4v4m0-11v3m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ulanish kerak
        </h1>

        <p className="text-gray-600 mb-6">
          Siz hozirda offline rejimida ishlayapsiz. Bu sahifani ko'rish uchun
          internet ulanishiga ehtiyoj bor.
        </p>

        {isOnline ? (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">
              ✓ Internet ulanishi qayta o'rnatildi!
            </p>
            <p className="text-gray-500 text-sm">
              Asosiy sahifaga o'tkazilmoqda...
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Qaytadan urinib ko'rish
          </button>
        )}

        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">
            Cached sahifalar:
          </h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Asosiy sahifa</li>
            <li>• Kirish sahifasi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
