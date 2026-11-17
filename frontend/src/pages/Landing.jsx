// frontend/src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Mail, CheckCircle2, Zap, Layers, UserCheck, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 px-6 md:px-12 flex items-center justify-between bg-[#0e1420]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 text-lg">
            H
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">HUMANITY</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Platform</a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#roles" className="hover:text-indigo-400 transition-colors">Assistants & Clients</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          The Intelligence Layer for High-Output Executive Workspaces
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Your Inbox. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Organized by Intelligence.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          An AI-powered email workspace that helps personal assistants filter noise, prioritize executive decisions, and draft precision responses in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Launch Interactive Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/70 transition-all"
          >
            Create Free Account
          </Link>
        </div>

        {/* Quick Demo Credentials Pill */}
        <div className="mt-8 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Instant Login:</span>
          <span>Assistant: <strong className="text-slate-200">assistant@humanity.ai</strong> / <strong className="text-slate-200">Password123</strong></span>
          <span>•</span>
          <span>Client: <strong className="text-slate-200">client@humanity.ai</strong> / <strong className="text-slate-200">Password123</strong></span>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed for Modern Executive Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything your team needs to separate high-priority boardroom decisions from routine calendar coordination.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Intelligent Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emails are automatically sorted into Assistant to Reply, Client Attention, or No Reply Needed with transparent reasoning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Executive Summaries</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lengthy email threads and complex agreements are distilled into actionable 2-sentence briefs with suggested next steps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Synchronized Workspaces</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clients only see decisive matters requiring authorization. One-click delegation empowers assistants to take over threads.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Humanity AI Email Assistant. Built for technical internship evaluation.</p>
      </footer>
    </div>
  );
}
