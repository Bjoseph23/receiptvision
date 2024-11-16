import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SpendingTips = ({ tips = [], showMoreLink }) => {
  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Tips Based on Your Spending</h3>
      <ul className="space-y-4">
        {tips.length === 0 ? (
          <li className="text-gray-500">No tips available</li>
        ) : (
          tips.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2">
              {/* Bullet point with gradient */}
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r from-blue-${600 - index * 100} to-blue-${400 - index * 100}`}
              />
              {/* Tip content */}
              <div className="flex-1 text-gray-700">{tip}</div>
            </li>
          ))
        )}
      </ul>
      {showMoreLink && (
        <a href="/goals" className="flex items-center justify-end text-blue-500 font-semibold mt-4 underline">
          See more <ArrowForwardIcon className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default SpendingTips;
