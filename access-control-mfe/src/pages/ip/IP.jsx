import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { BsShieldLock, BsPlus, BsPencil, BsTrash, BsEye } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { SearchBox } from "../../components/SearchBox";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  useDropdown,
} from "../../components/CustomDropdown";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import ApiRequest from "../../api/ApiRequest";
import apiAxios from "../../api/ApiAxios";
import toast from "react-hot-toast";
import AddIPModal from "./AddIPModal";
import EditIPModal from "./EditIPModal";
import DeleteModal from "../../components/DeleteModal";
import ViewIPModal from "./ViewIPModal";
import { usePermission } from "../../utils/permissions";

const IP = () => {
  const canCreateIP = usePermission(["ip.create"]);
  const canEditIP = usePermission(["ip.edit"]);
  const canDeleteIP = usePermission(["ip.delete"]);
  const canViewIP = usePermission(["ip.show"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedIp, setSelectedIp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.ips.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const stats = useMemo(() => {
    return {
      total: totalRows || 0,
    };
  }, [totalRows]);

  const handleAction = (action, row) => {
    setSelectedIp(row);
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

  const hasAnyActionPermission = canViewIP || canEditIP || canDeleteIP;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.ips.create, formData);
      toast.success("IP created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Create IP error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create IP";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!selectedIp) return;

    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.ips.update(selectedIp.id), formData);
      toast.success("IP updated successfully!");
      setActiveModal(null);
      setSelectedIp(null);
      refresh();
    } catch (error) {
      console.error("Update IP error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update IP";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIp) return;

    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.ips.delete(selectedIp.id));
      toast.success("IP deleted successfully!");
      setActiveModal(null);
      setSelectedIp(null);
      refresh();
    } catch (error) {
      console.error("Delete IP error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete IP";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const columns = [
    {
      name: "S.N.",
      width: "70px",
      cell: (_row, index) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {(currentPage - 1) * perPage + index + 1}
        </span>
      ),
      ignoreRowClick: true,
    },
    {
      name: "IP Address & Title",
      selector: (row) => row.ip,
      sortable: true,
      minWidth: "250px",
      cell: (row) => (
        <div className="py-1">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BsShieldLock className="text-blue-500" />
            {row.ip}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {row.title}
          </div>
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
          {row.description || "No description"}
        </div>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.created_at,
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="text-sm">
          <div className="text-slate-900 dark:text-slate-100 font-medium">
            {formatDate(row.created_at)}
          </div>
          {row.updated_at !== row.created_at && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Updated {formatDate(row.updated_at)}
            </div>
          )}
        </div>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Actions",
            width: "100px",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            cell: (row) => (
              <div className="relative flex justify-end">
                <DropdownTrigger
                  onClick={(e) => handleDropdownToggle(row.id, e)}
                />
                <CustomDropdown
                  isOpen={openDropdown === row.id}
                  onClose={closeDropdown}
                  position={dropdownPosition}
                >
                  {canViewIP && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}
                  {canEditIP && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  {canDeleteIP && (
                    <DropdownItem
                      onClick={() => handleAction("delete", row)}
                      icon="🗑️"
                      label="Delete"
                      danger
                    />
                  )}
                </CustomDropdown>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-slate-100">
            IP Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage authorized office IPs and access controls
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search by IP or title..."
            size="md"
            icon="search"
            className="w-full sm:w-72"
          />
          <button
            type="button"
            onClick={refresh}
            className="btn btn-black whitespace-nowrap"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Refresh
          </button>
          {canCreateIP && (
            <button
              type="button"
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} />
              Add IP
            </button>
          )}
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total IP Addresses
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Authorized office IPs
              </p>
            </div>
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
              <BsShieldLock className="size-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={data}
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
            <div className="py-12 text-center w-full dark:bg-slate-800">
              <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                No IPs found
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Click 'Add IP' to create your first entry"}
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddIPModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreate}
        loading={submitting}
      />
      <EditIPModal
        open={activeModal === "edit"}
        ipRecord={selectedIp}
        onClose={() => {
          setActiveModal(null);
          setSelectedIp(null);
        }}
        onSubmit={handleUpdate}
        loading={submitting}
      />
      <DeleteModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedIp(null);
        }}
        onConfirm={handleDelete}
        loading={submitting}
        title="Delete IP Address"
        message={`Are you sure you want to delete "${selectedIp?.title}" (${selectedIp?.ip})? This action cannot be undone.`}
      />
      <ViewIPModal
        open={activeModal === "view"}
        ipRecord={selectedIp}
        onClose={() => {
          setActiveModal(null);
          setSelectedIp(null);
        }}
      />
    </div>
  );
};

export default IP;
