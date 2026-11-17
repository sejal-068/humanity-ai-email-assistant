// frontend/src/pages/Meetings.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Plus, Video, CheckCircle2 } from 'lucide-react';

export default function Meetings({ role = 'assistant' }) {
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('2:00 PM');
  const [newParticipants, setNewParticipants] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, meetingsRes] = await Promise.all([
        api.get('/assistant/stats'),
        api.get('/assistant/meetings')
      ]);
      setStats(statsRes.data);
      setMeetings(meetingsRes.data);
    } catch (err) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      const res = await api.post('/assistant/meetings', {
        title: newTitle,
        date: newDate ? new Date(newDate) : new Date(),
        time: newTime,
        participants: newParticipants.split(',').map((p) => p.trim()).filter(Boolean)
      });
      setMeetings([...meetings, res.data]);
      setShowModal(false);
      setNewTitle('');
      setNewDate('');
      setNewParticipants('');
      toast.success('Meeting scheduled successfully!');
    } catch (err) {
      toast.error('Failed to create meeting');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      <Sidebar counts={stats} role={role} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a]">
        {/* Top bar */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base font-bold text-white">Meetings & Calendar Sync</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
        </div>

        {/* Meeting Grid */}
        <div className="p-8 max-w-5xl space-y-6">
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>AI automatically extracts and synchronizes calendar invites detected in email correspondence.</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="p-5 rounded-2xl bg-[#111827]/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {meeting.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {meeting.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{meeting.time || '10:00 AM'}</span>
                  </div>
                </div>

                {meeting.participants && meeting.participants.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{meeting.participants.join(', ')}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => toast.success('Launching Google Meet session...')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for adding meeting */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-2xl space-y-4">
              <h2 className="text-base font-bold text-white">Schedule New Calendar Sync</h2>
              <form onSubmit={handleCreateMeeting} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Meeting Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Q4 Executive Strategy Sync"
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Time</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 2:00 PM EST"
                      className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Participants (comma separated)</label>
                  <input
                    type="text"
                    value={newParticipants}
                    onChange={(e) => setNewParticipants(e.target.value)}
                    placeholder="client@acme.com, partner@vc.io"
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Confirm & Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

