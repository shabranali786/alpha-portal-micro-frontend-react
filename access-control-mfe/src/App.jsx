import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const Users = lazy(() => import("./pages/Users/Users"));
const Teams = lazy(() => import("./pages/team/Teams"));
const Roles = lazy(() => import("./pages/Roles/Roles"));
const Permissions = lazy(() => import("./pages/permissions/Permissions"));
const IP = lazy(() => import("./pages/ip/IP"));

function AccessControlApp() {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/permissions" element={<Permissions />} />
      <Route path="/ip" element={<IP />} />
    </Routes>
  );
}

export default AccessControlApp;
