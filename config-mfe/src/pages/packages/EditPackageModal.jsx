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
import toast from "react-hot-toast";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

export default function EditPackageModal({
  open,
  onClose,
  package: packageData,
  onSubmit,
  loading,
  brandId,
  brandName,
}) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    price: "",
    discounted_price: "",
    description: "",
    badge: "",
    beforeContent: "",
    features: "",
    rush_filing_enabled: false,
    rush_filing_id: "",
    sort: "",
  });

  const [errors, setErrors] = useState({});
  const [packageTypes, setPackageTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const defaultPackageTypes = [
    { value: "filing-packages", label: "Filing Packages" },
    { value: "search-packages", label: "Search Packages" },
    { value: "amazon-brand-registry", label: "Amazon Brand Registry" },
    { value: "rush-filing", label: "Rush Filing" },
  ];
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const fetchPackageTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await apiAxios.get("/package-types");
      const typesData = response.data?.data || response.data || [];

      if (typesData.length > 0) {
        const typeOptions = typesData.map((type) => ({
          value: type.name || type.slug || type.id,
          label: type.title || type.name,
        }));
        setPackageTypes(typeOptions);
      } else {
        setPackageTypes(defaultPackageTypes);
      }
    } catch (error) {
      // console.log("Using default package types");
      setPackageTypes(defaultPackageTypes);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    if (packageData && open) {
      const featuresString = Array.isArray(packageData.features)
        ? packageData.features.join("\n")
        : "";

      setFormData({
        type: packageData.type || "",
        name: packageData.name || "",
        price: packageData.price || "",
        discounted_price: packageData.discounted_price || "",
        description: packageData.description || "",
        badge: packageData.badge || "",
        beforeContent: packageData.beforeContent || "",
        features: featuresString,
        rush_filing_enabled: Boolean(packageData.rush_filing_enabled),
        rush_filing_id: packageData.rush_filing_id || "",
        sort: packageData.sort || "",
      });
      fetchPackageTypes();
    }
  }, [packageData, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Package type is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Package name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Package name must be at least 3 characters";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid number";
    }

    if (
      formData.discounted_price &&
      (isNaN(formData.discounted_price) ||
        parseFloat(formData.discounted_price) < 0)
    ) {
      newErrors.discounted_price = "Discounted price must be a valid number";
    }

    if (
      formData.sort &&
      (isNaN(formData.sort) || parseInt(formData.sort) < 0)
    ) {
      newErrors.sort = "Sort order must be a valid number";
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

    let featuresArray = [];
    if (formData.features.trim()) {
      featuresArray = formData.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0);
    }

    const submitData = {
      type: formData.type.trim(),
      name: formData.name.trim(),
      price: formData.price.trim(),
      discounted_price: formData.discounted_price.trim() || null,
      description: formData.description.trim(),
      badge: formData.badge.trim(),
      beforeContent: formData.beforeContent.trim(),
      features: featuresArray,
      rush_filing_enabled: formData.rush_filing_enabled ? 1 : 0,
      rush_filing_id: formData.rush_filing_id.trim() || null,
      sort: formData.sort.trim() || null,
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

  if (!packageData) {
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
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 shadow-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Package
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                    Update package "{packageData.name}" for{" "}
                    {brandName || `Brand ${brandId}`}
                  </p>
                </div>

                {/* Form - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="px-6 py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Package ID Display */}
                        <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700/60 rounded-lg p-3">
                          <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                            Package ID
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                            #{packageData.id}
                          </div>
                        </div>

                        {/* Package Type */}
                        <div>
                          <label>
                            Package Type{" "}
                            <span className="text-red-500 dark:text-red-300">
                              *
                            </span>
                          </label>
                          <Select
                            options={packageTypes}
                            value={packageTypes.find(
                              (type) => type.value === formData.type
                            )}
                            onChange={(option) =>
                              handleChange("type", option?.value || "")
                            }
                            isSearchable={false}
                            isLoading={loadingTypes}
                            menuPortalTarget={menuPortalTarget}
                            styles={selectStyles}
                            placeholder="Select package type"
                          />
                          {errors.type && (
                            <span className="text-xs text-red-500 dark:text-red-300">
                              {errors.type}
                            </span>
                          )}
                        </div>

                        {/* Package Name */}
                        <div>
                          <label>
                            Package Name{" "}
                            <span className="text-red-500 dark:text-red-300">
                              *
                            </span>
                          </label>
                          <input
                            className={`form-control ${
                              errors.name
                                ? "border-red-500"
                                : "border-gray-300 dark:border-slate-700"
                            }`}
                            placeholder="e.g. Starter Protection"
                            value={formData.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                          />
                          {errors.name && (
                            <span className="text-xs text-red-500 dark:text-red-300">
                              {errors.name}
                            </span>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label>
                              Price{" "}
                              <span className="text-red-500 dark:text-red-300">
                                *
                              </span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className={`form-control ${
                                errors.price
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-700"
                              }`}
                              placeholder="e.g. 39"
                              value={formData.price}
                              onChange={(e) =>
                                handleChange("price", e.target.value)
                              }
                            />
                            {errors.price && (
                              <span className="text-xs text-red-500 dark:text-red-300">
                                {errors.price}
                              </span>
                            )}
                          </div>

                          <div>
                            <label>Discounted Price</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className={`form-control ${
                                errors.discounted_price
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-700"
                              }`}
                              placeholder="e.g. 29"
                              value={formData.discounted_price}
                              onChange={(e) =>
                                handleChange("discounted_price", e.target.value)
                              }
                            />
                            {errors.discounted_price && (
                              <span className="text-xs text-red-500 dark:text-red-300">
                                {errors.discounted_price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badge & Sort Order */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label>Badge (Optional)</label>
                            <input
                              className="rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-gray-900 dark:text-slate-100 placeholder:text-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="e.g. Recommended"
                              value={formData.badge}
                              onChange={(e) =>
                                handleChange("badge", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label>Sort Order</label>
                            <input
                              type="number"
                              min="0"
                              className={`form-control ${
                                errors.sort
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-slate-700"
                              }`}
                              placeholder="e.g. 1"
                              value={formData.sort}
                              onChange={(e) =>
                                handleChange("sort", e.target.value)
                              }
                            />
                            {errors.sort && (
                              <span className="text-xs text-red-500 dark:text-red-300">
                                {errors.sort}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rush Filing */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="edit_rush_filing"
                              checked={formData.rush_filing_enabled}
                              onChange={(e) =>
                                handleChange(
                                  "rush_filing_enabled",
                                  e.target.checked
                                )
                              }
                              className="size-4 text-blue-600 dark:text-blue-300 rounded border-gray-300 dark:border-slate-700 focus:ring-blue-500"
                            />
                            <label
                              htmlFor="edit_rush_filing"
                              className="text-sm font-medium text-gray-700 dark:text-slate-200"
                            >
                              Rush Filing Enabled
                            </label>
                          </div>

                          {formData.rush_filing_enabled && (
                            <div>
                              <label>Rush Filing ID</label>
                              <input
                                className="rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-gray-900 dark:text-slate-100 placeholder:text-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="e.g. 9"
                                value={formData.rush_filing_id}
                                onChange={(e) =>
                                  handleChange("rush_filing_id", e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>

                        {/* Package Dates Info */}
                        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/40 rounded-lg p-3 space-y-1">
                          <div className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                            Package Information
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-200">
                            Created:{" "}
                            {packageData.created_at ? new Date(packageData.created_at).toLocaleString() : 'N/A'}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-200">
                            Updated:{" "}
                            {packageData.updated_at ? new Date(packageData.updated_at).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Description */}
                        <div>
                          <label>Description</label>
                          <textarea
                            rows="3"
                            className="form-control"
                            placeholder="e.g. + Govt. Fee"
                            value={formData.description}
                            onChange={(e) =>
                              handleChange("description", e.target.value)
                            }
                          />
                        </div>

                        {/* Before Content */}
                        <div>
                          <label>Before Content</label>
                          <textarea
                            rows="3"
                            className="form-control"
                            placeholder="e.g. Trademark Serial Number in 10 days"
                            value={formData.beforeContent}
                            onChange={(e) =>
                              handleChange("beforeContent", e.target.value)
                            }
                          />
                        </div>

                        {/* Features */}
                        <div>
                          <label>Features (One per line)</label>
                          <textarea
                            rows="8"
                            className="form-control"
                            placeholder="Full Case Review&#10;Filing by IP professionals&#10;Trademark Alerts for potential conflicts&#10;100% Satisfaction Guarantee"
                            value={formData.features}
                            onChange={(e) =>
                              handleChange("features", e.target.value)
                            }
                          />
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            Enter each feature on a new line. Current count:{" "}
                            {
                              formData.features
                                .split("\n")
                                .filter((f) => f.trim()).length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer */}
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
                      onClick={handleSubmit}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Package"}
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
