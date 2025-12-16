import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsExclamationTriangle } from "react-icons/bs";

export default function DeleteLeadModal({
  open,
  onClose,
  lead,
  onConfirm,
  loading,
}) {
  if (!lead) return null;

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
                {/* Header */}
                <div className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <BsExclamationTriangle
                        className="size-6 text-red-600 dark:text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Delete Customer
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                        Are you sure you want to delete this customer? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>

                  {/* Lead Info */}
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Customer Name:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {lead.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Email:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {lead.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Brand:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {lead.brand?.title || "N/A"}
                        </span>
                      </div>
                      {lead.transaction_amount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-slate-400">
                            Amount:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-slate-100">
                            ${lead.transaction_amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Warning Message */}
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/20">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      ⚠️ <strong>Warning:</strong> Deleting this customer will
                      permanently remove all associated data including notes and
                      history.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={onConfirm}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete Customer"}
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
