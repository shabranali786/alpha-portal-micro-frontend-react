import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function ViewPackageModal({
  open,
  onClose,
  package: packageData,
  brandName,
}) {
  if (!packageData) {
    return null;
  }

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
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 shadow-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                        {packageData.name}
                      </DialogTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <span>Brand: {brandName}</span>
                        <span>•</span>
                        <span>ID: #{packageData.id}</span>
                        {packageData.badge && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                              {packageData.badge}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-6">
                        {/* Package Details */}
                        <div className="bg-gray-50 dark:bg-slate-900/40 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Package Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-300">
                                Type:
                              </span>
                              <span className="font-medium capitalize dark:text-slate-300">
                                {packageData.type?.replace("-", " ") || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-300">
                                Price:
                              </span>
                              <span className="text-xl font-bold text-green-600 dark:text-emerald-300">
                                ${packageData.price || "0"}
                              </span>
                            </div>
                            {packageData.discounted_price && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-slate-300">
                                  Discounted Price:
                                </span>
                                <span className="text-lg text-red-600 dark:text-red-300 line-through">
                                  ${packageData.discounted_price}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-300">
                                Sort Order:
                              </span>
                              <span className="font-medium dark:text-slate-300">
                                {packageData.sort || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-300">
                                Rush Filing:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  packageData.rush_filing_enabled
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 dark:bg-slate-800/70 text-gray-800 dark:text-slate-200"
                                }`}
                              >
                                {packageData.rush_filing_enabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </div>
                            {packageData.rush_filing_enabled &&
                              packageData.rush_filing_id && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-slate-300">
                                    Rush Filing ID:
                                  </span>
                                  <span className="font-medium">
                                    {packageData.rush_filing_id}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Description */}
                        {packageData.description && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                              Description
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-400 p-4 rounded">
                              <p className="text-gray-700 dark:text-slate-200">
                                {packageData.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Before Content */}
                        {packageData.beforeContent && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                              Before Content
                            </h3>
                            <div className="bg-green-50 dark:bg-emerald-500/10 border-l-4 border-green-400 dark:border-emerald-500/40 p-4 rounded">
                              <p className="text-gray-700 dark:text-slate-200">
                                {packageData.beforeContent}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Timestamps */}
                        <div className="bg-gray-50 dark:bg-slate-900/40 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Timeline
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-slate-300">
                                Created:
                              </span>
                              <span className="font-medium dark:text-slate-300">
                                {packageData.created_at ? new Date(
                                  packageData.created_at
                                ).toLocaleString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-slate-300">
                                Last Updated:
                              </span>
                              <span className="font-medium dark:text-slate-300">
                                {packageData.updated_at ? new Date(
                                  packageData.updated_at
                                ).toLocaleString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Features */}
                      <div className="space-y-6">
                        {/* Features List */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                            Package Features
                            {packageData.features &&
                              Array.isArray(packageData.features) && (
                                <span className="ml-2 text-sm font-normal text-gray-600 dark:text-slate-300">
                                  ({packageData.features.length} items)
                                </span>
                              )}
                          </h3>

                          {packageData.features &&
                          Array.isArray(packageData.features) &&
                          packageData.features.length > 0 ? (
                            <div className="space-y-2">
                              {packageData.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/60 rounded-lg"
                                >
                                  <div className="size-6 bg-green-100 dark:bg-emerald-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      className="size-4 text-green-600 dark:text-emerald-300"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-gray-800 dark:text-slate-200 text-sm leading-relaxed">
                                      {feature}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-slate-900/40 rounded-lg">
                              <svg
                                className="size-12 text-gray-400 dark:text-slate-500 mx-auto mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <p className="text-gray-600 dark:text-slate-300">
                                No features defined for this package
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Technical Details */}
                        {(packageData.package_type_id ||
                          packageData.package_category_id ||
                          packageData.category) && (
                          <div className="bg-gray-50 dark:bg-slate-900/40 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                              Technical Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              {packageData.package_type_id && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-slate-300">
                                    Package Type ID:
                                  </span>
                                  <span className="font-medium">
                                    {packageData.package_type_id}
                                  </span>
                                </div>
                              )}
                              {packageData.package_category_id && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-slate-300">
                                    Category ID:
                                  </span>
                                  <span className="font-medium">
                                    {packageData.package_category_id}
                                  </span>
                                </div>
                              )}
                              {packageData.category && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-slate-300">
                                    Category:
                                  </span>
                                  <span className="font-medium">
                                    {packageData.category}
                                  </span>
                                </div>
                              )}
                              {packageData.pivot && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700/60">
                                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                                    Pivot Information
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-slate-300">
                                      Brand ID:
                                    </span>
                                    <span className="font-medium">
                                      {packageData.pivot.brand_id}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-slate-300">
                                      Package ID:
                                    </span>
                                    <span className="font-medium">
                                      {packageData.pivot.package_id}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <div className="flex items-center justify-end">
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
