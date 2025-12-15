import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Remote components
const RemoteDashboard = lazy(() => import("dashboard/Dashboard"));
const RemoteInvoice = lazy(() => import("sales/Invoice"));
const RemoteLead = lazy(() => import("sales/Lead"));

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Local routes */}
          <Route path="/" element={<Home />} />

          {/* Remote routes */}
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>Loading Dashboard...</div>}>
                <RemoteDashboard />
              </Suspense>
            }
          />
          <Route
            path="/invoices"
            element={
              <Suspense fallback={<div>Loading Invoices...</div>}>
                <RemoteInvoice />
              </Suspense>
            }
          />
          <Route
            path="/leads"
            element={
              <Suspense fallback={<div>Loading Leads...</div>}>
                <RemoteLead />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
