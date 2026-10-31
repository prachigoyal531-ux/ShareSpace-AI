import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Resource,
  Booking,
  ConditionReport,
  ActivityLog,
  AppPage,
  ResourceCategory,
  ResourceStatus,
  BookingStatus
} from '../types';
import {
  mockStudentProfiles,
  mockUsers,
  initialResources,
  initialBookings,
  initialConditionReports,
  initialActivityLogs
} from '../data/mockData';
import {
  authenticateUser,
  getStoredSession,
  saveSession,
  clearSession,
  StoredSession,
  isPageAllowedForRole,
  getDefaultPageForRole,
  DEMO_CREDENTIALS,
  getAllAvailableAccounts
} from '../services/authService';
import { rankRequestsByFairShare, evaluateEligibility, FairShareEvaluation } from '../services/fairShareEngine';

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  activeSession: StoredSession | null;
  login: (loginId: string, pass: string) => { success: boolean; message?: string; targetPage?: AppPage };
  logout: () => void;
  canAccessPage: (page: AppPage) => boolean;
  switchDemoRole: (role: UserRole) => void;
  switchUserAccount: (loginId: string) => void;

  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  resources: Resource[];
  bookings: Booking[];
  conditionReports: ConditionReport[];
  activityLogs: ActivityLog[];
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  selectedResourceId: string | null;
  setSelectedResourceId: (id: string | null) => void;
  bookingModalResource: Resource | null;
  setBookingModalResource: (resource: Resource | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  
  // Navigation context
  resourceReturnPage: AppPage;
  navigateToResource: (id: string, fromPage?: AppPage) => void;

  // Fair Usage Quota Settings
  maxActiveBookingsPerStudent: number;
  updateStudentQuotaSetting: (newQuota: number) => void;

  // Actions
  submitBooking: (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    projectType: string;
    isInstitutionalOverride?: boolean;
    institutionalPurpose?: string;
  }) => { success: boolean; message: string; bookingId?: string };
  
  joinWaitlist: (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    projectType: string;
  }) => { success: boolean; message: string };
  
  approveBooking: (bookingId: string, notes?: string) => { success: boolean; message: string };
  rejectBooking: (bookingId: string, notes?: string) => void;
  cancelBooking: (bookingId: string) => void;
  
  performCheckIn: (
    bookingId: string,
    pin: string,
    preConditionNotes: string,
    preCheckPhotoUrl?: string
  ) => { success: boolean; message: string };
  
  performCheckOut: (
    bookingId: string,
    postConditionNotes: string,
    postCheckPhotoUrl?: string,
    incidentReport?: {
      severity: 'Low' | 'Medium' | 'High' | 'Critical';
      description: string;
    }
  ) => { success: boolean; message: string };
  
  addConditionReport: (report: Omit<ConditionReport, 'id' | 'createdAt'>) => void;
  addResource: (resourceData: Omit<Resource, 'id' | 'createdAt' | 'totalUsageCount' | 'conditionScore' | 'currentConditionNotes'>) => void;
  updateResourceStatus: (id: string, status: ResourceStatus, notes?: string) => void;
  placeResourceInMaintenance: (resourceId: string, reason: string) => void;
  restoreResourceFromMaintenance: (resourceId: string, restorationNotes: string) => void;
  resetDemoData: () => void;

  // FairShare Demo Scenario
  loadFairShareDemoScenario: () => void;
  executeFairShareBatchAllocation: (resourceId: string) => { success: boolean; message: string; approvedStudent?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_RESOURCES = 'sharespace_resources_v2';
const STORAGE_KEY_BOOKINGS = 'sharespace_bookings_v2';
const STORAGE_KEY_REPORTS = 'sharespace_reports_v2';
const STORAGE_KEY_LOGS = 'sharespace_logs_v2';
const STORAGE_KEY_PAGE = 'sharespace_current_page_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session State
  const [activeSession, setActiveSession] = useState<StoredSession | null>(() => {
    return getStoredSession();
  });

  const isAuthenticated = Boolean(activeSession && activeSession.user);

  // Derive role and currentUser directly from authenticated session
  const role: UserRole = activeSession?.role || 'student';
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return activeSession?.user || mockUsers.student;
  });

  // Sync currentUser with activeSession changes
  useEffect(() => {
    if (activeSession?.user) {
      setCurrentUser(activeSession.user);
    }
  }, [activeSession]);

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      if (activeSession) {
        const updatedSession = { ...activeSession, user: updated };
        setActiveSession(updatedSession);
        localStorage.setItem('sharespace_auth_session_v2', JSON.stringify(updatedSession));
      }
      return updated;
    });
  };

  // Resources
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESOURCES);
      return saved ? JSON.parse(saved) : initialResources;
    } catch {
      return initialResources;
    }
  });

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  // Condition Reports
  const [conditionReports, setConditionReports] = useState<ConditionReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : initialConditionReports;
    } catch {
      return initialConditionReports;
    }
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      return saved ? JSON.parse(saved) : initialActivityLogs;
    } catch {
      return initialActivityLogs;
    }
  });

  // Navigation & Modals
  const [currentPage, setCurrentPageState] = useState<AppPage>(() => {
    const session = getStoredSession();
    if (!session) return 'login';
    const saved = localStorage.getItem(STORAGE_KEY_PAGE) as AppPage;
    if (saved && saved !== 'login' && isPageAllowedForRole(session.role, saved)) {
      return saved;
    }
    return getDefaultPageForRole(session.role);
  });

  const setCurrentPage = (page: AppPage) => {
    setCurrentPageState(page);
    if (page !== 'login') {
      localStorage.setItem(STORAGE_KEY_PAGE, page);
    }
  };

  // Login implementation
  const login = (loginId: string, pass: string) => {
    const res = authenticateUser(loginId, pass);
    if (!res.success || !res.session) {
      return { success: false, message: res.message || 'Invalid credentials' };
    }

    setActiveSession(res.session);
    setCurrentUser(res.session.user);
    const destination = getDefaultPageForRole(res.session.role);
    setCurrentPage(destination);

    // Audit log
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: res.session.user.name,
      actorRole: res.session.role,
      action: 'Session Authenticated',
      target: 'ShareSpace Portal',
      details: `${res.session.user.name} logged in with ${res.session.role.toUpperCase()} privileges (${res.session.loginId}).`,
      category: 'system'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    return { success: true, targetPage: destination };
  };

  // Logout implementation
  const logout = () => {
    const prevUser = currentUser;
    const prevRole = role;
    clearSession();
    setActiveSession(null);
    setCurrentPage('login');

    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: prevUser.name,
      actorRole: prevRole,
      action: 'Session Terminated',
      target: 'ShareSpace Portal',
      details: `${prevUser.name} signed out securely from the demonstration portal.`,
      category: 'system'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Quick switch between accounts
  const switchUserAccount = (targetLoginId: string) => {
    const allAccounts = getAllAvailableAccounts();
    const target = allAccounts.find(
      acc => acc.loginId.toUpperCase() === targetLoginId.toUpperCase()
    );
    if (target) {
      const session = saveSession(target);
      setActiveSession(session);
      setCurrentUser(session.user);
      const destination = getDefaultPageForRole(target.role);
      setCurrentPage(destination);

      logActivity(
        'Switched User Identity',
        'Authentication Engine',
        `Switched session to ${target.name} (${target.loginId}, Role: ${target.role}).`,
        'system'
      );
    }
  };

  // Helper for quick demo role switching with credentials
  const switchDemoRole = (newRole: UserRole) => {
    const target = DEMO_CREDENTIALS.find(d => d.role === newRole);
    if (target) {
      switchUserAccount(target.loginId);
    }
  };

  const setRole = (newRole: UserRole) => {
    switchDemoRole(newRole);
  };

  const canAccessPage = (page: AppPage): boolean => {
    if (!isAuthenticated) return page === 'login';
    return isPageAllowedForRole(role, page);
  };

  const [selectedResourceId, setSelectedResourceId] = useState<string | null>('CAM001');
  const [resourceReturnPage, setResourceReturnPage] = useState<AppPage>('explore');
  const [bookingModalResource, setBookingModalResource] = useState<Resource | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Fair Usage Quota for students (Configurable by Admin)
  const [maxActiveBookingsPerStudent, setMaxActiveBookingsPerStudent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sharespace_max_student_quota');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const updateStudentQuotaSetting = (newQuota: number) => {
    const valid = Math.max(1, Math.min(10, newQuota));
    setMaxActiveBookingsPerStudent(valid);
    localStorage.setItem('sharespace_max_student_quota', valid.toString());
    logActivity(
      'Updated Campus Fair Usage Policy',
      'Central Student Quota Configuration',
      `Max simultaneous active reservations per student updated to ${valid} slots.`,
      'system'
    );
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(conditionReports));
  }, [conditionReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Helper: log activity
  const logActivity = (
    action: string,
    target: string,
    details: string,
    category: ActivityLog['category'],
    bookingId?: string,
    resourceId?: string
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: role,
      action,
      target,
      details,
      category,
      bookingId,
      resourceId
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const navigateToResource = (id: string, fromPage?: AppPage) => {
    setSelectedResourceId(id);
    const origin = fromPage || currentPage || 'explore';
    setResourceReturnPage(origin);
    setCurrentPage('resource-details');
  };

  // Check scheduling overlap for a physical unit
  const checkTimeOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();
    return aStart < bEnd && aEnd > bStart;
  };

  // Submit Booking
  const submitBooking = (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    projectType: string;
    isInstitutionalOverride?: boolean;
    institutionalPurpose?: string;
  }) => {
    const res = resources.find(r => r.id === data.resourceId);
    if (!res) {
      return { success: false, message: 'Resource not found.' };
    }

    // Maintenance check
    if (res.status === 'Maintenance') {
      return {
        success: false,
        message: `Resource Unavailable: ${res.name} (${res.id}) is offline for maintenance (${res.maintenanceReason || res.currentConditionNotes}). New reservations are blocked.`
      };
    }

    // Duplicate booking detection for the same user on overlapping slot
    const isDuplicate = bookings.some(
      b =>
        b.userId === currentUser.id &&
        b.resourceId === res.id &&
        ['Pending Approval', 'Approved', 'Waitlisted', 'Checked In'].includes(b.status) &&
        checkTimeOverlap(b.startTime, b.endTime, data.startTime, data.endTime)
    );

    if (isDuplicate) {
      return {
        success: false,
        message: `Duplicate Request Detected: You already have an active or pending reservation for ${res.name} during this requested time slot.`
      };
    }

    // Role-based restrictions: Student active bookings limit
    if (role === 'student') {
      // ONLY approved and active (Checked In) bookings count toward quota
      const activeUserBookings = bookings.filter(
        b => b.userId === currentUser.id && ['Approved', 'Checked In'].includes(b.status)
      );
      if (activeUserBookings.length >= maxActiveBookingsPerStudent) {
        return {
          success: false,
          message: `Fair Usage Limit Reached: You currently have ${activeUserBookings.length} of ${maxActiveBookingsPerStudent} active reservations (approved or checked-in). Return equipment or await completion before booking additional resources.`
        };
      }
    }

    // Determine Institutional Priority Tier
    // Tier 1: Authorised Administrator institutional mandate
    // Tier 2: Authorised Lab Owner departmental operations mandate
    // Tier 3: Standard Student FairShare / Personal borrowing
    const isInstitutional = Boolean(
      data.isInstitutionalOverride && data.institutionalPurpose?.trim() && role !== 'student'
    );

    let priorityTier = 3;
    if (isInstitutional) {
      if (role === 'admin') priorityTier = 1;
      else if (role === 'owner') priorityTier = 2;
    }

    // Find conflicting bookings on the exact same unit ID for the requested time slot
    const conflictingBookings = bookings.filter(
      b =>
        b.resourceId === res.id &&
        ['Pending Approval', 'Approved', 'Checked In'].includes(b.status) &&
        checkTimeOverlap(b.startTime, b.endTime, data.startTime, data.endTime)
    );

    const pin = `CHK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBookingId = `bk-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Evaluate conflicts and priority rules
    if (conflictingBookings.length > 0) {
      // Check if any conflicting booking is already physically Checked In
      const isPhysicallyInUse = conflictingBookings.some(b => b.status === 'Checked In');

      // Check min priority tier among conflicting bookings
      const lowestCompetingTier = Math.min(...conflictingBookings.map(b => b.priorityTier || 3));

      // Higher priority institutional request can displace future Pending or Approved reservations (if not physically checked in)
      if (!isPhysicallyInUse && isInstitutional && priorityTier < lowestCompetingTier) {
        // Displace lower-priority bookings to Waitlisted
        setBookings(prev =>
          prev.map(b => {
            if (conflictingBookings.some(cb => cb.id === b.id)) {
              return {
                ...b,
                status: 'Waitlisted' as BookingStatus,
                queuePosition: 1,
                ownerNotes: `Displaced by Authorised Institutional Requirement (Tier ${priorityTier} Override: ${data.institutionalPurpose || 'University Operational Necessity'}). Enrolled in priority waiting list.`
              };
            }
            return b;
          })
        );

        // Record Priority Override Audit Log
        logActivity(
          'Institutional Priority Override Applied',
          res.name,
          `Authorised ${role.toUpperCase()} institutional mandate [${data.institutionalPurpose}] (Tier ${priorityTier}) superseded lower-priority reservation(s) on ${res.id}. Conflicting booking(s) moved to waiting list.`,
          'approval',
          newBookingId,
          res.id
        );

        const autoNotes = role === 'admin'
          ? `System Auto-Approved: Authorised Central Admin Institutional Requirement (${data.institutionalPurpose})`
          : `System Auto-Approved: Authorised Lab Owner Institutional Requirement (${data.institutionalPurpose})`;

        const priorityBooking: Booking = {
          id: newBookingId,
          resourceId: res.id,
          resourceName: res.name,
          resourceCategory: res.category,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: role,
          userEmail: currentUser.email,
          userDepartment: currentUser.department,
          startTime: data.startTime,
          endTime: data.endTime,
          purpose: data.purpose,
          projectType: data.projectType || 'Institutional Academic Operations',
          status: 'Approved',
          ownerNotes: autoNotes,
          checkInVerificationCode: pin,
          isInstitutionalOverride: true,
          institutionalPurpose: data.institutionalPurpose,
          priorityTier,
          createdAt: new Date().toISOString()
        };

        setBookings(prev => [priorityBooking, ...prev]);

        setResources(prev =>
          prev.map(r => (r.id === res.id ? { ...r, status: 'Reserved' } : r))
        );

        logActivity(
          'System Auto-Approved Institutional Booking',
          res.name,
          `Authorised ${role.toUpperCase()} institutional mandate [${data.institutionalPurpose}] (Tier ${priorityTier}) automatically approved on ${res.name} (${res.id}). Method: System Auto-Approved. Reason: Priority Override.`,
          'approval',
          newBookingId,
          res.id
        );

        return {
          success: true,
          message: `System Auto-Approved: Your institutional request for ${res.name} (${res.id}) has been automatically approved (Tier ${priorityTier} Mandate). Lower-priority reservation moved to waiting list. Verification PIN: ${pin}`,
          bookingId: newBookingId
        };
      }

      // Slot is occupied and new request has equal or lower priority: place on Waitlist
      const currentWaitlistCount = bookings.filter(
        b => b.resourceId === res.id && b.status === 'Waitlisted'
      ).length;

      const waitlistBooking: Booking = {
        id: newBookingId,
        resourceId: res.id,
        resourceName: res.name,
        resourceCategory: res.category,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: role,
        userEmail: currentUser.email,
        userDepartment: currentUser.department,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        projectType: data.projectType || 'Academic Research',
        status: 'Waitlisted',
        queuePosition: currentWaitlistCount + 1,
        checkInVerificationCode: pin,
        isInstitutionalOverride: isInstitutional,
        institutionalPurpose: data.institutionalPurpose,
        priorityTier,
        createdAt: new Date().toISOString()
      };

      setBookings(prev => [waitlistBooking, ...prev]);

      logActivity(
        'Queued on Waiting List (Slot Busy)',
        res.name,
        `Added to waitlist position #${waitlistBooking.queuePosition} for ${res.id} by ${currentUser.name} (${role.toUpperCase()}) due to time-slot overlap with active booking ${conflictingBookings[0].id}.`,
        'booking',
        newBookingId,
        res.id
      );

      return {
        success: true,
        message: `Resource Slot Contested: ${res.name} (${res.id}) already has an active reservation for this timeslot. Your request has been queued on the Waiting List at Position #${waitlistBooking.queuePosition}.`,
        bookingId: newBookingId
      };
    }

    // No conflict on requested time slot: proceed with normal booking or institutional auto-approval
    let status: BookingStatus = res.requiresApproval ? 'Pending Approval' : 'Approved';
    let ownerNotes: string | undefined = undefined;

    if (isInstitutional) {
      status = 'Approved';
      ownerNotes = role === 'admin'
        ? `System Auto-Approved: Authorised Central Admin Institutional Requirement (${data.institutionalPurpose})`
        : `System Auto-Approved: Authorised Lab Owner Institutional Requirement (${data.institutionalPurpose})`;
    }

    const newBooking: Booking = {
      id: newBookingId,
      resourceId: res.id,
      resourceName: res.name,
      resourceCategory: res.category,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: role,
      userEmail: currentUser.email,
      userDepartment: currentUser.department,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      projectType: data.projectType || 'Academic Research',
      status,
      ownerNotes,
      checkInVerificationCode: pin,
      isInstitutionalOverride: isInstitutional,
      institutionalPurpose: data.institutionalPurpose,
      priorityTier,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    if (status === 'Approved') {
      setResources(prev =>
        prev.map(r => (r.id === res.id ? { ...r, status: 'Reserved' } : r))
      );
    }

    if (isInstitutional) {
      logActivity(
        'System Auto-Approved Institutional Booking',
        res.name,
        `Authorised ${role.toUpperCase()} institutional mandate [${data.institutionalPurpose}] (Tier ${priorityTier}) automatically approved on ${res.name} (${res.id}). Method: System Auto-Approved.`,
        'approval',
        newBookingId,
        res.id
      );
    } else {
      logActivity(
        status === 'Approved' ? 'Created Instant Booking' : 'Submitted Booking Request',
        res.name,
        `Requested for ${new Date(data.startTime).toLocaleDateString()} by ${currentUser.name} (${role.toUpperCase()}).`,
        'booking',
        newBookingId,
        res.id
      );
    }

    return {
      success: true,
      message: isInstitutional
        ? `System Auto-Approved: Authorised ${role === 'admin' ? 'Central Admin' : 'Lab Owner'} Institutional Requirement confirmed! Verification PIN: ${pin}`
        : res.requiresApproval
        ? `Booking request successfully submitted as Pending Approval! Available in approval ledger for review.`
        : `Booking confirmed instantly! Use verification PIN ${pin} upon collection.`,
      bookingId: newBookingId
    };
  };

  // Join Waitlist
  const joinWaitlist = (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    projectType: string;
  }) => {
    const res = resources.find(r => r.id === data.resourceId);
    if (!res) return { success: false, message: 'Resource not found' };

    const currentWaitlistCount = bookings.filter(
      b => b.resourceId === res.id && b.status === 'Waitlisted'
    ).length;

    const newBooking: Booking = {
      id: `bk-wait-${Date.now().toString().slice(-5)}`,
      resourceId: res.id,
      resourceName: res.name,
      resourceCategory: res.category,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: role,
      userEmail: currentUser.email,
      userDepartment: currentUser.department,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      projectType: data.projectType,
      status: 'Waitlisted',
      queuePosition: currentWaitlistCount + 1,
      checkInVerificationCode: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    logActivity(
      'Joined Waiting List',
      res.name,
      `Position #${newBooking.queuePosition} for ${new Date(data.startTime).toLocaleDateString()} by ${currentUser.name}`,
      'booking',
      newBooking.id,
      res.id
    );

    return {
      success: true,
      message: `Added to waiting list as position #${newBooking.queuePosition}. You will be automatically notified if an opening arises.`
    };
  };

  // Approve Booking (Only Lab Owner or Admin governance)
  const approveBooking = (bookingId: string, notes?: string): { success: boolean; message: string } => {
    if (role === 'student') {
      return {
        success: false,
        message: 'RBAC Access Denied: Students cannot approve booking requests.'
      };
    }

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    // Prevent Owner or Administrator from self-approving their own personal or operational reservation
    if (booking.userId === currentUser.id) {
      return {
        success: false,
        message: role === 'owner'
          ? 'Institutional Separation Policy: Lab Owners cannot approve their own reservations. An Administrator or independent designated faculty member must review and authorize this request.'
          : 'Institutional Separation Policy: Administrators cannot self-approve their own booking requests. Independent verification by the resource lab in-charge or an alternate administrator is required.'
      };
    }

    // For Lab Owner: verify resource is assigned to their custody
    if (role === 'owner') {
      const isAssigned = resources.some(
        r => r.id === booking.resourceId &&
        (r.ownerName === currentUser.name || r.ownerEmail === currentUser.email || r.department === currentUser.department || r.department.includes('Mechanical') || r.department.includes('Robotics') || r.department.includes('Engineering'))
      );
      if (!isAssigned) {
        return {
          success: false,
          message: 'Custody Scope Restriction: Lab Owners can only approve reservations for resources assigned to their department.'
        };
      }
    }

    // Prevent approving if there is an overlapping approved booking on the exact unit
    const clash = bookings.find(
      b =>
        b.id !== bookingId &&
        b.resourceId === booking.resourceId &&
        ['Approved', 'Checked In'].includes(b.status) &&
        checkTimeOverlap(b.startTime, b.endTime, booking.startTime, booking.endTime)
    );

    if (clash) {
      return {
        success: false,
        message: `Scheduling Conflict: ${booking.resourceName} already has an active reservation (${clash.id}) for this time slot.`
      };
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, status: 'Approved', ownerNotes: notes || `Approved by ${currentUser.name}.` }
          : b
      )
    );

    setResources(prev =>
      prev.map(r => (r.id === booking.resourceId ? { ...r, status: 'Reserved' } : r))
    );

    logActivity(
      'Approved Booking Request',
      booking.resourceName,
      `Approved request from ${booking.userName} by ${currentUser.name}. Verification PIN activated.`,
      'approval',
      booking.id,
      booking.resourceId
    );

    return {
      success: true,
      message: `Booking ${booking.id} approved! ${booking.userName} can now check in with their PIN.`
    };
  };

  // Reject Booking
  const rejectBooking = (bookingId: string, notes?: string) => {
    if (role === 'student') return;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, status: 'Rejected', ownerNotes: notes || 'Scheduling conflict or prerequisite criteria not met.' }
          : b
      )
    );

    logActivity(
      'Rejected Booking Request',
      booking.resourceName,
      `Rejected request from ${booking.userName}. Reason: ${notes || 'Criteria not met.'}`,
      'approval',
      booking.id,
      booking.resourceId
    );
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Student can only cancel their own bookings
    if (role === 'student' && booking.userId !== currentUser.id) {
      return;
    }

    // 1. Mark booking as Cancelled in updated state list
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Cancelled' as BookingStatus } : b
    );

    // 2. Check if any other active reservation exists for this resource
    const remainingActiveForResource = updatedBookings.some(
      b =>
        b.resourceId === booking.resourceId &&
        ['Approved', 'Checked In'].includes(b.status)
    );

    // If no remaining active reservations on this resource, set status to Available
    if (!remainingActiveForResource) {
      setResources(prev =>
        prev.map(r =>
          r.id === booking.resourceId && (r.status === 'Reserved' || r.status === 'In Use')
            ? { ...r, status: 'Available' }
            : r
        )
      );
    }

    // 3. Reconsider waitlisted requests if slot is now free
    const res = resources.find(r => r.id === booking.resourceId);
    const waitlistedBookings = updatedBookings
      .filter(b => b.resourceId === booking.resourceId && b.status === 'Waitlisted');

    // Find waitlisted candidates whose time slots do NOT conflict with any remaining active booking
    const freeWaitlisted = waitlistedBookings.filter(w => {
      const hasActiveConflict = updatedBookings.some(
        activeB =>
          activeB.id !== w.id &&
          activeB.id !== bookingId &&
          activeB.resourceId === w.resourceId &&
          ['Pending Approval', 'Approved', 'Checked In'].includes(activeB.status) &&
          checkTimeOverlap(activeB.startTime, activeB.endTime, w.startTime, w.endTime)
      );
      return !hasActiveConflict;
    });

    if (freeWaitlisted.length > 0 && res) {
      const userProfilesMap: Record<string, UserProfile> = {};
      getAllAvailableAccounts().forEach(acc => {
        userProfilesMap[acc.id] = acc.userProfile;
      });
      userProfilesMap[currentUser.id] = currentUser;

      const rankedCandidates = rankRequestsByFairShare(freeWaitlisted, res, updatedBookings, userProfilesMap);
      const rank1Candidate = rankedCandidates.find(rc => rc.priorityRank === 1 && rc.isEligible);

      if (rank1Candidate) {
        const candidateBooking = freeWaitlisted.find(fw => fw.id === rank1Candidate.bookingId);
        const isInstitutional = Boolean(
          candidateBooking?.isInstitutionalOverride && candidateBooking?.userRole !== 'student'
        );

        // Requirement 7 & 8: Move highest-ranked eligible student to Pending Approval
        const promotedStatus: BookingStatus = isInstitutional ? 'Approved' : 'Pending Approval';

        const finalBookings = updatedBookings.map(b =>
          b.id === rank1Candidate.bookingId
            ? {
                ...b,
                status: promotedStatus,
                queuePosition: undefined,
                fairShareRank: 1,
                fairShareExplanation: rank1Candidate.rationale,
                ownerNotes: isInstitutional
                  ? 'Auto-approved from waiting list following cancellation of previous reservation.'
                  : `Promoted from waiting list to Pending Approval under FairShare (#1 Rank). Rationale: ${rank1Candidate.rationale}`
              }
            : b
        );

        setBookings(finalBookings);

        if (promotedStatus === 'Approved') {
          setResources(prev =>
            prev.map(r => (r.id === booking.resourceId ? { ...r, status: 'Reserved' } : r))
          );
        }

        logActivity(
          'Promoted from Waitlist (FairShare Re-evaluated)',
          booking.resourceName,
          `Promoted ${rank1Candidate.userName} to ${promotedStatus} following slot cancellation. Rationale: ${rank1Candidate.rationale}`,
          'booking',
          rank1Candidate.bookingId,
          booking.resourceId
        );
      } else {
        setBookings(updatedBookings);
      }
    } else {
      setBookings(updatedBookings);
    }

    logActivity(
      'Cancelled Booking',
      booking.resourceName,
      `Reservation ${booking.id} cancelled by ${currentUser.name}. Slot released for future reservations.`,
      'booking',
      booking.id,
      booking.resourceId
    );
  };

  // Perform Check-in (Physical Handover)
  const performCheckIn = (
    bookingId: string,
    pin: string,
    preConditionNotes: string,
    preCheckPhotoUrl?: string
  ): { success: boolean; message: string } => {
    // CRITICAL RBAC RESTRICTION: Central Administrators CANNOT perform routine physical handover!
    if (role === 'admin') {
      return {
        success: false,
        message: 'Institutional Custody Separation: Central Administrators oversee audits and policy, but physical custody handover must be signed off by Department Lab Staff.'
      };
    }

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking reference not found.' };

    if (booking.checkInVerificationCode.trim().toUpperCase() !== pin.trim().toUpperCase()) {
      return { success: false, message: 'Invalid Verification PIN. Please verify the code displayed in booking details.' };
    }

    if (booking.status === 'Checked In') {
      return { success: false, message: 'This resource is already checked in and in active use.' };
    }

    const checkInTimestamp = new Date().toISOString();

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Checked In',
              checkInTime: checkInTimestamp,
              preCheckCondition: preConditionNotes || 'Inspected and verified in clean operational state.',
              preCheckPhotoUrl: preCheckPhotoUrl || b.preCheckPhotoUrl,
              handoverVerifiedBy: currentUser.name
            }
          : b
      )
    );

    setResources(prev =>
      prev.map(r =>
        r.id === booking.resourceId
          ? {
              ...r,
              status: 'In Use',
              currentCheckedOutTo: booking.userName,
              currentBookingId: booking.id
            }
          : r
      )
    );

    logActivity(
      'Verified Equipment Handover & Check-in',
      booking.resourceName,
      `Physical check-in validated with PIN ${pin} for ${booking.userName} by ${currentUser.name}. Initial condition logged.`,
      'checkin',
      booking.id,
      booking.resourceId
    );

    return {
      success: true,
      message: `Handover verified! ${booking.resourceName} (${booking.resourceId}) is now active in student custody.`
    };
  };

  // Perform Check-out (Return & Inspection)
  const performCheckOut = (
    bookingId: string,
    postConditionNotes: string,
    postCheckPhotoUrl?: string,
    incidentReport?: {
      severity: 'Low' | 'Medium' | 'High' | 'Critical';
      description: string;
    }
  ): { success: boolean; message: string } => {
    // CRITICAL RBAC RESTRICTION: Central Administrators CANNOT confirm return!
    if (role === 'admin') {
      return {
        success: false,
        message: 'Institutional Custody Separation: Central Administrators cannot sign off on routine equipment returns. Please log in as Lab Owner (Rahul Sharma).'
      };
    }

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking reference not found.' };

    const checkOutTimestamp = new Date().toISOString();
    const isDamaged = incidentReport && incidentReport.severity !== 'Low';

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Completed',
              checkOutTime: checkOutTimestamp,
              postCheckCondition: postConditionNotes || 'Returned in acceptable order.',
              postCheckPhotoUrl: postCheckPhotoUrl || b.postCheckPhotoUrl,
              returnConfirmedBy: currentUser.name
            }
          : b
      )
    );

    // Update resource state
    setResources(prev =>
      prev.map(r =>
        r.id === booking.resourceId
          ? {
              ...r,
              status: isDamaged ? 'Maintenance' : 'Available',
              totalUsageCount: r.totalUsageCount + 1,
              currentCheckedOutTo: undefined,
              currentBookingId: undefined,
              conditionScore: isDamaged ? Math.max(50, r.conditionScore - 15) : r.conditionScore,
              currentConditionNotes: postConditionNotes
            }
          : r
      )
    );

    // If an incident was reported, file condition report
    if (incidentReport) {
      const newReport: ConditionReport = {
        id: `cr-${Date.now().toString().slice(-5)}`,
        bookingId: booking.id,
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        reportedBy: currentUser.name,
        reportedByRole: role,
        reportType: 'Check-out Inspection',
        preCondition: booking.preCheckCondition || 'Normal operating condition',
        postCondition: postConditionNotes,
        initialPhotoUrl: booking.preCheckPhotoUrl,
        returnPhotoUrl: postCheckPhotoUrl,
        description: incidentReport.description,
        severity: incidentReport.severity,
        status: isDamaged ? 'Maintenance Required' : 'Resolved',
        createdAt: new Date().toISOString()
      };
      setConditionReports(prev => [newReport, ...prev]);
    }

    logActivity(
      'Confirmed Equipment Return & Handover',
      booking.resourceName,
      `Return inspected for ${booking.userName} by ${currentUser.name}. Condition: ${postConditionNotes.slice(0, 50)}... ${isDamaged ? '[MAINTENANCE FLAG]' : ''}`,
      'checkin',
      booking.id,
      booking.resourceId
    );

    return {
      success: true,
      message: isDamaged
        ? 'Return completed. Maintenance flag raised and incident logged for lab staff.'
        : 'Return inspected and confirmed successfully! Thank you for maintaining college resources.'
    };
  };

  // Add Condition Report
  const addConditionReport = (reportData: Omit<ConditionReport, 'id' | 'createdAt'>) => {
    const newReport: ConditionReport = {
      ...reportData,
      id: `cr-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    };

    setConditionReports(prev => [newReport, ...prev]);

    if (reportData.severity === 'Critical' || reportData.severity === 'High') {
      setResources(prev =>
        prev.map(r =>
          r.id === reportData.resourceId ? { ...r, status: 'Maintenance' } : r
        )
      );
    }

    logActivity(
      'Filed Condition / Incident Report',
      reportData.resourceName,
      `Severity: ${reportData.severity} - ${reportData.description.slice(0, 60)}...`,
      'condition',
      reportData.bookingId,
      reportData.resourceId
    );
  };

  // Add Resource
  const addResource = (
    resourceData: Omit<
      Resource,
      'id' | 'createdAt' | 'totalUsageCount' | 'conditionScore' | 'currentConditionNotes'
    >
  ) => {
    // Generate permanent unit ID if not given
    const prefix = resourceData.category.slice(0, 3).toUpperCase();
    const id = `${prefix}${Math.floor(100 + Math.random() * 900)}`;

    const newResource: Resource = {
      ...resourceData,
      id,
      totalUsageCount: 0,
      conditionScore: 100,
      currentConditionNotes: 'Brand new intake; verified ready for circulation.',
      createdAt: new Date().toISOString()
    };

    setResources(prev => [newResource, ...prev]);

    logActivity(
      'Added New College Resource',
      newResource.name,
      `Category: ${newResource.category} (${newResource.id}) registered at ${newResource.location}`,
      'resource',
      undefined,
      newResource.id
    );
  };

  // Update Resource Status
  const updateResourceStatus = (id: string, status: ResourceStatus, notes?: string) => {
    setResources(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status,
              currentConditionNotes: notes || r.currentConditionNotes
            }
          : r
      )
    );

    const res = resources.find(r => r.id === id);
    if (res) {
      logActivity(
        'Updated Resource Status',
        res.name,
        `Status set to ${status}. ${notes ? `Notes: ${notes}` : ''}`,
        'resource',
        undefined,
        id
      );
    }
  };

  // Place Resource in Maintenance (Requirement 12)
  const placeResourceInMaintenance = (resourceId: string, reason: string) => {
    const initiator = currentUser.name;
    const timestamp = new Date().toISOString();
    setResources(prev =>
      prev.map(r =>
        r.id === resourceId
          ? {
              ...r,
              status: 'Maintenance',
              maintenanceReason: reason,
              maintenanceInitiatedBy: initiator,
              maintenanceInitiatedAt: timestamp,
              currentConditionNotes: `Under Maintenance: ${reason} (Initiated by ${initiator})`
            }
          : r
      )
    );
    const res = resources.find(r => r.id === resourceId);
    logActivity(
      'Placed Equipment in Scheduled Maintenance',
      res ? res.name : resourceId,
      `Equipment taken offline for servicing. Reason: ${reason}. Existing approved bookings preserved; new reservations blocked.`,
      'resource',
      undefined,
      resourceId
    );
  };

  // Restore Resource from Maintenance (Requirement 12)
  const restoreResourceFromMaintenance = (resourceId: string, restorationNotes: string) => {
    const timestamp = new Date().toISOString();
    setResources(prev =>
      prev.map(r =>
        r.id === resourceId
          ? {
              ...r,
              status: 'Available',
              maintenanceRestoredAt: timestamp,
              currentConditionNotes: restorationNotes || 'Maintenance completed and recertified for department circulation.'
            }
          : r
      )
    );
    const res = resources.find(r => r.id === resourceId);
    logActivity(
      'Restored Equipment to Available Pool',
      res ? res.name : resourceId,
      `Service completed by ${currentUser.name}. Inspection Notes: ${restorationNotes || 'Recertified for circulation.'}`,
      'resource',
      undefined,
      resourceId
    );
  };

  // Load FairShare 5-Student Competing Scenario on CAM001
  const loadFairShareDemoScenario = () => {
    // Reset bookings for CAM001 to initial demo scenario
    const nonCam001Bookings = bookings.filter(b => b.id !== 'bk-comp-01' && b.id !== 'bk-comp-02' && b.id !== 'bk-comp-03' && b.id !== 'bk-comp-04' && b.id !== 'bk-comp-05');
    
    // Grab the 5 competing requests from initialBookings
    const compBookings = initialBookings.filter(b => b.id.startsWith('bk-comp-'));
    
    setBookings([...compBookings, ...nonCam001Bookings]);
    
    // Mark CAM001 as Available awaiting allocation
    setResources(prev =>
      prev.map(r => (r.id === 'CAM001' ? { ...r, status: 'Available' } : r))
    );

    logActivity(
      'Loaded FairShare 5-Student Competing Scenario',
      'Sony Alpha 7 IV Cinema Kit (CAM001)',
      'Pre-loaded 5 competing requests from Aarav, Priya, Rohan, Ananya, and Karan for Oct 31 slot.',
      'system',
      undefined,
      'CAM001'
    );
  };

  // Execute Resource-Wise FairShare Batch Allocation
  const executeFairShareBatchAllocation = (targetResourceId?: string) => {
    // 1. Identify resources to process: either specific resource or all resources in catalog
    const targetResources = targetResourceId
      ? resources.filter(r => r.id === targetResourceId)
      : resources;

    if (targetResources.length === 0) {
      return { success: false, message: 'Target resource not found.' };
    }

    let allocatedCount = 0;
    let waitlistedCount = 0;
    const updatedBookingsMap = new Map<string, Booking>(bookings.map(b => [b.id, { ...b }]));
    const updatedBookingsArray = Array.from(updatedBookingsMap.values());

    // Build complete user profiles map with all registered demo identities
    const userProfilesMap: Record<string, UserProfile> = {};
    getAllAvailableAccounts().forEach(acc => {
      userProfilesMap[acc.id] = acc.userProfile;
    });
    userProfilesMap[currentUser.id] = currentUser;

    // Process EACH resource independently (Requirement 1: Resource-Wise Grouping)
    for (const res of targetResources) {
      const resourceId = res.id;

      // Active bookings on this resource that block time slots
      const activeBookings = updatedBookingsArray.filter(
        b => b.resourceId === resourceId && ['Approved', 'Checked In'].includes(b.status)
      );

      // Pending or Waitlisted candidate requests for this EXACT resource
      const candidateRequests = updatedBookingsArray.filter(
        b => b.resourceId === resourceId && ['Pending Approval', 'Waitlisted'].includes(b.status)
      );

      if (candidateRequests.length === 0) continue;

      // 2. Separate candidates that conflict with existing approved/checked-in reservations
      const conflictingWithActive = candidateRequests.filter(req =>
        activeBookings.some(active => checkTimeOverlap(active.startTime, active.endTime, req.startTime, req.endTime))
      );

      // Mark candidates that conflict with active approved reservations as Waitlisted
      conflictingWithActive.forEach(req => {
        const item = updatedBookingsMap.get(req.id);
        if (item) {
          item.status = 'Waitlisted';
          item.ownerNotes = 'Time slot currently occupied by active approved reservation (Lab Owner/Admin/Student). Request queued on waiting list.';
          updatedBookingsMap.set(req.id, item);
          waitlistedCount++;
        }
      });

      // Candidates free of conflicts with active approved reservations
      const freeCandidates = candidateRequests.filter(req =>
        !activeBookings.some(active => checkTimeOverlap(active.startTime, active.endTime, req.startTime, req.endTime))
      );

      if (freeCandidates.length === 0) continue;

      // 3. Cluster freeCandidates by overlapping time slot windows so non-overlapping requests DO NOT compete with each other!
      const clusters: Booking[][] = [];
      const visited = new Set<string>();

      for (const candidate of freeCandidates) {
        if (visited.has(candidate.id)) continue;

        const cluster: Booking[] = [candidate];
        visited.add(candidate.id);

        let addedNew = true;
        while (addedNew) {
          addedNew = false;
          for (const other of freeCandidates) {
            if (visited.has(other.id)) continue;

            const overlapsWithCluster = cluster.some(member =>
              checkTimeOverlap(member.startTime, member.endTime, other.startTime, other.endTime)
            );

            if (overlapsWithCluster) {
              cluster.push(other);
              visited.add(other.id);
              addedNew = true;
            }
          }
        }

        clusters.push(cluster);
      }

      // 4. Process each cluster independently
      for (const cluster of clusters) {
        if (cluster.length === 1) {
          // Independent request for a non-overlapping time slot!
          // Requirement 5: Do not unnecessarily waitlist independent requests!
          const single = cluster[0];
          const item = updatedBookingsMap.get(single.id);
          if (item) {
            const userProf = userProfilesMap[single.userId];
            const eligibility = userProf ? evaluateEligibility(res, userProf) : { isEligible: true, missingRequirements: [] };

            if (!eligibility.isEligible) {
              item.status = 'Rejected';
              item.fairShareRank = 99;
              item.ownerNotes = `Disqualified: Missing required prerequisite (${eligibility.missingRequirements.join(', ')}).`;
            } else {
              const isSelfBooking = single.userId === currentUser.id;
              const targetStatus: BookingStatus = res.requiresApproval || isSelfBooking ? 'Pending Approval' : 'Approved';
              item.status = targetStatus;
              item.fairShareRank = 1;
              item.fairShareExplanation = 'No competing requests for this non-overlapping time slot. Proceeded independently.';
              item.ownerNotes = targetStatus === 'Approved'
                ? 'Approved: Non-conflicting available slot.'
                : 'Submitted to approval queue. Non-conflicting independent slot.';
              allocatedCount++;
            }
            updatedBookingsMap.set(single.id, item);
          }
        } else {
          // Multiple competing student requests for overlapping time slot!
          // Requirement 3: Apply FairShare ONLY to competing requests.
          const rankedCluster = rankRequestsByFairShare(cluster, res, updatedBookingsArray, userProfilesMap);

          rankedCluster.forEach(evalItem => {
            const item = updatedBookingsMap.get(evalItem.bookingId);
            if (!item) return;

            if (evalItem.priorityRank === 1) {
              const isSelfBooking = evalItem.userId === currentUser.id;
              const targetStatus: BookingStatus = res.requiresApproval || isSelfBooking ? 'Pending Approval' : 'Approved';
              item.status = targetStatus;
              item.fairShareRank = 1;
              item.fairShareExplanation = evalItem.rationale;
              item.ownerNotes = isSelfBooking
                ? `Selected as #1 Priority under FairShare. Awaiting independent authorized approval (Self-Approval Prohibited). Rationale: ${evalItem.rationale}`
                : targetStatus === 'Approved'
                ? `Approved under FairShare Priority Engine: ${evalItem.rationale}`
                : `Promoted to #1 Priority under FairShare. Awaiting Lab Owner approval. Rationale: ${evalItem.rationale}`;
              allocatedCount++;
            } else if (!evalItem.isEligible) {
              item.status = 'Rejected';
              item.fairShareRank = 99;
              item.fairShareExplanation = evalItem.rationale;
              item.ownerNotes = `Disqualified: Missing required prerequisite (${evalItem.ineligibilityReason}).`;
            } else {
              const waitlistRank = evalItem.priorityRank - 1;
              item.status = 'Waitlisted';
              item.queuePosition = waitlistRank;
              item.fairShareRank = evalItem.priorityRank;
              item.fairShareExplanation = evalItem.rationale;
              item.ownerNotes = `Enrolled on waiting list rank #${waitlistRank} by FairShare engine for competing time slot.`;
              waitlistedCount++;
            }
            updatedBookingsMap.set(evalItem.bookingId, item);
          });
        }
      }
    }

    // 5. Commit updated bookings to state
    const finalBookings = Array.from(updatedBookingsMap.values());
    setBookings(finalBookings);

    // Update resource statuses if any became Approved
    finalBookings.forEach(b => {
      if (b.status === 'Approved') {
        setResources(prev =>
          prev.map(r => (r.id === b.resourceId ? { ...r, status: 'Reserved' } : r))
        );
      }
    });

    logActivity(
      'Executed Resource-Wise FairShare Allocation',
      targetResourceId || 'All Campus Resources',
      `Processed batch allocation. Evaluated competing slot clusters across target resources. Allocated/Promoted: ${allocatedCount}, Waitlisted: ${waitlistedCount}.`,
      'approval',
      undefined,
      targetResourceId
    );

    return {
      success: true,
      message: `Resource-Wise FairShare Allocation Complete: Processed candidate requests. Non-conflicting requests proceeded independently; competing overlapping requests ranked via FairShare.`
    };
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_RESOURCES);
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY_REPORTS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    setResources(initialResources);
    setBookings(initialBookings);
    setConditionReports(initialConditionReports);
    setActivityLogs(initialActivityLogs);
    alert('Demonstration database reset to default Poornima College scenario!');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        activeSession,
        login,
        logout,
        canAccessPage,
        switchDemoRole,
        switchUserAccount,
        role,
        setRole,
        currentUser,
        updateCurrentUser,
        resources,
        bookings,
        conditionReports,
        activityLogs,
        currentPage,
        setCurrentPage,
        resourceReturnPage,
        selectedResourceId,
        setSelectedResourceId,
        bookingModalResource,
        setBookingModalResource,
        isAiModalOpen,
        setIsAiModalOpen,
        maxActiveBookingsPerStudent,
        updateStudentQuotaSetting,
        submitBooking,
        joinWaitlist,
        approveBooking,
        rejectBooking,
        cancelBooking,
        performCheckIn,
        performCheckOut,
        addConditionReport,
        addResource,
        updateResourceStatus,
        placeResourceInMaintenance,
        restoreResourceFromMaintenance,
        resetDemoData,
        navigateToResource,
        loadFairShareDemoScenario,
        executeFairShareBatchAllocation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
