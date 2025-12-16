// pages/email-configs/EditEmailConfigModal.js

import { Fragment, useState, useEffect, useMemo } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import FiltersComponent from "@crm/shared/components/FiltersComponent";

export default function EditEmailConfigModal({
  open,
  onClose,
  config,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    email_address: "",
    provider: { value: "imap+smtp", label: "IMAP + SMTP" },
    active: { value: true, label: "Active" },
    imap_host: "",
    imap_port: "993",
    imap_encryption: { value: "ssl", label: "SSL" },
    imap_username: "",
    imap_password: "",
    smtp_host: "",
    smtp_port: "465",
    smtp_encryption: { value: "ssl", label: "SSL" },
    smtp_username: "",
    smtp_password: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showImapPassword, setShowImapPassword] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;
  const selectStyles = useSelectStyles();

  const providerOptions = [
    { value: "imap+smtp", label: "IMAP + SMTP (Full Email Account)" },
    { value: "imap", label: "IMAP Only (Receiving)" },
    { value: "smtp", label: "SMTP Only (Sending)" },
  ];

  const encryptionOptions = [
    { value: "ssl", label: "SSL" },
    { value: "tls", label: "TLS" },
    { value: "none", label: "None" },
  ];

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  // Populate form when config changes
  useEffect(() => {
    if (config && open) {
      const providerOption =
        providerOptions.find((opt) => opt.value === config.provider) ||
        providerOptions[1];
      const imapEncOption =
        encryptionOptions.find((opt) => opt.value === config.imap_encryption) ||
        encryptionOptions[0];
      const smtpEncOption =
        encryptionOptions.find((opt) => opt.value === config.smtp_encryption) ||
        encryptionOptions[0];
      const statusOption =
        statusOptions.find((opt) => opt.value === config.active) ||
        statusOptions[0];

      setFormData({
        brand_id: config.brand_id || "",
        name: config.name || "",
        email_address: config.email_address || "",
        provider: providerOption,
        active: statusOption,
        imap_host: config.imap_host || "",
        imap_port: config.imap_port || "993",
        imap_encryption: imapEncOption,
        imap_username: config.imap_username || "",
        imap_password: config.imap_password || "",
        smtp_host: config.smtp_host || "",
        smtp_port: config.smtp_port || "465",
        smtp_encryption: smtpEncOption,
        smtp_username: config.smtp_username || "",
        smtp_password: config.smtp_password || "",
      });

      if (config.brand) {
        setSelectedBrand({
          value: config.brand.id,
          label: config.brand.title,
        });
      }
    }
  }, [config, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "brand") {
      setSelectedBrand(value);
      handleChange("brand_id", value?.value || "");
      if (errors.brand_id) {
        setErrors((prev) => ({ ...prev, brand_id: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand_id) {
      newErrors.brand_id = "Brand is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email_address.trim()) {
      newErrors.email_address = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = "Invalid email format";
    }

    // IMAP validation (for imap+smtp and imap providers)
    if (
      formData.provider.value === "imap+smtp" ||
      formData.provider.value === "imap"
    ) {
      if (!formData.imap_host.trim()) {
        newErrors.imap_host = "IMAP host is required";
      }
      if (!formData.imap_port) {
        newErrors.imap_port = "IMAP port is required";
      }
      if (!formData.imap_username.trim()) {
        newErrors.imap_username = "IMAP username is required";
      }
      if (!formData.imap_password.trim()) {
        newErrors.imap_password = "IMAP password is required";
      }
    }

    if (
      formData.provider.value === "smtp" ||
      formData.provider.value === "imap+smtp"
    ) {
      if (!formData.smtp_host.trim()) {
        newErrors.smtp_host = "SMTP host is required";
      }
      if (!formData.smtp_port) {
        newErrors.smtp_port = "SMTP port is required";
      }
      if (!formData.smtp_username.trim()) {
        newErrors.smtp_username = "SMTP username is required";
      }
      if (!formData.smtp_password.trim()) {
        newErrors.smtp_password = "SMTP password is required";
      }
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
      email_address: formData.email_address.trim(),
      provider: formData.provider.value,
      active: formData.active.value,
    };

    if (formData.provider.value === "imap+smtp") {
      submitData.imap_host = formData.imap_host.trim();
      submitData.imap_port = parseInt(formData.imap_port);
      submitData.imap_encryption = formData.imap_encryption.value;
      submitData.imap_username = formData.imap_username.trim();
      submitData.imap_password = formData.imap_password.trim();
    }

    if (
      formData.provider.value === "smtp" ||
      formData.provider.value === "imap+smtp"
    ) {
      submitData.smtp_host = formData.smtp_host.trim();
      submitData.smtp_port = parseInt(formData.smtp_port);
      submitData.smtp_encryption = formData.smtp_encryption.value;
      submitData.smtp_username = formData.smtp_username.trim();
      submitData.smtp_password = formData.smtp_password.trim();
    }

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

  const showImapFields =
    formData.provider.value === "imap+smtp" ||
    formData.provider.value === "imap";
  const showSmtpFields =
    formData.provider.value === "smtp" ||
    formData.provider.value === "imap+smtp";

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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Email Configuration
                  </DialogTitle>
                  <p className="mt-1 mb-0 text-sm text-gray-600 dark:text-slate-400">
                    Update email configuration: #{config?.id}
                  </p>
                </div>

                {/* Form - Same structure as Add, but with pre-filled values */}
                <form
                  onSubmit={handleSubmit}
                  className="max-h-[calc(90vh-160px)] overflow-y-auto px-6 py-5"
                >
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Brand */}
                        <div className="md:col-span-2">
                          <FiltersComponent
                            selectedBrand={selectedBrand}
                            onFilterChange={handleFilterChange}
                            showBrands={true}
                            showUnits={false}
                            showMerchants={false}
                            showTeams={false}
                            showPaymentStatus={false}
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
                            Configuration Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.name
                                ? "border-red-500"
                                : "border-gray-300 dark:border-slate-600"
                            }`}
                            placeholder="e.g. Support Email"
                            value={formData.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                          />
                          {errors.name && (
                            <span className="text-xs text-red-500 dark:text-red-400">
                              {errors.name}
                            </span>
                          )}
                        </div>

                        {/* Email Address */}
                        <div>
                          <label>
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${
                              errors.email_address
                                ? "border-red-500"
                                : "border-gray-300 dark:border-slate-600"
                            }`}
                            placeholder="support@example.com"
                            value={formData.email_address}
                            onChange={(e) =>
                              handleChange("email_address", e.target.value)
                            }
                          />
                          {errors.email_address && (
                            <span className="text-xs text-red-500 dark:text-red-400">
                              {errors.email_address}
                            </span>
                          )}
                        </div>

                        {/* Provider */}
                        <div>
                          <label>
                            Provider <span className="text-red-500">*</span>
                          </label>
                          <Select
                            className="rs-provider"
                            classNamePrefix="tm-select"
                            options={providerOptions}
                            value={formData.provider}
                            onChange={(option) =>
                              handleChange("provider", option)
                            }
                            isSearchable={false}
                            menuPortalTarget={menuPortalTarget}
                            styles={selectStyles}
                            placeholder="Select provider"
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label>Status</label>
                          <Select
                            className="rs-status"
                            classNamePrefix="tm-select"
                            options={statusOptions}
                            value={formData.active}
                            onChange={(option) =>
                              handleChange("active", option)
                            }
                            isSearchable={false}
                            menuPortalTarget={menuPortalTarget}
                            styles={selectStyles}
                            placeholder="Select status"
                          />
                        </div>
                      </div>
                    </div>

                    {/* IMAP Configuration */}
                    {showImapFields && (
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4">
                          IMAP Configuration (Incoming Mail)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label>
                              IMAP Host <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.imap_host
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="mail.example.com"
                              value={formData.imap_host}
                              onChange={(e) =>
                                handleChange("imap_host", e.target.value)
                              }
                            />
                            {errors.imap_host && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.imap_host}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              IMAP Port <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.imap_port
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="993"
                              value={formData.imap_port}
                              onChange={(e) =>
                                handleChange("imap_port", e.target.value)
                              }
                            />
                            {errors.imap_port && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.imap_port}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>IMAP Encryption</label>
                            <Select
                              className="rs-imap-encryption"
                              classNamePrefix="tm-select"
                              options={encryptionOptions}
                              value={formData.imap_encryption}
                              onChange={(option) =>
                                handleChange("imap_encryption", option)
                              }
                              isSearchable={false}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                            />
                          </div>

                          <div>
                            <label>
                              IMAP Username{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.imap_username
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="support@example.com"
                              value={formData.imap_username}
                              onChange={(e) =>
                                handleChange("imap_username", e.target.value)
                              }
                            />
                            {errors.imap_username && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.imap_username}
                              </span>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label>
                              IMAP Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showImapPassword ? "text" : "password"}
                                className={`form-control pr-10 ${
                                  errors.imap_password
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-slate-600"
                                }`}
                                placeholder="••••••••"
                                value={formData.imap_password}
                                onChange={(e) =>
                                  handleChange("imap_password", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowImapPassword(!showImapPassword)
                                }
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                              >
                                {showImapPassword ? (
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
                            {errors.imap_password && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.imap_password}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SMTP Configuration */}
                    {showSmtpFields && (
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4">
                          SMTP Configuration (Outgoing Mail)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label>
                              SMTP Host <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.smtp_host
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="smtp.example.com"
                              value={formData.smtp_host}
                              onChange={(e) =>
                                handleChange("smtp_host", e.target.value)
                              }
                            />
                            {errors.smtp_host && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.smtp_host}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              SMTP Port <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.smtp_port
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="465"
                              value={formData.smtp_port}
                              onChange={(e) =>
                                handleChange("smtp_port", e.target.value)
                              }
                            />
                            {errors.smtp_port && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.smtp_port}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>SMTP Encryption</label>
                            <Select
                              className="rs-smtp-encryption"
                              classNamePrefix="tm-select"
                              options={encryptionOptions}
                              value={formData.smtp_encryption}
                              onChange={(option) =>
                                handleChange("smtp_encryption", option)
                              }
                              isSearchable={false}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                            />
                          </div>

                          <div>
                            <label>
                              SMTP Username{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.smtp_username
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              placeholder="support@example.com"
                              value={formData.smtp_username}
                              onChange={(e) =>
                                handleChange("smtp_username", e.target.value)
                              }
                            />
                            {errors.smtp_username && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.smtp_username}
                              </span>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label>
                              SMTP Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showSmtpPassword ? "text" : "password"}
                                className={`form-control pr-10 ${
                                  errors.smtp_password
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-slate-600"
                                }`}
                                placeholder="••••••••"
                                value={formData.smtp_password}
                                onChange={(e) =>
                                  handleChange("smtp_password", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowSmtpPassword(!showSmtpPassword)
                                }
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                              >
                                {showSmtpPassword ? (
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
                            {errors.smtp_password && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.smtp_password}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex justify-end gap-3">
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
                    {loading ? "Updating..." : "Update Configuration"}
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
