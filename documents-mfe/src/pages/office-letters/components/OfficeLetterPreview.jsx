import React from "react";
import { format } from "date-fns";

const OfficeLetterPreview = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const currencySymbol = data?.invoice?.merchant?.currency_symbol || "$";
  const invoiceItems = data?.invoice?.invoice_items || [];

  return (
    <div className="bg-white dark:bg-slate-900/70 p-8">
      {/* USPTO Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-700 uppercase tracking-wide mb-4 dark:text-slate-300">
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

      {/* Main Heading */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-gray-700 dark:text-slate-300">
          {data?.main_heading ||
            "Office Action About Applicant's Trademark Application"}
        </h2>
      </div>

      {/* Letter Details */}
      <div className="space-y-3 mb-8 text-sm">
        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            U.S. Application Serial No.
          </div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {data?.serial_number || "N/A"}
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            Mark:
          </div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {data?.mark || "N/A"}
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            Correspondence Address:
          </div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            <div>{data?.client_name || "N/A"}</div>
            {data?.address && (
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: data.address }}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            Applicant:
          </div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {data?.client_name || "N/A"}
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            Response Deadline:
          </div>
          <div className="font-medium text-gray-900 dark:text-slate-100">
            {formatDate(data?.deadline)}
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-3">
          <div className="font-semibold text-gray-600 dark:text-slate-400">
            Correspondence Email:
          </div>
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {data?.our_email || "N/A"}
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className="mt-8 mb-6">
        <h3 className="text-center text-base font-bold text-gray-700 uppercase mb-6 dark:text-slate-300">
          {data?.heading || "Nonfinal Office Action"}
        </h3>

        {/* Paragraphs */}
        <div className="space-y-6">
          {data?.paragraphs && data.paragraphs.length > 0 ? (
            data.paragraphs
              .sort((a, b) => parseInt(a.order_no) - parseInt(b.order_no))
              .map((paragraph, index) => (
                <div key={paragraph.id || index}>
                  {paragraph.title && (
                    <h6 className="font-bold text-gray-900 dark:text-slate-100 mb-2">
                      {paragraph.title}
                    </h6>
                  )}
                  <div
                    className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed text-justify prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.description || "<p>No content</p>",
                    }}
                  />

                  {/* Services Table - Styled Design */}
                  {paragraph.is_table_required === "1" &&
                    invoiceItems.length > 0 && (
                      <div className="overflow-x-auto max-w-full my-5">
                        <table className="w-full border-collapse">
                          {/* Blue Header */}
                          <thead>
                            <tr>
                              <th
                                className="bg-[#A9C0DB] dark:bg-blue-800/60 w-full text-black dark:text-white text-center font-semibold text-base py-2 border border-gray-300 dark:border-slate-600"
                                colSpan="1"
                              >
                                Trademark/Service Application, Basis for Filing
                              </th>
                            </tr>
                            <tr>
                              <th
                                className="bg-amber-200 dark:bg-amber-700/60 w-full text-black dark:text-white text-center font-semibold text-base py-2 border border-gray-300 dark:border-slate-600"
                                colSpan="1"
                              >
                                Judicial Approval for Finalization
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceItems.map((item, idx) => (
                              <tr key={item.id || idx}>
                                <td className="p-2 px-3 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800/40">
                                  {item.service}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* Full Pricing Table */}
                  {paragraph.is_table_required_with_pricing === "1" &&
                    invoiceItems.length > 0 && (
                      <div className="overflow-x-auto max-w-full my-5">
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
                            {invoiceItems.map((item, idx) => (
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
                                    parseFloat(item.price) * parseInt(item.qty)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100 dark:bg-slate-800/60 font-bold">
                              <td
                                colSpan="3"
                                className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right text-gray-900 dark:text-slate-100"
                              >
                                Total Amount:
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-right text-gray-900 dark:text-slate-100">
                                {currencySymbol}
                                {data?.invoice?.transaction_amount || "0.00"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-slate-500">
              <p>No paragraphs added yet</p>
              <p className="text-sm mt-1">
                Add paragraphs to see them in preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeLetterPreview;
