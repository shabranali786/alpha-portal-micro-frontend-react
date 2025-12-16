// pages/email-configs/ViewEmailConfigModal.js

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import { format } from "date-fns";

export default function ViewEmailConfigModal({ open, onClose, config }) {
  const [configDetails, setConfigDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && config?.id) {
      fetchConfigDetails(config.id);
    }
  }, [open, config]);

  const fetchConfigDetails = async (configId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(
        ApiRequest.emailConfigs.show(configId)
      );
      setConfigDetails(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching config details:", error);
      setConfigDetails(config);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy HH:mm a");
    } catch {
      return date;
    }
  };

  const displayConfig = configDetails || config;

  const getProviderLabel = (provider) => {
    const providers = {
      smtp: "SMTP Only",
      "imap+smtp": "IMAP + SMTP",
      mailgun: "Mailgun",
    };
    return providers[provider] || provider;
  };

  const maskPassword = (password) => {
    if (!password) return "N/A";
    return "••••••••••••";
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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Email Configuration Details
                  </DialogTitle>
                  {loading && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Loading details...
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg
                        className="animate-spin size-8 text-gray-400"
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
                  ) : (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Config ID
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              #{displayConfig?.id}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Configuration Name
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayConfig?.name || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Email Address
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayConfig?.email_address || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Provider
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {getProviderLabel(displayConfig?.provider)}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Status
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  displayConfig?.active
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {displayConfig?.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Brand
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayConfig?.brand?.title || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Last Synced At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayConfig?.last_synced_at
                                ? formatDateTime(displayConfig.last_synced_at)
                                : "Never"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* IMAP Configuration */}
                      {displayConfig?.provider === "imap+smtp" && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            IMAP Configuration (Incoming Mail)
                          </h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                IMAP Host
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.imap_host || "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                IMAP Port
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.imap_port || "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                IMAP Encryption
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.imap_encryption?.toUpperCase() ||
                                  "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                IMAP Username
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.imap_username || "N/A"}
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                IMAP Password
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {maskPassword(displayConfig?.imap_password)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SMTP Configuration */}
                      {(displayConfig?.provider === "smtp" ||
                        displayConfig?.provider === "imap+smtp") && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            SMTP Configuration (Outgoing Mail)
                          </h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                SMTP Host
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.smtp_host || "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                SMTP Port
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.smtp_port || "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                SMTP Encryption
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.smtp_encryption?.toUpperCase() ||
                                  "N/A"}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                SMTP Username
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {displayConfig?.smtp_username || "N/A"}
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                SMTP Password
                              </label>
                              <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                                {maskPassword(displayConfig?.smtp_password)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Users Access */}
                      {displayConfig?.users &&
                        displayConfig.users.length > 0 && (
                          <div>
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                              User Access ({displayConfig.users.length})
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border border-gray-300 dark:border-slate-600 text-sm">
                                <thead className="bg-gray-100 dark:bg-slate-800/60">
                                  <tr>
                                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                                      Name
                                    </th>
                                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                                      Email
                                    </th>
                                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {displayConfig.users.map((user, idx) => (
                                    <tr
                                      key={user.id || idx}
                                      className="hover:bg-gray-50 dark:hover:bg-slate-800/40"
                                    >
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-gray-900 dark:text-slate-100">
                                        {user.name}
                                      </td>
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-gray-900 dark:text-slate-100">
                                        {user.email}
                                      </td>
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status === "active"
                                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                                          }`}
                                        >
                                          {user.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      {/* Timestamps */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Timestamps
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Created At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {formatDateTime(displayConfig?.created_at)}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Updated At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {formatDateTime(displayConfig?.updated_at)}
                            </div>
                          </div>
                        </div>

                        {/* Assigned Users Section */}
                        {/* {displayConfig?.users && displayConfig.users.length > 0 && (
                          <div className="mt-6">
                            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Assigned Users ({displayConfig.users.length})
                            </label>
                            <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                                {displayConfig.users.map((user) => (
                                  <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                      {user.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm text-gray-900 dark:text-slate-100">
                                        {user.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400">
                                        Added on {formatDateTime(user.created_at)}
                                      </div>
                                    </div>
                                    {user.pivot?.is_default === "1" && (
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
