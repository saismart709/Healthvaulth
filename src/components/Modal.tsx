import React from 'react';

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal bg-white rounded-xl p-7 w-full ${size === 'lg' ? 'max-w-[640px]' : 'max-w-[480px]'} shadow-2xl animate-in fade-in zoom-in duration-200`}>
        <div className="modal-header flex items-center justify-between mb-6">
          <div className="modal-title text-lg font-bold">{title}</div>
          <button className="modal-close bg-gray-100 hover:bg-gray-200 rounded-lg w-8 h-8 flex items-center justify-center text-gray-600 transition-colors" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        {footer && (
          <div className="modal-footer flex gap-2 justify-end mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
