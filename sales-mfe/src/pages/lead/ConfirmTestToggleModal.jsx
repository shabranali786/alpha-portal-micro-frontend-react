import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { BsFlagFill, BsCheckCircleFill } from "react-icons/bs";

export default function ConfirmTestToggleModal({
  open,
  onClose,
  onConfirm,
  loading,
  testToggleAction,
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          if (!loading) {
            onClose();
          }
        }}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 dark:text-slate-100 flex items-center gap-2"
                >
                  {testToggleAction?.makeTest ? (
                    <>
                      <BsFlagFill className="text-orange-500" size={20} />
                      Mark as Test Lead
                    </>
                  ) : (
                    <>
                      <BsCheckCircleFill
                        className="text-emerald-600"
                        size={20}
                      />
                      Move to Live Leads
                    </>
                  )}
                </DialogTitle>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {testToggleAction?.makeTest ? (
                      <>
                        Are you sure you want to mark{" "}
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {testToggleAction?.lead?.name}
                        </span>{" "}
                        as a{" "}
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          Test Lead
                        </span>
                        ?
                        <br />
                        <span className="text-xs mt-2 block text-gray-500 dark:text-slate-500">
                          This lead will be moved to Test Leads tab.
                        </span>
                      </>
                    ) : (
                      <>
                        Are you sure you want to restore{" "}
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {testToggleAction?.lead?.name}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Live Leads
                        </span>
                        ?
                        <br />
                        <span className="text-xs mt-2 block text-gray-500 dark:text-slate-500">
                          This lead will be moved back to Live Leads tab.
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
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
                    className={`btn ${
                      testToggleAction?.makeTest
                        ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                        : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    } text-white`}
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : testToggleAction?.makeTest
                      ? "Mark as Test"
                      : "Move to Live"}
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
