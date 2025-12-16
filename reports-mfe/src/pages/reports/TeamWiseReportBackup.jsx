import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BsArrowRepeat,
  BsDownload,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import apiAxios from "@crm/shared/api/ApiAxios";

// Component for rendering summary table as accordion
const SummaryTable = ({ data, title, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  const formatValue = (value, isNegative = false) => {
    const num = Number(value || 0);
    if (num === 0) return "$0.00";
    if (isNegative && num < 0) {
      return `($${numberFormatter.format(Math.abs(num))})`;
    }
    return `$${numberFormatter.format(num)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get net amount from data (no calculations, just render what's in response)
  const netAmount = data.today_net || 0;
  const netAmountFormatted = formatValue(netAmount);

  const summaryRows = [
    {
      label: "Sale - Gross",
      today: data.today_sales || 0,
      mtd: data.mtd_sales || 0,
      isNegative: false,
    },
    {
      label: "Chargeback",
      today: data.today_chargebacks || 0,
      mtd: data.mtd_chargebacks || 0,
      isNegative: true,
    },
    {
      label: "Chargeback Reverted",
      today: data.today_reverted_chargebacks || 0,
      mtd: data.mtd_reverted_chargebacks || 0,
      isNegative: false,
      isPositive: true,
    },
    {
      label: "Expenses",
      today: data.today_expenses || 0,
      mtd: data.mtd_expenses || 0,
      isNegative: true,
    },
    {
      label: "Net Sales",
      today: data.today_net || 0,
      mtd: data.mtd_net || 0,
      isNegative: false,
      isNet: true,
    },
  ];

  return (
    <div className="card mb-6 overflow-hidden">
      {/* Accordion Header - Always Visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <BsChevronUp
              className="text-gray-600 dark:text-slate-300"
              size={20}
            />
          ) : (
            <BsChevronDown
              className="text-gray-600 dark:text-slate-300"
              size={20}
            />
          )}
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <span
            className={`text-lg font-semibold ${
              Number(netAmount) >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {netAmountFormatted}
          </span>
        </div>
      </button>

      {/* Accordion Content - Only visible when expanded */}
      {isExpanded && (
        <div>
          {/* Summary Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    {date ? formatDate(date) : "Today"}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    Month to Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-200 dark:border-slate-700 ${
                      row.isNet
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={`font-semibold ${
                          row.isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : row.isNegative && Number(row.today) < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-slate-100"
                        }`}
                      >
                        {formatValue(row.today, row.isNegative)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={`font-semibold ${
                          row.isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : row.isNegative && Number(row.mtd) < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-slate-100"
                        }`}
                      >
                        {formatValue(row.mtd, row.isNegative)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Last 7 Days Table */}
          {data.daily_data && data.daily_data.length > 0 && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50">
                <h4 className="text-md font-semibold text-gray-900 dark:text-slate-100">
                  Last 7 Days
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        Date
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        Sales
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        CB
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        CB Rev
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        Exp
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        Net
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        MTD Sales
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        MTD CB
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        MTD CB Rev
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        MTD Exp
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        MTD Net
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily_data.map((day, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-3 py-2 text-xs text-gray-900 dark:text-slate-100">
                          {formatDate(day.date)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-gray-900 dark:text-slate-100">
                          {formatValue(day.sales)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.chargebacks || 0) < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-slate-100"
                            }
                          >
                            {formatValue(day.chargebacks, true)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-emerald-600 dark:text-emerald-400">
                          {formatValue(day.reverted_chargebacks)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.expenses || 0) < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-slate-100"
                            }
                          >
                            {formatValue(day.expenses, true)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.net || 0) >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {formatValue(day.net)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-gray-900 dark:text-slate-100">
                          {formatValue(day.mtd_sales)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.mtd_chargebacks || 0) < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-slate-100"
                            }
                          >
                            {formatValue(day.mtd_chargebacks, true)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-emerald-600 dark:text-emerald-400">
                          {formatValue(day.mtd_reverted_chargebacks)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.mtd_expenses || 0) < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-slate-100"
                            }
                          >
                            {formatValue(day.mtd_expenses, true)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          <span
                            className={
                              Number(day.mtd_net || 0) >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {formatValue(day.mtd_net)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TeamWiseReportBackup = () => {
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
      console.log("API Endpoint:", ApiRequest.teamReports.index);

      const response = await apiAxios.get(ApiRequest.teamReports.index, {
        params: {
          filter_date: date,
        },
      });

      console.log("API Response:", response.data);

      if (response.data?.status && response.data?.data) {
        setReportData(response.data.data);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Invalid response format");
        setReportData(null);
      }
    } catch (error) {
      console.error("Error fetching team report:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(
        error.response?.data?.message || "Failed to fetch team report"
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

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!reportData?.teams) return [];
    const teams = reportData.teams.filter((team) => {
      if (team.is_web_orders) return false; // Exclude web orders from main list
      if (!searchTerm.trim()) return true;
      const teamName = team.team?.title || "";
      return teamName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return teams;
  }, [reportData, searchTerm]);

  // Get web orders data
  const webOrdersData = useMemo(() => {
    if (!reportData?.teams) return null;
    return reportData.teams.find((team) => team.is_web_orders) || null;
  }, [reportData]);

  // Company totals
  const companyTotal = reportData?.company_total || {};
  const companyDailyData = reportData?.company_daily_data || [];

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
            Loading team report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Wise Report</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {reportData?.filter_date
              ? `Showing data for ${formatDate(reportData.filter_date)}`
              : "Review team performance and financial metrics"}
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
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <BsDownload size={16} />
            CSV
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Search teams
            </label>
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search by team name"
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

      {/* Company Total Section */}
      {companyTotal && (
        <SummaryTable
          data={{
            ...companyTotal,
            daily_data: companyDailyData,
          }}
          title="Company Total"
          date={reportData?.filter_date}
        />
      )}

      {/* Web Orders Section */}
      {webOrdersData && (
        <SummaryTable
          data={webOrdersData}
          title="Web Orders"
          date={reportData?.filter_date}
        />
      )}

      {/* Teams Sections */}
      {filteredTeams.length > 0 ? (
        <div className="space-y-6">
          {filteredTeams.map((teamData, index) => {
            const team = teamData.team || {};
            const teamTitle = team.unit
              ? `${team.title} ${team.unit.title}`
              : team.title || `Team ${index + 1}`;
            return (
              <SummaryTable
                key={team.id || index}
                data={teamData}
                title={teamTitle}
                date={reportData?.filter_date}
              />
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-slate-400">
              {searchTerm
                ? "No teams match your search criteria."
                : "No team data available for the selected date."}
            </p>
          </div>
        )
      )}

      {reportData?.filter_date && (
        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Showing data for {formatDate(reportData.filter_date)}. Adjust the date
          filter above and click "Apply Date" to refresh the report.
        </p>
      )}
    </>
  );
};

export default TeamWiseReportBackup;
