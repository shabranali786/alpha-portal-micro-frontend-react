import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";

import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import ViewRoleModal from "./ViewRoleModal";
import PermissionsModal from "./RolePermissionsModal";
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
import { BsArrowRepeat, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Roles = () => {
  const canCreateRole = usePermission(["role.create"]);
  const canEditRole = usePermission(["role.edit"]);
  const canDeleteRole = usePermission(["role.delete"]);
  const canViewRole = usePermission(["role.show"]);
  const canManagePermissions = usePermission(["role.permissions"]);

  const [activeModal, setActiveModal] = useState(null);

  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: roles,
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
  } = usePaginatedData(ApiRequest.roles.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const handleAction = (action, row) => {
    setSelectedRole(row);

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
      case "permissions":
        setActiveModal("permissions");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission =
    canViewRole || canEditRole || canDeleteRole || canManagePermissions;

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
      width: "200px",
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-gray-900 dark:text-slate-100">
          {row.name || "N/A"}
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description || "No description",
      sortable: true,
      cell: (row) => (
        <div
          className="line-clamp-2 text-sm text-gray-600 dark:text-slate-400"
          title={row.description}
        >
          {row.description || "No description available"}
        </div>
      ),
    },
    {
      name: "Permissions",
      selector: (row) => row.permissions?.length || 0,
      width: "150px",
      sortable: true,
      cell: (row) => (
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
          {row.permissions?.length || 0} permissions
        </span>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.created_at,
      width: "150px",
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
                  {canViewRole && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}

                  {canEditRole && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}

                  <DropdownDivider />

                  {canManagePermissions && (
                    <DropdownItem
                      onClick={() => handleAction("permissions", row)}
                      icon="🛡️"
                      label="Permissions"
                    />
                  )}

                  {canDeleteRole && (
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

  const handleCreateRole = async (roleData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(ApiRequest.roles.create, roleData);

      toast.success("Role created successfully!");
      setActiveModal(null);

      refresh();
    } catch (error) {
      console.error("Error creating role:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create role");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (roleId, roleData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        `${ApiRequest.roles.update(roleId)}`,
        roleData
      );

      toast.success("Role updated successfully!");
      setActiveModal(null);
      setSelectedRole(null);

      refresh();
    } catch (error) {
      console.error("Error updating role:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update role");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.roles.delete(roleId));

      toast.success("Role deleted successfully!");
      setActiveModal(null);
      setSelectedRole(null);

      refresh();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error.response?.data?.message || "Failed to delete role");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionsSuccess = () => {
    setActiveModal(null);
    setSelectedRole(null);
    refresh();
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
          <h1 className="text-2xl font-bold">Roles Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage system roles and permissions
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Roles"
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

          {/* Add Role Button */}
          {canCreateRole && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Role
            </button>
          )}
        </div>
      </div>

      {/* Roles Table */}
      <div className="card overflow-hidden p-0 dark:bg-slate-900/60 dark:border-slate-700/60">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={roles}
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
                :(
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No roles found
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
      <AddRoleModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateRole}
        loading={submitting}
      />

      <EditRoleModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onSubmit={(roleData) => handleUpdateRole(selectedRole?.id, roleData)}
        loading={submitting}
      />

      <DeleteRoleModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onConfirm={() => handleDeleteRole(selectedRole?.id)}
        loading={submitting}
      />

      <ViewRoleModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedRole(null);
        }}
        role={selectedRole}
      />

      {/* ✅ Updated Permissions Modal - Ab sirf onSuccess callback */}
      <PermissionsModal
        open={activeModal === "permissions"}
        onClose={() => {
          setActiveModal(null);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onSuccess={handlePermissionsSuccess}
      />
    </>
  );
};

export default Roles;
