// frontend/src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (role) => {
    setErrorMsg(null);
    if (role === 'assistant') {
      setEmail('assistant@example.com');
      setPassword('Pass123!');
    } else if (role === 'client') {
      setEmail('client@example.com');
      setPassword('Pass123!');
    } else if (role === 'sejal') {
      setEmail('sejalshambharkar068@gmail.com');
      setPassword('Pass123!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a11] px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              H
            </div>
            <span className="font-extrabold text-xl tracking-wider text-white">
              HUMANITY
              <span className="text-indigo-400 font-semibold text-xs ml-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                AI
              </span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign in to your account</h1>
          <p className="text-xs text-slate-400">Welcome back! Please enter your credentials or use quick demo fill.</p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/25 border border-indigo-500/25 space-y-2 text-center backdrop-blur-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Autocomplete
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('assistant')}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 transition-all text-center"
            >
              Assistant (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('client')}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 border border-purple-500/30 transition-all text-center"
            >
              Client (Dr. Evelyn)
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleQuickLogin('sejal')}
            className="w-full py-1 rounded-xl text-[11px] font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60 transition-all text-center"
          >
            Sejal (sejalshambharkar068@gmail.com)
          </button>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#0f1422]/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/60 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="you@domain.com"
                className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="••••••••"
                className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-indigo-400 font-semibold hover:underline underline-offset-2 ml-1">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
