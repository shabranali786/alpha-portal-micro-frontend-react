import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy load pages
const PackagesMap = lazy(() => import("./pages/packages/PackagesMap"));
const EmailConfigs = lazy(() => import("./pages/email-configs/EmailConfigs"));

function ConfigApp() {
  const location = useLocation();
  const basePath = location.pathname.split('/')[1];

  return (
    <Routes>
      {basePath === 'package-mapping' && <Route path="/" element={<PackagesMap />} />}
      {basePath === 'email-configs' && <Route path="/" element={<EmailConfigs />} />}
    </Routes>
  );
}

export default ConfigApp;
