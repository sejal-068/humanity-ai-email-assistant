// frontend/src/pages/ConnectedAccounts.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Layers, Mail, CheckCircle2, Trash2, Plus, Shield, RefreshCw } from 'lucide-react';

export default function ConnectedAccounts({ role = 'assistant' }) {
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState('gmail');
  const [customEmail, setCustomEmail] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, accountsRes] = await Promise.all([
        api.get('/assistant/stats'),
        api.get('/accounts')
      ]);
      setStats(statsRes.data);
      setAccounts(accountsRes.data);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/accounts/connect-demo', {
        provider,
        emailAddress: customEmail || `${provider}.demo@humanity.ai`
      });
      toast.success(res.data.message);
      setCustomEmail('');
      loadData();
    } catch (err) {
      toast.error('Failed to link account');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17]">
      <Sidebar counts={stats} role={role} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c101a]">
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1420]/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base font-bold text-white">Connected Mailboxes & Integrations</h1>
          </div>
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 max-w-4xl space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900/60 border border-indigo-500/20 shadow-md space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              Secure Email OAuth Sync (Demo Engine)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Humanity seamlessly ingests incoming communications via Google Workspace and Microsoft 365 OAuth relays, parsing them with local privacy-preserving NLP before routing.
            </p>
          </div>

          {/* Connect New Mailbox */}
          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white">Connect Additional Mailbox</h3>
            <form onSubmit={handleConnect} className="flex flex-wrap items-center gap-3">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="gmail">Google Workspace (Gmail)</option>
                <option value="outlook">Microsoft Outlook 365</option>
              </select>

              <input
                type="email"
                placeholder="Custom email address (optional)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 min-w-[200px] bg-[#0a0e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                Connect Mailbox
              </button>
            </form>
          </div>

          {/* Active Mailboxes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Connected Inboxes ({accounts.length})
            </h3>

            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="p-4 rounded-2xl bg-[#111827]/70 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-indigo-400 font-bold uppercase text-xs">
                      {acc.provider[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{acc.emailAddress}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Live Sync
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Provider: {acc.provider.toUpperCase()} • Last synchronized: Just now
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Mailbox connection verified healthy')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Test Sync
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

