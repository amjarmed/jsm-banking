'use client';
// DoughnutChart.tsx - DoughnutChart component

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
function DoughnutChart({ accounts = [] }: DoughnutChartProps) {
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: [15523, 1234, 9999],
        backgroundColor: ['#0747b6', '#2665b8', '#2f91fa'],
      },
    ],
    labels: ['Current', 'Savings', 'Checking'],
  };
  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

export default DoughnutChart;
