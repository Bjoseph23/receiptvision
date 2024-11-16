import React from "react";

const CardComponent = ({ title, value, subValue1, subValue2, className }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-gray-700 font-bold text-lg">{title}</h3>
      <h2 className="text-3xl font-bold mt-2">${value || 0}</h2>
      {subValue1 && subValue2 && (
        <div className="flex justify-between mt-2">
          <p className="text-green-600">${subValue1 || 0}</p>
          <p className="text-red-600">${subValue2 || 0}</p>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
