import React from 'react';
import { AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "تأكيد", cancelText = "إلغاء", isLoading = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg"
            onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخلها
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoading ? 'لحظة...' : confirmText}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
