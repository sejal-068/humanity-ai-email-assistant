// frontend/src/components/EmailList.jsx
import React from 'react';
import { Star, Clock, AlertCircle, Sparkles, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function EmailList({
  emails = [],
  selectedEmail = null,
  onSelectEmail = () => {},
  onToggleStar = () => {},
  loading = false,
  emptyTitle = "No emails found in this category",
  emptySubtitle = "All caught up or nothing matched your filter criteria."
}) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">{emptyTitle}</h3>
        <p className="text-xs text-slate-400 max-w-sm">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/60 overflow-y-auto">
      {emails.map((email) => {
        const isSelected = selectedEmail && selectedEmail._id === email._id;
        const timeAgo = email.receivedAt
          ? formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })
          : 'recently';

        const classificationConfig = {
          ASSISTANT_TO_REPLY: {
            label: 'Assistant to Reply',
            bg: 'bg-indigo-500/10',
            text: 'text-indigo-400',
            border: 'border-indigo-500/20'
          },
          CLIENT_TO_REPLY: {
            label: 'Client to Reply',
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20'
          },
          NO_REPLY_NEEDED: {
            label: 'No Reply Needed',
            bg: 'bg-slate-700/30',
            text: 'text-slate-400',
            border: 'border-slate-700/50'
          },
          NEEDS_REVIEW: {
            label: 'Needs Review',
            bg: 'bg-rose-500/10',
            text: 'text-rose-400',
            border: 'border-rose-500/20'
          }
        };

        const badge = classificationConfig[email.classification] || classificationConfig.NEEDS_REVIEW;

        return (
          <div
            key={email._id}
            onClick={() => onSelectEmail(email)}
            className={`group p-4 cursor-pointer transition-all duration-150 flex items-start gap-3.5 relative ${
              isSelected
                ? 'bg-indigo-600/10 border-l-4 border-l-indigo-500'
                : email.isRead
                ? 'bg-[#0b0f17]/40 hover:bg-slate-900/40'
                : 'bg-[#111827]/70 hover:bg-[#151f33]'
            }`}
          >
            {/* Star button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(email);
              }}
              className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors"
              title={email.isImportant ? 'Unstar email' : 'Star email'}
            >
              <Star
                className={`w-4 h-4 ${
                  email.isImportant ? 'text-amber-400 fill-amber-400' : 'text-slate-600 group-hover:text-slate-400'
                }`}
              />
            </button>

            {/* Main content snippet */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs truncate ${
                      !email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'
                    }`}
                  >
                    {email.sender}
                  </span>
                  {!email.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0 font-medium">
                  {timeAgo}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-200 mb-1.5 truncate">
                {email.subject}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                {email.summary || email.preview || email.body}
              </p>

              {/* Tags & Metadata footer */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {badge.label}
                </span>

                {email.category && (
                  <span className="px-2 py-0.5 rounded-md font-medium bg-slate-800 text-slate-300 border border-slate-700/50">
                    {email.category}
                  </span>
                )}

                {email.priority === 'HIGH' && (
                  <span className="px-2 py-0.5 rounded-md font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    High Priority
                  </span>
                )}

                {email.waitingForResponse && (
                  <span className="flex items-center gap-1 text-sky-400 font-medium">
                    <Clock className="w-3 h-3" /> Waiting
                  </span>
                )}
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 text-slate-600 mt-2 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'group-hover:text-slate-400'}`} />
          </div>
        );
      })}
    </div>
  );
}

