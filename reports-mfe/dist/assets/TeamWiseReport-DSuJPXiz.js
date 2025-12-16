import { importShared } from './__federation_fn_import-BFo6b6m_.js';
import { j as jsxRuntimeExports } from './jsx-runtime-BLp14W7u.js';
import { A as ApiRequest, f as BsArrowRepeat, d as BsChevronDown, h as BsGraphUp, i as BsPieChart, g as BsCashStack } from './ApiRequest-Dnua7yhC.js';
import { S as SearchBox } from './SearchBox-CbqVSby8.js';
import { a as apiAxios } from './ApiAxios-BgIYsQIb.js';
import { X as Xe } from './disclosure-CVj0SACd.js';

const React = await importShared('react');
const {useCallback,useEffect,useMemo,useState} = React;
const toast = await importShared('react-hot-toast');
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};
const MetricCard = ({
  label,
  value,
  valueColor = "text-gray-900 dark:text-slate-100"
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400 mb-1", children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-semibold ${valueColor}`, children: value })
] });
const TeamAccordionItem = ({ data, type = "team" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getTitle = () => {
    if (type === "company") return "Company Total";
    if (type === "weborders") return "Web Orders";
    const team = data.team || {};
    return team.title || "Team";
  };
  const getSubtitle = () => {
    if (type === "company") return "Overall company performance";
    if (type === "weborders") return "Direct website orders";
    const team = data.team || {};
    return team.unit?.title ? `Unit: ${team.unit.title}` : "No unit assigned";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Xe,
    {
      as: "div",
      className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900",
      children: ({ open }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Xe.Button, { className: "flex w-full flex-col gap-4 border-b border-slate-200 bg-slate-50 py-4 px-5 text-left transition-colors hover:bg-blue-50 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:bg-slate-800/30 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex size-10 items-center justify-center rounded-lg ${iconColorClass}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "text-white", size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900 dark:text-slate-100 m-0", children: getTitle() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 m-0", children: getSubtitle() })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "MTD Sales" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-0", children: formatCurrency(data.mtd_sales || 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "MTD Net" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-semibold mb-0 ${Number(data.mtd_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
                  children: formatCurrency(data.mtd_net || 0)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BsChevronDown,
              {
                className: `size-5 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${open ? "rotate-180" : ""}`
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Xe.Panel, { className: "space-y-6 p-6 bg-white dark:bg-slate-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-3", children: "Performance Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "Today Sales",
                  value: formatCurrency(data.today_sales || 0)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "MTD Sales",
                  value: formatCurrency(data.mtd_sales || 0),
                  valueColor: "text-emerald-600 dark:text-emerald-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "Today Chargebacks",
                  value: formatCurrency(data.today_chargebacks || 0),
                  valueColor: Number(data.today_chargebacks || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-slate-100"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "MTD Chargebacks",
                  value: formatCurrency(data.mtd_chargebacks || 0),
                  valueColor: Number(data.mtd_chargebacks || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-slate-100"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "MTD CB Reverted",
                  value: formatCurrency(data.mtd_reverted_chargebacks || 0),
                  valueColor: "text-emerald-600 dark:text-emerald-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "Today Expenses",
                  value: formatCurrency(data.today_expenses || 0)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "MTD Expenses",
                  value: formatCurrency(data.mtd_expenses || 0)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "Today Net",
                  value: formatCurrency(data.today_net || 0),
                  valueColor: Number(data.today_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label: "MTD Net",
                  value: formatCurrency(data.mtd_net || 0),
                  valueColor: Number(data.mtd_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }
              )
            ] })
          ] }),
          data.daily_data && data.daily_data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-3", children: "Last 7 Days Breakdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-200 dark:divide-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white dark:bg-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Daily Metrics" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Month to Date" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-200 dark:divide-slate-800", children: data.daily_data.map((day, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-900 dark:text-slate-100", children: formatDate(day.date) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Sales" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-900 dark:text-slate-100", children: formatCurrency(day.sales) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "CB" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-medium ${Number(day.chargebacks || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`,
                            children: formatCurrency(day.chargebacks)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "CB Rev" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-600 dark:text-emerald-400", children: formatCurrency(day.reverted_chargebacks) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Exp" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-medium ${Number(day.expenses || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`,
                            children: formatCurrency(day.expenses)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center justify-between pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600 dark:text-slate-300", children: "Net" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-sm font-bold ${Number(day.net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
                            children: formatCurrency(day.net)
                          }
                        )
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Sales" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-900 dark:text-slate-100", children: formatCurrency(day.mtd_sales) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "CB" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-medium ${Number(day.mtd_chargebacks || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`,
                            children: formatCurrency(day.mtd_chargebacks)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "CB Rev" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-600 dark:text-emerald-400", children: formatCurrency(day.mtd_reverted_chargebacks) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Exp" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-medium ${Number(day.mtd_expenses || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`,
                            children: formatCurrency(day.mtd_expenses)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center justify-between pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600 dark:text-slate-300", children: "Net" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-sm font-bold ${Number(day.mtd_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
                            children: formatCurrency(day.mtd_net)
                          }
                        )
                      ] })
                    ] }) })
                  ]
                },
                idx
              )) })
            ] }) })
          ] })
        ] })
      ] })
    }
  );
};
const TeamWiseReport = () => {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [filterDate, setFilterDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchData = useCallback(async (date) => {
    if (!date) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiAxios.get(ApiRequest.teamReports.index, {
        params: {
          filter_date: date
        }
      });
      if (response.data?.status && response.data?.data) {
        setReportData(response.data.data);
      } else {
        toast.error("Invalid response format");
        setReportData(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch team report"
      );
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData(today);
  }, []);
  const filteredTeams = useMemo(() => {
    if (!reportData?.teams) return [];
    return reportData.teams.filter((team) => {
      if (team.is_web_orders) return false;
      if (!searchTerm.trim()) return true;
      const teamName = team.team?.title || "";
      return teamName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [reportData, searchTerm]);
  const webOrdersData = useMemo(() => {
    if (!reportData?.teams) return null;
    const webOrders = reportData.teams.find((team) => team.is_web_orders);
    if (webOrders) {
      return {
        ...webOrders,
        daily_data: webOrders.daily_data || []
      };
    }
    return null;
  }, [reportData]);
  const companyTotalData = useMemo(() => {
    if (!reportData?.company_total) return null;
    return {
      ...reportData.company_total,
      daily_data: reportData.company_daily_data || []
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
    const today2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    setFilterDate(today2);
    setSearchTerm("");
    setIsReloading(true);
    try {
      await fetchData(today2);
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
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  if (loading && !reportData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full size-12 border-b-2 border-primary/60 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Loading team report..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Team Wise Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-slate-400", children: reportData?.filter_date ? `Showing data for ${formatDate(reportData.filter_date)}` : "Review team performance and financial metrics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleReset,
            className: "inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/60",
            children: "Reset"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleReload,
            disabled: isReloading,
            className: "inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-70 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BsArrowRepeat,
                {
                  size: 16,
                  className: isReloading ? "animate-spin" : ""
                }
              ),
              isReloading ? "Reloading..." : "Reload"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:max-w-md relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300", children: "Search teams" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchBox,
          {
            onSearch: handleSearch,
            placeholder: "Search by team name",
            className: "!w-full",
            icon: "search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Filter Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: filterDate,
              onChange: handleDateChange,
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: " " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-primary w-full",
              onClick: handleApplyDate,
              disabled: isReloading,
              children: "Apply Date"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300", children: "Performance Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Expand any section to view detailed metrics and daily breakdown." })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300", children: "Loading data…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        companyTotalData && /* @__PURE__ */ jsxRuntimeExports.jsx(TeamAccordionItem, { data: companyTotalData, type: "company" }),
        webOrdersData && /* @__PURE__ */ jsxRuntimeExports.jsx(TeamAccordionItem, { data: webOrdersData, type: "weborders" }),
        filteredTeams.length > 0 ? filteredTeams.map((teamData, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TeamAccordionItem,
          {
            data: teamData,
            type: "team"
          },
          teamData.team?.id || index
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300", children: searchTerm ? "No teams match your search criteria." : "No team data available for the selected date." })
      ] })
    ] })
  ] });
};

export { TeamWiseReport as default };
