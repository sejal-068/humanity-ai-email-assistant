// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AssistantDashboardOverview from './pages/AssistantDashboardOverview';
import AssistantDashboard from './pages/AssistantDashboard';
import ClientDashboard from './pages/ClientDashboard';
import PendingApprovals from './pages/PendingApprovals';
import Meetings from './pages/Meetings';
import ConnectedAccounts from './pages/ConnectedAccounts';
import Settings from './pages/Settings';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0b0f17] text-slate-400 text-sm">
        Loading Humanity AI Workspace...
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Assistant Workspace Routes */}
      <Route
        path="/assistant"
        element={
          <PrivateRoute>
            <AssistantDashboardOverview />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/overview"
        element={
          <PrivateRoute>
            <AssistantDashboardOverview />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/inbox"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/to-reply"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/client-reply"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/no-reply"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/action-required"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/waiting"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/important"
        element={
          <PrivateRoute>
            <AssistantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/meetings"
        element={
          <PrivateRoute>
            <Meetings role="assistant" />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/accounts"
        element={
          <PrivateRoute>
            <ConnectedAccounts role="assistant" />
          </PrivateRoute>
        }
      />
      <Route
        path="/assistant/settings"
        element={
          <PrivateRoute>
            <Settings role="assistant" />
          </PrivateRoute>
        }
      />

      {/* Client Workspace Routes */}
      <Route
        path="/client"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/attention"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/approvals"
        element={
          <PrivateRoute>
            <PendingApprovals />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/all"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/handled"
        element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/meetings"
        element={
          <PrivateRoute>
            <Meetings role="client" />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/accounts"
        element={
          <PrivateRoute>
            <ConnectedAccounts role="client" />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/settings"
        element={
          <PrivateRoute>
            <Settings role="client" />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === 'client' ? '/client/attention' : '/assistant'} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
