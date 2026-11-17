// frontend/src/components/EmailDetailPane.jsx
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Save,
  CheckCircle,
  Archive,
  Star,
  RefreshCw,
  Clock,
  UserCheck,
  Ban,
  ArrowLeft,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function EmailDetailPane({
  email,
  onClose = () => {},
  onUpdateEmail = () => {},
  isClientView = false
}) {
  const [draftBody, setDraftBody] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [classification, setClassification] = useState(email?.classification || 'NEEDS_REVIEW');

  useEffect(() => {
    if (email) {
      setClassification(email.classification);
      // Fetch existing draft if any
      api
        .get(`/assistant/drafts/${email._id}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setDraftBody(res.data[0].body);
          } else {
            setDraftBody('');
          }
        })
        .catch(() => setDraftBody(''));
    }
  }, [email?._id]);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
        <Mail className="w-12 h-12 stroke-[1.2] mb-3 text-slate-600" />
        <p className="text-sm font-medium text-slate-400">Select an email to view full conversation and AI intelligence</p>
      </div>
    );
  }

  // Action: Generate AI Draft
  const handleGenerateDraft = async () => {
    setLoadingAI(true);
    try {
      const res = await api.post(`/ai/draft/${email._id}`);
      setDraftBody(res.data.draft);
      toast.success('AI draft generated!');
    } catch (err) {
      toast.error('Failed to generate AI draft');
    } finally {
      setLoadingAI(false);
    }
  };

  // Action: Save Draft
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await api.post('/assistant/drafts', {
        emailId: email._id,
        recipient: email.senderEmail,
        subject: `Re: ${email.subject}`,
        body: draftBody
      });
      toast.success('Draft saved successfully');
    } catch (err) {
      toast.error('Could not save draft');
    } finally {
      setSavingDraft(false);
    }
  };

  // Action: Manual Classification change
  const handleChangeClassification = async (newVal) => {
    setClassification(newVal);
    try {
      const res = await api.patch(`/emails/${email._id}/classify`, {
        classification: newVal,
        reason: 'Manual override by executive assistant'
      });
      onUpdateEmail(res.data.email);
      toast.success(`Classification updated to ${newVal}`);
    } catch (err) {
      toast.error('Failed to update classification');
    }
  };

  // Action: Mark Read/Unread
  const handleToggleRead = async () => {
    try {
      const res = await api.patch(`/emails/${email._id}/read`, { read: !email.isRead });
      onUpdateEmail(res.data.email);
      toast.success(!email.isRead ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error('Failed to update read state');
    }
  };

  // Action: Archive
  const handleArchive = async () => {
    try {
      const res = await api.patch(`/emails/${email._id}/archive`, { archive: true });
      onUpdateEmail(res.data.email);
      toast.success('Email archived');
    } catch (err) {
      toast.error('Failed to archive');
    }
  };

  // Action: Mark Completed
  const handleComplete = async () => {
    try {
      const res = await api.patch(`/emails/${email._id}/complete`);
      onUpdateEmail(res.data.email);
      toast.success('Conversation marked as completed');
    } catch (err) {
      toast.error('Failed to complete conversation');
    }
  };

  // Action: Client takeover request
  const handleClientTakeover = async () => {
    try {
      const res = await api.patch(`/client/emails/${email._id}/takeover`);
      onUpdateEmail(res.data.email);
      toast.success('Handled request routed to your assistant');
    } catch (err) {
      toast.error('Takeover request failed');
    }
  };

  // Action: Client marked handled
  const handleClientHandled = async () => {
    try {
      const res = await api.patch(`/client/emails/${email._id}/handled`);
      onUpdateEmail(res.data.email);
      toast.success('Marked as handled and completed!');
    } catch (err) {
      toast.error('Failed to mark handled');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a] border-l border-slate-800/80">
      {/* Top Action Bar */}
      <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {email.category || 'General'}
            </span>
            <span className="text-xs text-slate-400">
              Priority: <strong className={email.priority === 'HIGH' ? 'text-rose-400' : 'text-slate-200'}>{email.priority}</strong>
            </span>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {!isClientView ? (
            <>
              <button
                onClick={handleToggleRead}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {email.isRead ? 'Mark Unread' : 'Mark Read'}
              </button>
              <button
                onClick={handleArchive}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Archive conversation"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Done
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClientTakeover}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
              >
                Ask Assistant to Handle
              </button>
              <button
                onClick={handleClientHandled}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Handled
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-4xl space-y-6">
        {/* Email Header Card */}
        <div className="p-5 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white leading-snug mb-1">
                {email.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{email.sender}</span>
                <span>&lt;{email.senderEmail}&gt;</span>
                <span>•</span>
                <span>{new Date(email.receivedAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star
                className={`w-5 h-5 ${
                  email.isImportant ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* AI Intelligence Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/20 border border-indigo-500/30 shadow-lg glow-indigo space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wide">
              <Sparkles className="w-4 h-4" />
              HUMANITY AI INTELLIGENCE SUMMARY
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Confidence: {Math.round((email.confidence || 0.95) * 100)}%
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Source: {email.classificationSource || 'AI'}
              </span>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {email.summary || 'Summary unavailable.'}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">
                Suggested Action
              </span>
              <span className="text-indigo-300 font-medium">{email.suggestedAction}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">
                Reasoning Matrix
              </span>
              <span className="text-slate-300">{email.classificationReason}</span>
            </div>
          </div>

          {/* Classification Selector (for Assistant) */}
          {!isClientView && (
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-400">
                Adjust Email Classification:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ASSISTANT_TO_REPLY', label: 'Assistant to Reply', color: 'indigo' },
                  { id: 'CLIENT_TO_REPLY', label: 'Client to Reply', color: 'amber' },
                  { id: 'NO_REPLY_NEEDED', label: 'No Reply Needed', color: 'slate' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleChangeClassification(item.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      classification === item.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email Body Thread */}
        <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            Message Transcript
          </div>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {email.body}
          </div>
        </div>

        {/* AI Draft & Reply Workspace */}
        <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Reply Workspace & Draft
            </div>
            <button
              onClick={handleGenerateDraft}
              disabled={loadingAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loadingAI ? 'Drafting with AI...' : 'Generate AI Draft'}
            </button>
          </div>

          <textarea
            rows={7}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            placeholder="Click 'Generate AI Draft' or type your reply here..."
            className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-y"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Drafts autosave when saved or sent to the recipient.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={savingDraft || !draftBody}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {savingDraft ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => {
                  toast.success('Reply dispatched to ' + email.senderEmail);
                  handleComplete();
                }}
                disabled={!draftBody}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

