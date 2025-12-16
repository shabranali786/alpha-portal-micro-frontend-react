import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";

export default function AddLeadModal({ open, onClose, onSubmit, loading }) {
  // console.log("lead open modal", open);
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isbrands, setBrands] = useState([]);
  const [isBrandsSearch, setBrandsSearch] = useState("");
  const [brandSelectedValue, setbrandSelectedValue] = useState(null);
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const getbrands = useCallback(async (page = 1, limit = 10, search = "") => {
    try {
      const response = await apiAxios.get(
        `${ApiRequest.brands.list}?page=${page}&per_page=${limit}&search=${search}`
      );

      if (Array.isArray(response.data?.data)) {
        setBrands(
          response.data?.data.map((brands) => {
            return {
              value: brands.id,
              label: brands.title,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  });

  const selectStyles = useSelectStyles();

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
      setFormData({
        brand_id: "",
        name: "",
        email: "",
        phone: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const BrandsonInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      clearTimeout(window.brandSearchTimeout);
      window.brandSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          getbrands(1, 10, inputValue.trim());
        } else {
          getbrands(1, 10, "");
        }
      }, 200);
    }
  };

  useEffect(() => {
    getbrands();
  }, [open]);
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
                    Add Leads
                  </DialogTitle>
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
                        Select Brand To create lead for{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={isbrands}
                        value={isbrands.find(
                          (brand) => brand.value === formData.brand_id
                        )}
                        onChange={(option) =>
                          handleChange("brand_id", option?.value || "")
                        }
                        onInputChange={BrandsonInputChange}
                        isSearchable
                        isClearable
                        menuPortalTarget={menuPortalTarget}
                        filterOption={null}
                        styles={selectStyles}
                        placeholder="Select Brand To create lead for"
                        noOptionsMessage={() => "No Brands found"}
                        loadingMessage={() => "Loading Brands..."}
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

                    {/* Brand Services */}
                    <div>
                      <label>Brand Services</label>
                      <select
                        className="form-control transition-colors"
                        disabled
                      >
                        <option>Select Service</option>
                      </select>
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
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
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
