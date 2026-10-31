import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Sliders, BarChart3, Lock } from 'lucide-react';

interface Props {
  attemptedPage: AppPage;
}

export const AccessDeniedView: React.FC<Props> = ({ attemptedPage }) => {
  const { role, currentUser, setCurrentPage } = useApp();

  const getRoleDashboardPage = (): AppPage => {
    switch (role) {
      case 'student':
        return 'dashboard';
      case 'owner':
        return 'owner-dashboard';
      case 'admin':
        return 'admin-dashboard';
      default:
        return 'dashboard';
    }
  };

  const dashboardLabel = role === 'student'
    ? 'Student Dashboard'
    : role === 'owner'
    ? 'Lab Owner Dashboard'
    : 'Admin Dashboard';

  const getDashboardIcon = () => {
    switch (role) {
      case 'student':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'owner':
        return <Sliders className="w-4 h-4" />;
      case 'admin':
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-12 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Access Restricted
          </span>
          <h2 className="text-xl font-bold text-slate-900">Insufficient Privileges</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The page <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">/{attemptedPage}</span> requires higher administrative or departmental permissions than your current role grants.
          </p>
        </div>

        {/* Authenticated user context */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Authenticated User:</span>
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Role / ID:</span>
            <span className="font-mono font-bold text-slate-800 uppercase">
              {role} ({currentUser.studentOrEmployeeId})
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Department:</span>
            <span className="text-slate-700 truncate max-w-[200px]">{currentUser.department}</span>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <button
            onClick={() => setCurrentPage(getRoleDashboardPage())}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {getDashboardIcon()}
            <span>Return to {dashboardLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
