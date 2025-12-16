import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "@crm/shared/components/CustomDropdown";
import { SearchBox } from "@crm/shared/components/SearchBox";
import AddMerchantModal from "./AddMerchantModal";
import EditMerchantModal from "./EditMerchantModal";
import DeleteMerchantModal from "./DeleteMerchantModal";
import ViewMerchantModal from "./ViewMerchantModal";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Merchants = () => {
  const canCreateMerchant = usePermission(["merchant.create"]);
  const canEditMerchant = usePermission(["merchant.edit"]);
  const canDeleteMerchant = usePermission(["merchant.delete"]);
  const canViewMerchant = usePermission(["merchant.show"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: merchants,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    fetchData,
  } = usePaginatedData(ApiRequest.merchants.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedMerchant(row);
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
    canViewMerchant || canEditMerchant || canDeleteMerchant;

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "90px",
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title || "N/A",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="mb-1 block text-gray-900 dark:text-slate-100">
            {row.title}
          </span>
          <div className="text-sm text-gray-400 dark:text-slate-500">
            Type:{" "}
            <span
              className={`font-medium capitalize ${
                row.type === "internal"
                  ? "text-blue-800 dark:text-blue-200"
                  : "text-purple-800 dark:text-purple-200"
              }`}
            >
              {row.type || "N/A"}
            </span>
          </div>
          <div className="text-sm text-gray-400 dark:text-slate-500">
            Merchant:{" "}
            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800 dark:bg-slate-800/60 dark:text-slate-200">
              {row.merchant_key || "N/A"}
            </span>
          </div>
        </div>
      ),
    },

    {
      name: "Currency",
      selector: (row) => row.currency,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-slate-100">
          {row.currency?.toUpperCase()} ({row.currency_symbol})
        </span>
      ),
    },
    {
      name: "Environment",
      selector: (row) => row.environment,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            row.environment === "production"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
          }`}
        >
          {row.environment || "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "100px",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            row.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : row.status === "inactive"
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
              : "bg-gray-100 text-gray-800 dark:bg-slate-800/60 dark:text-slate-200"
          }`}
        >
          {row.status || "pending"}
        </span>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Action",
            width: "80px",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            cell: (row) => (
              <div className="relative">
                <DropdownTrigger
                  onClick={(e) => handleDropdownToggle(row.id, e)}
                />
                <CustomDropdown
                  isOpen={openDropdown === row.id}
                  onClose={closeDropdown}
                  position={dropdownPosition}
                >
                  {canViewMerchant && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}
                  {canEditMerchant && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  <DropdownDivider />
                  {canDeleteMerchant && (
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
        ]
      : []),
  ];

  const handleCreateMerchant = async (merchantData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.merchants.create,
        merchantData
      );
      toast.success("Merchant created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating merchant:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create merchant"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMerchant = async (merchantId, merchantData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.merchants.update(merchantId),
        merchantData
      );
      toast.success("Merchant updated successfully!");
      setActiveModal(null);
      setSelectedMerchant(null);
      refresh();
    } catch (error) {
      console.error("Error updating merchant:", error);
      if (error.response?.status === 500) {
        toast.error(
          "Server error. Please check the data format or contact administrator."
        );
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update merchant. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMerchant = async (merchantId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.merchants.delete(merchantId));
      toast.success("Merchant deleted successfully!");
      setActiveModal(null);
      setSelectedMerchant(null);
      refresh();
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast.error(error.response?.data?.message || "Failed to delete merchant");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Merchants Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage payment merchants and gateway configurations
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search Box */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Merchants"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <BsArrowRepeat size={20} />
            )}{" "}
            Refresh
          </button>

          {/* Add Merchant Button */}
          {canCreateMerchant && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Merchant
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={merchants}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center dark:bg-slate-800">
              <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                💳
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No merchants found
              </div>
              <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                Try adjusting your search terms
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddMerchantModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateMerchant}
        loading={submitting}
      />

      <EditMerchantModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
        onSubmit={(merchantData) =>
          handleUpdateMerchant(selectedMerchant?.id, merchantData)
        }
        loading={submitting}
      />

      <DeleteMerchantModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
        onConfirm={() => handleDeleteMerchant(selectedMerchant?.id)}
        loading={submitting}
      />

      <ViewMerchantModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
      />
    </>
  );
};

export default Merchants;
