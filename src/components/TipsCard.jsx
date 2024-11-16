import React from 'react';

const TipsCard = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-2xl shadow-md">
      <h3 className="font-bold text-lg mb-4">Tips based on your spending</h3>
      <div className="flex flex-col space-y-4">
        {/* Tip 1 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
            <p className="font-semibold">Based on your monthly spending</p>
          </div>
          <p className="text-gray-500 text-sm">it is recommended that you .......</p>
          <hr className="mt-2 border-t border-gray-200" />
        </div>

        {/* Tip 2 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
            <p className="font-semibold">Based on your monthly income</p>
          </div>
          <p className="text-gray-500 text-sm">it is recommended that you .......</p>
          <hr className="mt-2 border-t border-gray-200" />
        </div>

        {/* Tip 3 */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
            <p className="font-semibold">Analyzing your goals</p>
          </div>
          <p className="text-gray-500 text-sm">it is recommended that you .......</p>
          <hr className="mt-2 border-t border-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default TipsCard;
