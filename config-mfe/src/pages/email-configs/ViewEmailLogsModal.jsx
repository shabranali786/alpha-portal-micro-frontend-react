// pages/email-configs/ViewEmailLogsModal.js

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

export default function ViewEmailLogsModal({ open, onClose, config }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    if (open && config?.id) {
      fetchLogs(currentPage, perPage);
    }
  }, [open, config, currentPage, perPage]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Reset after modal transition completes
      const timer = setTimeout(() => {
        setLogs([]);
        setCurrentPage(1);
        setTotalRows(0);
      }, 300); // Match transition duration

      return () => clearTimeout(timer);
    }
  }, [open]);

  const fetchLogs = async (page, limit) => {
    if (!config?.id) return;

    setLoading(true);
    try {
      const response = await apiAxios.get(
        ApiRequest.emailConfigs.logs(config.id),
        {
          params: {
            page,
            per_page: limit,
          },
        }
      );
      setLogs(response.data?.data || []);
      setTotalRows(response.data?.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy HH:mm:ss");
    } catch {
      return date;
    }
  };

  const parseMetadata = (metadataString) => {
    try {
      return JSON.parse(metadataString);
    } catch {
      return null;
    }
  };

  const columns = [
    // Column 1: ID + Occurred At
    {
      name: "ID / Time",
      sortable: true,
      width: "180px",
      cell: (row) => (
        <div>
          <div className="font-mono text-sm text-slate-900 dark:text-slate-100">
            #{row.id}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formatDateTime(row.occurred_at)}
          </div>
        </div>
      ),
    },

    // Column 2: Status
    // {
    //   name: "Status",
    //   sortable: true,
    //   width: "120px",
    //   cell: (row) => (
    //     <span
    //       className={`px-2 py-1 rounded-full text-xs font-medium ${
    //         row.status === "success"
    //           ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    //           : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    //       }`}
    //     >
    //       {row.status}
    //     </span>
    //   ),
    // },

    // Column 3: Provider
    {
      name: "Provider/Status",
      sortable: true,
      //   width: "120px",
      cell: (row) => (
        <>
          <div className=" flex flex-col gap-2 items-start">
            <span className="text-sm text-slate-700 dark:text-slate-300 uppercase font-mono">
              {row.provider}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.status === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {row.status}
            </span>
          </div>
        </>
      ),
    },

    // Column 4: Email Stats
    {
      name: "Email Stats",
      width: "280px",
      cell: (row) => {
        const metadata = parseMetadata(row.metadata);
        if (!metadata) {
          return (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              No data
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              New: {metadata.new_emails || 0}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              Total: {metadata.total_fetched || 0}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300">
              Existing: {metadata.existing_emails || 0}
            </span>
            {metadata.failed_emails > 0 && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Failed: {metadata.failed_emails}
              </span>
            )}
          </div>
        );
      },
    },

    // Column 5: Payload Ref
    {
      name: "Payload Ref",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <span
          className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate max-w-[180px] block"
          title={row.payload_ref}
        >
          {row.payload_ref}
        </span>
      ),
    },

    // Column 6: Error Message
    {
      name: "Error",
      grow: 1,
      cell: (row) => {
        if (!row.error_message) {
          return (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✓ No errors
            </span>
          );
        }
        return (
          <div
            className="text-xs text-red-600 dark:text-red-400 truncate max-w-[200px]"
            title={row.error_message}
          >
            {row.error_message}
          </div>
        );
      },
    },
  ];

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
              <DialogPanel className="transform transition-all w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Email Sync Logs
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Configuration: <strong>{config?.name}</strong> (
                    {config?.email_address})
                  </p>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-180px)] overflow-hidden">
                  <DataTable
                    className="tm-data-table"
                    columns={columns}
                    data={logs}
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
                    responsive
                    noDataComponent={
                      <div className="w-full py-12 text-center dark:bg-slate-800">
                        <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                          📊
                        </div>
                        <div className="text-gray-500 dark:text-slate-300">
                          No sync logs found
                        </div>
                        <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                          Logs will appear here after email synchronization
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* Footer */}
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
