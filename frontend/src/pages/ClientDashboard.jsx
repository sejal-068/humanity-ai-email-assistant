// frontend/src/pages/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetailPane from '../components/EmailDetailPane';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ClientDashboard() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [stats, setStats] = useState({});
  const [pendingDrafts, setPendingDrafts] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, draftsRes, meetingsRes] = await Promise.all([
        api.get('/assistant/stats'),
        api.get('/client/pending-approvals'),
        api.get('/assistant/meetings')
      ]);
      setStats(statsRes.data);
      setPendingDrafts(draftsRes.data);
      setUpcomingMeetings(meetingsRes.data.slice(0, 3));

      const path = location.pathname;
      let res;
      if (path.includes('handled')) {
        res = await api.get('/client/handled');
      } else if (path.includes('all')) {
        res = await api.get('/emails');
      } else {
        // Default: attention required (CLIENT_TO_REPLY)
        res = await api.get('/client/attention');
      }

      setEmails(res.data);
      if (res.data.length > 0 && !selectedEmail) {
        setSelectedEmail(res.data[0]);
      } else if (selectedEmail) {
        const found = res.data.find(e => e._id === selectedEmail._id);
        if (found) setSelectedEmail(found);
      }
    } catch (err) {
      console.error('Client data load error:', err);
      toast.error('Failed to load client inbox');
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
    } catch (err) {
      toast.error('Failed to toggle star');
    }
  };

  const handleUpdateEmail = (updated) => {
    setEmails(emails.map(e => e._id === updated._id ? updated : e));
    setSelectedEmail(updated);
    api.get('/assistant/stats').then(res => setStats(res.data)).catch(() => {});
  };

  const getClientTitle = () => {
    const p = location.pathname;
    if (p.includes('handled')) return 'Handled & Completed';
    if (p.includes('all')) return 'All Inbox';
    return 'Attention Required';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      {/* Sidebar */}
      <Sidebar counts={stats} role="client" />

      {/* Center Email Feed */}
      <div className="w-full md:w-[420px] lg:w-[460px] flex flex-col border-r border-slate-800/80 bg-[#0d121c] flex-shrink-0">
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              {getClientTitle()}
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {emails.length}
            </span>
          </div>

          <button
            onClick={loadData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Banner for Client */}
        <div className="px-4 py-2.5 bg-indigo-950/30 border-b border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>Executive Filter Active: Routine mail is handled by your assistant.</span>
        </div>

        {/* Quick Pending Approvals Widget for Client */}
        {pendingDrafts.length > 0 && (
          <div
            onClick={() => navigate('/client/approvals')}
            className="p-3 m-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/20 border border-purple-500/30 cursor-pointer hover:border-purple-500/60 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <FileCheck2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {pendingDrafts.length} Draft{pendingDrafts.length > 1 ? 's' : ''} Awaiting Sign-off
                </div>
                <div className="text-[10px] text-slate-400">Click to review and approve</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </div>
        )}

        {/* List of filtered emails */}
        <div className="flex-1 overflow-y-auto">
          <EmailList
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={(e) => setSelectedEmail(e)}
            onToggleStar={handleToggleStar}
            loading={loading}
            emptyTitle="Zero Items Requiring Attention"
            emptySubtitle="Your executive assistant has cleared or delegated all active inquiries."
          />
        </div>
      </div>

      {/* Email Detail Workspace */}
      <EmailDetailPane
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onUpdateEmail={handleUpdateEmail}
        isClientView={true}
      />
    </div>
  );
}
