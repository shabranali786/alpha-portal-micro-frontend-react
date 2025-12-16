import { importShared } from './__federation_fn_import-BFo6b6m_.js';
import { j as jsxRuntimeExports } from './jsx-runtime-BLp14W7u.js';
import { X as Xe } from './index.es-CtbOg0eT.js';
import { A as ApiRequest, f as BsArrowRepeat, g as BsCashStack, c as BsWallet2, j as BsReceiptCutoff, k as BsFileEarmarkText } from './ApiRequest-Dnua7yhC.js';
import { a as apiAxios } from './ApiAxios-BgIYsQIb.js';

const React = await importShared('react');
const {useCallback,useEffect,useMemo,useState} = React;
const toast = await importShared('react-hot-toast');
const CombinedSalesReport = () => {
  const getDefaultDateRange = () => {
    const today = /* @__PURE__ */ new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      from: thirtyDaysAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0]
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
    category: ""
  });
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
          page
        };
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
          error.response?.data?.message || "Failed to fetch combined sales report"
        );
        setReportData(null);
      } finally {
        setLoading(false);
      }
    },
    [dateRange, filters]
  );
  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [fetchData, currentPage, perPage]);
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    []
  );
  const formatDateOnly = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };
  const formatAmount = (amount) => {
    const num = Number(amount || 0);
    return `$${numberFormatter.format(Math.abs(num))}`;
  };
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
      serial: (currentPage - 1) * perPage + index + 1
    }));
  }, [reportData, currentPage, perPage]);
  const totals = reportData?.totals || {};
  const meta = reportData?.meta || {};
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
        id: "type",
        name: "Type",
        sortable: true,
        selector: (row) => row.type,
        width: "100px",
        cell: (row) => {
          const typeColors = {
            sale: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            chargeback: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            expense: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${typeColors[row.type] || "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200"}`,
              children: row.type
            }
          );
        }
      },
      {
        id: "date",
        name: "Date",
        sortable: true,
        selector: (row) => row.date,
        width: "140px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: formatDateOnly(row.date) })
      },
      {
        id: "leadName",
        name: "Lead Name",
        sortable: true,
        selector: (row) => row.leadName,
        minWidth: "150px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-900 dark:text-slate-100", children: row.leadName }),
          row.leadEmail !== "—" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 dark:text-slate-400", children: row.leadEmail })
        ] })
      },
      {
        id: "brand",
        name: "Brand",
        sortable: true,
        selector: (row) => row.brand?.title || "",
        minWidth: "150px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: row.brand?.title || "—" })
      },
      {
        id: "unit",
        name: "Unit",
        sortable: true,
        selector: (row) => row.unit?.title || "",
        width: "120px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: row.unit?.title || "—" })
      },
      {
        id: "team",
        name: "Team",
        sortable: true,
        selector: (row) => row.team?.title || "",
        minWidth: "150px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: row.team?.title || "—" })
      },
      {
        id: "merchant",
        name: "Merchant",
        sortable: true,
        selector: (row) => row.merchant?.title || "",
        minWidth: "150px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: row.merchant?.title || "—" })
      },
      {
        id: "amount",
        name: "Amount",
        right: true,
        sortable: true,
        selector: (row) => row.amount,
        width: "120px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-semibold ${row.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
            children: formatAmount(row.amount)
          }
        ) })
      },
      {
        id: "source",
        name: "Source",
        sortable: true,
        selector: (row) => row.source,
        width: "100px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100 capitalize", children: row.source || "—" })
      },
      {
        id: "status",
        name: "Status",
        sortable: true,
        selector: (row) => row.status,
        width: "100px",
        cell: (row) => {
          if (row.status === "—") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "—" });
          const statusColors = {
            paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            won: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            reverted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[row.status] || "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200"}`,
              children: row.status
            }
          );
        }
      },
      {
        id: "category",
        name: "Category",
        sortable: true,
        selector: (row) => row.category,
        width: "120px",
        cell: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-900 dark:text-slate-100", children: row.category !== "—" ? row.category : "—" })
      }
    ],
    [currentPage, perPage]
  );
  const handleDateChange = (key) => (event) => {
    const { value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleFilterChange = (key) => (event) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [key]: value
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
    } finally {
      setIsReloading(false);
    }
  };
  const handleReset = async () => {
    const defaultDates2 = getDefaultDateRange();
    setDateRange(defaultDates2);
    setFilters({
      record_type: "",
      lead_email: "",
      unit_id: "",
      brand_id: "",
      team_id: "",
      merchant_id: "",
      source: "",
      status: "",
      category: ""
    });
    setCurrentPage(1);
    setIsReloading(true);
    try {
      await fetchData(1, perPage);
      toast.success("Filters reset");
    } catch (error) {
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
    } finally {
      setIsReloading(false);
    }
  };
  if (loading && !reportData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full size-12 border-b-2 border-primary/60 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Loading combined sales report..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Combined Sales Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-slate-400", children: "View sales, chargebacks, and expenses in one unified report" })
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-slate-100", children: "Filters" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "From Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: dateRange.from,
              onChange: handleDateChange("from"),
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "To Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: dateRange.to,
              onChange: handleDateChange("to"),
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Record Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.record_type,
              onChange: handleFilterChange("record_type"),
              className: "form-control",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sales", children: "Sales" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "chargebacks", children: "Chargebacks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "expenses", children: "Expenses" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.source,
              onChange: handleFilterChange("source"),
              className: "form-control",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "invoice", children: "Invoice" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lead", children: "Lead" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.status,
              onChange: handleFilterChange("status"),
              className: "form-control",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "won", children: "Won" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lost", children: "Lost" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reverted", children: "Reverted" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Lead Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: filters.lead_email,
              onChange: handleFilterChange("lead_email"),
              placeholder: "Enter email",
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Unit ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: filters.unit_id,
              onChange: handleFilterChange("unit_id"),
              placeholder: "Enter unit ID",
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Brand ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: filters.brand_id,
              onChange: handleFilterChange("brand_id"),
              placeholder: "Enter brand ID",
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Team ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: filters.team_id,
              onChange: handleFilterChange("team_id"),
              placeholder: "Enter team ID",
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Merchant ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: filters.merchant_id,
              onChange: handleFilterChange("merchant_id"),
              placeholder: "Enter merchant ID",
              className: "form-control"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-slate-300", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: filters.category,
              onChange: handleFilterChange("category"),
              placeholder: "Enter category",
              className: "form-control"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-primary",
          onClick: handleApplyFilters,
          disabled: isReloading,
          children: "Apply Filters"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Total Sales Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold text-emerald-600 dark:text-emerald-400", children: formatAmount(totals.total_sales_amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: [
            totals.sales_count || 0,
            " sales"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsCashStack, { className: "text-emerald-500 dark:text-emerald-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Total Chargebacks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold text-red-600 dark:text-red-400", children: formatAmount(totals.total_chargeback_amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: [
            totals.chargeback_count || 0,
            " chargebacks"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-red-500/15 dark:bg-red-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsWallet2, { className: "text-red-500 dark:text-red-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Total Expenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold text-orange-600 dark:text-orange-400", children: formatAmount(totals.total_expense_amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: [
            totals.expense_count || 0,
            " expenses"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-orange-500/15 dark:bg-orange-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsReceiptCutoff, { className: "text-orange-500 dark:text-orange-300" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-slate-400", children: "Net Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-2xl font-semibold ${Number(totals.net_amount || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`,
              children: formatAmount(totals.net_amount || 0)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: [
            totals.total_records || 0,
            " total records"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsFileEarmarkText, { className: "text-blue-500 dark:text-blue-300" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Xe,
      {
        className: "tm-data-table",
        columns,
        data: rows,
        progressPending: loading,
        progressComponent: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-gray-500 dark:text-slate-400", children: "Fetching combined sales data…" }),
        pagination: true,
        paginationServer: true,
        paginationPerPage: perPage,
        paginationTotalRows: meta.total || 0,
        paginationDefaultPage: currentPage,
        paginationRowsPerPageOptions: [10, 15, 25, 50, 100],
        onChangeRowsPerPage: (rowsPerPage) => {
          setPerPage(rowsPerPage);
          setCurrentPage(1);
        },
        onChangePage: (page) => {
          setCurrentPage(page);
        },
        dense: true,
        highlightOnHover: true,
        pointerOnHover: true,
        responsive: true,
        noDataComponent: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-12 text-center text-sm text-gray-500 dark:text-slate-400 dark:bg-slate-800", children: "No data available for the selected filters." })
      }
    ) }),
    dateRange.from && dateRange.to && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-gray-500 dark:text-slate-400", children: [
      "Showing data from ",
      formatDateOnly(dateRange.from),
      " to",
      " ",
      formatDateOnly(dateRange.to),
      '. Adjust the filters above and click "Apply Filters" to refresh the report.'
    ] })
  ] });
};

export { CombinedSalesReport as default };
