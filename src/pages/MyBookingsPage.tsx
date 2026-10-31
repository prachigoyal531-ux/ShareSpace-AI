import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  ScanLine,
  ArrowRight,
  ShieldCheck,
  User,
  Scale
} from 'lucide-react';
import { formatDate, formatTimeIST } from '../utils/formatters';

export const MyBookingsPage: React.FC = () => {
  const {
    bookings,
    currentUser,
    role,
    cancelBooking,
    setCurrentPage,
    navigateToResource
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'completed' | 'waitlist'>('all');
  const [scopeFilter, setScopeFilter] = useState<'personal' | 'department'>('personal');

  // Role-based scoping:
  // Students STRICTLY see their personal bookings (Privacy RBAC rule)
  // Owner and Admin can toggle between personal and department/campus
  const effectiveBookings = role === 'student' || scopeFilter === 'personal'
    ? bookings.filter(b => b.userId === currentUser.id)
    : bookings;

  const filteredBookings = effectiveBookings.filter(b => {
    if (activeTab === 'active') return ['Approved', 'Checked In'].includes(b.status);
    if (activeTab === 'pending') return b.status === 'Pending Approval';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'waitlist') return b.status === 'Waitlisted';
    return true;
  });

  const statusBadges: Record<BookingStatus, { bg: string; text: string; border: string }> = {
    'Pending Approval': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Approved: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Checked In': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
    Completed: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    Rejected: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
    Cancelled: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
    Waitlisted: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {role === 'student' ? 'My Equipment & Lab Bookings' : 'Bookings & Custody Ledger'}
          </h1>
          <p className="text-xs text-slate-500">
            Nexora University, Jaipur · Real-time status, verification codes, and waiting list rankings
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role !== 'student' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setScopeFilter('personal')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  scopeFilter === 'personal' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                My Reservations
              </button>
              <button
                onClick={() => setScopeFilter('department')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  scopeFilter === 'department' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Campus Overview
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentPage('explore')}
            className="py-2 px-4 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>Reserve Equipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Student Privacy Notice */}
      {role === 'student' && (
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
          <span>
            <strong>Student Data Privacy:</strong> You are viewing personal bookings for <strong>{currentUser.name}</strong> ({currentUser.studentOrEmployeeId}). Private records of other students are strictly sequestered by role-based access controls.
          </span>
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-xs overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Bookings', count: effectiveBookings.length },
          { id: 'active', label: 'Active & In Hand', count: effectiveBookings.filter(b => ['Approved', 'Checked In'].includes(b.status)).length },
          { id: 'pending', label: 'Pending Approval', count: effectiveBookings.filter(b => b.status === 'Pending Approval').length },
          { id: 'waitlist', label: 'Waitlisted', count: effectiveBookings.filter(b => b.status === 'Waitlisted').length },
          { id: 'completed', label: 'Completed History', count: effectiveBookings.filter(b => b.status === 'Completed').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className="font-mono text-[11px] opacity-80">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(b => {
            const badge = statusBadges[b.status] || statusBadges['Pending Approval'];
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-800">{b.resourceCategory}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                      Unit ID: {b.resourceId}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-500">Ref: {b.id}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {b.status} {b.queuePosition ? `(Queue Position #${b.queuePosition})` : ''}
                    </div>

                    {b.fairShareRank && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        FairShare #{b.fairShareRank}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => navigateToResource(b.resourceId, 'my-bookings')}
                    className="text-base font-bold text-slate-900 hover:text-sky-700 cursor-pointer transition-colors"
                  >
                    {b.resourceName}
                  </h3>

                  {b.fairShareExplanation && (
                    <div className="text-[11px] text-sky-950 bg-sky-50 p-2 rounded-lg border border-sky-200/80 font-mono">
                      <strong>FairShare Rationale:</strong> {b.fairShareExplanation}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                    <strong>Stated Purpose:</strong> {b.purpose}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(b.startTime)}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {formatTimeIST(b.startTime)} - {formatTimeIST(b.endTime)}
                      </span>
                    </div>

                    {b.handoverVerifiedBy && (
                      <span className="text-[11px] text-slate-600 font-mono">
                        Handover verified by: <strong>{b.handoverVerifiedBy}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right PIN & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* PIN Display if Approved or Checked In */}
                  {['Approved', 'Checked In'].includes(b.status) && (
                    <div className="text-left md:text-right bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Verification PIN</div>
                      <div className="text-sm font-mono font-bold text-sky-800 tracking-wider">
                        {b.checkInVerificationCode}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {b.status === 'Approved' && (
                      <button
                        onClick={() => setCurrentPage('checkin-checkout')}
                        className="py-1.5 px-3.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    )}

                    {b.status === 'Checked In' && (
                      <button
                        onClick={() => setCurrentPage('checkin-checkout')}
                        className="py-1.5 px-3.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Return Equipment</span>
                      </button>
                    )}

                    {['Pending Approval', 'Approved', 'Waitlisted'].includes(b.status) && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="py-1.5 px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => navigateToResource(b.resourceId, 'my-bookings')}
                      className="py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      View Unit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No bookings in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any bookings matching the selected filter.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Browse Available Equipment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
