import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

export default function ViewUserModal({ open, onClose, user }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      fetchUserDetails(user.id);
    }
  }, [open, user]);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(ApiRequest.users.show(userId));
      setUserDetails(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(user);
    } finally {
      setLoading(false);
    }
  };

  const displayUser = userDetails || user;

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
              <DialogPanel className="transform transition-all w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    User Details
                  </DialogTitle>
                  {loading && (
                    <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Loading details...
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg
                        className="animate-spin size-8 text-gray-400"
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
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Name
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUser?.name || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Email
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUser?.email || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Phone
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUser?.phone || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Status
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/60">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  displayUser?.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {displayUser?.status || "active"}
                              </span>
                            </div>
                          </div>

                          {/* Password Field */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Password
                            </label>
                            <div className="relative">
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-900 font-mono text-sm">
                                {showPassword
                                  ? displayUser?.display_password || "N/A"
                                  : "••••••••••••"}
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 dark:text-slate-400 hover:text-gray-900"
                              >
                                {showPassword ? (
                                  <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-yellow-600 mt-1">
                              🔐 This is the user's current password for
                              reference. Keep it secure!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Roles */}
                      {displayUser?.roles && displayUser.roles.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            Assigned Roles ({displayUser.roles.length})
                          </h3>
                          <div className="space-y-3">
                            {displayUser.roles.map((role, index) => (
                              <div
                                key={index}
                                className="p-4 border rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900  capitalize dark:text-slate-100 m-0">
                                      {role.name}
                                    </h4>
                                  </div>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    Role #{role.id}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Direct Permissions */}
                      {displayUser?.permissions &&
                      displayUser.permissions.length > 0 ? (
                        <div>
                          <h3 className="mb-4 text-lg	font-medium text-gray-900 dark:text-slate-100">
                            Direct Permissions ({displayUser.permissions.length}
                            )
                          </h3>
                          <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/60">
                            <div className="flex flex-wrap gap-2">
                              {displayUser.permissions.map(
                                (permission, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                  >
                                    {permission.name}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            Direct Permissions
                          </h3>
                          <div className="p-3 rounded-lg bg-gray-50 text-center text-gray-500 dark:text-slate-400 dark:bg-slate-800/60 dark:text-slate-400">
                            No direct permissions assigned. User gets
                            permissions through roles.
                          </div>
                        </div>
                      )}

                      {/* Teams (if available) */}
                      {displayUser?.teams && displayUser.teams.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            Teams
                          </h3>
                          <div className="p-3 rounded-lg bg-gray-50 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                            {displayUser.teams
                              .map((team) => team.title || team.name)
                              .join(", ")}
                          </div>
                        </div>
                      )}

                      {/* Account Information */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Account Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Email Verified
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/60">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  displayUser?.email_verified_at
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {displayUser?.email_verified_at
                                  ? "Verified"
                                  : "Not Verified"}
                              </span>
                              {displayUser?.email_verified_at && (
                                <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                  {new Date(
                                    displayUser.email_verified_at
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              User ID
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              #{displayUser?.id}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Timestamps
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Created At
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUser?.created_at
                                ? new Date(
                                    displayUser.created_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                              Updated At
                            </label>
                            <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUser?.updated_at
                                ? new Date(
                                    displayUser.updated_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={onClose}
                    >
                      Close
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
