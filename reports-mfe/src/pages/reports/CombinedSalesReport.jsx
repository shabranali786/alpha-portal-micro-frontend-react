import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  BsArrowRepeat,
  BsDownload,
  BsCashStack,
  BsWallet2,
  BsReceiptCutoff,
  BsFileEarmarkText,
} from "react-icons/bs";
import ApiRequest from "../../api/ApiRequest";
import apiAxios from "../../api/ApiAxios";

const CombinedSalesReport = () => {
  // Get default date range (last 30 days)
  const getDefaultDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      from: thirtyDaysAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const defaultDates = getDefaultDateRange();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [dateRange, setDateRange] = useState(defaultDates);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [filters, setFilters] = useState({
    record_type: "",
    lead_email: "",
    unit_id: "",
    brand_id: "",
    team_id: "",
    merchant_id: "",
    source: "",
    status: "",
    category: "",
  });

  // Fetch data
  const fetchData = useCallback(
    async (page = 1, limit = 15) => {
      if (!dateRange.from || !dateRange.to) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = {
          date_from: dateRange.from,
          date_to: dateRange.to,
          per_page: limit,
          page: page,
        };

        // Add filters
        if (filters.record_type) params.record_type = filters.record_type;
        if (filters.lead_email) params.lead_email = filters.lead_email;
        if (filters.unit_id) params.unit_id = filters.unit_id;
        if (filters.brand_id) params.brand_id = filters.brand_id;
        if (filters.team_id) params.team_id = filters.team_id;
        if (filters.merchant_id) params.merchant_id = filters.merchant_id;
        if (filters.source) params.source = filters.source;
        if (filters.status) params.status = filters.status;
        if (filters.category) params.category = filters.category;

        console.log("Fetching data with params:", params);
        console.log("API Endpoint:", ApiRequest.combinedSalesReports.index);

        const response = await apiAxios.get(
          ApiRequest.combinedSalesReports.index,
          { params }
        );

        console.log("API Response:", response.data);

        if (response.data?.data) {
          setReportData(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          toast.error("Invalid response format");
          setReportData(null);
        }
      } catch (error) {
        console.error("Error fetching combined sales report:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch combined sales report"
        );
        setReportData(null);
      } finally {
        setLoading(false);
      }
    },
    [dateRange, filters]
  );

  // Initial fetch when component mounts
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [fetchData, currentPage, perPage]);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date only (no time)
  const formatDateOnly = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    const num = Number(amount || 0);
    return `$${numberFormatter.format(Math.abs(num))}`;
  };

  // Table rows - use data directly from API (no client-side filtering for pagination compatibility)
  const rows = useMemo(() => {
    if (!reportData?.data) return [];
    return reportData.data.map((item, index) => ({
      id: item.id || index,
      recordId: item.record_id,
      type: item.type || "",
      source: item.source || "",
      leadName: item.lead_name || "—",
      leadEmail: item.lead_email || "—",
      leadPhone: item.lead_phone || "—",
      amount: Number(item.amount || 0),
      date: item.date || "",
      status: item.status || "—",
      paymentDate: item.payment_date || "",
      responseDate: item.response_date || "",
      revertedDate: item.reverted_date || "",
      cardDigits: item.card_digits || "—",
      category: item.category || "—",
      description: item.description || "—",
      brand: item.brand,
      team: item.team,
      unit: item.unit,
      merchant: item.merchant,
      createdBy: item.created_by,
      saleOrigin: item.sale_origin || "",
      serial: (currentPage - 1) * perPage + index + 1,
    }));
  }, [reportData, currentPage, perPage]);

  // Totals from API response
  const totals = reportData?.totals || {};
  const meta = reportData?.meta || {};

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: "serial",
        name: "S.No",
        center: true,
        sortable: false,
        width: "60px",
        cell: (row) => (
          <span className="text-xs text-gray-600 dark:text-slate-400">
            {row.serial}
          </span>
        ),
      },
      {
        id: "type",
        name: "Type",
        sortable: true,
        selector: (row) => row.type,
        width: "100px",
        cell: (row) => {
          const typeColors = {
            sale: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            chargeback:
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            expense:
              "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
          };
          return (
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                typeColors[row.type] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200"
              }`}
            >
              {row.type}
            </span>
          );
        },
      },
      {
        id: "date",
        name: "Date",
        sortable: true,
        selector: (row) => row.date,
        width: "140px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {formatDateOnly(row.date)}
          </span>
        ),
      },
      {
        id: "leadName",
        name: "Lead Name",
        sortable: true,
        selector: (row) => row.leadName,
        minWidth: "150px",
        cell: (row) => (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-900 dark:text-slate-100">
              {row.leadName}
            </span>
            {row.leadEmail !== "—" && (
              <span className="text-xs text-gray-500 dark:text-slate-400">
                {row.leadEmail}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "brand",
        name: "Brand",
        sortable: true,
        selector: (row) => row.brand?.title || "",
        minWidth: "150px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {row.brand?.title || "—"}
          </span>
        ),
      },
      {
        id: "unit",
        name: "Unit",
        sortable: true,
        selector: (row) => row.unit?.title || "",
        width: "120px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {row.unit?.title || "—"}
          </span>
        ),
      },
      {
        id: "team",
        name: "Team",
        sortable: true,
        selector: (row) => row.team?.title || "",
        minWidth: "150px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {row.team?.title || "—"}
          </span>
        ),
      },
      {
        id: "merchant",
        name: "Merchant",
        sortable: true,
        selector: (row) => row.merchant?.title || "",
        minWidth: "150px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {row.merchant?.title || "—"}
          </span>
        ),
      },
      {
        id: "amount",
        name: "Amount",
        right: true,
        sortable: true,
        selector: (row) => row.amount,
        width: "120px",
        cell: (row) => (
          <div className="text-right">
            <span
              className={`text-xs font-semibold ${
                row.amount >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatAmount(row.amount)}
            </span>
          </div>
        ),
      },
      {
        id: "source",
        name: "Source",
        sortable: true,
        selector: (row) => row.source,
        width: "100px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100 capitalize">
            {row.source || "—"}
          </span>
        ),
      },
      {
        id: "status",
        name: "Status",
        sortable: true,
        selector: (row) => row.status,
        width: "100px",
        cell: (row) => {
          if (row.status === "—") return <span className="text-xs">—</span>;
          const statusColors = {
            paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            pending:
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            won: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            reverted:
              "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
          };
          return (
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                statusColors[row.status] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200"
              }`}
            >
              {row.status}
            </span>
          );
        },
      },
      {
        id: "category",
        name: "Category",
        sortable: true,
        selector: (row) => row.category,
        width: "120px",
        cell: (row) => (
          <span className="text-xs text-gray-900 dark:text-slate-100">
            {row.category !== "—" ? row.category : "—"}
          </span>
        ),
      },
    ],
    [currentPage, perPage]
  );

  const handleDateChange = (key) => (event) => {
    const { value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterChange = (key) => (event) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select both from and to dates");
      return;
    }
    if (dateRange.from > dateRange.to) {
      toast.error("From date cannot be after To date");
      return;
    }
    setIsReloading(true);
    setCurrentPage(1);
    try {
      await fetchData(1, perPage);
      toast.success("Filters applied");
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setIsReloading(false);
    }
  };

  const handleReset = async () => {
    const defaultDates = getDefaultDateRange();
    setDateRange(defaultDates);
    setFilters({
      record_type: "",
      lead_email: "",
      unit_id: "",
      brand_id: "",
      team_id: "",
      merchant_id: "",
      source: "",
      status: "",
      category: "",
    });
    setCurrentPage(1);
    setIsReloading(true);
    try {
      await fetchData(1, perPage);
      toast.success("Filters reset");
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setIsReloading(false);
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await fetchData(currentPage, perPage);
      toast.success("Report refreshed");
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setIsReloading(false);
    }
  };

  const handleExport = () => {
    toast.success("Export functionality coming soon");
  };

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary/60 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Loading combined sales report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Combined Sales Report</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            View sales, chargebacks, and expenses in one unified report
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/60"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-70 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300"
          >
            <BsArrowRepeat
              size={16}
              className={isReloading ? "animate-spin" : ""}
            />
            {isReloading ? "Reloading..." : "Reload"}
          </button>
          {/* <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <BsDownload size={16} />
            CSV
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Filters
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={handleDateChange("from")}
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={handleDateChange("to")}
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Record Type
            </label>
            <select
              value={filters.record_type}
              onChange={handleFilterChange("record_type")}
              className="form-control"
            >
              <option value="">All</option>
              <option value="sales">Sales</option>
              <option value="chargebacks">Chargebacks</option>
              <option value="expenses">Expenses</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Source
            </label>
            <select
              value={filters.source}
              onChange={handleFilterChange("source")}
              className="form-control"
            >
              <option value="">All</option>
              <option value="invoice">Invoice</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={filters.status}
              onChange={handleFilterChange("status")}
              className="form-control"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="reverted">Reverted</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Lead Email
            </label>
            <input
              type="text"
              value={filters.lead_email}
              onChange={handleFilterChange("lead_email")}
              placeholder="Enter email"
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Unit ID
            </label>
            <input
              type="number"
              value={filters.unit_id}
              onChange={handleFilterChange("unit_id")}
              placeholder="Enter unit ID"
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Brand ID
            </label>
            <input
              type="number"
              value={filters.brand_id}
              onChange={handleFilterChange("brand_id")}
              placeholder="Enter brand ID"
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Team ID
            </label>
            <input
              type="number"
              value={filters.team_id}
              onChange={handleFilterChange("team_id")}
              placeholder="Enter team ID"
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Merchant ID
            </label>
            <input
              type="number"
              value={filters.merchant_id}
              onChange={handleFilterChange("merchant_id")}
              placeholder="Enter merchant ID"
              className="form-control"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Category
            </label>
            <input
              type="text"
              value={filters.category}
              onChange={handleFilterChange("category")}
              placeholder="Enter category"
              className="form-control"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyFilters}
              disabled={isReloading}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Sales Amount
              </p>
              <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {formatAmount(totals.total_sales_amount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {totals.sales_count || 0} sales
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20">
              <BsCashStack className="text-emerald-500 dark:text-emerald-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Chargebacks
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {formatAmount(totals.total_chargeback_amount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {totals.chargeback_count || 0} chargebacks
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/15 dark:bg-red-500/20">
              <BsWallet2 className="text-red-500 dark:text-red-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Expenses
              </p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {formatAmount(totals.total_expense_amount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {totals.expense_count || 0} expenses
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/15 dark:bg-orange-500/20">
              <BsReceiptCutoff className="text-orange-500 dark:text-orange-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Net Amount
              </p>
              <p
                className={`text-2xl font-semibold ${
                  Number(totals.net_amount || 0) >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatAmount(totals.net_amount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {totals.total_records || 0} total records
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20">
              <BsFileEarmarkText className="text-blue-500 dark:text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={rows}
          progressPending={loading}
          progressComponent={
            <div className="py-10 text-center text-sm text-gray-500 dark:text-slate-400">
              Fetching combined sales data&hellip;
            </div>
          }
          pagination
          paginationServer
          paginationPerPage={perPage}
          paginationTotalRows={meta.total || 0}
          paginationDefaultPage={currentPage}
          paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
          onChangeRowsPerPage={(rowsPerPage) => {
            setPerPage(rowsPerPage);
            setCurrentPage(1);
          }}
          onChangePage={(page) => {
            setCurrentPage(page);
          }}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center text-sm text-gray-500 dark:text-slate-400 dark:bg-slate-800">
              No data available for the selected filters.
            </div>
          }
        />
      </div>

      {dateRange.from && dateRange.to && (
        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Showing data from {formatDateOnly(dateRange.from)} to{" "}
          {formatDateOnly(dateRange.to)}. Adjust the filters above and click
          "Apply Filters" to refresh the report.
        </p>
      )}
    </>
  );
};

export default CombinedSalesReport;
