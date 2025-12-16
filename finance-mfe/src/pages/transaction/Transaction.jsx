import React, { useCallback, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
  BsArrowRepeat,
  BsCreditCard2Front,
  BsEye,
  BsExclamationTriangle,
  BsInfoCircle,
  BsShieldCheck,
  BsWallet2,
} from "react-icons/bs";
import { SearchBox } from "../../components/SearchBox";
import ApiRequest from "../../api/ApiRequest";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../utils/permissions";

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return currency.format(numeric);
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const statusBadgeClass = (status = "") => {
  if (status === "accept" || status === "paid" || status === "success") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200";
  }
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200";
};

const Transactions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    cardNumber: "",
  });

  const {
    data: transactions,
    loading,
    totalRows,
    currentPage,
    perPage,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    rootData,
    setQueryParams,
  } = usePaginatedData(ApiRequest.transactions.list, []);

  const totals = rootData?.totals || {};

  const applyFilters = useCallback(() => {
    const query = {};
    if (filters.cardNumber.trim()) {
      query.card_number = filters.cardNumber.trim();
    }
    setQueryParams(query);
    setCurrentPage(1);
  }, [filters, setQueryParams, setCurrentPage]);

  const resetFilters = useCallback(() => {
    setFilters({
      cardNumber: "",
    });
    setQueryParams({});
    setCurrentPage(1);
  }, [setQueryParams, setCurrentPage]);

  const handleGlobalSearch = useCallback(
    (term) => {
      handleSearch(term);
      setCurrentPage(1);
    },
    [handleSearch, setCurrentPage]
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handlePerPageChange = useCallback(
    (newPerPage, page) => {
      setPerPage(newPerPage);
      setCurrentPage(page);
    },
    [setPerPage, setCurrentPage]
  );

  const canViewTransaction = usePermission(["transaction.show"]);
  const canEditTransaction = usePermission(["transaction.edit"]);

  const columns = useMemo(
    () => [
      {
        name: "Payment",
        minWidth: "240px",
        selector: (row) => row.payment_id,
        cell: (row) => (
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              #{row.payment_id}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {row.source_type?.toUpperCase()} | {row.invoice_no || "N/A"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Lead ID: {row.lead_id || "-"}
            </div>
          </div>
        ),
      },
      {
        name: "Customer",
        minWidth: "260px",
        selector: (row) => row.customer_name,
        cell: (row) => (
          <div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {row.customer_name || "Unknown"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {row.customer_email || "-"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {row.customer_phone || "-"}
            </div>
          </div>
        ),
      },
      {
        name: "Card",
        minWidth: "250px",
        selector: (row) => row.card_number,
        cell: (row) => (
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <BsCreditCard2Front />
              {row.card_number || "-"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Holder: {row.cardholder_name || "-"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Exp: {row.card_expiry || "-"} | CVV: {row.card_cvv || "-"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Zip: {row.card_postcode || "-"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Address: {row.card_address || "-"}
            </div>
          </div>
        ),
      },
      {
        name: "Amount & Status",
        selector: (row) => Number(row.payment_transaction_amount) || 0,
        sortable: true,
        right: true,
        cell: (row) => (
          <div className="text-right">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(row.payment_transaction_amount)}
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                row.payment_status
              )}`}
            >
              {row.payment_status === "accept" ? (
                <BsShieldCheck className="mr-1" />
              ) : (
                <BsExclamationTriangle className="mr-1" />
              )}
              {row.payment_status?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
        ),
      },
      {
        name: "Dates",
        minWidth: "200px",
        selector: (row) => row.payment_transaction_date,
        sortable: true,
        cell: (row) => (
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Txn: {formatDate(row.payment_transaction_date)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Created: {formatDate(row.created_at)}
            </div>
          </div>
        ),
      },
      {
        name: "Action",
        right: true,
        cell: (row) => (
          canViewTransaction && (
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() =>
                navigate(`/transactions/${row.payment_id}`, {
                  state: { transaction: row },
                })
              }
              title="View details"
            >
              <BsEye />
            </button>
          )
        ),
      },
    ],
    [navigate]
  );

  const statusBreakdown = totals?.transactions_by_status || [];
  const sourceBreakdown = totals?.transactions_by_source || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor invoice and lead payments across all brands.
          </p>
        </div>
        <button
          className="btn btn-black flex items-center gap-2"
          onClick={() => refresh()}
          disabled={loading}
        >
          <BsArrowRepeat />
          Refresh
        </button>
      </div>

      <StatsRow
        totals={totals}
        statusBreakdown={statusBreakdown}
        sourceBreakdown={sourceBreakdown}
      />

      <div className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <SearchBox
              onSearch={handleGlobalSearch}
              placeholder="Search email, phone, invoice..."
              className="w-full md:w-64"
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              type="text"
              className="form-control md:w-56"
              placeholder="Card number"
              value={filters.cardNumber}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, cardNumber: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <button className="btn btn-black" onClick={resetFilters}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={transactions}
          progressPending={loading}
          pagination
          paginationServer
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerPageChange}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center dark:bg-slate-800">
              <BsInfoCircle className="mx-auto mb-2 text-3xl text-slate-400" />
              <p className="text-slate-500 dark:text-slate-300">
                No transactions found
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Adjust your search or filters to see results.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

const StatsRow = ({ totals, statusBreakdown, sourceBreakdown }) => {
  const totalAmount = totals?.total_amount || 0;
  const totalCount = totals?.total_transactions || 0;
  const successAmount = totals?.successful_amount || 0;
  const successCount = totals?.successful_transactions || 0;
  const failedAmount = totals?.failed_amount || 0;
  const failedCount = totals?.failed_transactions || 0;
  const averageAmount = totals?.average_transaction_amount || 0;
  const sourceSummary =
    sourceBreakdown
      ?.map(
        (item) =>
          `${item.source_type || "unknown"} ${Number(
            item.count || 0
          ).toLocaleString()}`
      )
      .join(" | ") || "-";
  const statusSummary =
    statusBreakdown
      ?.map(
        (item) =>
          `${item.payment_status || "unknown"} ${Number(
            item.count || 0
          ).toLocaleString()}`
      )
      .join(" | ") || "-";

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <BsWallet2 size={20} />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
              Total Volume
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCount.toLocaleString()} transactions
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <BsShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
              Successful
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(successAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {successCount.toLocaleString()} approvals
            </p>
          </div>
        </div>
      </div>

      {/* <div className="card">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/40 dark:text-red-300">
            <BsExclamationTriangle size={20} />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
              Declined
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(failedAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {failedCount.toLocaleString()} declines
            </p>
          </div>
        </div>
      </div> */}

      {/* <div className="card">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
            <BsInfoCircle size={20} />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
              Average Ticket
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(averageAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Source mix: {sourceSummary}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
              Status mix: {statusSummary}
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Transactions;
