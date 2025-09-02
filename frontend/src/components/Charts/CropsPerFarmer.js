import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CropsPerFarmer = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.farmer_name),
    datasets: [
      {
        label: 'Number of Crops',
        data: data.map(item => item.crop_count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Crops per Farmer',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CropsPerFarmer;