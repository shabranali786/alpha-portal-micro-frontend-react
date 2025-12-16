// pages/expenses/Expenses.js

import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";
import { SearchBox } from "../../components/SearchBox";
import ApiRequest from "../../api/ApiRequest";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import { format } from "date-fns";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "../../components/CustomDropdown";
import { usePermission } from "../../utils/permissions";
import toast from "react-hot-toast";
import apiAxios from "../../api/ApiAxios";
import AddExpenseModal from "./AddExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import DeleteExpenseModal from "./DeleteExpenseModal";
import ViewExpenseModal from "./ViewExpenseModal";

const Expenses = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Permissions
  const canCreateExpense = usePermission(["expense.create"]);
  const canEditExpense = usePermission(["expense.edit"]);
  const canDeleteExpense = usePermission(["expense.delete"]);
  const canViewExpense = usePermission(["expense.show"]);

  const {
    data: expenses,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.expenses.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const handleAction = (action, row) => {
    setSelectedExpense(row);
    closeDropdown();

    switch (action) {
      case "view":
        setActiveModal("view");
        break;
      case "edit":
        setActiveModal("edit");
        break;
      case "delete":
        setActiveModal("delete");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission =
    canViewExpense || canEditExpense || canDeleteExpense;

  const handleCreateExpense = async (expenseData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.expenses.create, expenseData);
      toast.success("Expense created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating expense:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create expense"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.expenses.update(expenseId), expenseData);
      toast.success("Expense updated successfully!");
      setActiveModal(null);
      setSelectedExpense(null);
      refresh();
    } catch (error) {
      console.error("Error updating expense:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update expense"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.expenses.delete(expenseId));
      toast.success("Expense deleted successfully!");
      setActiveModal(null);
      setSelectedExpense(null);
      refresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const getCategoryBadge = (category) => {
    const categories = {
      advertisement: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        label: "Advertisement",
      },
      salary: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        label: "Salary",
      },
      utilities: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        label: "Utilities",
      },
      office: {
        bg: "bg-teal-100 dark:bg-teal-900/30",
        text: "text-teal-700 dark:text-teal-300",
        label: "Office",
      },
      other: {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-700 dark:text-gray-300",
        label: "Other",
      },
    };

    const cat = categories[category] || categories.other;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${cat.bg} ${cat.text}`}
      >
        {cat.label}
      </span>
    );
  };

  const columns = [
    // Column 1: ID + Category
    {
      name: "ID / Category",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          <div className="font-mono text-sm text-slate-900 dark:text-slate-100">
            #{row.id}
          </div>
          <div className="mt-1">{getCategoryBadge(row.category)}</div>
        </div>
      ),
    },

    // Column 2: Amount + Date
    {
      name: "Amount / Date",
      sortable: true,
      width: "160px",
      cell: (row) => (
        <div>
          <div className="font-semibold text-green-600 dark:text-green-400 text-base">
            ${parseFloat(row.amount).toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(row.expense_date)}
          </div>
        </div>
      ),
    },

    // Column 3: Team + Unit
    {
      name: "Team / Unit",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[180px]">
            {row.team?.title || "N/A"}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[180px]">
            {row.unit?.title || "N/A"}
          </div>
        </div>
      ),
    },

    // Column 4: Description
    {
      name: "Description",
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div
          className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2"
          title={row.description}
        >
          {row.description || "No description"}
        </div>
      ),
    },

    // Column 5: Created By + Created At
    {
      name: "Created",
      sortable: true,
      width: "160px",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[140px]">
            {row.created_by?.name || "N/A"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },

    // Column 6: Actions
    {
      name: "",
      right: true,
      allowOverflow: true,
      button: true,
      ignoreRowClick: true,
      width: "60px",
      cell: (row) => (
        <div className="relative">
          <DropdownTrigger onClick={(e) => handleDropdownToggle(row.id, e)} />
          <CustomDropdown
            isOpen={openDropdown === row.id}
            onClose={closeDropdown}
            position={dropdownPosition}
          >
            {canViewExpense && (
              <DropdownItem
                onClick={() => handleAction("view", row)}
                icon="👁️"
                label="View"
              />
            )}
            {canEditExpense && (
              <DropdownItem
                onClick={() => handleAction("edit", row)}
                icon="✏️"
                label="Edit"
              />
            )}
            <DropdownDivider />
            {canDeleteExpense && (
              <DropdownItem
                onClick={() => handleAction("delete", row)}
                icon="🗑️"
                label="Delete"
                danger={true}
              />
            )}
          </CustomDropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Expenses Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage all business expenses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search expenses..."
              size="md"
              icon="search"
              className="w-full sm:w-64"
            />

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={loading}
              className="btn btn-black"
            >
              {loading ? (
                <svg
                  className="animate-spin size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <BsArrowRepeat size={20} />
              )}{" "}
              Refresh
            </button>

            {/* Add Button */}
            {canCreateExpense && (
              <button
                onClick={() => setActiveModal("add")}
                className="btn btn-primary whitespace-nowrap"
              >
                <BsPlus size={20} />
                Add Expense
              </button>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="card overflow-hidden p-0">
          <DataTable
            className="tm-data-table"
            columns={columns}
            data={expenses}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            onChangeRowsPerPage={setPerPage}
            onChangePage={setCurrentPage}
            dense
            highlightOnHover
            pointerOnHover
            responsive
            noDataComponent={
              <div className="w-full py-12 text-center dark:bg-slate-800">
                <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                  💰
                </div>
                <div className="text-gray-500 dark:text-slate-300">
                  No expenses found
                </div>
                <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

      <EditExpenseModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
        onSubmit={(expenseData) =>
          handleUpdateExpense(selectedExpense?.id, expenseData)
        }
        loading={submitting}
      />

      <DeleteExpenseModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
        onConfirm={() => handleDeleteExpense(selectedExpense?.id)}
        loading={submitting}
      />

      <ViewExpenseModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </>
  );
};

export default Expenses;
