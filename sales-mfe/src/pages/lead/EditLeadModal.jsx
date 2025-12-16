import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "../../hooks/useSelectStyles";
export default function EditLeadModal({
  open,
  onClose,
  lead,
  onSubmit,
  loading,
  brands,
}) {
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  useEffect(() => {
    if (lead && open) {
      setFormData({
        brand_id: lead.brand_id || "",
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
      });
    }
  }, [lead, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand_id) {
      newErrors.brand_id = "Brand is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Phone must be at least 10 digits";
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
      brand_id: parseInt(formData.brand_id),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
    };

    try {
      await onSubmit(submitData);
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const selectedBrand = useMemo(
    () =>
      brands.find(
        (brand) => String(brand.value) === String(formData.brand_id)
      ) || null,
    [brands, formData.brand_id]
  );

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!lead) {
    return null;
  }

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
                    Edit Lead #{lead.id}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update lead information below
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="space-y-4">
                    {/* Brand Selection */}
                    <div>
                      <label>
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={brands}
                        value={selectedBrand || null}
                        onChange={(option) =>
                          handleChange("brand_id", option?.value || "")
                        }
                        isSearchable
                        isDisabled
                        menuPortalTarget={menuPortalTarget}
                        styles={selectStyles}
                        placeholder="Select Brand"
                        classNamePrefix="tm-select"
                      />
                      {errors.brand_id && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.brand_id}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label>
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control transition-colors ${
                          errors.name
                            ? "border-red-500 dark:border-red-500/80"
                            : ""
                        }`}
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control transition-colors ${
                          errors.email
                            ? "border-red-500 dark:border-red-500/80"
                            : ""
                        }`}
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label>
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control transition-colors ${
                          errors.phone
                            ? "border-red-500 dark:border-red-500/80"
                            : ""
                        }`}
                        placeholder="Enter phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    {/* Brand Services - Disabled for now */}
                    <div>
                      <label>Brand Services</label>
                      <select
                        className="form-control transition-colors"
                        disabled
                      >
                        <option>Coming Soon - Under Development</option>
                      </select>
                      {/* <span className="text-xs text-gray-500">
                        This feature will be available in future updates
                      </span> */}
                    </div>

                    {/* Lead Info Display */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/40">
                      <div className="mb-3 text-sm font-medium text-gray-700 dark:text-slate-200">
                        Lead Information
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-slate-300">
                        <div>
                          <span>Lead ID:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-slate-100">
                            #{lead.id}
                          </span>
                        </div>
                        <div>
                          <span>Status:</span>
                          <span
                            className={`ml-1 rounded-full px-2 py-1 text-xs font-medium ${
                              lead.transaction_status === "paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                            }`}
                          >
                            {lead.transaction_status || "unpaid"}
                          </span>
                        </div>
                        <div>
                          <span>Created:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-slate-100">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span>Updated:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-slate-100">
                            {new Date(lead.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        {lead.transaction_amount && (
                          <div className="col-span-2">
                            <span>Amount:</span>
                            <span className="ml-1 font-medium text-green-600 dark:text-emerald-300">
                              ${lead.transaction_amount}
                            </span>
                          </div>
                        )}
                        {lead.transaction_id && (
                          <div className="col-span-2">
                            <span>Transaction ID:</span>
                            <span className="ml-1 font-mono text-xs font-medium text-gray-900 dark:text-slate-100">
                              {lead.transaction_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Brand Display */}
                    {lead.brand && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-blue-800 mb-1">
                          Current Brand
                        </div>
                        <div className="text-sm font-medium text-blue-900">
                          {lead.brand.title}
                        </div>
                        {lead.brand.domain && (
                          <div className="text-xs text-blue-700">
                            {lead.brand.domain}
                          </div>
                        )}
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
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Updating...
                      </span>
                    ) : (
                      "Update Lead"
                    )}
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
