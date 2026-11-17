// frontend/src/components/Modal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-medium w-full max-w-lg mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral hover:text-text"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4 text-text">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
}

