// frontend/src/components/Card.jsx
import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-soft p-4 ${className}`}>
      {title && <h2 className="text-lg font-medium mb-3 text-text">{title}</h2>}
      {children}
    </div>
  );
}

