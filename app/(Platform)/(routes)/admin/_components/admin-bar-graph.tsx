"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AdminBarGraphProps {
  initialData: GraphData[];
}

type GraphData = {
  month: string;
  date: string;
  totalAmount: number;
};

export const AdminBarGraph = ({ initialData }: AdminBarGraphProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/graph-data?year=${selectedYear}`);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [selectedYear]);

  const labels = data.map((item) => item.month);
  const amounts = data.map((item) => item.totalAmount);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Sales Amount (${selectedYear}) in USD`,
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

  return (
    <div>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
      <Bar data={chartData} options={options} />
    </div>
  );
};
