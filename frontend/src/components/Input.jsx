// frontend/src/components/Input.jsx
import React from 'react';

export default function Input({ id, label, type = 'text', placeholder = '', value, onChange, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
      />
    </div>
  );
}

