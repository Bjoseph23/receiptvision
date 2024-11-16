import React, { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LineChartComponent = ({ title, data, className, showMoreLink }) => {
  const [view, setView] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("November");

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const weeks = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"
  ];

  const chartData = view === "yearly"
    ? months.map((month) => ({
        name: month,
        value: data[month]?.total || 0,
      }))
    : weeks.map((week) => ({
        name: week,
        value: data[selectedMonth]?.[week]?.total || 0,
      }));

  return (
    <div className={`rounded-lg shadow-md p-4 ${className} flex flex-col w-full`}>
      <h3 className="text-gray-600 font-bold mb-2 text-xs md:text-base">{title}</h3>
      
      <div className="flex justify-end mb-2 space-x-2 md:space-x-4">
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="p-1 md:p-2 border rounded text-xs md:text-base"
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </select>
        {view === "monthly" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-1 md:p-2 border rounded text-xs md:text-base"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        )}
      </div>

      <div className="h-36 md:h-52 mb-4 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {showMoreLink && (
        <div className="mt-auto flex justify-end">
          <a href="/analytics" className="text-blue-500 font-semibold text-xs md:text-sm underline flex items-center">
            See more <ArrowForwardIcon className="ml-1" fontSize="small" />
          </a>
        </div>
      )}
    </div>
  );
};

export default LineChartComponent;
