// src/pages/Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button"; // default import
import Card from "../components/Card";

export default function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h1>
        <p className="mb-6">You are logged in as <strong>{user?.role}</strong>.</p>
        <Button onClick={logout}>Logout</Button>
      </Card>
    </div>
  );
}
