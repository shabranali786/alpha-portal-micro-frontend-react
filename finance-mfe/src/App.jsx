import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy load pages
const Transaction = lazy(() => import("./pages/transaction/Transaction"));
const TransactionDetails = lazy(() => import("./pages/transaction/TransactionDetails"));
const Chargebacks = lazy(() => import("./pages/chargeback/Chargebacks"));
const ExternalPayments = lazy(() => import("./pages/external-payments/ExternalPayments"));
const AddExternalPaymentPage = lazy(() => import("./pages/external-payments/AddExternalPaymentPage"));
const EditExternalPaymentPage = lazy(() => import("./pages/external-payments/EditExternalPaymentPage"));
const ViewExternalPaymentPage = lazy(() => import("./pages/external-payments/ViewExternalPaymentPage"));
const Expenses = lazy(() => import("./pages/expenses/Expenses"));

function FinanceApp() {
  const location = useLocation();
  const basePath = location.pathname.split('/')[1];

  return (
    <Routes>
      {/* Transactions routes */}
      {basePath === 'transactions' && (
        <>
          <Route path="/" element={<Transaction />} />
          <Route path=":id" element={<TransactionDetails />} />
        </>
      )}

      {/* Chargebacks routes */}
      {basePath === 'chargebacks' && (
        <Route path="/" element={<Chargebacks />} />
      )}

      {/* External Payments routes */}
      {basePath === 'external-payments' && (
        <>
          <Route path="/" element={<ExternalPayments />} />
          <Route path="create" element={<AddExternalPaymentPage />} />
          <Route path=":id/edit" element={<EditExternalPaymentPage />} />
          <Route path=":id" element={<ViewExternalPaymentPage />} />
        </>
      )}

      {/* Expenses routes */}
      {basePath === 'expenses' && (
        <Route path="/" element={<Expenses />} />
      )}
    </Routes>
  );
}

export default FinanceApp;
