import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RSIChart = ({ rsiLabels, rsiData, lsiData }) => {
  const rsiChartData = {
    labels: rsiLabels,
    datasets: [
      {
        label: 'RSI',
        data: rsiData,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'LSI',
        data: lsiData,
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const rsiChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(value, index, values) {
            return values[index].label;
          }
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '400px' }}>
      <h3>RSI and LSI Chart</h3>
      <Line data={rsiChartData} options={rsiChartOptions} />
    </div>
  );
};

export default RSIChart; 