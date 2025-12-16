import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy load pages
const Unit = lazy(() => import("./pages/unit/Unit"));
const Brands = lazy(() => import("./pages/brands/Brands"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const Merchants = lazy(() => import("./pages/merchants/Merchants"));
const MerchantMapping = lazy(() => import("./pages/merchants/MerchantMapping"));

function BrandsApp() {
  const location = useLocation();
  const basePath = location.pathname.split('/')[1];

  return (
    <Routes>
      {basePath === 'units' && <Route path="/" element={<Unit />} />}
      {basePath === 'brands' && <Route path="/" element={<Brands />} />}
      {basePath === 'chats' && <Route path="/" element={<Chat />} />}
      {basePath === 'merchants' && <Route path="/" element={<Merchants />} />}
      {basePath === 'merchant-mapping' && <Route path="/" element={<MerchantMapping />} />}
    </Routes>
  );
}

export default BrandsApp;
