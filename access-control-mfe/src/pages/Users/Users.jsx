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
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import PermissionsModal from "./PermissionsModal";
import ViewUserModal from "./ViewUserModal";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { BsArrowRepeat, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Users = () => {
  const canCreateUser = usePermission(["user.create"]);
  const canEditUser = usePermission(["user.edit"]);
  const canDeleteUser = usePermission(["user.delete"]);
  const canViewUser = usePermission(["user.show"]);
  const canManagePermissions = usePermission(["permission.index"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();
  const {
    data: users,
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
  } = usePaginatedData(ApiRequest.users.list);

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedUser(row);
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
      case "permissions":
        setActiveModal("permissions");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission =
    canViewUser || canEditUser || canDeleteUser || canManagePermissions;

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
      width: "150px",
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-slate-100">
          {row.name || "N/A"}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {row.email || "N/A"}
        </span>
      ),
    },
    {
      name: "Roles",
      selector: (row) =>
        Array.isArray(row.roles) && row.roles.length > 0
          ? row.roles.map((role) => role.name).join(", ")
          : "No Roles",
      width: "120px",
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {Array.isArray(row.roles) && row.roles.length > 0
            ? row.roles.map((role) => role.name).join(", ")
            : "No Roles"}
        </span>
      ),
    },
    {
      name: "Teams",
      selector: (row) =>
        Array.isArray(row.teams) && row.teams.length > 0
          ? row.teams.map((team) => team.title || team.name).join(", ")
          : "No Teams",
      width: "300px",
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {Array.isArray(row.teams) && row.teams.length > 0
            ? row.teams.map((team) => team.title || team.name).join(", ")
            : "No Teams"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status || "active",
      width: "100px",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            row.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
          }`}
        >
          {row.status || "active"}
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
                  {canViewUser && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}

                  {canEditUser && (
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

                  {canDeleteUser && (
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

  const handleCreateUser = async (userData) => {
    // console.log(userData);
    setSubmitting(true);
    try {
      const response = await apiAxios.post(ApiRequest.users.create, userData);
      toast.success("User created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.users.update(userId),
        userData
      );
      toast.success("User updated successfully!");
      setActiveModal(null);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("Error updating user:", error);
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
        toast.error("Failed to update user. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.users.delete(userId));
      toast.success("User deleted successfully!");
      setActiveModal(null);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePermissions = async (userId, permissions) => {
    setSubmitting(true);
    if (!userId) {
      toast.error("User ID is required");
      setSubmitting(false);
      return;
    }
    if (!permissions || permissions.length === 0) {
      toast.error("No permissions selected!");
      setSubmitting(false);
      return;
    }
    try {
      const response = await apiAxios.post(
        ApiRequest.users.updatePermissions(userId),
        {
          permissions: permissions,
        }
      );
      toast.success("Permissions updated successfully!");
      setActiveModal(null);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("Error updating permissions:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(
            `${key}: ${
              Array.isArray(errors[key]) ? errors[key][0] : errors[key]
            }`
          );
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update permissions");
      }
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
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage your system users and their permissions
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search Component */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Users"
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

          {/* Add User Button */}
          {canCreateUser && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={users}
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
                No users found
              </div>
              <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                Try adjusting your search terms
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddUserModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateUser}
        loading={submitting}
      />
      <EditUserModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
        loading={submitting}
      />
      <DeleteUserModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={() => handleDeleteUser(selectedUser?.id)}
        loading={submitting}
      />
      <PermissionsModal
        open={activeModal === "permissions"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={(permissions) =>
          handleUpdatePermissions(selectedUser?.id, permissions)
        }
        loading={submitting}
      />
      <ViewUserModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
};

export default Users;
