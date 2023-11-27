import { Routes, Route } from "react-router-dom";
import { NotFoundPage } from "../features/static";
import MainLayout from "../features/home/pages/Layout";
import PedidosMain from "../features/pedidos/pages/PedidosMain";
import CrearPedido from "../features/pedidos/pages/CrearPedido";
import EditarPedido from "../features/pedidos/pages/EditarPedido";
import Dashboard from "../features/dashboard/pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pedidos" element={<PedidosMain />} />
        <Route path="pedidos/crear" element={<CrearPedido />} />
        <Route path="pedidos/:id" element={<EditarPedido />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
