import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function ViewPermissionModal({ open, onClose, permission }) {
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
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Permission Details: {permission?.name}
                  </DialogTitle>
                </div>

                <div className="px-6 py-5">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Permission Name
                      </label>
                      <div className="rounded-lg bg-gray-50 p-3 font-medium text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {permission?.name || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Title
                      </label>
                      <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {permission?.title || "No title available"}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Description
                      </label>
                      <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {permission?.description || "No description available"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                          Type
                        </label>
                        <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                          {permission?.type ? (
                            <span className="capitalize">
                              {permission.type}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                          Module
                        </label>
                        <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                          {permission?.module || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Group Type
                      </label>
                      <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {permission?.group_type || "N/A"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                          Created At
                        </label>
                        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-slate-800/60 dark:text-slate-300">
                          {permission?.created_at
                            ? new Date(
                                permission.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                          Updated At
                        </label>
                        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-slate-800/60 dark:text-slate-300">
                          {permission?.updated_at
                            ? new Date(
                                permission.updated_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
