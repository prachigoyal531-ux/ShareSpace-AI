import { Resource, Booking, ConditionReport, ActivityLog, UserProfile } from '../types';

export const mockStudentProfiles: Record<string, UserProfile> = {
  'user-std-101': {
    id: 'user-std-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@poornima.edu.in',
    role: 'student',
    studentOrEmployeeId: 'PCE2026ST001',
    department: 'Computer Science & Engineering',
    reputationScore: 98,
    activeBookingCount: 1,
    maxActiveBookings: 3,
    verifiedCertifications: [
      'Lab Safety Induction Level 2',
      '3D Rapid Prototyping Safety Cert',
      'AV & Cinema Equipment Operator'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'August 2024'
  },
  'user-std-102': {
    id: 'user-std-102',
    name: 'Priya Verma',
    email: 'priya.verma@poornima.edu.in',
    role: 'student',
    studentOrEmployeeId: 'PCE2026ST002',
    department: 'Electronics & Communication Engineering',
    reputationScore: 96,
    activeBookingCount: 1,
    maxActiveBookings: 3,
    verifiedCertifications: [
      'AV & Cinema Equipment Operator',
      'Lab Safety Induction Level 2'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'July 2024'
  },
  'user-std-103': {
    id: 'user-std-103',
    name: 'Rohan Meena',
    email: 'rohan.meena@poornima.edu.in',
    role: 'student',
    studentOrEmployeeId: 'PCE2026ST003',
    department: 'Mechanical & Mechatronics Engineering',
    reputationScore: 95,
    activeBookingCount: 1,
    maxActiveBookings: 3,
    verifiedCertifications: [
      '3D Rapid Prototyping Safety Cert',
      'AV & Cinema Equipment Operator',
      'Lab Safety Induction Level 2'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'August 2024'
  },
  'user-std-104': {
    id: 'user-std-104',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@poornima.edu.in',
    role: 'student',
    studentOrEmployeeId: 'PCE2026ST004',
    department: 'Information Technology & AI',
    reputationScore: 97,
    activeBookingCount: 1,
    maxActiveBookings: 3,
    verifiedCertifications: [
      'AV & Cinema Equipment Operator',
      'Lab Safety Induction Level 2'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'September 2024'
  },
  'user-std-105': {
    id: 'user-std-105',
    name: 'Karan Singh',
    email: 'karan.singh@poornima.edu.in',
    role: 'student',
    studentOrEmployeeId: 'PCE2026ST005',
    department: 'Civil Engineering',
    reputationScore: 90,
    activeBookingCount: 1,
    maxActiveBookings: 3,
    verifiedCertifications: [
      'Basic Campus Induction'
      // Note: Deliberately missing 'AV & Cinema Equipment Operator' for FairShare eligibility verification test
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'October 2024'
  }
};

export const mockUsers: Record<'student' | 'owner' | 'admin', UserProfile> = {
  student: mockStudentProfiles['user-std-101'],
  owner: {
    id: 'user-own-202',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@poornima.edu.in',
    role: 'owner',
    studentOrEmployeeId: 'PCESTAFF001',
    department: 'Mechanical & Mechatronics Engineering',
    reputationScore: 100,
    activeBookingCount: 0,
    maxActiveBookings: 10,
    verifiedCertifications: [
      'Master Lab Safety Director',
      'Radiation & Laser Safety Officer',
      'Advanced Hazardous Materials Handling'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'July 2019'
  },
  admin: {
    id: 'user-adm-303',
    name: 'Ankit Gupta',
    email: 'ankit.gupta@poornima.edu.in',
    role: 'admin',
    studentOrEmployeeId: 'PCEADMIN001',
    department: 'Campus Facilities & Academic Resources',
    reputationScore: 100,
    activeBookingCount: 0,
    maxActiveBookings: 50,
    verifiedCertifications: [
      'Institutional Safety Officer',
      'Campus Equipment Auditor',
      'Full Security & Resource Clearance'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'January 2016'
  }
};

export const initialResources: Resource[] = [
  // --- CAMERAS (Permanent Unique IDs: CAM001 & CAM002) ---
  {
    id: 'CAM001',
    name: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    category: 'Cameras',
    department: 'Media & Film Production',
    location: 'Media & Film Production Bay, Ramanujan Block Room 214, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Professional hybrid cinema camera kit packed in a weather-resistant Pelican flight case with FE 24-70mm f/2.8 GM II prime zoom, Røde shotgun mic, and ND filter set. Permanent Asset ID: CAM001.',
    specifications: [
      'Asset Unit Tag: PCE-CAM-001 (Sitapura Campus)',
      '33MP Full-Frame Exmor R CMOS sensor with 4K 60p 10-bit 4:2:2 recording',
      'Sony FE 24-70mm f/2.8 GM II standard zoom lens',
      '2x 128GB Tough V90 SDXC high-speed memory cards',
      'Røde VideoMic NTG on-camera shotgun microphone + 3x NP-FZ100 batteries'
    ],
    rules: [
      'Front lens element must always have UV filter attached',
      'Never swap lenses in dusty outdoor windy environments',
      'Physical check-in requires sensor glass and lens barrel inspection with lab staff'
    ],
    eligibilityRequirements: [
      'AV & Cinema Equipment Operator Certification',
      'Clean equipment custody record (Reputation >= 85)'
    ],
    maxBookingDurationHours: 24,
    leadTimeHours: 6,
    requiresApproval: true,
    fairUseWeeklyLimitHours: 24,
    totalUsageCount: 47,
    conditionScore: 94,
    currentConditionNotes: 'Sensor professionally cleaned; front lens element pristine.',
    imageCategory: 'Cameras',
    createdAt: '2026-01-20T13:15:00Z'
  },
  {
    id: 'CAM002',
    name: 'Canon EOS R6 Mark II Documentary & Gimbal Kit (Unit #2)',
    category: 'Cameras',
    department: 'Media & Communications',
    location: 'Media & Film Production Bay, Ramanujan Block Room 214, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'High-speed action and documentary package paired with DJI RS3 motorized 3-axis stabilizer for smooth handheld tracking shots. Permanent Asset ID: CAM002.',
    specifications: [
      'Asset Unit Tag: PCE-CAM-002 (Sitapura Campus)',
      '24.2MP full-frame CMOS sensor with 40 fps electronic shutter',
      'Canon RF 24-105mm f/4L IS USM & RF 50mm f/1.8 STM prime',
      'DJI RS3 3-Axis Motorized Gimbal with briefcase handle',
      'Pelican watertight carry-on hard case with custom foam cutouts'
    ],
    rules: [
      'DJI gimbal motors must be mechanically balanced before powering on',
      'Return with all 4 lens caps, battery chargers, and hex wrenches accounted for'
    ],
    eligibilityRequirements: [
      'AV & Cinema Equipment Operator Certification'
    ],
    maxBookingDurationHours: 24,
    leadTimeHours: 8,
    requiresApproval: true,
    fairUseWeeklyLimitHours: 24,
    totalUsageCount: 38,
    conditionScore: 91,
    currentConditionNotes: 'Gimbal calibration tested and verified; base plate lubricated.',
    imageCategory: 'Cameras',
    createdAt: '2026-01-25T15:45:00Z'
  },

  // --- LAPTOPS (Permanent Unique IDs: LAP001, LAP002, LAP003) ---
  {
    id: 'LAP001',
    name: 'Dell XPS 17 Mobile Workstation (RTX 4080 Rig #1)',
    category: 'Laptops',
    department: 'Computer Science & Engineering',
    location: 'Central Tech Depot Desk, Central Library Level 2, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Heavy computational laptop built for deep learning model training, CUDA simulations, and 3D architectural rendering at Poornima College of Engineering. Permanent Asset ID: LAP001.',
    specifications: [
      'Asset Unit Tag: PCE-LAP-001 (Sitapura Campus)',
      'Intel Core i9-13900H (14 cores, up to 5.4 GHz)',
      'NVIDIA GeForce RTX 4080 Mobile (12GB GDDR6 VRAM)',
      '64GB DDR5-5200MHz RAM & 2TB PCIe 4.0 NVMe SSD',
      '17.0" 4K+ (3840x2400) Touch Anti-Reflective display'
    ],
    rules: [
      'Loan duration capped at 48 hours per renewal cycle',
      'Must be returned in original padded shock sleeve with 130W USB-C charger',
      'No OS dual-booting or BIOS modifications'
    ],
    eligibilityRequirements: [
      'Registered Full-Time Student at Poornima College of Engineering',
      'Clean equipment borrowing record (Reputation score >= 85)'
    ],
    maxBookingDurationHours: 48,
    leadTimeHours: 2,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 48,
    totalUsageCount: 39,
    conditionScore: 96,
    currentConditionNotes: 'Clean keyboard, thermal paste inspected, fresh OS image.',
    imageCategory: 'Laptops',
    createdAt: '2026-02-05T11:00:00Z'
  },
  {
    id: 'LAP002',
    name: 'Apple MacBook Pro 16" (M3 Max Media Workstation #2)',
    category: 'Laptops',
    department: 'Digital Media & Visual Arts',
    location: 'Digital Innovation Bay, Tagore Block Room 108, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'In Use',
    description: 'Optimized for 8K ProRes video editing, spatial audio mixing, and high-polygon 3D rendering. Permanent Asset ID: LAP002.',
    specifications: [
      'Asset Unit Tag: PCE-LAP-002 (Sitapura Campus)',
      'Apple M3 Max (16-core CPU, 40-core GPU, 16-core Neural Engine)',
      '64GB Unified Memory (300GB/s bandwidth)',
      '1TB NVMe Flash Storage with DaVinci Resolve Studio & Final Cut Pro',
      'Liquid Retina XDR display with 1600 nits peak HDR brightness'
    ],
    rules: [
      'Store all local files in designated student scratch folder or external drive',
      'Must be physically checked in and inspected at depot'
    ],
    eligibilityRequirements: [
      'AV & Cinema Equipment Operator Certification or Arts Student',
      'Valid PCE student ID'
    ],
    maxBookingDurationHours: 24,
    leadTimeHours: 4,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 48,
    totalUsageCount: 51,
    conditionScore: 92,
    currentConditionNotes: 'Minor cosmetic mark on outer aluminum shell.',
    currentCheckedOutTo: 'Aarav Sharma',
    currentBookingId: 'bk-active-102',
    imageCategory: 'Laptops',
    createdAt: '2026-02-10T16:00:00Z'
  },
  {
    id: 'LAP003',
    name: 'Lenovo ThinkPad P16s Gen 2 (CAD Rig #3)',
    category: 'Laptops',
    department: 'Civil & Architectural Engineering',
    location: 'CAD/CAM Center, Visvesvaraya Block Room 202, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Rugged mobile workstation with ISV certifications for AutoCAD, SolidWorks, Revit, and ANSYS. Permanent Asset ID: LAP003.',
    specifications: [
      'Asset Unit Tag: PCE-LAP-003 (Sitapura Campus)',
      'AMD Ryzen 7 PRO 7840U (8 cores, 16 threads)',
      'Integrated Radeon 780M graphics with ISV certification',
      '32GB LPDDR5X RAM & 1TB PCIe NVMe OPAL storage'
    ],
    rules: [
      'Maximum 72 hours per project loan',
      'Use supplied lock cable if used in public commons'
    ],
    eligibilityRequirements: [
      'Architecture, Civil or Mechanical engineering student'
    ],
    maxBookingDurationHours: 72,
    leadTimeHours: 2,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 72,
    totalUsageCount: 34,
    conditionScore: 97,
    currentConditionNotes: 'Battery health at 99%; zero chassis scratches.',
    imageCategory: 'Laptops',
    createdAt: '2026-02-12T08:30:00Z'
  },

  // --- PROJECTORS (Permanent Unique IDs: PRO001 & PRO002) ---
  {
    id: 'PRO001',
    name: 'Epson Pro EX10000 4500-Lumen Laser Projector',
    category: 'Projectors',
    department: 'Central Audio-Visual Services',
    location: 'Central IT & Audio-Visual Depot, Admin Block Room 102, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Commercial laser projector designed for auditoriums, capstone presentation halls, and brightly-lit classroom venues. Permanent Asset ID: PRO001.',
    specifications: [
      'Asset Unit Tag: PCE-PRO-001 (Sitapura Campus)',
      '4500 lumens equal color and white brightness (3LCD)',
      'Full HD 1080p native resolution with HDR support',
      'Solid-state laser light source (instant on/off)',
      'Dual HDMI inputs and Miracast wireless casting'
    ],
    rules: [
      'Allow cooling cycle to finish before disconnecting power',
      'Always transport inside the padded protective shock tote bag'
    ],
    eligibilityRequirements: [
      'Standard student or student organization leader status'
    ],
    maxBookingDurationHours: 12,
    leadTimeHours: 2,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 24,
    totalUsageCount: 63,
    conditionScore: 96,
    currentConditionNotes: 'Clean optical lens; remote controller batteries replaced.',
    imageCategory: 'Projectors',
    createdAt: '2026-02-02T10:00:00Z'
  },
  {
    id: 'PRO002',
    name: 'Optoma UHD38x 4K Ultra HD Low-Latency Projector',
    category: 'Projectors',
    department: 'Interactive Media & Animation',
    location: 'Gaming & Animation Studio, APJ Abdul Kalam Block Room 310, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Ultra-fast 240Hz refresh rate 4K projector perfect for capstone video game showcases, interactive design critique sessions. Permanent Asset ID: PRO002.',
    specifications: [
      'Asset Unit Tag: PCE-PRO-002 (Sitapura Campus)',
      'True 4K UHD resolution (8.3 million pixels)',
      '4000 ANSI lumens brightness & 1,000,000:1 contrast ratio',
      '4.2ms ultra-low input lag in Enhanced Gaming Mode'
    ],
    rules: [
      'Indoor use only',
      'Return HDMI 2.1 braided cable in cable pouch'
    ],
    eligibilityRequirements: [
      'Recognized student club officer, TA, or Capstone team lead'
    ],
    maxBookingDurationHours: 8,
    leadTimeHours: 3,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 16,
    totalUsageCount: 41,
    conditionScore: 94,
    currentConditionNotes: 'High brightness test verified; color reproduction crisp.',
    imageCategory: 'Projectors',
    createdAt: '2026-02-08T12:00:00Z'
  },

  // --- 3D PRINTERS (Permanent Unique IDs: 3DP001 & 3DP002) ---
  {
    id: '3DP001',
    name: 'Bambu Lab X1-Carbon Combo High-Speed 3D Printer (Unit #1)',
    category: '3D Printers',
    department: 'Makerspace Prototyping Hub',
    location: 'Makerspace Innovation Lab, Visvesvaraya Workshop Bay 4, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'In Use',
    description: 'Enclosed CoreXY 500mm/s 3D printer featuring 4-spool automatic filament feeding (AMS), micro-lidar first layer inspection, and carbon fiber composite printing. Permanent Asset ID: 3DP001.',
    specifications: [
      'Asset Unit Tag: PCE-3DP-001 (Sitapura Campus)',
      'Build volume: 256 x 256 x 256 mm³ with heated bed up to 120°C',
      'Automatic Material System (AMS) supports 4-color printing',
      'Hardened steel nozzle (0.4mm) rated for PA-CF, PETG, ABS, TPU, PLA',
      'Dual auto bed leveling with micro-lidar inspection'
    ],
    rules: [
      'Sliced files must use approved college Bambu Studio profiles',
      'Must monitor first 3 layers physically before leaving bay',
      'Clean textured PEI sheet with 99% isopropanol after print completes'
    ],
    eligibilityRequirements: [
      '3D Rapid Prototyping Safety Cert'
    ],
    maxBookingDurationHours: 6,
    leadTimeHours: 2,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 18,
    totalUsageCount: 89,
    conditionScore: 92,
    currentConditionNotes: 'Active print job: Carbon fiber drone arm bracket.',
    currentCheckedOutTo: 'Rohan Meena',
    currentBookingId: 'bk-active-104',
    imageCategory: '3D Printers',
    createdAt: '2026-01-05T09:00:00Z'
  },
  {
    id: '3DP002',
    name: 'Formlabs Form 3+ SLA Precision Resin 3D Printer (Unit #2)',
    category: '3D Printers',
    department: 'Precision Prototyping Lab',
    location: 'Rapid Prototyping Lab, Visvesvaraya Block Room 402, PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Industrial stereolithography (SLA) resin printer delivering 25-micron layer lines for dental models, microfluidic chips, and precision mechanical parts. Permanent Asset ID: 3DP002.',
    specifications: [
      'Asset Unit Tag: PCE-3DP-002 (Sitapura Campus)',
      'Low Force Stereolithography (LFS) with 250mW 405nm violet laser',
      'Build dimensions: 145 x 145 x 185 mm with 25-micron XY resolution',
      'Automated Form Wash & Form Cure ultraviolet post-processing stations'
    ],
    rules: [
      'Chemical splash goggles and thick nitrile gloves mandatory',
      'Uncured liquid resin parts must remain within secondary containment tray'
    ],
    eligibilityRequirements: [
      '3D Rapid Prototyping Safety Cert',
      'Lab Safety Induction Level 2'
    ],
    maxBookingDurationHours: 8,
    leadTimeHours: 12,
    requiresApproval: true,
    fairUseWeeklyLimitHours: 16,
    totalUsageCount: 33,
    conditionScore: 97,
    currentConditionNotes: 'Fresh Clear V4 resin cartridge loaded; build platform leveled.',
    imageCategory: '3D Printers',
    createdAt: '2026-01-18T14:30:00Z'
  },

  // --- LABORATORIES (Permanent Unique IDs: ROB001, LAB002, LAB003) ---
  {
    id: 'ROB001',
    name: 'Advanced Robotics & Cyber-Physical Systems Lab',
    category: 'Laboratories',
    department: 'Robotics & Mechanical Engineering',
    location: 'Aryabhata Research Block, Room 304, Sitapura Campus',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Prototyping facility at Poornima College of Engineering equipped with Universal Robots UR5e collaborative arms, optical motion capture, and ROS2 edge compute clusters. Permanent Asset ID: ROB001.',
    specifications: [
      'Asset Unit Tag: PCE-ROB-001 (Sitapura Campus)',
      '2x UR5e Collaborative 6-axis robotic arms with Robotiq grippers',
      '8-camera optical motion capture volume (5m x 5m)',
      'Real-time EtherCAT bus & digital oscilloscope benches',
      'Emergency stop perimeter relays and safety interlock floor mats'
    ],
    rules: [
      'Mandatory closed-toe footwear and ANSI safety glasses at all times',
      'Robotics arms must be operated in reduced-force mode unless faculty supervised',
      'Workspace must be tidied 15 minutes before slot expiration'
    ],
    eligibilityRequirements: [
      'Lab Safety Induction Level 2'
    ],
    maxBookingDurationHours: 4,
    leadTimeHours: 12,
    requiresApproval: true,
    fairUseWeeklyLimitHours: 12,
    totalUsageCount: 42,
    conditionScore: 96,
    currentConditionNotes: 'All robot grippers calibrated; safety relays verified.',
    imageCategory: 'Laboratories',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'LAB002',
    name: 'Nanomaterials & Cleanroom Characterization Suite',
    category: 'Laboratories',
    department: 'Applied Sciences & Chemical Engineering',
    location: 'C.V. Raman Science Complex, Room 112, Sitapura Campus',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Maintenance',
    description: 'ISO Class 6 cleanroom facility with scanning electron microscope (SEM), atomic force microscope (AFM), and spectroscopic ellipsometry. Permanent Asset ID: LAB002.',
    specifications: [
      'Asset Unit Tag: PCE-LAB-002 (Sitapura Campus)',
      'FEI Quanta 250 Field Emission Scanning Electron Microscope',
      'Bruker Dimension Icon Atomic Force Microscope',
      'Positive pressure HEPA filtration with airlock entry'
    ],
    rules: [
      'Full bunny suit, double nitrile gloves, and cleanroom hood mandatory',
      'Zero outside notebooks or food permitted inside airlock'
    ],
    eligibilityRequirements: [
      'Cleanroom Protocol & Chemical Safety Certification'
    ],
    maxBookingDurationHours: 3,
    leadTimeHours: 24,
    requiresApproval: true,
    fairUseWeeklyLimitHours: 6,
    totalUsageCount: 28,
    conditionScore: 88,
    currentConditionNotes: 'Quarterly HEPA filter recertification & chamber bake-out.',
    imageCategory: 'Laboratories',
    createdAt: '2026-01-15T10:30:00Z'
  },
  {
    id: 'LAB003',
    name: 'Human-Computer Interaction & VR Usability Lab',
    category: 'Laboratories',
    department: 'Computer Science & AI',
    location: 'APJ Abdul Kalam Computing Center, Room 205, Sitapura Campus',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Observation suite with two-way mirror, Tobii Pro eye-tracking glasses, biometrics EEG sensors, and HTC Vive Focus 3 VR rigs for research teams. Permanent Asset ID: LAB003.',
    specifications: [
      'Asset Unit Tag: PCE-LAB-003 (Sitapura Campus)',
      'Dual one-way mirror observation room with audio mixing console',
      'Tobii Pro Glasses 3 wearable 100Hz eye-tracking units',
      '4x Meta Quest Pro & 2x Apple Vision Pro developer units'
    ],
    rules: [
      'Participant consent forms must be digitally submitted before session',
      'Disinfect headset facial cushions with alcohol-free wipes after every subject'
    ],
    eligibilityRequirements: [
      'Lab Safety Induction Level 2'
    ],
    maxBookingDurationHours: 3,
    leadTimeHours: 6,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 9,
    totalUsageCount: 56,
    conditionScore: 94,
    currentConditionNotes: 'Headsets charged, tracking cameras calibrated.',
    imageCategory: 'Laboratories',
    createdAt: '2026-02-01T14:00:00Z'
  },

  // --- SEMINAR ROOMS (Permanent Unique IDs: SEM001 & SEM002) ---
  {
    id: 'SEM001',
    name: 'Turing Collaborative Seminar Suite',
    category: 'Seminar Rooms',
    department: 'Academic Collaboration Center',
    location: 'Sarvepalli Radhakrishnan Academic Tower, 4th Floor (Room 410), PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'High-tech executive seminar space configured with modular hexagonal pod tables, dual 85" 4K interactive displays, and Logitech Rally hybrid audio bar. Permanent Asset ID: SEM001.',
    specifications: [
      'Asset Unit Tag: PCE-SEM-001 (Sitapura Campus)',
      'Capacity: 35 persons (flexible pod or classroom arrangement)',
      'Dual 85" interactive displays with wireless casting',
      'Dual-camera AI speaker-tracking conference bar'
    ],
    rules: [
      'Minimum group size of 4 students during peak hours (10:00 AM - 04:00 PM IST)',
      'Whiteboards must be wiped clean with supplied alcohol-free cleaner before vacating'
    ],
    eligibilityRequirements: [
      'Any registered student group or project team'
    ],
    maxBookingDurationHours: 3,
    leadTimeHours: 4,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 9,
    totalUsageCount: 78,
    conditionScore: 98,
    currentConditionNotes: 'Audio calibrated, dry-erase markers restocked, displays updated.',
    imageCategory: 'Seminar Rooms',
    createdAt: '2026-01-12T09:00:00Z'
  },
  {
    id: 'SEM002',
    name: 'Ada Lovelace Innovation Workshop & Ideation Pod',
    category: 'Seminar Rooms',
    department: 'Academic Collaboration Center',
    location: 'Sarvepalli Radhakrishnan Academic Tower, 4th Floor (Room 414), PCE Jaipur',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul.sharma@poornima.edu.in',
    status: 'Available',
    description: 'Creative sprint room featuring 360-degree magnetic writable walls, mobile sit-to-stand drafting stations, and smart screen wireless share. Permanent Asset ID: SEM002.',
    specifications: [
      'Asset Unit Tag: PCE-SEM-002 (Sitapura Campus)',
      'Capacity: 24 persons (rapid design sprint & brainstorming layout)',
      '360-degree magnetic writable walls with ideation tiles',
      '75" 4K commercial display with AirPlay & Google Cast'
    ],
    rules: [
      'No permanent markers; only campus dry-erase markers permitted',
      'Leave room clean and trash free'
    ],
    eligibilityRequirements: [
      'Enrolled students, hackathon squads, or senior design teams'
    ],
    maxBookingDurationHours: 4,
    leadTimeHours: 2,
    requiresApproval: false,
    fairUseWeeklyLimitHours: 12,
    totalUsageCount: 65,
    conditionScore: 95,
    currentConditionNotes: 'Writable walls spotless, power grommets inspected.',
    imageCategory: 'Seminar Rooms',
    createdAt: '2026-01-22T11:00:00Z'
  }
];

/**
 * INITIAL COMPLETED HISTORICAL USAGE:
 * Demonstrates per-unit usage counters:
 * - Priya Verma: 2 completed on CAM001, 1 on CAM002.
 * - Aarav Sharma: 1 completed on CAM001, 1 on ROB001.
 * - Rohan Meena: 0 completed on CAM001, 1 on 3DP001.
 * - Ananya Gupta: 0 completed on CAM001, 1 on LAP001.
 * - Karan Singh: 0 completed on CAM001 (lacks AV & Cinema Equipment Operator certification).
 */
export const initialBookings: Booking[] = [
  // --- HISTORICAL COMPLETED BOOKINGS (Powers FairShare usage counts per unit) ---
  {
    id: 'bk-hist-01',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-102',
    userName: 'Priya Verma',
    userEmail: 'priya.verma@poornima.edu.in',
    userDepartment: 'Electronics & Communication Engineering',
    startTime: '2026-10-15T09:00:00Z',
    endTime: '2026-10-15T15:00:00Z',
    purpose: 'Campus Green Energy Initiative documentary filming.',
    projectType: 'Departmental Research Project',
    status: 'Completed',
    checkInVerificationCode: 'CHK-3011',
    checkInTime: '2026-10-15T09:05:00Z',
    checkOutTime: '2026-10-15T14:50:00Z',
    preCheckCondition: 'Lens glass pristine; 3 batteries verified.',
    postCheckCondition: 'Returned in flawless condition with all caps attached.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-13T10:00:00Z'
  },
  {
    id: 'bk-hist-02',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-102',
    userName: 'Priya Verma',
    userEmail: 'priya.verma@poornima.edu.in',
    userDepartment: 'Electronics & Communication Engineering',
    startTime: '2026-10-22T10:00:00Z',
    endTime: '2026-10-22T16:00:00Z',
    purpose: 'Smart Jaipur City IoT sensor nodes showcase shoot.',
    projectType: 'Departmental Research Project',
    status: 'Completed',
    checkInVerificationCode: 'CHK-4122',
    checkInTime: '2026-10-22T10:10:00Z',
    checkOutTime: '2026-10-22T15:45:00Z',
    preCheckCondition: 'All components inspected in clean working order.',
    postCheckCondition: 'Sensor glass spotless, battery pack recharged.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-20T11:00:00Z'
  },
  {
    id: 'bk-hist-03',
    resourceId: 'CAM002', // Note: CAM002, NOT CAM001! Proves usage is tracked strictly per unit ID.
    resourceName: 'Canon EOS R6 Mark II Documentary & Gimbal Kit (Unit #2)',
    resourceCategory: 'Cameras',
    userId: 'user-std-102',
    userName: 'Priya Verma',
    userEmail: 'priya.verma@poornima.edu.in',
    userDepartment: 'Electronics & Communication Engineering',
    startTime: '2026-10-18T11:00:00Z',
    endTime: '2026-10-18T17:00:00Z',
    purpose: 'High-speed sports trial capture at college sports grounds.',
    projectType: 'Student Club Project',
    status: 'Completed',
    checkInVerificationCode: 'CHK-8921',
    checkInTime: '2026-10-18T11:05:00Z',
    checkOutTime: '2026-10-18T16:50:00Z',
    preCheckCondition: 'Gimbal motors balanced; RF lenses clean.',
    postCheckCondition: 'Returned on schedule in good working order.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-16T14:00:00Z'
  },
  {
    id: 'bk-hist-04',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-101',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@poornima.edu.in',
    userDepartment: 'Computer Science & Engineering',
    startTime: '2026-10-12T13:00:00Z',
    endTime: '2026-10-12T17:00:00Z',
    purpose: 'Collecting 4K image datasets for edge vision model training.',
    projectType: 'Senior Capstone Project',
    status: 'Completed',
    checkInVerificationCode: 'CHK-5519',
    checkInTime: '2026-10-12T13:02:00Z',
    checkOutTime: '2026-10-12T16:55:00Z',
    preCheckCondition: 'Full kit verified.',
    postCheckCondition: 'Memory card formatted, lenses wiped.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'bk-hist-05',
    resourceId: '3DP001',
    resourceName: 'Bambu Lab X1-Carbon Combo High-Speed 3D Printer (Unit #1)',
    resourceCategory: '3D Printers',
    userId: 'user-std-103',
    userName: 'Rohan Meena',
    userEmail: 'rohan.meena@poornima.edu.in',
    userDepartment: 'Mechanical & Mechatronics Engineering',
    startTime: '2026-10-25T14:00:00Z',
    endTime: '2026-10-25T18:00:00Z',
    purpose: 'SAE drone bracket carbon fiber test coupon.',
    projectType: 'Robotics & SAE Team Prototype',
    status: 'Completed',
    checkInVerificationCode: 'CHK-7744',
    checkInTime: '2026-10-25T14:05:00Z',
    checkOutTime: '2026-10-25T17:50:00Z',
    preCheckCondition: 'PEI sheet clean.',
    postCheckCondition: 'Nozzle purged; bed wiped with isopropanol.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-24T16:00:00Z'
  },
  {
    id: 'bk-hist-06',
    resourceId: 'LAP001',
    resourceName: 'Dell XPS 17 Mobile Workstation (RTX 4080 Rig #1)',
    resourceCategory: 'Laptops',
    userId: 'user-std-104',
    userName: 'Ananya Gupta',
    userEmail: 'ananya.gupta@poornima.edu.in',
    userDepartment: 'Information Technology & AI',
    startTime: '2026-10-26T10:00:00Z',
    endTime: '2026-10-27T10:00:00Z',
    purpose: 'Transformer model quantization benchmark testing.',
    projectType: 'Departmental Research Project',
    status: 'Completed',
    checkInVerificationCode: 'CHK-9102',
    checkInTime: '2026-10-26T10:15:00Z',
    checkOutTime: '2026-10-27T09:45:00Z',
    preCheckCondition: 'Chassis spotless, charger included.',
    postCheckCondition: 'Scratch space purged, returned in sleeve.',
    handoverVerifiedBy: 'Rahul Sharma',
    returnConfirmedBy: 'Rahul Sharma',
    createdAt: '2026-10-25T09:00:00Z'
  },

  // --- ACTIVE CHECKED IN BOOKINGS (For Check-in / Check-out testing) ---
  {
    id: 'bk-active-102',
    resourceId: 'LAP002',
    resourceName: 'Apple MacBook Pro 16" (M3 Max Media Workstation #2)',
    resourceCategory: 'Laptops',
    userId: 'user-std-101',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@poornima.edu.in',
    userDepartment: 'Computer Science & Engineering',
    startTime: '2026-10-29T18:00:00Z',
    endTime: '2026-10-30T18:00:00Z',
    purpose: 'Neural network weight fine-tuning and benchmark visualization.',
    projectType: 'Senior Capstone Project',
    status: 'Checked In',
    checkInTime: '2026-10-29T18:15:00Z',
    checkInVerificationCode: 'CHK-4190',
    preCheckCondition: 'Pristine aluminum casing; 100% battery; padded sleeve supplied.',
    handoverVerifiedBy: 'Rahul Sharma',
    createdAt: '2026-10-29T15:00:00Z'
  },
  {
    id: 'bk-active-104',
    resourceId: '3DP001',
    resourceName: 'Bambu Lab X1-Carbon Combo High-Speed 3D Printer (Unit #1)',
    resourceCategory: '3D Printers',
    userId: 'user-std-103',
    userName: 'Rohan Meena',
    userEmail: 'rohan.meena@poornima.edu.in',
    userDepartment: 'Mechanical & Mechatronics Engineering',
    startTime: '2026-10-29T20:00:00Z',
    endTime: '2026-10-30T02:00:00Z',
    purpose: 'Carbon-fiber reinforced drone arm bracket for national SAE competition.',
    projectType: 'Robotics & SAE Team Prototype',
    status: 'Checked In',
    checkInTime: '2026-10-29T20:05:00Z',
    checkInVerificationCode: 'CHK-6621',
    preCheckCondition: 'Clean textured PEI plate; black carbon filament loaded.',
    handoverVerifiedBy: 'Rahul Sharma',
    createdAt: '2026-10-29T19:00:00Z'
  },

  // --- APPROVED BOOKING (Ready for Check-in testing) ---
  {
    id: 'bk-app-201',
    resourceId: 'ROB001',
    resourceName: 'Advanced Robotics & Cyber-Physical Systems Lab',
    resourceCategory: 'Laboratories',
    userId: 'user-std-101',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@poornima.edu.in',
    userDepartment: 'Computer Science & Engineering',
    startTime: '2026-10-30T14:00:00Z',
    endTime: '2026-10-30T17:00:00Z',
    purpose: 'Senior Capstone testing: Autonomous UR5e pick-and-place with vision AI feedback.',
    projectType: 'Senior Capstone Project',
    status: 'Approved',
    checkInVerificationCode: 'CHK-7824',
    ownerNotes: 'Safety induction certified; approved by Rahul Sharma.',
    createdAt: '2026-10-28T09:30:00Z'
  },

  // --- 5-STUDENT COMPETING DEMO SCENARIO FOR CAM001 ---
  // Slot: Tomorrow 14:00 - 18:00 IST (2026-10-31T14:00:00Z)
  // Competing students:
  // 1. Rohan Meena (0 prior on CAM001, requested 09:15 AM) -> Rank 1
  // 2. Ananya Gupta (0 prior on CAM001, requested 10:30 AM) -> Rank 2
  // 1. Rohan Meena (0 prior on CAM001, requested 09:15 AM IST) -> Rank 1
  // 2. Ananya Gupta (0 prior on CAM001, requested 10:30 AM IST) -> Rank 2
  // 3. Aarav Sharma (1 prior on CAM001, requested 11:00 AM IST) -> Rank 3
  // 4. Priya Verma (2 prior on CAM001, requested 11:45 AM IST) -> Rank 4
  // 5. Karan Singh (Missing AV certification, requested 12:15 PM IST) -> Ineligible / Disqualified
  {
    id: 'bk-comp-01',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-103',
    userName: 'Rohan Meena',
    userEmail: 'rohan.meena@poornima.edu.in',
    userDepartment: 'Mechanical & Mechatronics Engineering',
    startTime: '2026-10-31T14:00:00Z',
    endTime: '2026-10-31T18:00:00Z',
    purpose: 'High-speed optical recording of aerodynamic flutter on 3D printed wing profiles.',
    projectType: 'Departmental Research Project',
    status: 'Pending Approval',
    checkInVerificationCode: 'CHK-9041',
    fairShareRank: 1,
    fairShareExplanation: 'Rank 1: 0 prior sessions on CAM001. Requested earlier at 09:15 AM IST. Fully certified.',
    createdAt: '2026-10-30T09:15:00+05:30'
  },
  {
    id: 'bk-comp-02',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-104',
    userName: 'Ananya Gupta',
    userEmail: 'ananya.gupta@poornima.edu.in',
    userDepartment: 'Information Technology & AI',
    startTime: '2026-10-31T14:00:00Z',
    endTime: '2026-10-31T18:00:00Z',
    purpose: 'Collecting multiview RGB calibration footage for 3D Gaussian splatting research.',
    projectType: 'Course Research & Thesis',
    status: 'Pending Approval',
    checkInVerificationCode: 'CHK-9042',
    fairShareRank: 2,
    fairShareExplanation: 'Rank 2: 0 prior sessions on CAM001. Requested later at 10:30 AM IST. Fully certified.',
    createdAt: '2026-10-30T10:30:00+05:30'
  },
  {
    id: 'bk-comp-03',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-101',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@poornima.edu.in',
    userDepartment: 'Computer Science & Engineering',
    startTime: '2026-10-31T14:00:00Z',
    endTime: '2026-10-31T18:00:00Z',
    purpose: 'Stereoscopic camera baseline testing for autonomous rover navigation.',
    projectType: 'Senior Capstone Project',
    status: 'Pending Approval',
    checkInVerificationCode: 'CHK-9043',
    fairShareRank: 3,
    fairShareExplanation: 'Rank 3: 1 prior completed session on CAM001. Requested at 11:00 AM IST. Fully certified.',
    createdAt: '2026-10-30T11:00:00+05:30'
  },
  {
    id: 'bk-comp-04',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-102',
    userName: 'Priya Verma',
    userEmail: 'priya.verma@poornima.edu.in',
    userDepartment: 'Electronics & Communication Engineering',
    startTime: '2026-10-31T14:00:00Z',
    endTime: '2026-10-31T18:00:00Z',
    purpose: 'Filming promotional interview series for Jaipur Clean Tech Expo.',
    projectType: 'Student Technical Seminar',
    status: 'Pending Approval',
    checkInVerificationCode: 'CHK-9044',
    fairShareRank: 4,
    fairShareExplanation: 'Rank 4: 2 prior completed sessions on CAM001 (CAM002 usage does not penalize). Requested at 11:45 AM IST. Fully certified.',
    createdAt: '2026-10-30T11:45:00+05:30'
  },
  {
    id: 'bk-comp-05',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    resourceCategory: 'Cameras',
    userId: 'user-std-105',
    userName: 'Karan Singh',
    userEmail: 'karan.singh@poornima.edu.in',
    userDepartment: 'Civil Engineering',
    startTime: '2026-10-31T14:00:00Z',
    endTime: '2026-10-31T18:00:00Z',
    purpose: 'Capturing structural deflection benchmarks on reinforced concrete beams.',
    projectType: 'Academic Research',
    status: 'Pending Approval',
    checkInVerificationCode: 'CHK-9045',
    fairShareRank: 99,
    fairShareExplanation: 'Disqualified: Missing prerequisite certification [AV & Cinema Equipment Operator]. Requested at 12:15 PM IST.',
    createdAt: '2026-10-30T12:15:00+05:30'
  }
];

export const initialConditionReports: ConditionReport[] = [
  {
    id: 'cr-201',
    bookingId: 'bk-hist-01',
    resourceId: 'CAM001',
    resourceName: 'Sony Alpha 7 IV Full-Frame Cinema Kit (Unit #1)',
    reportedBy: 'Priya Verma',
    reportedByRole: 'student',
    reportType: 'Check-out Inspection',
    preCondition: 'Clean lens glass; all 3 batteries charged.',
    postCondition: 'Wiped clean with microfiber cloth; all lens caps securely in place.',
    description: 'Filming session concluded smoothly. Battery charger functioned properly. No issues.',
    severity: 'Low',
    status: 'Resolved',
    resolutionNotes: 'Custody staff verified return in good order.',
    createdAt: '2026-10-15T15:00:00Z'
  },
  {
    id: 'cr-202',
    bookingId: 'bk-hist-03',
    resourceId: 'CAM002',
    resourceName: 'Canon EOS R6 Mark II Documentary & Gimbal Kit (Unit #2)',
    reportedBy: 'Rahul Sharma',
    reportedByRole: 'owner',
    reportType: 'Damage Incident',
    preCondition: 'Gimbal motors balanced; thumbscrews smooth.',
    postCondition: 'Slight friction on quick-release Arca Swiss dovetail clamp.',
    description: 'Minor mechanical wear identified on quick-release thumbscrew clamp thread. Safe to operate but replacement thumbscrew advised.',
    severity: 'Medium',
    status: 'Investigating',
    resolutionNotes: 'Replacement thumbscrew kit ordered from certified distributor (Est. ₹1,200).',
    createdAt: '2026-10-18T17:15:00Z',
    aiSummary: {
      severity: 'Medium',
      executiveSummary: 'Mechanical thread wear identified on Canon R6 Mk II gimbal dovetail clamp.',
      potentialRootCause: 'Cross-threading from rapid overtightening during outdoor trial shoot.',
      recommendedAction: 'Apply dry lubricant or swap secondary plate with depot spare.',
      estimatedDowntimeHours: 2
    }
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'act-101',
    timestamp: '2026-10-30T10:30:00Z',
    actorName: 'Ananya Gupta',
    actorRole: 'student',
    action: 'Submitted Booking Request',
    target: 'Sony Alpha 7 IV Cinema Kit (CAM001)',
    details: 'Requested Oct 31, 14:00 - 18:00 IST for 3D Gaussian Splatting dataset capture. Evaluated by FairShare: 0 prior bookings on CAM001.',
    category: 'booking',
    bookingId: 'bk-comp-02',
    resourceId: 'CAM001'
  },
  {
    id: 'act-102',
    timestamp: '2026-10-30T09:15:00Z',
    actorName: 'Rohan Meena',
    actorRole: 'student',
    action: 'Submitted Booking Request',
    target: 'Sony Alpha 7 IV Cinema Kit (CAM001)',
    details: 'Requested Oct 31, 14:00 - 18:00 IST for wing flutter recording. Evaluated by FairShare: 0 prior bookings on CAM001.',
    category: 'booking',
    bookingId: 'bk-comp-01',
    resourceId: 'CAM001'
  },
  {
    id: 'act-103',
    timestamp: '2026-10-30T08:30:00Z',
    actorName: 'Karan Singh',
    actorRole: 'student',
    action: 'Submitted Booking Request',
    target: 'Sony Alpha 7 IV Cinema Kit (CAM001)',
    details: 'Requested Oct 31, 14:00 - 18:00 IST. FairShare flagged: Missing AV & Cinema Equipment Operator certification.',
    category: 'booking',
    bookingId: 'bk-comp-05',
    resourceId: 'CAM001'
  },
  {
    id: 'act-104',
    timestamp: '2026-10-29T20:05:00Z',
    actorName: 'Rahul Sharma',
    actorRole: 'owner',
    action: 'Verified Equipment Handover',
    target: 'Bambu Lab X1-Carbon (3DP001)',
    details: 'Verified physical check-in and handover with Rohan Meena (PCE2026ST003). PIN CHK-6621 validated.',
    category: 'checkin',
    bookingId: 'bk-active-104',
    resourceId: '3DP001'
  },
  {
    id: 'act-105',
    timestamp: '2026-10-29T18:15:00Z',
    actorName: 'Rahul Sharma',
    actorRole: 'owner',
    action: 'Verified Equipment Handover',
    target: 'MacBook Pro 16" (LAP002)',
    details: 'Verified physical loan custody with Aarav Sharma (PCE2026ST001). Pre-condition photo and sleeve verified.',
    category: 'checkin',
    bookingId: 'bk-active-102',
    resourceId: 'LAP002'
  },
  {
    id: 'act-106',
    timestamp: '2026-10-28T09:30:00Z',
    actorName: 'Rahul Sharma',
    actorRole: 'owner',
    action: 'Approved Booking Request',
    target: 'Advanced Robotics Lab (ROB001)',
    details: 'Approved reservation for Aarav Sharma after verifying Level 2 safety induction.',
    category: 'approval',
    bookingId: 'bk-app-201',
    resourceId: 'ROB001'
  }
];
