import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function DeleteTeamModal({
  open,
  onClose,
  team,
  onConfirm,
  loading,
}) {
  if (!team) return null;

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
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg
                          className="size-6 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        Delete Team
                      </DialogTitle>
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                        Are you sure you want to delete the team{" "}
                        <strong className="text-gray-900 dark:text-slate-100">
                          "{team.title || "Unknown Team"}"
                        </strong>
                        ? This action cannot be undone.
                      </p>

                      {/* Show additional warnings */}
                      <div className="mt-3 space-y-2">
                        {team.user && team.user.length > 0 && (
                          <div className="rounded border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-500/40 dark:bg-yellow-500/10">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              <strong>Warning:</strong> This team has{" "}
                              {team.user.length} member(s).
                            </p>
                          </div>
                        )}

                        {team.team_brands && team.team_brands.length > 0 && (
                          <div className="rounded border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-500/40 dark:bg-yellow-500/10">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              <strong>Warning:</strong> This team has{" "}
                              {team.team_brands.length} brand(s) assigned.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-black disabled:opacity-50"
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
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </div>
                      ) : (
                        "Delete Team"
                      )}
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
