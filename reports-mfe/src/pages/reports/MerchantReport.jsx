import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  BsArrowRepeat,
  BsCashStack,
  BsDownload,
  BsFillPeopleFill,
  BsWallet2,
} from "react-icons/bs";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import apiAxios from "@crm/shared/api/ApiAxios";

const MerchantReport = () => {
  const today = new Date().toISOString().split("T")[0];
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [filterDate, setFilterDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  const fetchData = useCallback(async (date) => {
    if (!date) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching data for date:", date);
      console.log("API Endpoint:", ApiRequest.merchantReports.index);

      const response = await apiAxios.get(ApiRequest.merchantReports.index, {
        params: {
          filter_date: date,
        },
      });

      console.log("API Response:", response.data);

      if (response.data?.status && response.data?.data) {
        setReportData(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Invalid response format");
        setReportData(null);
      }
    } catch (error) {
      console.error("Error fetching merchant report:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(
        error.response?.data?.message || "Failed to fetch merchant report"
      );
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when component mounts
  useEffect(() => {
    if (filterDate) {
      fetchData(filterDate);
    }
  }, [filterDate, fetchData]);

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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter merchants based on search
  const filteredMerchants = useMemo(() => {
    if (!reportData?.data) return [];
    const merchants = reportData.data.filter((merchant) => {
      if (!searchTerm.trim()) return true;
      const merchantName = merchant?.title || "";
      return merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return merchants;
  }, [reportData, searchTerm]);

  // Table rows
  const rows = useMemo(() => {
    return filteredMerchants.map((item, index) => ({
      id: item.id || index,
      merchantId: Number(item.id || 0),
      merchantName: item.title || "Merchant",
      currencySymbol: item.currency_symbol || "$",
      totalSalesMtd: Number(item.total_sales_mtd || 0),
      totalChargebacksMtd: Number(item.total_chargebacks_mtd || 0),
      totalChargebacksReverted: Number(item.total_chargebacks_reverted || 0),
      netChargebacks: Number(item.net_chargebacks || 0),
      monthlyLimit: item.monthly_limit,
      limitLeft: item.limit_left,
      limitUsedPercentage: item.limit_used_percentage,
      status: item.status || "unlimited",
      serial: index + 1,
    }));
  }, [filteredMerchants]);

  // Totals from API response (no calculations)
  const totals = reportData?.totals || {};

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
        id: "merchant",
        name: "Merchant Name",
        sortable: true,
        selector: (row) => row.merchantName,
        minWidth: "180px",
        cell: (row) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {row.merchantName}
            </span>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              ID: {row.merchantId}
            </span>
          </div>
        ),
      },
      {
        id: "totalSalesMtd",
        name: "Total Sales MTD",
        right: true,
        sortable: true,
        selector: (row) => row.totalSalesMtd,
        width: "120px",
        cell: (row) => (
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-900 dark:text-slate-100">
              {`${row.currencySymbol}${numberFormatter.format(
                row.totalSalesMtd
              )}`}
            </span>
          </div>
        ),
      },
      {
        id: "monthlyLimit",
        name: "Monthly Limit",
        right: true,
        sortable: true,
        selector: (row) => row.monthlyLimit,
        width: "110px",
        cell: (row) => (
          <div className="text-right">
            <span className="text-xs font-medium text-gray-900 dark:text-slate-100">
              {row.monthlyLimit
                ? `${row.currencySymbol}${numberFormatter.format(
                    Number(row.monthlyLimit)
                  )}`
                : "Unlimited"}
            </span>
          </div>
        ),
      },
      {
        id: "limitLeft",
        name: "Limit Left",
        right: true,
        sortable: true,
        selector: (row) => row.limitLeft,
        width: "100px",
        cell: (row) => (
          <div className="text-right">
            <span className="text-xs font-medium text-gray-900 dark:text-slate-100">
              {row.limitLeft !== null
                ? `${row.currencySymbol}${numberFormatter.format(
                    Number(row.limitLeft)
                  )}`
                : "—"}
            </span>
          </div>
        ),
      },
      {
        id: "limitUsedPercentage",
        name: "Limit Used %",
        right: true,
        sortable: true,
        selector: (row) => row.limitUsedPercentage,
        width: "100px",
        cell: (row) => (
          <div className="text-right">
            <span className="text-xs font-medium text-gray-900 dark:text-slate-100">
              {row.limitUsedPercentage !== null
                ? `${Number(row.limitUsedPercentage || 0).toFixed(1)}%`
                : "—"}
            </span>
          </div>
        ),
      },
      {
        id: "totalChargebacksMtd",
        name: "Total Chargebacks MTD",
        right: true,
        sortable: true,
        selector: (row) => row.totalChargebacksMtd,
        width: "140px",
        cell: (row) => (
          <div className="text-right">
            <span
              className={`text-xs font-medium ${
                row.totalChargebacksMtd >= 0
                  ? "text-gray-900 dark:text-slate-100"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {`${row.currencySymbol}${numberFormatter.format(
                row.totalChargebacksMtd
              )}`}
            </span>
          </div>
        ),
      },
      {
        id: "totalChargebacksReverted",
        name: "Chargebacks Reverted",
        right: true,
        sortable: true,
        selector: (row) => row.totalChargebacksReverted,
        width: "140px",
        cell: (row) => (
          <div className="text-right">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {`${row.currencySymbol}${numberFormatter.format(
                row.totalChargebacksReverted
              )}`}
            </span>
          </div>
        ),
      },
      {
        id: "netChargebacks",
        name: "Net Chargebacks",
        right: true,
        sortable: true,
        selector: (row) => row.netChargebacks,
        width: "120px",
        cell: (row) => (
          <div className="text-right">
            <span
              className={`text-xs font-semibold ${
                row.netChargebacks >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {`${row.currencySymbol}${numberFormatter.format(
                row.netChargebacks
              )}`}
            </span>
          </div>
        ),
      },
      {
        id: "status",
        name: "Status",
        center: true,
        sortable: true,
        selector: (row) => row.status,
        width: "100px",
        cell: (row) => (
          <div className="text-center">
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700/40 dark:text-slate-200 capitalize">
              {row.status || "unlimited"}
            </span>
          </div>
        ),
      },
    ],
    [numberFormatter]
  );

  const handleDateChange = (event) => {
    const { value } = event.target;
    setFilterDate(value);
  };

  const handleApplyDate = async () => {
    if (!filterDate) {
      toast.error("Please select a date");
      return;
    }
    setIsReloading(true);
    try {
      await fetchData(filterDate);
      toast.success("Date filter applied");
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setIsReloading(false);
    }
  };

  const handleReset = async () => {
    const today = new Date().toISOString().split("T")[0];
    setFilterDate(today);
    setSearchTerm("");
    setIsReloading(true);
    try {
      await fetchData(today);
      toast.success("Filters reset to today");
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setIsReloading(false);
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await fetchData(filterDate);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary/60 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Loading merchant report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Merchant Report</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {reportData?.filter_date
              ? `Showing data for ${formatDate(reportData.filter_date)}`
              : "Review merchant performance and financial metrics"}
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

      <div className="card mb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Search merchants
            </label>
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search by merchant name"
              className="!w-full"
              icon="search"
            />
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:max-w-xl">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Filter Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="form-control"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                &nbsp;
              </label>
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleApplyDate}
                disabled={isReloading}
              >
                Apply Date
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Sales MTD
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                {numberFormatter.format(Number(totals.total_sales_mtd || 0))}
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
                Total Chargebacks MTD
              </p>
              <p
                className={`text-2xl font-semibold ${
                  Number(totals.total_chargebacks_mtd || 0) >= 0
                    ? "text-gray-900 dark:text-slate-100"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {numberFormatter.format(
                  Number(totals.total_chargebacks_mtd || 0)
                )}
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
                Chargebacks Reverted
              </p>
              <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {numberFormatter.format(
                  Number(totals.total_chargebacks_reverted || 0)
                )}
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
                Net Chargebacks
              </p>
              <p
                className={`text-2xl font-semibold ${
                  Number(totals.net_chargebacks || 0) >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {numberFormatter.format(Number(totals.net_chargebacks || 0))}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20">
              <BsFillPeopleFill className="text-blue-500 dark:text-blue-300" />
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
              Fetching merchant data&hellip;
            </div>
          }
          pagination={false}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center text-sm text-gray-500 dark:text-slate-400 dark:bg-slate-800">
              {searchTerm
                ? "No merchants match your search criteria."
                : "No merchant data available for the selected date."}
            </div>
          }
        />
      </div>

      {reportData?.filter_date && (
        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Showing data for {formatDate(reportData.filter_date)}. Adjust the date
          filter above and click "Apply Date" to refresh the report.
        </p>
      )}
    </>
  );
};

export default MerchantReport;
