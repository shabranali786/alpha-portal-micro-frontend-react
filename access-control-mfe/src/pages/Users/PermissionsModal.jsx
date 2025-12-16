import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

export default function PermissionsModal({
  open,
  onClose,
  user,
  onSubmit,
  loading,
}) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const canManagePermissions = usePermission(["permission.index"]);
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
  } = usePaginatedData(
    canManagePermissions ? ApiRequest.permissions.list : null
  );

  useEffect(() => {
    if (user?.permissions && Array.isArray(user.permissions)) {
      const userPermissionNames = user.permissions.map((p) => p.name);
      setSelectedPermissions(userPermissionNames);
    } else {
      setSelectedPermissions([]);
    }
  }, [user, permissions]);

  useEffect(() => {
    if (open && user) {
      // console.log("Modal opened for user:", user);
      refresh();
    }
  }, [open, user, refresh]);

  const handlePermissionChange = (permissionName) => {
    // console.log("Permission toggle:", permissionName);
    setSelectedPermissions((prev) => {
      const newPermissions = prev.includes(permissionName)
        ? prev.filter((name) => name !== permissionName)
        : [...prev, permissionName];

      // console.log("Updated selected permissions:", newPermissions);
      return newPermissions;
    });
  };

  const isPermissionSelected = (permissionName) => {
    return selectedPermissions.includes(permissionName);
  };

  const handleSubmit = () => {
    onSubmit(selectedPermissions);
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const category = permission.name.split(".")[0];
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {});

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
                    Manage Permissions - {user?.name}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Select permissions for this user ({totalRows} total)
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

                <div className="max-h-96 overflow-y-auto px-6 py-5">
                  {loadingPermissions ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Loading permissions...
                      </p>
                    </div>
                  ) : permissions.length > 0 ? (
                    <div className="space-y-6">
                      {/* Show permissions in a table format with pagination info */}
                      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700/60">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-slate-700/60 dark:bg-slate-900/40">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
                            <span>
                              Showing {permissions.length} of {totalRows}{" "}
                              permissions
                            </span>
                            <span>Page {currentPage}</span>
                          </div>
                        </div>
                        <table className="w-full">
                          <thead className="border-b border-gray-200 bg-gray-50 dark:border-slate-700/60 dark:bg-slate-900/40">
                            <tr>
                              <th className="w-16 px-4 py-3 text-left font-medium text-gray-700 dark:text-slate-300">
                                Select
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-slate-300">
                                Permission Name
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-slate-300">
                                Category
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                            {permissions.map((permission) => {
                              const category = permission.name.split(".")[0];
                              return (
                                <tr
                                  key={permission.id}
                                  className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/80"
                                >
                                  <td className="px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={isPermissionSelected(
                                        permission.name
                                      )}
                                      onChange={() =>
                                        handlePermissionChange(permission.name)
                                      }
                                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900/60 dark:text-blue-400 dark:focus:ring-blue-400"
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                      {permission.name}
                                    </div>
                                    {permission.description && (
                                      <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                        {permission.description}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="rounded px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium capitalize dark:bg-blue-900/40 dark:text-blue-100">
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
                          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-900/40">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() =>
                                  setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
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
                                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected permissions summary */}
                      {selectedPermissions.length > 0 && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/40 dark:bg-blue-900/20">
                          <h4 className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            Selected Permissions ({selectedPermissions.length})
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPermissions.map((permission, index) => (
                              <span
                                key={index}
                                className="rounded px-2 py-1 bg-blue-100 text-blue-800 text-xs dark:bg-blue-900/40 dark:text-blue-100"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="text-gray-400 text-lg mb-2 dark:text-slate-500">
                        :(
                      </div>
                      <div className="text-gray-500 dark:text-slate-300">
                        No permissions available
                      </div>
                      <button
                        onClick={refresh}
                        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                      >
                        Retry Loading
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700/60">
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
                        disabled={loading || selectedPermissions.length === 0}
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
