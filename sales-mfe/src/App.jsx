import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const basePath = location.pathname.split('/')[1]; // Get base: leads, customer, or invoices

  return (
    <Routes>
      {/* Leads routes */}
      {basePath === 'leads' && (
        <>
          <Route path="/" element={<Lead />} />
          <Route path=":id/details" element={<LeadDetails />} />
        </>
      )}

      {/* Customer routes */}
      {basePath === 'customer' && (
        <>
          <Route path="/" element={<Customer />} />
          <Route path=":id/details" element={<CustomerDetails />} />
        </>
      )}

      {/* Invoice routes */}
      {basePath === 'invoices' && (
        <>
          <Route path="/" element={<Invoices />} />
          <Route path="create" element={<AddInvoicePage />} />
          <Route path=":id/edit" element={<EditInvoicePage />} />
          <Route path=":id" element={<ViewInvoicePage />} />
        </>
      )}
    </Routes>
  );
}

export default SalesApp;
