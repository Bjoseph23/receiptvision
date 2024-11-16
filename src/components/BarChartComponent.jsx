import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ title, data = {}, className, showMoreLink }) => {
  const chartData = [
    {
      name: "Monday",
      income: data.income?.monday || 0,
      expenses: data.expenses?.monday || 0,
    },
    {
      name: "Tuesday",
      income: data.income?.tuesday || 0,
      expenses: data.expenses?.tuesday || 0,
    },
    {
      name: "Wednesday",
      income: data.income?.wednesday || 0,
      expenses: data.expenses?.wednesday || 0,
    },
    {
      name: "Thursday",
      income: data.income?.thursday || 0,
      expenses: data.expenses?.thursday || 0,
    },
    {
      name: "Friday",
      income: data.income?.friday || 0,
      expenses: data.expenses?.friday || 0,
    },
  ];

  return (
    <div className={`p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-gray-700 font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#82ca9d" />
          <Bar dataKey="expenses" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      {showMoreLink && (
        <a href="/analytics" className="flex items-center justify-end text-blue-500 font-semibold mt-4 underline">
          See more <ArrowForwardIcon className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default BarChartComponent;
