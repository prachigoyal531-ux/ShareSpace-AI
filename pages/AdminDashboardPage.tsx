import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FairShareSection } from '../components/dashboard/FairShareSection';
import { getAllAvailableAccounts } from '../services/authService';
import { formatDateIST, formatTimeIST } from '../utils/formatters';
import {
  BarChart3,
  Database,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Users,
  Layers,
  Building,
  Terminal,
  Activity,
  Scale,
  Wrench,
  Sliders,
  ArrowRight,
  Server,
  Code2,
  Check
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    resources,
    bookings,
    conditionReports,
    activityLogs,
    resetDemoData,
    maxActiveBookingsPerStudent,
    updateStudentQuotaSetting,
    navigateToResource
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'fairshare' | 'governance' | 'supabase'>('analytics');
  const [quotaInput, setQuotaInput] = useState<number>(maxActiveBookingsPerStudent);
  const [quotaUpdatedMessage, setQuotaUpdatedMessage] = useState<boolean>(false);

  // Metrics calculation
  const totalResources = resources.length;
  const availableCount = resources.filter(r => r.status === 'Available').length;
  const inUseCount = resources.filter(r => r.status === 'In Use').length;
  const reservedCount = resources.filter(r => r.status === 'Reserved').length;
  const maintenanceCount = resources.filter(r => r.status === 'Maintenance').length;

  const utilizationRate = Math.round(((inUseCount + reservedCount) / (totalResources || 1)) * 100);

  // Fleet Condition Score calculated dynamically from live resource condition scores
  const rawConditionTotal = resources.reduce((acc, r) => acc + r.conditionScore, 0);
  const avgConditionScore = Math.round(rawConditionTotal / (totalResources || 1));

  // Equipment requiring maintenance or attention (under Maintenance status or score < 85)
  const maintenanceAttentionEquipment = resources.filter(
    r => r.status === 'Maintenance' || r.conditionScore < 85
  );

  // Group by category
  const categoryBreakdown = [
    'Laboratories',
    'Laptops',
    'Cameras',
    'Projectors',
    '3D Printers',
    'Seminar Rooms'
  ].map(cat => {
    const items = resources.filter(r => r.category === cat);
    const inUse = items.filter(r => r.status === 'In Use' || r.status === 'Reserved').length;
    return {
      category: cat,
      total: items.length,
      inUse,
      utilization: Math.round((inUse / (items.length || 1)) * 100)
    };
  });

  const handleUpdateQuota = (newVal: number) => {
    updateStudentQuotaSetting(newVal);
    setQuotaInput(newVal);
    setQuotaUpdatedMessage(true);
    setTimeout(() => setQuotaUpdatedMessage(false), 2500);
  };

  // Student accounts and their active booking counts
  const studentAccounts = getAllAvailableAccounts().filter(a => a.role === 'student');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Demonstration Disclaimer Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demonstration Environment:</strong> Showing fictional demonstration data for <strong>Poornima College of Engineering, Jaipur</strong> (Sitapura Campus). This system is a functional prototype and does not represent an officially deployed college application.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded shrink-0">
          Demo Mode
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Institutional Administration</h1>
          <p className="text-xs text-slate-500">
            Poornima College of Engineering, Jaipur · Central resource governance, quota management, and custody audit logs
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Utilization Analytics
          </button>
          <button
            onClick={() => setActiveTab('fairshare')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'fairshare' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-sky-700" />
            <span>FairShare Engine (Demo)</span>
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'governance' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Accounts & Fair Quota
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'supabase' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Architecture</span>
          </button>
        </div>
      </div>

      {activeTab === 'fairshare' && (
        <div className="space-y-6">
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
            <strong>Administrator Oversight:</strong> Central administrators monitor the FairShare priority algorithm across all campus departments. Lab In-Charges retain direct operational sign-off for custody handovers and resource approvals.
          </div>
          <FairShareSection />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Campus Utilization Rate</div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {utilizationRate}%
              </div>
              <div className="text-[11px] text-sky-700 font-medium mt-1">
                {inUseCount + reservedCount} active / {totalResources} items
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Available for Booking</div>
              <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">
                {availableCount}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">Ready for circulation</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Fleet Condition Score</div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {avgConditionScore}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Dynamically computed across {totalResources} assets</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Equipment in Service</div>
              <div className="text-3xl font-extrabold text-rose-600 tabular-nums">
                {maintenanceCount}
              </div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">Scheduled bench maintenance</div>
            </div>
          </div>

          {/* Equipment Requiring Maintenance Alert Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Equipment Requiring Attention & Maintenance</h3>
              </div>
              <span className="text-xs font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-lg">
                {maintenanceAttentionEquipment.length} Assets Highlighted
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Assets currently placed in offline maintenance or with inspected condition rating below 85%:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {maintenanceAttentionEquipment.map(res => (
                <div key={res.id} className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{res.name}</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {res.status === 'Maintenance' ? 'In Maintenance' : `Rating: ${res.conditionScore}%`}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Location: {res.location} · {res.department}
                  </div>
                  {res.maintenanceReason && (
                    <div className="text-rose-900 font-medium text-[11px]">
                      Reason: {res.maintenanceReason}
                    </div>
                  )}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => navigateToResource(res.id, 'admin-dashboard')}
                      className="text-[11px] font-semibold text-sky-700 hover:text-sky-900"
                    >
                      Inspect Equipment →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Utilization Matrix */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-700" />
                <h3 className="text-sm font-bold text-slate-900">Resource Category Utilization Matrix</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Real-time status breakdown</span>
            </div>

            <div className="divide-y divide-slate-100">
              {categoryBreakdown.map(cat => (
                <div key={cat.category} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="w-44">
                    <span className="font-bold text-slate-900 block">{cat.category}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {cat.inUse} of {cat.total} in loan
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 max-w-md">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-700 rounded-full transition-all duration-500"
                        style={{ width: `${cat.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-slate-800 w-16">
                    {cat.utilization}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Demo Data Action */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Platform Data Management</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Reset system back to initial pristine university demonstration data anytime for presentations.
              </p>
            </div>

            <button
              onClick={resetDemoData}
              className="py-2 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Demo State</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Student Fair Usage Quota Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-700" />
                  <h2 className="text-base font-bold text-slate-900">Fair Usage Quota Configuration (Students Only)</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set the institutional maximum simultaneous active reservations allowed per student across campus.
                </p>
              </div>

              {quotaUpdatedMessage && (
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Limit updated to {maxActiveBookingsPerStudent}!</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <Scale className="w-4 h-4 text-sky-700" />
                <span>Institutional Fair Usage Policy Rules:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sky-800 text-[11px] leading-relaxed">
                <li>Personal borrowing quotas apply <strong>strictly to Student accounts</strong>.</li>
                <li>Lab Owners and Campus Administrators maintain departmental oversight and do not have student borrowing caps.</li>
                <li>Only <strong>Approved</strong> and <strong>Checked In</strong> bookings consume active quota. Pending and Waitlisted requests do not lock student slots.</li>
                <li>When a student reaches the active quota limit, new requests are automatically blocked until an active resource is returned and verified.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <span className="text-xs font-bold text-slate-700">Configure Maximum Active Bookings:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(limit => (
                  <button
                    key={limit}
                    onClick={() => handleUpdateQuota(limit)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      maxActiveBookingsPerStudent === limit
                        ? 'bg-sky-700 text-white border-sky-800 shadow-xs ring-2 ring-sky-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {limit} Active {limit === 1 ? 'Slot' : 'Slots'}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Student Quota Utilization Status */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3">Live Student Quota Tracking</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {studentAccounts.map(stu => {
                  const activeStudentBookings = bookings.filter(
                    b => b.userId === stu.id && (b.status === 'Approved' || b.status === 'Checked In')
                  );
                  const isFull = activeStudentBookings.length >= maxActiveBookingsPerStudent;

                  return (
                    <div key={stu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900 truncate">{stu.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{stu.loginId}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-500">Active Quota:</span>
                        <span className={`font-mono font-bold ${isFull ? 'text-rose-600' : 'text-slate-800'}`}>
                          {activeStudentBookings.length} / {maxActiveBookingsPerStudent}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isFull ? 'bg-rose-500' : 'bg-sky-600'}`}
                          style={{ width: `${Math.min(100, (activeStudentBookings.length / maxActiveBookingsPerStudent) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User Accounts & Role Governance */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Institutional User Accounts & Role Governance</h2>
                <p className="text-xs text-slate-500">Predefined demonstration credentials and institutional role permissions</p>
              </div>
              <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-lg">
                {getAllAvailableAccounts().length} Registered Accounts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAllAvailableAccounts().map(acc => {
                const isStudent = acc.role === 'student';
                const isOwner = acc.role === 'owner';
                const isAdmin = acc.role === 'admin';

                return (
                  <div key={acc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{acc.name}</h4>
                      <div className="text-[11px] text-slate-500 font-mono">ID: {acc.loginId}</div>
                      <div className="text-[11px] text-slate-600 truncate">{acc.department}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Role Privileges:</span>
                        <strong className="text-slate-800">
                          {isStudent ? 'Reserve & Check-in' : isOwner ? 'Approve & Custody' : 'Campus Governance'}
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Approvals:</span>
                        <span className={isStudent ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                          {isStudent ? 'Blocked' : 'Authorized'}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Physical Custody:</span>
                        <span className={isOwner ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                          {isOwner ? 'Authorized Handover' : isStudent ? 'Receive Only' : 'Blocked (Separation)'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'supabase' && (
        /* Clean Supabase Architecture View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold border border-slate-200">
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Supabase Integration Architecture</h2>
                  <p className="text-xs text-slate-500">Decoupled data access layer designed for seamless PostgreSQL migration</p>
                </div>
              </div>

              {/* Status Badge clearly stating Integration Pending */}
              <span className="px-3 py-1.5 text-xs font-bold rounded-lg border bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1.5 self-start sm:self-auto">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Planned / Integration Pending</span>
              </span>
            </div>

            {/* Architecture Explanatory Notice */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Architecture Notice:</strong> Actual backend connection to Supabase will be performed in a future deployment phase after the core platform logic and workflows are finalized. For the hackathon demonstration, ShareSpace AI runs on verified in-memory reactive state with zero external connection latency.
              </p>
              <p className="text-slate-500">
                All data service calls are isolated behind typed repository interfaces (<code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-sky-800">src/services/supabaseService.ts</code>) ready to activate upon receiving <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_URL</code> and <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>

            {/* Visual Architecture Flow Diagram */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                System Integration Diagram
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Step 1: Frontend Client */}
                <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                      Active
                    </span>
                    <Code2 className="w-4 h-4 text-sky-700" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">React SPA Frontend</h4>
                  <p className="text-xs text-slate-600">
                    TypeScript, Tailwind CSS, AppContext state engine, FairShare priority algorithm, and QR verification.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-sky-800">
                    Status: Fully Operational
                  </div>
                </div>

                {/* Step 2: Supabase API Layer */}
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Planned
                    </span>
                    <Server className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Supabase API & Auth</h4>
                  <p className="text-xs text-slate-600">
                    PostgREST endpoints, Realtime WebSocket channel, and Supabase Auth with Row Level Security (RLS).
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-amber-800">
                    Status: Integration Pending
                  </div>
                </div>

                {/* Step 3: PostgreSQL Database */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Schema Ready
                    </span>
                    <Database className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">PostgreSQL Database</h4>
                  <p className="text-xs text-slate-600">
                    Structured tables for resources, bookings, condition reports, and immutable custody audit trails.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-emerald-800">
                    Status: Migration Script Prepared
                  </div>
                </div>
              </div>
            </div>

            {/* Planned Database Tables Card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Planned Relational Tables
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-mono font-bold text-slate-900">public.resources</div>
                  <div className="text-slate-500 text-[11px]">
                    Technical equipment, specifications, location, department, condition score, rules.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-mono font-bold text-slate-900">public.bookings</div>
                  <div className="text-slate-500 text-[11px]">
                    Reservation time windows, student ID, security PIN, approval status, custody state.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-mono font-bold text-slate-900">public.condition_reports</div>
                  <div className="text-slate-500 text-[11px]">
                    Check-in / return inspection ratings, damage logs, photo URLs, maintenance notes.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-mono font-bold text-slate-900">public.activity_logs</div>
                  <div className="text-slate-500 text-[11px]">
                    Immutable audit records for all booking, approval, handover, return, and quota events.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
