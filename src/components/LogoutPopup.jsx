import React from 'react';

function LogoutPopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-black">
        <p>Are you sure you want to Logout?</p>
        <div className="flex space-x-4 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPopup;
