import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  BsX,
  BsSearch,
  BsCheck2,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import toast from "react-hot-toast";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";

export default function AssignUsersModal({
  open,
  onClose,
  emailConfig,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [configDetails, setConfigDetails] = useState(null);

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
  } = usePaginatedData(ApiRequest.users.list);

  useEffect(() => {
    if (open && emailConfig?.id) {
      fetchConfigDetails();
    }
  }, [open, emailConfig]);

  const fetchConfigDetails = async () => {
    setLoadingConfig(true);
    try {
      const response = await apiAxios.get(
        ApiRequest.emailConfigs.show(emailConfig.id)
      );
      const details = response.data?.data || null;
      setConfigDetails(details);

      // Pre-select already assigned users
      if (details?.users && Array.isArray(details.users)) {
        setSelectedUsers(details.users.map((u) => u.id));
      }
    } catch (error) {
      console.error("Error fetching config details:", error);
      toast.error("Failed to load assigned users");
      // Fallback to emailConfig.users if API fails
      if (emailConfig.users && Array.isArray(emailConfig.users)) {
        setSelectedUsers(emailConfig.users.map((u) => u.id));
      }
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (!emailConfig) return;

    setSubmitting(true);
    try {
      const currentUserIds = configDetails?.users
        ? configDetails.users.map((u) => u.id)
        : [];

      // Find users to assign
      const usersToAssign = selectedUsers.filter(
        (id) => !currentUserIds.includes(id)
      );

      // Find users to unassign
      const usersToUnassign = currentUserIds.filter(
        (id) => !selectedUsers.includes(id)
      );

      // Assign new users
      if (usersToAssign.length > 0) {
        await apiAxios.post(
          ApiRequest.emailConfigs.assignUsers(emailConfig.id),
          {
            user_ids: usersToAssign,
          }
        );
      }

      // Unassign removed users
      if (usersToUnassign.length > 0) {
        await apiAxios.post(
          ApiRequest.emailConfigs.unassignUsers(emailConfig.id),
          {
            user_ids: usersToUnassign,
          }
        );
      }

      toast.success("Users assigned successfully!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error assigning users:", error);
      toast.error(error.response?.data?.message || "Failed to assign users");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    handleSearch("");
    onClose();
  };

  if (!emailConfig) return null;

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
              <DialogPanel className="transform transition-all w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      Assign Users
                    </DialogTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {emailConfig.name} ({emailConfig.email_address})
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    <BsX className="size-6" />
                  </button>
                </div>

                {/* Search Box */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700/60">
                  <div className="relative">
                    <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="form-control pl-10 pr-4 py-2"
                    />
                  </div>
                </div>

                {/* Users List */}
                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full size-8 border-b-2 border-primary"></div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      {searchTerm ? "No users found" : "No users available"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleToggleUser(user.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedUsers.includes(user.id)
                              ? "bg-primary/10 border-primary dark:bg-primary/20 dark:border-primary"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`size-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedUsers.includes(user.id)
                                ? "bg-primary border-primary"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {selectedUsers.includes(user.id) && (
                              <BsCheck2 className="size-4 text-white" />
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {user.name}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>

                          {/* Role Badge */}
                          {user.role && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {user.role}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalRows > perPage && (
                  <div className="px-6 py-3 border-t border-gray-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Showing {(currentPage - 1) * perPage + 1} to{" "}
                      {Math.min(currentPage * perPage, totalRows)} of{" "}
                      {totalRows} users
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <BsChevronLeft className="size-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage * perPage >= totalRows}
                        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <BsChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedUsers.length} user(s) selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="btn btn-black"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting || loading}
                      className="btn btn-primary min-w-[120px]"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full size-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
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
