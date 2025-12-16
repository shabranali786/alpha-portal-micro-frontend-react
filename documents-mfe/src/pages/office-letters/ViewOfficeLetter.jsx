import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPrinter, BsDownload } from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { format } from "date-fns";

const ViewOfficeLetter = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officeLetter, setOfficeLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficeLetter = async () => {
      setLoading(true);
      try {
        const response = await apiAxios.get(ApiRequest.officeLetters.show(id));
        if (response.data?.data) {
          setOfficeLetter(response.data.data);
        } else {
          toast.error("Office letter not found");
          navigate("/office-letters");
        }
      } catch (error) {
        console.error("Error fetching office letter:", error);
        toast.error(
          error.response?.data?.message || "Failed to load office letter"
        );
        navigate("/office-letters");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfficeLetter();
    }
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleDownload = () => {
    toast.success("Downloading office letter...");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMMM dd, yyyy");
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center transition-colors duration-300 dark:bg-[var(--color-body)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Loading office letter...
          </p>
        </div>
      </div>
    );
  }

  if (!officeLetter) return null;

  const currencySymbol = officeLetter.invoice?.merchant?.currency_symbol || "$";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-slate-900/80 dark:border-slate-700/60 backdrop-blur print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/office-letters")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800/70 dark:text-slate-200"
              >
                <BsArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Office Letter Preview</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Serial #: {officeLetter.serial_number || "N/A"}
                </p>
              </div>
            </div>

            {/* <div className="flex gap-3">
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
            </div> */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 dark:bg-slate-900/70 dark:border-slate-700/60 print:shadow-none print:border-0">
          {/* USPTO Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-700 uppercase tracking-wide mb-4 dark:text-slate-300">
              United States Patent & Trademark Office
            </h1>
            <div className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
              <p className="dark:text-slate-100">
                Address: COMMISSIONER FOR PATENTS
              </p>
              <p className="dark:text-slate-100">P.O. Box 1450</p>
              <p className="dark:text-slate-100">Alexandria, Virginia</p>
              <p className="dark:text-slate-100">22313</p>
              <p className="dark:text-slate-100">www.uspto.gov</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-900 dark:border-slate-300 my-6"></div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-700 dark:text-slate-300">
              {officeLetter.main_heading ||
                "Office Action About Applicant's Trademark Application"}
            </h2>
          </div>

          {/* Application Details */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                U.S. Application Serial No.
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {officeLetter.serial_number || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                Mark:
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {officeLetter.mark || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                Correspondence Address:
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                <div>{officeLetter.client_name || "N/A"}</div>
                {officeLetter.address && (
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: officeLetter.address,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                Applicant:
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {officeLetter.client_name || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                Response Deadline:
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {formatDate(officeLetter.deadline)}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                Correspondence Email Address:
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {officeLetter.our_email ||
                  officeLetter.invoice?.lead_email ||
                  "N/A"}
              </div>
            </div>
          </div>

          {/* Heading Section */}
          <div className="mt-8 mb-6">
            <h3 className="text-center text-base font-bold text-gray-700 uppercase mb-6 dark:text-slate-300">
              {officeLetter.heading || "Nonfinal Office Action"}
            </h3>

            {/* Letter Body - Paragraphs */}
            <div className="space-y-6">
              {officeLetter.paragraphs &&
                officeLetter.paragraphs.length > 0 &&
                officeLetter.paragraphs
                  .sort((a, b) => parseInt(a.order_no) - parseInt(b.order_no))
                  .map((paragraph, index) => (
                    <div key={paragraph.id || index}>
                      {paragraph.title && (
                        <h6 className="font-bold text-gray-900 dark:text-slate-100 mb-2">
                          {paragraph.title}
                        </h6>
                      )}
                      <div
                        className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{
                          __html: paragraph.description,
                        }}
                      />

                      {/* Table for Payment/Pricing */}
                      {paragraph.is_table_required === "1" &&
                        paragraph.is_table_required_with_pricing === "1" &&
                        officeLetter.invoice?.invoice_items && (
                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full border border-gray-300 dark:border-slate-600 text-sm">
                              <thead className="bg-gray-100 dark:bg-slate-800/60">
                                <tr>
                                  <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-slate-300">
                                    Description
                                  </th>
                                  <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-center font-semibold text-gray-700 dark:text-slate-300">
                                    Quantity
                                  </th>
                                  <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right font-semibold text-gray-700 dark:text-slate-300">
                                    Price
                                  </th>
                                  <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right font-semibold text-gray-700 dark:text-slate-300">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {officeLetter.invoice.invoice_items.map(
                                  (item, idx) => (
                                    <tr
                                      key={item.id || idx}
                                      className="hover:bg-gray-50 dark:hover:bg-slate-800/40"
                                    >
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-gray-900 dark:text-slate-100">
                                        {item.service}
                                      </td>
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-center text-gray-900 dark:text-slate-100">
                                        {item.qty}
                                      </td>
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right text-gray-900 dark:text-slate-100">
                                        {currencySymbol}
                                        {parseFloat(item.price).toFixed(2)}
                                      </td>
                                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right font-medium text-gray-900 dark:text-slate-100">
                                        {currencySymbol}
                                        {(
                                          parseFloat(item.price) *
                                          parseInt(item.qty)
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  )
                                )}
                                <tr className="bg-gray-100 dark:bg-slate-800/60 font-bold">
                                  <td
                                    colSpan="3"
                                    className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right text-gray-900 dark:text-slate-100"
                                  >
                                    Total Amount:
                                  </td>
                                  <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right text-gray-900 dark:text-slate-100">
                                    {currencySymbol}
                                    {officeLetter.invoice.transaction_amount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                    </div>
                  ))}
            </div>
          </div>

          {/* Footer Information */}
          {/* <div className="mt-8 pt-6 border-t border-gray-300 dark:border-slate-700/60 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Invoice Information
                </h4>
                <div className="space-y-1 text-gray-600 dark:text-slate-400">
                  <p className=" dark:text-slate-400">
                    Invoice #:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {officeLetter.invoice?.invoice_no || "N/A"}
                    </span>
                  </p>
                  <p className=" dark:text-slate-400">
                    Amount:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {currencySymbol}
                      {officeLetter.invoice?.transaction_amount || "0"}
                    </span>
                  </p>
                  <p className=" dark:text-slate-400">
                    Status:{" "}
                    <span
                      className={`font-medium capitalize ${
                        officeLetter.invoice?.transaction_status === "paid"
                          ? "text-green-600 dark:text-emerald-300"
                          : "text-red-600 dark:text-red-300"
                      }`}
                    >
                      {officeLetter.invoice?.transaction_status || "unpaid"}
                    </span>
                  </p>
                  <p className=" dark:text-slate-400">
                    Due Date:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {officeLetter.invoice?.due_date
                        ? formatDate(officeLetter.invoice.due_date)
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Letter Information
                </h4>
                <div className="space-y-1 text-gray-600 dark:text-slate-400">
                  <p className=" dark:text-slate-400">
                    Created By:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {officeLetter.created_by?.name || "N/A"}
                    </span>
                  </p>
                  <p className=" dark:text-slate-400">
                    Created On:{" "}
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {officeLetter.created_at
                        ? formatDate(officeLetter.created_at)
                        : "N/A"}
                    </span>
                  </p>
                  <p className=" dark:text-slate-400">
                    Lead Email:{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {officeLetter.invoice?.lead_email || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ViewOfficeLetter;
