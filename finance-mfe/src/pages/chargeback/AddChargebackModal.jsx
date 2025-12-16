import { Fragment, useMemo, useState, useEffect, useCallback } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "../../hooks/useSelectStyles";
import toast from "react-hot-toast";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "investigating", label: "Investigating" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function AddChargebackModal({
  open,
  onClose,
  onSubmit,
  loading,
}) {
  const [invoices, setInvoices] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);

  const [formData, setFormData] = useState({
    selected_invoice: null,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    transaction_number: "",
    invoice_number: "",
    payment_date: "",
    chargeback_date: "",
    response_date: "",
    reverted_date: "",
    transaction_amount: "",
    chargeback_amount: "",
    brand: null,
    merchant: null,
    agent: null,
    team: null,
    status: { value: "pending", label: "Pending" },
    payment_method: "",
    card_digits: "",
    customer_c_expiry: "",
    customer_c_vv: "",
    customer_c_address: "",
    customer_c_postcode: "",
    dispute_reason: "",
    internal_notes: "",
  });

  const [errors, setErrors] = useState({});
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const fetchInvoices = useCallback(async (emailSearch = "") => {
    try {
      setDataLoading(true);
      const response = await apiAxios.get(
        `${ApiRequest.invoices.list}?per_page=20&lead_email=${emailSearch}&payment_status=paid`
      );

      const invoicesData = response.data?.data || [];
      const invoiceOptions = invoicesData.map((invoice) => ({
        value: invoice.id,
        label: `${invoice.lead_email} - ${invoice.lead.name} (INV: ${invoice.invoice_no})`,
        email: invoice.lead_email,
        name: invoice.lead.name,
        phone: invoice.lead.phone,
        brand: invoice.brand,
        merchant: invoice.merchant,
        team: invoice.team,
        city: invoice.lead.city,
        region: invoice.lead.region,
        country: invoice.lead.country,
        ip: invoice.lead.ip,
        transaction_amount: invoice.transaction_amount,
        transaction_id: invoice.transaction_id,
        payment_date: invoice.paid_at,
        invoice_number: invoice.invoice_no,
        agent_name: invoice.created_by?.name,
        agent_id: invoice.created_by?.id,
        lead_id: invoice.lead_id,
      }));
      setInvoices(invoiceOptions);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to search invoices");
      }
    } finally {
      setDataLoading(false);
    }
  }, []);

  const fetchInvoiceDetails = useCallback(async (invoiceId) => {
    try {
      setPaymentDetailsLoading(true);
      const response = await apiAxios.get(ApiRequest.invoices.show(invoiceId));

      const invoiceDetails = response.data;
      if (invoiceDetails?.invoice_payments?.length > 0) {
        const payment = invoiceDetails.invoice_payments[0];
        setFormData((prev) => ({
          ...prev,
          payment_method: invoiceDetails.merchant.merchant_key || "",
          card_digits: payment.customer_c_number.slice(-4),
          customer_c_expiry: payment.customer_c_expiry || "",
          customer_c_vv: payment.customer_c_vv || "",
          customer_c_address: payment.customer_c_address || "",
          customer_c_postcode: payment.customer_c_postcode || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to fetch payment details");
    } finally {
      setPaymentDetailsLoading(false);
    }
  }, []);

  const handleInvoiceSelect = (selectedInvoice) => {
    if (selectedInvoice) {
      fetchInvoiceDetails(selectedInvoice.value);
      setFormData((prev) => ({
        ...prev,
        selected_invoice: selectedInvoice,
        customer_name: selectedInvoice.name || "",
        customer_email: selectedInvoice.email || "",
        customer_phone: selectedInvoice.phone || "",
        customer_address: `${selectedInvoice.city || ""}, ${
          selectedInvoice.region || ""
        }, ${selectedInvoice.country || ""}`
          .trim()
          .replace(/^,\s*|,\s*$/g, ""),
        transaction_number: selectedInvoice.transaction_id || "",
        invoice_number: selectedInvoice.invoice_number || "",
        transaction_amount: selectedInvoice.transaction_amount || "",
        payment_date: selectedInvoice.payment_date
          ? selectedInvoice.payment_date.split(" ")[0]
          : "",
        brand: selectedInvoice.brand
          ? {
              value: selectedInvoice.brand.id,
              label: selectedInvoice.brand.title,
            }
          : null,
        merchant: selectedInvoice.merchant
          ? {
              value: selectedInvoice.merchant.id,
              label: selectedInvoice.merchant.title,
            }
          : null,
        agent: selectedInvoice.agent_name
          ? {
              value: selectedInvoice.agent_id,
              label: selectedInvoice.agent_name,
            }
          : null,
        team: selectedInvoice.team
          ? {
              value: selectedInvoice.team.id,
              label: selectedInvoice.team.title,
            }
          : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selected_invoice: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        transaction_number: "",
        invoice_number: "",
        transaction_amount: "",
        payment_date: "",
        brand: null,
        merchant: null,
        agent: null,
        payment_method: "",
        card_digits: "",
        customer_c_expiry: "",
        customer_c_vv: "",
        customer_c_address: "",
        customer_c_postcode: "",
      }));
    }
  };

  useEffect(() => {
    const chargebackAmt = parseFloat(formData.chargeback_amount) || 0;
    setFormData((prev) => ({
      ...prev,
      total_amount: chargebackAmt.toFixed(2),
    }));
  }, [formData.chargeback_amount]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.selected_invoice) {
      newErrors.selected_invoice = "Please select an invoice";
    }

    if (!formData.chargeback_date) {
      newErrors.chargeback_date = "Chargeback date is required";
    }

    if (
      !formData.chargeback_amount ||
      parseFloat(formData.chargeback_amount) <= 0
    ) {
      newErrors.chargeback_amount = "Valid chargeback amount is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix all errors");
      return;
    }

    const submitData = {
      lead_id: formData.selected_invoice
        ? formData.selected_invoice.lead_id
        : null,
      team_id: formData.team ? formData.team.value : null,
      user_id: formData.agent ? formData.agent.value : null,
      merchant_id: formData.merchant ? formData.merchant.value : null,
      payment_date: formData.payment_date || null,
      chargeback_date: formData.chargeback_date,
      response_date: formData.response_date || null,
      reverted_date: formData.reverted_date || null,
      chargeback_amount: parseFloat(formData.chargeback_amount),
      card_digits: formData.card_digits.trim(),
      status: formData.status.value,
    };

    try {
      await onSubmit(submitData);
      setFormData({
        selected_invoice: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        transaction_number: "",
        invoice_number: "",
        payment_date: "",
        chargeback_date: "",
        response_date: "",
        reverted_date: "",
        transaction_amount: "",
        chargeback_amount: "",
        brand: null,
        merchant: null,
        agent: null,
        team: null,
        status: { value: "pending", label: "Pending" },
        payment_method: "",
        card_digits: "",
        customer_c_expiry: "",
        customer_c_vv: "",
        customer_c_address: "",
        customer_c_postcode: "",
        dispute_reason: "",
        internal_notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700/60">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Add New Chargeback
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                    Create a new chargeback record
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto space-y-6 text-sm"
                >
                  <div className="space-y-6">
                    {/* Lead Search & Customer Information */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Lead Search & Customer Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label>
                            Search Lead/Customer by Email{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Select
                            options={invoices}
                            value={formData.selected_invoice}
                            onChange={handleInvoiceSelect}
                            onInputChange={(inputValue, { action }) => {
                              if (
                                action === "input-change" &&
                                inputValue.length >= 3
                              ) {
                                clearTimeout(window.invoiceSearchTimeout);
                                window.invoiceSearchTimeout = setTimeout(() => {
                                  fetchInvoices(inputValue);
                                }, 500);
                              }
                            }}
                            isClearable
                            isLoading={dataLoading}
                            placeholder="Type email to search (min 3 characters)"
                            noOptionsMessage={({ inputValue }) =>
                              inputValue.length < 3
                                ? "Type at least 3 characters to search"
                                : "No invoices found"
                            }
                            styles={selectStyles}
                            menuPortalTarget={menuPortalTarget}
                            classNamePrefix="tm-select"
                          />
                          {errors.selected_invoice && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.selected_invoice}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label>Customer Name </label>
                            <input
                              type="text"
                              className="form-control bg-gray-50 dark:bg-slate-900/60"
                              placeholder="Customer Name"
                              value={formData.customer_name}
                              readOnly
                            />
                          </div>

                          <div>
                            <label>Customer Email </label>
                            <input
                              type="email"
                              className="form-control bg-gray-50 dark:bg-slate-900/60"
                              placeholder="customer@email.com"
                              value={formData.customer_email}
                              readOnly
                            />
                          </div>

                          <div>
                            <label>Customer Phone</label>
                            <input
                              type="text"
                              className="form-control bg-gray-50 dark:bg-slate-900/60"
                              placeholder="0300-1234567"
                              value={formData.customer_phone}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* <div>
                          <label>Customer Address</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Customer Address"
                            value={formData.customer_address}
                            readOnly
                          />
                        </div> */}
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Financial Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label>Transaction Amount </label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="0.00"
                            value={formData.transaction_amount}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Chargeback Amount </label>
                          <input
                            type="number"
                            step="0.01"
                            className={`form-control ${
                              errors.chargeback_amount ? "border-red-500" : ""
                            }`}
                            placeholder="0.00"
                            value={formData.chargeback_amount}
                            onChange={(e) =>
                              handleChange("chargeback_amount", e.target.value)
                            }
                          />
                          {errors.chargeback_amount && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.chargeback_amount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Transaction Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* <div>
                          <label>Transaction Number </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="TXN-2025-12345"
                            value={formData.transaction_number}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Invoice Number </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="INV-2025-001"
                            value={formData.invoice_number}
                            readOnly
                          />
                        </div> */}

                        <div>
                          <label>Payment Date</label>
                          <input
                            type="date"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            value={formData.payment_date}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Chargeback Date </label>
                          <input
                            type="date"
                            className={`form-control ${
                              errors.chargeback_date ? "border-red-500" : ""
                            }`}
                            value={formData.chargeback_date}
                            onChange={(e) =>
                              handleChange("chargeback_date", e.target.value)
                            }
                          />
                          {errors.chargeback_date && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.chargeback_date}
                            </p>
                          )}
                        </div>

                        <div>
                          <label>Response Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={formData.response_date}
                            onChange={(e) =>
                              handleChange("response_date", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand, Merchant, Team & Agent */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Brand, Merchant, Team & Agent
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label>Brand </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Select Brand"
                            value={formData.brand ? formData.brand.label : ""}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Merchant </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Select Merchant"
                            value={
                              formData.merchant ? formData.merchant.label : ""
                            }
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Team</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Select Team"
                            value={formData.team ? formData.team.label : ""}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Agent</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Select Agent"
                            value={formData.agent ? formData.agent.label : ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Payment Information
                        {paymentDetailsLoading && (
                          <span className="ml-2 text-xs text-blue-500">
                            Loading payment details...
                          </span>
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label>Payment Method </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Payment Method"
                            value={formData.payment_method}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Card Last 4 Digits</label>
                          <input
                            type="text"
                            maxLength="4"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="1234"
                            value={formData.card_digits}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Card Expiry</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="MM/YY"
                            value={formData.customer_c_expiry}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>CVV</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="***"
                            value={formData.customer_c_vv}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Card Address</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Card billing address"
                            value={formData.customer_c_address}
                            readOnly
                          />
                        </div>

                        <div>
                          <label>Postcode</label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-900/60"
                            placeholder="Postal code"
                            value={formData.customer_c_postcode}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chargeback Information */}
                    <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                        Chargeback Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label>
                            Status <span className="text-red-500">*</span>
                          </label>
                          <Select
                            options={statusOptions}
                            value={formData.status}
                            onChange={(option) =>
                              handleChange("status", option)
                            }
                            placeholder="Select Status"
                            styles={selectStyles}
                            menuPortalTarget={menuPortalTarget}
                            classNamePrefix="tm-select"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Chargeback"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
