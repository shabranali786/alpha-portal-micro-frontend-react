import { Fragment, useMemo, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";

import { useSelectStyles } from "../../hooks/useSelectStyles";

export default function AddPermissionModal({
  open,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    type: null,
    module: "",
    group_type: "",
  });
  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: "single", label: "Single" },
    { value: "multi", label: "Multi" },
  ];
  const selectStyles = useSelectStyles();

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type" && value?.value !== "single") {
        updated.group_type = "";
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Permission name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Permission name must be at least 2 characters";
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
      name: formData.name.trim(),
      title: formData.title.trim() || null,
      description: formData.description.trim() || null,
      type: formData.type?.value || null,
      module: formData.module.trim() || null,
      group_type:
        formData.type?.value === "single" && formData.group_type.trim()
          ? formData.group_type.trim()
          : null,
    };

    try {
      await onSubmit(submitData);
      setFormData({
        name: "",
        title: "",
        description: "",
        type: null,
        module: "",
        group_type: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleClose = () => {
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
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Add New Permission
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Create a new system permission
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-4">
                    {/* Permission Name */}
                    <div>
                      <label>
                        Permission Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. users.create, posts.edit"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label>Title</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Create Users"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label>Description</label>
                      <textarea
                        className="resize-none form-control"
                        placeholder="Permission description..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label>Type</label>
                      <Select
                        styles={selectStyles}
                        options={typeOptions}
                        value={formData.type}
                        onChange={(option) => handleChange("type", option)}
                        placeholder="Select type..."
                        isClearable
                      />
                    </div>

                    {/* Module */}
                    <div>
                      <label>Module</label>
                      <input
                        className="form-control"
                        placeholder="e.g. permission"
                        value={formData.module}
                        onChange={(e) => handleChange("module", e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Group Type</label>
                      <input
                        className="form-control"
                        placeholder="e.g. lead_view"
                        value={formData.group_type}
                        onChange={(e) =>
                          handleChange("group_type", e.target.value)
                        }
                        disabled={formData.type?.value !== "single"}
                      />
                      {formData.type?.value !== "single" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Group Type is only available when Type is "Single"
                        </span>
                      )}
                    </div>
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
                    {loading ? "Creating..." : "Create Permission"}
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
