import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";

import AddPermissionModal from "./AddPermissionModal";
import EditPermissionModal from "./EditPermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";
import ViewPermissionModal from "./ViewPermissionModal";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "@crm/shared/components/CustomDropdown";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Permissions = () => {
  const canCreatePermission = usePermission(["permission.create"]);
  const canEditPermission = usePermission(["permission.edit"]);
  const canDeletePermission = usePermission(["permission.delete"]);
  const canViewPermission = usePermission(["permission.show"]);

  const [activeModal, setActiveModal] = useState(null);

  const [selectedPermission, setSelectedPermission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: permissions,
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
  } = usePaginatedData(ApiRequest.permissions.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedPermission(row);

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
    canViewPermission || canEditPermission || canDeletePermission;

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "90px",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name || "N/A",
      width: "250px",
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-gray-900 dark:text-slate-100">
          {row.name || "N/A"}
        </div>
      ),
    },
    {
      name: "Title",
      selector: (row) => row.title || "No title",
      width: "200px",
      sortable: true,
      cell: (row) => (
        <div className="text-sm text-gray-600 dark:text-slate-400">
          {row.title || "No title"}
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description || "No description",
      sortable: true,

      cell: (row) => (
        <div
          className="truncate text-sm text-gray-600 dark:text-slate-400"
          title={row.description}
        >
          {row.description || "No description available"}
        </div>
      ),
    },

    {
      name: "Created",
      selector: (row) => row.created_at,
      width: "120px",
      sortable: true,
      cell: (row) => (
        <div className="text-xs text-gray-500 dark:text-slate-400">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "N/A"}
        </div>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Action",
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
                  {canViewPermission && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}

                  {canEditPermission && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}

                  <DropdownDivider />

                  {canDeletePermission && (
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

  const handleCreatePermission = async (permissionData) => {
    setSubmitting(true);
    try {
      // console.log("Creating permission:", permissionData);
      const response = await apiAxios.post(
        ApiRequest.permissions.create,
        permissionData
      );
      // console.log("Permission created:", response.data);

      toast.success("Permission created successfully!");
      setActiveModal(null);

      refresh();
    } catch (error) {
      console.error("Error creating permission:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create permission"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePermission = async (permissionId, permissionData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.permissions.update(permissionId),
        permissionData
      );
      // console.log("Permission updated:", response.data);

      toast.success("Permission updated successfully!");
      setActiveModal(null);
      setSelectedPermission(null);

      refresh();
    } catch (error) {
      console.error("Error updating permission:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update permission"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePermission = async (permissionId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.permissions.delete(permissionId));

      toast.success("Permission deleted successfully!");
      setActiveModal(null);
      setSelectedPermission(null);

      refresh();
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete permission"
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
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permissions Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage system permissions and access controls
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Permission"
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
            )}{" "}
            Refresh
          </button>

          {/* Add Permission Button */}
          {canCreatePermission && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Permission
            </button>
          )}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={permissions}
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
                No permissions found
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
      <AddPermissionModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreatePermission}
        loading={submitting}
      />

      <EditPermissionModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPermission(null);
        }}
        permission={selectedPermission}
        onSubmit={(permissionData) =>
          handleUpdatePermission(selectedPermission?.id, permissionData)
        }
        loading={submitting}
      />

      <DeletePermissionModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPermission(null);
        }}
        permission={selectedPermission}
        onConfirm={() => handleDeletePermission(selectedPermission?.id)}
        loading={submitting}
      />

      <ViewPermissionModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPermission(null);
        }}
        permission={selectedPermission}
      />
    </>
  );
};

export default Permissions;
