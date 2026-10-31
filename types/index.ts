export type UserRole = 'student' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentOrEmployeeId: string;
  department: string;
  reputationScore: number; // e.g. 98/100
  activeBookingCount: number;
  maxActiveBookings: number;
  verifiedCertifications: string[];
  avatarUrl?: string;
  joinedDate: string;
}

export type ResourceCategory =
  | 'Laboratories'
  | 'Laptops'
  | 'Cameras'
  | 'Projectors'
  | '3D Printers'
  | 'Seminar Rooms';

export type ResourceStatus = 'Available' | 'Reserved' | 'In Use' | 'Maintenance';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  department: string;
  location: string;
  ownerName: string;
  ownerEmail: string;
  status: ResourceStatus;
  description: string;
  specifications: string[];
  rules: string[];
  eligibilityRequirements: string[];
  maxBookingDurationHours: number;
  leadTimeHours: number;
  requiresApproval: boolean;
  fairUseWeeklyLimitHours: number;
  totalUsageCount: number;
  conditionScore: number; // 0 - 100
  currentConditionNotes: string;
  currentCheckedOutTo?: string;
  currentBookingId?: string;
  imageCategory: string;
  maintenanceReason?: string;
  maintenanceInitiatedBy?: string;
  maintenanceInitiatedAt?: string;
  maintenanceRestoredAt?: string;
  createdAt: string;
}

export type BookingStatus =
  | 'Pending Approval'
  | 'Approved'
  | 'Checked In'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled'
  | 'Waitlisted';

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  userId: string;
  userName: string;
  userRole?: UserRole;
  userEmail: string;
  userDepartment: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  purpose: string;
  projectType: string;
  status: BookingStatus;
  queuePosition?: number;
  checkInVerificationCode: string;
  checkInTime?: string;
  checkOutTime?: string;
  preCheckCondition?: string;
  postCheckCondition?: string;
  preCheckPhotoUrl?: string;
  postCheckPhotoUrl?: string;
  handoverVerifiedBy?: string;
  returnConfirmedBy?: string;
  fairShareRank?: number;
  fairShareExplanation?: string;
  ownerNotes?: string;
  isInstitutionalOverride?: boolean;
  institutionalPurpose?: string;
  priorityTier?: number;
  createdAt: string;
}

export interface ConditionReport {
  id: string;
  bookingId?: string;
  resourceId: string;
  resourceName: string;
  reportedBy: string;
  reportedByRole: UserRole;
  reportType: 'Check-in Inspection' | 'Check-out Inspection' | 'Damage Incident' | 'Routine Maintenance';
  preCondition: string;
  postCondition: string;
  initialPhotoUrl?: string;
  returnPhotoUrl?: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending Review' | 'Investigating' | 'Resolved' | 'Maintenance Required';
  resolutionNotes?: string;
  createdAt: string;
  aiSummary?: {
    severity: string;
    executiveSummary: string;
    potentialRootCause: string;
    recommendedAction: string;
    estimatedDowntimeHours: number;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorId?: string;
  actorName: string;
  actorRole: UserRole;
  targetUserId?: string;
  action: string;
  target: string;
  details: string;
  category: 'booking' | 'checkin' | 'approval' | 'condition' | 'resource' | 'system';
  bookingId?: string;
  resourceId?: string;
}

export type AppPage =
  | 'login'
  | 'dashboard'
  | 'explore'
  | 'resource-details'
  | 'my-bookings'
  | 'booking-requests'
  | 'owner-dashboard'
  | 'add-resource'
  | 'checkin-checkout'
  | 'condition-reports'
  | 'activity-history'
  | 'profile'
  | 'admin-dashboard';
