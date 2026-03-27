import React from 'react';

interface ToastProps {
  msg: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ msg, type = 'info', onClose }) => {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  const borderColor = {
    info: 'border-primary',
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-amber-500'
  };

  return (
    <div className={`toast show ${type} border-l-4 ${borderColor[type]} bg-white rounded-lg p-3 shadow-lg flex items-center gap-3 pointer-events-auto min-w-[260px]`}>
      <span className="toast-icon text-lg">{icons[type]}</span>
      <span className="text-sm font-medium flex-1">{msg}</span>
      <button className="toast-close text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
    </div>
  );
};
