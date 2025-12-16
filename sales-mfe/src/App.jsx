import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const Lead = lazy(() => import("./pages/lead/Lead"));
const LeadDetails = lazy(() => import("./pages/lead/LeadDetails"));
const Customer = lazy(() => import("./pages/customer/Customer"));
const CustomerDetails = lazy(() => import("./pages/customer/LeadDetails"));
const Invoices = lazy(() => import("./pages/invoice/Invoices"));
const AddInvoicePage = lazy(() => import("./pages/invoice/AddInvoicePage"));
const EditInvoicePage = lazy(() => import("./pages/invoice/EditInvoicePage"));
const ViewInvoicePage = lazy(() => import("./pages/invoice/ViewInvoicePage"));

function SalesApp() {
  return (
    <Routes>
      <Route path="/leads" element={<Lead />} />
      <Route path="/leads/:id/details" element={<LeadDetails />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/customer/:id/details" element={<CustomerDetails />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/invoices/create" element={<AddInvoicePage />} />
      <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
      <Route path="/invoices/:id" element={<ViewInvoicePage />} />
    </Routes>
  );
}

export default SalesApp;
