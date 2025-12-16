import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Disclosure } from "@headlessui/react";
import toast from "react-hot-toast";
import {
  BsArrowRepeat,
  BsDownload,
  BsChevronDown,
  BsCashStack,
  BsPieChart,
  BsGraphUp,
} from "react-icons/bs";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import apiAxios from "@crm/shared/api/ApiAxios";

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Reusable Metric Card Component
const MetricCard = ({
  label,
  value,
  valueColor = "text-gray-900 dark:text-slate-100",
}) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{label}</p>
    <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
  </div>
);

const UnitAccordionItem = ({ data, type = "unit" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTitle = () => {
    if (type === "company") return "Company Total";
    if (type === "weborders") return "Web Orders";
    const unit = data.unit || {};
    return unit.title || "Unit";
  };

  const getSubtitle = () => {
    if (type === "company") return "Overall company performance";
    if (type === "weborders") return "Direct website orders";
    return "Unit performance metrics";
  };

  const getIcon = () => {
    if (type === "company") return BsGraphUp;
    if (type === "weborders") return BsPieChart;
    return BsCashStack;
  };

  const getIconColor = () => {
    if (type === "company")
      return "bg-gradient-to-br from-blue-500 to-blue-600";
    if (type === "weborders")
      return "bg-gradient-to-br from-purple-500 to-purple-600";
    return "bg-gradient-to-br from-emerald-500 to-emerald-600";
  };

  const Icon = getIcon();
  const iconColorClass = getIconColor();

  return (
    <Disclosure
      as="div"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full flex-col gap-4 border-b border-slate-200 bg-slate-50 py-4 px-5 text-left transition-colors hover:bg-blue-50 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:bg-slate-800/30 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${iconColorClass}`}
              >
                <Icon className="text-white" size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 m-0">
                  {getTitle()}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
                  {getSubtitle()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  MTD Sales
                </p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-0">
                  {formatCurrency(data.mtd_sales || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  MTD Net
                </p>
                <p
                  className={`text-sm font-semibold mb-0 ${
                    Number(data.mtd_net || 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(data.mtd_net || 0)}
                </p>
              </div>
              <BsChevronDown
                className={`size-5 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="space-y-6 p-6 bg-white dark:bg-slate-900">
            {/* Summary Metrics Grid */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-3">
                Performance Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <MetricCard
                  label="Today Sales"
                  value={formatCurrency(data.today_sales || 0)}
                />
                <MetricCard
                  label="MTD Sales"
                  value={formatCurrency(data.mtd_sales || 0)}
                  valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                  label="Today Chargebacks"
                  value={formatCurrency(data.today_chargebacks || 0)}
                  valueColor={
                    Number(data.today_chargebacks || 0) < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-slate-100"
                  }
                />
                <MetricCard
                  label="MTD Chargebacks"
                  value={formatCurrency(data.mtd_chargebacks || 0)}
                  valueColor={
                    Number(data.mtd_chargebacks || 0) < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-slate-100"
                  }
                />
                <MetricCard
                  label="MTD CB Reverted"
                  value={formatCurrency(data.mtd_reverted_chargebacks || 0)}
                  valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                  label="Today Expenses"
                  value={formatCurrency(data.today_expenses || 0)}
                />
                <MetricCard
                  label="MTD Expenses"
                  value={formatCurrency(data.mtd_expenses || 0)}
                />
                <MetricCard
                  label="Today Net"
                  value={formatCurrency(data.today_net || 0)}
                  valueColor={
                    Number(data.today_net || 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                />
                <MetricCard
                  label="MTD Net"
                  value={formatCurrency(data.mtd_net || 0)}
                  valueColor={
                    Number(data.mtd_net || 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                />
              </div>
            </div>

            {/* Last 7 Days Table */}
            {data.daily_data && data.daily_data.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-3">
                  Last 7 Days Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-white dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Daily Metrics
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Month to Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {data.daily_data.map((day, idx) => (
                        <tr
                          key={idx}
                          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-4 py-4">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {formatDate(day.date)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Sales
                                </span>
                                <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                                  {formatCurrency(day.sales)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  CB
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    Number(day.chargebacks || 0) < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {formatCurrency(day.chargebacks)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  CB Rev
                                </span>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                  {formatCurrency(day.reverted_chargebacks)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Exp
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    Number(day.expenses || 0) < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {formatCurrency(day.expenses)}
                                </span>
                              </div>
                              <div className="col-span-2 flex items-center justify-between pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  Net
                                </span>
                                <span
                                  className={`text-sm font-bold ${
                                    Number(day.net || 0) >= 0
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {formatCurrency(day.net)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Sales
                                </span>
                                <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                                  {formatCurrency(day.mtd_sales)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  CB
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    Number(day.mtd_chargebacks || 0) < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {formatCurrency(day.mtd_chargebacks)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  CB Rev
                                </span>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                  {formatCurrency(day.mtd_reverted_chargebacks)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Exp
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    Number(day.mtd_expenses || 0) < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {formatCurrency(day.mtd_expenses)}
                                </span>
                              </div>
                              <div className="col-span-2 flex items-center justify-between pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  Net
                                </span>
                                <span
                                  className={`text-sm font-bold ${
                                    Number(day.mtd_net || 0) >= 0
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {formatCurrency(day.mtd_net)}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

const UnitWiseReport = () => {
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
      const response = await apiAxios.get(ApiRequest.unitWiseReports.index, {
        params: {
          filter_date: date,
        },
      });

      if (response.data?.status && response.data?.data) {
        setReportData(response.data.data);
      } else {
        toast.error("Invalid response format");
        setReportData(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch unit report"
      );
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch only on component mount
  useEffect(() => {
    fetchData(today);
  }, []);

  // Filter units
  const filteredUnits = useMemo(() => {
    if (!reportData?.units) return [];
    return reportData.units.filter((unit) => {
      if (unit.is_web_orders) return false;
      if (!searchTerm.trim()) return true;
      const unitName = unit.unit?.title || "";
      return unitName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [reportData, searchTerm]);

  // Get web orders data from units array
  const webOrdersData = useMemo(() => {
    if (!reportData?.units) return null;
    const webOrders = reportData.units.find((unit) => unit.is_web_orders);
    if (webOrders) {
      return {
        ...webOrders,
        daily_data: webOrders.daily_data || [],
      };
    }
    return null;
  }, [reportData]);

  // Company totals with daily data
  const companyTotalData = useMemo(() => {
    if (!reportData?.company_total) return null;
    return {
      ...reportData.company_total,
      daily_data: reportData.company_daily_data || [],
    };
  }, [reportData]);

  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
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
    } finally {
      setIsReloading(false);
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await fetchData(filterDate);
      toast.success("Report refreshed");
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
            Loading unit report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Unit Wise Report</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {reportData?.filter_date
              ? `Showing data for ${formatDate(reportData.filter_date)}`
              : "Review unit performance and financial metrics"}
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
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Search units
            </label>
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search by unit name"
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

      {/* All Units List - Including Company Total, Web Orders, and Units */}
      <div className="space-y-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Performance Overview
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expand any section to view detailed metrics and daily breakdown.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Loading data&hellip;
          </div>
        ) : (
          <>
            {/* Company Total */}
            {companyTotalData && (
              <UnitAccordionItem data={companyTotalData} type="company" />
            )}

            {/* Web Orders */}
            {webOrdersData && (
              <UnitAccordionItem data={webOrdersData} type="weborders" />
            )}

            {/* Units */}
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unitData, index) => (
                <UnitAccordionItem
                  key={unitData.unit?.id || index}
                  data={unitData}
                  type="unit"
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                {searchTerm
                  ? "No units match your search criteria."
                  : "No unit data available for the selected date."}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UnitWiseReport;
