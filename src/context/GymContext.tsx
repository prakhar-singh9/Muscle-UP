import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Member, 
  ScreenType, 
  PaymentTransaction, 
  RenewalRecord, 
  AttendanceRecord, 
  MessageLog 
} from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { listGymMembers, createGymMember, GymMemberRow } from '../lib/gymData';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PAYMENTS, 
  INITIAL_RENEWALS, 
  INITIAL_ATTENDANCE_LOGS, 
  INITIAL_MESSAGE_LOGS 
} from '../data/mockData';

interface GymContextType {
  // Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  navigateToMember: (memberId: string) => void;
  navigateToRenewal: (memberId?: string) => void;

  // Data
  members: Member[];
  selectedMember: Member | undefined;
  renewals: RenewalRecord[];
  payments: PaymentTransaction[];
  attendanceLogs: AttendanceRecord[];
  messageLogs: MessageLog[];

  // Gym state
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  currentFloorLoad: number;
  maxFloorCap: number;
  todayJoinedCount: number;
  todayCounterUpi: number;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Actions
  addMember: (member: Partial<Member>) => Member;
  registerMember: (member: Partial<Member>) => Promise<Member>;
  updateMember: (id: string, updates: Partial<Member>) => void;
  renewMembership: (params: {
    memberId: string;
    planName: string;
    durationDays: number;
    amount: number;
    paymentMode: string;
  }) => void;
  recordPayment: (params: {
    memberId: string;
    memberName: string;
    amount: number;
    planDescription: string;
    paymentMethod: string;
    utrOrRef: string;
  }) => void;
  verifyPayment: (txnId: string) => void;
  rejectPayment: (txnId: string) => void;
  checkInMember: (memberIdOrTag: string) => { success: boolean; message: string; member?: Member };
  sendWhatsAppMessage: (memberId: string, title: string, message: string) => void;
  triggerBatchRenewalReminder: () => number;

