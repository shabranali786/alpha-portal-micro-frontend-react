import { Fragment, useMemo, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";

import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import toast from "react-hot-toast";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

export default function AddBrandModal({ open, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    unit_id: null,
    merchant_id: null,
    invoice_link: "",
    detail_form_link: "",
    send_lead_to_email: { value: "allow", label: "Allow" },
    alpha_chat_id: null,

    logo: "",
    name: "",
    email: "",
    phone: "",
    url: "",
    from_mail: "",
    color_code: "#3B82F6",

    transport: "",
    host: "",
    port: "",
    encryption: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [units, setUnits] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [chats, setChats] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  const emailOptions = [
    { value: "allow", label: "Allow" },
    { value: "disallow", label: "Disallow" },
  ];

  const encryptionOptions = [
    { value: "tls", label: "TLS" },
    { value: "ssl", label: "SSL" },
    { value: "none", label: "None" },
  ];
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const fetchUnits = async () => {
    setLoadingUnits(true);
    try {
      const response = await apiAxios.get(ApiRequest.units.list || "/units");
      const unitsData = response.data?.data || response.data || [];
      const unitOptions = unitsData.map((unit) => ({
        value: unit.id,
        label: unit.title || unit.name,
        id: unit.id,
      }));
      setUnits(unitOptions);
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  const fetchMerchants = async () => {
    setLoadingMerchants(true);
    try {
      const response = await apiAxios.get("/merchants" || "/merchants");
      const merchantsData = response.data?.data || response.data || [];
      const merchantOptions = merchantsData.map((merchant) => ({
        value: merchant.id,
        label: merchant.title || merchant.name,
        id: merchant.id,
      }));
      setMerchants(merchantOptions);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      setMerchants([]);
    } finally {
      setLoadingMerchants(false);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const response = await apiAxios.get(ApiRequest.chats.list || "/chats");
      const chatsData = response.data?.data || response.data || [];
      const chatOptions = chatsData.map((chat) => ({
        value: chat.id,
        label: chat.title || chat.name,
        id: chat.id,
      }));
      setChats(chatOptions);
    } catch (error) {
      console.error("Error fetching chats:", error);
      const dummyChats = [
        { value: 1, label: "tm-assured", id: 1 },
        { value: 2, label: "tmassured", id: 2 },
        { value: 3, label: "tm-test2", id: 3 },
        { value: 4, label: "tm-associates", id: 4 },
        { value: 5, label: "tm royal", id: 5 },
        { value: 6, label: "tm-frontier", id: 6 },
      ];
      setChats(dummyChats);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUnits();
      fetchMerchants();
      fetchChats();
    }
  }, [open]);

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

    if (!formData.domain.trim()) {
      newErrors.domain = "Domain is required";
    } else if (!/^https?:\/\/.+/.test(formData.domain)) {
      newErrors.domain = "Domain must start with http:// or https://";
    }

    if (!formData.unit_id) {
      newErrors.unit_id = "Unit is required";
    }

    if (!formData.merchant_id) {
      newErrors.merchant_id = "Merchant is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Brand email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = "URL must start with http:// or https://";
    }

    if (!formData.from_mail.trim()) {
      newErrors.from_mail = "From mail is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.from_mail)) {
      newErrors.from_mail = "From mail format is invalid";
    }

    if (!formData.transport.trim()) {
      newErrors.transport = "Transport is required";
    }

    if (!formData.host.trim()) {
      newErrors.host = "Host is required";
    }

    if (!formData.port.trim()) {
      newErrors.port = "Port is required";
    } else if (!/^\d+$/.test(formData.port)) {
      newErrors.port = "Port must be a number";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
      domain: formData.domain.trim(),
      unit_id: formData.unit_id.value,
      merchant_id: formData.merchant_id.value,
      invoice_link: formData.invoice_link.trim(),
      detail_form_link: formData.detail_form_link.trim(),
      send_lead_to_email: formData.send_lead_to_email.value,

      invoice_settings: {
        logo: formData.logo.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        url: formData.url.trim(),
        from_mail: formData.from_mail.trim(),
        color_code: formData.color_code,
      },

      email_settings: {
        transport: formData.transport.trim(),
        host: formData.host.trim(),
        port: formData.port.trim(),
        encryption: formData.encryption,
        username: formData.username.trim(),
        password: formData.password.trim(),
      },
    };

    try {
      await onSubmit(submitData);
      setFormData({
        title: "",
        domain: "",
        unit_id: null,
        merchant_id: null,
        invoice_link: "",
        detail_form_link: "",
        send_lead_to_email: { value: "allow", label: "Allow" },
        alpha_chat_id: null,
        logo: "",
        name: "",
        email: "",
        phone: "",
        url: "",
        from_mail: "",
        color_code: "#3B82F6",
        transport: "",
        host: "",
        port: "",
        encryption: "",
        username: "",
        password: "",
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
              <DialogPanel className="transform transition-all w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Add New Brand
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Create a comprehensive brand with all settings and
                    configurations
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
                        {/* Title & Domain */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.title ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. Trademark Royal"
                              value={formData.title}
                              onChange={(e) =>
                                handleChange("title", e.target.value)
                              }
                            />
                            {errors.title && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.title}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              Domain <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              className={`form-control ${
                                errors.domain ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. https://trademarkroyal.com/"
                              value={formData.domain}
                              onChange={(e) =>
                                handleChange("domain", e.target.value)
                              }
                            />
                            {errors.domain && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.domain}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unit & Merchant */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Unit <span className="text-red-500">*</span>
                            </label>
                            <Select
                              className="rs-unit"
                              classNamePrefix="rs"
                              options={units}
                              value={formData.unit_id}
                              onChange={(option) =>
                                handleChange("unit_id", option)
                              }
                              isSearchable={true}
                              isLoading={loadingUnits}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select unit"
                            />
                            {errors.unit_id && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.unit_id}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              Website Merchant{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              className="rs-merchant"
                              classNamePrefix="rs"
                              options={merchants}
                              value={formData.merchant_id}
                              onChange={(option) =>
                                handleChange("merchant_id", option)
                              }
                              isSearchable={true}
                              isLoading={loadingMerchants}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select merchant"
                            />
                            {errors.merchant_id && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.merchant_id}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Links */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>Invoice Link</label>
                            <input
                              type="url"
                              className="form-control"
                              placeholder="e.g. https://example.com/invoice/payment/?invoice="
                              value={formData.invoice_link}
                              onChange={(e) =>
                                handleChange("invoice_link", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>Detail Form Link</label>
                            <input
                              type="url"
                              className="form-control"
                              placeholder="e.g. https://example.com/detail-form"
                              value={formData.detail_form_link}
                              onChange={(e) =>
                                handleChange("detail_form_link", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Send Lead to Email */}
                        <div>
                          <label>Send Lead to Email</label>
                          <Select
                            className="rs-email"
                            classNamePrefix="rs"
                            options={emailOptions}
                            value={formData.send_lead_to_email}
                            onChange={(option) =>
                              handleChange("send_lead_to_email", option)
                            }
                            isSearchable={false}
                            menuPortalTarget={menuPortalTarget}
                            styles={selectStyles}
                            placeholder="Select option"
                          />
                        </div>

                        {/* Alpha Chat (Dummy field - not submitted) */}
                        <div>
                          <label>Alpha Chat</label>
                          <Select
                            className="rs-chat"
                            classNamePrefix="rs"
                            options={chats}
                            value={formData.alpha_chat_id}
                            onChange={(option) =>
                              handleChange("alpha_chat_id", option)
                            }
                            isSearchable={true}
                            isLoading={loadingChats}
                            isClearable={true}
                            menuPortalTarget={menuPortalTarget}
                            styles={selectStyles}
                            placeholder="Select chat widget"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand Specific Data Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        Brand Specific Data
                      </h3>
                      <div className="grid gap-4">
                        {/* Logo & Name */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>Logo URL</label>
                            <input
                              type="url"
                              className="form-control"
                              placeholder="e.g. https://example.com/logo.png"
                              value={formData.logo}
                              onChange={(e) =>
                                handleChange("logo", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.name ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. Trademark Royal"
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
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              className={`form-control ${
                                errors.email ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. info@trademarkroyal.com"
                              value={formData.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                            />
                            {errors.email && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.email}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              className={`form-control ${
                                errors.phone ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. +1 (555) 123-4567"
                              value={formData.phone}
                              onChange={(e) =>
                                handleChange("phone", e.target.value)
                              }
                            />
                            {errors.phone && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* URL & From Mail */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              URL <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              className={`form-control ${
                                errors.url ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. https://trademarkroyal.com"
                              value={formData.url}
                              onChange={(e) =>
                                handleChange("url", e.target.value)
                              }
                            />
                            {errors.url && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.url}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              From Mail <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              className={`form-control ${
                                errors.from_mail ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. noreply@trademarkroyal.com"
                              value={formData.from_mail}
                              onChange={(e) =>
                                handleChange("from_mail", e.target.value)
                              }
                            />
                            {errors.from_mail && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.from_mail}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Color Code */}
                        <div>
                          <label>Invoice Color Code</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                              value={formData.color_code}
                              onChange={(e) =>
                                handleChange("color_code", e.target.value)
                              }
                            />
                            <input
                              type="text"
                              className="flex-1 form-control"
                              placeholder="e.g. #3B82F6"
                              value={formData.color_code}
                              onChange={(e) =>
                                handleChange("color_code", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email Settings Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/60">
                        Brand Email Settings
                      </h3>
                      <div className="grid gap-4">
                        {/* Transport & Host */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Transport <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.transport ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. smtp"
                              value={formData.transport}
                              onChange={(e) =>
                                handleChange("transport", e.target.value)
                              }
                            />
                            {errors.transport && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.transport}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              Host <span className="text-red-500">*</span>
                            </label>
                            <input
                              className={`form-control ${
                                errors.host ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. smtp.gmail.com"
                              value={formData.host}
                              onChange={(e) =>
                                handleChange("host", e.target.value)
                              }
                            />
                            {errors.host && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.host}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Port & Encryption */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Port <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.port ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. 587"
                              value={formData.port}
                              onChange={(e) =>
                                handleChange("port", e.target.value)
                              }
                            />
                            {errors.port && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.port}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>Encryption</label>
                            <Select
                              className="rs-encryption"
                              classNamePrefix="rs"
                              options={encryptionOptions}
                              value={encryptionOptions.find(
                                (opt) => opt.value === formData.encryption
                              )}
                              onChange={(option) =>
                                handleChange("encryption", option?.value || "")
                              }
                              isSearchable={false}
                              isClearable={true}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              placeholder="Select encryption"
                            />
                          </div>
                        </div>

                        {/* Username & Password */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label>
                              Username <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              className={`form-control ${
                                errors.username ? "border-red-500" : ""
                              }`}
                              placeholder="e.g. user@gmail.com"
                              value={formData.username}
                              onChange={(e) =>
                                handleChange("username", e.target.value)
                              }
                            />
                            {errors.username && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.username}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>
                              Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              className={`form-control ${
                                errors.password ? "border-red-500" : ""
                              }`}
                              placeholder="Enter email password"
                              value={formData.password}
                              onChange={(e) =>
                                handleChange("password", e.target.value)
                              }
                            />
                            {errors.password && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                {errors.password}
                              </span>
                            )}
                          </div>
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
                      {loading ? "Creating..." : "Create Brand"}
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
