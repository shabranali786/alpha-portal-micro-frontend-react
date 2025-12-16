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

          {/* Sales MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <SalesApp />
              </Suspense>
            }
          />

          {/* Finance MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <FinanceApp />
              </Suspense>
            }
          />

          {/* Reports MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsApp />
              </Suspense>
            }
          />

          {/* Access Control MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccessControlApp />
              </Suspense>
            }
          />

          {/* Brands MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <BrandsApp />
              </Suspense>
            }
          />

          {/* Documents MFE routes */}
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoader />}>
                <DocumentsApp />
              </Suspense>
            }
          />

          {/* Config MFE routes */}
          <Route
            path="/*"
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
