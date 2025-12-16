import React, { useState, useEffect, useRef, useCallback } from "react";
import { BsSearch, BsX } from "react-icons/bs";
import apiAxios from "../../../api/ApiAxios";
import ApiRequest from "../../../api/ApiRequest";

const InvoiceSearchSelectWithData = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search invoices with items
  const searchInvoices = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setInvoices([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiAxios.get(ApiRequest.invoices.list, {
        params: {
          search: query,
          per_page: 20,
          with_items: true,
          payment_status: "unpaid",
        },
      });
      setInvoices(response.data?.data || []);
    } catch (error) {
      console.error("Error searching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchInvoices(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, searchInvoices]);

  // Handle invoice selection
  const handleSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setSearchTerm("");
    setIsOpen(false);
    onChange(invoice);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedInvoice(null);
    setSearchTerm("");
    onChange(null);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
        Select Invoice <span className="text-red-500">*</span>
      </label>

      {/* Selected Invoice Display */}
      {selectedInvoice ? (
        <div
          className={`flex items-center justify-between p-3 rounded-lg border ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/60"
          }`}
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-slate-100">
              {selectedInvoice.invoice_no}
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">
              {selectedInvoice.lead_email} • $
              {selectedInvoice.transaction_amount}
              {selectedInvoice.invoice_items?.length > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  {selectedInvoice.invoice_items.length} items
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          >
            <BsX size={18} />
          </button>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="relative">
            <BsSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              size={16}
            />
            <input
              type="text"
              className={`form-control pl-10 ${
                error
                  ? "border-red-500"
                  : "border-gray-300 dark:border-slate-600"
              }`}
              placeholder="Search by invoice number or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-slate-400">
                  <svg
                    className="animate-spin size-5 mx-auto mb-2"
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
                  Searching...
                </div>
              ) : invoices.length > 0 ? (
                <ul className="py-1">
                  {invoices.map((invoice) => (
                    <li
                      key={invoice.id}
                      onClick={() => handleSelect(invoice)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100">
                            {invoice.invoice_no}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-slate-400">
                            {invoice.lead_email}
                            {invoice.invoice_items?.length > 0 && (
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                ({invoice.invoice_items.length} items)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-slate-100">
                            ${invoice.transaction_amount}
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              invoice.transaction_status === "paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                            }`}
                          >
                            {invoice.transaction_status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : searchTerm.length >= 2 ? (
                <div className="p-4 text-center text-gray-500 dark:text-slate-400">
                  No invoices found
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-slate-400">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          )}
        </>
      )}

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default InvoiceSearchSelectWithData;