  // Modals
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  activeInvoiceData: any | null;
  setActiveInvoiceData: (data: any | null) => void;
  isBulkReminderOpen: boolean;
  setIsBulkReminderOpen: (open: boolean) => void;
  triggerConfetti: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persisted or mock state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('members');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('MU-1088');
  const [currentBranch, setCurrentBranch] = useState<string>('Koramangala Branch');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const [members, setMembers] = useState<Member[]>(() => {
    if (isSupabaseConfigured) return [];
    const saved = localStorage.getItem('muscleup_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const mapDatabaseMember = (row: GymMemberRow): Member => {
    const joined = new Date(row.created_at);
    const joinedDate = Number.isNaN(joined.getTime()) ? 'Unknown' : joined.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const age = row.date_of_birth ? Math.max(0, Math.floor((Date.now() - new Date(row.date_of_birth).getTime()) / 31557600000)) : undefined;
    return {
      id: row.id, numericId: String(row.member_number), name: row.full_name, gender: row.gender,
      phone: row.phone, email: row.email ?? '', dob: row.date_of_birth ?? undefined, age,
      joinedDate, tenureString: '', status: 'expired', planTier: 'No membership', planName: 'No membership',
      planPrice: 0, paymentMethod: 'Not recorded', paymentState: 'PENDING', expiryDate: 'No membership',
      daysRemaining: 0, startDate: joinedDate, lockerNo: row.locker_number ?? undefined,
      assignedTrainer: row.assigned_trainer ?? undefined, emergencyContact: {
        name: row.emergency_contact_name ?? '', phone: row.emergency_contact_phone ?? '',
        relationship: row.emergency_contact_relationship ?? undefined,
      }, address: row.address ?? undefined, fitnessGoal: row.fitness_goal ?? undefined,
      lifetimeVisits: 0, complianceRate: 0, preferredSlot: row.preferred_slot ?? 'Not set',
      branch: row.branch, accessGranted: false, notes: row.notes ?? undefined,
    };
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    listGymMembers().then(rows => {
      if (!cancelled) setMembers(rows.map(mapDatabaseMember));
    }).catch(error => console.error('Unable to load gym members from Supabase:', error));
    return () => { cancelled = true; };
  }, []);

  const [renewals, setRenewals] = useState<RenewalRecord[]>(() => {
    const saved = localStorage.getItem('muscleup_renewals');
    return saved ? JSON.parse(saved) : INITIAL_RENEWALS;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('muscleup_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('muscleup_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
  });

  const [messageLogs, setMessageLogs] = useState<MessageLog[]>(() => {
    const saved = localStorage.getItem('muscleup_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGE_LOGS;
  });

  const [currentFloorLoad, setCurrentFloorLoad] = useState<number>(64);
  const maxFloorCap = 120;
  const [todayJoinedCount, setTodayJoinedCount] = useState<number>(12);
  const [todayCounterUpi, setTodayCounterUpi] = useState<number>(48200);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [activeInvoiceData, setActiveInvoiceData] = useState<any | null>(null);
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);

  // Save changes
  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('muscleup_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('muscleup_renewals', JSON.stringify(renewals));
  }, [renewals]);

  useEffect(() => {
    localStorage.setItem('muscleup_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('muscleup_attendance', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('muscleup_messages', JSON.stringify(messageLogs));
  }, [messageLogs]);

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  const navigateToMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentScreen('member-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRenewal = (memberId?: string) => {
    if (memberId) {
      setSelectedMemberId(memberId);
    }
    setCurrentScreen('memberships');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#65a30d', '#84cc16', '#a3e635', '#0f172a', '#3b82f6']
      });
    } catch {
      // ignore
    }
  };

  const addMember = (data: Partial<Member>): Member => {
    const count = members.length + 1;
    const newId = `MU-${2040 + count}`;
    const newMember: Member = {
      id: newId,
      name: data.name || 'New Member',
      avatar: data.avatar || `https://images.unsplash.com/photo-${1534528741775 + count}?auto=format&fit=crop&w=250&q=80`,
      gender: data.gender || 'Male',
      phone: data.phone || '+91 98000 00000',
      email: data.email || 'member@example.com',
      dob: data.dob || '1995-01-01',
      age: data.age || 29,
      joinedDate: 'Today',
      tenureString: '(1st month)',
      status: 'active',
      planTier: data.planTier || 'Yearly Elite All-Access',
      planName: data.planName || 'Yearly Elite All-Access',
      planPrice: data.planPrice || 19999,
      paymentMethod: data.paymentMethod || 'Paid via UPI • GPay',
      paymentState: 'CLEAR',
      startDate: data.startDate || '27 Oct 2024',
      expiryDate: data.expiryDate || '26 Oct 2025',
      daysRemaining: 365,
      lockerNo: data.lockerNo || `Locker #${100 + count}`,
      assignedTrainer: data.assignedTrainer || 'Coach Sandeep Kumar',
      nfcTag: `#NFC-${Math.floor(1000 + Math.random() * 9000)}-K`,
      barcode: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      fingerprintRegistered: true,
      emergencyContact: data.emergencyContact || {
        name: 'Family Contact',
        relationship: 'Spouse',
        phone: '+91 98111 22334'
      },
      address: data.address || 'Bengaluru, Karnataka',
      fitnessGoal: data.fitnessGoal || 'General strength and health',
      lifetimeVisits: 1,
      complianceRate: 100,
      preferredSlot: data.preferredSlot || 'Evening Peak (05:00 PM – 09:30 PM)',
      branch: data.branch || 'Indiranagar Center',
      accessGranted: true
    };

    setMembers(prev => [newMember, ...prev]);
    setTodayJoinedCount(prev => prev + 1);
    setCurrentFloorLoad(prev => Math.min(maxFloorCap, prev + 1));
    triggerConfetti();
    return newMember;
  };

  const registerMember = async (data: Partial<Member>): Promise<Member> => {
    if (!isSupabaseConfigured) return addMember(data);
    const row = await createGymMember({
      full_name: data.name ?? '', phone: data.phone ?? '', email: data.email || null,
      date_of_birth: data.dob || null, gender: data.gender ?? 'Prefer not',
      address: data.address || null, emergency_contact_name: data.emergencyContact?.name || null,
      emergency_contact_relationship: data.emergencyContact?.relationship || null,
      emergency_contact_phone: data.emergencyContact?.phone || null,
      fitness_goal: data.fitnessGoal || null, preferred_slot: data.preferredSlot || null,
      locker_number: data.lockerNo || null, assigned_trainer: data.assignedTrainer || null,
      branch: data.branch || currentBranch, notes: data.notes || null,
    });
    const created: Member = {
      id: row.id, numericId: String(row.member_number), name: row.full_name, gender: row.gender,
      phone: row.phone, email: row.email ?? '', dob: row.date_of_birth ?? undefined,
      joinedDate: new Date(row.created_at).toLocaleDateString('en-IN'), status: 'expired',
      planTier: 'No membership', planName: 'No membership', planPrice: 0,
      paymentMethod: 'Not recorded', paymentState: 'PENDING', expiryDate: 'No membership',
      daysRemaining: 0, startDate: new Date(row.created_at).toLocaleDateString('en-IN'),
      emergencyContact: { name: row.emergency_contact_name ?? '', phone: row.emergency_contact_phone ?? '', relationship: row.emergency_contact_relationship ?? undefined },
      address: row.address ?? undefined, fitnessGoal: row.fitness_goal ?? undefined,
      lifetimeVisits: 0, complianceRate: 0, preferredSlot: row.preferred_slot ?? 'Not set', branch: row.branch,
      lockerNo: row.locker_number ?? undefined, assignedTrainer: row.assigned_trainer ?? undefined,
      notes: row.notes ?? undefined, accessGranted: false,
    };
    setMembers(prev => [created, ...prev]);
    return created;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const renewMembership = ({
    memberId,
    planName,
    durationDays,
    amount,
    paymentMode
  }: {
    memberId: string;
    planName: string;
    durationDays: number;
    amount: number;
    paymentMode: string;
  }) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newRecord: RenewalRecord = {
      id: `REN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: member.id,
      memberName: member.name,
      memberPhone: member.phone,
      avatar: member.avatar,
      typeBadge: `Renewal (#${Math.floor(2 + Math.random() * 4)})`,
      ledgerNode: `Ledger Node #${Math.floor(8800 + Math.random() * 200)}`,
      planName: planName,
      oldExpiry: member.expiryDate,
      extendedExpiry: '30 Oct 2025',
      totalFee: amount,
      paymentMode: paymentMode.toUpperCase(),
      paymentStatus: 'PAID',
      renewedByStaff: 'Rahul Verma',
      date: 'Today',
      invoiceNo: `INV-2024-${Math.floor(9000 + Math.random() * 999)}`
    };

    setRenewals(prev => [newRecord, ...prev]);

    // Update member's status & expiry
    updateMember(memberId, {
      status: 'active',
      planName: planName,
      daysRemaining: durationDays,
      paymentState: 'CLEAR',
      expiryDate: '30 Oct 2025'
    });

    // Also add to payments ledger
    const newTxn: PaymentTransaction = {
      id: `TXN-2024-${Math.floor(8800 + Math.random() * 200)}`,
      date: 'Today • Just now',
      memberId: member.id,
      memberName: member.name,
      branch: member.branch || 'Indiranagar',
      planDescription: `${planName} Extension`,
      amount: amount,
      paymentMethod: paymentMode,
      utrOrRef: `UTR: ${Math.floor(429900000000 + Math.random() * 99999999)}`,
      status: 'Verified',
      verifiedBy: 'Rahul'
    };
    setPayments(prev => [newTxn, ...prev]);
    setTodayCounterUpi(prev => prev + amount);

    triggerConfetti();
  };

  const recordPayment = ({
    memberId,
    memberName,
    amount,
    planDescription,
    paymentMethod,
    utrOrRef
  }: {
    memberId: string;
    memberName: string;
    amount: number;
    planDescription: string;
    paymentMethod: string;
    utrOrRef: string;
  }) => {
    const newTxn: PaymentTransaction = {
      id: `TXN-2024-${Math.floor(8800 + Math.random() * 200)}`,
      date: 'Today • Just now',
      memberId,
      memberName,
      branch: 'Indiranagar',
      planDescription,
      amount,
      paymentMethod,
      utrOrRef: utrOrRef.startsWith('UTR') || utrOrRef.startsWith('Receipt') ? utrOrRef : `UTR: ${utrOrRef}`,
      status: 'Pending Verification'
    };

    setPayments(prev => [newTxn, ...prev]);
    triggerConfetti();
  };

  const verifyPayment = (txnId: string) => {
    setPayments(prev => prev.map(t => {
      if (t.id === txnId) {
        return { ...t, status: 'Verified', verifiedBy: 'Rahul' };
      }
      return t;
    }));
    setTodayCounterUpi(prev => prev + 8500);
  };

  const rejectPayment = (txnId: string) => {
    setPayments(prev => prev.map(t => {
      if (t.id === txnId) {
        return { ...t, status: 'Failed', failureReason: 'Declined by Admin Verification' };
      }
      return t;
    }));
  };

  const checkInMember = (memberIdOrTag: string) => {
    const term = memberIdOrTag.trim().toLowerCase();
    const member = members.find(m => 
      m.id.toLowerCase() === term || 
      m.name.toLowerCase().includes(term) ||
      m.phone.includes(term) ||
      m.nfcTag?.toLowerCase() === term ||
      m.barcode?.replace(/\s+/g, '') === term.replace(/\s+/g, '')
    );

    if (!member) {
      return { success: false, message: 'Unrecognized Member ID or NFC Tag' };
    }

    if (member.status === 'expired') {
      return { 
        success: false, 
        message: `Gate Access Denied: Membership expired on ${member.expiryDate}. Please renew.`,
        member 
      };
    }

    const newLog: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      date: 'Today Just Now',
      time: 'Floor Check-in',
      gate: 'Gate 1 (RFID Turnstile A)',
      accessKey: member.nfcTag || '#NFC-AUTO',
      status: 'On-Floor',
      rawTimestamp: Date.now()
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setCurrentFloorLoad(prev => Math.min(maxFloorCap, prev + 1));
    updateMember(member.id, {
      lifetimeVisits: member.lifetimeVisits + 1
    });

    return { 
      success: true, 
      message: `Welcome, ${member.name}! Access granted via Turnstile A.`,
      member 
    };
  };

  const sendWhatsAppMessage = (memberId: string, title: string, message: string) => {
    const newLog: MessageLog = {
      id: `msg-${Date.now()}`,
      memberId,
      title,
      date: 'Today Just now',
      type: 'custom',
      message: `"${message}" Delivered & Read.`,
      status: 'Delivered & Read',
      channel: 'WhatsApp'
    };
    setMessageLogs(prev => [newLog, ...prev]);
    triggerConfetti();
  };

  const triggerBatchRenewalReminder = () => {
    const expiringCount = members.filter(m => m.status === 'expiring').length;
    // Add logs
    const newLog: MessageLog = {
      id: `msg-${Date.now()}`,
      memberId: 'ALL_EXPIRING',
      title: '1-Click Renewal Batch Broadcast',
      date: 'Today Just now',
      type: 'scheduled',
      message: `Automated WhatsApp template with dynamic UPI link sent to 38 expiring members. Expected recovery ₹1,84,500.`,
      status: 'Delivered & Read',
      channel: 'WhatsApp'
    };
    setMessageLogs(prev => [newLog, ...prev]);
    triggerConfetti();
    return expiringCount;
  };

  return (
    <GymContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedMemberId,
        setSelectedMemberId,
        navigateToMember,
        navigateToRenewal,
        members,
        selectedMember,
        renewals,
        payments,
        attendanceLogs,
        messageLogs,
        currentBranch,
        setCurrentBranch,
        currentFloorLoad,
        maxFloorCap,
        todayJoinedCount,
        todayCounterUpi,
        globalSearch,
        setGlobalSearch,
        addMember,
        registerMember,
        updateMember,
        renewMembership,
        recordPayment,
        verifyPayment,
        rejectPayment,
        checkInMember,
        sendWhatsAppMessage,
        triggerBatchRenewalReminder,
        isScannerOpen,
        setIsScannerOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        activeInvoiceData,
        setActiveInvoiceData,
        isBulkReminderOpen,
        setIsBulkReminderOpen,
        triggerConfetti
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
