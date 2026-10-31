import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { rankRequestsByFairShare } from '../../services/fairShareEngine';
import { mockStudentProfiles } from '../../data/mockData';
import { getAllAvailableAccounts } from '../../services/authService';
import { UserProfile } from '../../types';
import { formatTimeIST } from '../../utils/formatters';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  UserCheck,
  Info
} from 'lucide-react';

export const FairShareSection: React.FC = () => {
  const {
    resources,
    bookings,
    role,
    currentUser,
    loadFairShareDemoScenario,
    executeFairShareBatchAllocation,
    approveBooking,
    rejectBooking
  } = useApp();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Focus on CAM001 for the hackathon demonstration
  const cam001 = resources.find(r => r.id === 'CAM001') || resources[0];

  const cam001Requests = bookings.filter(
    b => b.resourceId === 'CAM001' && (b.id.startsWith('bk-comp-') || b.status === 'Pending Approval')
  );

  // Build complete user profiles map
  const userProfilesMap: Record<string, UserProfile> = {};
  getAllAvailableAccounts().forEach(acc => {
    userProfilesMap[acc.id] = acc.userProfile;
  });
  userProfilesMap[currentUser.id] = currentUser;

  // Evaluate requests with FairShare algorithm
  const evaluatedRequests = cam001
    ? rankRequestsByFairShare(
        cam001Requests,
        cam001,
        bookings,
        userProfilesMap
      )
    : [];

  const handleRunBatchAllocation = () => {
    if (role === 'student') {
      setNotification({
        type: 'error',
        message: 'RBAC Access Denied: Students cannot approve bookings. Log in as Lab Owner (Rahul Sharma).'
      });
      return;
    }

    const res = executeFairShareBatchAllocation('CAM001');
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleResetScenario = () => {
    loadFairShareDemoScenario();
    setNotification({
      type: 'success',
      message: 'Reset 5-student competing scenario on CAM001! Ready for live evaluation.'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>FairShare Algorithm Live Console</span>
              <span className="text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full">
                CAM001 Demonstration
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Algorithmic resource distribution engine for <strong>Poornima College of Engineering, Jaipur</strong>. Allocates contested slots based strictly on verified prerequisites, lowest completed history on the specific physical unit, and timestamp tie-breaking.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleResetScenario}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reload initial 5-student competing requests"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload 5-Student Scenario</span>
          </button>

          {role !== 'student' && (
            <button
              onClick={handleRunBatchAllocation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Execute FairShare Allocation</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 space-y-6 pb-6">
        {/* Notification Alert */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="font-bold underline ml-3 text-[11px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Scenario Card Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Target Asset Unit</div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {cam001?.name || 'Sony Alpha 7 IV Cinema Kit'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Unique ID: <strong className="text-slate-800">CAM001</strong> · Status: {cam001?.status}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Contested Slot Window</div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-700" />
              <span>Tomorrow 14:00 - 18:00 IST</span>
            </div>
            <div className="text-xs text-slate-500">
              5 Independent Student Applicants
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Allocation Rule Summary</div>
            <div className="text-xs font-semibold text-slate-800 leading-snug">
              Eligibility $\rightarrow$ Lowest completed on CAM001 $\rightarrow$ Earlier request $\rightarrow$ Registration ID
            </div>
            <div className="text-[11px] text-slate-500">
              Zero bias, transparent audit trail
            </div>
          </div>
        </div>

        {/* Competitor Evaluation Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Live Priority Ranking Breakdown
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {evaluatedRequests.length} applicants evaluated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3.5">Priority Rank</th>
                  <th className="py-2.5 px-3.5">Applicant (PCE Student)</th>
                  <th className="py-2.5 px-3.5">Completed on CAM001</th>
                  <th className="py-2.5 px-3.5">Prerequisites</th>
                  <th className="py-2.5 px-3.5">Request Time</th>
                  <th className="py-2.5 px-3.5">Algorithmic Rationale</th>
                  <th className="py-2.5 px-3.5 text-right">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluatedRequests.map(item => {
                  const currentBooking = bookings.find(b => b.id === item.bookingId);
                  const isTopRank = item.priorityRank === 1;

                  return (
                    <tr
                      key={item.bookingId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isTopRank ? 'bg-sky-50/40 font-medium' : ''
                      }`}
                    >
                      {/* Priority Rank */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {item.isEligible ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border ${
                              isTopRank
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-1 ring-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>#{item.priorityRank}</span>
                            {isTopRank && <span className="text-[9px] uppercase font-sans">Winner</span>}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-200">
                            Disqualified
                          </span>
                        )}
                      </td>

                      {/* Applicant */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{item.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.studentId} · {item.department.split('&')[0]}
                        </div>
                      </td>

                      {/* Completed on CAM001 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                              item.completedCountOnTargetResource === 0
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {item.completedCountOnTargetResource} session(s)
                          </span>
                        </div>
                        {item.userName === 'Priya Verma' && (
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            (Has 1 session on CAM002; not penalized)
                          </div>
                        )}
                      </td>

                      {/* Prerequisites */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {item.isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>AV Certified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-medium">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Missing AV Cert</span>
                          </span>
                        )}
                      </td>

                      {/* Request Time */}
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {formatTimeIST(item.requestSubmittedAt)}
                      </td>

                      {/* Algorithmic Rationale */}
                      <td className="py-3 px-3.5 max-w-xs text-[11px] text-slate-600">
                        <p>{item.rationale}</p>
                        {item.tieBreakerApplied && (
                          <span className="text-[10px] text-sky-700 font-medium block mt-0.5">
                            {item.tieBreakerApplied}
                          </span>
                        )}
                      </td>

                      {/* Current Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            currentBooking?.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                              : currentBooking?.status === 'Waitlisted'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : currentBooking?.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-900 border-rose-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {currentBooking?.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainability Callout for Judges */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Info className="w-4 h-4 text-sky-700 shrink-0" />
            <span>Why did the FairShare Engine rank these 5 students in this exact sequence?</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
            <li>
              <strong>Rohan Meena (Rank 1):</strong> Has 0 prior completed bookings on <code>CAM001</code>. He submitted his request at <strong>09:15 AM IST</strong> (earlier than Ananya's 10:30 AM IST), so he breaks the tie for Rank 1.
            </li>
            <li>
              <strong>Ananya Gupta (Rank 2):</strong> Also has 0 prior completed bookings on <code>CAM001</code>, but submitted at <strong>10:30 AM IST</strong> (after Rohan). Assigned Waitlist Priority #1.
            </li>
            <li>
              <strong>Aarav Sharma (Rank 3):</strong> Has 1 prior completed booking on <code>CAM001</code>. Submitted at <strong>11:00 AM IST</strong>. Assigned Waitlist Priority #2.
            </li>
            <li>
              <strong>Priya Verma (Rank 4):</strong> Has 2 prior completed bookings on <code>CAM001</code>. Submitted at <strong>11:45 AM IST</strong>. Her 1 completed session on <code>CAM002</code> does NOT count against her on <code>CAM001</code>, preserving unit-specific fairness. Assigned Waitlist Priority #3.
            </li>
            <li>
              <strong>Karan Singh (Disqualified):</strong> Submitted at <strong>12:15 PM IST</strong>. Lacks the mandatory <em>AV & Cinema Equipment Operator Certification</em> required by <code>CAM001</code>. Automatically disqualified regardless of timestamp.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
