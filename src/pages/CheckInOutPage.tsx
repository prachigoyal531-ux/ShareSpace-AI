import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  KeyRound,
  FileText,
  Camera,
  Upload,
  Image as ImageIcon,
  User,
  ArrowRight,
  SplitSquareVertical
} from 'lucide-react';

export const CheckInOutPage: React.FC = () => {
  const {
    bookings,
    currentUser,
    role,
    performCheckIn,
    performCheckOut
  } = useApp();

  const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin');

  // Check-in state
  const [selectedCheckInBookingId, setSelectedCheckInBookingId] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [preCheckNotes, setPreCheckNotes] = useState<string>('Visual inspection complete. Clean casing, all cables and components accounted for.');
  const [preCheckPhoto, setPreCheckPhoto] = useState<string | null>(null);
  const [checkInVerifiedChecklist, setCheckInVerifiedChecklist] = useState<boolean>(true);
  const fileInputRefPre = useRef<HTMLInputElement>(null);

  // Return / Check-out state
  const [selectedReturnBookingId, setSelectedReturnBookingId] = useState<string>('');
  const [postCheckNotes, setPostCheckNotes] = useState<string>('Equipment wiped down and verified in working operational order.');
  const [postCheckPhoto, setPostCheckPhoto] = useState<string | null>(null);
  const [hasIncident, setHasIncident] = useState<boolean>(false);
  const [incidentSeverity, setIncidentSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [incidentDescription, setIncidentDescription] = useState<string>('');
  const fileInputRefPost = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Eligible bookings based on role
  // Student sees their own; Owner/Admin sees departmental/all
  const readyToCheckIn = bookings.filter(
    b => b.status === 'Approved' && (role !== 'student' || b.userId === currentUser.id)
  );

  const activeCheckedIn = bookings.filter(
    b => b.status === 'Checked In' && (role !== 'student' || b.userId === currentUser.id)
  );

  const selectedReturnBooking = bookings.find(b => b.id === selectedReturnBookingId);

  // Handle Real Photo Upload via FileReader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isPreCheck: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', text: 'Please upload a valid image file (PNG, JPG, JPEG).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isPreCheck) {
          setPreCheckPhoto(reader.result);
        } else {
          setPostCheckPhoto(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (role === 'admin') {
      setNotification({
        type: 'error',
        text: 'Institutional Custody Separation: Central Administrators cannot perform routine physical handover. Please switch to Lab Owner (Rahul Sharma).'
      });
      return;
    }

    if (!selectedCheckInBookingId || !pinInput.trim()) {
      setNotification({ type: 'error', text: 'Please select a booking reference and input the Verification PIN.' });
      return;
    }

    const res = performCheckIn(
      selectedCheckInBookingId,
      pinInput.trim(),
      preCheckNotes,
      preCheckPhoto || undefined
    );

    if (res.success) {
      setNotification({ type: 'success', text: res.message });
      setSelectedCheckInBookingId('');
      setPinInput('');
      setPreCheckPhoto(null);
    } else {
      setNotification({ type: 'error', text: res.message });
    }
  };

  const handleCheckOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (role === 'admin') {
      setNotification({
        type: 'error',
        text: 'Institutional Custody Separation: Central Administrators cannot confirm routine equipment returns. Please switch to Lab Owner (Rahul Sharma).'
      });
      return;
    }

    if (!selectedReturnBookingId) {
      setNotification({ type: 'error', text: 'Please select which resource you are checking out / returning.' });
      return;
    }

    const incidentData = hasIncident
      ? { severity: incidentSeverity, description: incidentDescription || 'Condition inspection discrepancy reported.' }
      : undefined;

    const res = performCheckOut(
      selectedReturnBookingId,
      postCheckNotes,
      postCheckPhoto || undefined,
      incidentData
    );

    if (res.success) {
      setNotification({ type: 'success', text: res.message });
      setSelectedReturnBookingId('');
      setHasIncident(false);
      setIncidentDescription('');
      setPostCheckPhoto(null);
    } else {
      setNotification({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Custody Check-in & Return Station</h1>
        <p className="text-xs text-slate-500">
          Poornima College of Engineering, Jaipur · 10-step custody verification, photo evidence audit, and handover sign-off
        </p>
      </div>

      {/* Custody Separation Notice for Admin */}
      {role === 'admin' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Institutional Custody Separation Policy:</strong> You are logged in as <strong>Administrator (Ankit Gupta)</strong>. Administrators oversee policies, logs, and analytics, but cannot perform routine physical equipment handover or return confirmations. Use the account switcher in the top bar to switch to <strong>Lab Owner (Rahul Sharma)</strong> to execute handovers.
          </div>
        </div>
      )}

      {/* 10-Step Lifecycle Visual Indicator */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>10-Step Equipment Custody Lifecycle</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">PCE Sitapura Safety Protocol</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
          <div className="p-2 rounded-lg bg-sky-50 border border-sky-100 space-y-0.5">
            <span className="font-bold text-sky-900">1-2. Request & FairShare</span>
            <p className="text-sky-700">Proposal evaluated & approved</p>
          </div>
          <div className={`p-2 rounded-lg border space-y-0.5 ${mode === 'checkin' ? 'bg-sky-100/70 border-sky-300 ring-1 ring-sky-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-bold text-slate-900">3-5. Handover Check-in</span>
            <p className="text-slate-600">PIN entry, pre-photo, custody handoff</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-slate-900">6. Active Utilization</span>
            <p className="text-slate-600">Equipment in student custody</p>
          </div>
          <div className={`p-2 rounded-lg border space-y-0.5 ${mode === 'checkout' ? 'bg-emerald-100/70 border-emerald-300 ring-1 ring-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-bold text-slate-900">7-9. Return & Audit</span>
            <p className="text-slate-600">Post-photo, side-by-side inspection</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-slate-900">10. Completed & Logged</span>
            <p className="text-slate-600">Audit log saved, quota updated</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 max-w-md">
        <button
          onClick={() => {
            setMode('checkin');
            setNotification(null);
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'checkin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ScanLine className="w-4 h-4 text-sky-700" />
          <span>Check-in Handover</span>
          <span className="font-mono text-[10px] text-slate-400">({readyToCheckIn.length})</span>
        </button>

        <button
          onClick={() => {
            setMode('checkout');
            setNotification(null);
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'checkout'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-emerald-700" />
          <span>Return & Inspection</span>
          <span className="font-mono text-[10px] text-slate-400">({activeCheckedIn.length})</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
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
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline ml-4 hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MODE 1: Check-in Form */}
      {mode === 'checkin' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-sky-700" />
              <span>Step 1: Validate Authorized Reservation & Handover Custody</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your approved booking, verify the one-time PIN, and document the baseline physical condition.
            </p>
          </div>

          <form onSubmit={handleCheckInSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Approved Reservation
              </label>
              {readyToCheckIn.length > 0 ? (
                <select
                  value={selectedCheckInBookingId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedCheckInBookingId(id);
                    const found = readyToCheckIn.find(b => b.id === id);
                    if (found) setPinInput(found.checkInVerificationCode);
                  }}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                >
                  <option value="">-- Choose an approved reservation --</option>
                  {readyToCheckIn.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.resourceName} ({b.resourceId}) · {b.userName} [PIN: {b.checkInVerificationCode}]
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
                  No approved bookings awaiting check-in right now for this user account.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>One-Time Custody Verification PIN</span>
              </label>
              <input
                type="text"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="e.g. CHK-7824"
                className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-wider uppercase"
                required
              />
            </div>

            {/* Real Condition Photo Upload */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-sky-700" />
                  <span>Real Condition Photo Upload (Initial Intake)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Image File Input</span>
              </div>

              <p className="text-[11px] text-slate-500">
                Capture or upload an actual photo of the asset before leaving the lab depot to document baseline condition:
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefPre}
                  onChange={e => handlePhotoUpload(e, true)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefPre.current?.click()}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-700" />
                  <span>{preCheckPhoto ? 'Change Photo' : 'Upload Condition Photo'}</span>
                </button>

                {preCheckPhoto && (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real photo attached</span>
                  </span>
                )}
              </div>

              {/* Photo Preview */}
              {preCheckPhoto && (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-300 max-w-xs bg-slate-900">
                  <img
                    src={preCheckPhoto}
                    alt="Pre-check inspection baseline"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-white p-1.5 text-center font-mono">
                    Baseline Intake Photo (Stored)
                  </div>
                </div>
              )}
            </div>

            {/* Pre-Check Inspection Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>Pre-Check Custody Checklist</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkInVerifiedChecklist}
                    onChange={e => setCheckInVerifiedChecklist(e.target.checked)}
                    className="rounded text-sky-700 focus:ring-sky-500"
                  />
                  <span>I confirm the equipment serial barcode matches college inventory and is in operating condition</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Baseline Condition Notes
                </label>
                <textarea
                  rows={2}
                  value={preCheckNotes}
                  onChange={e => setPreCheckNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedCheckInBookingId || !checkInVerifiedChecklist || role === 'admin'}
                className="py-2.5 px-6 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {role === 'owner'
                    ? 'Verify Handover & Issue Asset (Lab Owner)'
                    : 'Authorize Check-in & Receive Asset'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 2: Return / Check-out Form */}
      {mode === 'checkout' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-700" />
              <span>Step 2: Equipment Return & Handover Sign-off</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Inspect returned equipment, upload return photos, and view side-by-side comparison with intake photos.
            </p>
          </div>

          <form onSubmit={handleCheckOutSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Active Loan in Hand
              </label>
              {activeCheckedIn.length > 0 ? (
                <select
                  value={selectedReturnBookingId}
                  onChange={e => {
                    setSelectedReturnBookingId(e.target.value);
                    setPostCheckPhoto(null);
                  }}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                >
                  <option value="">-- Choose active equipment loan to return --</option>
                  {activeCheckedIn.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.resourceName} ({b.resourceId}) · Borrowed by {b.userName} ({b.id})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
                  No resources currently checked out for this user account.
                </div>
              )}
            </div>

            {/* Real Return Photo Upload */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Real Condition Photo Upload (Return Sign-off)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Image File Input</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefPost}
                  onChange={e => handlePhotoUpload(e, false)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefPost.current?.click()}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{postCheckPhoto ? 'Change Return Photo' : 'Upload Return Condition Photo'}</span>
                </button>

                {postCheckPhoto && (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Return photo attached</span>
                  </span>
                )}
              </div>

              {/* Side-by-Side Photo Comparison View (Judge Feature) */}
              {(selectedReturnBooking?.preCheckPhotoUrl || postCheckPhoto) && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <SplitSquareVertical className="w-3.5 h-3.5 text-sky-700" />
                    <span>Photo Audit: Before & After Comparison</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Intake Photo */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900">
                      <div className="bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-300 font-bold">
                        1. INTAKE BASELINE (CHECK-IN)
                      </div>
                      {selectedReturnBooking?.preCheckPhotoUrl ? (
                        <img
                          src={selectedReturnBooking.preCheckPhotoUrl}
                          alt="Intake condition"
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="h-36 flex items-center justify-center text-[11px] text-slate-500 font-mono">
                          No initial photo recorded
                        </div>
                      )}
                    </div>

                    {/* Return Photo */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900">
                      <div className="bg-slate-800 px-2 py-1 text-[10px] font-mono text-emerald-300 font-bold">
                        2. RETURN INSPECTION (CURRENT)
                      </div>
                      {postCheckPhoto ? (
                        <img
                          src={postCheckPhoto}
                          alt="Return inspection"
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="h-36 flex items-center justify-center text-[11px] text-slate-500 font-mono">
                          Upload return photo above
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Return Inspection & Handover Notes
              </label>
              <textarea
                rows={2}
                value={postCheckNotes}
                onChange={e => setPostCheckNotes(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="State whether all cables, lenses, or accessories are accounted for..."
              />
            </div>

            {/* Incident / Damage Flagging */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasIncident}
                  onChange={e => setHasIncident(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Report Damage, Malfunction, or Missing Accessories
                </span>
              </label>

              {hasIncident && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Incident Severity
                    </label>
                    <select
                      value={incidentSeverity}
                      onChange={e => setIncidentSeverity(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Low">Low - Cosmetic smudge or minor accessory friction</option>
                      <option value="Medium">Medium - Missing auxiliary cable or slight casing scratch</option>
                      <option value="High">High - Malfunctioning port or mechanical jam requiring technician</option>
                      <option value="Critical">Critical - Hardware fracture or safety hazard (Quarantine)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Incident Explanation
                    </label>
                    <textarea
                      rows={2}
                      value={incidentDescription}
                      onChange={e => setIncidentDescription(e.target.value)}
                      placeholder="Detail what occurred during the session..."
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      required={hasIncident}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedReturnBookingId || role === 'admin'}
                className="py-2.5 px-6 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {role === 'owner'
                    ? 'Inspect & Confirm Return Sign-off (Lab Owner)'
                    : 'Submit Return Handover'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
