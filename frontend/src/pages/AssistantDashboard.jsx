// frontend/src/pages/AssistantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetailPane from '../components/EmailDetailPane';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, RefreshCw, Filter, Sparkles, Inbox, Plus } from 'lucide-react';

export default function AssistantDashboard() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const location = useLocation();

  // Determine current active filter based on route
  const getFilter = () => {
    const path = location.pathname;
    if (path.includes('to-reply')) return { classification: 'ASSISTANT_TO_REPLY' };
    if (path.includes('client-reply')) return { classification: 'CLIENT_TO_REPLY' };
    if (path.includes('no-reply')) return { classification: 'NO_REPLY_NEEDED' };
    if (path.includes('action-required')) return { actionRequired: true };
    if (path.includes('waiting')) return { waiting: true };
    if (path.includes('important')) return { important: 'true' };
    return {};
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/assistant/stats');
      setStats(statsRes.data);

      const params = getFilter();
      if (search) params.search = search;

      const emailsRes = await api.get('/emails', { params });
      setEmails(emailsRes.data);
      if (emailsRes.data.length > 0 && !selectedEmail) {
        setSelectedEmail(emailsRes.data[0]);
      } else if (selectedEmail) {
        const updated = emailsRes.data.find(e => e._id === selectedEmail._id);
        if (updated) setSelectedEmail(updated);
      }
    } catch (err) {
      console.error('Data loading error:', err);
      toast.error('Failed to load email updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [location.pathname]);

  const handleToggleStar = async (email) => {
    try {
      const res = await api.patch(`/emails/${email._id}/important`, { important: !email.isImportant });
      setEmails(emails.map(e => e._id === email._id ? res.data.email : e));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(res.data.email);
      }
      toast.success(res.data.email.isImportant ? 'Starred email' : 'Unstarred');
    } catch (err) {
      toast.error('Failed to toggle star');
    }
  };

  const handleUpdateEmail = (updated) => {
    setEmails(emails.map(e => e._id === updated._id ? updated : e));
    setSelectedEmail(updated);
    api.get('/assistant/stats').then(res => setStats(res.data)).catch(() => {});
  };

  // Get current view title
  const getViewTitle = () => {
    const p = location.pathname;
    if (p.includes('to-reply')) return 'Assistant to Reply';
    if (p.includes('client-reply')) return 'Client to Reply';
    if (p.includes('no-reply')) return 'No Reply Needed';
    if (p.includes('action-required')) return 'Action Required';
    if (p.includes('waiting')) return 'Waiting for Response';
    if (p.includes('important')) return 'Important & Starred';
    return 'All Inbox';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      {/* Sidebar */}
      <Sidebar counts={stats} role="assistant" />

      {/* Email List Column */}
      <div className="w-full md:w-[420px] lg:w-[460px] flex flex-col border-r border-slate-800/80 bg-[#0d121c] flex-shrink-0">
        {/* Header & Search */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              {getViewTitle()}
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {emails.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search sender, subject, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* List of emails */}
        <div className="flex-1 overflow-y-auto">
          <EmailList
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={(e) => setSelectedEmail(e)}
            onToggleStar={handleToggleStar}
            loading={loading}
          />
        </div>
      </div>

      {/* Email Detail Workspace */}
      <EmailDetailPane
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onUpdateEmail={handleUpdateEmail}
        isClientView={false}
      />
    </div>
  );
}
