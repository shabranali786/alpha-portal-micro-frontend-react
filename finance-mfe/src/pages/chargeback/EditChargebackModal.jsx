import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
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
  { value: "reverted", label: "Reverted" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function EditChargebackModal({
  open,
  onClose,
  chargeback,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;
  const selectStyles = useSelectStyles();

  const fetchInvoiceByEmail = useCallback(async (email) => {
    if (!email) return;

    try {
      setInvoiceLoading(true);
      const response = await apiAxios.get(
        `${ApiRequest.invoices.list}?per_page=20&lead_email=${email}`
      );

      const invoicesData = response.data?.data || [];
      if (invoicesData.length > 0) {
        const invoice = invoicesData[0];
        setInvoiceData(invoice);
        return invoice;
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to fetch invoice details");
    } finally {
      setInvoiceLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (chargeback && open) {
        const customerEmail =
          chargeback.lead?.email || chargeback.customer_email;

        const invoice = await fetchInvoiceByEmail(customerEmail);

        const status = statusOptions.find((s) => s.value === chargeback.status);

        setFormData({
          customer_name:
            invoice?.lead?.name ||
            chargeback.lead?.name ||
            chargeback.customer_name ||
            "",
          customer_email:
            invoice?.lead?.email ||
            chargeback.lead?.email ||
            chargeback.customer_email ||
            "",
          customer_phone:
            invoice?.lead?.phone ||
            chargeback.lead?.phone ||
            chargeback.customer_phone ||
            "",
          customer_address: invoice?.lead
            ? [invoice.lead.city, invoice.lead.region, invoice.lead.country]
                .filter(Boolean)
                .join(", ")
            : chargeback.lead?.address ||
              chargeback.customer_address ||
              [
                chargeback.lead?.city,
                chargeback.lead?.state,
                chargeback.lead?.country,
              ]
                .filter(Boolean)
                .join(", ") ||
              "",

          transaction_number:
            invoice?.transaction_id ||
            chargeback.transaction_id ||
            chargeback.transaction_number ||
            "",
          invoice_number:
            invoice?.invoice_no ||
            chargeback.invoice_no ||
            chargeback.invoice_number ||
            "",
          transaction_amount:
            invoice?.transaction_amount || chargeback.transaction_amount || "",

          brand: invoice?.brand?.title || chargeback.brand?.title || "",
          merchant:
            invoice?.merchant?.title || chargeback.merchant?.title || "",
          team: invoice?.team?.title || chargeback.team?.title || "",
          agent:
            invoice?.created_by?.name ||
            chargeback.user?.name ||
            chargeback.created_by?.name ||
            "",

          payment_date: invoice?.paid_at
            ? invoice.paid_at.split(" ")[0]
            : chargeback.payment_date
            ? chargeback.payment_date.split(" ")[0]
            : "",
          chargeback_date: chargeback.chargeback_date
            ? chargeback.chargeback_date.split(" ")[0]
            : "",
          response_date: chargeback.response_date
            ? chargeback.response_date.split(" ")[0]
            : "",
          reverted_date: chargeback.reverted_date
            ? chargeback.reverted_date.split(" ")[0]
            : "",

          chargeback_amount: chargeback.chargeback_amount || "",
          card_digits:
            chargeback.card_digits || chargeback.card_number?.slice(-4) || "",

          status: status || { value: "pending", label: "Pending" },
        });
      }
    };

    loadData();
  }, [chargeback, open, fetchInvoiceByEmail]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (!formData) return null;

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
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    Edit Chargeback
                    {invoiceLoading && (
                      <span className="text-xs text-blue-500 font-normal">
                        Loading invoice details...
                      </span>
                    )}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                    Update chargeback information
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto text-sm space-y-6"
                >
                  {/* Customer Information (ReadOnly) */}
                  <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label>Customer Name</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.customer_name}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Customer Email</label>
                        <input
                          type="email"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.customer_email}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Customer Phone</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.customer_phone}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Customer Address</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.customer_address}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details (ReadOnly) */}
                  <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Transaction Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* <div>
                        <label>Transaction Number</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.transaction_number}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Invoice Number</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.invoice_number}
                          readOnly
                        />
                      </div> */}

                      <div>
                        <label>Transaction Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.transaction_amount}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>
                          Chargeback Amount{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${
                            errors.chargeback_amount ? "border-red-500" : ""
                          }`}
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
                      <div>
                        <label>Card Last 4 Digits</label>
                        <input
                          type="text"
                          maxLength="4"
                          className="form-control"
                          placeholder="1234"
                          value={formData.card_digits}
                          onChange={(e) =>
                            handleChange("card_digits", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand, Merchant, Team & Agent (ReadOnly) */}
                  <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Brand, Merchant, Team & Agent
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label>Brand</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.brand}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Merchant</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.merchant}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Team</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.team}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Agent</label>
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-900/60"
                          value={formData.agent}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates (Editable) */}
                  <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Date Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label>Payment Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.payment_date}
                          onChange={(e) =>
                            handleChange("payment_date", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label>
                          Chargeback Date{" "}
                          <span className="text-red-500">*</span>
                        </label>
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

                      <div>
                        <label>Reverted Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.reverted_date}
                          onChange={(e) =>
                            handleChange("reverted_date", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Card Information (Editable) */}
                  {/* <div className="border-b border-gray-200 dark:border-slate-700/60 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Financial & Card Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                  </div> */}

                  {/* Status (Editable) */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      Chargeback Status
                    </h3>
                    <div className="w-full md:w-1/3">
                      <label>
                        Status <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={statusOptions}
                        value={formData.status}
                        onChange={(option) => handleChange("status", option)}
                        placeholder="Select Status"
                        styles={selectStyles}
                        menuPortalTarget={menuPortalTarget}
                        classNamePrefix="tm-select"
                      />
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
                    {loading ? "Updating..." : "Update Chargeback"}
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
