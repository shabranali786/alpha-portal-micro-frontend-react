import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

export default function ViewBrandModal({ open, onClose, brand }) {
  const [brandDetails, setBrandDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && brand?.id) {
      fetchBrandDetails(brand.id);
    }
  }, [open, brand]);

  const fetchBrandDetails = async (brandId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(
        `${ApiRequest.brands.show}/${brandId}/show`
      );
      setBrandDetails(response.data);
    } catch (error) {
      console.error("Error fetching brand details:", error);
      setBrandDetails(brand);
    } finally {
      setLoading(false);
    }
  };

  const displayBrand = brandDetails || brand;

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
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40 h-full">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Brand Details
                  </DialogTitle>
                  {loading && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Loading details...
                    </div>
                  )}
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Title
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.title || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Domain
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.domain ? (
                                <a
                                  href={displayBrand.domain}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
                                >
                                  {displayBrand.domain}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Unit
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.unit?.title || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Send Lead to Email
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  displayBrand?.send_lead_to_email === "allow"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                }`}
                              >
                                {displayBrand?.send_lead_to_email || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Alpha Chat
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.alpha_chat?.title ||
                                displayBrand?.alpha_chat?.name ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Links & Forms
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Invoice Link
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.invoice_link ? (
                                <a
                                  href={displayBrand.invoice_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
                                >
                                  {displayBrand.invoice_link}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Detail Form Link
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                              {displayBrand?.detail_form_link ? (
                                <a
                                  href={displayBrand.detail_form_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
                                >
                                  {displayBrand.detail_form_link}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Website Merchant */}
                      {displayBrand?.website_merchant && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                            Website Merchant
                          </h3>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/40">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <div>
                                <label>Title:</label>
                                <div className="text-gray-900 dark:text-slate-100">
                                  {displayBrand.website_merchant.title}
                                </div>
                              </div>
                              <div>
                                <label>Merchant Key:</label>
                                <div className="text-gray-900 dark:text-slate-100">
                                  {displayBrand.website_merchant.merchant_key}
                                </div>
                              </div>
                              <div>
                                <label>Status:</label>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    displayBrand.website_merchant.status ===
                                    "active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-slate-800/60 dark:text-slate-200"
                                  }`}
                                >
                                  {displayBrand.website_merchant.status ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Invoice Merchants Table */}
                      {displayBrand?.invoice_merchants &&
                        displayBrand.invoice_merchants.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                              Invoice Merchants (
                              {displayBrand.invoice_merchants.length})
                            </h3>
                            <div className="table-container">
                              <table className="table-base dark:divide-slate-700/60">
                                <thead className="table-head dark:bg-slate-900/60 dark:text-slate-300">
                                  <tr>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Title
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Merchant Key
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Currency
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="table-body dark:divide-slate-700/60 dark:bg-slate-900/40">
                                  {displayBrand.invoice_merchants.map(
                                    (merchant, index) => (
                                      <tr
                                        key={index}
                                        className="table-row-hover dark:hover:bg-slate-800/60"
                                      >
                                        <td className="table-cell text-gray-900 dark:text-slate-100">
                                          {merchant.title}
                                        </td>
                                        <td className="table-cell text-gray-900 dark:text-slate-100">
                                          <span className="rounded px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                            {merchant.merchant_key}
                                          </span>
                                        </td>
                                        <td className="table-cell text-gray-900 dark:text-slate-100">
                                          {merchant.currency?.toUpperCase()} (
                                          {merchant.currency_symbol})
                                        </td>
                                        <td className="table-cell">
                                          <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              merchant.status === "active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-slate-800/60 dark:text-slate-200"
                                            }`}
                                          >
                                            {merchant.status || "N/A"}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      {/* Mail Configuration */}
                      {displayBrand?.mail && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                            Mail Configuration
                          </h3>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/40">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <div>
                                <label>Host:</label>
                                <span className="ml-2 text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail.host}
                                </span>
                              </div>
                              <div>
                                <label>Port:</label>
                                <span className="ml-2 text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail.port}
                                </span>
                              </div>
                              <div>
                                <label>Username:</label>
                                <span className="ml-2 text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail.username}
                                </span>
                              </div>
                              <div>
                                <label>Password:</label>
                                <span className="ml-2 text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail.password}
                                </span>
                              </div>
                              <div>
                                <label>Encryption:</label>
                                <span className="ml-2 text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail.encryption}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mail Details */}
                      {displayBrand?.mail_details && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                            Brand Email Details
                          </h3>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/40">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              {displayBrand.mail_details.logo && (
                                <div className="md:col-span-2">
                                  <label>Logo:</label>
                                  <div className="mt-2">
                                    <img
                                      src={displayBrand.mail_details.logo}
                                      alt="Brand Logo"
                                      className="h-16 w-auto rounded border border-gray-200 object-contain dark:border-slate-700/60"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              <div>
                                <label>Name:</label>
                                <div className="text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail_details.name}
                                </div>
                              </div>
                              <div>
                                <label>Email:</label>
                                <div className="text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail_details.email}
                                </div>
                              </div>
                              <div>
                                <label>Phone:</label>
                                <div className="text-gray-900 dark:text-slate-100">
                                  {displayBrand.mail_details.phone}
                                </div>
                              </div>
                              <div>
                                <label>Color Code:</label>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="size-6 rounded border border-gray-200 dark:border-slate-700/60"
                                    style={{
                                      backgroundColor:
                                        displayBrand.mail_details.color_code,
                                    }}
                                  ></div>
                                  <span className="text-gray-900 dark:text-slate-100">
                                    {displayBrand.mail_details.color_code}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

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
                              {displayBrand?.created_at
                                ? new Date(
                                    displayBrand.created_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Updated At
                            </label>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100 text-sm">
                              {displayBrand?.updated_at
                                ? new Date(
                                    displayBrand.updated_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
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
