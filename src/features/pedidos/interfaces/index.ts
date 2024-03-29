export interface pedidos {
  id: number;
  titulo: string;
  descripcion: string;
  cliente: string;
  estadoPedido: number;
  lugarEntrega: string;
  anticipoPagado: boolean;
  precio: number;
  fechaEstimada: string;
  fechaCreacion: string;
  fechaEntrega?: string;
  fechaCancelacion?: string;
}

export interface Estados {
  id: number;
  estado: string;
  descripcion: string;
}
export interface Lugares {
  id: number;
  lugar: string;
}
export interface PedidosMain {
  estados: Estados[];
  lugares: Lugares[];
  pedidos: pedidos[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export interface OptionsResponse {
  status: string;
  message: string;
  data: PedidosMain;
}
