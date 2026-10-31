/**
 * Authentication Service for ShareSpace AI
 * Demonstrates role-based authentication tailored for Nexora University, Jaipur.
 * 
 * Includes 7 pre-configured demonstration identities:
 * - 5 Independent Students (Aarav, Priya, Rohan, Ananya, Karan)
 * - 1 Lab Owner (Rahul Sharma)
 * - 1 Platform Administrator (Ankit Gupta)
 * 
 * Supports dynamic student registration with automatic Student role assignment
 * and duplicate ID/email prevention.
 */

import { UserProfile, UserRole, AppPage } from '../types';
import { mockStudentProfiles, mockUsers } from '../data/mockData';

export interface DemoUserAccount {
  id: string;
  name: string;
  loginId: string;
  alternativeIds?: string[];
  password: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  email: string;
  defaultDestination: AppPage;
  badgeColor: string;
  userProfile: UserProfile;
}

export const DEMO_CREDENTIALS: DemoUserAccount[] = [
  // --- 5 INDEPENDENT STUDENTS ---
  {
    id: 'user-std-101',
    name: 'Aarav Sharma',
    loginId: 'PCE2026ST001',
    alternativeIds: ['aarav.sharma@nexora.edu.in', 'PCE-CS-001'],
    password: 'student@pce2026',
    role: 'student',
    roleTitle: 'Student (CSE)',
    department: 'Computer Science & Engineering',
    email: 'aarav.sharma@nexora.edu.in',
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: mockStudentProfiles['user-std-101']
  },
  {
    id: 'user-std-102',
    name: 'Priya Verma',
    loginId: 'PCE2026ST002',
    alternativeIds: ['priya.verma@nexora.edu.in', 'PCE-EC-002'],
    password: 'student@pce2026',
    role: 'student',
    roleTitle: 'Student (ECE)',
    department: 'Electronics & Communication Engineering',
    email: 'priya.verma@nexora.edu.in',
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: mockStudentProfiles['user-std-102']
  },
  {
    id: 'user-std-103',
    name: 'Rohan Meena',
    loginId: 'PCE2026ST003',
    alternativeIds: ['rohan.meena@nexora.edu.in', 'PCE-ME-003'],
    password: 'student@pce2026',
    role: 'student',
    roleTitle: 'Student (Mechanical)',
    department: 'Mechanical & Mechatronics Engineering',
    email: 'rohan.meena@nexora.edu.in',
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: mockStudentProfiles['user-std-103']
  },
  {
    id: 'user-std-104',
    name: 'Ananya Gupta',
    loginId: 'PCE2026ST004',
    alternativeIds: ['ananya.gupta@nexora.edu.in', 'PCE-IT-004'],
    password: 'student@pce2026',
    role: 'student',
    roleTitle: 'Student (IT & AI)',
    department: 'Information Technology & AI',
    email: 'ananya.gupta@nexora.edu.in',
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: mockStudentProfiles['user-std-104']
  },
  {
    id: 'user-std-105',
    name: 'Karan Singh',
    loginId: 'PCE2026ST005',
    alternativeIds: ['karan.singh@nexora.edu.in', 'PCE-CV-005'],
    password: 'student@pce2026',
    role: 'student',
    roleTitle: 'Student (Civil)',
    department: 'Civil Engineering',
    email: 'karan.singh@nexora.edu.in',
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: mockStudentProfiles['user-std-105']
  },

  // --- LAB OWNER ---
  {
    id: 'user-own-202',
    name: 'Rahul Sharma',
    loginId: 'PCESTAFF001',
    alternativeIds: ['rahul.sharma@nexora.edu.in', 'PCE-FAC-1044'],
    password: 'owner@pce2026',
    role: 'owner',
    roleTitle: 'Lab In-Charge & Faculty Custodian',
    department: 'Mechanical & Mechatronics Engineering',
    email: 'rahul.sharma@nexora.edu.in',
    defaultDestination: 'owner-dashboard',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    userProfile: mockUsers.owner
  },

  // --- ADMINISTRATOR ---
  {
    id: 'user-adm-303',
    name: 'Ankit Gupta',
    loginId: 'PCEADMIN001',
    alternativeIds: ['ankit.gupta@nexora.edu.in', 'PCE-ADM-0012'],
    password: 'admin@pce2026',
    role: 'admin',
    roleTitle: 'Central Platform Administrator',
    department: 'Campus Facilities & Academic Resources',
    email: 'ankit.gupta@nexora.edu.in',
    defaultDestination: 'admin-dashboard',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    userProfile: mockUsers.admin
  }
];

const SESSION_STORAGE_KEY = 'sharespace_auth_session_v2';
const REGISTERED_ACCOUNTS_KEY = 'sharespace_registered_accounts_v2';

export interface StoredSession {
  user: UserProfile;
  loginId: string;
  role: UserRole;
  loginTime: string;
  token: string;
}

/**
 * Returns custom registered accounts from localStorage.
 */
export const getCustomRegisteredAccounts = (): DemoUserAccount[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse registered accounts:', err);
    return [];
  }
};

/**
 * Returns all active accounts (pre-configured demo + custom registered).
 */
export const getAllAvailableAccounts = (): DemoUserAccount[] => {
  const custom = getCustomRegisteredAccounts();
  return [...DEMO_CREDENTIALS, ...custom];
};

export const getStoredSession = (): StoredSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user && parsed.role) {
      return parsed as StoredSession;
    }
    return null;
  } catch (err) {
    console.warn('Failed to parse auth session:', err);
    return null;
  }
};

