// frontend/src/components/Button.jsx
import React from 'react';

export default function Button({ children, onClick, type = 'primary', disabled, className = '' }) {
  const base = 'px-4 py-2 font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-surface text-text border border-neutral hover:bg-neutral/10',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const classes = `${base} ${variants[type] || variants.primary} ${className}`;
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

