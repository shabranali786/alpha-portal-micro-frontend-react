import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function DeletePackageModal({
  open,
  onClose,
  package: packageData,
  onConfirm,
  loading,
}) {
  if (!packageData) {
    return null;
  }

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
              <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 shadow-xl">
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="size-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg
                          className="size-6 text-red-600 dark:text-red-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Delete Package
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          Are you sure you want to delete package{" "}
                          <strong>"{packageData.name}"</strong>?
                        </p>
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-lg">
                          <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                            <div>
                              <strong>Package ID:</strong> #{packageData.id}
                            </div>
                            <div>
                              <strong>Type:</strong> {packageData.type}
                            </div>
                            <div>
                              <strong>Price:</strong> ${packageData.price}
                            </div>
                            {packageData.features &&
                              Array.isArray(packageData.features) && (
                                <div>
                                  <strong>Features:</strong>{" "}
                                  {packageData.features.length} items
                                </div>
                              )}
                          </div>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-300 font-medium mt-3">
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
                      {loading ? "Deleting..." : "Delete Package"}
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
