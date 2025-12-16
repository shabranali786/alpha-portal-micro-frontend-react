// pages/expenses/ViewExpenseModal.js

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
import { format } from "date-fns";

export default function ViewExpenseModal({ open, onClose, expense }) {
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && expense?.id) {
      fetchExpenseDetails(expense.id);
    }
  }, [open, expense]);

  const fetchExpenseDetails = async (expenseId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(ApiRequest.expenses.show(expenseId));
      setExpenseDetails(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching expense details:", error);
      setExpenseDetails(expense);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy hh:mm a");
    } catch {
      return date;
    }
  };

  const displayExpense = expenseDetails || expense;

  const getCategoryLabel = (category) => {
    const categories = {
      advertisement: "Advertisement",
      salary: "Salary",
      utilities: "Utilities",
      office: "Office",
      other: "Other",
    };
    return categories[category] || category;
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
              <DialogPanel className="transform transition-all w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Expense Details
                  </DialogTitle>
                  {loading && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Loading details...
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-5">
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
                              Expense ID
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              #{displayExpense?.id}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Category
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {getCategoryLabel(displayExpense?.category)}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Amount
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                $
                                {parseFloat(
                                  displayExpense?.amount || 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Expense Date
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {formatDate(displayExpense?.expense_date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team & Unit Information */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Team & Unit
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Team
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayExpense?.team?.title || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Unit
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayExpense?.unit?.title || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {displayExpense?.description && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            Description
                          </h3>
                          <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                            {displayExpense.description}
                          </div>
                        </div>
                      )}

                      {/* Created By */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Created By
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              User
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayExpense?.created_by?.name || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Email
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayExpense?.created_by?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

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
                              {formatDateTime(displayExpense?.created_at)}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Updated At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {formatDateTime(displayExpense?.updated_at)}
                            </div>
                          </div>
                        </div>
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
