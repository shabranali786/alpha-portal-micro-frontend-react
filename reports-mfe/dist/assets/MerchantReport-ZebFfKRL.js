import { importShared } from './__federation_fn_import-BFo6b6m_.js';
import { j as jsxRuntimeExports } from './jsx-runtime-BLp14W7u.js';
import { X as Xe } from './index.es-CtbOg0eT.js';
import { A as ApiRequest, f as BsArrowRepeat, g as BsCashStack, c as BsWallet2, a as BsFillPeopleFill } from './ApiRequest-Dnua7yhC.js';
import { S as SearchBox } from './SearchBox-CbqVSby8.js';
import { a as apiAxios } from './ApiAxios-BgIYsQIb.js';

const React = await importShared('react');
const {useCallback,useEffect,useMemo,useState} = React;
const toast = await importShared('react-hot-toast');
const MerchantReport = () => {
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
      console.log("Fetching data for date:", date);
      console.log("API Endpoint:", ApiRequest.merchantReports.index);
      const response = await apiAxios.get(ApiRequest.merchantReports.index, {
        params: {
          filter_date: date
        }
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
  useEffect(() => {
    if (filterDate) {
      fetchData(filterDate);
    }
  }, [filterDate, fetchData]);
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    []
  );
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };
  const filteredMerchants = useMemo(() => {
    if (!reportData?.data) return [];
    const merchants = reportData.data.filter((merchant) => {
      if (!searchTerm.trim()) return true;
      const merchantName = merchant?.title || "";
      return merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return merchants;
  }, [reportData, searchTerm]);
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
      serial: index + 1
    }));
  }, [filteredMerchants]);
  const totals = reportData?.totals || {};
  const columns = useMemo(
    () => [
      {
        id: "serial",
        name: "S.No",
        center: true,
        sortable: false,
        width: "60px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600 dark:text-slate-400", children: row.serial })
      },
      {
        id: "merchant",
        name: "Merchant Name",
        sortable: true,
        selector: (row) => row.merchantName,
        minWidth: "180px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-slate-100", children: row.merchantName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 dark:text-slate-400", children: [
            "ID: ",
            row.merchantId
          ] })
        ] })
      },
      {
        id: "totalSalesMtd",
        name: "Total Sales MTD",
        right: true,
        sortable: true,
        selector: (row) => row.totalSalesMtd,
        width: "120px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-gray-900 dark:text-slate-100", children: `${row.currencySymbol}${numberFormatter.format(
          row.totalSalesMtd
        )}` }) })
      },
      {
        id: "monthlyLimit",
        name: "Monthly Limit",
        right: true,
        sortable: true,
        selector: (row) => row.monthlyLimit,
        width: "110px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-900 dark:text-slate-100", children: row.monthlyLimit ? `${row.currencySymbol}${numberFormatter.format(
          Number(row.monthlyLimit)
        )}` : "Unlimited" }) })
      },
      {
        id: "limitLeft",
        name: "Limit Left",
        right: true,
        sortable: true,
        selector: (row) => row.limitLeft,
        width: "100px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-900 dark:text-slate-100", children: row.limitLeft !== null ? `${row.currencySymbol}${numberFormatter.format(
          Number(row.limitLeft)
        )}` : "—" }) })
      },
      {
        id: "limitUsedPercentage",
        name: "Limit Used %",
        right: true,
        sortable: true,
        selector: (row) => row.limitUsedPercentage,
        width: "100px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-900 dark:text-slate-100", children: row.limitUsedPercentage !== null ? `${Number(row.limitUsedPercentage || 0).toFixed(1)}%` : "—" }) })
      },
      {
        id: "totalChargebacksMtd",
        name: "Total Chargebacks MTD",
        right: true,
        sortable: true,
        selector: (row) => row.totalChargebacksMtd,
        width: "140px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-medium ${row.totalChargebacksMtd >= 0 ? "text-gray-900 dark:text-slate-100" : "text-red-600 dark:text-red-400"}`,
            children: `${row.currencySymbol}${numberFormatter.format(
              row.totalChargebacksMtd
            )}`
          }
        ) })
      },
      {
        id: "totalChargebacksReverted",
        name: "Chargebacks Reverted",
        right: true,
        sortable: true,
        selector: (row) => row.totalChargebacksReverted,
        width: "140px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-600 dark:text-emerald-400", children: `${row.currencySymbol}${numberFormatter.format(
          row.totalChargebacksReverted
        )}` }) })
      },
      {
        id: "netChargebacks",
        name: "Net Chargebacks",
        right: true,
        sortable: true,
        selector: (row) => row.netChargebacks,
        width: "120px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-semibold ${row.netChargebacks >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
            children: `${row.currencySymbol}${numberFormatter.format(
              row.netChargebacks
            )}`
          }
        ) })
      },
      {
        id: "status",
        name: "Status",
        center: true,
        sortable: true,
        selector: (row) => row.status,
        width: "100px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700/40 dark:text-slate-200 capitalize", children: row.status || "unlimited" }) })
      }
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
    } catch (error) {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Loading merchant report..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Merchant Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-slate-400", children: reportData?.filter_date ? `Showing data for ${formatDate(reportData.filter_date)}` : "Review merchant performance and financial metrics" })
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:max-w-md relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300", children: "Search merchants" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchBox,
          {
            onSearch: handleSearch,
            placeholder: "Search by merchant name",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Total Sales MTD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold text-gray-900 dark:text-slate-100", children: numberFormatter.format(Number(totals.total_sales_mtd || 0)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsCashStack, { className: "text-emerald-500 dark:text-emerald-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Total Chargebacks MTD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-2xl font-semibold ${Number(totals.total_chargebacks_mtd || 0) >= 0 ? "text-gray-900 dark:text-slate-100" : "text-red-600 dark:text-red-400"}`,
              children: numberFormatter.format(
                Number(totals.total_chargebacks_mtd || 0)
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-red-500/15 dark:bg-red-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsWallet2, { className: "text-red-500 dark:text-red-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Chargebacks Reverted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold text-emerald-600 dark:text-emerald-400", children: numberFormatter.format(
            Number(totals.total_chargebacks_reverted || 0)
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsCashStack, { className: "text-emerald-500 dark:text-emerald-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Net Chargebacks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-2xl font-semibold ${Number(totals.net_chargebacks || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
              children: numberFormatter.format(Number(totals.net_chargebacks || 0))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsFillPeopleFill, { className: "text-blue-500 dark:text-blue-300" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Xe,
      {
        className: "tm-data-table",
        columns,
        data: rows,
        progressPending: loading,
        progressComponent: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-gray-500 dark:text-slate-400", children: "Fetching merchant data…" }),
        pagination: false,
        dense: true,
        highlightOnHover: true,
        pointerOnHover: true,
        responsive: true,
        noDataComponent: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-12 text-center text-sm text-gray-500 dark:text-slate-400 dark:bg-slate-800", children: searchTerm ? "No merchants match your search criteria." : "No merchant data available for the selected date." })
      }
    ) }),
    reportData?.filter_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-gray-500 dark:text-slate-400", children: [
      "Showing data for ",
      formatDate(reportData.filter_date),
      '. Adjust the date filter above and click "Apply Date" to refresh the report.'
    ] })
  ] });
};

export { MerchantReport as default };