export const saveSession = (account: DemoUserAccount): StoredSession => {
  const session: StoredSession = {
    user: account.userProfile,
    loginId: account.loginId,
    role: account.role,
    loginTime: new Date().toISOString(),
    token: `demo-token-${account.role}-${Date.now()}`
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

/**
 * Registers a new student account.
 * Automatically and strictly assigns the Student role.
 * Prevents registering as Owner or Admin.
 * Rejects duplicate registration IDs and duplicate emails.
 */
export const registerStudentAccount = (data: {
  name: string;
  registrationId: string;
  department: string;
  email: string;
  password: string;
}): { success: boolean; session?: StoredSession; message?: string } => {
  const trimmedName = data.name.trim();
  const trimmedId = data.registrationId.trim().toUpperCase();
  const trimmedEmail = data.email.trim().toLowerCase();
  const trimmedDept = data.department.trim();
  const trimmedPass = data.password.trim();

  if (!trimmedName || !trimmedId || !trimmedEmail || !trimmedDept || !trimmedPass) {
    return { success: false, message: 'All registration fields are required.' };
  }

  // Validate unique registration ID and email against all existing accounts
  const allAccounts = getAllAvailableAccounts();
  const duplicateId = allAccounts.some(
    acc => acc.loginId.toUpperCase() === trimmedId || acc.alternativeIds?.some(alt => alt.toUpperCase() === trimmedId)
  );
  if (duplicateId) {
    return {
      success: false,
      message: `Registration ID "${trimmedId}" is already registered. Please log in or use your unique student number.`
    };
  }

  const duplicateEmail = allAccounts.some(acc => acc.email.toLowerCase() === trimmedEmail);
  if (duplicateEmail) {
    return {
      success: false,
      message: `Email address "${trimmedEmail}" is already linked to an account. Please sign in instead.`
    };
  }

  // Build new student profile
  const newId = `user-std-custom-${Date.now()}`;
  const newProfile: UserProfile = {
    id: newId,
    name: trimmedName,
    email: trimmedEmail,
    role: 'student', // STRICTLY STUDENT ROLE
    studentOrEmployeeId: trimmedId,
    department: trimmedDept,
    reputationScore: 100,
    activeBookingCount: 0,
    maxActiveBookings: 3,
    verifiedCertifications: ['Basic Campus Induction', 'Lab Safety Induction Level 2'],
    joinedDate: 'October 2026'
  };

  const newAccount: DemoUserAccount = {
    id: newId,
    name: trimmedName,
    loginId: trimmedId,
    alternativeIds: [trimmedEmail],
    password: trimmedPass,
    role: 'student',
    roleTitle: `Student (${trimmedDept})`,
    department: trimmedDept,
    email: trimmedEmail,
    defaultDestination: 'dashboard',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    userProfile: newProfile
  };

  // Persist to localStorage
  const existingCustom = getCustomRegisteredAccounts();
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify([...existingCustom, newAccount]));

  // Auto-login newly registered student
  const session = saveSession(newAccount);
  return {
    success: true,
    session,
    message: `Account created successfully! Welcome to ShareSpace AI, ${trimmedName}.`
  };
};

/**
 * Validates login credentials strictly against authorized demo accounts.
 */
export const authenticateUser = (
  loginId: string,
  pass: string
): { success: boolean; session?: StoredSession; message?: string } => {
  const trimmedId = loginId.trim().toUpperCase();
  const trimmedPass = pass.trim();

  if (!trimmedId || !trimmedPass) {
    return {
      success: false,
      message: 'Please enter both your College ID and password.'
    };
  }

  const matched = DEMO_CREDENTIALS.find(acc => {
    const idMatch =
      acc.loginId.toUpperCase() === trimmedId ||
      acc.alternativeIds?.some(alt => alt.toUpperCase() === trimmedId) ||
      acc.email.toUpperCase() === trimmedId;
    return idMatch && acc.password === trimmedPass;
  });

  if (!matched) {
    return {
      success: false,
      message: 'Access restricted: Only authorized institutional demo accounts (PCE2026ST001–005, PCESTAFF001, PCEADMIN001) are permitted for evaluation.'
    };
  }

  const session = saveSession(matched);
  return {
    success: true,
    session
  };
};

/**
 * Role Permission Matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, AppPage[]> = {
  student: [
    'dashboard',
    'explore',
    'resource-details',
    'my-bookings',
    'checkin-checkout',
    'condition-reports',
    'profile'
  ],
  owner: [
    'owner-dashboard',
    'dashboard',
    'explore',
    'resource-details',
    'my-bookings',
    'booking-requests',
    'add-resource',
    'checkin-checkout',
    'condition-reports',
    'activity-history',
    'profile'
  ],
  admin: [
    'admin-dashboard',
    'owner-dashboard',
    'dashboard',
    'explore',
    'resource-details',
    'my-bookings',
    'booking-requests',
    'add-resource',
    'checkin-checkout',
    'condition-reports',
    'activity-history',
    'profile'
  ]
};

export const isPageAllowedForRole = (role: UserRole, page: AppPage): boolean => {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(page);
};

export const getDefaultPageForRole = (role: UserRole): AppPage => {
  switch (role) {
    case 'student':
      return 'dashboard';
    case 'owner':
      return 'owner-dashboard';
    case 'admin':
      return 'admin-dashboard';
    default:
      return 'dashboard';
  }
};
