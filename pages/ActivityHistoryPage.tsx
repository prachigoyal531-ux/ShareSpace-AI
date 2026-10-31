import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Filter,
  CalendarCheck,
  ScanLine,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Settings
} from 'lucide-react';
import { formatDate, formatTimeIST } from '../utils/formatters';

export const ActivityHistoryPage: React.FC = () => {
  const { activityLogs, role, currentUser, bookings, resources, setCurrentPage } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Access Denied guard: Students are restricted from viewing institutional activity audit logs
  if (role === 'student') {
    return (
      <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-xs my-12">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Access Denied: Activity History Restricted</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Activity History contains campus-wide operational and institutional audit trails reserved exclusively for Lab In-Charges and Campus Administrators.
        </p>
        <p className="text-xs text-slate-500">
          To review your personal booking status, active check-in codes, and past equipment reservations, please visit <strong className="text-sky-700">My Bookings</strong>.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentPage('my-bookings')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // Enforce strict role-based privacy visibility (Requirement 4)
  const roleFilteredLogs = activityLogs.filter(log => {
    if (role === 'admin') return true;

    if (role === 'owner') {
      const isActor = log.actorId === currentUser.id || log.actorName === currentUser.name;
      const mentionsUser = log.details.toLowerCase().includes(currentUser.name.toLowerCase());
      const isManagedResource = log.resourceId
        ? resources.some(
            r =>
              r.id === log.resourceId &&
              (r.ownerName === currentUser.name ||
                r.ownerEmail === currentUser.email ||
                r.department === currentUser.department ||
                r.department.includes('Mechanical') ||
                r.department.includes('Robotics'))
          )
        : false;
      return isActor || mentionsUser || isManagedResource;
    }

    return false;
  });

  const filteredLogs = roleFilteredLogs.filter(log => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const text = `${log.actorName} ${log.action} ${log.target} ${log.details} ${log.category}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking':
        return <CalendarCheck className="w-3.5 h-3.5 text-sky-600" />;
      case 'checkin':
        return <ScanLine className="w-3.5 h-3.5 text-emerald-600" />;
      case 'approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'condition':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
      case 'resource':
        return <Layers className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Settings className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Activity & Custody Audit</h1>
          <p className="text-xs text-slate-500">
            {role === 'owner'
              ? `Departmental Audit Trail: Scoped to assets managed by ${currentUser.name} and your authorized staff actions.`
              : 'Master Campus Audit Log: Complete platform custody, maintenance, and override history across PCE Jaipur.'}
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border self-start sm:self-auto bg-slate-50 text-slate-700 border-slate-200">
          Privacy Scope: <strong className="text-slate-900 capitalize">{role} View</strong> ({filteredLogs.length} events)
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by actor name, equipment, or action..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'booking', label: 'Bookings' },
            { id: 'checkin', label: 'Check-in / Returns' },
            { id: 'approval', label: 'Approvals' },
            { id: 'condition', label: 'Incidents' },
            { id: 'resource', label: 'Inventory' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-50/60 transition-colors flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(log.category)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-semibold">{log.actorName}</strong>
                    <span className="text-[11px] text-slate-400 capitalize">({log.actorRole})</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-sky-800">{log.action}</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(log.timestamp)} · {formatTimeIST(log.timestamp)}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-800">{log.target}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{log.details}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No audit logs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
