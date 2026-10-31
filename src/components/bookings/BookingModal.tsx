import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Building, Check, ArrowRight } from 'lucide-react';

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

export const BookingModal: React.FC<Props> = ({ resource, onClose }) => {
  const { submitBooking, role, currentUser, bookings, setCurrentPage } = useApp();

  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState<string>('10:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [purpose, setPurpose] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('Senior Capstone Project');

  // Institutional priority fields for Lab Owner and Administrator
  const [isInstitutional, setIsInstitutional] = useState<boolean>(role !== 'student');
  const [institutionalPurpose, setInstitutionalPurpose] = useState<string>(
    role === 'admin'
      ? 'Institutional Facility Operations & Accreditation Audit Setup'
      : role === 'owner'
      ? 'Departmental Lab Practical Setup & Experimental Bench Calibration'
      : ''
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string; pin?: string } | null>(null);

  // Reset modal form state whenever a new resource is opened
  useEffect(() => {
    if (resource) {
      setResultMessage(null);
      setIsSubmitting(false);
      setPurpose('');
      setIsInstitutional(role !== 'student');
      setInstitutionalPurpose(
        role === 'admin'
          ? 'Institutional Facility Operations & Accreditation Audit Setup'
          : role === 'owner'
          ? 'Departmental Lab Practical Setup & Experimental Bench Calibration'
          : ''
      );
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setStartTime('10:00');
      setDurationHours(2);
    }
  }, [resource?.id, role]);

  if (!resource) return null;

  // Actual time-slot overlap detection
  const startISO = `${date}T${startTime}:00Z`;
  const endDateTime = new Date(`${date}T${startTime}:00Z`);
  endDateTime.setHours(endDateTime.getHours() + Number(durationHours));
  const endISO = endDateTime.toISOString();

  const conflictingBookings = bookings.filter(b => {
    if (b.resourceId !== resource.id || b.status === 'Cancelled' || b.status === 'Rejected') return false;
    const bStart = new Date(b.startTime).getTime();
    const bEnd = new Date(b.endTime).getTime();
    const reqStart = new Date(startISO).getTime();
    const reqEnd = new Date(endISO).getTime();
    return reqStart < bEnd && reqEnd > bStart;
  });

  const hasConflict = conflictingBookings.length > 0;
  const isPhysicallyInUse = conflictingBookings.some(b => b.status === 'Checked In');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setResultMessage({ type: 'error', text: 'Please specify the academic or operational purpose for this reservation.' });
      return;
    }

    if (isInstitutional && !institutionalPurpose.trim()) {
      setResultMessage({ type: 'error', text: 'Mandatory Institutional Mandate/Purpose is required for priority allocation.' });
      return;
    }

    if (new Date(endISO).getTime() <= new Date(startISO).getTime()) {
      setResultMessage({ type: 'error', text: 'Invalid Time Window: Reservation end time must be strictly after start time.' });
      return;
    }

    setIsSubmitting(true);

    const res = submitBooking({
      resourceId: resource.id,
      startTime: startISO,
      endTime: endISO,
      purpose: purpose.trim(),
      projectType,
      isInstitutionalOverride: isInstitutional && role !== 'student',
      institutionalPurpose: isInstitutional && role !== 'student' ? institutionalPurpose.trim() : undefined
    });

    setIsSubmitting(false);

    if (res.success) {
      setResultMessage({
        type: 'success',
        text: res.message
      });
    } else {
      setResultMessage({
        type: 'error',
        text: res.message
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{resource.category}</span>
              <span aria-hidden="true">·</span>
              <span>{resource.department}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-700">ID: {resource.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{resource.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Result Message Banner */}
        {resultMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${resultMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {resultMessage.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {resultMessage.type === 'success' ? 'Reservation Request Processed' : 'Booking Could Not Be Completed'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">{resultMessage.text}</p>
            <div className="pt-4 flex items-center justify-center gap-3">
              {resultMessage.type === 'success' && (
                <button
                  onClick={() => {
                    onClose();
                    setCurrentPage('my-bookings');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                {resultMessage.type === 'success' ? 'Close' : 'Try Again'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Eligibility & Rules Callout */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>Eligibility & Fair Usage Policy</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {resource.eligibilityRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
                <li>Weekly fair-use quota: max {resource.fairUseWeeklyLimitHours} hours per student</li>
              </ul>
            </div>

            {/* Institutional Requirement & Priority Selection (Lab Owner & Administrator) */}
            {role !== 'student' && (
              <div className="bg-purple-50/70 rounded-xl p-4 border border-purple-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInstitutional}
                      onChange={e => setIsInstitutional(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-purple-950">
                      Submit as Authorised Institutional Requirement
                    </span>
                  </label>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    {role === 'admin' ? 'Tier 1: Admin Authority' : 'Tier 2: Lab In-Charge Authority'}
                  </span>
                </div>

                {isInstitutional ? (
                  <div className="space-y-2 pt-1 border-t border-purple-200/60 text-xs">
                    <label className="block text-purple-900 font-semibold text-[11px]">
                      Specify Mandatory Institutional Purpose / Mandate:
                    </label>
                    <input
                      type="text"
                      value={institutionalPurpose}
                      onChange={e => setInstitutionalPurpose(e.target.value)}
                      placeholder="e.g. NAAC / NBA Accreditation Audit Setup, Departmental Final Exam, Faculty Research..."
                      className="w-full text-xs px-3 py-2 border border-purple-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <p className="text-[11px] text-purple-800 leading-tight">
                      Institutional priority supersedes ordinary student reservations for university operational requirements. All overrides are logged in the campus audit ledger.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-purple-700">
                    Unchecked: Submitting as personal borrowing. Standard FairShare queue rules apply without priority override.
                  </p>
                )}
              </div>
            )}

            {/* Time Slot Conflict Alert */}
            {hasConflict && (
              <div className={`rounded-xl p-4 border text-xs flex items-start gap-3 ${
                isInstitutional && !isPhysicallyInUse
                  ? 'bg-purple-50 border-purple-200 text-purple-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isInstitutional && !isPhysicallyInUse ? 'text-purple-700' : 'text-amber-700'
                }`} />
                <div>
                  <span className="font-bold">Time Slot Overlap Detected:</span> Another booking currently exists during this requested slot.
                  {isInstitutional && !isPhysicallyInUse ? (
                    <span> Your authorized institutional priority will supersede the lower-priority reservation upon submission.</span>
                  ) : (
                    <span> Submitting will enroll your request in the <strong>Waiting List</strong>.</span>
                  )}
                </div>
              </div>
            )}

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Reservation Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Start Time (IST)
                </label>
                <select
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="08:00">08:00 AM IST</option>
                  <option value="09:00">09:00 AM IST</option>
                  <option value="10:00">10:00 AM IST</option>
                  <option value="11:00">11:00 AM IST</option>
                  <option value="12:00">12:00 PM IST</option>
                  <option value="13:00">01:00 PM IST</option>
                  <option value="14:00">02:00 PM IST</option>
                  <option value="15:00">03:00 PM IST</option>
                  <option value="16:00">04:00 PM IST</option>
                  <option value="17:00">05:00 PM IST</option>
                  <option value="18:00">06:00 PM IST</option>
                  <option value="19:00">07:00 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={resource.maxBookingDurationHours}
                  value={durationHours}
                  onChange={e => setDurationHours(Math.min(resource.maxBookingDurationHours, Math.max(1, Number(e.target.value))))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                />
              </div>
            </div>

            {/* Project Classification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic / Operational Category</label>
              <select
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Institutional Academic Operations">Institutional Academic Operations</option>
                <option value="Senior Capstone Project">Senior Capstone Project</option>
                <option value="Undergraduate Coursework">Undergraduate Coursework</option>
                <option value="Master / PhD Thesis Research">Master / PhD Thesis Research</option>
                <option value="Departmental Lab Practical Setup">Departmental Lab Practical Setup</option>
                <option value="Faculty Sponsored Competition">Faculty Sponsored Competition</option>
              </select>
            </div>

            {/* Purpose & Research Scope */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Purpose & Equipment Usage Scope
              </label>
              <textarea
                rows={3}
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="Describe what experiments, software packages, or campus activities will be performed..."
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white placeholder:text-slate-400"
                required
              />
            </div>

            {/* User Details Preview */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div>
                Reserving as: <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.department}, Nexora University)
              </div>
              <div className="font-mono text-xs capitalize">
                Role: <span className="font-bold text-slate-700">{role}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isInstitutional
                    ? 'bg-purple-700 hover:bg-purple-800'
                    : hasConflict
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-sky-700 hover:bg-sky-800'
                }`}
              >
                {isInstitutional
                  ? 'Submit Institutional Request'
                  : hasConflict
                  ? 'Join Waiting List'
                  : resource.requiresApproval
                  ? 'Submit for Approval'
                  : 'Confirm Instant Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
