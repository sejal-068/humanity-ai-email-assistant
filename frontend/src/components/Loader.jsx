// frontend/src/components/Loader.jsx
import React from 'react';

export default function Loader({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return (
    <div className={`inline-block border-4 border-primary/30 border-t-primary rounded-full animate-spin ${sizes[size]} ${className}`} />
  );
}

