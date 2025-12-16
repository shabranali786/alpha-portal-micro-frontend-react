import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function DeleteChargebackModal({
  open,
  onClose,
  chargeback,
  onConfirm,
  loading,
}) {
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
              <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                <div className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-500/20">
                        <BsExclamationTriangleFill className="size-6 text-red-600 dark:text-red-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Delete Chargeback?
                      </DialogTitle>
                      <div className="mt-3 text-sm text-gray-600 dark:text-slate-300">
                        <p className="mb-3">
                          Are you sure you want to delete chargeback{" "}
                          <strong className="text-gray-900 dark:text-slate-100">
                            {chargeback?.chargeback_number}
                          </strong>
                          ?
                        </p>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1 dark:border-slate-700/60 dark:bg-slate-900/60">
                          <p>
                            <span className="font-medium">Customer:</span>{" "}
                            {chargeback?.customer_name}
                          </p>
                          <p>
                            <span className="font-medium">Amount:</span> ${" "}
                            {chargeback?.total_amount ? Number(chargeback.total_amount).toLocaleString() : '0'}
                          </p>
                        </div>
                        <p className="mt-3 text-red-600 font-medium dark:text-red-300">
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6">
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
                      {loading ? "Deleting..." : "Delete Chargeback"}
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
