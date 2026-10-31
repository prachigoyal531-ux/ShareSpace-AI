import React from 'react';
import { useApp } from '../context/AppContext';
import { ResourceIllustration } from '../components/resources/ResourceIllustration';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Wrench,
  Sparkles
} from 'lucide-react';
import { formatDate, formatTimeIST } from '../utils/formatters';

export const ResourceDetailsPage: React.FC = () => {
  const {
    selectedResourceId,
    resources,
    bookings,
    currentUser,
    role,
    setCurrentPage,
    setBookingModalResource,
    resourceReturnPage
  } = useApp();

  const resource = resources.find(r => r.id === selectedResourceId) || resources[0];

  if (!resource) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Resource not found.</p>
        <button
          onClick={() => setCurrentPage(resourceReturnPage || 'explore')}
          className="mt-3 text-xs text-sky-700 font-semibold cursor-pointer"
        >
          Return
        </button>
      </div>
    );
  }

  // Current timestamp for schedule boundary
  const now = new Date();

  // Section A: Upcoming & Scheduled Reservations (strictly approved bookings scheduled for future dates)
  const upcomingApprovedBookings = bookings.filter(
    b => b.resourceId === resource.id && b.status === 'Approved' && new Date(b.endTime).getTime() >= now.getTime()
  );

  // Section B: Past Reservations (completed reservations on this unit)
  const pastReservations = bookings.filter(
    b => b.resourceId === resource.id && b.status === 'Completed'
  );

  // Student Eligibility check
  const missingPrereqs = role === 'student'
    ? resource.eligibilityRequirements.filter(
        req => !currentUser.verifiedCertifications.some(cert => req.toLowerCase().includes(cert.toLowerCase()) || cert.toLowerCase().includes(req.toLowerCase()))
      )
    : [];

  const isEligible = missingPrereqs.length === 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Button with contextual destination */}
      <button
        onClick={() => setCurrentPage(resourceReturnPage || 'explore')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {resourceReturnPage === 'my-bookings'
            ? 'Back to My Bookings'
            : resourceReturnPage === 'owner-dashboard'
            ? 'Back to Owner Dashboard'
            : resourceReturnPage === 'admin-dashboard'
            ? 'Back to Admin Dashboard'
            : resourceReturnPage === 'dashboard'
            ? 'Back to Dashboard'
            : 'Back to Explore Resources'}
        </span>
      </button>

      {/* Main Details Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Visual Banner */}
        <ResourceIllustration category={resource.category} name={resource.name} className="h-56 w-full" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Header Title & Status */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                <span className="text-slate-900 font-bold">{resource.category}</span>
                <span aria-hidden="true">·</span>
                <span>{resource.department}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">ID: {resource.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {resource.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                  resource.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : resource.status === 'In Use'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : resource.status === 'Reserved'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {resource.status}
              </span>

              {resource.status === 'Available' ? (
                <button
                  onClick={() => setBookingModalResource(resource)}
                  className="py-2 px-5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
                >
                  Book Slot
                </button>
              ) : (
                <button
                  onClick={() => setBookingModalResource(resource)}
                  className="py-2 px-4 text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                >
                  Join Waiting List
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            {resource.description}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Physical Location</span>
              </div>
              <div className="font-semibold text-slate-900">{resource.location}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Max Reservation</span>
              </div>
              <div className="font-semibold text-slate-900 tabular-nums">
                {resource.maxBookingDurationHours} hours ({resource.fairUseWeeklyLimitHours}h / week)
              </div>
            </div>

            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Responsible Owner</span>
              </div>
              <div className="font-semibold text-slate-900">{resource.ownerName}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-slate-500" />
                <span>Condition Rating</span>
              </div>
              <div className="font-semibold text-slate-900 tabular-nums">
                {resource.conditionScore}/100 (Inspected)
              </div>
            </div>
          </div>

          {/* Specifications & Rules Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Technical Specifications */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-sky-700" />
                <span>Hardware Specifications & Features</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {resource.specifications.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Rules & Safety Guidelines */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Mandatory Usage Rules & Care</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {resource.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Student Eligibility Requirements Audit */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <h3 className="text-sm font-bold text-slate-900">Eligibility & Safety Clearance</h3>
              </div>
              {role === 'student' && (
                <div className={`text-xs font-semibold flex items-center gap-1 ${isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{isEligible ? 'You Meet All Requirements' : 'Missing Prerequisite'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {resource.eligibilityRequirements.map((req, i) => {
                const hasCert = currentUser.verifiedCertifications.some(
                  c => req.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(req.toLowerCase())
                );
                return (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{req}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-500">
                      {role === 'student' ? (hasCert ? 'Verified on profile' : 'Required verification') : 'Institutional rule'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION A: Upcoming & Scheduled Reservations */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-700" />
                <span>Upcoming & Scheduled Reservations</span>
              </h3>
              <span className="text-xs text-sky-800 font-mono font-medium">
                {upcomingApprovedBookings.length} approved upcoming slot(s)
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Only approved bookings scheduled for future dates appear here. Pending requests and waitlists are managed under FairShare allocation.
            </p>

            {upcomingApprovedBookings.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {upcomingApprovedBookings.map(b => (
                  <div key={b.id} className="p-3 bg-white flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{b.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({b.userDepartment})</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Approved
                        </span>
                      </div>
                      <div className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">{b.purpose}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-slate-800 font-semibold text-xs">
                        {formatDate(b.startTime)}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {formatTimeIST(b.startTime)} – {formatTimeIST(b.endTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-slate-50/50">
                No approved upcoming reservations scheduled for future dates. This unit is open for reservation.
              </div>
            )}
          </div>

          {/* SECTION B: Past Reservations (Separately maintained with unit details) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-slate-600" />
                <span>Past Reservations & Usage History</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {pastReservations.length} completed session(s)
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Completed reservations on this physical unit. These records drive the FairShare unit-specific priority counters.
            </p>

            {pastReservations.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {pastReservations.map(b => (
                  <div key={b.id} className="p-3 bg-slate-50/60 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>{b.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Asset ID: {b.resourceId}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">
                        {b.purpose} {b.returnConfirmedBy ? `· Returned & Inspected by ${b.returnConfirmedBy}` : ''}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-slate-700 font-medium text-xs">
                        {formatDate(b.startTime)}
                      </div>
                      <div className="text-emerald-700 font-mono text-[10px] font-semibold">
                        Custody Returned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No past reservations recorded yet for this unit.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
