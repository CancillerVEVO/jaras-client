import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { PieChartItem } from "../interfaces";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: PieChartItem[];
}

export function PieChart({ data }: PieChartProps) {
  const chartData = {
    labels: data.map((item) => item.type),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
      },
    ],
  };

  return <Pie data={chartData} />;
}
