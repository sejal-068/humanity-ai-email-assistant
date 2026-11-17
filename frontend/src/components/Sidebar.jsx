// frontend/src/components/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationsModal from './NotificationsModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Inbox,
  Sparkles,
  UserCheck,
  Ban,
  AlertTriangle,
  Clock,
  Star,
  Calendar,
  Layers,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard
} from 'lucide-react';

export default function Sidebar({ counts = {}, role = 'assistant' }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/assistant/notifications');
      setNotifications(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/assistant/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (e) {}
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const assistantNav = [
    { label: 'Overview Dashboard', to: '/assistant/overview', icon: LayoutDashboard },
    { label: 'All Inbox', to: '/assistant/inbox', icon: Inbox, count: counts.total },
    { label: 'Assistant to Reply', to: '/assistant/to-reply', icon: Sparkles, count: counts.assistantToReply, highlight: true },
    { label: 'Client to Reply', to: '/assistant/client-reply', icon: UserCheck, count: counts.clientToReply },
    { label: 'No Reply Needed', to: '/assistant/no-reply', icon: Ban, count: counts.noReplyNeeded },
    { label: 'Action Required', to: '/assistant/action-required', icon: AlertTriangle, count: counts.actionRequired },
    { label: 'Waiting on Reply', to: '/assistant/waiting', icon: Clock, count: counts.waiting },
    { label: 'Starred & Important', to: '/assistant/important', icon: Star, count: counts.important },
    { label: 'Meetings & Schedule', to: '/assistant/meetings', icon: Calendar, count: counts.upcomingMeetings },
    { label: 'Connected Mailboxes', to: '/assistant/accounts', icon: Layers },
    { label: 'Settings', to: '/assistant/settings', icon: Settings },
  ];

  const clientNav = [
    { label: 'Attention Required', to: '/client/attention', icon: AlertTriangle, count: counts.clientToReply, highlight: true },
    { label: 'Pending Approvals', to: '/client/approvals', icon: FileCheck2, count: counts.pendingApprovals, highlight: true },
    { label: 'All Conversations', to: '/client/all', icon: Inbox, count: counts.total },
    { label: 'Handled & Completed', to: '/client/handled', icon: CheckCircle2, count: counts.completed },
    { label: 'Meetings & Sync', to: '/client/meetings', icon: Calendar, count: counts.upcomingMeetings },
    { label: 'Connected Mailboxes', to: '/client/accounts', icon: Layers },
    { label: 'Preferences', to: '/client/settings', icon: Settings },
  ];

  const links = role === 'client' ? clientNav : assistantNav;

  return (
    <>
      <aside className="w-64 flex flex-col h-screen bg-[#0e1420] border-r border-slate-800/80 select-none flex-shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              H
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                HUMANITY
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {role === 'client' ? 'Executive Client' : 'Executive Assistant'}
              </div>
            </div>
          </div>

          {/* Notifications bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Quick Role Switcher Pill */}
        <div className="p-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${role === 'client' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-xs font-medium text-slate-300 capitalize">{user?.role || role} Workspace</span>
            </div>
            <button
              onClick={() => navigate(role === 'assistant' ? '/client/attention' : '/assistant')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline px-2 py-0.5 rounded bg-indigo-500/10"
              title="Switch between Assistant and Client views"
            >
              Switch View
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            Workspace Menus
          </div>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-indigo-400" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      item.highlight && item.count > 0
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700/80'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0a0e17]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-200 truncate">{user?.name || 'Logged User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={handleMarkRead}
        />
      )}
    </>
  );
}
