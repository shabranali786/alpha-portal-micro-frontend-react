import { Fragment, useMemo, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";

import { useSelectStyles } from "../../hooks/useSelectStyles";
export default function EditMerchantModal({
  open,
  onClose,
  merchant,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    type: null,
    ticket_size: "0",
    merchant_limit: "0",
    merchant_key: "",
    currency: "usd",
    currency_symbol: "$",
    environment: null,
    status: null,

    api_key: "",
    secret_key: "",
    endpoint: "",

    vps_ip: "",
    vps_username: "",
    vps_password: "",

    gateway_url: "",
    gateway_username: "",
    gateway_password: "",

    card_num: "",
    card_expiry: "",
    card_cvv: "",
    card_address: "",
  });

  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
  ];

  const environmentOptions = [
    { value: "production", label: "Production" },
    { value: "sandbox", label: "Sandbox" },
    { value: "testing", label: "Testing" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "requested", label: "Requested" },
  ];

  const merchantKeyOptions = [
    { value: "authorize-net", label: "Authorize.Net" },
    { value: "payarc", label: "PayArc" },
    { value: "nmi", label: "NMI" },
    { value: "bank-wire", label: "Bank Wire" },
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
  ];
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  useEffect(() => {
    if (merchant && open) {
      const merchantType = typeOptions.find(
        (option) => option.value === merchant.type
      );
      const merchantEnvironment = environmentOptions.find(
        (option) => option.value === merchant.environment
      );
      const merchantStatus = statusOptions.find(
        (option) => option.value === merchant.status
      );

      setFormData({
        title: merchant.title || "",
        type: merchantType || null,
        ticket_size: merchant.ticket_size || "0",
        merchant_limit: merchant.merchant_limit || "0",
        merchant_key: merchant.merchant_key || "",
        currency: merchant.currency || "usd",
        currency_symbol: merchant.currency_symbol || "$",
        environment: merchantEnvironment || null,
        status: merchantStatus || null,

        api_key: merchant.api_key || "",
        secret_key: merchant.secret_key || "",
        endpoint: merchant.endpoint || "",

        vps_ip: merchant.vps_ip || "",
        vps_username: merchant.vps_username || "",
        vps_password: merchant.vps_password || "",

        gateway_url: merchant.gateway_url || "",
        gateway_username: merchant.gateway_username || "",
        gateway_password: merchant.gateway_password || "",

        card_num: merchant.card_num || "",
        card_expiry: merchant.card_expiry || "",
        card_cvv: merchant.card_cvv || "",
        card_address: merchant.card_address || "",
      });
    }
  }, [merchant, open]);

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

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.merchant_key.trim()) {
      newErrors.merchant_key = "Merchant key is required";
    }

    if (!formData.environment) {
      newErrors.environment = "Environment is required";
    }

    if (!formData.ticket_size.trim()) {
      newErrors.ticket_size = "Ticket size is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.ticket_size)) {
      newErrors.ticket_size = "Ticket size must be a valid number";
    }

    if (!formData.merchant_limit.trim()) {
      newErrors.merchant_limit = "Merchant limit is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.merchant_limit)) {
      newErrors.merchant_limit = "Merchant limit must be a valid number";
    }

    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.currency_symbol.trim()) {
      newErrors.currency_symbol = "Currency symbol is required";
    }

    if (!formData.vps_ip.trim()) {
      newErrors.vps_ip = "VPS IP is required";
    }

    if (!formData.vps_username.trim()) {
      newErrors.vps_username = "VPS username is required";
    }

    if (!formData.vps_password.trim()) {
      newErrors.vps_password = "VPS password is required";
    }

    if (!formData.gateway_url.trim()) {
      newErrors.gateway_url = "Gateway URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.gateway_url)) {
      newErrors.gateway_url = "Gateway URL must be a valid URL";
    }

    if (!formData.gateway_username.trim()) {
      newErrors.gateway_username = "Gateway username is required";
    }

    if (!formData.gateway_password.trim()) {
      newErrors.gateway_password = "Gateway password is required";
    }

    if (!formData.card_num.trim()) {
      newErrors.card_num = "Card number is required";
    } else if (!/^\d{13,19}$/.test(formData.card_num.replace(/\s/g, ""))) {
      newErrors.card_num = "Card number must be 13-19 digits";
    }

    if (!formData.card_expiry.trim()) {
      newErrors.card_expiry = "Card expiry is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.card_expiry)) {
      newErrors.card_expiry = "Card expiry must be in MM/YYYY format";
    }

    if (!formData.card_cvv.trim()) {
      newErrors.card_cvv = "Card CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.card_cvv)) {
      newErrors.card_cvv = "Card CVV must be 3-4 digits";
    }

    if (!formData.card_address.trim()) {
      newErrors.card_address = "Card address is required";
    } else if (formData.card_address.trim().length < 10) {
      newErrors.card_address = "Card address must be at least 10 characters";
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
      type: formData.type.value,
      ticket_size: formData.ticket_size,
      merchant_limit: formData.merchant_limit,
      merchant_key: formData.merchant_key,
      currency: formData.currency,
      currency_symbol: formData.currency_symbol,
      environment: formData.environment.value,
      status: formData.status?.value || "requested",

      api_key: formData.api_key.trim(),
      secret_key: formData.secret_key.trim(),
      endpoint: formData.endpoint.trim(),

      vps_ip: formData.vps_ip.trim(),
      vps_username: formData.vps_username.trim(),
      vps_password: formData.vps_password.trim(),

      gateway_url: formData.gateway_url.trim(),
      gateway_username: formData.gateway_username.trim(),
      gateway_password: formData.gateway_password.trim(),

      card_num: formData.card_num.trim(),
      card_expiry: formData.card_expiry.trim(),
      card_cvv: formData.card_cvv.trim(),
      card_address: formData.card_address.trim(),
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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Merchant
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Update merchant information:{" "}
                    <span className="font-medium">{merchant?.title}</span>
                  </p>
                </div>

                {/* Form */}
                <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
                  <form onSubmit={handleSubmit} className="px-6 py-5">
                    {/* Basic Information Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        Basic Information
                      </h3>
                      <div className="grid gap-4">
                        {/* Title & Type */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.title
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="e.g. MERCHANT-API-TEST"
                              value={formData.title}
                              onChange={(e) =>
                                handleChange("title", e.target.value)
                              }
                            />
                            {/* {errors.title && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.title}
                              </span>
                            )} */}
                          </div>

                          <div>
                            <label>
                              Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                              className="rs-type"
                              classNamePrefix="rs"
                              options={typeOptions}
                              value={formData.type}
                              onChange={(option) =>
                                handleChange("type", option)
                              }
                              isSearchable={false}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select type"
                            />
                          </div>
                        </div>

                        {/* Ticket Size & Merchant Limit */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Ticket Size{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className={`form-control ${
                                errors.ticket_size
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="0.00"
                              value={formData.ticket_size}
                              onChange={(e) =>
                                handleChange("ticket_size", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Merchant Limit{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className={`form-control ${
                                errors.merchant_limit
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="0.00"
                              value={formData.merchant_limit}
                              onChange={(e) =>
                                handleChange("merchant_limit", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Merchant Key & Currency */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Merchant Key{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              className="rs-merchant-key"
                              classNamePrefix="rs"
                              options={merchantKeyOptions}
                              value={merchantKeyOptions.find(
                                (opt) => opt.value === formData.merchant_key
                              )}
                              onChange={(option) =>
                                handleChange(
                                  "merchant_key",
                                  option?.value || ""
                                )
                              }
                              isSearchable={true}
                              isClearable={true}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select merchant key"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label>
                                Currency <span className="text-red-500">*</span>
                              </label>
                              <input
                                className={`form-control ${
                                  errors.currency
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                placeholder="usd"
                                value={formData.currency}
                                onChange={(e) =>
                                  handleChange(
                                    "currency",
                                    e.target.value.toLowerCase()
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label>
                                Symbol <span className="text-red-500">*</span>
                              </label>
                              <input
                                className={`form-control ${
                                  errors.currency_symbol
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                placeholder="$"
                                value={formData.currency_symbol}
                                onChange={(e) =>
                                  handleChange(
                                    "currency_symbol",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Environment & Status */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Environment{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              className="rs-environment"
                              classNamePrefix="rs"
                              options={environmentOptions}
                              value={formData.environment}
                              onChange={(option) =>
                                handleChange("environment", option)
                              }
                              isSearchable={false}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select environment"
                            />
                          </div>

                          <div>
                            <label>Status</label>
                            <Select
                              className="rs-status"
                              classNamePrefix="rs"
                              options={statusOptions}
                              value={formData.status}
                              onChange={(option) =>
                                handleChange("status", option)
                              }
                              isSearchable={false}
                              isClearable={true}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select status (optional)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* API Configuration Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        API Configuration
                      </h3>
                      <div className="grid gap-4">
                        {/* API Key & Secret Key */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>API Key</label>
                            <input
                              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
                              placeholder="Enter API key"
                              value={formData.api_key}
                              onChange={(e) =>
                                handleChange("api_key", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>Secret Key</label>
                            <input
                              type="password"
                              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
                              placeholder="Enter secret key"
                              value={formData.secret_key}
                              onChange={(e) =>
                                handleChange("secret_key", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Endpoint */}
                        <div>
                          <label>Endpoint URL</label>
                          <input
                            type="url"
                            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g. https://api.example.com/v1/transactions"
                            value={formData.endpoint}
                            onChange={(e) =>
                              handleChange("endpoint", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* VPS Configuration Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        VPS Configuration
                      </h3>
                      <div className="grid gap-4">
                        {/* VPS IP */}
                        <div>
                          <label>
                            VPS IP <span className="text-red-500">*</span>
                          </label>
                          <input
                            className={`form-control font-mono ${
                              errors.vps_ip
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="e.g. 192.168.1.100"
                            value={formData.vps_ip}
                            onChange={(e) =>
                              handleChange("vps_ip", e.target.value)
                            }
                          />
                        </div>

                        {/* VPS Username & Password */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              VPS Username{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.vps_username
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter VPS username"
                              value={formData.vps_username}
                              onChange={(e) =>
                                handleChange("vps_username", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>
                              VPS Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              className={`form-control ${
                                errors.vps_password
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter VPS password"
                              value={formData.vps_password}
                              onChange={(e) =>
                                handleChange("vps_password", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gateway Configuration Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        Gateway Configuration
                      </h3>
                      <div className="grid gap-4">
                        {/* Gateway URL */}
                        <div>
                          <label>
                            Gateway URL <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            className={`form-control ${
                              errors.gateway_url
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="e.g. https://gateway.example.com/"
                            value={formData.gateway_url}
                            onChange={(e) =>
                              handleChange("gateway_url", e.target.value)
                            }
                          />
                        </div>

                        {/* Gateway Username & Password */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Gateway Username{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.gateway_username
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter gateway username"
                              value={formData.gateway_username}
                              onChange={(e) =>
                                handleChange("gateway_username", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Gateway Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              className={`form-control ${
                                errors.gateway_password
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter gateway password"
                              value={formData.gateway_password}
                              onChange={(e) =>
                                handleChange("gateway_password", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Information Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        Card Information
                      </h3>
                      <div className="grid gap-4">
                        {/* Card Number */}
                        <div>
                          <label>
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            className={`form-control font-mono ${
                              errors.card_num
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="e.g. 4242424242424242"
                            value={formData.card_num}
                            onChange={(e) =>
                              handleChange("card_num", e.target.value)
                            }
                          />
                        </div>

                        {/* Card Expiry & CVV */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Card Expiry{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control font-mono ${
                                errors.card_expiry
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="MM/YYYY (e.g. 12/2025)"
                              value={formData.card_expiry}
                              onChange={(e) =>
                                handleChange("card_expiry", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Card CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control font-mono ${
                                errors.card_cvv
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="e.g. 123"
                              value={formData.card_cvv}
                              onChange={(e) =>
                                handleChange("card_cvv", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Card Address */}
                        <div>
                          <label>
                            Card Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows="3"
                            className={`form-control resize-none ${
                              errors.card_address
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter billing address"
                            value={formData.card_address}
                            onChange={(e) =>
                              handleChange("card_address", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
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
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Merchant"}
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
