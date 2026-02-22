import { useState, useEffect } from 'react';

function FlashMessage({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-slide-in`}>
      <div className="flex items-center space-x-2">
        {type === 'success' ? (
          <i className="fa-solid fa-circle-check text-xl"></i>
        ) : (
          <i className="fa-solid fa-circle-exclamation text-xl"></i>
        )}
        <span className="font-medium">{message}</span>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>
  );
}

export default FlashMessage;