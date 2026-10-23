export type ScreenType = 
  | 'dashboard'
  | 'members'
  | 'member-detail'
  | 'memberships'
  | 'payments'
  | 'notifications'
  | 'plans'
  | 'settings'
  | 'add-member';

export type MemberStatus = 'active' | 'expiring' | 'expired';

export interface Member {
  id: string; // e.g. "MU-1088"
  numericId?: string; // e.g. "MU-2024-8891"
  name: string;
  avatar?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not';
  phone: string;
  email: string;
  dob?: string;
  age?: number;
  joinedDate: string; // "15 Jan 2023"
  tenureString?: string; // "(1 yr 9 mos)"
  status: MemberStatus;
  planTier: string; // "Pro Fitness Elite", "Yearly Prime", etc.
  planName: string; // "Yearly Unlimited Pro Fitness"
  planPrice: number;
  paymentMethod: string;
  paymentState: 'CLEAR' | 'PENDING' | 'OVERDUE';
  expiryDate: string; // "14 Jan 2025"
  daysRemaining: number;
  startDate: string;
  lockerNo?: string;
  assignedTrainer?: string;
  nfcTag?: string;
  barcode?: string;
  fingerprintRegistered?: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship?: string;
  };
  address?: string;
  fitnessGoal?: string;
  lifetimeVisits: number;
  complianceRate: number;
  preferredSlot: string; // "Morning Slot (7 AM)" or "Evening Peak (05:00 PM – 09:30 PM)"
  branch: string; // "Koramangala Branch" or "Indiranagar Flagship"
  accessGranted?: boolean;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // "Today 07:12 AM"
  time: string;
  gate: string; // "Gate 1 (RFID Turnstile A)"
  accessKey: string; // "#NFC-9981-L"
  durationMinutes?: number;
  status: 'On-Floor' | 'Completed' | 'Denied';
  rawTimestamp: number;
}

export interface MessageLog {
  id: string;
  memberId: string;
  title: string;
  date: string;
  type: 'scheduled' | 'welcome' | 'perk' | 'custom' | 'alert';
  message: string;
  status: 'Delivered & Read' | 'Pending' | 'Redeemed' | 'Scheduled';
  channel: 'WhatsApp' | 'SMS' | 'Email';
}

export interface RenewalRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  avatar?: string;
  typeBadge: string; // "Renewal (#3)", "Renewal (#2)", "New Membership"
  ledgerNode: string;
  planName: string;
  oldExpiry: string;
  extendedExpiry: string;
  totalFee: number;
  paymentMode: string; // "PAID VIA UPI", "PAID VIA CASH", "CHEQUE CLEARED", "PENDING PAYMENT", "PAID VIA POS CARD"
  paymentStatus: 'PAID' | 'PENDING' | 'CLEARED' | 'FAILED';
  renewedByStaff: string; // "Rahul Verma", "Amit Saxena", "Priya Menon"
  date: string;
  invoiceNo: string;
}

export interface PaymentTransaction {
  id: string; // "TXN-2024-8841"
  date: string; // "27 Oct 2024 • 11:20 AM"
  memberId: string;
  memberName: string;
  memberPhone?: string;
  branch: string;
  planDescription: string; // "Quarterly Renewal + 12 PT Sessions (Coach Vikram)"
  amount: number;
  paymentMethod: string; // "UPI - GPay", "UPI - PhonePe", "UPI - Paytm", "Counter Cash", "POS Card", "UPI - BHIM"
  utrOrRef: string; // "UTR: 429910482910"
  status: 'Verified' | 'Pending Verification' | 'Failed';
  verifiedBy?: string; // "Rahul"
  failureReason?: string;
}

export interface PlanTierOption {
  id: string;
  name: string;
  durationDays: number;
  durationLabel: string;
  price: number;
  periodLabel: string;
  badge?: string;
  popular?: boolean;
}
