import { Fragment, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function SensitiveModal({
  open,
  onClose,
  onSubmit,
  lead,
  reason,
  setReason,
  error,
  setError,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason");
      return;
    }
    setError("");
    onSubmit();
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-transparent bg-white p-6 text-left align-middle text-gray-900 shadow-xl transition-all dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-gray-900 dark:text-slate-100"
                    >
                      View client contact
                    </DialogTitle>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Please share a quick reason before viewing email and phone
                      details.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700 dark:text-slate-200"
                    >
                      Reason for accessing contact info
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      className={`mt-1 form-control ${
                        error
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-primary focus:ring-primary dark:border-slate-600 dark:focus:border-primary"
                      }`}
                      placeholder="Enter reason for accessing client contact details..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      View Contact
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
