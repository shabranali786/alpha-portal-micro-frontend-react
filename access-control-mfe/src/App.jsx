import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy load pages
const Users = lazy(() => import("./pages/Users/Users"));
const Teams = lazy(() => import("./pages/team/Teams"));
const Roles = lazy(() => import("./pages/Roles/Roles"));
const Permissions = lazy(() => import("./pages/permissions/Permissions"));
const IP = lazy(() => import("./pages/ip/IP"));

function AccessControlApp() {
  const location = useLocation();
  const basePath = location.pathname.split('/')[1];

  return (
    <Routes>
      {basePath === 'users' && <Route path="/" element={<Users />} />}
      {basePath === 'teams' && <Route path="/" element={<Teams />} />}
      {basePath === 'roles' && <Route path="/" element={<Roles />} />}
      {basePath === 'permissions' && <Route path="/" element={<Permissions />} />}
      {basePath === 'ip' && <Route path="/" element={<IP />} />}
    </Routes>
  );
}

export default AccessControlApp;
