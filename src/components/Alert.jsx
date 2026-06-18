import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

function Alert({ message, type = 'success', onClose }) {
  const { t } = useLanguage(); // ← Translation hook available

  // If you pass a translation key as message, you can do:
  // const displayMessage = t(message) || message;
  // For now, we display the message as is (dynamic alerts from backend/API).

  const icons = {
    success: <FiCheckCircle className="text-green-500" size={20} />,
    error: <FiAlertCircle className="text-red-500" size={20} />
  };
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`${styles[type]} border rounded-xl shadow-lg p-4 min-w-[300px] flex items-center justify-between gap-3 animate-slide-down`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="opacity-60 hover:opacity-100">
        <FiX size={18} />
      </button>
    </div>
  );
}

export default Alert;