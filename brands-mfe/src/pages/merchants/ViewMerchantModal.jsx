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

export default function ViewMerchantModal({ open, onClose, merchant }) {
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  // console.log(merchantDetails);

  useEffect(() => {
    if (open && merchant?.id) {
      fetchMerchantDetails(merchant.id);
    }
  }, [open, merchant]);

  const fetchMerchantDetails = async (merchantId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(
        `${ApiRequest.merchants.show}/${merchantId}/show`
      );
      setMerchantDetails(response.data);
    } catch (error) {
      console.error("Error fetching merchant details:", error);
      setMerchantDetails(merchant);
    } finally {
      setLoading(false);
    }
  };

  const displayMerchant = merchantDetails || merchant;

  const maskSensitiveData = (data) => {
    if (!data || !showSensitiveData) return "••••••••••";
    return data;
  };

  const renderInfoCard = (title, value, isSensitive = false) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
        {title}
        {isSensitive && (
          <span className="ml-2 text-xs text-amber-600 dark:text-amber-300">
            (Sensitive)
          </span>
        )}
      </label>
      <div
        className={`rounded-lg border p-3 text-gray-900 dark:text-slate-100 ${
          isSensitive && !showSensitiveData
            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-700/40 dark:bg-yellow-900/20"
            : "border-gray-200 bg-gray-50 dark:border-slate-700/60 dark:bg-slate-800/60"
        }`}
      >
        {isSensitive && !showSensitiveData
          ? maskSensitiveData(value)
          : value || "N/A"}
      </div>
    </div>
  );

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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Merchant Details
                      </DialogTitle>
                      {loading && (
                        <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          Loading details...
                        </div>
                      )}
                    </div>

                    {/* Toggle Sensitive Data */}
                    <button
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                        showSensitiveData
                          ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/40"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
                      }`}
                    >
                      {showSensitiveData ? "Hide" : "Show"} Sensitive Data
                    </button>
                  </div>
                </div>

                <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Merchant ID
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100 font-mono text-sm">
                              #{displayMerchant?.id}
                            </div>
                          </div>

                          {renderInfoCard("Title", displayMerchant?.title)}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Type
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  displayMerchant?.type === "internal"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                                }`}
                              >
                                {displayMerchant?.type || "N/A"}
                              </span>
                            </div>
                          </div>

                          {renderInfoCard(
                            "Ticket Size",
                            displayMerchant?.ticket_size
                          )}
                          {renderInfoCard(
                            "Merchant Limit",
                            displayMerchant?.merchant_limit
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Merchant Key
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                              <span className="rounded bg-gray-200 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-slate-800/60 dark:text-slate-200">
                                {displayMerchant?.merchant_key || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Currency
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayMerchant?.currency?.toUpperCase()} (
                              {displayMerchant?.currency_symbol})
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Environment
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  displayMerchant?.environment === "production"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                }`}
                              >
                                {displayMerchant?.environment || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Status
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  displayMerchant?.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    : displayMerchant?.status === "inactive"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-slate-800/60 dark:text-slate-200"
                                }`}
                              >
                                {displayMerchant?.status || "pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* API Configuration */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          API Configuration
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {renderInfoCard(
                            "API Key",
                            displayMerchant?.api_key,
                            true
                          )}
                          {renderInfoCard(
                            "Secret Key",
                            displayMerchant?.secret_key,
                            true
                          )}
                          {renderInfoCard(
                            "Endpoint URL",
                            displayMerchant?.endpoint
                          )}
                        </div>
                      </div>

                      {/* VPS Configuration */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          VPS Configuration
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {renderInfoCard("VPS IP", displayMerchant?.vps_ip)}
                          {renderInfoCard(
                            "VPS Username",
                            displayMerchant?.vps_username,
                            true
                          )}
                          {renderInfoCard(
                            "VPS Password",
                            displayMerchant?.vps_password,
                            true
                          )}
                        </div>
                      </div>

                      {/* Gateway Configuration */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Gateway Configuration
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {renderInfoCard(
                            "Gateway URL",
                            displayMerchant?.gateway_url
                          )}
                          {renderInfoCard(
                            "Gateway Username",
                            displayMerchant?.gateway_username,
                            true
                          )}
                          {renderInfoCard(
                            "Gateway Password",
                            displayMerchant?.gateway_password,
                            true
                          )}
                        </div>
                      </div>

                      {/* Card Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Card Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {renderInfoCard(
                            "Card Number",
                            displayMerchant?.card_num,
                            true
                          )}
                          {renderInfoCard(
                            "Card Expiry",
                            displayMerchant?.card_expiry,
                            true
                          )}
                          {renderInfoCard(
                            "Card CVV",
                            displayMerchant?.card_cvv,
                            true
                          )}
                          <div className="md:col-span-2">
                            {renderInfoCard(
                              "Card Address",
                              displayMerchant?.card_address,
                              true
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Timestamps
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Created At
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100 text-sm">
                              {displayMerchant?.created_at
                                ? new Date(
                                    displayMerchant.created_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Updated At
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100 text-sm">
                              {displayMerchant?.updated_at
                                ? new Date(
                                    displayMerchant.updated_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/40 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 size-5 text-blue-600 dark:text-blue-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                              Security Information
                            </h4>
                            <p className="mt-1 text-sm text-blue-700 dark:text-blue-200/80">
                              Sensitive data like API keys, passwords, and card
                              information are masked by default. Use the "Show
                              Sensitive Data" button carefully and ensure no
                              unauthorized access.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
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
