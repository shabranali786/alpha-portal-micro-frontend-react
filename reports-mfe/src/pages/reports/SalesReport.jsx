import React, { Fragment, useMemo, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { BsFilter, BsArrowRepeat } from "react-icons/bs";
import { SearchBox } from "@crm/shared/components/SearchBox";
import { FiltersComponent } from "@crm/shared/components/AllComponents";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";

const SalesReport = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    data: salesData,
    loading,
    totalRows,
    currentPage,
    perPage,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    fetchData,
  } = usePaginatedData(ApiRequest.salesReports.list);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const CSV_HEADERS = [
    "record_id",
    "source",
    "lead_email",
    "transaction_amount",
    "unit",
    "brand",
    "team",
    "merchant",
    "created_by",
    "created_at",
    "paid_at",
  ];

  const hasActiveFilters =
    selectedBrand ||
    selectedUnit ||
    selectedMerchant ||
    selectedPaymentStatus ||
    leadEmail.trim() ||
    fromDate ||
    toDate;

  const activeFilterCount = [
    selectedBrand,
    selectedUnit,
    selectedMerchant,
    selectedPaymentStatus,
    leadEmail.trim() && leadEmail,
    fromDate,
    toDate,
  ].filter(Boolean).length;

  const buildQueryFromFilters = useCallback(() => {
    const query = {};

    if (leadEmail.trim()) query.lead_email = leadEmail.trim();
    if (fromDate) query.from_date = fromDate;
    if (toDate) query.to_date = toDate;
    if (selectedBrand?.value) query.brand_id = selectedBrand.value;
    if (selectedUnit?.value) query.unit_id = selectedUnit.value;
    if (selectedMerchant?.value) query.merchant_id = selectedMerchant.value;
    if (selectedPaymentStatus?.value)
      query.payment_status = selectedPaymentStatus.value;

    return query;
  }, [
    leadEmail,
    fromDate,
    toDate,
    selectedBrand,
    selectedUnit,
    selectedMerchant,
    selectedPaymentStatus,
  ]);

  const handleFilterChange = useCallback((filterType, selectedOption) => {
    const filterSetters = {
      brand: setSelectedBrand,
      unit: setSelectedUnit,
      merchant: setSelectedMerchant,
      paymentStatus: setSelectedPaymentStatus,
      leadEmail: setLeadEmail,
      fromDate: setFromDate,
      toDate: setToDate,
    };

    filterSetters[filterType]?.(selectedOption);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedBrand(null);
    setSelectedUnit(null);
    setSelectedMerchant(null);
    setSelectedPaymentStatus(null);
    setLeadEmail("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    fetchData({ page: 1, query: {}, force: true });
  }, [setCurrentPage, fetchData]);

  const handleApplyFilters = useCallback(() => {
    const query = buildQueryFromFilters();
    setActiveModal(null);
    setCurrentPage(1);
    fetchData({ page: 1, query, force: true });
  }, [buildQueryFromFilters, setCurrentPage, fetchData]);

  const handleRefresh = useCallback(async () => {
    try {
      const query = buildQueryFromFilters();
      await fetchData({
        page: currentPage,
        limit: perPage,
        query,
        force: true,
      });
      toast.success("Sales data refreshed");
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast.error("Failed to refresh data");
    }
  }, [buildQueryFromFilters, fetchData, currentPage, perPage]);

  const handleExport = useCallback(async () => {
    setExporting(true);

    try {
      const query = buildQueryFromFilters();

      const result = await fetchData({
        page: 1,
        limit: 20000,
        query,
        force: true,
      });

      const exportData = result?.items || [];

      if (!exportData.length) {
        toast.error("No sales records to export");
        return;
      }

      const mapRowToCSV = (record) => {
        return {
          record_id: record.record_id || "",
          source: record.source || "",
          lead_email: record.lead_email || "",
          transaction_amount: record.transaction_amount || "",
          unit: record.unit?.title || "",
          brand: record.brand?.title || "",
          team: record.team?.title || "",
          merchant: record.merchant?.title || "",
          created_by: record.created_by || "-",
          created_at: record.created_at,
          paid_at: record.paid_at,
        };
      };

      const csvContent = [
        CSV_HEADERS.join(","),
        ...exportData.map((record) => {
          const flatData = mapRowToCSV(record);
          return CSV_HEADERS.map((header) => escapeCSV(flatData[header])).join(
            ","
          );
        }),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const filename =
        fromDate && toDate
          ? `sales-reports-${fromDate}-to-${toDate}.csv`
          : `sales-reports-${new Date().toISOString().slice(0, 10)}.csv`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${exportData.length} records exported successfully`);

      await fetchData({
        page: currentPage,
        limit: perPage,
        query,
        force: true,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(error.message || "Failed to export sales reports");
    } finally {
      setExporting(false);
    }
  }, [
    buildQueryFromFilters,
    fetchData,
    currentPage,
    perPage,
    fromDate,
    toDate,
  ]);

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        width: "70px",
        center: true,
        cell: (_row, index) => (
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {(currentPage - 1) * perPage + index + 1}
          </span>
        ),
      },
      {
        name: "Lead",
        selector: (row) => row.lead_name || "—",
        sortable: true,
        minWidth: "220px",
        cell: (row) => (
          <div>
            <span className="font-medium mb-1 block text-gray-900 dark:text-slate-100">
              {row.lead_name || "—"}
            </span>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              {row.lead_email || "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              {row.lead_phone || "—"}
            </div>
          </div>
        ),
      },
      {
        name: "Unit / Brand",
        selector: (row) => row.brand?.title || "—",
        sortable: true,
        minWidth: "220px",
        cell: (row) => (
          <div>
            <span className="font-medium mb-1 block text-gray-900 dark:text-slate-100">
              {row.brand?.title || "—"}
            </span>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Unit: {row.unit?.title || "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Team: {row.team?.title || "—"}
            </div>
          </div>
        ),
      },
      {
        name: "Merchant",
        selector: (row) => row.merchant?.title || "—",
        sortable: true,
        minWidth: "220px",
        cell: (row) => (
          <div>
            <span className="font-medium mb-1 block text-gray-900 dark:text-slate-100">
              {row.merchant?.title || "—"}
            </span>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Key: {row.merchant?.merchant_key?.toUpperCase() || "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Currency: {row.merchant?.currency?.toUpperCase() || "—"}
            </div>
          </div>
        ),
      },
      {
        name: "Amount/Source",
        selector: (row) => row.transaction_amount,
        sortable: true,
        right: true,
        minWidth: "160px",
        cell: (row) => {
          const amount = row.transaction_amount;
          const symbol =
            row.merchant?.currency_symbol ||
            row.merchant?.currency?.toUpperCase() ||
            "$";

          return (
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-1">
                {`${symbol} ${amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}{" "}
                /
                <span className="inline-block rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700/40 dark:text-slate-200">
                  {row.source || "—"}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400">
                Paid: {formatDate(row.paid_at)}
              </div>
            </div>
          );
        },
      },
      {
        name: "Created By",
        selector: (row) => row.created_by?.name || "—",
        sortable: true,
        minWidth: "180px",
        cell: (row) => (
          <div>
            <span className="font-medium mb-1 block text-gray-900 dark:text-slate-100">
              {row.created_by?.name || "—"}
            </span>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Logged: {formatDate(row.created_at)}
            </div>
          </div>
        ),
      },
    ],
    [currentPage, perPage]
  );

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Report</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Live sales activity with filters and export tools ({totalRows}{" "}
            total)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search records, merchants, leads"
            icon="find"
            className="w-full sm:w-72"
          />

          <div className="flex gap-3">
            <button
              type="button"
              className={`relative btn ${
                hasActiveFilters ? "btn-primary" : "btn-black"
              }`}
              onClick={() => setActiveModal("filters")}
            >
              <BsFilter size={20} />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="btn btn-black"
              onClick={handleRefresh}
              disabled={loading}
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

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExport}
              disabled={exporting || loading}
            >
              {exporting ? (
                <>
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
                  Exporting...
                </>
              ) : (
                "Export CSV"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 dark:bg-blue-950/30 dark:border-blue-800/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-blue-800 font-medium dark:text-blue-200">
                Active Filters:
              </span>
              {selectedBrand && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Brand: {selectedBrand.label}
                </span>
              )}
              {selectedUnit && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Unit: {selectedUnit.label}
                </span>
              )}
              {selectedMerchant && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Merchant: {selectedMerchant.label}
                </span>
              )}
              {selectedPaymentStatus && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Status: {selectedPaymentStatus.label}
                </span>
              )}
              {leadEmail.trim() && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Lead Email: {leadEmail.trim()}
                </span>
              )}
              {fromDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  From: {fromDate}
                </span>
              )}
              {toDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  To: {toDate}
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-300 dark:hover:text-blue-200"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card overflow-auto p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={salesData}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          paginationDefaultPage={currentPage}
          paginationRowsPerPageOptions={[15, 25, 50, 100]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="text-center py-12 dark:bg-slate-900 w-full dark:bg-slate-800">
              <div className="text-gray-400 text-lg mb-2 dark:text-slate-500">
                📊
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No sales records found
              </div>
              <div className="text-sm text-gray-400 mt-1 dark:text-slate-500">
                Try adjusting your search terms or filters
              </div>
            </div>
          }
        />
      </div>

      {/* Filter Sidebar */}
      <Transition show={activeModal === "filters"} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setActiveModal(null)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll border border-transparent bg-white py-6 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                            Filter Options
                          </h2>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                              onClick={() => setActiveModal(null)}
                            >
                              <span className="sr-only">Close panel</span>
                              <svg
                                className="size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <FiltersComponent
                          selectedBrand={selectedBrand}
                          selectedUnit={selectedUnit}
                          selectedMerchant={selectedMerchant}
                          selectedPaymentStatus={null}
                          leadEmail={leadEmail}
                          fromDate={fromDate}
                          toDate={toDate}
                          onFilterChange={handleFilterChange}
                          showPaymentStatus={false}
                          showMerchants={true}
                          showLeadEmail={true}
                          showDateRange={true}
                        />

                        <div className="mt-5 flex justify-between gap-3">
                          <button
                            onClick={handleResetFilters}
                            className="btn btn-black"
                          >
                            Reset
                          </button>
                          <button
                            onClick={handleApplyFilters}
                            className="btn btn-primary"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SalesReport;
