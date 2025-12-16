import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";
import DataTable from "react-data-table-component";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import Communication from "./Communication";
import {
  BsFillMapFill,
  BsFillPersonFill,
  BsFillTelephoneFill,
  BsEnvelope,
  BsArrowRepeat,
} from "react-icons/bs";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const LeadDetails = () => {
  const canViewInvoices = usePermission(["invoice.index"]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [assignedUser, setAssignedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leadPriority, setLeadPriority] = useState(null);
  const [openCommunication, setOpenCommunication] = useState(false);

  const {
    data: leadNotes,
    loading: notesLoading,
    totalRows: notesTotalRows,
    currentPage: notesCurrentPage,
    perPage: notesPerPage,
    searchTerm,
    setCurrentPage: setNotesCurrentPage,
    setPerPage: setNotesPerPage,
    handleSearch,
    refresh: refreshNotes,
    fetchData,
  } = usePaginatedData(canViewInvoices ? ApiRequest.leads.leadNotes(id) : null);
  // console.log(leadNotes);

  const selectStyles = useSelectStyles();

  const {
    data: invoices,
    loading: invoicesLoading,
    totalRows: invoicesTotalRows,
    currentPage: invoicesCurrentPage,
    perPage: invoicesPerPage,
    setCurrentPage: setInvoicesCurrentPage,
    setPerPage: setInvoicesPerPage,
    refresh: refreshInvoices,
    queryParams: invoiceQueryParams,
    setQueryParams: setInvoiceQueryParams,
  } = usePaginatedData(ApiRequest.leads.invoices(id));

  const formatCurrency = (value, symbol = "$") => {
    const amount = Number(value) || 0;
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDateValue = (value, withTime = false) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    if (withTime) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return date.toLocaleDateString();
  };

  const buildInvoiceUrl = (invoice) => {
    const baseLink = invoice?.brand?.invoice_link;
    const token = invoice?.invoice_no || invoice?.slug;
    if (!baseLink || !token) return null;
    if (baseLink.endsWith("=") || baseLink.includes("?invoice=")) {
      return `${baseLink}${token}`;
    }
    const separator = baseLink.includes("?") ? "&invoice=" : "?invoice=";
    return `${baseLink}${separator}${token}`;
  };

  const getInvoiceStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    const baseClass =
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize";

    switch (normalized) {
      case "paid":
        return (
          <span
            className={`${baseClass} bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300`}
          >
            Paid
          </span>
        );
      case "pending":
      case "unpaid":
        return (
          <span
            className={`${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200`}
          >
            {status}
          </span>
        );
      case "failed":
      case "declined":
        return (
          <span
            className={`${baseClass} bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300`}
          >
            {status}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClass} bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200`}
          >
            {status || "Unpaid"}
          </span>
        );
    }
  };

  const fetchLeadDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiAxios.get(`/leads/${id}/show`);
      setLead(response.data);
      setLeadStatus(response.data.lead_status || "new");
    } catch (error) {
      console.error("Error fetching lead details:", error);
      toast.error("Failed to fetch lead details");
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // const fetchSupportingData = useCallback(async () => {
  //   try {
  //     const usersResponse = await apiAxios.get(
  //       ApiRequest.users.list + "?per_page=100"
  //     );
  //     setAvailableUsers(usersResponse.data?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching supporting data:", error);
  //   }
  // }, []);

  useEffect(() => {
    fetchLeadDetails();
    // fetchSupportingData();
  }, [fetchLeadDetails]);

  useEffect(() => {
    if (activeTab === "invoices" && canViewInvoices) {
      refreshInvoices();
    }
  }, [activeTab, canViewInvoices, refreshInvoices]);

  useEffect(() => {
    if (activeTab === "notes") {
      refreshNotes();
    }
  }, [activeTab]);

  // const handleStatusUpdate = async (newStatus) => {
  //   setSubmitting(true);
  //   try {
  //     setLeadStatus(newStatus);
  //     toast.success("Lead status updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating lead status:", error);
  //     toast.error("Failed to update lead status");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleAssignUser = async (userId) => {
  //   setSubmitting(true);
  //   try {
  //     const user = availableUsers.find((u) => u.id === userId);
  //     setAssignedUser(user);
  //     toast.success(`Lead assigned to ${user?.name}`);
  //   } catch (error) {
  //     console.error("Error assigning lead:", error);
  //     toast.error("Failed to assign lead");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.leads.leadNotes(id), {
        note: newNote.trim(),
      });
      setNewNote("");
      toast.success("Note added successfully!");
      refreshNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(error?.response?.data?.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full size-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <div className="text-gray-500 dark:text-slate-400">Lead not found</div>
        <button
          onClick={() => navigate("/leads")}
          className="btn btn-primary mt-4"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const groupedLeadData =
    lead.lead_data?.reduce((groups, item) => {
      const step = `Step ${item.lead_step}`;
      if (!groups[step]) {
        groups[step] = [];
      }
      groups[step].push(item);
      return groups;
    }, {}) || {};

  const parseCartData = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const calculateLeadScore = () => {
    let score = 0;
    if (lead.email) score += 20;
    if (lead.phone) score += 15;
    if (lead.transaction_amount && parseFloat(lead.transaction_amount) > 0)
      score += 30;
    if (lead.lead_data && lead.lead_data.length > 5) score += 20;
    if (lead.transaction_status === "paid") score += 15;
    return Math.min(score, 100);
  };

  const leadScore = calculateLeadScore();
  const hasPaymentData = lead.lead_payment && lead.lead_payment.length > 0;
  const latestPayment = hasPaymentData ? lead.lead_payment[0] : null;

  const getTransactionAmount = () => {
    if (latestPayment && latestPayment.transaction_amount) {
      return latestPayment.transaction_amount;
    }
    return lead.transaction_amount || "0.00";
  };

  const getTransactionStatus = () => {
    if (latestPayment && latestPayment.status) {
      return latestPayment.status === "accept" ? "paid" : latestPayment.status;
    }
    return lead.transaction_status || "unpaid";
  };

  const getTransactionId = () => {
    if (latestPayment && latestPayment.transaction_id) {
      return latestPayment.transaction_id;
    }
    return lead.transaction_id || "N/A";
  };

  const getTransactionDate = () => {
    if (latestPayment && latestPayment.transaction_date) {
      return latestPayment.transaction_date;
    }
    return lead.transaction_date;
  };

  const displayTransactionAmount = getTransactionAmount();
  const displayTransactionStatus = getTransactionStatus();
  const displayTransactionId = getTransactionId();
  const displayTransactionDate = getTransactionDate();
  const invoiceTotals = calculateInvoiceTotals();

  function calculateInvoiceTotals() {
    const total = invoices.reduce(
      (sum, inv) => sum + (Number(inv.transaction_amount) || 0),
      0
    );
    const paid = invoices
      .filter((inv) => inv.transaction_status === "paid")
      .reduce((sum, inv) => sum + (Number(inv.transaction_amount) || 0), 0);
    const unpaid = total - paid;
    return { total, paid, unpaid };
  }

  return (
    <div className="space-y-6 text-gray-800 transition-colors duration-300 dark:text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/leads")}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800/70"
            title="Back to Leads"
          >
            <svg
              className="size-6 text-gray-600 transition-colors dark:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Lead #{lead.id}</h1>
            <p className="text-gray-600 dark:text-slate-400">
              {lead.name} • {lead.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenCommunication(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <BsEnvelope className="size-4" />
            Communication
          </button>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              displayTransactionStatus === "paid"
                ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                : displayTransactionStatus === "unpaid"
                ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200"
            }`}
          >
            {displayTransactionStatus === "paid"
              ? "Paid"
              : displayTransactionStatus === "unpaid"
              ? "Unpaid"
              : displayTransactionStatus}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "details", label: "Lead Details", icon: "📋" },
            {
              id: "invoices",
              label: "Invoices",
              icon: "🧾",
              permission: canViewInvoices,
            },
            { id: "notes", label: "Notes & Comments", icon: "💬" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ]
            .filter((tab) => tab.permission !== false)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
        </nav>
      </div>

      {/* Tab Content - Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-600 dark:text-slate-300">
                    <BsFillPersonFill size={18} />
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-slate-100">
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {lead.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-600 dark:text-slate-300">
                    <BsFillTelephoneFill size={18} />
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-slate-100">
                      {lead.phone}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      Phone Number
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-600 dark:text-slate-300">
                    <BsFillMapFill size={18} />
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-slate-100">
                      {lead.city}, {lead.region}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {lead.country} • IP: {lead.ip}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Status
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      displayTransactionStatus === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                        : displayTransactionStatus === "unpaid"
                        ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200"
                    }`}
                  >
                    {displayTransactionStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Amount
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-emerald-300">
                    ${displayTransactionAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Transaction ID
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {displayTransactionId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Date
                  </span>
                  <span className="text-sm text-gray-700 dark:text-slate-300">
                    {displayTransactionDate
                      ? new Date(displayTransactionDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {hasPaymentData && (
              <div className="card">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Card Holder
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {latestPayment.customer_c_name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Card Number
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {latestPayment.customer_c_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Address
                    </span>
                    <span className="text-right font-medium text-gray-900 dark:text-slate-100">
                      {latestPayment.customer_c_address || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Postcode
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {latestPayment.customer_c_postcode || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Information */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                Brand Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-600 dark:text-slate-300">
                    🏢
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-slate-100">
                      {lead.brand?.title}
                    </div>
                    <a
                      href={lead.brand?.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 transition-colors hover:underline dark:text-blue-300"
                    >
                      {lead.brand?.domain}
                    </a>
                  </div>
                </div>
                {lead.brand?.teams && lead.brand.teams.length > 0 && (
                  <div>
                    <div className="mb-1 text-sm text-gray-600 dark:text-slate-400">
                      Associated Teams:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lead.brand.teams.map((team) => (
                        <span
                          key={team.id}
                          className="rounded px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                        >
                          {team.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Items */}
            {lead.cart_items && lead.cart_items.length > 0 && (
              <div className="card">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Cart Items
                </h3>
                <div className="space-y-2">
                  {lead.cart_items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-slate-100">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          Qty: {item.quantity} • {item.package_type}
                        </div>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        ${item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <span className="text-sm text-blue-600 dark:text-blue-300">
                    📧
                  </span>
                </div>
                <div>
                  <p className="mb-0 text-sm font-medium text-gray-900 dark:text-slate-100">
                    Lead Created
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString()} via website
                  </p>
                </div>
              </div>
              {displayTransactionAmount &&
                parseFloat(displayTransactionAmount) > 0 && (
                  <div className="flex gap-3">
                    <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-amber-500/20">
                      <span className="text-sm text-yellow-600 dark:text-amber-200">
                        💳
                      </span>
                    </div>
                    <div>
                      <p className="mb-0 text-sm font-medium text-gray-900 dark:text-slate-100">
                        {displayTransactionStatus === "paid"
                          ? "Payment Completed"
                          : "Payment Attempted"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        ${displayTransactionAmount} • {displayTransactionStatus}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Details */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {Object.entries(groupedLeadData).map(([step, stepData]) => (
            <div
              key={step}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-700/60 dark:bg-slate-900/60"
            >
              <div className="border-b border-blue-200 bg-blue-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/70">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                  {step}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {stepData.map((item) => {
                    const parsedCart = parseCartData(item.lead_value);
                    return (
                      <div key={item.id} className="card p-4">
                        <div className="mb-2 font-medium text-gray-900 dark:text-slate-100">
                          {item.lead_key}
                        </div>
                        {parsedCart ? (
                          <div className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-slate-800/60">
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-slate-300">
                              {Object.entries(parsedCart).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between gap-4"
                                  >
                                    <span className="capitalize">
                                      {key.replace("_", " ")}:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">
                                      {typeof value === "boolean"
                                        ? value
                                          ? "Yes"
                                          : "No"
                                        : value}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded px-3 py-2 text-gray-700 dark:bg-slate-800/60 dark:text-slate-300">
                            {item.lead_value}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* **Tab Content - Invoices** */}
      {activeTab === "invoices" && canViewInvoices && (
        <div className="space-y-6">
          {/* Invoice Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                Total Invoices
              </h3>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  {invoices.length}
                </div>
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {formatCurrency(invoiceTotals.total)}
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <h3 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
                Paid Invoices
              </h3>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-green-600 dark:text-green-300">
                  {
                    invoices.filter((inv) => inv.transaction_status === "paid")
                      .length
                  }
                </div>
                <div className="text-lg font-semibold text-green-700 dark:text-green-400">
                  {formatCurrency(invoiceTotals.paid)}
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <h3 className="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                Unpaid Invoices
              </h3>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-red-600 dark:text-red-300">
                  {
                    invoices.filter((inv) => inv.transaction_status !== "paid")
                      .length
                  }
                </div>
                <div className="text-lg font-semibold text-red-700 dark:text-red-400">
                  {formatCurrency(invoiceTotals.unpaid)}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Invoice List
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={refreshInvoices}
                  disabled={invoicesLoading}
                  className="btn btn-black"
                  title="Refresh invoices"
                >
                  {invoicesLoading ? (
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <BsArrowRepeat />
                  )}
                </button>
                <button
                  onClick={() => setInvoiceQueryParams({})}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !invoiceQueryParams.payment_status
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() =>
                    setInvoiceQueryParams({ payment_status: "paid" })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    invoiceQueryParams.payment_status === "paid"
                      ? "bg-green-600 text-white dark:bg-green-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() =>
                    setInvoiceQueryParams({ payment_status: "unpaid" })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    invoiceQueryParams.payment_status === "unpaid"
                      ? "bg-red-600 text-white dark:bg-red-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  Unpaid
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            {invoicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full size-10 border-b-2 border-blue-600"></div>
              </div>
            ) : invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-800/60">
                    <tr>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Customer
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Invoice / Brand
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Merchant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Created / Due
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900/40 divide-y divide-gray-200 dark:divide-slate-700">
                    {invoices.map((invoice) => {
                      const invoiceUrl = buildInvoiceUrl(invoice);
                      const currencySymbol =
                        invoice.merchant?.currency_symbol || "$";

                      const teamTitle = invoice.team?.title;
                      return (
                        <tr
                          key={invoice.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 dark:text-slate-100">
                              {customerName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              {customerEmail}
                            </div>
                            {customerPhone && (
                              <div className="text-xs text-gray-400 dark:text-slate-500">
                                {customerPhone}
                              </div>
                            )}
                          </td> */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              {invoice.invoice_no}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              {invoice.brand?.title || "Unknown brand"}
                              {teamTitle ? ` \u2022 ${teamTitle}` : ""}
                            </div>

                            {invoice.brand?.domain && (
                              <a
                                href={invoice.brand.domain}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                              >
                                View Site
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-semibold text-green-600 dark:text-emerald-400">
                              {`${currencySymbol}${parseFloat(
                                invoice.transaction_amount || 0
                              ).toLocaleString()}`}
                              {/* {formatCurrency(
                                invoice.transaction_amount,
                                currencySymbol
                              )} */}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getInvoiceStatusBadge(invoice.payment_status)}
                            {invoice.paid_at && (
                              <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                Paid {formatDateValue(invoice.paid_at, true)}
                              </div>
                            )}
                            {invoice.merchant_status && (
                              <div className="text-xs text-gray-400 dark:text-slate-500">
                                {invoice.merchant_status}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-slate-100">
                              {invoice.merchant?.title || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              {invoice.merchant?.merchant_key}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-slate-100">
                              By: {invoice.created_by?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              Created{" "}
                              {formatDateValue(invoice.created_at, true)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                invoiceUrl
                                  ? "border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700/60 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                  : "cursor-not-allowed border-gray-200 text-gray-400 dark:border-slate-700 dark:text-slate-500"
                              }`}
                              onClick={() =>
                                invoiceUrl &&
                                window.open(invoiceUrl, "_blank", "noopener")
                              }
                              disabled={!invoiceUrl}
                            >
                              View Invoice
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🧾</div>
                <div className="text-gray-500 dark:text-slate-400 text-lg">
                  No invoices found
                </div>
                <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">
                  {!invoiceQueryParams.transaction_status
                    ? "This lead doesn't have any invoices yet."
                    : `No ${invoiceQueryParams.transaction_status} invoices available.`}
                </p>
              </div>
            )}

            {/* Pagination */}
            {invoices.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-700">
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Showing {(invoicesCurrentPage - 1) * invoicesPerPage + 1} to{" "}
                  {Math.min(
                    invoicesCurrentPage * invoicesPerPage,
                    invoicesTotalRows
                  )}{" "}
                  of {invoicesTotalRows} invoices
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setInvoicesCurrentPage(invoicesCurrentPage - 1)
                    }
                    disabled={invoicesCurrentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    Page {invoicesCurrentPage} of{" "}
                    {Math.ceil(invoicesTotalRows / invoicesPerPage)}
                  </span>
                  <button
                    onClick={() =>
                      setInvoicesCurrentPage(invoicesCurrentPage + 1)
                    }
                    disabled={
                      invoicesCurrentPage >=
                      Math.ceil(invoicesTotalRows / invoicesPerPage)
                    }
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content - Notes */}
      {activeTab === "notes" && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Notes & Comments
            </h3>
            <button
              onClick={refreshNotes}
              disabled={notesLoading}
              className="btn btn-black"
              title="Refresh notes"
            >
              {notesLoading ? (
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
              )}
              Refresh
            </button>
          </div>

          <div className="mb-6">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="form-control w-full"
              rows="3"
              placeholder="Add a note about this lead..."
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim() || submitting}
              className="mt-2 btn btn-primary"
            >
              {submitting ? "Adding..." : "Add Note"}
            </button>
          </div>

          <div className="card overflow-hidden p-0">
            <DataTable
              className="tm-data-table"
              columns={[
                {
                  name: "#",
                  selector: (row, index) =>
                    (notesCurrentPage - 1) * notesPerPage + index + 1,
                  width: "60px",
                  sortable: false,
                },
                {
                  name: "Note",
                  selector: (row) => row.note,
                  sortable: false,
                  cell: (row) => (
                    <div>
                      <p className="text-sm text-gray-900 dark:text-slate-100 whitespace-pre-wrap">
                        {row.note}
                      </p>
                    </div>
                  ),
                },
                {
                  name: "Created By",
                  selector: (row) => row.created_by?.name,
                  sortable: true,
                  cell: (row) => (
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {row.created_by?.name || "Unknown User"}
                      </div>
                      {row.created_by?.email && (
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {row.created_by.email}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  name: "Date",
                  selector: (row) => row.created_at,
                  sortable: true,
                  width: "180px",
                  cell: (row) => (
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      {new Date(row.created_at).toLocaleString()}
                    </span>
                  ),
                },
              ]}
              dense
              highlightOnHover
              pointerOnHover
              responsive
              data={leadNotes}
              progressPending={notesLoading}
              pagination
              paginationServer
              paginationTotalRows={notesTotalRows}
              paginationDefaultPage={notesCurrentPage}
              paginationPerPage={notesPerPage}
              paginationRowsPerPageOptions={[10, 15, 20, 25, 50]}
              onChangePage={setNotesCurrentPage}
              onChangeRowsPerPage={(newPerPage, page) => {
                setNotesPerPage(newPerPage);
                setNotesCurrentPage(page);
              }}
              noDataComponent={
                <div className="w-full py-12 text-center dark:bg-slate-800 text-sm text-gray-400 dark:text-slate-500">
                  No notes added yet. Be the first to add a note about this
                  lead.
                </div>
              }
            />
          </div>
        </div>
      )}

      {/* Tab Content - Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
              Lead Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-slate-400">
                  Time to Contact
                </span>
                <span className="font-medium text-gray-900 dark:text-slate-100">
                  Not contacted
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-slate-400">
                  Source
                </span>
                <span className="font-medium text-gray-900 dark:text-slate-100">
                  Website
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
              Revenue Potential
            </h3>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600 dark:text-emerald-300">
                ${displayTransactionAmount}
              </div>
              <p className="mb-0 text-sm text-gray-600 dark:text-slate-400">
                {displayTransactionStatus === "paid"
                  ? "Realized Revenue"
                  : "Potential Revenue"}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
              Conversion Probability
            </h3>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-300">
                {displayTransactionStatus === "paid"
                  ? "100%"
                  : `${Math.max(leadScore - 20, 0)}%`}
              </div>
              <p className="mb-0 text-sm text-gray-600 dark:text-slate-400">
                Based on lead score and engagement
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email History Modal */}
      <Communication
        open={openCommunication}
        onClose={() => setOpenCommunication(false)}
        lead={lead}
      />
    </div>
  );
};

export default LeadDetails;
