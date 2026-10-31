import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_CREDENTIALS, DemoUserAccount, getAllAvailableAccounts, registerStudentAccount } from '../services/authService';
import {
  Layers,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
  UserPlus,
  LogIn
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();

  // Login form state
  const [loginId, setLoginId] = useState<string>('PCE2026ST001');
  const [password, setPassword] = useState<string>('student@pce2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginId.trim()) {
      setErrorMsg('Please enter your College ID or Registration Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your institutional password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(loginId, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.message || 'Authentication failed. Please verify credentials.');
      }
    }, 300);
  };

  const handleQuickLogin = (account: DemoUserAccount) => {
    setLoginId(account.loginId);
    setPassword(account.password);
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      login(account.loginId, account.password);
      setIsLoading(false);
    }, 200);
  };

  const studentAccounts = DEMO_CREDENTIALS.filter(a => a.role === 'student');
  const ownerAccounts = DEMO_CREDENTIALS.filter(a => a.role === 'owner');
  const adminAccounts = DEMO_CREDENTIALS.filter(a => a.role === 'admin');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Institution Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-xs px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                ShareSpace <span className="text-sky-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                DEMO AUTH
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-sky-400" />
              <span>Poornima College of Engineering, Jaipur (Sitapura Campus)</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Multi-Role Prototype Portal · IST Active</span>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Mission & Role Overview */}
          <div className="lg:col-span-5 space-y-6 text-white hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Smart Technical Resource Sharing</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                Equitable equipment access for every engineer.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with departmental robotics cells, high-performance computing clusters, 3D printers, cinema cameras, and seminar halls across Poornima College of Engineering.
              </p>
            </div>

            {/* Role Governance Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>5 Student Accounts</span>
                    <span className="text-[10px] text-sky-300 font-mono">Independent History</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Reserve equipment, track individual quota, and compete fairly under the FairShare priority algorithm.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Lab Owner (Rahul Sharma)</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Review and approve booking proposals, conduct physical handovers, and sign off on returned condition photos.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Administrator (Ankit Gupta)</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Campus-wide analytics, security governance, and audit logs. Custody separation strictly prevents admin routine handovers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header within box */}
            <div className="bg-slate-50 px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 font-mono">
                  Poornima College Portal
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                  Sign In to ShareSpace AI
                </h2>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-[11px] font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Authorized Access Only</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Alert Messages */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{successMsg}</div>
                </div>
              )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      College ID / Registration Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginId}
                        onChange={e => {
                          setLoginId(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="e.g. PCE2026ST001 / PCESTAFF001 / PCEADMIN001"
                        className="w-full text-xs font-mono pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 bg-slate-50/50 hover:bg-white text-slate-900 transition-colors uppercase placeholder:normal-case placeholder:font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">Password</label>
                      <span className="text-[11px] text-slate-400 font-mono">Demo: student@pce2026 / owner@pce2026 / admin@pce2026</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Enter password"
                        className="w-full text-xs pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 bg-slate-50/50 hover:bg-white text-slate-900 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Verifying Institutional Credentials...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Institutional Access Policy Notice */}
                <div className="p-3 bg-sky-50 border border-sky-200/80 rounded-xl text-[11px] text-sky-950 leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Institutional Security Policy:</strong> Self-registration is restricted. Production deployment accounts require college email verification (<code>@poornima.edu.in</code>) or Administrator approval. For evaluation and judging, please select from the 7 pre-authorized accounts below.
                  </div>
                </div>

              {/* DEMO ACCESS SECTION (Categorized for Hackathon Evaluation) */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      One-Click Demo Access
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    7 Pre-configured Accounts
                  </span>
                </div>

                {/* Section A: 5 Students */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                      <span>Student Accounts (5 Independent Sessions)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">FairShare Tested</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {studentAccounts.map(acc => (
                      <div
                        key={acc.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50/50 hover:border-sky-300 transition-all flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">{acc.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-sky-100 text-sky-800 font-semibold">
                              {acc.loginId}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {acc.department} · {acc.userProfile.verifiedCertifications.length} Certs
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin(acc)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>Quick Login</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Lab Owner & Administrator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Lab Owner */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Lab Owner</span>
                    </div>
                    {ownerAccounts.map(acc => (
                      <div
                        key={acc.id}
                        className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 text-xs space-y-2"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{acc.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {acc.loginId}</div>
                          <div className="text-[10px] text-indigo-700 font-medium">Custody & Approvals</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin(acc)}
                          className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-indigo-700 hover:bg-indigo-800 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <span>Owner Dashboard</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Administrator */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Administrator</span>
                    </div>
                    {adminAccounts.map(acc => (
                      <div
                        key={acc.id}
                        className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{acc.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {acc.loginId}</div>
                          <div className="text-[10px] text-amber-800 font-medium">Governance & Analytics</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin(acc)}
                          className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-amber-700 hover:bg-amber-800 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <span>Admin Dashboard</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demonstration Disclaimer notice */}
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Demonstration Notice:</strong> Prototype environment for <strong>Poornima College of Engineering, Jaipur</strong>. Data is managed in local session state with full Supabase integration compatibility.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/90 text-slate-400 text-xs px-6 py-4 text-center">
        Poornima College of Engineering, Jaipur (Sitapura, Rajasthan, India) · ShareSpace AI Demonstration Platform
      </footer>
    </div>
  );
};
