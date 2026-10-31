import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers, RotateCcw, LogOut, ShieldCheck, ChevronDown, UserCircle2 } from 'lucide-react';
import { DEMO_CREDENTIALS, getAllAvailableAccounts } from '../../services/authService';

export const Header: React.FC = () => {
  const { role, currentUser, setIsAiModalOpen, resetDemoData, logout, switchDemoRole, switchUserAccount, setCurrentPage } = useApp();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case 'student':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'owner':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'admin':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'owner':
        return 'Lab Owner';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <header className="h-16 px-6 border-b border-slate-200/90 bg-white flex items-center justify-between gap-8 sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark (Single text element with domain icon & institution badge) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            if (role === 'student') setCurrentPage('dashboard');
            else if (role === 'owner') setCurrentPage('owner-dashboard');
            else setCurrentPage('admin-dashboard');
          }}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-900 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-sky-800 transition-colors">
            <Layers className="w-5 h-5 text-sky-300" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                ShareSpace <span className="text-sky-700">AI</span>
              </span>
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                Demo Data
              </span>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-500 font-medium truncate max-w-[280px]">
              Nexora University, Jaipur
            </div>
          </div>
        </button>
      </div>

      {/* Zone 2: Single-line Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 whitespace-nowrap shrink-0">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-1.5 text-sky-800 hover:text-sky-950 font-bold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>AI Resource Matcher</span>
        </button>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <span className="text-slate-500 font-normal">Jaipur, Rajasthan (IST)</span>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <span className="text-slate-500 font-normal">Fair Usage Quota Active</span>
      </nav>

      {/* Zone 3: Authenticated User Badge & Logout */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Reset Demo Data quick utility */}
        <button
          onClick={resetDemoData}
          title="Reset to initial college demonstration data"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Reset Demo</span>
        </button>

        {/* Authenticated Identity Pill with Role & Dropdown for Demo Switching */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-900 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0 shadow-2xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] flex items-center gap-1">
                <span>{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className={`px-1.5 py-0.2 rounded-sm font-semibold border ${getRoleBadge()}`}>
                  {getRoleLabel()}
                </span>
                <span className="font-mono text-slate-500 text-[9px]">{currentUser.studentOrEmployeeId}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Account & Demo Switcher Dropdown */}
          {accountMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
              onClick={() => setAccountMenuOpen(false)}
            >
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Authenticated Session</div>
                <div className="font-bold text-slate-900 mt-0.5">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge()}`}>
                    {getRoleLabel()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{currentUser.studentOrEmployeeId}</span>
                </div>
              </div>

              <div className="p-2 border-b border-slate-100 max-h-72 overflow-y-auto">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Switch Account ({getAllAvailableAccounts().length})</span>
                  <span className="font-mono text-[9px] text-sky-700">1-Click</span>
                </div>
                <div className="space-y-1">
                  {getAllAvailableAccounts().map(account => {
                    const isCurrent = account.loginId.toUpperCase() === currentUser.studentOrEmployeeId.toUpperCase();
                    return (
                      <button
                        key={account.id}
                        onClick={e => {
                          e.stopPropagation();
                          switchUserAccount(account.loginId);
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                            <span>{account.name}</span>
                            {isCurrent && <span className="text-[9px] text-sky-700 uppercase font-bold">(Active)</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{account.loginId} · {account.department.split('&')[0]}</div>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold shrink-0 ${account.badgeColor}`}>
                          {account.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setAccountMenuOpen(false);
                    setCurrentPage('profile');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors"
                >
                  <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Account Profile & Rules</span>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setAccountMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-700 hover:bg-rose-50 rounded-lg text-left transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout from Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Visible Logout Button */}
        <button
          onClick={logout}
          title="Sign out of current account"
          className="p-2 sm:px-3 sm:py-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
