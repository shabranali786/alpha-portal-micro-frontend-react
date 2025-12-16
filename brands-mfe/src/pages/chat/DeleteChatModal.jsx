import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function DeleteChatModal({
  open,
  onClose,
  chat,
  onConfirm,
  loading,
}) {
  const handleConfirm = () => {
    onConfirm();
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
              <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Delete Chat
                  </DialogTitle>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <svg
                        className="size-6 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="text-center text-gray-600 dark:text-slate-400">
                    Are you sure you want to delete the chat{" "}
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      "{chat?.title}"
                    </span>
                    ?
                  </p>
                  <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                    This action cannot be undone.
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
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
                      onClick={handleConfirm}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete Chat"}
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
