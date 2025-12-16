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
import { FiltersComponent } from "../../components/AllComponents";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

export default function EditUserModal({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
    status: null,
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  // console.log(user);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  // Handle filter changes from FiltersComponent
  const handleFilterChange = (filterType, selectedOption) => {
    if (filterType === "role") {
      setFormData((prev) => ({ ...prev, role: selectedOption }));
      if (errors.role) {
        setErrors((prev) => ({ ...prev, role: "" }));
      }
    }
  };

  useEffect(() => {
    if (user && open) {
      const userRole =
        user.roles && user.roles.length > 0
          ? { value: user.roles[0].name, label: user.roles[0].name }
          : null;

      const userStatus = statusOptions.find(
        (option) => option.value === (user.status || "active")
      );

      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: user.display_password || "",
        role: userRole,
        status: userStatus,
      });
    }
  }, [user, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
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
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role.value,
      status: formData.status.value,
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
              <DialogPanel className="transform transition-all w-full max-w-xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit User
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update user information and permissions
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-4">
                    {/* Name */}
                    <div>
                      <label>
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. John Doe"
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
                        className={`form-control ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label>
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-slate-500 ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter new password"
                          value={formData.password}
                          onChange={(e) =>
                            handleChange("password", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                          {showPw ? (
                            <svg
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.password}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Role - Using FiltersComponent */}
                      <div>
                        <FiltersComponent
                          selectedRole={formData.role}
                          onFilterChange={handleFilterChange}
                          showRoles={true}
                          isRoleSearchable={true}
                          roleLabel={
                            <>
                              Role <span className="text-red-500">*</span>
                            </>
                          }
                          // Hide all other filters
                          showUnits={false}
                          showBrands={false}
                          showMerchants={false}
                          showPaymentStatus={false}
                          showTeams={false}
                          showUsers={false}
                          showPermissions={false}
                          showLeads={false}
                          showLeadEmail={false}
                          showDateRange={false}
                          showPaymentDateRange={false}
                        />
                        {errors.role && (
                          <span className="text-xs text-red-500 dark:text-red-400">
                            {errors.role}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <label>Status</label>
                        <Select
                          className="rs-status"
                          classNamePrefix="tm-select"
                          options={statusOptions}
                          value={formData.status}
                          onChange={(option) => handleChange("status", option)}
                          isSearchable={false}
                          menuPortalTarget={menuPortalTarget}
                          styles={selectStyles}
                          placeholder="Select status"
                        />
                      </div>
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
                    {loading ? "Updating..." : "Update User"}
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
