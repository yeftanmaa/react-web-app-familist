import React from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

const expenses = [900000, 920000, 920000, 930000, 960000, 1000000, 980000, 950000, 980000, 1200000, 1100000, 1100000, 1150000, 1120000, 1150000]

const data = {
  labels: labels,
  datasets: [
    {
      label: "Monthly Expenses",
      backgroundColor: "rgb(203,108,230)",
      borderColor: "rgb(203,108,230)",
      data: expenses,
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    },
  ],
};

const LineChart = () => {
  return (
    <div>
      <Line data={data} />
    </div>
  )
}

export default LineChart;