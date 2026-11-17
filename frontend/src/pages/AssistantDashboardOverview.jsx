// frontend/src/pages/AssistantDashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Activity,
  Mail,
  RefreshCw,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AssistantDashboardOverview() {
  const [stats, setStats] = useState({});
  const [recentEmails, setRecentEmails] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, emailsRes, meetingsRes, draftsRes, notifsRes] = await Promise.all([
        api.get('/assistant/stats'),
        api.get('/emails'),
        api.get('/assistant/meetings'),
        api.get('/client/pending-approvals'),
        api.get('/assistant/notifications')
      ]);

      setStats(statsRes.data);
      setRecentEmails(emailsRes.data.slice(0, 6));
      setUpcomingMeetings(meetingsRes.data.slice(0, 4));
      setDrafts(draftsRes.data);
      setNotifications(notifsRes.data.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      <Sidebar counts={stats} role="assistant" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a]">
        {/* Top bar */}
        <div className="h-16 px-8 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Executive Assistant Command Center</h1>
              <p className="text-[11px] text-slate-400">Workspace overview for Dr. Evelyn Sterling's executive mailbox</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/assistant/inbox')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Inbox className="w-3.5 h-3.5" />
              Open Full Inbox
            </button>
            <button
              onClick={loadDashboardData}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh statistics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Overview Dashboard */}
        <div className="p-8 max-w-7xl space-y-8">
          {/* Top Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            <div
              onClick={() => navigate('/assistant/inbox')}
              className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total Emails</span>
                <Inbox className="w-4 h-4 group-hover:text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.total || 0}</div>
              <div className="text-[10px] text-slate-500">{stats.unread || 0} unread</div>
            </div>

            <div
              onClick={() => navigate('/assistant/to-reply')}
              className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-indigo-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">To Reply</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.assistantToReply || 0}</div>
              <div className="text-[10px] text-indigo-300">Assistant handled</div>
            </div>

            <div
              onClick={() => navigate('/assistant/client-reply')}
              className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Client Reply</span>
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.clientToReply || 0}</div>
              <div className="text-[10px] text-amber-300">Executive attention</div>
            </div>

            <div
              onClick={() => navigate('/assistant/action-required')}
              className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Action Req.</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.actionRequired || 0}</div>
              <div className="text-[10px] text-rose-300">High priority</div>
            </div>

            <div
              onClick={() => navigate('/assistant/waiting')}
              className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 hover:border-sky-500/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-sky-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Waiting</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.waiting || 0}</div>
              <div className="text-[10px] text-sky-300">Awaiting counter</div>
            </div>

            <div
              onClick={() => navigate('/assistant/important')}
              className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Important</span>
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.important || 0}</div>
              <div className="text-[10px] text-slate-500">Starred threads</div>
            </div>
          </div>

          {/* 2-Column Split: Recent Email Feed & Executive Workflow Radar */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Priority Incoming Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Recent Inbox Correspondence
                </h3>
                <button
                  onClick={() => navigate('/assistant/inbox')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View all in inbox &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {recentEmails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => navigate('/assistant/inbox')}
                    className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-start justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{email.sender}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-400">
                          {email.category}
                        </span>
                        {email.priority === 'HIGH' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            High Priority
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                        {email.subject}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {email.summary || email.preview}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${
                          email.classification === 'ASSISTANT_TO_REPLY'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : email.classification === 'CLIENT_TO_REPLY'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {email.classification.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Upcoming Meetings & Live Notifications */}
            <div className="space-y-6">
              {/* Upcoming Meetings */}
              <div className="p-6 rounded-3xl bg-[#111827]/80 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Upcoming Calendar Sync
                  </h3>
                  <button
                    onClick={() => navigate('/assistant/meetings')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting._id}
                      className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/90 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{meeting.title}</h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {meeting.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium">{meeting.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time System Notifications */}
              <div className="p-6 rounded-3xl bg-[#111827]/80 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    Assistant Activity Alerts
                  </h3>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/90 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

