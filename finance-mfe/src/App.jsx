import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

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
  return (
    <Routes>
      <Route path="/transactions" element={<Transaction />} />
      <Route path="/transactions/:id" element={<TransactionDetails />} />
      <Route path="/chargebacks" element={<Chargebacks />} />
      <Route path="/external-payments" element={<ExternalPayments />} />
      <Route path="/external-payments/create" element={<AddExternalPaymentPage />} />
      <Route path="/external-payments/:id/edit" element={<EditExternalPaymentPage />} />
      <Route path="/external-payments/:id" element={<ViewExternalPaymentPage />} />
      <Route path="/expenses" element={<Expenses />} />
    </Routes>
  );
}

export default FinanceApp;
