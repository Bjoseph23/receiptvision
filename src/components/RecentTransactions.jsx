import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RecentTransactions = ({ transactions, showMoreLink }) => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg md:text-2xl font-semibold mb-4 text-gray-700">Recent Transactions</h2>
      <ul className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3">
              <div className="mb-2 md:mb-0">
                <p className="text-sm md:text-lg font-medium text-gray-800">
                  {transaction.category_name || "Unknown Category"}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  {new Date(transaction.transaction_date).toLocaleDateString()} - {transaction.description}
                </p>
              </div>
              <p className="text-sm md:text-lg font-semibold text-red-500">
                -Ksh {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No recent transactions available.</p>
        )}
      </ul>
      {showMoreLink && (
        <a href="/analytics" className="flex items-center justify-end text-blue-500 font-semibold mt-4 text-xs md:text-sm underline">
          See more <ArrowForwardIcon className="ml-1" fontSize="small" />
        </a>
      )}
    </div>
  );
};

export default RecentTransactions;
