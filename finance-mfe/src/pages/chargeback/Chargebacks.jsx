import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "../../components/CustomDropdown";
import { SearchBox } from "../../components/SearchBox";
import AddChargebackModal from "./AddChargebackModal";
import EditChargebackModal from "./EditChargebackModal";
import DeleteChargebackModal from "./DeleteChargebackModal";
import ViewChargebackModal from "./ViewChargebackModal";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import {
  BsArrowRepeat,
  BsPlus,
  BsExclamationTriangleFill,
  BsClockFill,
  BsCheckCircleFill,
  BsCurrencyDollar,
  BsEye,
  BsPencil,
  BsDownload,
  BsTrash,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { usePermission } from "../../utils/permissions";

const Chargebacks = () => {
  const canCreateChargeback = usePermission(["chargeback.create"]);
  const canEditChargeback = usePermission(["chargeback.edit"]);
  const canDeleteChargeback = usePermission(["chargeback.delete"]);
  const canViewChargeback = usePermission(["chargeback.show"]);

  const [activeModal, setActiveModal] = useState(null);

  const [selectedChargeback, setSelectedChargeback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: chargebacks,
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
  } = usePaginatedData(ApiRequest.chargebacks.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const hasAnyActionPermission =
    canViewChargeback || canEditChargeback || canDeleteChargeback;

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedChargeback(row);
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

  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status?.toLowerCase()) {
        case "pending":
          return {
            icon: BsClockFill,
            className:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          };
        case "investigating":
          return {
            icon: BsExclamationTriangleFill,
            className:
              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          };
        case "won":
        case "reverted":
          return {
            icon: BsCheckCircleFill,
            className:
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          };
        case "lost":
          return {
            icon: BsExclamationTriangleFill,
            className:
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          };
        default:
          return {
            icon: BsClockFill,
            className:
              "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          };
      }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon size={10} />
        {status || "N/A"}
      </span>
    );
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "70px",
      sortable: true,
      cell: (row) => (
        <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          #{row.id}
        </div>
      ),
    },
    {
      name: "Customer Details",
      selector: (row) => row.lead?.name,
      sortable: true,
      minWidth: "220px",
      cell: (row) => (
        <div className="py-1">
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {row.lead?.name || "N/A"}
          </div>
          <div className="text-sm text-gray-500 dark:text-slate-400">
            {row.lead?.email || "N/A"}
          </div>
          <div className="text-xs text-gray-400 dark:text-slate-500">
            {row.lead?.phone || "No Phone"}
          </div>
          {row.lead?.address && (
            <div className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              {row.lead.address}
            </div>
          )}
          {(row.lead?.city || row.lead?.state || row.lead?.country) && (
            <div className="text-xs text-gray-400 dark:text-slate-500">
              {[row.lead?.city, row.lead?.state, row.lead?.country]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Financial Info",
      selector: (row) => row.chargeback_amount,
      sortable: true,
      minWidth: "140px",
      cell: (row) => (
        <div className="text-right">
          <div className="font-semibold text-lg text-red-600 dark:text-red-400">
            ${parseFloat(row.chargeback_amount || 0).toFixed(2)}
          </div>
          {row.fee_amount && (
            <div className="text-xs text-gray-500">
              Fee: ${parseFloat(row.fee_amount).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Payment Info",
      selector: (row) => row.card_digits,
      minWidth: "160px",
      cell: (row) => (
        <div>
          <div className="font-mono text-sm font-medium text-gray-900 dark:text-slate-100">
            {row.card_number || row.card_digits || "N/A"}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {row.payment_method || "N/A"}
          </div>
          {row.card_type && (
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {row.card_type}
            </div>
          )}
          {row.bank_reference && (
            <div className="text-xs text-gray-400 dark:text-slate-500">
              Bank: {row.bank_reference}
            </div>
          )}
          {row.processor_reference && (
            <div className="text-xs text-gray-400 dark:text-slate-500">
              Proc: {row.processor_reference}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Organization",
      selector: (row) => row.merchant?.title,
      sortable: true,
      minWidth: "160px",
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
            {row.merchant?.title || "N/A"}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {row.team?.title || "No Team"}
          </div>
          <div className="text-xs text-gray-400 dark:text-slate-500">
            {row.brand?.title || "No Brand"}
          </div>
        </div>
      ),
    },
    {
      name: "Status & Priority",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "140px",
      cell: (row) => (
        <div className="space-y-1">
          <StatusBadge status={row.status} />
          {row.priority && (
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                row.priority === "high"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                  : row.priority === "critical"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : row.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
              }`}
            >
              {row.priority}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Timeline",
      selector: (row) => row.chargeback_date,
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {row.chargeback_date
              ? new Date(row.chargeback_date).toLocaleDateString()
              : "N/A"}
          </div>
          {row.due_date && (
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Due: {new Date(row.due_date).toLocaleDateString()}
            </div>
          )}
          {row.created_at && (
            <div className="text-xs text-gray-400 dark:text-slate-500">
              Created: {new Date(row.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Actions",
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
                  {canViewChargeback && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}
                  {canEditChargeback && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  {canDeleteChargeback && (
                    <DropdownItem
                      onClick={() => handleAction("delete", row)}
                      icon="🗑️"
                      label="Delete"
                      className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    />
                  )}
                </CustomDropdown>
              </div>
            ),
            width: "80px",
          },
        ]
      : []),
  ];

  const handleCreateChargeback = async (chargebackData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.chargebacks.create, chargebackData);
      toast.success("Chargeback created successfully!");
      setActiveModal(null);
      setSelectedChargeback(null);
      refresh();
    } catch (error) {
      console.error("Error creating chargeback:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create chargeback"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateChargeback = async (chargebackId, chargebackData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(
        `${ApiRequest.chargebacks.update(chargebackId)}`,
        chargebackData
      );
      toast.success("Chargeback updated successfully!");
      setActiveModal(null);
      setSelectedChargeback(null);
      refresh();
    } catch (error) {
      console.error("Error updating chargeback:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update chargeback"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChargeback = async (chargebackId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(`${ApiRequest.chargebacks.delete(chargebackId)}`);
      toast.success("Chargeback deleted successfully!");
      setActiveModal(null);
      setSelectedChargeback(null);
      refresh();
    } catch (error) {
      console.error("Error deleting chargeback:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete chargeback"
      );
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-slate-100">
            Chargebacks Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage and track all chargeback cases
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Chargebacks"
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
                className="animate-spin size-4 mr-2"
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
            )}
            Refresh
          </button>

          {/* Add Chargeback Button */}
          {canCreateChargeback && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Chargeback
            </button>
          )}
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Total Chargebacks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                200
              </p>
            </div>
            <div className="size-12 bg-red-100 rounded-lg flex items-center justify-center dark:bg-red-500/15">
              <BsExclamationTriangleFill
                className="text-red-600 dark:text-red-300"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Pending/Investigating
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-amber-300">
                pending
              </p>
            </div>
            <div className="size-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-amber-500/20">
              <BsClockFill
                className="text-yellow-600 dark:text-amber-300"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Won/Rejected
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-emerald-300">
                150
              </p>
            </div>
            <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-500/15">
              <BsCheckCircleFill
                className="text-green-600 dark:text-emerald-300"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                $ 500
              </p>
            </div>
            <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-500/15">
              <BsCurrencyDollar
                className="text-blue-600 dark:text-blue-300"
                size={24}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chargebacks Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={chargebacks}
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
                :(
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No chargebacks found
              </div>
              {searchTerm && (
                <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddChargebackModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateChargeback}
        loading={submitting}
      />

      <EditChargebackModal
        open={activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        chargeback={selectedChargeback}
        onSubmit={handleUpdateChargeback}
        loading={submitting}
      />

      <ViewChargebackModal
        open={activeModal === "view"}
        onClose={() => setActiveModal(null)}
        chargeback={selectedChargeback}
      />

      <DeleteChargebackModal
        open={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        chargeback={selectedChargeback}
        onConfirm={() => handleDeleteChargeback(selectedChargeback?.id)}
        loading={submitting}
      />
    </>
  );
};

export default Chargebacks;
