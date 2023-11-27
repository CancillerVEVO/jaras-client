type PieChartType = "En Proceso" | "Entregados" | "Cancelados";

export interface PieChartItem {
  type: PieChartType;
  value: number;
  color: string;
}

export interface SaleByDateItem {
  fecha: string;
  total: number;
}

interface Count {
  enProceso: number;
  entregados: number;
  cancelados: number;
  total: number;
}

interface NextPaymentItem {
  fechaEstimada: string;
  precio: number;
  id: number;
  titulo: string;
  descripcion: string;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: {
    pieChart: PieChartItem[];
    saleByDate: SaleByDateItem[];
    count: Count;
    totalSales: number;
    nextPayment: NextPaymentItem[];
  };
}
