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
import { FiltersComponent } from "../../components/AllComponents";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

export default function EditTeamModal({
  open,
  onClose,
  team,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    unit_id: null,
    users: [],
    brands: [],
  });
  const [errors, setErrors] = useState({});

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const handleFilterChange = (filterType, selectedOption) => {
    if (filterType === "unit") {
      setSelectedUnit(selectedOption);
      setFormData((prev) => ({ ...prev, unit_id: selectedOption }));
    } else if (filterType === "user") {
      setSelectedUsers(selectedOption || []);
      setFormData((prev) => ({ ...prev, users: selectedOption || [] }));
    } else if (filterType === "brand") {
      setSelectedBrands(selectedOption || []);
      setFormData((prev) => ({ ...prev, brands: selectedOption || [] }));
    }
  };

  useEffect(() => {
    if (team && open) {
      const unitValue = team.unit
        ? {
            value: team.unit.id || team.unit_id,
            label: team.unit.title || "",
          }
        : null;

      const userValues = team.user
        ? team.user.map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
          }))
        : [];

      const brandValues = team.team_brands
        ? team.team_brands.map((brand) => ({
            value: brand.id,
            label: brand.title,
          }))
        : [];

      setSelectedUnit(unitValue);
      setSelectedUsers(userValues);
      setSelectedBrands(brandValues);

      setFormData({
        title: team.title || "",
        description: team.description || "",
        unit_id: unitValue,
        users: userValues,
        brands: brandValues,
      });
    }
  }, [team, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Team title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Team title must be at least 2 characters";
    }

    if (!formData.unit_id) {
      newErrors.unit_id = "Unit is required";
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
      description: formData.description.trim() || null,
      unit_id: formData.unit_id.value,
      user_ids: formData.users.map((user) => user.value),
      brand_ids: formData.brands.map((brand) => brand.value),
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
              <DialogPanel className="transform transition-all w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Team: {team?.title}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update team information, members, and brands
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-4">
                    {/* Team Title */}
                    <div>
                      <label>
                        Team Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-slate-500 ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. Marketing Team"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                      {errors.title && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.title}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label>Description</label>
                      <textarea
                        className="resize-none form-control"
                        placeholder="Team description..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    </div>

                    {/* FiltersComponent for Unit, Users, Brands */}
                    <div>
                      <FiltersComponent
                        selectedUnit={selectedUnit}
                        selectedUser={selectedUsers}
                        selectedBrand={selectedBrands}
                        onFilterChange={handleFilterChange}
                        showUnits={true}
                        showUsers={true}
                        showBrands={true}
                        multiSelectUsers={true}
                        multiSelectBrands={true}
                        showMerchants={false}
                        showPaymentStatus={false}
                        showTeams={false}
                        showRoles={false}
                        showPermissions={false}
                        showLeadEmail={false}
                        showDateRange={false}
                        showPaymentDateRange={false}
                      />
                      {errors.unit_id && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.unit_id}
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
                    {loading ? "Updating..." : "Update Team"}
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
