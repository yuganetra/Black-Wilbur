// Popup.tsx
import React from 'react';

interface PopupProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // Optional confirm action
}

const Popup: React.FC<PopupProps> = ({ isVisible, title, message, onClose, onConfirm }) => {
  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          {onConfirm && (
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mr-2"
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
          <button
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
