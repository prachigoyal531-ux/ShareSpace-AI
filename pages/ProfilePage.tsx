import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCircle,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Scale,
  Plus,
  Trash2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    role,
    bookings,
    resources,
    maxActiveBookingsPerStudent
  } = useApp();

  const [newCert, setNewCert] = useState<string>('');

  const allAvailableCerts = [
    'Lab Safety Induction Level 2',
    '3D Rapid Prototyping Safety Cert',
    'AV & Cinema Equipment Operator',
    'Cleanroom Protocol & Chemical Safety Certification Level 3',
    'IRB / Human Subjects Research Ethics training completed',
    'Advanced Fabrication & Hazardous Materials Handling Cert'
  ];

  // Active student quota: ONLY approved and active (Checked In) bookings count
  const activeStudentBookingsCount = bookings.filter(
    b => b.userId === currentUser.id && ['Approved', 'Checked In'].includes(b.status)
  ).length;

  const handleToggleCert = (cert: string) => {
    // Requirement 15: Students cannot self-certify. Only Administrator can verify/revoke.
    if (role !== 'admin') {
      alert('Institutional Policy: Students and Lab Staff cannot self-certify. Operational safety credentials must be formally inspected and verified by the Central Administrator (Ankit Gupta).');
      return;
    }

    const exists = currentUser.verifiedCertifications.includes(cert);
    const updated = exists
      ? currentUser.verifiedCertifications.filter(c => c !== cert)
      : [...currentUser.verifiedCertifications, cert];

    updateCurrentUser({ verifiedCertifications: updated });
  };

  const handleAddCustomCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') {
      alert('Only Administrators can issue institutional safety credentials.');
      return;
    }
    if (newCert.trim() && !currentUser.verifiedCertifications.includes(newCert.trim())) {
      updateCurrentUser({
        verifiedCertifications: [...currentUser.verifiedCertifications, newCert.trim()]
      });
      setNewCert('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Profile & Institutional Identity</h1>
        <p className="text-xs text-slate-500">
          Poornima College of Engineering, Jaipur · Verified campus safety clearances, role privileges, and fair usage quota
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 capitalize">
                {currentUser.role}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                Verified Identity
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <div>{currentUser.email}</div>
              <div className="font-mono text-[11px]">ID: {currentUser.studentOrEmployeeId} · {currentUser.department}</div>
              <div className="text-[11px] text-slate-400">Poornima College of Engineering, Jaipur (Sitapura Campus)</div>
            </div>
          </div>
        </div>

        {/* Reputation Score & Quota Metrics (Role-tailored: Quota ONLY for students) */}
        <div className="flex items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {currentUser.reputationScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Good Standing</span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200" />

          {/* Student borrows with quota limit; Owner/Admin have role governance status */}
          {role === 'student' ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-800 tabular-nums">
                {activeStudentBookingsCount}
                <span className="text-xs font-normal text-slate-400"> / {maxActiveBookingsPerStudent}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Active Quota Used</div>
            </div>
          ) : role === 'owner' ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-800 tabular-nums">
                {resources.filter(r => r.ownerName === currentUser.name || r.ownerEmail === currentUser.email).length}
              </div>
              <div className="text-[11px] text-indigo-700 font-medium mt-0.5">Managed Lab Assets</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-800 tabular-nums">
                {resources.length}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">Campus Oversight Pool</div>
            </div>
          )}
        </div>
      </div>

      {/* Verified Safety Certifications Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <h2 className="text-base font-bold text-slate-900">Safety & Operational Certifications</h2>
            </div>
            <span className="text-xs text-sky-900 font-mono font-bold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              {currentUser.verifiedCertifications.length} Active Credential{currentUser.verifiedCertifications.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'admin'
              ? 'Administrator Certification Console: Toggle or issue verified safety clearances on institutional profiles below.'
              : 'Institutional safety credentials verified by campus department in-charge. (Students cannot self-certify).'}
          </p>
        </div>

        {/* Available Certifications Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allAvailableCerts.map((cert, i) => {
            const isVerified = currentUser.verifiedCertifications.includes(cert);
            return (
              <div
                key={i}
                onClick={() => handleToggleCert(cert)}
                className={`p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 select-none ${
                  role === 'admin' ? 'cursor-pointer hover:border-sky-400' : 'cursor-default'
                } ${
                  isVerified
                    ? 'bg-sky-50/70 border-sky-300 text-sky-950 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isVerified ? 'bg-sky-700 text-white' : 'border border-slate-300 bg-white text-transparent'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div>
                  <div className={`font-bold ${isVerified ? 'text-slate-900' : 'text-slate-600'}`}>
                    {cert}
                  </div>
                  <div className="text-[11px] mt-0.5">
                    {isVerified ? (
                      <span className="text-emerald-700 font-medium">✓ Verified by Campus Administration</span>
                    ) : (
                      <span className="text-slate-400 font-mono">NOT VERIFIED</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom cert (Admin Only) */}
        {role === 'admin' ? (
          <form onSubmit={handleAddCustomCert} className="pt-2 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={newCert}
              onChange={e => setNewCert(e.target.value)}
              placeholder="Issue custom certification (e.g. Laser Safety Officer Level 1)..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Certification</span>
            </button>
          </form>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>To request safety training or certificate verification, contact the Central Platform Administrator (Ankit Gupta).</span>
          </div>
        )}
      </div>

      {/* Campus Fair Usage Policy Rules */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-800" />
          <h2 className="text-base font-bold text-slate-900">ShareSpace Fair Allocation Governance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">Concurrent Limit (3 Slots)</div>
            <p className="text-slate-600 leading-relaxed">
              Students may hold at most 3 active concurrent reservations to prevent hoarding of equipment across overlapping terms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">Check-in Grace Period</div>
            <p className="text-slate-600 leading-relaxed">
              Failure to check in using the PIN within 20 minutes of start time automatically releases the slot to the waiting list.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">15-Minute Turnaround</div>
            <p className="text-slate-600 leading-relaxed">
              Borrowers must clean workstations and pack all accessories 15 minutes prior to slot end to guarantee seamless handoff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
