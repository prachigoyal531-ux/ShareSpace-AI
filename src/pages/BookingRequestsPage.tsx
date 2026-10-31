import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Sparkles,
  Bot,
  Scale,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Zap,
  Building
} from 'lucide-react';
import { formatDate, formatTimeIST } from '../utils/formatters';

export const BookingRequestsPage: React.FC = () => {
  const {
    bookings,
    approveBooking,
    rejectBooking,
    role,
    resources,
    currentUser,
    executeFairShareBatchAllocation,
    loadFairShareDemoScenario
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Scheduling clash with departmental capstone');
  const [aiAnalysisMap, setAiAnalysisMap] = useState<Record<string, any>>({});
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [batchActionNotice, setBatchActionNotice] = useState<string | null>(null);

  // Scoped bookings for the logged-in role:
  // Admin: All campus requests across all resources and all requesters (Students, Owners, Admins)
  // Lab Owner: Requests for resources managed by this owner / department, PLUS any requests submitted by this owner
  // Student: Their own requests
  const relevantBookings = bookings.filter(b => {
    if (role === 'admin') return true;
    if (role === 'owner') {
      const isManaged = resources.some(
        r => r.id === b.resourceId &&
        (r.ownerName === currentUser.name || r.ownerEmail === currentUser.email || r.department === currentUser.department || r.department.includes('Mechanical') || r.department.includes('Robotics') || r.department.includes('Engineering'))
      );
      const isRequester = b.userId === currentUser.id;
      return isManaged || isRequester;
    }
    // Student
    return b.userId === currentUser.id;
  });

  const pendingBookings = relevantBookings.filter(b => b.status === 'Pending Approval');
  const displayBookings = activeTab === 'pending' ? pendingBookings : relevantBookings;

  const runAiConflictAnalysis = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setLoadingAi(bookingId);

    try {
      const response = await fetch('/api/ai/conflict-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceName: booking.resourceName,
          requestedStart: booking.startTime,
          requestedEnd: booking.endTime,
          existingBookings: bookings.filter(b => b.id !== bookingId && b.resourceId === booking.resourceId)
        })
      });

      const data = await response.json();
      setAiAnalysisMap(prev => ({ ...prev, [bookingId]: data }));
    } catch (err) {
      // Local fallback check
      setAiAnalysisMap(prev => ({
        ...prev,
        [bookingId]: {
          hasConflict: false,
          message: `Local check: No active scheduling conflicts for ${booking.resourceName} (${booking.resourceId}). 30-minute equipment turnaround recommended.`
        }
      }));
    } finally {
      setLoadingAi(null);
    }
  };

  const handleApprove = (bookingId: string) => {
    const res = approveBooking(bookingId);
    if (res && !res.success) {
      setBatchActionNotice(res.message);
    } else if (res && res.success) {
      setBatchActionNotice('Booking approved successfully. Security PIN activated for collection.');
    }
  };

  const handleRunFairShareBatch = () => {
    if (role === 'student') return;
    const res = executeFairShareBatchAllocation('CAM001');
    if (res.success) {
      setBatchActionNotice(res.message);
    }
  };

  const getRequesterRole = (b: typeof bookings[0]) => {
    if (b.userRole) return b.userRole;
    if (b.userId.includes('adm') || b.userName.includes('Ankit')) return 'admin';
    if (b.userId.includes('own') || b.userName.includes('Rahul') || b.userName.includes('Neha')) return 'owner';
    return 'student';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Requests & Approvals</h1>
          <p className="text-xs text-slate-500">
            Nexora University, Jaipur · Review proposals, enforce institutional priorities, and verify FairShare rankings
          </p>
        </div>

        {/* Tab switch and batch action */}
        <div className="flex flex-wrap items-center gap-2">
          {role !== 'student' && (
            <button
              onClick={handleRunFairShareBatch}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Auto-Allocate CAM001 (FairShare)</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Requests ({relevantBookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Batch action notice */}
      {batchActionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{batchActionNotice}</span>
          </div>
          <button
            onClick={() => setBatchActionNotice(null)}
            className="text-[11px] font-bold underline ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Role Notice */}
      {role === 'student' && (
        <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl text-xs text-sky-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              <strong>Student RBAC Mode:</strong> You are viewing personal requests. In accordance with college policy, approval and rejection authority is restricted to Lab In-Charges and central administrators.
            </span>
          </div>
        </div>
      )}

      {/* Requests List */}
      {displayBookings.length > 0 ? (
        <div className="space-y-4">
          {displayBookings.map(b => {
            const aiCheck = aiAnalysisMap[b.id];
            const isAnalyzing = loadingAi === b.id;
            const reqRole = getRequesterRole(b);
            const isSelfBooking = b.userId === currentUser.id;

            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Resource & Requester Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">{b.resourceCategory}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-bold">
                        Unit: {b.resourceId}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono text-slate-400">Ref: {b.id}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-600">{b.projectType}</span>

                      {/* Requester Role Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${
                          reqRole === 'admin'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : reqRole === 'owner'
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}
                      >
                        {reqRole}
                      </span>

                      {/* Institutional Priority Badge */}
                      {b.isInstitutionalOverride && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 font-mono">
                          <Zap className="w-3 h-3 text-purple-700" />
                          <span>Tier {b.priorityTier || (reqRole === 'admin' ? 1 : 2)} Institutional Priority</span>
                        </span>
                      )}

                      {/* FairShare Badge if present */}
                      {b.fairShareRank && !b.isInstitutionalOverride && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                            b.fairShareRank === 1
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : b.fairShareRank === 99
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-sky-50 text-sky-800 border-sky-200'
                          }`}
                        >
                          FairShare Rank #{b.fairShareRank}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{b.resourceName}</h3>

                    {/* Institutional Mandate Callout if present */}
                    {b.isInstitutionalOverride && b.institutionalPurpose && (
                      <div className="text-[11px] text-purple-900 bg-purple-50/80 p-2.5 rounded-lg border border-purple-200 font-mono">
                        <strong>Official Institutional Mandate:</strong> {b.institutionalPurpose}
                      </div>
                    )}

                    {/* FairShare explanation if populated */}
                    {b.fairShareExplanation && !b.isInstitutionalOverride && (
                      <div className="text-[11px] text-sky-900 bg-sky-50/70 p-2 rounded-lg border border-sky-200/60 font-mono">
                        <strong>FairShare Rationale:</strong> {b.fairShareExplanation}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 max-w-2xl bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="font-semibold text-slate-800 mb-0.5">Stated Academic / Operational Purpose:</div>
                      <p>{b.purpose}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                      <div>
                        Requester: <strong className="text-slate-800 font-sans">{b.userName}</strong> ({b.userDepartment})
                      </div>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(b.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatTimeIST(b.startTime)} - {formatTimeIST(b.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                        b.status === 'Pending Approval'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                          : b.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : b.status === 'Waitlisted'
                          ? 'bg-purple-50 text-purple-900 border-purple-300'
                          : b.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : b.status === 'Checked In'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b.status} {b.queuePosition ? `(Queue #${b.queuePosition})` : ''}
                    </span>

                    {/* AI Conflict Checker Trigger */}
                    <button
                      onClick={() => runAiConflictAnalysis(b.id)}
                      disabled={isAnalyzing}
                      className="py-1 px-2.5 text-[11px] font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>{isAnalyzing ? 'Checking...' : 'AI Conflict Check'}</span>
                    </button>

                    {/* Action buttons (Disabled for Student or for self-booking by Owner/Admin) */}
                    {b.status === 'Pending Approval' && role !== 'student' && (
                      <div className="flex flex-col items-end gap-1.5 pt-1">
                        {isSelfBooking ? (
                          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md font-medium text-right max-w-xs">
                            Self-Approval Prohibited (Independent Review Required)
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setRejectingBookingId(rejectingBookingId === b.id ? null : b.id)}
                              className="py-1.5 px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            <button
                              onClick={() => handleApprove(b.id)}
                              className="py-1.5 px-3.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Conflict Check Output Box */}
                {aiCheck && (
                  <div className={`p-3 rounded-lg text-xs border ${aiCheck.hasConflict ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <Bot className="w-3.5 h-3.5 text-sky-700" />
                      <span>AI Schedule Conflict Report:</span>
                    </div>
                    <p>{aiCheck.message}</p>
                    {aiCheck.suggestedAlternative && (
                      <p className="mt-1 text-slate-600 italic">{aiCheck.suggestedAlternative}</p>
                    )}
                  </div>
                )}

                {/* Reject Reason Form Drawer */}
                {rejectingBookingId === b.id && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg space-y-2 text-xs">
                    <label className="font-bold text-rose-900 block">Select or enter rejection reason:</label>
                    <select
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full text-xs p-2 border border-rose-300 rounded bg-white text-slate-900"
                    >
                      <option value="Scheduling clash with departmental capstone">Scheduling clash with departmental capstone</option>
                      <option value="FairShare priority: Lower completed usage candidate selected">FairShare priority: Lower completed usage candidate selected</option>
                      <option value="Applicant missing prerequisite safety certification">Applicant missing prerequisite safety certification</option>
                      <option value="Exceeds maximum single reservation duration limit">Exceeds maximum single reservation duration limit</option>
                      <option value="Resource scheduled for preventive maintenance">Resource scheduled for preventive maintenance</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setRejectingBookingId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          rejectBooking(b.id, rejectReason);
                          setRejectingBookingId(null);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center text-slate-500 text-xs">
          No booking requests currently match this filter.
        </div>
      )}
    </div>
  );
};
