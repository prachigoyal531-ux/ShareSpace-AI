import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceStatus, Booking } from '../types';
import { FairShareSection } from '../components/dashboard/FairShareSection';
import { formatDateIST, formatTimeIST } from '../utils/formatters';
import {
  Sliders,
  PlusCircle,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  MapPin,
  Calendar,
  Layers,
  Building,
  Check,
  X,
  ShieldAlert,
  Search,
  Filter,
  UserCheck
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const {
    resources,
    currentUser,
    role,
    setCurrentPage,
    navigateToResource,
    bookings,
    approveBooking,
    rejectBooking,
    placeResourceInMaintenance,
    restoreResourceFromMaintenance
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'campus-overview' | 'managed-bookings' | 'my-bookings'>('inventory');

  // Maintenance modal / drawer state
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState<string>('Optical sensor realignment and periodic safety recalibration.');
  const [restoringResourceId, setRestoringResourceId] = useState<string | null>(null);
  const [restorationNotes, setRestorationNotes] = useState<string>('Bench testing complete. All safety interlocks verified and recalibrated.');

  // Campus search state
  const [campusSearch, setCampusSearch] = useState<string>('');
  const [campusCategory, setCampusCategory] = useState<string>('All');

  // Resources owned by current lab owner (Rahul Sharma or current user)
  const ownedResources = resources.filter(
    r => role === 'admin' || r.ownerName === currentUser.name || r.ownerEmail === currentUser.email || r.department.includes('Robotics') || r.department.includes('Engineering')
  );
  const ownedResourceIds = new Set(ownedResources.map(r => r.id));

  // Managed bookings (requests made for resources owned by this lab owner)
  const managedBookings = bookings.filter(b => ownedResourceIds.has(b.resourceId));

  // Personal bookings submitted by this lab owner for their own research/projects
  const myPersonalBookings = bookings.filter(b => b.userId === currentUser.id);

  // Filtered campus resources for Campus Overview
  const filteredCampusResources = resources.filter(r => {
    const matchesSearch = campusSearch === '' || 
      r.name.toLowerCase().includes(campusSearch.toLowerCase()) ||
      r.location.toLowerCase().includes(campusSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(campusSearch.toLowerCase());
    const matchesCategory = campusCategory === 'All' || r.category === campusCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resource Owner Console</h1>
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
              Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Poornima College of Engineering, Jaipur · Department asset custody, maintenance records, and reservation approvals
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('add-resource')}
          className="py-2 px-4 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New College Resource</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-700" />
          <span>Department Inventory & Maintenance</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200/70 rounded-full text-slate-700">
            {ownedResources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('campus-overview')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'campus-overview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-sky-700" />
          <span>Campus Overview</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200/70 rounded-full text-slate-700">
            {resources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('managed-bookings')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'managed-bookings' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-sky-700" />
          <span>Managed Equipment Reservations</span>
          {managedBookings.filter(b => b.status === 'Pending Approval').length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500 text-white rounded-full font-bold">
              {managedBookings.filter(b => b.status === 'Pending Approval').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'my-bookings' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-sky-700" />
          <span>My Bookings</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200/70 rounded-full text-slate-700">
            {myPersonalBookings.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Department Inventory & Maintenance Controls */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Overview Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Managed Resources</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{ownedResources.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Active in department pool</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">In Circulation (Active)</div>
              <div className="text-2xl font-bold text-amber-600 tabular-nums">
                {ownedResources.filter(r => r.status === 'In Use').length}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">Checked out to students</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Under Maintenance</div>
              <div className="text-2xl font-bold text-rose-600 tabular-nums">
                {ownedResources.filter(r => r.status === 'Maintenance').length}
              </div>
              <div className="text-[11px] text-rose-600 mt-1">Scheduled service bench</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 mb-1">Average Condition</div>
              <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                {Math.round(ownedResources.reduce((acc, r) => acc + r.conditionScore, 0) / (ownedResources.length || 1))}%
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">Inspected operational rating</div>
            </div>
          </div>

          {/* FairShare Allocation Console Section */}
          <FairShareSection />

          {/* Managed Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Department Inventory & Maintenance Logs</h2>
                <p className="text-xs text-slate-500">Take equipment offline for servicing with audit logging, or restore to Available after clearance</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{ownedResources.length} assets registered</span>
            </div>

            <div className="divide-y divide-slate-100">
              {ownedResources.map(res => {
                const isEditing = editingResourceId === res.id;
                const isRestoring = restoringResourceId === res.id;

                return (
                  <div key={res.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-900">{res.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{res.location}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-400">Total Checkouts: {res.totalUsageCount}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => navigateToResource(res.id, 'owner-dashboard')}
                            className="text-sm font-bold text-slate-900 hover:text-sky-700 cursor-pointer"
                          >
                            {res.name}
                          </h3>

                          {res.status === 'Available' ? (
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Available
                            </span>
                          ) : res.status === 'Maintenance' ? (
                            <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Wrench className="w-3 h-3" />
                              Under Maintenance
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                              {res.status}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                          <span>Condition Rating: <strong className="font-mono">{res.conditionScore}/100</strong></span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{res.currentConditionNotes}</span>
                        </div>

                        {res.status === 'Maintenance' && res.maintenanceReason && (
                          <div className="p-2.5 bg-rose-50/80 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-0.5 mt-2">
                            <div className="font-semibold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Maintenance Reason:</span>
                              <span className="font-normal">{res.maintenanceReason}</span>
                            </div>
                            <div className="text-[11px] text-rose-700">
                              Initiated by: {res.maintenanceInitiatedBy || 'Lab In-Charge'} · {res.maintenanceInitiatedAt ? formatTimeIST(res.maintenanceInitiatedAt) + ' ' + formatDateIST(res.maintenanceInitiatedAt) : 'Recently logged'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Status Switcher Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => navigateToResource(res.id, 'owner-dashboard')}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details & Schedule"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick status button */}
                        {res.status === 'Available' ? (
                          <button
                            onClick={() => {
                              setEditingResourceId(isEditing ? null : res.id);
                              setRestoringResourceId(null);
                            }}
                            className="py-1 px-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Place in Maintenance</span>
                          </button>
                        ) : res.status === 'Maintenance' ? (
                          <button
                            onClick={() => {
                              setRestoringResourceId(isRestoring ? null : res.id);
                              setEditingResourceId(null);
                            }}
                            className="py-1 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Restore to Available</span>
                          </button>
                        ) : (
                          <span className="py-1 px-2.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                            {res.status} (In Loan)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Place in Maintenance Drawer */}
                    {isEditing && (
                      <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">
                          Enter mandatory service reason for taking <span className="font-semibold text-rose-900">{res.name}</span> offline:
                        </label>
                        <input
                          type="text"
                          value={maintenanceReason}
                          onChange={e => setMaintenanceReason(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g., Firmware upgrade, laser collimation, broken lens cap, safety testing..."
                        />
                        <div className="text-[11px] text-slate-500">
                          Notice: Equipment will be marked unavailable for new bookings. Existing approved bookings remain recorded.
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingResourceId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              placeResourceInMaintenance(res.id, maintenanceReason);
                              setEditingResourceId(null);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded"
                          >
                            Confirm Service Lockdown
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Restore to Available Drawer */}
                    {isRestoring && (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">
                          Enter service clearance notes for restoring <span className="font-semibold text-emerald-900">{res.name}</span>:
                        </label>
                        <input
                          type="text"
                          value={restorationNotes}
                          onChange={e => setRestorationNotes(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., Optical alignment calibrated, nozzle replaced, passed diagnostic benchmark..."
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setRestoringResourceId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              restoreResourceFromMaintenance(res.id, restorationNotes);
                              setRestoringResourceId(null);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded"
                          >
                            Restore to Circulation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Campus Overview */}
      {activeTab === 'campus-overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Campus Overview – All PCE Technical Resources</h2>
                <p className="text-xs text-slate-500">Live operational visibility across all departments and laboratory assets in Poornima College of Engineering, Jaipur</p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={campusSearch}
                    onChange={e => setCampusSearch(e.target.value)}
                    placeholder="Search resources, labs..."
                    className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 w-48"
                  />
                </div>

                <select
                  value={campusCategory}
                  onChange={e => setCampusCategory(e.target.value)}
                  className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Laboratories">Laboratories</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Projectors">Projectors</option>
                  <option value="3D Printers">3D Printers</option>
                  <option value="Seminar Rooms">Seminar Rooms</option>
                </select>
              </div>
            </div>

            {/* Resources Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Resource & Asset Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Department & Location</th>
                    <th className="py-2.5 px-3">Condition Rating</th>
                    <th className="py-2.5 px-3">Current Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCampusResources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{res.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {res.id}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {res.category}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{res.department}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{res.location}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{res.conditionScore}/100</span>
                      </td>
                      <td className="py-3 px-3">
                        {res.status === 'Available' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Available
                          </span>
                        ) : res.status === 'In Use' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            In Use (Loan)
                          </span>
                        ) : res.status === 'Reserved' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            Reserved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Maintenance
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigateToResource(res.id, 'owner-dashboard')}
                          className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
                        >
                          View Schedule →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Managed Equipment Reservations (Incoming Student Bookings) */}
      {activeTab === 'managed-bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Managed Equipment Reservations</h2>
                <p className="text-xs text-slate-500">
                  Review booking requests, check-in custody status, and sign-offs for resources under your supervision
                </p>
              </div>
              <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-lg">
                {managedBookings.length} Total Records
              </span>
            </div>

            {managedBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No reservation requests logged for your managed department assets.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {managedBookings.map(b => {
                  const res = resources.find(r => r.id === b.resourceId);
                  const isOwnerSelfBooking = b.userId === currentUser.id;

                  return (
                    <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{res?.name || b.resourceId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            b.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.status === 'Checked In' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            b.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold' :
                            b.status === 'Waitlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {b.status}
                          </span>

                          {b.isInstitutionalOverride && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              Institutional Priority
                            </span>
                          )}
                        </div>

                        <div className="text-slate-600 flex items-center gap-2">
                          <span>Applicant: <strong className="text-slate-800">{b.userName}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Slot: {formatDateIST(b.startTime)} ({formatTimeIST(b.startTime)} - {formatTimeIST(b.endTime)})</span>
                        </div>

                        <div className="text-slate-500">
                          Purpose: {b.purpose} {b.projectType && `(${b.projectType})`}
                        </div>

                        {isOwnerSelfBooking && (
                          <div className="text-[11px] text-amber-700 font-medium">
                            Note: This is your personal reservation. Under institutional custody separation policy, Lab Owners cannot approve their own bookings.
                          </div>
                        )}
                      </div>

                      {/* Approval / Rejection Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {b.status === 'Pending Approval' && (
                          <>
                            {isOwnerSelfBooking ? (
                              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                Pending Central Admin Approval
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => approveBooking(b.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve Request</span>
                                </button>
                                <button
                                  onClick={() => rejectBooking(b.id, 'Slot conflict or maintenance schedule.')}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => navigateToResource(b.resourceId, 'owner-dashboard')}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 text-xs"
                        >
                          View Schedule
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: My Bookings (Personal bookings made by Rahul Sharma) */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">My Personal Bookings</h2>
                <p className="text-xs text-slate-500">
                  Equipment and laboratory reservations submitted by you ({currentUser.name}) for research, teaching, and departmental projects
                </p>
              </div>
              <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-lg">
                {myPersonalBookings.length} Personal Bookings
              </span>
            </div>

            {myPersonalBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                You currently have no personal equipment reservations booked.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myPersonalBookings.map(b => {
                  const res = resources.find(r => r.id === b.resourceId);
                  return (
                    <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{res?.name || b.resourceId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            b.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.status === 'Checked In' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            b.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="text-slate-600 flex items-center gap-2">
                          <span>Slot: {formatDateIST(b.startTime)} ({formatTimeIST(b.startTime)} - {formatTimeIST(b.endTime)})</span>
                          <span aria-hidden="true">·</span>
                          <span>Security PIN: <code className="font-mono bg-slate-100 px-1 py-0.2 rounded font-bold text-slate-800">{b.checkInVerificationCode}</code></span>
                        </div>

                        <div className="text-slate-500">
                          Purpose: {b.purpose}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => navigateToResource(b.resourceId, 'owner-dashboard')}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 text-xs"
                        >
                          View Resource Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
