import { Fragment, useState, useEffect, useMemo } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "../../hooks/useSelectStyles";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "investigating", label: "Investigating" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function UpdateStatusModal({
  open,
  onClose,
  chargeback,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    current_status: "",
    new_status: null,
    status_note: "",
    notify_customer: false,
  });
  const [errors, setErrors] = useState({});
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  useEffect(() => {
    if (chargeback && open) {
      setFormData({
        current_status: chargeback.status,
        new_status: null,
        status_note: "",
        notify_customer: false,
      });
    }
  }, [chargeback, open]);

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200",
      investigating:
        "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
      accepted: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
      rejected:
        "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
      won: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
      lost: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
      withdrawn:
        "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200"
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.new_status) {
      newErrors.new_status = "Please select a new status";
    }

    if (formData.new_status?.value === formData.current_status) {
      newErrors.new_status = "New status cannot be same as current status";
    }

    if (!formData.status_note.trim()) {
      newErrors.status_note = "Status change note is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix all errors");
      return;
    }

    const submitData = {
      current_status: formData.current_status,
      new_status: formData.new_status.value,
      status_note: formData.status_note.trim(),
      notify_customer: formData.notify_customer,
    };

    try {
      await onSubmit(submitData);
      setFormData({
        current_status: "",
        new_status: null,
        status_note: "",
        notify_customer: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Update Chargeback Status
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                    Change status for {chargeback?.chargeback_number}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 text-sm">
                  <div className="space-y-4">
                    {/* Current Status */}
                    <div>
                      <label>Current Status</label>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-700/60 dark:bg-slate-900/60">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                            formData.current_status
                          )}`}
                        >
                          {formData.current_status}
                        </span>
                      </div>
                    </div>

                    {/* New Status */}
                    <div>
                      <label>
                        New Status <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={statusOptions.filter(
                          (opt) => opt.value !== formData.current_status
                        )}
                        value={formData.new_status}
                        onChange={(option) =>
                          handleChange("new_status", option)
                        }
                        placeholder="Select new status"
                        styles={selectStyles}
                        menuPortalTarget={menuPortalTarget}
                        classNamePrefix="tm-select"
                      />
                      {errors.new_status && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.new_status}
                        </p>
                      )}
                    </div>

                    {/* Status Change Note */}
                    <div>
                      <label>
                        Status Change Note{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.status_note ? "border-red-500" : ""
                        }`}
                        rows="4"
                        maxLength="500"
                        placeholder="Explain why the status is being changed..."
                        value={formData.status_note}
                        onChange={(e) =>
                          handleChange("status_note", e.target.value)
                        }
                      />
                      {errors.status_note && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.status_note}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {formData.status_note.length}/500 characters
                      </p>
                    </div>

                    {/* Notify Customer */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify_customer"
                        className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-blue-400 dark:focus:ring-blue-400"
                        checked={formData.notify_customer}
                        onChange={(e) =>
                          handleChange("notify_customer", e.target.checked)
                        }
                      />
                      <label
                        htmlFor="notify_customer"
                        className="ml-2 text-sm text-gray-700 dark:text-slate-300"
                      >
                        Notify customer via email about this status change
                      </label>
                    </div>

                    {formData.notify_customer && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <span className="font-medium">Email Preview:</span>
                          <br />
                          Customer will be notified that chargeback status has
                          been updated to{" "}
                          <strong>{formData.new_status?.label || "..."}</strong>
                        </p>
                      </div>
                    )}

                    {/* Status Workflow Info */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-700/60 dark:bg-slate-900/60">
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        <span className="font-medium">Info:</span> Status
                        changes are tracked and cannot be undone. Make sure the
                        status change is correct before submitting.
                      </p>
                    </div>
                  </div>
                </form>

                {/* Footer */}
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
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Status"}
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
