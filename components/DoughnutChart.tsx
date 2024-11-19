'use client';
// DoughnutChart.tsx - DoughnutChart component

import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js/auto';

import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
function DoughnutChart({accounts = []}: DoughnutChartProps) {
  const accountNames = accounts.map((account) => account.name);
  const balance = accounts.map((account) => account.currentBalance);

  const data = {
    datasets: [
      {
        label: 'Banks',
        data: balance,
        backgroundColor: ['#0747b6', '#2665b8', '#2f91fa'],
      },
    ],
    labels: accountNames,
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
