import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = ({ title, data, className, showMoreLink }) => {
  // Calculate total amount for percentage calculation
  const totalAmount = data.reduce((acc, item) => acc + item.amount, 0);

  // Prepare chart data with percentages and colors
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: ((item.amount / totalAmount) * 100).toFixed(2),
    color: COLORS[index % COLORS.length], // Assign color from COLORS array
  }));

  return (
    <div className={`p-4 rounded-lg shadow-md ${className}`}>
      <h3 className="text-gray-800 font-bold text-lg mb-4">{title}</h3>

      {/* Top: Pie Chart */}
      <div className="w-full mb-6 flex items-center"> 
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={90}
              fill="#8884d8"
              labelLine={false}
              label={({ index }) => `${chartData[index].name}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom: Breakdown of Categories */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-lg font-semibold text-gray-600 border-b pb-1 mb-2">
          <span className="text-left w-1/3">Category</span>
          <span className="text-right w-1/3">Amount</span>
          <span className="text-right w-1/3">Percentage</span>
        </div>

        {/* Breakdown Data Rows */}
        <div className="space-y-1">
          {chartData.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="flex items-center text-left w-1/3">
                <span 
                  className="inline-block w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}
              </span>
              <span className="text-blue-800 text-right w-1/3">{item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ksh</span>
              <span className="text-gray-900 text-right w-1/3">({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {showMoreLink && (
        <a href="/analytics" className="flex items-center justify-end text-blue-500 font-semibold mt-4 underline">
          See more <ArrowForwardIcon className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default PieChartComponent;
