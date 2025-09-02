import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CropsByType = ({ data }) => {
  // Generate random colors for each crop type
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
    }
    return colors;
  };

  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: generateColors(data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Crops by Type',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default CropsByType;