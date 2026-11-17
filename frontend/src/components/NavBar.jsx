// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-white border-b border-neutral/10">
      <div className="text-2xl font-semibold text-primary">HUMANITY</div>
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-text hover:text-primary transition">Home</Link>
        <Link to="/assistant" className="text-text hover:text-primary transition">Assistant</Link>
        <Link to="/client" className="text-text hover:text-primary transition">Client</Link>
        <Link to="/settings" className="text-text hover:text-primary transition">Settings</Link>
        <Button type="primary" className="ml-4">
          <Link to="/login" className="text-white no-underline">Sign In</Link>
        </Button>
      </div>
    </nav>
  );
}

