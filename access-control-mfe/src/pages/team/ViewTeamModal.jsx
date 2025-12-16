import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function ViewTeamModal({ open, onClose, team }) {
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
              <DialogPanel className="transform transition-all w-full max-w-3xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Team Details: {team?.title}
                  </DialogTitle>
                </div>

                <div className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid gap-4">
                      <div className="row [&>div]:!space-x-1">
                        <div className="w-full md:w-8/12">
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Team Title
                          </label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 font-medium dark:text-slate-100">
                            {team?.title || "N/A"}
                          </div>
                        </div>

                        <div className="w-full md:w-4/12">
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Unit
                          </label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full text-xs font-medium">
                              {team?.unit?.title || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Description
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-gray-900 dark:text-slate-100">
                          {team?.description || "No description available"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Created At
                          </label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-sm text-gray-600 dark:text-slate-400">
                            {team?.created_at
                              ? new Date(team.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Updated At
                          </label>
                          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-sm text-gray-600 dark:text-slate-400">
                            {team?.updated_at
                              ? new Date(team.updated_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Team Members */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                          Team Members ({team?.user?.length || 0})
                        </label>
                        {team?.user && team.user.length > 0 ? (
                          <div className="border border-gray-200 dark:border-slate-700/60 rounded-lg overflow-hidden">
                            <div className="max-h-64 overflow-y-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/60 sticky top-0">
                                  <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                      Name
                                    </th>

                                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {team.user.map((user, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-gray-100 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/80 dark:bg-slate-800/60"
                                    >
                                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                                        {user.name}
                                        <span className=" block text-sm text-gray-600 dark:text-slate-400">
                                          {" "}
                                          {user.email}
                                        </span>
                                      </td>

                                      <td className="py-3 px-4">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status === "active"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                          }`}
                                        >
                                          {user.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-center text-gray-500 dark:text-slate-300">
                            No team members assigned
                          </div>
                        )}
                      </div>

                      {/* Team Brands */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                          Assigned Brands ({team?.team_brands?.length || 0})
                        </label>
                        {team?.team_brands && team.team_brands.length > 0 ? (
                          <div className="border border-gray-200 dark:border-slate-700/60 rounded-lg overflow-hidden">
                            <div className="max-h-64 overflow-y-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/60 sticky top-0">
                                  <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                      Brand
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {team.team_brands.map((brand, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-gray-100 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/80 dark:bg-slate-800/60"
                                    >
                                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                                        {brand.title}
                                        <a
                                          href={brand.domain}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:underline text-sm text-blue-600 dark:text-blue-300 block"
                                        >
                                          {brand.domain}
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gray-50 dark:bg-slate-800/60 rounded-lg text-center text-gray-500 dark:text-slate-300">
                            No brands assigned
                          </div>
                        )}
                      </div>
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
