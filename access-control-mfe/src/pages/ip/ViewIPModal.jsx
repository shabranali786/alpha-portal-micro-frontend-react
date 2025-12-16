import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsShieldLock, BsCalendar, BsInfoCircle } from "react-icons/bs";

export default function ViewIPModal({ open, onClose, ipRecord }) {
  if (!ipRecord) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  };

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
              <DialogPanel className="transform transition-all w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    IP Address Details
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                    Complete information about this IP address
                  </p>
                </div>

                <div className="px-6 py-5 space-y-6">
                  {/* IP Address */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                      <BsShieldLock className="size-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300 font-medium mb-1">
                        IP Address
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {ipRecord.ip}
                      </p>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsInfoCircle />
                        Title
                      </label>
                      <p className="text-base font-medium text-gray-900 dark:text-slate-100">
                        {ipRecord.title}
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsInfoCircle />
                        Description
                      </label>
                      <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                        {ipRecord.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700/60">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsCalendar />
                        Created At
                      </label>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        {formatDate(ipRecord.created_at)}
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsCalendar />
                        Last Updated
                      </label>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        {formatDate(ipRecord.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={onClose}
                  >
                    Close
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
