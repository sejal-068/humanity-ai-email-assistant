// frontend/src/pages/PendingApprovals.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FileCheck2, Check, Edit3, MessageSquare, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PendingApprovals() {
  const [drafts, setDrafts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, draftsRes] = await Promise.all([
        api.get('/assistant/stats'),
        api.get('/client/pending-approvals')
      ]);
      setStats(statsRes.data);
      setDrafts(draftsRes.data);
    } catch (err) {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (draftId) => {
    try {
      await api.patch(`/client/drafts/${draftId}/approve`);
      toast.success('Draft approved! The assistant has been notified.');
      loadData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleRequestChanges = async (draftId) => {
    const feedback = feedbackInput[draftId] || '';
    if (!feedback.trim()) {
      toast.error('Please enter revision feedback for the assistant.');
      return;
    }
    try {
      await api.patch(`/client/drafts/${draftId}/request-changes`, { feedback });
      toast.success('Changes requested! The assistant has been notified.');
      setShowFeedbackModal(null);
      loadData();
    } catch (err) {
      toast.error('Failed to request changes');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      <Sidebar counts={stats} role="client" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a]">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base font-bold text-white">Pending Executive Approvals</h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 ml-2">
              {drafts.length} drafts
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              Review, edit, or approve replies drafted by your Executive Assistant before dispatching them to external stakeholders.
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <Check className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">No Drafts Awaiting Sign-off</h3>
              <p className="text-xs text-slate-500">All prepared correspondence has been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft._id}
                  className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800/80 shadow-md space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {draft.status === 'CHANGES_REQUESTED' ? 'Revision in Progress' : 'Awaiting Approval'}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{draft.subject}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Recipient: <strong className="text-slate-300">{draft.recipient}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Draft Body preview */}
                  <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800/90 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {draft.body}
                  </div>

                  {/* Feedback display if existing */}
                  {draft.clientFeedback && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Existing Client Feedback:</strong> {draft.clientFeedback}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowFeedbackModal(draft._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleApprove(draft._id)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Sign-off
                    </button>
                  </div>

                  {/* Feedback Inline Modal */}
                  {showFeedbackModal === draft._id && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Provide Specific Feedback to Assistant:
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackInput[draft._id] || ''}
                        onChange={(e) =>
                          setFeedbackInput({ ...feedbackInput, [draft._id]: e.target.value })
                        }
                        placeholder="e.g. Please clarify that wire instructions must be verified over phone callback..."
                        className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowFeedbackModal(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestChanges(draft._id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          Send Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

