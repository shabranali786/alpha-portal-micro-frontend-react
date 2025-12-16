import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function AddNoteModal({
  open,
  onClose,
  lead,
  onSubmit,
  loading,
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNote("");
      setError("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!note.trim()) {
      setError("Note cannot be empty");
      return;
    }

    onSubmit({
      lead_id: lead?.id,
      note: note.trim(),
    });
  };

  const handleClose = () => {
    setError("");
    setNote("");
    onClose();
  };

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
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="mb-0 text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Add Note
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Add a note for lead:{" "}
                    <span className="font-medium">{lead.name}</span>
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5">
                  {/* Lead Info */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-slate-400">
                          Lead ID:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          #{lead.id}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
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
                    </div>
                  </div>

                  {/* Note Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Note <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className={`form-control ${
                          error ? "border-red-500 dark:border-red-500/80" : ""
                        }`}
                        placeholder="Enter your note here... (e.g., Follow up call scheduled for tomorrow)"
                        value={note}
                        onChange={(e) => {
                          setNote(e.target.value);
                          if (error) setError("");
                        }}
                        disabled={loading}
                      />
                      {error && (
                        <span className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {error}
                        </span>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Minimum 5 characters required
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Note"}
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
