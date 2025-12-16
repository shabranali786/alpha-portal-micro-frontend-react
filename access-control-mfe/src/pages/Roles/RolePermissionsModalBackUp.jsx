import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import ApiRequest from "../../api/ApiRequest";
import { SearchBox } from "../../components/SearchBox";
import { usePaginatedData } from "../../hooks/usePaginatedData";

export default function RolePermissionsModal({
  open,
  onClose,
  role,
  onSubmit,
  loading,
}) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const {
    data: permissions,
    loading: loadingPermissions,
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

  useEffect(() => {
    if (role?.permissions && Array.isArray(role.permissions)) {
      const rolePermissionNames = role.permissions.map((p) => p.name);
      setSelectedPermissions(rolePermissionNames);
    } else {
      setSelectedPermissions([]);
    }
  }, [role, permissions]);

  useEffect(() => {
    if (open && role) {
      refresh();
    }
  }, [open, role, refresh]);

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => {
      if (permission.type === "single" && permission.group_type) {
        const groupPermissions = permissions.filter(
          (p) => p.group_type === permission.group_type && p.type === "single"
        );
        const groupPermissionNames = groupPermissions.map((p) => p.name);

        const filtered = prev.filter(
          (name) => !groupPermissionNames.includes(name)
        );

        return [...filtered, permission.name];
      } else {
        if (prev.includes(permission.name)) {
          return prev.filter((name) => name !== permission.name);
        } else {
          return [...prev, permission.name];
        }
      }
    });
  };

  const isPermissionSelected = (permissionName) => {
    return selectedPermissions.includes(permissionName);
  };

  const handleSubmit = () => {
    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }
    onSubmit(selectedPermissions);
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
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Manage Permissions - {role?.name}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Select permissions for this role ({totalRows} total)
                  </p>

                  {/* Search Box */}
                  <div className="mt-3">
                    <SearchBox
                      onSearch={handleSearch}
                      placeholder="Search permissions..."
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="px-6 py-5 max-h-[calc(90vh-180px)] overflow-y-auto">
                  {loadingPermissions ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full size-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                      <p className="text-gray-600 dark:text-slate-400 mt-2">
                        Loading permissions...
                      </p>
                    </div>
                  ) : permissions.length > 0 ? (
                    <div className="space-y-6">
                      {/* Quick stats */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200">
                              Permission Summary
                            </h4>
                            <p className="text-xs text-purple-700 dark:text-purple-200/80 mt-1">
                              {selectedPermissions.length} of {totalRows}{" "}
                              permissions selected
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setSelectedPermissions(
                                  permissions
                                    .filter((p) => p.type === "multi")
                                    .map((p) => p.name)
                                )
                              }
                              className="px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white rounded text-xs hover:bg-purple-700 dark:hover:bg-purple-400"
                            >
                              Select All Multi
                            </button>
                            <button
                              onClick={() => setSelectedPermissions([])}
                              className="px-3 py-1 bg-gray-600 dark:bg-slate-700 text-white rounded text-xs hover:bg-gray-700 dark:hover:bg-slate-600"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Permissions table with pagination */}
                      <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-700/60 rounded-lg">
                        <div className="bg-gray-50 dark:bg-slate-900/60 px-4 py-2 border-b border-gray-200 dark:border-slate-700/60 sticky top-0">
                          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-slate-400">
                            <span>
                              Showing {permissions.length} of {totalRows}{" "}
                              permissions
                            </span>
                            <span>Page {currentPage}</span>
                          </div>
                        </div>
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700/60 sticky top-8">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300 w-16">
                                Select
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                Permission Name
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                Type
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                Category
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {permissions.map((permission) => {
                              const category =
                                permission.module ||
                                permission.name.split(".")[0];
                              const selected = isPermissionSelected(
                                permission.name
                              );

                              const isRadio =
                                permission.type === "single" &&
                                permission.group_type;

                              return (
                                <tr
                                  key={permission.id}
                                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/70 dark:border-slate-800/60 ${
                                    selected
                                      ? "bg-purple-50 dark:bg-purple-900/20"
                                      : "bg-white dark:bg-slate-900/20"
                                  }`}
                                >
                                  <td className="px-4 py-3">
                                    {isRadio ? (
                                      <input
                                        type="radio"
                                        name={`radio_${permission.group_type}`}
                                        checked={selected}
                                        onChange={() =>
                                          handlePermissionChange(permission)
                                        }
                                        className="size-4 border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-900/60 dark:text-purple-300 dark:focus:ring-purple-400"
                                      />
                                    ) : (
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() =>
                                          handlePermissionChange(permission)
                                        }
                                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-900/60 dark:text-purple-300 dark:focus:ring-purple-400"
                                      />
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                      {permission.title || permission.name}
                                    </div>
                                    {permission.description && (
                                      <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                        {permission.description}
                                      </div>
                                    )}

                                    {permission.title &&
                                      permission.title !== permission.name && (
                                        <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                                          {permission.name}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isRadio ? (
                                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                        Radio
                                      </span>
                                    ) : (
                                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                        Checkbox
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-800 dark:bg-slate-800/60 dark:text-slate-200">
                                      {category}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {totalRows > perPage && (
                          <div className="bg-gray-50 dark:bg-slate-900/60 px-4 py-3 border-t border-gray-200 dark:border-slate-700/60 sticky bottom-0">
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() =>
                                  setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:bg-slate-900/40 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Page {currentPage} of{" "}
                                {Math.ceil(totalRows / perPage)}
                              </span>
                              <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={
                                  currentPage >= Math.ceil(totalRows / perPage)
                                }
                                className="px-3 py-1 text-sm bg-white border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:bg-slate-900/40 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected permissions summary */}
                      {selectedPermissions.length > 0 && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
                            Selected Permissions ({selectedPermissions.length})
                          </h4>
                          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                            {selectedPermissions.map(
                              (permissionName, index) => {
                                const permission = permissions.find(
                                  (p) => p.name === permissionName
                                );
                                return (
                                  <span
                                    key={index}
                                    className="flex items-center gap-1 rounded px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 text-xs"
                                  >
                                    {permission?.title || permissionName}
                                    <button
                                      onClick={() =>
                                        handlePermissionChange(
                                          permission || {
                                            name: permissionName,
                                            type: "multi",
                                          }
                                        )
                                      }
                                      className="text-purple-600 dark:text-purple-200 hover:text-purple-800 dark:hover:text-purple-100 ml-1"
                                      title="Remove permission"
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-900/40">
                      <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                        :(
                      </div>
                      <div className="text-gray-500 dark:text-slate-300">
                        No permissions available
                      </div>
                      <button
                        onClick={refresh}
                        className="mt-3 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-400 transition-colors"
                      >
                        Retry Loading
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {selectedPermissions.length} of {totalRows} permissions
                      selected
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="btn btn-black"
                        onClick={onClose}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Permissions"}
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
