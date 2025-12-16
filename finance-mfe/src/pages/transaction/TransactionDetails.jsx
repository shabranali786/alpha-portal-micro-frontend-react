import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BsArrowLeft,
  BsCreditCard2Front,
  BsExclamationTriangle,
  BsInfoCircle,
  BsPerson,
  BsShieldCheck,
  BsWallet2,
} from "react-icons/bs";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import { usePermission } from "../../utils/permissions";

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formatCurrency = (amount) => currency.format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const parseReason = (payload) => {
  if (!payload) return null;
  if (typeof payload === "object") return payload;
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
};

const statusBadge = (status) => {
  if (status === "accept" || status === "paid" || status === "success") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
  }
  return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200";
};

const TransactionDetails = () => {
  const canViewTransaction = usePermission(["transaction.show"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const seededTransaction = location.state?.transaction || null;
  const [transaction, setTransaction] = useState(seededTransaction);
  const [loading, setLoading] = useState(!seededTransaction);

  useEffect(() => {
    if (!canViewTransaction) {
      toast.error("You don't have permission to view transaction details");
      navigate("/transactions");
    }
  }, [canViewTransaction, navigate]);

  useEffect(() => {
    if (seededTransaction) {
      return;
    }

    const fetchTransaction = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await apiAxios.get(ApiRequest.transactions.list, {
          params: { payment_id: id, per_page: 1 },
        });
        const record = response.data?.data?.[0] || null;
        if (!record) {
          toast.error("Transaction not found");
          navigate("/transactions");
          return;
        }
        setTransaction(record);
      } catch (error) {
        console.error("Failed to load transaction", error);
        toast.error(
          error.response?.data?.message || "Failed to load transaction"
        );
        navigate("/transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, navigate, seededTransaction]);

  const parsedReason = useMemo(
    () => parseReason(transaction?.payment_reason),
    [transaction?.payment_reason]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[var(--color-body)]">
        <div className="text-center">
          <div className="inline-block size-12 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading transaction...
          </p>
        </div>
      </div>
    );
  }

  if (!transaction) return null;

  const statusLabel = transaction.payment_status || transaction.status;
  const detailCards = [
    {
      title: "Payment Amount",
      value: formatCurrency(transaction.payment_transaction_amount),
      icon: <BsWallet2 />,
      description: transaction.currency || "USD",
    },
    {
      title: "Transaction Status",
      value: statusLabel?.toUpperCase() || "UNKNOWN",
      icon:
        statusLabel === "accept" ? (
          <BsShieldCheck />
        ) : (
          <BsExclamationTriangle />
        ),
      description: transaction.payment_transaction_status || "",
    },
    {
      title: "Source",
      value: transaction.source_type?.toUpperCase() || "UNKNOWN",
      icon: <BsInfoCircle />,
      description: `Invoice: ${transaction.invoice_no || "N/A"}`,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/transactions")}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <BsArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Transaction #{transaction.payment_id}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Captured on {formatDate(transaction.payment_transaction_date)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${statusBadge(
              statusLabel
            )}`}
          >
            {statusLabel?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {detailCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                {card.icon}
                <p className="text-xs uppercase tracking-wide dark:text-slate-300">
                  {card.title}
                </p>
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Customer & Billing
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <SectionTitle icon={<BsPerson />}>Customer</SectionTitle>
              <DetailList
                items={[
                  ["Name", transaction.customer_name],
                  ["Email", transaction.customer_email],
                  ["Phone", transaction.customer_phone],
                  ["Lead ID", transaction.lead_id],
                  ["Brand ID", transaction.brand_id],
                ]}
              />
            </div>
            <div className="space-y-3">
              <SectionTitle icon={<BsCreditCard2Front />}>
                Card Details
              </SectionTitle>
              <DetailList
                items={[
                  ["Card Number", transaction.card_number],
                  ["Card Holder", transaction.cardholder_name],
                  ["Expiry", transaction.card_expiry],
                  ["CVV", transaction.card_cvv],
                  ["Billing Address", transaction.card_address],
                  ["Postal Code", transaction.card_postcode],
                ]}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Gateway Response
          </h2>
          {parsedReason && typeof parsedReason === "object" ? (
            <pre className="max-h-[320px] overflow-auto rounded-xl bg-slate-900/80 p-4 text-xs text-slate-100">
              {JSON.stringify(parsedReason, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {parsedReason || "No additional response metadata available."}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Metadata
          </h2>
          <DetailList
            columns={3}
            items={[
              ["Payment ID", transaction.payment_id],
              ["Invoice ID", transaction.invoice_id],
              ["Invoice No", transaction.invoice_no],
              ["Transaction ID", transaction.payment_transaction_id],
              ["Transaction Status", transaction.payment_transaction_status],
              ["Created At", formatDate(transaction.created_at)],
              ["Customer IP", transaction.customer_ip],
              ["Customer City", transaction.customer_city],
              ["Customer Region", transaction.customer_region],
              ["Customer Country", transaction.customer_country],
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
    {icon}
    <span>{children}</span>
  </div>
);

const DetailList = ({ items, columns = 1 }) => {
  const columnClass =
    columns === 3 ? "md:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";
  return (
    <dl className={`grid gap-3 ${columnClass}`}>
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </dt>
          <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {value || "-"}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default TransactionDetails;
