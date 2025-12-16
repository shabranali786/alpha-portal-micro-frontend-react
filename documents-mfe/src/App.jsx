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
      <Route path="/" element={<OfficeLetters />} />
      <Route path="create" element={<AddOfficeLetter />} />
      <Route path=":id/edit" element={<EditOfficeLetter />} />
      <Route path=":id/view" element={<ViewOfficeLetter />} />
    </Routes>
  );
}

export default DocumentsApp;
