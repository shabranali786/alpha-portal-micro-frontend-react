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

export default function ViewUnitModal({ open, onClose, unit }) {
  const [unitDetails, setUnitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  // console.log(unit);

  useEffect(() => {
    if (open && unit?.id) {
      fetchUnitDetails(unit.id);
    }
  }, [open, unit]);

  const fetchUnitDetails = async (unitId) => {
    setLoading(true);
    try {
      const response = await apiAxios.get(ApiRequest.units.show(unitId));
      setUnitDetails(response.data);
    } catch (error) {
      console.error("Error fetching unit details:", error);
      setUnitDetails(unit);
    } finally {
      setLoading(false);
    }
  };

  const displayUnit = unitDetails || unit;

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
              <DialogPanel className="transform transition-all w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Unit Details
                  </DialogTitle>
                  {loading && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Loading details...
                    </div>
                  )}
                </div>

                <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-5">
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
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Unit ID
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              #{displayUnit?.id}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Title
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUnit?.title || "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Lifetime Limit
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  displayUnit?.lifetime_limit === "0"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                }`}
                              >
                                {displayUnit?.lifetime_limit === "0"
                                  ? "Unlimited"
                                  : displayUnit?.lifetime_limit}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Total Brands
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                              <span className="rounded px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200 bg-green-100">
                                {unit?.brands_count || 0} brands
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Associated Brands */}
                      {displayUnit?.brands &&
                        Array.isArray(displayUnit.brands) &&
                        displayUnit.brands.length > 0 && (
                          <div>
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                              Associated Brands ({displayUnit.brands.length})
                            </h3>
                            <div className="table-container">
                              <table className="table-base dark:divide-slate-700/60">
                                <thead className="table-head dark:bg-slate-900/60 dark:text-slate-300">
                                  <tr>
                                    <th className="table-header-cell dark:text-slate-300">
                                      ID
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Title
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Domain
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Email Setting
                                    </th>
                                    <th className="table-header-cell dark:text-slate-300">
                                      Created
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="table-body dark:divide-slate-700/60 dark:bg-slate-900/40">
                                  {displayUnit.brands.map((brand, index) => (
                                    <tr
                                      key={index}
                                      className="table-row-hover dark:hover:bg-slate-800/60"
                                    >
                                      <td className="table-cell font-mono text-gray-900 dark:text-slate-100">
                                        #{brand.id}
                                      </td>
                                      <td className="table-cell font-medium text-gray-900 dark:text-slate-100">
                                        {brand.title}
                                      </td>
                                      <td className="table-cell text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                                        <a
                                          href={brand.domain}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block max-w-xs truncate underline"
                                        >
                                          {brand.domain}
                                        </a>
                                      </td>
                                      <td className="table-cell">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            brand.send_lead_to_email === "allow"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                          }`}
                                        >
                                          {brand.send_lead_to_email}
                                        </span>
                                      </td>
                                      <td className="table-cell text-gray-500 dark:text-slate-400">
                                        {new Date(
                                          brand.created_at
                                        ).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      {/* No Brands Message */}
                      {(!displayUnit?.brands ||
                        !Array.isArray(displayUnit.brands) ||
                        displayUnit.brands.length === 0) && (
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                            Associated Brands
                          </h3>
                          <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-slate-800/60">
                            <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                              🏢
                            </div>
                            <div className="text-gray-500 dark:text-slate-300">
                              No brands associated
                            </div>
                            <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                              This unit doesn't have any brands yet
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
                          Timestamps
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Created At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUnit?.created_at
                                ? new Date(
                                    displayUnit.created_at
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                              Updated At
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-slate-800/60 dark:text-slate-100">
                              {displayUnit?.updated_at
                                ? new Date(
                                    displayUnit.updated_at
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
