// pages/expenses/EditExpenseModal.js

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

export default function EditExpenseModal({
  open,
  onClose,
  expense,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    category: { value: "advertisement", label: "Advertisement" },
    amount: "",
    description: "",
    expense_date: "",
    team_id: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;
  const selectStyles = useSelectStyles();

  const categoryOptions = [
    { value: "advertisement", label: "Advertisement" },
    { value: "salary", label: "Salary" },
    { value: "utilities", label: "Utilities" },
    { value: "office", label: "Office" },
    { value: "other", label: "Other" },
  ];

  // Populate form when expense changes
  useEffect(() => {
    if (expense && open) {
      // Find category option
      const categoryOption =
        categoryOptions.find((opt) => opt.value === expense.category) ||
        categoryOptions[0];

      setFormData({
        category: categoryOption,
        amount: expense.amount || "",
        description: expense.description || "",
        expense_date: expense.expense_date
          ? expense.expense_date.split("T")[0]
          : "",
        team_id: expense.team_id || "",
      });

      // Set selected team
      if (expense.team) {
        setSelectedTeam({
          value: expense.team.id,
          label: expense.team.title || expense.team.name,
        });
      } else {
        setSelectedTeam(null);
      }
    }
  }, [expense, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "team") {
      setSelectedTeam(value);
      handleChange("team_id", value?.value || "");
      if (errors.team_id) {
        setErrors((prev) => ({ ...prev, team_id: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.expense_date) {
      newErrors.expense_date = "Expense date is required";
    }

    if (!formData.team_id) {
      newErrors.team_id = "Team is required";
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
      category: formData.category.value,
      amount: parseFloat(formData.amount),
      description: formData.description,
      expense_date: formData.expense_date,
      team_id: parseInt(formData.team_id),
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
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Expense
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update expense details: #{expense?.id}
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-4">
                    {/* Category - React Select */}
                    <div>
                      <label>
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className="rs-category"
                        classNamePrefix="tm-select"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(option) => handleChange("category", option)}
                        isSearchable={false}
                        menuPortalTarget={menuPortalTarget}
                        styles={selectStyles}
                        placeholder="Select category"
                      />
                      {errors.category && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.category}
                        </span>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label>
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`form-control ${
                          errors.amount
                            ? "border-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                      />
                      {errors.amount && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.amount}
                        </span>
                      )}
                    </div>

                    {/* Expense Date */}
                    <div>
                      <label>
                        Expense Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          errors.expense_date
                            ? "border-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        value={formData.expense_date}
                        onChange={(e) =>
                          handleChange("expense_date", e.target.value)
                        }
                      />
                      {errors.expense_date && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.expense_date}
                        </span>
                      )}
                    </div>

                    {/* Team - Using FiltersComponent */}
                    <div>
                      <FiltersComponent
                        selectedTeam={selectedTeam}
                        onFilterChange={handleFilterChange}
                        showTeams={true}
                        showUnits={false}
                        showBrands={false}
                        showMerchants={false}
                        showPaymentStatus={false}
                        showUsers={false}
                        showRoles={false}
                        showPermissions={false}
                        showLeads={false}
                        showLeadEmail={false}
                        showDateRange={false}
                        showPaymentDateRange={false}
                      />
                      {errors.team_id && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.team_id}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label>Description</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        placeholder="Enter expense description (optional)"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
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
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Updating..." : "Update Expense"}
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
