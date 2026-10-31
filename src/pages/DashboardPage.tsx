import React from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCard } from '../components/resources/ResourceCard';
import {
  Sparkles,
  Compass,
  ScanLine,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatTimeIST } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    role,
    currentUser,
    resources,
    bookings,
    activityLogs,
    setCurrentPage,
    setIsAiModalOpen,
    navigateToResource
  } = useApp();

  // Statistics
  const availableResources = resources.filter(r => r.status === 'Available');
  const activeCheckouts = bookings.filter(b => b.status === 'Checked In');
  const pendingRequests = bookings.filter(b => b.status === 'Pending Approval');
  const userUpcomingBookings = bookings.filter(
    b => b.userId === currentUser.id && ['Approved', 'Checked In'].includes(b.status)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Demonstration Environment Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demonstration Environment:</strong> Fictional demonstration system with sample data for <strong>Nexora University, Jaipur</strong> (Rajasthan, India). This is an illustrative academic prototype and does not represent an officially deployed college platform.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded shrink-0">
          Demo Data Only
        </span>
      </div>

      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
            <span>NEXORA UNIVERSITY, JAIPUR</span>
            <span aria-hidden="true">·</span>
            <span>CENTRAL RESOURCE POOL</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-balance">
            Welcome back, {currentUser.name}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Connecting students, faculty and researchers with shared technical laboratories, computational workstations,
            cinema kits, laser projectors, and 3D printing equipment across Nexora Main Campus.
          </p>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Resource Matcher</span>
            </button>

            <button
              onClick={() => setCurrentPage('explore')}
              className="py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Resources</span>
            </button>

            <button
              onClick={() => setCurrentPage('checkin-checkout')}
              className="py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <ScanLine className="w-4 h-4" />
              <span>Equipment Check-in</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Available Resources</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {availableResources.length}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {resources.length} total</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for immediate circulation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Active Checkouts</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{activeCheckouts.length}</div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Currently in physical use</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Pending Requests</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{pendingRequests.length}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-2 flex items-center gap-1">
            <span>Awaiting owner authorization</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Fair Usage Status</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {currentUser.activeBookingCount}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {currentUser.maxActiveBookings} quota</span>
          </div>
          <div className="text-[11px] text-sky-700 font-medium mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reputation Score: {currentUser.reputationScore}%</span>
          </div>
        </div>
      </div>

      {/* Currently In-Hand / Upcoming Reservations (if user has active bookings) */}
      {userUpcomingBookings.length > 0 && (
        <div className="bg-sky-50/60 border border-sky-200/70 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-800" />
              <h2 className="text-sm font-bold text-slate-900">Your Active & Upcoming Reservations</h2>
            </div>
            <button
              onClick={() => setCurrentPage('my-bookings')}
              className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1"
            >
              <span>Manage in My Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userUpcomingBookings.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-xl p-4 border border-sky-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>{b.resourceCategory}</span>
                    <span className="font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                      PIN: {b.checkInVerificationCode}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{b.resourceName}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{b.purpose}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    {formatDate(b.startTime)} · {formatTimeIST(b.startTime)}
                  </span>
                  <button
                    onClick={() => setCurrentPage('checkin-checkout')}
                    className="py-1 px-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg text-xs"
                  >
                    {b.status === 'Checked In' ? 'Return Resource' : 'Check In Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Underused Resources */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended College Resources</h2>
            <p className="text-xs text-slate-500">Available equipment and spaces ready for student reservation at Nexora University</p>
          </div>
          <button
            onClick={() => setCurrentPage('explore')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>View All ({resources.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.slice(0, 6).map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* Live Campus Activity Audit Strip */}
      <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Campus Custody & Booking Activity</h3>
          </div>
          {role === 'student' ? (
            <button
              onClick={() => setCurrentPage('my-bookings')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
            >
              View My Bookings →
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage('activity-history')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              View Full Audit Log →
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {activityLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">{log.actorName}</span>
                <span className="text-slate-500">{log.action}</span>
                <span className="font-medium text-slate-800">"{log.target}"</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] shrink-0">
                {formatTimeIST(log.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
