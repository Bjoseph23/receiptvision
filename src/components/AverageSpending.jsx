import React from "react";


const AverageSpending = ({ spending = 0, income = 0, expenses = 0 }) => {
  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Average Spending</h3>
      <div className="text-4xl font-bold text-gray-800 mb-2">
        KSh {spending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center bg-green-300 text-green-500 rounded-full p-2 mr-2">
          </div>
          <div>
            <span className="text-sm text-gray-500">Income</span>
            <div className="text-lg font-semibold">KSh {income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center bg-red-400 text-red-500 rounded-full p-2 mr-2">
          </div>
          <div>
            <span className="text-sm text-gray-500">Expenses</span>
            <div className="text-lg font-semibold">KSh {expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageSpending;
