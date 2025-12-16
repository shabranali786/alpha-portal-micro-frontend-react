import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

import toast from "react-hot-toast";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

export default function ViewChargebackModal({ open, onClose, chargeback }) {
  const [chargebackData, setChargebackData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChargebackDetails = async (chargebackId) => {
    try {
      setLoading(true);
      const response = await apiAxios.get(
        ApiRequest.chargebacks.show(chargebackId)
      );
      // console.log(response);
      if (response.data && response.data.data) {
        setChargebackData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chargeback details:", error);
      toast.error("Failed to load chargeback details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chargeback && open) {
      fetchChargebackDetails(chargeback.id);
    }
  }, [chargeback, open]);

  if (!open) return null;

  if (!chargebackData) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200",
      investigating:
        "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
      accepted: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
      rejected:
        "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
      won: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
      lost: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
      withdrawn:
        "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200"
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200",
      medium:
        "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
    };
    return (
      colors[priority] ||
      "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200"
    );
  };

  const daysRemaining = null;

  return (
    <Transition
      show={open}
      as={Fragment}
      appear
      afterLeave={() => setActiveChargeback(null)}
    >
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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
                        Chargeback #{chargebackData.id}
                      </DialogTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Created on{" "}
                        {chargebackData.created_at
                          ? new Date(chargebackData.created_at).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                          chargebackData.status
                        )}`}
                      >
                        {chargebackData.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getPriorityColor(
                          "medium"
                        )}`}
                      >
                        Medium Priority
                      </span>
                    </div>
                  </div>
                </div>
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
                  <>
                    {/* Content */}
                    <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                      <div className="space-y-6">
                        {/* Customer Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Customer Information
                          </h3>
                          <div className="card space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Name:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {chargebackData.lead
                                  ? chargebackData.lead.name
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Email:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {chargebackData.lead
                                  ? chargebackData.lead.email
                                  : "N/A"}
                              </span>
                            </div>
                            {chargebackData.lead?.phone && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Phone:
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {chargebackData.lead.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Transaction Details
                          </h3>
                          <div className="card space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Transaction Number:
                              </span>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                {chargebackData.lead?.transaction_id || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Invoice Number:
                              </span>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                {"N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Original Amount:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                ${" "}
                                {chargebackData.lead?.transaction_amount
                                  ? Number(
                                      chargebackData.lead.transaction_amount
                                    ).toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Chargeback Amount:
                              </span>
                              <span className="text-sm font-bold text-red-600 dark:text-red-300">
                                ${" "}
                                {chargebackData.chargeback_amount
                                  ? Number(
                                      chargebackData.chargeback_amount
                                    ).toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Chargeback Fee:
                              </span>
                              <span className="text-sm font-medium text-red-600 dark:text-red-300">
                                $ {"0"}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-slate-700/60">
                              <span className="text-sm font-semibold text-gray-900">
                                Total Loss:
                              </span>
                              <span className="text-base font-bold text-red-600 dark:text-red-300">
                                ${" "}
                                {chargebackData.chargeback_amount
                                  ? Number(
                                      chargebackData.chargeback_amount
                                    ).toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Payment Information
                          </h3>
                          <div className="card space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Payment Method:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100 capitalize">
                                {chargebackData.payment_method
                                  ? chargebackData.payment_method.replace(
                                      /_/g,
                                      " "
                                    )
                                  : "N/A"}
                                {chargebackData.card_last_4 &&
                                  ` (****${chargebackData.card_last_4})`}
                              </span>
                            </div>
                            {chargebackData.bank_reference && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Bank Reference:
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {chargebackData.bank_reference}
                                </span>
                              </div>
                            )}
                            {chargebackData.processor_reference && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Processor Reference:
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {chargebackData.processor_reference}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dispute Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Dispute Information
                          </h3>
                          <div className="card space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Dispute Date:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {new Date(
                                  chargebackData.chargeback_date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {chargebackData.response_date && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Response Date:
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {new Date(
                                    chargebackData.response_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {daysRemaining && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Time Status:
                                </span>
                                <span
                                  className={`text-sm font-semibold ${daysRemaining.color}`}
                                >
                                  {daysRemaining.text}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Reason Code:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100 capitalize">
                                {chargebackData.reason_code
                                  ? chargebackData.reason_code.replace(
                                      /_/g,
                                      " "
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Priority:
                              </span>
                              <span
                                className={`text-sm font-semibold capitalize ${getPriorityColor(
                                  chargebackData.priority
                                )} px-2 py-0.5 rounded`}
                              >
                                {chargebackData.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Brand & Assignment */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Brand & Assignment
                          </h3>
                          <div className="card space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Brand:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {"N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Merchant:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {chargebackData.merchant
                                  ? chargebackData.merchant.title
                                  : "N/A"}
                              </span>
                            </div>
                            {chargebackData.user && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                  Agent:
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {chargebackData.user.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dispute Reason */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                            Dispute Reason
                          </h3>
                          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                            <p className="text-sm text-gray-900 dark:text-slate-100 whitespace-pre-wrap">
                              No dispute reason provided
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400"
                      // onClick={() => console.log("Download chargeback report")}
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Report
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
