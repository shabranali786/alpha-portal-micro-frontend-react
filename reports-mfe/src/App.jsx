import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy load pages
const UnitReport = lazy(() => import("./pages/reports/UnitReport"));
const SalesReport = lazy(() => import("./pages/reports/SalesReport"));
const MerchantReport = lazy(() => import("./pages/reports/MerchantReport"));
const TeamWiseReport = lazy(() => import("./pages/reports/TeamWiseReport"));
const UnitWiseReport = lazy(() => import("./pages/reports/UnitWiseReport"));
const CombinedSalesReport = lazy(() => import("./pages/reports/CombinedSalesReport"));

function ReportsApp() {
  const location = useLocation();
  const basePath = location.pathname.split('/')[1];

  return (
    <Routes>
      {basePath === 'unit-reports' && <Route path="/" element={<UnitReport />} />}
      {basePath === 'sales-reports' && <Route path="/" element={<SalesReport />} />}
      {basePath === 'merchant-reports' && <Route path="/" element={<MerchantReport />} />}
      {basePath === 'team-reports' && <Route path="/" element={<TeamWiseReport />} />}
      {basePath === 'unit-wise-reports' && <Route path="/" element={<UnitWiseReport />} />}
      {basePath === 'combined-sales-reports' && <Route path="/" element={<CombinedSalesReport />} />}
    </Routes>
  );
}

export default ReportsApp;
