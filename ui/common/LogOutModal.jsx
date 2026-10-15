"use client";
import React from "react";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-xl p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4 text-red-600 text-5xl">
          <i className="ri-logout-circle-line"></i>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Are you sure you want to logout?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          You will be logged out and redirected to the login page.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
