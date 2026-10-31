import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppPage } from '../../types';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  ClipboardList,
  ShieldAlert,
  PlusCircle,
  ScanLine,
  History,
  UserCircle,
  BarChart3,
  Sliders,
  Info,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    bookings,
    conditionReports,
    resources,
    role,
    currentUser,
    logout,
    canAccessPage
  } = useApp();

  // Role-based pending booking requests count
  const pendingRequestsCount = role === 'student'
    ? 0
    : role === 'owner'
    ? bookings.filter(b => {
        const isManaged = resources.some(
          r => r.id === b.resourceId &&
          (r.ownerName === currentUser.name || r.ownerEmail === currentUser.email || r.department === currentUser.department)
        );
        return isManaged && b.status === 'Pending Approval';
      }).length
    : bookings.filter(b => b.status === 'Pending Approval').length;

  // Requirement 13: Check-in / Check-out badge reflects actual pending action count for logged-in user
  let checkInOutBadgeCount = 0;
  if (role === 'student') {
    const awaitingCheckIn = bookings.filter(b => b.userId === currentUser.id && b.status === 'Approved').length;
    const awaitingReturn = bookings.filter(b => b.userId === currentUser.id && b.status === 'Checked In').length;
    checkInOutBadgeCount = awaitingCheckIn + awaitingReturn;
  } else if (role === 'owner') {
    const managedResourceIds = new Set(
      resources
        .filter(r => r.ownerName === currentUser.name || r.ownerEmail === currentUser.email || r.department === currentUser.department)
        .map(r => r.id)
    );
    const pendingHandovers = bookings.filter(b => managedResourceIds.has(b.resourceId) && b.status === 'Approved').length;
    const pendingReturns = bookings.filter(b => managedResourceIds.has(b.resourceId) && b.status === 'Checked In').length;
    checkInOutBadgeCount = pendingHandovers + pendingReturns;
  } else if (role === 'admin') {
    // Admin investigates incident/dispute reports requiring review (no routine handovers)
    checkInOutBadgeCount = conditionReports.filter(r => r.status !== 'Resolved').length;
  }

  const openReportsCount = conditionReports.filter(r => r.status !== 'Resolved').length;

  interface NavItem {
    id: AppPage;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  // Base navigation lists (Requirement 6: Rename to My Bookings for owner)
  const studentMain: NavItem[] = [
    { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Resources', icon: <Compass className="w-4 h-4" /> },
    { id: 'my-bookings', label: 'My Bookings', icon: <CalendarCheck className="w-4 h-4" /> }
  ];

  const ownerMain: NavItem[] = [
    { id: 'owner-dashboard', label: 'Owner Overview', icon: <Sliders className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore All Labs', icon: <Compass className="w-4 h-4" /> },
    { id: 'my-bookings', label: 'My Bookings', icon: <CalendarCheck className="w-4 h-4" /> }
  ];

  const adminMain: NavItem[] = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'owner-dashboard', label: 'Owner View', icon: <Sliders className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Resources', icon: <Compass className="w-4 h-4" /> },
    { id: 'my-bookings', label: 'All Campus Bookings', icon: <CalendarCheck className="w-4 h-4" /> }
  ];

  const operationsCandidates: NavItem[] = [
    {
      id: 'booking-requests',
      label: 'Booking Requests',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'add-resource', label: 'Add New Resource', icon: <PlusCircle className="w-4 h-4" /> },
    {
      id: 'checkin-checkout',
      label: 'Check-in / Check-out',
      icon: <ScanLine className="w-4 h-4" />,
      badge: checkInOutBadgeCount > 0 ? checkInOutBadgeCount : undefined,
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'condition-reports',
      label: 'Condition & Incidents',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: openReportsCount > 0 ? openReportsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  const governanceCandidates: NavItem[] = [
    { id: 'activity-history', label: 'Activity History', icon: <History className="w-4 h-4" /> },
    { id: 'profile', label: 'User Profile & Rules', icon: <UserCircle className="w-4 h-4" /> }
  ];

  // Role-filtered groups
  const mainNav = (role === 'admin' ? adminMain : role === 'owner' ? ownerMain : studentMain)
    .filter(item => canAccessPage(item.id));

  const operationsNav = operationsCandidates.filter(item => canAccessPage(item.id));
  const governanceNav = governanceCandidates.filter(item => canAccessPage(item.id));

  const renderNavGroup = (title: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1 mb-5">
        <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          {title}
        </div>
        {items.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-sky-50 text-sky-900 font-bold border border-sky-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-sky-700' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'student':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'owner':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'admin':
        return 'text-amber-800 bg-amber-50 border-amber-200';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-4">
      <div>
        {/* Role & Session Indicator Card */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Session
          </div>
          <div className="font-bold text-slate-900 mt-0.5 truncate">{currentUser.name}</div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border font-mono ${getRoleBadgeStyle()}`}>
              {role}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentUser.studentOrEmployeeId}
            </span>
          </div>
        </div>

        {renderNavGroup('Resource Core', mainNav)}
        {renderNavGroup('Operations & Custody', operationsNav)}
        {renderNavGroup('Governance & Account', governanceNav)}
      </div>

      {/* Footer Area: Logout & Demo Disclaimer */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        {/* Explicit Visible Logout Button in Sidebar */}
        <button
          onClick={logout}
          className="w-full py-2 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout ({currentUser.name.split(' ')[0]})</span>
        </button>

        {/* Institution Demonstration Card */}
        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 leading-snug">
          <strong className="block font-semibold mb-0.5">Demonstration Environment</strong>
          Nexora University, Jaipur. Role-based demo accounts active.
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>IST (UTC+5:30) · ₹ Active</span>
        </div>
      </div>
    </aside>
  );
};

