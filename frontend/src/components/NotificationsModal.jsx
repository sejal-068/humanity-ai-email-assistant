// frontend/src/components/NotificationsModal.jsx
import React from 'react';
import { Bell, Check, X, Sparkles, Clock, AlertCircle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsModal({
  notifications = [],
  onClose = () => {},
  onMarkRead = () => {}
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0f1422] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">System Notifications</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.isRead
                    ? 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                    : 'bg-indigo-950/20 border-indigo-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    {n.title || 'Notification'}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                {!n.isRead && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => onMarkRead(n._id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

