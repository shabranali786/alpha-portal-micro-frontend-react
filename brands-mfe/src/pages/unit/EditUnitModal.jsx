import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function EditUnitModal({
  open,
  onClose,
  unit,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    lifetime_limit: "0",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (unit && open) {
      setFormData({
        title: unit.title || "",
        lifetime_limit: unit.lifetime_limit || "0",
      });
    }
  }, [unit, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.lifetime_limit.trim()) {
      newErrors.lifetime_limit = "Lifetime limit is required";
    } else if (!/^\d+$/.test(formData.lifetime_limit)) {
      newErrors.lifetime_limit = "Lifetime limit must be a number";
    } else if (parseInt(formData.lifetime_limit) < 0) {
      newErrors.lifetime_limit = "Lifetime limit cannot be negative";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      lifetime_limit: formData.lifetime_limit,
    };

    try {
      await onSubmit(submitData);
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
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
              <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Unit
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update unit information:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {unit?.title}
                    </span>
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-4">
                    {/* Title */}
                    <div>
                      <label>
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. Trademark, Ebook, Patents"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                      {errors.title && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.title}
                        </span>
                      )}
                    </div>

                    {/* Lifetime Limit */}
                    <div>
                      <label>
                        Lifetime Limit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        className={`form-control ${
                          errors.lifetime_limit
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter limit (0 for unlimited)"
                        value={formData.lifetime_limit}
                        onChange={(e) =>
                          handleChange("lifetime_limit", e.target.value)
                        }
                      />
                      {errors.lifetime_limit && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.lifetime_limit}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Set 0 for unlimited lifetime limit
                      </span>
                    </div>

                    {/* Current Brands Count (Read-only info) */}
                    {unit?.brands_count && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-900">
                            Current Brands:
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {unit.brands_count} brands
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          This unit currently has {unit.brands_count} associated
                          brands
                        </p>
                      </div>
                    )}
                  </div>
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
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
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Unit"}
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
