// frontend/src/pages/Settings.jsx
import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, User, Sliders, Shield, Bell, Check } from 'lucide-react';

export default function Settings({ role = 'assistant' }) {
  const { user } = useContext(AuthContext);
  const [assistantName, setAssistantName] = useState(user?.name || '');
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [tone, setTone] = useState('executive');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      <Sidebar counts={{}} role={role} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a]">
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base font-bold text-white">System Settings & AI Preferences</h1>
          </div>
        </div>

        <div className="p-8 max-w-3xl space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Section */}
            <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Account Profile
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'user@humanity.ai'}
                    className="w-full bg-[#0a0e17]/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* AI Customization */}
            <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                AI Draft & Reply Configuration
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Default AI Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="executive">Executive & Direct (Linear / Superhuman style)</option>
                    <option value="warm">Warm & Professional (Founders / Partners)</option>
                    <option value="formal">Strict Legal & Corporate</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Automatic AI Summarization</div>
                    <div className="text-[11px] text-slate-500">Generate executive summaries as soon as emails land</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSummarize}
                    onChange={(e) => setAutoSummarize(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-[#0a0e17] border-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">High-Priority Desktop Alerts</div>
                    <div className="text-[11px] text-slate-500">Surface browser alerts for executive signatures and wire transfers</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={urgentAlerts}
                    onChange={(e) => setUrgentAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-[#0a0e17] border-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

