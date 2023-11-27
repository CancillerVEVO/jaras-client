import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SaleByDateItem } from "../interfaces";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: SaleByDateItem[];
}

export function SalesChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.map((item) => item.fecha),
    datasets: [
      {
        label: "Ventas",
        data: data.map((item) => item.total),
        fill: false,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
      },
    ],
  };

  return <Line data={chartData} />;
}
