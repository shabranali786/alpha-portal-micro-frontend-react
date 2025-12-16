import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsExclamationTriangle } from "react-icons/bs";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                      <BsExclamationTriangle className="size-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {title}
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
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
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
