import { useState, useEffect, useRef, useCallback, memo } from "react";

// ============================================
// Constants
// ============================================
const isBrowser = typeof window !== "undefined";
const TOAST_DURATION = 3000;

// ============================================
// Hook: useNetworkStatus
// ============================================
export const useNetworkStatus = (options = {}) => {
  const { onOnline = null, onOffline = null } = options;

  const onOnlineRef = useRef(onOnline);
  const onOfflineRef = useRef(onOffline);
  const prevOnlineRef = useRef(true);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    onOnlineRef.current = onOnline;
    onOfflineRef.current = onOffline;
  });

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!isBrowser) return;

    const initialStatus = navigator.onLine;
    setIsOnline(initialStatus);
    prevOnlineRef.current = initialStatus;

    const handleOnline = () => {
      setIsOnline(true);
      if (isInitializedRef.current && !prevOnlineRef.current) {
        onOnlineRef.current?.();
      }
      prevOnlineRef.current = true;
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (isInitializedRef.current && prevOnlineRef.current) {
        onOfflineRef.current?.();
      }
      prevOnlineRef.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    isInitializedRef.current = true;

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const refresh = useCallback(() => {
    if (!isBrowser) return;
    const currentStatus = navigator.onLine;
    setIsOnline(currentStatus);
    prevOnlineRef.current = currentStatus;
  }, []);

  return { isOnline, refresh };
};

// ============================================
// Component: NetworkStatusIndicator
// ============================================
const NetworkStatusIndicator = memo(({ showToast = true }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "online",
  });

  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showToastMessage = useCallback(
    (type) => {
      if (!showToast) return;

      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const messages = {
        online: "✅ Connection restored!",
        offline: "❌ You are offline",
      };

      setToast({ show: true, message: messages[type], type });

      timerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        timerRef.current = null;
      }, TOAST_DURATION);
    },
    [showToast]
  );

  // Memoized callbacks
  const handleOnline = useCallback(
    () => showToastMessage("online"),
    [showToastMessage]
  );

  const handleOffline = useCallback(
    () => showToastMessage("offline"),
    [showToastMessage]
  );

  const { isOnline } = useNetworkStatus({
    onOnline: handleOnline,
    onOffline: handleOffline,
  });

  const config = isOnline
    ? {
        bg: "bg-green-100 dark:bg-green-900/30",
        dot: "bg-green-500",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        label: "Online",
      }
    : {
        bg: "bg-red-100 dark:bg-red-900/30",
        dot: "bg-red-500",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        label: "Offline",
      };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
            toast.show
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border font-medium ${
              toast.type === "online"
                ? "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200"
                : "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div
        className={`${config.bg} ${config.border} border rounded-md px-2 py-1 flex items-center gap-1.5`}
        role="status"
        aria-label={`Network status: ${config.label}`}
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`size-1.5 rounded-full ${config.dot} ${
              isOnline ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          />
          {isOnline && (
            <span
              className={`absolute size-1.5 rounded-full ${config.dot} animate-ping opacity-75`}
              aria-hidden="true"
            />
          )}
        </div>

        <span className={`text-xs font-medium ${config.text}`}>
          {config.label}
        </span>
      </div>
    </>
  );
});

NetworkStatusIndicator.displayName = "NetworkStatusIndicator";

export default NetworkStatusIndicator;
