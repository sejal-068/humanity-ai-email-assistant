// frontend/src/components/Badge.jsx
import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const colors = {
    assistant: 'bg-success text-white', // green
    client: 'bg-info text-white', // blue
    noreply: 'bg-neutral text-white', // grey
    review: 'bg-warning text-white', // amber
    default: 'bg-surface text-text border border-neutral',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${colors[variant] || colors.default} ${className}`}>
      {children}
    </span>
  );
}

