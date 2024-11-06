// Modal.js
import React from "react";

export default function Modal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-2 text-center text-gray-800">
          Alert
        </h2>
        <p className="text-sm text-center text-gray-600">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
