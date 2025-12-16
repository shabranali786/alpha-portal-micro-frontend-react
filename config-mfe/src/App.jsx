import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const PackagesMap = lazy(() => import("./pages/packages/PackagesMap"));
const EmailConfigs = lazy(() => import("./pages/email-configs/EmailConfigs"));

function ConfigApp() {
  return (
    <Routes>
      <Route path="/package-mapping" element={<PackagesMap />} />
      <Route path="/email-configs" element={<EmailConfigs />} />
    </Routes>
  );
}

export default ConfigApp;
