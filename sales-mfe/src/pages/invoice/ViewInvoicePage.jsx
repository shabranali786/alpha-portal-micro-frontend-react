import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BsArrowLeft,
  BsPrinter,
  BsDownload,
  BsPencil,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

const ViewInvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [openPaymentCards, setOpenPaymentCards] = useState({});

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await apiAxios.get(ApiRequest.invoices.show(id));
        // console.log("show invoice", response.data);
        if (response.data) {
          setInvoice(response.data);
        } else {
          toast.error("Invoice not found");
          navigate("/invoices");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error(error.response?.data?.message || "Failed to load invoice");
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleDownload = () => {
    toast.success("Downloading invoice...");
  };

  const parsePaymentReason = (reasonString) => {
    try {
      return JSON.parse(reasonString);
    } catch (error) {
      console.error("Error parsing payment reason:", error);
      return null;
    }
  };

  const togglePaymentCard = (paymentId) => {
    setOpenPaymentCards((prev) => ({
      ...prev,
      [paymentId]: !prev[paymentId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center transition-colors duration-300 dark:bg-[var(--color-body)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const calculateTotals = () => {
    const items = invoice.invoice_items || [];
    const subtotal = items.reduce((sum, item) => {
      return sum + parseFloat(item.price || 0) * parseInt(item.qty || 0);
    }, 0);

    return {
      subtotal,
      discount: 0,
      tax: 0,
      total: parseFloat(invoice.transaction_amount || subtotal),
    };
  };

  const totals = calculateTotals();
  const currencySymbol = invoice.merchant?.currency_symbol || "$";

  const getCustomerHistory = () => {
    return {
      total_invoices: 12,
      total_paid: 9,
      total_pending: 2,
      total_overdue: 1,
      total_revenue: 185000,
      average_invoice_value: 15416,
      customer_since: invoice.lead?.created_at || "2024-03-15",
      last_payment_date: invoice.paid_at || "2025-01-20",
      payment_trends: {
        on_time: 75,
        late: 16.67,
        very_late: 8.33,
      },
      recent_invoices: [
        {
          id: invoice.id,
          invoice_number: invoice.invoice_no,
          amount: parseFloat(invoice.transaction_amount || 0),
          status: invoice.status,
          payment_status: invoice.transaction_status,
          issue_date: invoice.created_at,
          due_date: invoice.due_date,
        },
      ],
    };
  };

  const customerHistory = getCustomerHistory();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-slate-900/80 dark:border-slate-700/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/invoices")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800/70 dark:text-slate-200"
              >
                <BsArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{invoice.invoice_no}</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Invoice details and customer history
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                <BsDownload size={16} /> Download
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                <BsPrinter size={16} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 dark:bg-slate-900/70 dark:border-slate-700/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span className="mr-2">📊</span>
              Invoice Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span className="mr-2">📋</span>
              Customer History
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span className="mr-2">🖨️</span>
              Print Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-colors dark:border-blue-500/20 dark:from-slate-900/80 dark:to-slate-800/80">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {invoice.invoice_no}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Invoice ID: {invoice.id} • Type: {invoice.type || "N/A"} •
                    Created on{" "}
                    {new Date(invoice.created_at).toLocaleDateString()} at{" "}
                    {new Date(invoice.created_at).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 mb-0">
                    View Payment Invoice:{" "}
                    <a
                      className="text-green-800 dark:text-green-200 underline"
                      target="_blank"
                      href={invoice.brand.invoice_link + "" + invoice.slug}
                    >
                      Show
                    </a>
                  </p>
                </div>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${
                      invoice.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-slate-700/40 dark:text-slate-200"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${
                      invoice.transaction_status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                        : invoice.transaction_status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200"
                        : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                    }`}
                  >
                    {invoice.transaction_status || "unpaid"}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Information */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">
                  Customer / Lead Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Lead ID
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      #{invoice.lead?.id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Name
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.lead?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Email
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.lead?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Phone
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.lead?.phone || "N/A"}
                    </p>
                  </div>
                  {(invoice.lead?.city ||
                    invoice.lead?.region ||
                    invoice.lead?.country) && (
                    <div>
                      <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                        Location
                      </span>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {[
                          invoice.lead.city,
                          invoice.lead.region,
                          invoice.lead.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  {invoice.lead?.ip && (
                    <div>
                      <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                        IP Address
                      </span>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {invoice.lead.ip}
                      </p>
                    </div>
                  )}
                  {invoice.lead?.url && (
                    <div>
                      <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                        URL
                      </span>
                      <p className="font-medium text-blue-600 dark:text-blue-400 break-all">
                        <a
                          href={invoice.lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {invoice.lead.url}
                        </a>
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Lead Created
                    </span>
                    <p className="text-sm text-gray-900 dark:text-slate-100">
                      {invoice.lead?.created_at
                        ? new Date(invoice.lead.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">
                  Assignment Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Brand
                    </span>
                    <a
                      href={invoice.brand.domain}
                      className="font-medium text-gray-900 dark:text-slate-100 hover:text-blue-600"
                    >
                      {invoice.brand?.title || "N/A"}
                    </a>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Team
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.team?.title || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Merchant
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100 mb-0">
                      {invoice.merchant?.title || "N/A"}
                    </p>
                    {invoice.merchant?.merchant_key && (
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Key: {invoice.merchant.merchant_key} •{" "}
                        {invoice.merchant.type} • {invoice.merchant.environment}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Created By
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice?.lead?.created_by_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details (if paid) */}
            {invoice.transaction_id && (
              <div className="card bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-500/20">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">
                  Payment Transaction Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Transaction ID
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.transaction_id}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Amount Paid
                    </span>
                    <p className="font-semibold text-green-600 dark:text-emerald-300">
                      {currencySymbol}{" "}
                      {parseFloat(
                        invoice.transaction_amount || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Payment Status
                    </span>
                    <p className="font-medium text-gray-900 capitalize dark:text-slate-100">
                      {invoice.transaction_status || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Paid At
                    </span>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {invoice.paid_at
                        ? new Date(invoice.paid_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Items */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Invoice Items / Services
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-900 dark:text-slate-100">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700/60">
                      <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
                        #
                      </th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
                        Service / Description
                      </th>
                      <th className="text-center py-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
                        Quantity
                      </th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
                        Unit Price
                      </th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.invoice_items?.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b border-gray-100 last:border-none dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-slate-100">
                          <div className="font-medium">{item.service}</div>
                          {item.id && (
                            <div className="text-xs text-gray-500 dark:text-slate-500">
                              Item ID: {item.id}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-900 dark:text-slate-100">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900 dark:text-slate-100">
                          {currencySymbol}{" "}
                          {parseFloat(item.price || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-slate-100">
                          {currencySymbol}{" "}
                          {(
                            parseFloat(item.price || 0) *
                            parseInt(item.qty || 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 dark:border-slate-700/60">
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-right font-medium text-gray-700 dark:text-slate-300"
                      >
                        Subtotal:
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-slate-100">
                        {currencySymbol} {totals.subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-slate-800/60">
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-slate-100"
                      >
                        Total Amount:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-slate-100">
                        {currencySymbol} {totals.total.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/*COLLAPSIBLE COMPLETE Payment History */}
            {invoice.invoice_payments &&
              invoice.invoice_payments.length > 0 && (
                <div className="space-y-4">
                  {/* Main Collapsible Header */}
                  <div className="card">
                    <button
                      onClick={() =>
                        setIsPaymentHistoryOpen(!isPaymentHistoryOpen)
                      }
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                        💳 Complete Payment History & Transaction Details
                        <span className="text-sm font-normal text-gray-500 dark:text-slate-400">
                          ({invoice.invoice_payments.length}{" "}
                          {invoice.invoice_payments.length === 1
                            ? "payment"
                            : "payments"}
                          )
                        </span>
                      </h3>
                      <div className="text-gray-600 dark:text-slate-400">
                        {isPaymentHistoryOpen ? (
                          <BsChevronUp
                            size={20}
                            className="transition-transform"
                          />
                        ) : (
                          <BsChevronDown
                            size={20}
                            className="transition-transform"
                          />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isPaymentHistoryOpen
                          ? "max-h-[10000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pt-4 space-y-4">
                        {invoice.invoice_payments.map((payment, index) => {
                          const paymentData = parsePaymentReason(
                            payment.reason
                          );
                          const chargeData = paymentData?.data;
                          const cardData = chargeData?.card?.data;
                          const isCardOpen = openPaymentCards[payment.id];

                          return (
                            <div
                              key={payment.id || index}
                              className="border-2 border-gray-200 rounded-xl overflow-hidden dark:border-slate-700"
                            >
                              {/* Individual Payment Card Header - Collapsible */}
                              <button
                                onClick={() => togglePaymentCard(payment.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors gap-5"
                              >
                                <div className="text-gray-600 dark:text-slate-400">
                                  {isCardOpen ? (
                                    <BsChevronUp
                                      size={18}
                                      className="transition-transform"
                                    />
                                  ) : (
                                    <BsChevronDown
                                      size={18}
                                      className="transition-transform"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-4 w-full justify-between">
                                  <div className="text-left">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                                      Payment #{payment.id}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 m-0">
                                      {new Date(
                                        payment.transaction_date
                                      ).toLocaleString()}{" "}
                                      • {currencySymbol}
                                      {parseFloat(
                                        payment.transaction_amount || 0
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                      payment.status === "accept"
                                        ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </div>
                              </button>

                              {/* Collapsible Payment Details */}
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                  isCardOpen
                                    ? "max-h-[5000px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                <div className="p-6 space-y-6 border-t border-gray-200 dark:border-slate-700">
                                  {/* Basic Payment Info */}
                                  <div>
                                    <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                                      Basic Payment Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Transaction ID
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.transaction_id}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Invoice ID
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.invoice_id}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Merchant ID
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.merchant_id}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Amount
                                        </span>
                                        <p className="font-semibold text-green-600 dark:text-emerald-300 text-lg">
                                          {currencySymbol}{" "}
                                          {parseFloat(
                                            payment.transaction_amount || 0
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card Holder Information */}
                                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                                    <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                                      Card Holder Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Cardholder Name
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_name || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Card Number
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_number || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Card Expiry
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_expiry || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          CVV
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_vv
                                            ? payment.customer_c_vv
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Billing Address
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_address || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Postal Code
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {payment.customer_c_postcode || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Gateway Response Details */}
                                  {chargeData && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                                        Payment Gateway Response
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Charge ID
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.id || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Transaction Type
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.type || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Gateway Status
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.status || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Auth Code
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.auth_code || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Amount (Cents)
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.amount?.toLocaleString() ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Amount Approved
                                          </span>
                                          <p className="font-medium text-green-600 dark:text-emerald-300">
                                            {chargeData.amount_approved ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Amount Captured
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.amount_captured || "0"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Amount Refunded
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.amount_refunded || "0"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Net Amount
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.net_amount || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            PayArc Fees
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.payarc_fees || "0"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Captured
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.captured === "1"
                                              ? "Yes"
                                              : "No"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Is Refunded
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.is_refunded === 1
                                              ? "Yes"
                                              : "No"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Host Response */}
                                  {chargeData && (
                                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                                      <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                                        Host Response Details
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Response Code
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.host_response_code ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Response Message
                                          </span>
                                          <p className="font-medium text-green-600 dark:text-emerald-300">
                                            {chargeData.host_response_message ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            TSYS Response Code
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.tsys_response_code ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Reference Number
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.host_reference_number ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Transaction Identifier
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.host_transaction_identifier ||
                                              "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Statement Description
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.statement_description ||
                                              "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Card Details from Gateway */}
                                  {cardData && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                                        Card Verification & Details
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card ID
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.id || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card Brand
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.brand || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card Source
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.card_source || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card Level
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.card_level || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            First 6 Digits
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.first6digit || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Last 4 Digits
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.last4digit || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Expiry
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.exp_month}/
                                            {cardData.exp_year}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card Verified
                                          </span>
                                          <p className="font-medium text-green-600 dark:text-emerald-300">
                                            {cardData.is_verified === 1
                                              ? "Yes"
                                              : "No"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            AVS Status
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.avs_status || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            CVC Status
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.cvc_status || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Address Check
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.address_check_passed === 1
                                              ? "Passed"
                                              : "Failed"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            ZIP Check
                                          </span>
                                          <p className="font-medium text-green-600 dark:text-emerald-300">
                                            {cardData.zip_check_passed === 1
                                              ? "Passed"
                                              : "Failed"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Card ZIP
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {cardData.zip || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Fingerprint
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100 truncate">
                                            {cardData.fingerprint || "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Timestamps */}
                                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Payment Created
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {new Date(
                                            payment.created_at
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="block text-xs text-gray-500 dark:text-slate-400">
                                          Last Updated
                                        </span>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                          {new Date(
                                            payment.updated_at
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                      {chargeData && (
                                        <div>
                                          <span className="block text-xs text-gray-500 dark:text-slate-400">
                                            Gateway Timestamp
                                          </span>
                                          <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {chargeData.created_at
                                              ? new Date(
                                                  chargeData.created_at * 1000
                                                ).toLocaleString()
                                              : "N/A"}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Timeline & Additional Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Timeline & Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Invoice Created
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {new Date(invoice.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Due Date
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                {invoice.paid_at && (
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Paid At
                    </span>
                    <p className="font-medium text-green-600 dark:text-emerald-300">
                      {new Date(invoice.paid_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                      {new Date(invoice.paid_at).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Last Updated
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {new Date(invoice.updated_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {new Date(invoice.updated_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Invoice Logo
                  </span>
                  {/* <p className="font-medium text-gray-900 dark:text-slate-100">
                    {invoice.invoice_logo || "N/A"}
                  </p> */}
                  <img
                    src={invoice.invoice_logo}
                    alt="invoice logo here"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Test Invoice
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {invoice.is_test === "1" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    External Invoice
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {invoice.is_external === "1" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Proof Required
                  </span>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {invoice.proof_required === "1" ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer History Tab - Same as before */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Customer Overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Customer Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 transition-colors dark:border-blue-500/25 dark:bg-blue-500/10">
                  <div className="text-sm text-blue-600 font-medium mb-1 dark:text-blue-200">
                    Total Invoices
                  </div>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {customerHistory.total_invoices}
                    <small className="text-sm text-green-600 font-medium mb-1 dark:text-emerald-200">
                      {" "}
                      / 9 Paid
                    </small>
                  </div>
                </div>
                <div className="rounded-lg border border-green-100 bg-green-50 p-5 transition-colors dark:border-emerald-500/25 dark:bg-emerald-500/10">
                  <div className="text-sm text-green-600 font-medium mb-1 dark:text-emerald-200">
                    Total Revenue
                  </div>
                  <div className="text-3xl font-bold text-green-900 dark:text-emerald-200">
                    {currencySymbol}{" "}
                    {customerHistory.total_revenue.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-5 transition-colors dark:border-purple-500/25 dark:bg-purple-500/10">
                  <div className="text-sm text-purple-600 font-medium mb-1 dark:text-purple-200">
                    Avg Invoice
                  </div>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                    {currencySymbol}{" "}
                    {customerHistory.average_invoice_value.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 transition-colors dark:border-slate-700/60 dark:bg-slate-800/60">
                  <div className="text-sm text-gray-600 font-medium mb-1 dark:text-slate-400">
                    Customer Since
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {new Date(
                      customerHistory.customer_since
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoice History */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Recent Invoice History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-900 dark:text-slate-100">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700/60">
                      <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                        Invoice #
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                        Issue Date
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                        Due Date
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-slate-300">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.recent_invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-300">
                          {inv.invoice_number}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-slate-100">
                          {new Date(inv.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-slate-100">
                          {inv.due_date
                            ? new Date(inv.due_date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-slate-100">
                          {currencySymbol} {inv.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              inv.payment_status === "paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                                : inv.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200"
                                : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
                            }`}
                          >
                            {inv.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Print Preview Tab - Same as before */}
        {activeTab === "preview" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 max-w-4xl mx-auto dark:bg-slate-900/70 dark:border-slate-700/60">
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-8 dark:border-slate-700/60">
              <h2 className="text-4xl font-bold text-gray-900 mb-2 dark:text-slate-100">
                INVOICE
              </h2>
              <p className="text-base text-gray-600 dark:text-slate-400">
                {invoice.brand?.title || ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xs font-bold text-gray-600 uppercase mb-3 dark:text-slate-400">
                  Bill To:
                </h3>
                <p className="text-base font-bold text-gray-900 mb-1 dark:text-slate-100">
                  {invoice.lead?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  {invoice.lead?.email || ""}
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  {invoice.lead?.phone || ""}
                </p>
                {(invoice.lead?.city ||
                  invoice.lead?.region ||
                  invoice.lead?.country) && (
                  <p className="text-sm text-gray-700 mt-2 dark:text-slate-400">
                    {[
                      invoice.lead.city,
                      invoice.lead.region,
                      invoice.lead.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="text-right">
                <h3 className="text-xs font-bold text-gray-600 uppercase mb-3 dark:text-slate-400">
                  Invoice Details:
                </h3>
                <p className="text-base font-bold text-gray-900 dark:text-slate-100">
                  {invoice.invoice_no}
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  <span className="font-medium dark:text-slate-200">
                    Date:{" "}
                  </span>
                  {new Date(invoice.created_at).toLocaleDateString()}
                </p>
                {invoice.due_date && (
                  <p className="text-sm text-gray-700 dark:text-slate-400">
                    <span className="font-medium dark:text-slate-200">
                      Due:
                    </span>{" "}
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm text-gray-700 mt-2 dark:text-slate-400">
                  <span className="font-medium dark:text-slate-200">Team:</span>{" "}
                  {invoice.team?.title || "N/A"}
                </p>
              </div>
            </div>

            <table className="w-full mb-8 border-t-2 border-b-2 border-gray-300 dark:border-slate-700/60 text-gray-900 dark:text-slate-100">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700/60">
                  <th className="text-left py-4 font-bold text-gray-700 dark:text-slate-300">
                    Description
                  </th>
                  <th className="text-center py-4 font-bold text-gray-700 dark:text-slate-300">
                    Qty
                  </th>
                  <th className="text-right py-4 font-bold text-gray-700 dark:text-slate-300">
                    Price
                  </th>
                  <th className="text-right py-4 font-bold text-gray-700 dark:text-slate-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items?.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-100 dark:border-slate-800"
                  >
                    <td className="py-3 text-sm text-gray-900 dark:text-slate-100">
                      {item.service}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-center dark:text-slate-100">
                      {item.qty}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right dark:text-slate-100">
                      {currencySymbol}{" "}
                      {parseFloat(item.price || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right dark:text-slate-100">
                      {currencySymbol}{" "}
                      {(
                        parseFloat(item.price || 0) * parseInt(item.qty || 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-700 dark:text-slate-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {currencySymbol} {totals.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-3 mt-2 dark:border-slate-700/60">
                  <span className="text-gray-900 dark:text-slate-100">
                    TOTAL:
                  </span>
                  <span className="text-gray-900 dark:text-slate-100">
                    {currencySymbol} {totals.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-6 text-center dark:border-slate-700/60">
              <p className="text-sm text-gray-700 mb-2 dark:text-slate-400">
                <span className="font-medium dark:text-slate-200">
                  Payment Status:
                </span>{" "}
                <span
                  className={`font-bold uppercase ${
                    invoice.transaction_status === "paid"
                      ? "text-green-600 dark:text-emerald-300"
                      : "text-yellow-600 dark:text-amber-300"
                  }`}
                >
                  {invoice.transaction_status || "unpaid"}
                </span>
              </p>
              {invoice.transaction_id && (
                <p className="text-sm text-gray-700 mb-2 dark:text-slate-400">
                  <span className="font-medium dark:text-slate-200">
                    Transaction ID:
                  </span>{" "}
                  {invoice.transaction_id}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-4 dark:text-slate-500">
                Thank you for your business!
              </p>
              <p className="text-xs text-gray-400 mt-2 dark:text-slate-600">
                {invoice.brand?.domain || ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInvoicePage;
