import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "../../components/CustomDropdown";
import { SearchBox } from "../../components/SearchBox";
import { FiltersComponent } from "../../components/AllComponents";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import {
  BsArrowRepeat,
  BsPlus,
  BsFileEarmarkText,
  BsFileText,
  BsCheckCircleFill,
  BsClockFill,
  BsFilter,
  BsColumns,
  BsTrash,
  BsCheckSquare,
  BsSquare,
  BsExclamationTriangle,
} from "react-icons/bs";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import { usePermission } from "../../utils/permissions";

const Invoices = () => {
  const navigate = useNavigate();
  const canCreateInvoice = usePermission(["invoice.create", "invoice.all"]);
  const canEditInvoice = usePermission(["invoice.edit", "invoice.all"]);
  const canDeleteInvoice = usePermission(["invoice.delete", "invoice.all"]);
  const canViewInvoice = usePermission(["invoice.index", "invoice.all"]);
  const canViewTestInvoices = usePermission([
    "invoice.test.index",
    "invoice.all",
  ]);

  const {
    data: invoices,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    fetchData,
    queryParams,
    setQueryParams,
  } = usePaginatedData(ApiRequest.invoices.list);

  const [activeTab, setActiveTab] = useState("live");

  const [activeModal, setActiveModal] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState({
    value: "created_at",
    label: "Created Date",
  });
  const [leadEmail, setLeadEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentFromDate, setPaymentFromDate] = useState("");
  const [paymentToDate, setPaymentToDate] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [deletingSingle, setDeletingSingle] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState({});

  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    test: 0,
    paid: 0,
    unpaid: 0,
    total_amount: 0,
    paid_amount: 0,
    unpaid_amount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  useEffect(() => {
    const savedColumns = localStorage.getItem("invoicesTableColumns");
    if (savedColumns) {
      setColumnVisibility(JSON.parse(savedColumns));
    } else {
      const defaultVisibility = {
        customer: true,
        brand: true,
        amount: true,
        status: true,
        merchant: true,
        created: true,
        action: true,
      };
      setColumnVisibility(defaultVisibility);
      localStorage.setItem(
        "invoicesTableColumns",
        JSON.stringify(defaultVisibility)
      );
    }
  }, []);

  useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) {
      localStorage.setItem(
        "invoicesTableColumns",
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility]);

  useEffect(() => {
    const defaultQuery = {
      sort_by: "created_at",
    };
    setQueryParams(defaultQuery);
  }, []);

  useEffect(() => {
    if (!canViewTestInvoices && activeTab === "test") {
      setActiveTab("live");
    }
  }, [canViewTestInvoices, activeTab]);

  useEffect(() => {
    const calculateStats = () => {
      setLoadingStats(true);
      try {
        const total = totalRows || 0;
        const liveInvoices = invoices.filter((inv) => inv.is_test !== "1");
        const testInvoices = invoices.filter((inv) => inv.is_test === "1");
        const paidInvoices = invoices.filter(
          (inv) => inv.transaction_status === "paid"
        );
        const unpaidInvoices = invoices.filter(
          (inv) => inv.transaction_status !== "paid"
        );

        const paidAmount = paidInvoices.reduce(
          (sum, inv) => sum + parseFloat(inv.transaction_amount || 0),
          0
        );
        const unpaidAmount = unpaidInvoices.reduce(
          (sum, inv) => sum + parseFloat(inv.transaction_amount || 0),
          0
        );

        setStats({
          total: total,
          live: liveInvoices.length,
          test: testInvoices.length,
          paid: paidInvoices.length,
          unpaid: unpaidInvoices.length,
          total_amount: paidAmount + unpaidAmount,
          paid_amount: paidAmount,
          unpaid_amount: unpaidAmount,
        });
      } catch (error) {
        console.error("Error calculating stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (invoices.length > 0 || !loading) {
      calculateStats();
    }
  }, [invoices, totalRows, loading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedRows([]);
    setToggleCleared(!toggleCleared);
  };

  const buildQueryFromFilters = useCallback(() => {
    const query = {};
    if (selectedBrand?.value) query.brand_id = selectedBrand.value;
    if (selectedUnit?.value) query.unit_id = selectedUnit.value;
    if (selectedMerchant?.value) query.merchant_id = selectedMerchant.value;
    if (selectedPaymentStatus?.value)
      query.transaction_status = selectedPaymentStatus.value;
    if (selectedSortBy?.value) query.sort_by = selectedSortBy.value;
    if (leadEmail?.trim()) query.lead_email = leadEmail.trim();
    if (fromDate) query.from_date = fromDate;
    if (toDate) query.to_date = toDate;
    if (paymentFromDate) query.payment_from_date = paymentFromDate;
    if (paymentToDate) query.payment_to_date = paymentToDate;

    return query;
  }, [
    selectedBrand,
    selectedUnit,
    selectedMerchant,
    selectedPaymentStatus,
    selectedSortBy,
    leadEmail,
    fromDate,
    toDate,
    paymentFromDate,
    paymentToDate,
  ]);

  const handleApplyFilters = useCallback(() => {
    const query = buildQueryFromFilters();
    setActiveModal(null);
    setQueryParams(query);
    setCurrentPage(1);
  }, [buildQueryFromFilters]);

  const handleFilterChange = useCallback((filterType, selectedOption) => {
    switch (filterType) {
      case "brand":
        setSelectedBrand(selectedOption);
        break;
      case "unit":
        setSelectedUnit(selectedOption);
        break;
      case "merchant":
        setSelectedMerchant(selectedOption);
        break;
      case "paymentStatus":
        setSelectedPaymentStatus(selectedOption);
        break;
      case "sortBy":
        setSelectedSortBy(selectedOption);
        break;
      case "leadEmail":
        setLeadEmail(selectedOption);
        break;
      case "fromDate":
        setFromDate(selectedOption);
        break;
      case "toDate":
        setToDate(selectedOption);
        break;
      case "paymentFromDate":
        setPaymentFromDate(selectedOption);
        break;
      case "paymentToDate":
        setPaymentToDate(selectedOption);
        break;
    }
  }, []);

  const handleColumnVisibilityChange = (columnKey, isVisible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: isVisible,
    }));
  };

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select invoices to delete");
      return;
    }
    setActiveModal("bulkDelete");
  };

  const confirmBulkDelete = async () => {
    setDeletingBulk(true);
    try {
      const invoiceIds = selectedRows.map((row) => row.id);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Successfully deleted ${invoiceIds.length} invoice(s)`);
      setActiveModal(null);
      setSelectedRows([]);
      setToggleCleared(!toggleCleared);
      fetchInvoices(currentPage, perPage, searchTerm);
    } catch (error) {
      console.error("Error deleting invoices:", error);
      toast.error(error.response?.data?.message || "Failed to delete invoices");
    } finally {
      setDeletingBulk(false);
    }
  };

  const hasAnyActionPermission =
    canViewInvoice || canEditInvoice || canDeleteInvoice;

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    closeDropdown();

    switch (action) {
      case "view":
        navigate(`/invoices/${row.id}`);
        break;
      case "view-invoice":
        window.open(
          `${row.brand.invoice_link}${row.slug}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "download":
        handleDownloadInvoice(row);
        break;
      case "print":
        handlePrintInvoice(row);
        break;
      case "edit":
        navigate(`/invoices/${row.id}/edit`);
        break;
      case "delete":
        handleDeleteInvoice(row);
        break;
      default:
        break;
    }
  };

  const handleResetColumns = () => {
    const allVisible = {
      customer: true,
      brand: true,
      amount: true,
      status: true,
      merchant: true,
      created: true,
      action: true,
    };
    setColumnVisibility(allVisible);
    toast.success("All columns restored");
  };

  const handleReset = useCallback(() => {
    setSelectedBrand(null);
    setSelectedUnit(null);
    setSelectedMerchant(null);
    setSelectedPaymentStatus(null);
    setSelectedSortBy({
      value: "created_at",
      label: "Created Date",
    });
    setLeadEmail("");
    setFromDate("");
    setToDate("");
    setPaymentFromDate("");
    setPaymentToDate("");
    setActiveModal(null);
    setQueryParams({});
    setCurrentPage(1);
  }, []);

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Downloading invoice ${invoice.invoice_no}...`);
  };

  const handlePrintInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setActiveModal("singleDelete");
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    setDeletingSingle(true);
    try {
      await apiAxios.delete(ApiRequest.invoices.delete(invoiceToDelete.id));
      toast.success("Invoice deleted successfully");
      setActiveModal(null);
      setInvoiceToDelete(null);
      refresh();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete invoice";
      toast.error(errorMessage);
    } finally {
      setDeletingSingle(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
      unpaid:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
      pending:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    };

    return (
      <span
        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
          statusConfig[status] || statusConfig.unpaid
        }`}
      >
        {status || "unpaid"}
      </span>
    );
  };

  const allColumns = [
    {
      key: "customer",
      name: "Customer",
      selector: (row) => row.lead?.name || "N/A",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {row.lead?.name || "N/A"}
            {row.is_test === "1" && (
              <span className="ml-2 inline-block px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium dark:bg-orange-900/30 dark:text-orange-200">
                TEST
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {row.lead?.email || "No email"}
          </div>
          {row.lead?.phone && (
            <div className="text-xs text-gray-400 dark:text-slate-500">
              {row.lead.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "brand",
      name: "Brand",
      selector: (row) => row.brand?.title || "N/A",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="text-sm text-gray-700 dark:text-slate-300 block">
            {row.brand?.title || "N/A"}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400">
            Team: {row.team?.title || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      name: "Amount",
      selector: (row) => row.transaction_amount,
      sortable: true,
      width: "120px",
      right: true,
      cell: (row) => (
        <div className="font-semibold text-gray-900 dark:text-slate-100">
          {row.merchant?.currency_symbol || "$"}
          {parseFloat(row.transaction_amount || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: "status",
      name: "Status",
      selector: (row) => row.transaction_status,
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div>
          {getPaymentStatusBadge(row.transaction_status)}
          {row.transaction_status === "paid" && row.paid_at && (
            <div className="text-xs text-gray-500 dark:text-slate-500 mt-1.5">
              {new Date(row.paid_at).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "merchant",
      name: "Merchant",
      selector: (row) => row.merchant?.title || "N/A",
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="text-gray-600 dark:text-slate-400">
          {row.merchant?.title || "N/A"}
        </div>
      ),
    },
    {
      key: "created",
      name: "Created",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div>
          <div className="text-sm text-gray-700 dark:text-slate-300">
            By: {row.created_by?.name || "N/A"}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">
            At: {new Date(row.created_at).toLocaleDateString()}
          </div>
        </div>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            key: "action",
            name: "Action",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            width: "80px",
            cell: (row) => (
              <div className="relative">
                <DropdownTrigger
                  onClick={(e) => handleDropdownToggle(row.id, e)}
                />
                <CustomDropdown
                  isOpen={openDropdown === row.id}
                  onClose={closeDropdown}
                  position={dropdownPosition}
                >
                  {canViewInvoice && (
                    <>
                      <DropdownItem
                        onClick={() => handleAction("view", row)}
                        icon="👁️"
                        label="View"
                      />
                      <DropdownItem
                        onClick={() => handleAction("view-invoice", row)}
                        icon="🧾"
                        label="Payment Invoice"
                      />
                      {/* <DropdownItem
                        onClick={() => handleAction("download", row)}
                        icon="📥"
                        label="Download"
                      /> */}
                    </>
                  )}
                  {row.transaction_status !== "paid" && (
                    <>
                      <DropdownDivider />
                      {canEditInvoice && (
                        <DropdownItem
                          onClick={() => handleAction("edit", row)}
                          icon="✏️"
                          label="Edit"
                        />
                      )}
                      {canDeleteInvoice && (
                        <DropdownItem
                          onClick={() => handleAction("delete", row)}
                          icon="🗑️"
                          label="Delete"
                          danger={true}
                        />
                      )}
                    </>
                  )}
                </CustomDropdown>
              </div>
            ),
          },
        ]
      : []),
  ];

  const visibleColumns = allColumns.filter(
    (column) => columnVisibility[column.key]
  );

  const hasActiveFilters =
    selectedBrand ||
    selectedUnit ||
    selectedMerchant ||
    selectedPaymentStatus ||
    (selectedSortBy?.value && selectedSortBy.value !== "created_at") ||
    leadEmail.trim() ||
    fromDate ||
    toDate ||
    paymentFromDate ||
    paymentToDate;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-0.5">
            Manage and track all invoices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Invoices"
            size="md"
            icon="search"
            className="w-full sm:w-64"
          />

          {/* Columns Button */}
          {/* <button
            onClick={() => setActiveModal("columns")}
            className="btn btn-black"
          >
            <BsColumns size={20} /> Columns
          </button> */}

          {/* Filters Button */}
          <button
            onClick={() => setActiveModal("filters")}
            className={`btn btn-black relative ${
              hasActiveFilters ? "btn-primary" : ""
            }`}
          >
            <BsFilter size={20} /> Filters
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs size-5 rounded-full flex items-center justify-center">
                {
                  [
                    selectedBrand,
                    selectedUnit,
                    selectedMerchant,
                    selectedPaymentStatus,
                    selectedSortBy?.value &&
                      selectedSortBy.value !== "created_at" &&
                      selectedSortBy,
                    leadEmail.trim() && leadEmail,
                    fromDate,
                    toDate,
                    paymentFromDate,
                    paymentToDate,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="btn btn-black"
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

          {/* Create Invoice */}
          {canCreateInvoice && (
            <button
              onClick={() => navigate("/invoices/create")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Create Invoice
            </button>
          )}
        </div>
      </div>

      {/* ✅ Tabs Navigation - Only show if user can view test invoices */}
      {canViewTestInvoices ? (
        <div className="bg-white border-b border-gray-200 dark:bg-slate-900/70 dark:border-slate-700/60 mb-6 rounded-lg overflow-hidden">
          <div className="flex">
            {/* Live Invoices Tab */}
            <button
              onClick={() => handleTabChange("live")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "live"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BsCheckCircleFill size={18} />
                <span>Live Invoices</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "live"
                      ? "bg-green-600 text-white dark:bg-green-500"
                      : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {loadingStats ? "..." : stats.live}
                </span>
              </div>
              {activeTab === "live" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 dark:bg-green-400"></div>
              )}
            </button>

            {/* Test Invoices Tab */}
            <button
              onClick={() => handleTabChange("test")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "test"
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BsExclamationTriangle size={18} />
                <span>Test Invoices</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "test"
                      ? "bg-orange-600 text-white dark:bg-orange-500"
                      : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {loadingStats ? "..." : stats.test}
                </span>
              </div>
              {activeTab === "test" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 dark:bg-orange-400"></div>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* ✅ Active Filters Banner */}
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
                  Team: {selectedUnit.label}
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
              {selectedSortBy?.value &&
                selectedSortBy.value !== "created_at" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                    Sort By: {selectedSortBy.label}
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
              {paymentFromDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Payment From: {paymentFromDate}
                </span>
              )}
              {paymentToDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                  Payment To: {paymentToDate}
                </span>
              )}
            </div>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-300 dark:hover:text-blue-200"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {activeTab === "live" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Total Invoices */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black dark:text-slate-400 mb-1">
                  Total Invoices
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {loadingStats ? (
                    <span className="animate-pulse">--</span>
                  ) : (
                    (stats.live + stats.test).toLocaleString()
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                  $ {loadingStats ? "--" : stats.total_amount.toLocaleString()}{" "}
                  total
                </p>
              </div>
              <div className="size-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl dark:bg-blue-500/15">
                <BsFileText className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Paid Invoices */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black dark:text-slate-400 mb-1">
                  Paid Invoices
                </p>
                <h3 className="text-3xl font-bold text-green-600 dark:text-emerald-300">
                  {loadingStats ? (
                    <span className="animate-pulse">--</span>
                  ) : (
                    stats.paid.toLocaleString()
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                  $ {loadingStats ? "--" : stats.paid_amount.toLocaleString()}{" "}
                  received
                </p>
              </div>
              <div className="size-14 bg-green-100 rounded-full flex items-center justify-center text-3xl dark:bg-green-500/15">
                <BsCheckCircleFill className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Unpaid Invoices */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black dark:text-slate-400 mb-1">
                  Unpaid Invoices
                </p>
                <h3 className="text-3xl font-bold text-yellow-600 dark:text-amber-300">
                  {loadingStats ? (
                    <span className="animate-pulse">--</span>
                  ) : (
                    stats.unpaid.toLocaleString()
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                  $ {loadingStats ? "--" : stats.unpaid_amount.toLocaleString()}{" "}
                  pending
                </p>
              </div>
              <div className="size-14 bg-yellow-100 rounded-full flex items-center justify-center text-3xl dark:bg-amber-500/20">
                <BsClockFill className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Simplified Bulk Actions Bar (Only in Test tab) */}
      {activeTab === "test" && selectedRows.length > 0 && (
        <div className="card mb-6 bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BsCheckSquare
                size={20}
                className="text-orange-600 dark:text-orange-400"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  {selectedRows.length} test invoice(s) selected
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Ready for bulk deletion
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedRows([]);
                  setToggleCleared(!toggleCleared);
                }}
                className="btn btn-white"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-danger"
                disabled={selectedRows.length === 0}
              >
                <BsTrash size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={visibleColumns}
          data={invoices}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          selectableRows={activeTab === "test"}
          selectableRowsHighlight
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center dark:bg-slate-800">
              <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                {activeTab === "live" && (
                  <BsCheckCircleFill className="mx-auto" size={48} />
                )}
                {activeTab === "test" && (
                  <BsExclamationTriangle className="mx-auto" size={48} />
                )}
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                {activeTab === "live" && "No live invoices found"}
                {activeTab === "test" && "No test invoices found"}
              </div>
              <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                Try adjusting your search terms or filters
              </div>
            </div>
          }
        />
      </div>

      {/* ✅ Bulk Delete Confirmation Modal */}
      <Transition show={activeModal === "bulkDelete"} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setActiveModal(null)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="transform transition-all w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/30">
                      <BsTrash
                        size={24}
                        className="text-red-600 dark:text-red-400"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                        Delete Test Invoices
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      You are about to permanently delete{" "}
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {selectedRows.length} test invoice(s)
                      </span>
                      .
                    </p>

                    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">
                          Total Selected:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {selectedRows.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">
                          All Test Invoices:
                        </span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          Yes
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-500/20">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        ⚠️ <strong>Warning:</strong> This will permanently
                        delete all selected test invoices and their associated
                        data.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      disabled={deletingBulk}
                      className="flex-1 btn btn-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBulkDelete}
                      disabled={deletingBulk}
                      className="flex-1 btn btn-danger"
                    >
                      {deletingBulk ? (
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
                          Deleting...
                        </>
                      ) : (
                        <>
                          <BsTrash size={16} />
                          Delete {selectedRows.length} Invoice(s)
                        </>
                      )}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ✅ Filters Modal */}
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
                          selectedPaymentStatus={selectedPaymentStatus}
                          selectedSortBy={selectedSortBy}
                          leadEmail={leadEmail}
                          fromDate={fromDate}
                          toDate={toDate}
                          paymentFromDate={paymentFromDate}
                          paymentToDate={paymentToDate}
                          onFilterChange={handleFilterChange}
                          showPaymentStatus={true}
                          showMerchants={true}
                          showSortBy={true}
                          showLeadEmail={true}
                          showDateRange={true}
                          showPaymentDateRange={true}
                        />
                        <div className="mt-5 flex justify-between gap-3">
                          <button
                            onClick={handleReset}
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

      {/* ✅ Columns Modal */}
      <Transition show={activeModal === "columns"} as={Fragment}>
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
                            Column Settings
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
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          Choose which columns to display in the table
                        </p>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-4">
                          {allColumns.map((column) => (
                            <div
                              key={column.key}
                              className="flex items-center justify-between"
                            >
                              <label
                                htmlFor={`column-${column.key}`}
                                className="text-sm font-medium text-gray-700 dark:text-slate-300"
                              >
                                {column.name}
                              </label>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input
                                  type="checkbox"
                                  id={`column-${column.key}`}
                                  checked={
                                    columnVisibility[column.key] || false
                                  }
                                  onChange={(e) =>
                                    handleColumnVisibilityChange(
                                      column.key,
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={`column-${column.key}`}
                                  className={`block h-6 w-10 rounded-full cursor-pointer ${
                                    columnVisibility[column.key]
                                      ? "bg-primary dark:bg-primary/80"
                                      : "bg-gray-300 dark:bg-slate-700"
                                  }`}
                                >
                                  <span
                                    className={`absolute left-1 top-1 size-4 rounded-full transition-transform bg-white dark:bg-slate-200 ${
                                      columnVisibility[column.key]
                                        ? "transform translate-x-4"
                                        : ""
                                    }`}
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-8 flex justify-between">
                          <button
                            onClick={handleResetColumns}
                            className="btn btn-black"
                          >
                            Reset All Columns
                          </button>
                          <button
                            onClick={() => setActiveModal(null)}
                            className="btn btn-primary"
                          >
                            Apply
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

      {/* Single Invoice Delete Modal */}
      <DeleteInvoiceModal
        open={activeModal === "singleDelete"}
        onClose={() => {
          setActiveModal(null);
          setInvoiceToDelete(null);
        }}
        invoice={invoiceToDelete}
        onConfirm={confirmDeleteInvoice}
        loading={deletingSingle}
      />
    </>
  );
};

export default Invoices;
