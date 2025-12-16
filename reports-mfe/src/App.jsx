import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const UnitReport = lazy(() => import("./pages/reports/UnitReport"));
const SalesReport = lazy(() => import("./pages/reports/SalesReport"));
const MerchantReport = lazy(() => import("./pages/reports/MerchantReport"));
const TeamWiseReport = lazy(() => import("./pages/reports/TeamWiseReport"));
const UnitWiseReport = lazy(() => import("./pages/reports/UnitWiseReport"));
const CombinedSalesReport = lazy(() => import("./pages/reports/CombinedSalesReport"));

function ReportsApp() {
  return (
    <Routes>
      <Route path="/unit-reports" element={<UnitReport />} />
      <Route path="/sales-reports" element={<SalesReport />} />
      <Route path="/merchant-reports" element={<MerchantReport />} />
      <Route path="/team-reports" element={<TeamWiseReport />} />
      <Route path="/unit-wise-reports" element={<UnitWiseReport />} />
      <Route path="/combined-sales-reports" element={<CombinedSalesReport />} />
    </Routes>
  );
}

export default ReportsApp;
