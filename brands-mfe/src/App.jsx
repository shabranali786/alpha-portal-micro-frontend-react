import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages
const Unit = lazy(() => import("./pages/unit/Unit"));
const Brands = lazy(() => import("./pages/brands/Brands"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const Merchants = lazy(() => import("./pages/merchants/Merchants"));
const MerchantMapping = lazy(() => import("./pages/merchants/MerchantMapping"));

function BrandsApp() {
  return (
    <Routes>
      <Route path="/units" element={<Unit />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/chats" element={<Chat />} />
      <Route path="/merchants" element={<Merchants />} />
      <Route path="/merchant-mapping" element={<MerchantMapping />} />
    </Routes>
  );
}

export default BrandsApp;
