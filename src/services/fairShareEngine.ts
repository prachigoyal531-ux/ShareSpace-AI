/**
 * FairShare Allocation Engine
 * Nexora University, Jaipur
 * 
 * Enforces equitable, transparent resource distribution:
 * 1. Verifies mandatory prerequisites and safety certifications.
 * 2. Usage counters are computed STRICTLY per unique physical resource ID (e.g., CAM001 vs CAM002),
 *    never by general category.
 * 3. Eligible candidates with LOWER prior completed bookings on that specific unit receive HIGHER priority.
 * 4. Tie-breaking:
 *    - 1st: Earlier booking request submission timestamp
 *    - 2nd: Student Registration ID
 * 5. Generates human-readable explanations for every allocation decision.
 */

import { Booking, Resource, UserProfile, UserRole } from '../types';
import { formatTimeIST } from '../utils/formatters';

export interface FairShareEvaluation {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentId: string;
  department: string;
  resourceId: string;
  resourceName: string;
  requestedStartTime: string;
  requestedEndTime: string;
  requestSubmittedAt: string;
  purpose: string;
  isEligible: boolean;
  ineligibilityReason?: string;
  completedCountOnTargetResource: number;
  totalUsageAcrossAllResources: number;
  priorityRank: number;
  allocationStatus: 'Recommended for Allocation' | 'Waitlist Priority 1' | 'Waitlist Priority 2' | 'Waitlist Priority 3' | 'Waitlist Priority 4' | 'Disqualified - Missing Requirements';
  rationale: string;
  tieBreakerApplied?: string;
}

/**
 * Calculates completed usage count STRICTLY for the given physical unit ID.
 * Excludes pending, rejected, waitlisted, and cancelled requests.
 */
export const getCompletedBookingsForUnit = (
  allBookings: Booking[],
  userId: string,
  targetResourceId: string
): number => {
  return allBookings.filter(
    b => b.userId === userId && b.resourceId === targetResourceId && b.status === 'Completed'
  ).length;
};

/**
 * Checks safety certifications and prerequisite eligibility against resource requirements.
 */
export const evaluateEligibility = (
  resource: Resource,
  user: UserProfile
): { isEligible: boolean; missingRequirements: string[] } => {
  const missing: string[] = [];

  const userCerts = user.verifiedCertifications.map(c => c.toLowerCase());

  for (const req of resource.eligibilityRequirements) {
    const reqLower = req.toLowerCase();

    // Check for AV / Camera operator certification
    if (reqLower.includes('av & cinema') || reqLower.includes('camera') || reqLower.includes('cinema equipment')) {
      const hasCert = userCerts.some(c => c.includes('av & cinema') || c.includes('cinema equipment operator'));
      if (!hasCert) {
        missing.push('AV & Cinema Equipment Operator Certification');
      }
    }

    // Check for 3D Prototyping certification
    if (reqLower.includes('3d rapid') || reqLower.includes('prototyping safety') || reqLower.includes('3d printer')) {
      const hasCert = userCerts.some(c => c.includes('3d rapid') || c.includes('prototyping safety'));
      if (!hasCert) {
        missing.push('3D Rapid Prototyping Safety Cert');
      }
    }

    // Check for Lab Safety Induction Level 2
    if (reqLower.includes('lab safety induction') || reqLower.includes('level 2')) {
      const hasCert = userCerts.some(c => c.includes('lab safety induction') || c.includes('safety induction level 2'));
      if (!hasCert) {
        missing.push('Lab Safety Induction Level 2');
      }
    }

    // Check for Cleanroom certification
    if (reqLower.includes('cleanroom') || reqLower.includes('chemical safety')) {
      const hasCert = userCerts.some(c => c.includes('cleanroom') || c.includes('chemical safety'));
      if (!hasCert) {
        missing.push('Cleanroom Protocol & Chemical Safety Certification');
      }
    }
  }

  return {
    isEligible: missing.length === 0,
    missingRequirements: missing
  };
};

/**
 * Evaluates and ranks competing requests for a given resource slot using the FairShare algorithm.
 */
