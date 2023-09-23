import { Routes, Route } from "react-router-dom";
import { NotFoundPage } from "../features/static";
import MainLayout from "../features/home/pages/Layout";
import PedidosMain from "../features/pedidos/pages/PedidosMain";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="pedidos" element={<PedidosMain />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
