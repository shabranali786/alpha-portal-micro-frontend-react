import { Fragment, useMemo, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "../../hooks/useSelectStyles";

export default function UpdateStatusModal({
  open,
  onClose,
  lead,
  onSubmit,
  loading,
}) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [error, setError] = useState("");

  const selectStyles = useSelectStyles();

  const statusOptions = [
    { value: "new", label: "New Lead" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "fake", label: "Fake" },
    { value: "converted", label: "Converted" },
    { value: "lost", label: "Lost" },
    { value: "follow_up", label: "Follow up" },
    { value: "not_interested", label: "Not Interested" },
  ];

  useEffect(() => {
    if (open && lead) {
      const currentStatus = statusOptions.find(
        (opt) => opt.value === lead.lead_status
      );
      setSelectedStatus(currentStatus || null);
      setError("");
    }
  }, [open, lead]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedStatus) {
      setError("Please select a status");
      return;
    }

    onSubmit({
      lead_id: lead?.id,
      lead_status: selectedStatus.value,
    });
  };

  const handleClose = () => {
    setError("");
    setSelectedStatus(null);
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
              <DialogPanel className="transform transition-all w-full max-w-lg rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="mb-0 text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Update Lead Status
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Update status for lead:{" "}
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
                          Brand:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {lead.brand?.title || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Current Status:
                        </span>
                        <span className="font-medium capitalize text-gray-900 dark:text-slate-100">
                          {lead.lead_status || "new"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Select New Status{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={(option) => {
                          setSelectedStatus(option);
                          if (error) setError("");
                        }}
                        styles={selectStyles}
                        isDisabled={loading}
                        isClearable={false}
                        placeholder="Select Status"
                        classNamePrefix="tm-select"
                      />
                      {error && (
                        <span className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {error}
                        </span>
                      )}
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
                      {loading ? "Updating..." : "Update Status"}
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