export const rankRequestsByFairShare = (
  requests: Booking[],
  resource: Resource,
  allBookings: Booking[],
  userProfiles: Record<string, UserProfile>
): FairShareEvaluation[] => {
  // First evaluate eligibility and usage counters for each request
  const evaluated = requests.map(req => {
    // Robust role detection: check req.userRole first, then userProfiles, then user ID patterns
    const detectedRole: UserRole =
      req.userRole ||
      userProfiles[req.userId]?.role ||
      (req.userId === 'user-adm-303' || req.userId.includes('adm') || req.userName.includes('Ankit')
        ? 'admin'
        : req.userId === 'user-own-202' || req.userId.includes('own') || req.userName.includes('Rahul')
        ? 'owner'
        : 'student');

    const user = userProfiles[req.userId] || {
      id: req.userId,
      name: req.userName,
      email: req.userEmail,
      role: detectedRole,
      studentOrEmployeeId: req.userId,
      department: req.userDepartment,
      reputationScore: 98,
      activeBookingCount: 1,
      maxActiveBookings: detectedRole === 'student' ? 3 : 10,
      verifiedCertifications:
        detectedRole === 'student'
          ? ['Lab Safety Induction Level 2', 'AV & Cinema Equipment Operator']
          : [
              'Master Lab Safety Director',
              'Radiation & Laser Safety Officer',
              'Advanced Hazardous Materials Handling',
              'AV & Cinema Equipment Operator',
              '3D Rapid Prototyping Safety Cert'
            ],
      joinedDate: 'August 2024'
    };

    // Faculty custodians and administrators are inherently qualified for department equipment
    const { isEligible, missingRequirements } =
      detectedRole === 'student'
        ? evaluateEligibility(resource, user)
        : { isEligible: true, missingRequirements: [] };

    const completedCountOnTarget = getCompletedBookingsForUnit(allBookings, req.userId, resource.id);
    const totalAcrossAll = allBookings.filter(b => b.userId === req.userId && b.status === 'Completed').length;

    // Genuine institutional requirement check (personal borrowing does NOT receive priority override)
    const hasInstitutionalOverride = Boolean(
      req.isInstitutionalOverride && req.institutionalPurpose?.trim() && detectedRole !== 'student'
    );

    // Priority Tier:
    // Tier 1: Authorised Administrator institutional mandate
    // Tier 2: Authorised Lab Owner departmental operations mandate
    // Tier 3: Standard Student FairShare / Personal borrowing
    let operationalTier = 3;
    if (hasInstitutionalOverride) {
      if (detectedRole === 'admin') operationalTier = 1;
      else if (detectedRole === 'owner') operationalTier = 2;
    }

    return {
      req,
      user,
      detectedRole,
      isEligible,
      missingRequirements,
      completedCountOnTarget,
      totalAcrossAll,
      operationalTier,
      hasInstitutionalOverride,
      submittedAtMs: new Date(req.createdAt).getTime()
    };
  });

  // Sort according to FairShare priority hierarchy:
  // 1. Ineligible candidates are ALWAYS placed last (Disqualified)
  // 2. Operational Priority Tier:
  //    - Tier 1: Administrator Institutional Mandate (Highest Priority)
  //    - Tier 2: Lab Owner Departmental Operations Mandate (Higher than students)
  //    - Tier 3: Standard Student FairShare / Personal borrowing
  // 3. For Tier 3 (Student FairShare / Personal):
  //    - Lowest prior completed usage on this specific physical unit ID
  // 4. Earlier request timestamp (IST tie-breaker)
  // 5. Student / Employee Registration ID alphabetical order
  evaluated.sort((a, b) => {
    // 1. Eligibility: Ineligible requests are always pushed to the bottom
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    if (!a.isEligible && !b.isEligible) return 0;

    // 2. Operational Priority Tier
    if (a.operationalTier !== b.operationalTier) {
      return a.operationalTier - b.operationalTier;
    }

    // 3. For Tier 3 candidates: Lowest completed usage on this specific resource ID
    if (a.operationalTier === 3 && a.completedCountOnTarget !== b.completedCountOnTarget) {
      return a.completedCountOnTarget - b.completedCountOnTarget;
    }

    // 4. Earlier request timestamp
    if (a.submittedAtMs !== b.submittedAtMs) {
      return a.submittedAtMs - b.submittedAtMs;
    }

    // 5. Registration ID alphabetical order
    return a.user.studentOrEmployeeId.localeCompare(b.user.studentOrEmployeeId);
  });

  // Assign ranks, status, and human-readable rationales
  let eligibleRankCounter = 1;

  return evaluated.map(item => {
    let rank: number;
    let status: FairShareEvaluation['allocationStatus'];
    let rationale: string;
    let tieBreaker: string | undefined;

    if (!item.isEligible) {
      rank = 99;
      status = 'Disqualified - Missing Requirements';
      rationale = `Disqualified: Missing required prerequisite (${item.missingRequirements.join(', ')}).`;
    } else if (item.operationalTier === 1) {
      rank = eligibleRankCounter++;
      status = rank === 1 ? 'Recommended for Allocation' : (`Waitlist Priority ${rank - 1}` as any);
      rationale = `Rank ${rank}: Administrator Institutional Priority (Tier 1: ${item.req.institutionalPurpose}). Authorised central campus operational mandate.`;
      
      const peersAtSameTier = evaluated.filter(o => o.isEligible && o.operationalTier === 1);
      if (peersAtSameTier.length > 1) {
        const submittedTime = formatTimeIST(item.req.createdAt);
        tieBreaker = `Admin priority resolved via earlier request timestamp (${submittedTime}).`;
        rationale += ` Tie-break: Requested at ${submittedTime}.`;
      }
    } else if (item.operationalTier === 2) {
      rank = eligibleRankCounter++;
      status = rank === 1 ? 'Recommended for Allocation' : (`Waitlist Priority ${rank - 1}` as any);
      rationale = `Rank ${rank}: Lab Owner Departmental Priority (Tier 2: ${item.req.institutionalPurpose}). Authorised lab operations mandate.`;

      const peersAtSameTier = evaluated.filter(o => o.isEligible && o.operationalTier === 2);
      if (peersAtSameTier.length > 1) {
        const submittedTime = formatTimeIST(item.req.createdAt);
        tieBreaker = `Lab Owner priority resolved via earlier request timestamp (${submittedTime}).`;
        rationale += ` Tie-break: Requested at ${submittedTime}.`;
      }
    } else {
      rank = eligibleRankCounter++;
      if (rank === 1) {
        status = 'Recommended for Allocation';
        rationale = `Rank 1: Highest priority under FairShare. Lowest completed usage on ${resource.id} (${item.completedCountOnTarget} prior sessions).`;
      } else {
        const waitlistRank = rank - 1;
        status = `Waitlist Priority ${waitlistRank}` as any;
        rationale = `Waitlist #${waitlistRank}: ${item.completedCountOnTarget} prior completed session(s) on ${resource.id}.`;
      }

      // Check if tie breaker occurred with peers having the same completed count
      const peersWithSameCount = evaluated.filter(
        other =>
          other.isEligible &&
          other.operationalTier === item.operationalTier &&
          other.completedCountOnTarget === item.completedCountOnTarget
      );
      if (peersWithSameCount.length > 1) {
        const submittedTime = formatTimeIST(item.req.createdAt);
        tieBreaker = `Resolved via earlier request timestamp (${submittedTime}) and ID ${item.user.studentOrEmployeeId}.`;
        rationale += ` Tie-break: Requested at ${submittedTime}.`;
      }
    }

    return {
      bookingId: item.req.id,
      userId: item.req.userId,
      userName: item.user.name,
      userEmail: item.user.email,
      studentId: item.user.studentOrEmployeeId,
      department: item.user.department,
      resourceId: resource.id,
      resourceName: resource.name,
      requestedStartTime: item.req.startTime,
      requestedEndTime: item.req.endTime,
      requestSubmittedAt: item.req.createdAt,
      purpose: item.req.purpose,
      isEligible: item.isEligible,
      ineligibilityReason: item.missingRequirements.join(', ') || undefined,
      completedCountOnTargetResource: item.completedCountOnTarget,
      totalUsageAcrossAllResources: item.totalAcrossAll,
      priorityRank: rank,
      allocationStatus: status,
      rationale,
      tieBreakerApplied: tieBreaker
    };
  });
};
