// pages/email-configs/SyncEmailsModal.js

import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

export default function SyncEmailsModal({
  open,
  onClose,
  config,
  onSyncComplete,
}) {
  const [step, setStep] = useState("confirm");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const pollingInterval = useRef(null);
  const pollingAttempts = useRef(0);
  const isMounted = useRef(true);
  const isSyncing = useRef(false);
  const configIdRef = useRef(null);

  const maxPollingAttempts = 60;

  const cleanup = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    isSyncing.current = false;
  }, []);

  useEffect(() => {
    if (open) {
      isMounted.current = true;
      configIdRef.current = config?.id;
      setStep("confirm");
      setLoading(false);
      setStats(null);
      setError(null);
      pollingAttempts.current = 0;
      isSyncing.current = false;
    } else {
      cleanup();
    }
  }, [open, config?.id, cleanup]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [cleanup]);

  const safeSetState = useCallback((setter) => {
    if (isMounted.current) {
      setter();
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    const currentConfigId = configIdRef.current;

    if (!currentConfigId) {
      console.error("No config ID for polling");
      return;
    }

    pollingInterval.current = setInterval(async () => {
      if (!isMounted.current || !configIdRef.current) {
        cleanup();
        return;
      }

      pollingAttempts.current += 1;

      if (pollingAttempts.current > maxPollingAttempts) {
        cleanup();
        safeSetState(() => {
          setError(
            "Sync is taking longer than expected. Please check logs for details."
          );
          setStep("error");
        });
        return;
      }

      try {
        const response = await apiAxios.get(
          ApiRequest.emailConfigs.syncStatus(currentConfigId)
        );

        if (!isMounted.current) return;

        const statusData = response.data?.data;

        if (
          statusData?.status === "completed" &&
          statusData?.is_recent === true
        ) {
          cleanup();
          safeSetState(() => {
            setStats(statusData.stats);
            setStep("complete");
          });

          if (onSyncComplete) {
            onSyncComplete();
          }
        } else if (statusData?.status === "failed") {
          cleanup();
          safeSetState(() => {
            setError(statusData.error_message || "Sync failed");
            setStep("error");
          });
        }
      } catch (error) {
        console.error("Error checking sync status:", error);
      }
    }, 2000);
  }, [cleanup, safeSetState, onSyncComplete]);

  const handleSync = async () => {
    const currentConfigId = config?.id;

    // Prevent multiple sync attempts
    if (!currentConfigId || isSyncing.current || loading) {
      console.log("Sync blocked:", {
        currentConfigId,
        isSyncing: isSyncing.current,
        loading,
      });
      return;
    }

    isSyncing.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log("Starting sync for config:", currentConfigId);

      const response = await apiAxios.post(
        ApiRequest.emailConfigs.sync(currentConfigId)
      );

      console.log("Sync started successfully:", response.data);
      if (!isMounted.current) return;

      setStep("queued");
      setLoading(false);

      setTimeout(() => {
        if (isMounted.current) {
          startPolling();
        }
      }, 2000);
    } catch (error) {
      console.error("Error starting sync:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (!isMounted.current) return;

      let errorMessage = "Failed to start sync";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to sync this email.";
      } else if (error.response?.status === 404) {
        errorMessage = "Email configuration not found.";
      } else if (error.response?.status === 422) {
        errorMessage = error.response.data?.errors
          ? Object.values(error.response.data.errors).flat().join(", ")
          : "Validation failed.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      setStep("error");
      setLoading(false);
      isSyncing.current = false;
    }
  };

  const handleClose = () => {
    cleanup();

    setTimeout(() => {
      if (!open) {
        setStep("confirm");
        setStats(null);
        setError(null);
        pollingAttempts.current = 0;
      }
    }, 300);

    onClose();
  };

  const handleRetry = () => {
    setStep("confirm");
    setError(null);
    isSyncing.current = false;
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* MODAL 1: Confirmation */}
                {step === "confirm" && (
                  <div className="px-6 py-5">
                    <div className="text-center">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <svg
                          className="size-8 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>

                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Sync Emails?
                      </DialogTitle>

                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                        This will download recent emails from IMAP server. It
                        may take 1-2 minutes.
                      </p>

                      <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg mb-5">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                          {config?.email_address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="btn btn-black"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSync}
                        disabled={loading || isSyncing.current}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin size-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Starting...
                          </>
                        ) : (
                          "Sync Now"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 2: Sync Started (Queued) */}
                {step === "queued" && (
                  <div className="px-6 py-5">
                    <div className="text-center">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                        <svg
                          className="animate-spin size-8 text-purple-600 dark:text-purple-400"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>

                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Sync Started!
                      </DialogTitle>

                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                        Email sync job has been queued. Sync will run in the
                        background.
                      </p>

                      <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-5">
                        <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></div>
                        Checking sync status... ({pollingAttempts.current}/
                        {maxPollingAttempts})
                      </div>

                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                        onClick={handleClose}
                      >
                        Run in background
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 3: Sync Complete */}
                {step === "complete" && (
                  <div className="px-6 py-5">
                    <div className="text-center">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <svg
                          className="size-8 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Sync Complete!
                      </DialogTitle>

                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-5">
                        Sync completed successfully!
                      </p>

                      {stats && (
                        <div className="space-y-2 mb-5">
                          <div className="flex justify-between items-center py-2 px-4 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                              Fetched:
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                              {stats.total_fetched || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              New Emails:
                            </span>
                            <span className="text-lg font-bold text-green-900 dark:text-green-100">
                              {stats.new_emails || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Existing:
                            </span>
                            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                              {stats.existing_emails || 0}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="btn btn-primary w-full"
                        onClick={handleClose}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 4: Error */}
                {step === "error" && (
                  <div className="px-6 py-5">
                    <div className="text-center">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <svg
                          className="size-8 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>

                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Sync Failed
                      </DialogTitle>

                      <p className="text-sm text-red-600 dark:text-red-400 mb-5">
                        {error || "An error occurred during sync"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="btn btn-black"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleRetry}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
