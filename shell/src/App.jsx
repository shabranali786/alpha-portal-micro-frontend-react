import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Master from "@crm/shared/components/layout/Master";
import ProtectedRoute from "@crm/shared/components/ProtectedRoute";
import { initializeAuth } from "@crm/shared/store/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import "@crm/shared/styles/main.css";

// Remote microfrontend imports
const SalesApp = lazy(() => import("salesMfe/SalesApp"));
const FinanceApp = lazy(() => import("financeMfe/FinanceApp"));
const ReportsApp = lazy(() => import("reportsMfe/ReportsApp"));
const AccessControlApp = lazy(() => import("accessControlMfe/AccessControlApp"));
const BrandsApp = lazy(() => import("brandsMfe/BrandsApp"));
const DocumentsApp = lazy(() => import("documentsMfe/DocumentsApp"));
const ConfigApp = lazy(() => import("configMfe/ConfigApp"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full size-12 border-b-2 border-primary/60"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Master />
              </Suspense>
            </ProtectedRoute>
          }
        >
          {/* Shell local routes */}
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* Sales MFE - handles leads, customer, invoices */}
          <Route
            path="leads/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <SalesApp />
              </Suspense>
            }
          />
          <Route
            path="customer/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <SalesApp />
              </Suspense>
            }
          />
          <Route
            path="invoices/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <SalesApp />
              </Suspense>
            }
          />

          {/* Finance MFE */}
          <Route
            path="transactions/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <FinanceApp />
              </Suspense>
            }
          />
          <Route
            path="chargebacks/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <FinanceApp />
              </Suspense>
            }
          />
          <Route
            path="external-payments/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <FinanceApp />
              </Suspense>
            }
          />
          <Route
            path="expenses/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <FinanceApp />
              </Suspense>
            }
          />

          {/* Reports MFE */}
          <Route
            path="unit-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />
          <Route
            path="sales-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />
          <Route
            path="merchant-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />
          <Route
            path="team-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />
          <Route
            path="unit-wise-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />
          <Route
            path="combined-sales-reports/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />

          {/* Access Control MFE */}
          <Route
            path="users/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />
          <Route
            path="teams/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />
          <Route
            path="roles/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />
          <Route
            path="permissions/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />
          <Route
            path="ip/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />

          {/* Brands MFE */}
          <Route
            path="units/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />
          <Route
            path="brands/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />
          <Route
            path="chats/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />
          <Route
            path="merchants/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />
          <Route
            path="merchant-mapping/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />

          {/* Documents MFE */}
          <Route
            path="office-letters/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <DocumentsApp />
              </Suspense>
            }
          />

          {/* Config MFE */}
          <Route
            path="package-mapping/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ConfigApp />
              </Suspense>
            }
          />
          <Route
            path="email-configs/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ConfigApp />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
