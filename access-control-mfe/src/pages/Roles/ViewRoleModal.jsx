import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function ViewRoleModal({ open, onClose, role }) {
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
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Role Details: {role?.name}
                  </DialogTitle>
                </div>

                <div className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid gap-4">
                      <div>
                        <label>Role Name</label>
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/60 rounded-lg text-gray-900 dark:text-slate-100 font-medium">
                          {role?.name || "N/A"}
                        </div>
                      </div>

                      <div>
                        <label>Description</label>
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/60 rounded-lg text-gray-900 dark:text-slate-100">
                          {role?.description || "No description available"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label>Created At</label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/60 rounded-lg text-sm text-gray-600 dark:text-slate-400">
                            {role?.created_at
                              ? new Date(role.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        <div>
                          <label>Updated At</label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/60 rounded-lg text-sm text-gray-600 dark:text-slate-400">
                            {role?.updated_at
                              ? new Date(role.updated_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="border-t border-gray-200 dark:border-slate-700/60 pt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                        Permissions ({role?.permissions?.length || 0})
                      </label>

                      {role?.permissions && role.permissions.length > 0 ? (
                        <div className="border border-gray-200 dark:border-slate-700/60 rounded-lg">
                          <div className="max-h-64 overflow-y-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700/60 sticky top-0">
                                <tr>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                    Permission Name
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {role.permissions.map((permission, index) => (
                                  <tr
                                    key={index}
                                    className="border-b border-gray-100 dark:border-slate-800/60"
                                  >
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                                      {permission.name}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400">
                                      {permission.description ||
                                        "No description"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/60 rounded-lg text-center text-gray-500 dark:text-slate-400">
                          <div className="text-gray-400 dark:text-slate-500 text-lg mb-2">
                            🔐
                          </div>
                          <div>No permissions assigned to this role</div>
                        </div>
                      )}

                      {/* Permission Tags Summary */}
                      {role?.permissions && role.permissions.length > 0 && (
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
                            Permission Summary:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs"
                              >
                                {permission.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
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
