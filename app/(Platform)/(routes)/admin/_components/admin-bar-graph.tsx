"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AdminBarGraphProps {
  data: GraphData[];
}

type GraphData = {
  month: string;
  date: string;
  totalAmount: number;
};

export const AdminBarGraph = ({ data }: AdminBarGraphProps) => {
  const labels = data.map((item) => item.month);
  const amounts = data.map((item) => item.totalAmount);

  const chartData = {
    labels: labels,
    datasets: [
      {
        // Show the year the order was created
        label: "Sales Amount" + ` (${new Date().getFullYear()})`,
        data: amounts,
        backgroundColor: "rgb(106,196,231)",
        borderColor: "rgba(93,159,196, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options}></Bar>;
};
