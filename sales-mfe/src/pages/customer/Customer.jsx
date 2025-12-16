import React, {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
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
import AddLeadModal from "./AddLeadModal";
import EditLeadModal from "./EditLeadModal";
import UpdateStatusModal from "./UpdateStatusModal";
import AddNoteModal from "./AddNoteModal";
import DeleteLeadModal from "./DeleteLeadModal";
import ConfirmTestToggleModal from "./ConfirmTestToggleModal";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import { usePermission } from "../../utils/permissions";

import {
  BsArrowRepeat,
  BsCheckCircleFill,
  BsColumns,
  BsExclamationTriangle,
  BsEye,
  BsEyeSlash,
  BsFilter,
  BsFlagFill,
  BsPlus,
} from "react-icons/bs";
import Communication from "../lead/Communication";
import SensitiveModal from "../lead/SensitiveModal";

const Customer = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canCreateCustomer = usePermission(["lead.create"]);
  const canEditCustomer = usePermission(["lead.edit"]);
  const canDeleteCustomer = usePermission(["lead.delete"]);
  const canViewCustomer = usePermission(["lead.show"]);
  const canViewTestCustomers = usePermission(["lead.test.index"]);
  const canMarkCustomer = usePermission(["lead.mark-as-test"]);
  const canCreateInvoice = usePermission(["invoice.create"]);
  const canLeadUpdateStatus = usePermission(["lead.update-status"]);
  const canHideSensitiveRequest = usePermission(["lead.hide.sensitiverequest"]);

  // Check if user is SuperAdmin
  const isSuperAdmin = () => {
    if (!user?.roles || user.roles.length === 0) return false;
    const superAdminNames = [
      "superadmin",
      "super-admin",
      "super_admin",
      "super admin",
    ];
    if (typeof user.roles[0] === "string") {
      return user.roles.some((role) =>
        superAdminNames.includes(role.toLowerCase())
      );
    } else {
      return user.roles.some((role) =>
        superAdminNames.includes((role.name || role).toLowerCase())
      );
    }
  };

  // Check if sensitive data should be visible (SuperAdmin or has permission)
  const canViewSensitiveData = isSuperAdmin() || canHideSensitiveRequest;
  const [testTabEnabled, setTestTabEnabled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [testToggleAction, setTestToggleAction] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  const [brands, setBrands] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: liveLeads,
    loading: liveLoading,
    totalRows: liveTotalRows,
    currentPage: liveCurrentPage,
    perPage: livePerPage,
    searchTerm: liveSearchTerm,
    setCurrentPage: setLiveCurrentPage,
    setPerPage: setLivePerPage,
    handleSearch: handleLiveSearch,
    refresh: refreshLive,
    fetchData: fetchLiveData,
    queryParams: liveQueryParams,
    setQueryParams: setLiveQueryParams,
  } = usePaginatedData(ApiRequest.customers.listLive);

  const {
    data: testLeads,
    loading: testLoading,
    totalRows: testTotalRows,
    currentPage: testCurrentPage,
    perPage: testPerPage,
    searchTerm: testSearchTerm,
    setCurrentPage: setTestCurrentPage,
    setPerPage: setTestPerPage,
    handleSearch: handleTestSearch,
    refresh: refreshTest,
    fetchData: fetchTestData,
    queryParams: testQueryParams,
    setQueryParams: setTestQueryParams,
  } = usePaginatedData(
    canViewTestCustomers && testTabEnabled
      ? ApiRequest.customers.listTest
      : null
  );

  const activeState =
    activeTab === "live"
      ? {
          leads: liveLeads,
          loading: liveLoading,
          totalRows: liveTotalRows,
          currentPage: liveCurrentPage,
          perPage: livePerPage,
          setCurrentPage: setLiveCurrentPage,
          setPerPage: setLivePerPage,
          refresh: refreshLive,
          fetchData: fetchLiveData,
          searchTerm: liveSearchTerm,
          queryParams: liveQueryParams,
        }
      : {
          leads: testLeads,
          loading: testLoading,
          totalRows: testTotalRows,
          currentPage: testCurrentPage,
          perPage: testPerPage,
          setCurrentPage: setTestCurrentPage,
          setPerPage: setTestPerPage,
          refresh: refreshTest,
          fetchData: fetchTestData,
          searchTerm: testSearchTerm,
          queryParams: testQueryParams,
        };

  const leads = activeState.leads;
  const loading = activeState.loading;
  const totalRows = activeState.totalRows;
  const currentPage = activeState.currentPage;
  const perPage = activeState.perPage;
  const setCurrentPage = activeState.setCurrentPage;
  const setPerPage = activeState.setPerPage;
  const refresh = activeState.refresh;
  const searchTerm = activeState.searchTerm;
  const queryParams = activeState.queryParams;

  const [revealedContacts, setRevealedContacts] = useState({});
  const [pendingSensitiveLead, setPendingSensitiveLead] = useState(null);
  const [sensitiveReason, setSensitiveReason] = useState("");
  const [sensitiveError, setSensitiveError] = useState("");

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

  const [columnVisibility, setColumnVisibility] = useState({});

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  useEffect(() => {
    const savedColumns = localStorage.getItem("customerTableColumns");
    if (savedColumns) {
      setColumnVisibility(JSON.parse(savedColumns));
    } else {
      const defaultVisibility = {
        serial: true,
        brand: true,
        client: true,
        transaction: true,
        amount: true,
        date: true,
        status: true,
        notes: true,
        action: true,
      };
      setColumnVisibility(defaultVisibility);
      localStorage.setItem(
        "customerTableColumns",
        JSON.stringify(defaultVisibility)
      );
    }
  }, []);

  useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) {
      localStorage.setItem(
        "customerTableColumns",
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility]);

  useEffect(() => {
    if (!canViewTestCustomers && activeTab === "test") {
      setActiveTab("live");
    }
  }, [canViewTestCustomers, activeTab]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await apiAxios.get(ApiRequest.brands.list);
      const brandsData = response.data?.data || response.data || [];
      setBrands(
        brandsData.map((brand) => ({
          value: brand.id,
          label: brand.title || brand.name || `Brand ${brand.id}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    const defaultQuery = {
      sort_by: "created_at",
    };
    setLiveQueryParams(defaultQuery);
    if (canViewTestCustomers) {
      setTestQueryParams(defaultQuery);
    }
  }, []);

  const handleApiError = (error) => {
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([key, messages]) => {
        toast.error(`${key}: ${messages[0]}`);
      });
    } else {
      toast.error(error.response?.data?.message || "Operation failed");
    }
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

  const handleFilterChange = useCallback((filterType, selectedOption) => {
    const filterSetters = {
      brand: setSelectedBrand,
      unit: setSelectedUnit,
      merchant: setSelectedMerchant,
      paymentStatus: setSelectedPaymentStatus,
      sortBy: setSelectedSortBy,
      leadEmail: setLeadEmail,
      fromDate: setFromDate,
      toDate: setToDate,
      paymentFromDate: setPaymentFromDate,
      paymentToDate: setPaymentToDate,
    };

    filterSetters[filterType]?.(selectedOption);
  }, []);

  const handleApplyFilters = useCallback(() => {
    const query = buildQueryFromFilters();
    setActiveModal(null);
    setLiveQueryParams(query);
    setLiveCurrentPage(1);
    if (canViewTestCustomers) {
      setTestQueryParams(query);
      setTestCurrentPage(1);
    }
  }, [buildQueryFromFilters, canViewTestCustomers]);

  const handleGlobalSearch = useCallback(
    (newSearchTerm) => {
      handleLiveSearch(newSearchTerm);
      if (canViewTestCustomers) {
        handleTestSearch(newSearchTerm);
      }
    },
    [handleLiveSearch, handleTestSearch, canViewTestCustomers]
  );

  const handleReset = useCallback(() => {
    setSelectedBrand(null);
    setSelectedUnit(null);
    setSelectedMerchant(null);
    setSelectedPaymentStatus(null);
    setSelectedSortBy({ value: "created_at", label: "Created Date" });
    setLeadEmail("");
    setFromDate("");
    setToDate("");
    setPaymentFromDate("");
    setPaymentToDate("");
    setActiveModal(null);
    setLiveQueryParams({});
    if (canViewTestCustomers) {
      setTestQueryParams({});
    }
    handleGlobalSearch("");
    setLiveCurrentPage(1);
    if (canViewTestCustomers) {
      setTestCurrentPage(1);
    }
  }, [handleGlobalSearch, canViewTestCustomers]);

  const handleColumnVisibilityChange = (columnKey, isVisible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: isVisible,
    }));
  };

  const handleResetColumns = () => {
    const allVisible = {
      serial: true,
      brand: true,
      client: true,
      transaction: true,
      amount: true,
      date: true,
      status: true,
      notes: true,
      action: true,
    };
    setColumnVisibility(allVisible);
    toast.success("All columns restored");
  };

  const refetchTab = useCallback(
    (tab, overrides = {}) => {
      if (tab === "test") {
        return fetchTestData({
          page: testCurrentPage,
          limit: testPerPage,
          search: testSearchTerm,
          query: testQueryParams,
          ...overrides,
        });
      }

      return fetchLiveData({
        page: liveCurrentPage,
        limit: livePerPage,
        search: liveSearchTerm,
        query: liveQueryParams,
        ...overrides,
      });
    },
    [
      fetchLiveData,
      fetchTestData,
      liveCurrentPage,
      livePerPage,
      liveSearchTerm,
      liveQueryParams,
      testCurrentPage,
      testPerPage,
      testSearchTerm,
      testQueryParams,
    ]
  );

  const handleCreateLead = async (leadData) => {
    setSubmitting(true);

    setActiveModal(null);

    try {
      await apiAxios.post(ApiRequest.leads.create, leadData);
      toast.success("Customer created successfully!");

      setTimeout(() => {
        refetchTab("live", { force: true, silent: true });
        if (activeTab === "test" && canViewTestCustomers) {
          refetchTab("test", { force: true, silent: true });
        }
      }, 100);
    } catch (error) {
      console.error("Error creating lead:", error);
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLead = async (leadId, leadData) => {
    setSubmitting(true);

    setActiveModal(null);
    setSelectedLead(null);

    const targetTab = selectedLead?.is_test === "1" ? "test" : "live";

    try {
      await apiAxios.post(ApiRequest.leads.update(leadId), leadData);
      toast.success("Customer updated successfully!");

      setTimeout(() => {
        refetchTab(targetTab, { force: true, silent: true });
      }, 100);
    } catch (error) {
      console.error("Error updating lead:", error);
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
    setSubmitting(true);

    setActiveModal(null);
    setSelectedLead(null);

    const targetTab = selectedLead?.is_test === "1" ? "test" : "live";

    try {
      await apiAxios.delete(ApiRequest.leads.delete(selectedLead.id));
      toast.success("Customer deleted successfully!");

      setTimeout(() => {
        refetchTab(targetTab, { force: true, silent: true });
      }, 100);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTestStatus = (lead, makeTest = true) => {
    if (!lead?.id) return;
    setTestToggleAction({ lead, makeTest });
    setActiveModal("confirmTestToggle");
  };

  const confirmToggleTestStatus = async () => {
    if (!testToggleAction?.lead?.id) return;

    const { lead, makeTest } = testToggleAction;
    setSubmitting(true);

    setActiveModal(null);
    setTestToggleAction(null);

    try {
      await apiAxios.post(
        `${ApiRequest.leads.markTest}?lead_ids=${lead.id}&status=${
          makeTest ? 1 : 0
        }`
      );
      toast.success(
        makeTest
          ? "Customer moved to Test Customers"
          : "Customer restored to Live Customers"
      );

      setTimeout(() => {
        const refreshPromises = [
          refetchTab("live", { force: true, silent: true }),
        ];
        if (canViewTestCustomers) {
          refreshPromises.push(
            refetchTab("test", { force: true, silent: true })
          );
        }
        Promise.all(refreshPromises);
      }, 100);
    } catch (error) {
      console.error("Error toggling test status:", error);
      toast.error(
        error.response?.data?.message ||
          (makeTest ? "Failed to mark as test" : "Failed to restore customer")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (statusData) => {
    setSubmitting(true);

    setActiveModal(null);
    setSelectedLead(null);

    const targetTab = selectedLead?.is_test === "1" ? "test" : "live";

    try {
      await apiAxios.post(ApiRequest.leads.leadStatus(statusData.lead_id), {
        lead_status: statusData.lead_status,
      });

      toast.success("Customer status updated successfully!");

      setTimeout(() => {
        refetchTab(targetTab, { force: true, silent: true });
      }, 100);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async (noteData) => {
    setSubmitting(true);

    setActiveModal(null);
    setSelectedLead(null);

    try {
      await apiAxios.post(ApiRequest.leads.leadNotes(noteData.lead_id), {
        note: noteData.note,
      });
      toast.success("Note added successfully!");

      setTimeout(() => {
        const targetTab = selectedLead?.is_test === "1" ? "test" : "live";
        refetchTab(targetTab, { force: true, silent: true });
      }, 100);
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(error.response?.data?.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const hasAnyActionPermission =
    canViewCustomer ||
    canEditCustomer ||
    canDeleteCustomer ||
    canLeadUpdateStatus ||
    canCreateInvoice ||
    canMarkCustomer;

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedLead(row);
    closeDropdown();

    switch (action) {
      case "view":
        navigate(`/customer/${row.id}/details`);
        break;
      case "edit":
        setActiveModal("edit");
        break;
      case "updateStatus":
        setActiveModal("updateStatus");
        break;
      case "addNote":
        setActiveModal("addNote");
        break;
      case "contact":
        setActiveModal("contact");
        break;
      case "delete":
        setActiveModal("delete");
        break;
      case "invoice":
        navigate("/invoices/create", { state: { leadData: row } });
        break;
      case "flag":
        handleToggleTestStatus(row, true);
        break;
      case "unflag":
        handleToggleTestStatus(row, false);
        break;
      default:
        break;
    }
  };

  const maskEmail = (email) => {
    if (!email) return "N/A";
    const [localPart = "", domain = ""] = email.split("@");
    if (!localPart) return `***${domain ? `@${domain}` : ""}`;
    if (localPart.length <= 2) {
      return `${localPart[0] || ""}***${domain ? `@${domain}` : ""}`;
    }
    return `${localPart.slice(0, 2)}***${domain ? `@${domain}` : ""}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "N/A";
    const stringified = phone.toString();
    if (stringified.length <= 4) {
      return `${stringified[0] || ""}***`;
    }
    const prefix = stringified.slice(0, 3);
    const suffix = stringified.slice(-2);
    return `${prefix}***${suffix}`;
  };

  const handleSensitiveClose = () => {
    setActiveModal(null);
    setPendingSensitiveLead(null);
    setSensitiveReason("");
    setSensitiveError("");
  };

  const handleSensitiveRequest = (lead) => {
    if (!lead) return;
    if (revealedContacts[lead.id]?.visible) {
      setRevealedContacts((prev) => {
        const updated = { ...prev };
        delete updated[lead.id];
        return updated;
      });
      return;
    }
    setPendingSensitiveLead(lead);
    setSensitiveReason("");
    setSensitiveError("");
    setActiveModal("sensitiveModal");
  };

  const handleSensitiveSubmit = () => {
    if (!sensitiveReason.trim()) {
      setSensitiveError("Reason is required");
      return;
    }

    if (pendingSensitiveLead?.id) {
      setRevealedContacts((prev) => ({
        ...prev,
        [pendingSensitiveLead.id]: {
          visible: true,
          reason: sensitiveReason.trim(),
          viewedAt: new Date().toISOString(),
        },
      }));
      toast.success("Client info unlocked");
    }

    handleSensitiveClose();
  };

  const allColumns = [
    {
      key: "serial",
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
      sortable: false,
    },
    {
      key: "brand",
      name: "Brand",
      selector: (row) => row.brand?.title || "N/A",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-medium text-gray-900 text-sm truncate transition-colors dark:text-slate-200 max-w-[150px] inline-block">
            {row.brand?.title || "N/A"}
          </span>
          <div className="text-xs text-gray-500 mt-0.5 dark:text-slate-400">
            Merchant:{" "}
            {row?.merchant?.title ||
              row?.merchant?.name ||
              row?.merchant ||
              "N/A"}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 dark:text-slate-400">
            Unit: {row.unit?.title || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "client",
      name: "Client Info",
      selector: (row) => row.name || "N/A",
      sortable: true,
      cell: (row) => {
        const shouldShowDirectly = canViewSensitiveData;
        const isRevealed = Boolean(revealedContacts[row.id]?.visible);

        const displayEmail =
          shouldShowDirectly || isRevealed
            ? row.email || "N/A"
            : maskEmail(row.email);
        const displayPhone =
          shouldShowDirectly || isRevealed
            ? row.phone || "N/A"
            : maskPhone(row.phone);
        const hasSensitiveData = Boolean(row.email || row.phone);

        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 text-sm max-w-[225px] line-clamp-2 dark:text-slate-200">
              {row.name}
            </div>
            <div className="text-xs text-gray-500 max-w-[225px] flex items-center gap-1 dark:text-slate-400">
              <span className="truncate max-w-[150px]">{displayEmail}</span>

              {hasSensitiveData && !shouldShowDirectly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSensitiveRequest(row);
                  }}
                  className="text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                  title={
                    isRevealed
                      ? "Hide client contact details"
                      : "View client contact details"
                  }
                >
                  {isRevealed ? (
                    <BsEyeSlash className="size-3.5" />
                  ) : (
                    <BsEye className="size-3.5" />
                  )}
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[225px] dark:text-slate-400">
              {displayPhone}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[225px] dark:text-slate-400">
              {row.city || "N/A"}, {row.country || "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      name: "Amount Status",
      selector: (row) => row.transaction_id || "-",
      width: "150px",
      sortable: true,
      cell: (row) => (
        <div>
          {/* <div className="text-sm font-medium text-gray-900 dark:text-slate-200">
            ID: {row.transaction_id || "N/A"}
          </div> */}
          <div className="mt-0.5">
            Status:{" "}
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium capitalize inline-block ${
                row.transaction_status === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                  : row.transaction_status === "unpaid"
                  ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                  : ""
              }`}
            >
              {row.transaction_status === "paid" ? (
                <span>Paid - {`$${row.transaction_amount}`}</span>
              ) : (
                <span>
                  unPaid{" "}
                  {`${
                    row.transaction_amount !== null
                      ? row.transaction_amount
                      : ""
                  }`}
                </span>
              )}
              {/* {row.transaction_amount ? (
                <span className="text-green-800 font-bold dark:text-emerald-300">
                  ${row.transaction_amount}
                </span>
              ) : (
                "N/A"
              )} */}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      name: "Date",
      selector: (row) => row.transaction_date || row.created_at,
      width: "120px",
      sortable: true,
      cell: (row) => (
        <div className="text-sm text-gray-600 dark:text-slate-300">
          <div>
            {row.transaction_date
              ? new Date(row.transaction_date).toLocaleDateString()
              : new Date(row.created_at).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 dark:text-slate-400">
            Source: {row.created_by_name || "website"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      name: "Customer Status",
      selector: (row) => row.lead_status || "new",
      width: "160px",
      sortable: true,
      cell: (row) => {
        const status = row.lead_status || "new";
        const statusConfig = {
          new: {
            bg: "bg-blue-100 dark:bg-blue-500/15",
            text: "text-blue-800 dark:text-blue-200",
            label: "New Customer",
          },
          contacted: {
            bg: "bg-yellow-100 dark:bg-yellow-500/15",
            text: "text-yellow-800 dark:text-yellow-200",
            label: "Contacted",
          },
          qualified: {
            bg: "bg-green-100 dark:bg-green-500/15",
            text: "text-green-800 dark:text-green-200",
            label: "Qualified",
          },
          fake: {
            bg: "bg-purple-100 dark:bg-purple-500/15",
            text: "text-purple-800 dark:text-purple-200",
            label: "Fake",
          },
          converted: {
            bg: "bg-emerald-100 dark:bg-emerald-500/15",
            text: "text-emerald-800 dark:text-emerald-200",
            label: "Converted",
          },
          lost: {
            bg: "bg-red-100 dark:bg-red-500/15",
            text: "text-red-800 dark:text-red-200",
            label: "Lost",
          },
          follow_up: {
            bg: "bg-indigo-100 dark:bg-indigo-500/15",
            text: "text-indigo-800 dark:text-indigo-200",
            label: "Follow Up",
          },
          not_interested: {
            bg: "bg-rose-100 dark:bg-rose-500/15",
            text: "text-rose-800 dark:text-rose-200",
            label: "Not Interested",
          },
        };
        const config = statusConfig[status] || statusConfig.new;

        return (
          <div className="space-y-1.5">
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${config.bg} ${config.text}`}
            >
              {config.label}
            </div>
            {canLeadUpdateStatus && (
              <button
                onClick={() => handleAction("updateStatus", row)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <BsArrowRepeat className="h-3 w-3" />
                Update
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: "notes",
      name: "Notes",
      selector: (row) => row.notes_count || 0,
      width: "160px",
      sortable: true,
      cell: (row) => {
        const notesCount = row.notes_count || 0;
        const latestNote = row.latest_note || null;
        const leadNotes = row.lead_notes || [];
        const displayNotes = leadNotes.slice(0, 5);

        return (
          <div className="space-y-1 relative group">
            <div className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 text-gray-500 dark:text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-200">
                {notesCount} {notesCount === 1 ? "note" : "notes"}
              </span>
            </div>
            {latestNote && (
              <div
                className="text-xs text-gray-500 truncate max-w-[120px] dark:text-slate-400"
                title={latestNote}
              >
                {latestNote}
              </div>
            )}
            <button
              onClick={() => handleAction("addNote", row)}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
            >
              <BsPlus className="h-3.5 w-3.5" />
              Add Note
            </button>

            {/* Notes Tooltip */}
            {displayNotes.length > 0 && (
              <div className="absolute left-0 top-full mt-1 w-max bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-3 z-50 hidden group-hover:block">
                <div className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Recent Notes ({displayNotes.length})
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {displayNotes.map((note, index) => (
                    <div
                      key={note.id || index}
                      className="border-b border-gray-100 dark:border-slate-700 pb-2 last:border-0"
                    >
                      <div className="text-xs text-gray-800 dark:text-slate-200 mb-1">
                        {note.note}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-slate-400">
                        <span className="font-medium">
                          {note.created_by?.name || "Unknown"}
                        </span>
                        <span>
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: "Contact",
      key: "Contact",
      sortable: false,
      width: "180px",
      cell: (row) => (
        <>
          <button
            onClick={() => handleAction("contact", row)}
            className="btn btn-primary text-xs"
          >
            Communication
          </button>
        </>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            key: "action",
            name: "Action",
            width: "80px",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
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
                  {canViewCustomer && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View Details"
                    />
                  )}
                  {row.transaction_status !== "paid" && canEditCustomer && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit Customer"
                    />
                  )}

                  <DropdownDivider />

                  {row.is_test === "1"
                    ? canMarkCustomer && (
                        <DropdownItem
                          onClick={() => handleAction("unflag", row)}
                          icon={
                            <BsCheckCircleFill
                              className="text-emerald-600"
                              size={16}
                            />
                          }
                          label="Move to Live"
                        />
                      )
                    : canMarkCustomer && (
                        <DropdownItem
                          onClick={() => handleAction("flag", row)}
                          icon={
                            <BsFlagFill className="text-orange-500" size={16} />
                          }
                          label="Mark as Test"
                        />
                      )}
                  {row.transaction_status !== "paid" && (
                    <>
                      <DropdownDivider />

                      {canCreateInvoice && (
                        <DropdownItem
                          onClick={() => handleAction("invoice", row)}
                          icon="🧾"
                          label="Create Invoice"
                        />
                      )}

                      {canDeleteCustomer && (
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

  const visibleColumns = useMemo(
    () => allColumns.filter((column) => columnVisibility[column.key]),
    [columnVisibility, allColumns]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === "test" && !testTabEnabled && canViewTestCustomers) {
      setTestTabEnabled(true);
    }
    if (tab === "live") {
      setLiveCurrentPage(1);
    } else {
      setTestCurrentPage(1);
    }
  };

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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customer List</h1>
          <p className="text-gray-600 mt-0.5 dark:text-slate-400">
            Manage and track your customer ({totalRows} total)
          </p>
        </div>

        <div className="flex gap-3">
          {/* Search */}
          <SearchBox
            onSearch={handleGlobalSearch}
            placeholder="Search customers..."
            size="md"
            className="w-64"
          />

          {/* Columns Button */}
          <button
            onClick={() => setActiveModal("columns")}
            className="btn btn-black"
          >
            <BsColumns size={20} />
            Columns
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setActiveModal("filters")}
            className={`btn btn-black relative ${
              hasActiveFilters ? "btn-primary" : ""
            }`}
          >
            <BsFilter size={20} />
            Filters
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

          {/* ✅ Refresh Button - Direct use of refresh() */}
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

          {/* Add Customer Button */}
          {/* {canCreateCustomer && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Customer
            </button>
          )} */}
        </div>
      </div>

      {/* Tabs - Only show if user can view test customers */}
      {canViewTestCustomers ? (
        <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden dark:bg-slate-900/70 dark:border-slate-700/60">
          <div className="flex">
            <button
              onClick={() => handleTabChange("live")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "live"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BsCheckCircleFill size={18} />
                <span>Live Customers</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "live"
                      ? "bg-green-600 text-white dark:bg-green-500"
                      : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {liveTotalRows}
                </span>
              </div>
              {activeTab === "live" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 dark:bg-green-400" />
              )}
            </button>

            <button
              onClick={() => handleTabChange("test")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "test"
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BsExclamationTriangle size={18} />
                <span>Test Customers</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "test"
                      ? "bg-orange-500 text-white dark:bg-orange-400"
                      : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {testTotalRows}
                </span>
              </div>
              {activeTab === "test" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 dark:bg-orange-400" />
              )}
            </button>
          </div>
        </div>
      ) : null}

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
              {selectedSortBy?.value &&
                selectedSortBy.value !== "created_at" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs dark:bg-blue-900/40 dark:text-blue-100">
                    Sort By: {selectedSortBy.label}
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

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={visibleColumns}
          data={leads}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center dark:bg-slate-800">
              <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                {activeTab === "live" ? (
                  <BsCheckCircleFill className="mx-auto" size={48} />
                ) : (
                  <BsExclamationTriangle className="mx-auto" size={48} />
                )}
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                {activeTab === "live"
                  ? "No live customers found"
                  : "No test customers found"}
              </div>
              <div className="text-sm text-gray-400 mt-0.5 dark:text-slate-500">
                Try adjusting your search terms or filters
              </div>
            </div>
          }
        />
      </div>

      <SensitiveModal
        open={activeModal === "sensitiveModal"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleSensitiveSubmit}
        lead={pendingSensitiveLead}
        reason={sensitiveReason}
        setReason={setSensitiveReason}
        error={sensitiveError}
        setError={setSensitiveError}
      />

      {/* Filters Offcanvas */}
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

      {/* Columns Configuration Offcanvas */}
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

      {/* Modals */}
      <AddLeadModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateLead}
        loading={submitting}
      />

      <EditLeadModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSubmit={(leadData) => handleUpdateLead(selectedLead?.id, leadData)}
        loading={submitting}
        brands={brands}
      />

      <UpdateStatusModal
        open={activeModal === "updateStatus"}
        onClose={() => {
          setActiveModal(null);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSubmit={handleUpdateStatus}
        loading={submitting}
      />

      <AddNoteModal
        open={activeModal === "addNote"}
        onClose={() => {
          setActiveModal(null);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSubmit={handleAddNote}
        loading={submitting}
      />

      <DeleteLeadModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onConfirm={handleDeleteLead}
        loading={submitting}
      />

      <ConfirmTestToggleModal
        open={activeModal === "confirmTestToggle"}
        onClose={() => {
          setActiveModal(null);
          setTestToggleAction(null);
        }}
        onConfirm={confirmToggleTestStatus}
        loading={submitting}
        testToggleAction={testToggleAction}
      />

      <Communication
        open={activeModal === "contact"}
        onClose={() => setActiveModal(null)}
        lead={selectedLead}
      />
    </>
  );
};

export default Customer;
