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
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../utils/permissions";
import toast from "react-hot-toast";
import apiAxios from "../../api/ApiAxios";
import DeleteOfficeLetterModal from "./DeleteOfficeLetterModal";

const OfficeLetters = () => {
  const navigate = useNavigate();
  const [selectedOfficeLetter, setSelectedOfficeLetter] = useState(null);
  console.log(selectedOfficeLetter);
  const [activeModal, setActiveModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Permissions
  const canCreateOfficeLetter = usePermission(["office-letter.create"]);
  const canEditOfficeLetter = usePermission(["office-letter.edit"]);
  const canDeleteOfficeLetter = usePermission(["office-letter.delete"]);
  const canViewOfficeLetter = usePermission(["office-letter.show"]);

  const {
    data: officeLetters,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.officeLetters.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const handleAction = (action, row) => {
    setSelectedOfficeLetter(row);
    closeDropdown();

    switch (action) {
      case "payment":
        // https://usptorecords.com/?office_letter_id=94&caseId=SNtest123&docId=20251128
        const paymentUrl = `https://usptorecords.com/?office_letter_id=${
          row.id
        }&caseId=${row.serial_number || ""}&docId=${format(
          new Date(),
          "yyyyMMdd"
        )}`;
        window.open(paymentUrl, "_blank");
        break;
      case "view":
        navigate(`/office-letters/${row.id}/view`);
        break;
      case "edit":
        navigate(`/office-letters/${row.id}/edit`);
        break;
      case "delete":
        setActiveModal("delete");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission =
    canViewOfficeLetter || canEditOfficeLetter || canDeleteOfficeLetter;

  const handleDeleteOfficeLetter = async () => {
    if (!selectedOfficeLetter?.id) return;

    setDeleting(true);
    try {
      await apiAxios.delete(
        ApiRequest.officeLetters.delete(selectedOfficeLetter.id)
      );
      toast.success("Office letter deleted successfully!");
      setActiveModal(null);
      setSelectedOfficeLetter(null);
      refresh();
    } catch (error) {
      console.error("Error deleting office letter:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete office letter"
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const columns = [
    {
      name: "Serial Number",
      sortable: true,
      width: "180px",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {row.serial_number || "N/A"}
          </div>
          <div
            className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]"
            title={row.mark}
          >
            {row.mark || "N/A"}
          </div>
        </div>
      ),
    },
    {
      name: "Client",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[180px]">
            {row.client_name || "N/A"}
          </div>
          <div
            className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[180px]"
            title={row.invoice?.lead_email}
          >
            {row.invoice?.lead_email || "N/A"}
          </div>
        </div>
      ),
    },

    {
      name: "Invoice",
      sortable: true,
      width: "160px",
      cell: (row) => {
        const status = row.invoice?.transaction_status || "unknown";
        const isPaid = status === "paid";
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                ${row.invoice?.transaction_amount || "0"}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  isPaid
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              #{row.invoice?.invoice_no || "N/A"}
            </div>
          </div>
        );
      },
    },

    {
      name: "Dates",
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">DL:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {formatDate(row.deadline) || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">Due:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {formatDate(row.invoice?.due_date) || "N/A"}
            </span>
          </div>
        </div>
      ),
    },

    {
      name: "Heading",
      sortable: true,
      cell: (row) => (
        <div
          className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2"
          title={row.heading}
        >
          {row.heading || "N/A"}
        </div>
      ),
    },

    {
      name: "Brand / Created",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[130px]">
            {formatDate(row.created_at) || "N/A"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
            {row.created_by?.name || "N/A"}
          </div>
        </div>
      ),
    },

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
            {/* Payment Link - Show if invoice has slug */}
            {row.invoice?.slug && (
              <>
                <DropdownItem
                  onClick={() => handleAction("payment", row)}
                  icon="💰"
                  label="Payment Link"
                />
                <DropdownDivider />
              </>
            )}

            {canViewOfficeLetter && (
              <DropdownItem
                onClick={() => handleAction("view", row)}
                icon="👁️"
                label="View"
              />
            )}
            {canEditOfficeLetter && (
              <DropdownItem
                onClick={() => handleAction("edit", row)}
                icon="✏️"
                label="Edit"
              />
            )}
            {canDeleteOfficeLetter && (
              <>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => handleAction("delete", row)}
                  icon="🗑️"
                  label="Delete"
                  danger={true}
                />
              </>
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Office Letters
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage office letters and trademark applications
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <SearchBox
              searchTerm={searchTerm}
              onSearch={handleSearch}
              placeholder="Search by serial #, mark, client..."
              className="w-full sm:w-64"
            />

            {/* Refresh Button */}
            <button
              type="button"
              className="btn btn-black flex items-center gap-2"
              onClick={refresh}
              disabled={loading}
            >
              <BsArrowRepeat
                className={loading ? "animate-spin" : ""}
                size={18}
              />
              Refresh
            </button>

            {/* Add Button */}
            {canCreateOfficeLetter && (
              <button
                type="button"
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
                onClick={() => navigate("/office-letters/create")}
              >
                <BsPlus size={20} />
                Add Office Letter
              </button>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="card overflow-hidden p-0 mt-6">
          <DataTable
            className="tm-data-table"
            columns={columns}
            data={officeLetters}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            onChangePage={setCurrentPage}
            onChangeRowsPerPage={setPerPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
            highlightOnHover
            pointerOnHover
            responsive
            dense
            noDataComponent={
              <div className="w-full py-12 text-center dark:bg-slate-800">
                <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                  📄
                </div>
                <div className="text-gray-500 dark:text-slate-300">
                  No office letters found
                </div>
                <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms or create a new office letter
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteOfficeLetterModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedOfficeLetter(null);
        }}
        officeLetter={selectedOfficeLetter}
        onConfirm={handleDeleteOfficeLetter}
        loading={deleting}
      />
    </>
  );
};

export default OfficeLetters;
