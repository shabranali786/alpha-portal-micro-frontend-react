import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const OfficeLetters = lazy(() => import("./pages/office-letters/OfficeLetters"));
const AddOfficeLetter = lazy(() => import("./pages/office-letters/AddOfficeLetter"));
const EditOfficeLetter = lazy(() => import("./pages/office-letters/EditOfficeLetter"));
const ViewOfficeLetter = lazy(() => import("./pages/office-letters/ViewOfficeLetter"));

function DocumentsApp() {
  return (
    <Routes>
      <Route path="/office-letters" element={<OfficeLetters />} />
      <Route path="/office-letters/create" element={<AddOfficeLetter />} />
      <Route path="/office-letters/:id/edit" element={<EditOfficeLetter />} />
      <Route path="/office-letters/:id/view" element={<ViewOfficeLetter />} />
    </Routes>
  );
}

export default DocumentsApp;
