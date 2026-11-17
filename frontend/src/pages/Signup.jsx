// frontend/src/pages/Signup.jsx
import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Briefcase,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('assistant');
  const [linkedEmail, setLinkedEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // UI interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);

  // Password rules validation
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    };
  }, [password]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-800' };
    let score = 0;
    if (passwordChecks.length) score += 1;
    if (passwordChecks.hasNumber) score += 1;
    if (passwordChecks.hasLetter) score += 1;
    if (passwordChecks.hasSpecial) score += 1;
    if (password.length >= 12) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  }, [password, passwordChecks]);

  // Check passwords match
  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Validation before submission
  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      passwordChecks.length &&
      passwordChecks.hasNumber &&
      confirmPassword.length > 0 &&
      password === confirmPassword &&
      agreedToTerms &&
      !submitting
    );
  }, [name, email, passwordChecks, confirmPassword, password, agreedToTerms, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setIsDuplicateEmail(false);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setApiError('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setApiError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!passwordChecks.length || !passwordChecks.hasNumber) {
      setApiError('Password must be at least 8 characters and include at least one number.');
      return;
    }

    if (!agreedToTerms) {
      setApiError('Please accept the Terms of Service to continue.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(name.trim(), cleanEmail, password, role, linkedEmail ? linkedEmail.trim().toLowerCase() : undefined);
    } catch (err) {
      console.error('Signup error response:', err);
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409 || data?.alreadyExists) {
        setIsDuplicateEmail(true);
        setApiError('This email is already registered. Please sign in.');
      } else {
        setApiError(data?.message || 'Registration failed. Please check your inputs and try again.');
        toast.error(data?.message || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand Logo & Header */}
      <div className="w-full max-w-xl mx-auto text-center space-y-3 mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            H
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white">
            HUMANITY
            <span className="text-indigo-400 font-semibold text-xs ml-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              AI
            </span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create your Humanity Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          The collaborative intelligence layer empowering executive assistants and high-output leaders.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-xl mx-auto relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1422]/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/60">
          {/* Duplicate email alert banner */}
          {isDuplicateEmail && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-200">
                  This email is already registered. Please sign in.
                </p>
                <p className="text-slate-400">
                  You already have a Humanity account. Click below to proceed to login with your password.
                </p>
                <div className="pt-1.5">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2"
                  >
                    Go to Sign In &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* General API error banner */}
          {apiError && !isDuplicateEmail && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Full Name <span className="text-indigo-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Work Email Address <span className="text-indigo-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isDuplicateEmail) setIsDuplicateEmail(false);
                    if (apiError) setApiError(null);
                  }}
                  placeholder="alex@company.com"
                  className={`w-full bg-[#090d16] border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    isDuplicateEmail
                      ? 'border-amber-500 focus:border-amber-400 focus:ring-amber-500/40'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/50'
                  }`}
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Password <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars & number"
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

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Confirm Password <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full bg-[#090d16] border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength & validation checklist */}
            {password.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#090d16]/70 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Password Strength:</span>
                  <span className={`font-bold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                {/* 3-stage progress bar */}
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-800'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-800'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-800'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.length ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span className={passwordChecks.length ? 'text-slate-300' : 'text-slate-500'}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordChecks.hasNumber ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span className={passwordChecks.hasNumber ? 'text-slate-300' : 'text-slate-500'}>
                      At least 1 number
                    </span>
                  </div>
                </div>

                {confirmPassword.length > 0 && (
                  <div className="pt-1 border-t border-slate-800/80 text-[11px]">
                    {passwordsMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Workspace Role Selection Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Select Your Workspace Role <span className="text-indigo-400">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {/* Assistant Card */}
                <div
                  onClick={() => setRole('assistant')}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative flex flex-col justify-between ${
                    role === 'assistant'
                      ? 'bg-gradient-to-br from-indigo-950/50 via-slate-900 to-indigo-900/20 border-indigo-500 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/50'
                      : 'bg-[#090d16] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          role === 'assistant'
                            ? 'border-indigo-500 bg-indigo-600 text-white'
                            : 'border-slate-700'
                        }`}
                      >
                        {role === 'assistant' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        Executive Assistant
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Manage client emails, organize conversations and handle administrative communication.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Client Card */}
                <div
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative flex flex-col justify-between ${
                    role === 'client'
                      ? 'bg-gradient-to-br from-purple-950/50 via-slate-900 to-purple-900/20 border-purple-500 shadow-lg shadow-purple-600/10 ring-1 ring-purple-500/50'
                      : 'bg-[#090d16] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          role === 'client'
                            ? 'border-purple-500 bg-purple-600 text-white'
                            : 'border-slate-700'
                        }`}
                      >
                        {role === 'client' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        Executive / Client
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        View important conversations and respond to emails requiring personal attention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Counterpart Link */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Link with Counterpart <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  value={linkedEmail}
                  onChange={(e) => setLinkedEmail(e.target.value)}
                  placeholder={
                    role === 'assistant'
                      ? 'client@company.com'
                      : 'assistant@company.com'
                  }
                  className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Synchronizes your workspace permissions directly with your executive or assistant.
              </p>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-[#090d16] border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                I accept Humanity's <span className="text-slate-200 underline">Terms of Service</span> and{' '}
                <span className="text-slate-200 underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Humanity Workspace...</span>
                </>
              ) : (
                <>
                  <span>Create {role === 'assistant' ? 'Executive Assistant' : 'Client'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
