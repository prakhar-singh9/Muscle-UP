import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Sparkles,
  Wifi,
  ChevronRight,
  ArrowRight,
  Send,
  Barcode
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types';

export const RegisterMemberScreen: React.FC = () => {
  const { 
    registerMember, 
    setCurrentScreen, 
    navigateToMember, 
    currentFloorLoad, 
    maxFloorCap, 
    todayJoinedCount, 
    currentBranch,
    setActiveInvoiceData 
  } = useGym();

  // Form Fields matching screenshot
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not'>('Male');

  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [joiningDate, setJoiningDate] = useState(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [membershipTier, setMembershipTier] = useState('No membership selected');
  const [batchSlot, setBatchSlot] = useState('');
  const [lockerAllocation, setLockerAllocation] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');

  // Checklist items
  const [checklist, setChecklist] = useState({
    aadhaar: true,
    phoneVerified: true,
    waiver: true,
    emergency: true,
    rfidAssigned: false
  });

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (recordPaymentImmediately: boolean) => {
    if (!fullName.trim()) {
      alert('Please enter member full name.');
      return;
    }

    const price = membershipTier.includes('19,999') ? 19999 : 11500;
    const planNameClean = membershipTier.split('@')[0].trim();

    setSaveError('');
    setIsSaving(true);
    try {
    const created = await registerMember({
      name: fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email,
      gender: gender,
      dob: dob,
      age: 30,
      planTier: 'Yearly Elite All-Access',
      planName: planNameClean,
      planPrice: price,
      paymentMethod: 'Paid via UPI • GPay',
      startDate: joiningDate,
      expiryDate: '26 Oct 2025',
      lockerNo: lockerAllocation,
      assignedTrainer: 'Coach Sandeep Kumar',
      address: address,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone.startsWith('+91') ? emergencyPhone : `+91 ${emergencyPhone}`,
        relationship: 'Spouse'
      },
      fitnessGoal: fitnessGoal,
      preferredSlot: batchSlot,
      branch: currentBranch
    });

    if (recordPaymentImmediately) {
      setActiveInvoiceData({
        invoiceNo: `INV-2024-${Math.floor(9000 + Math.random() * 999)}`,
        memberName: created.name,
        memberId: created.id,
        memberPhone: created.phone,
        planName: created.planName,
        amount: created.planPrice,
        paymentMode: 'UPI - GPay',
        date: 'Today'
      });
    }

    navigateToMember(created.id);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save member. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <button onClick={() => setCurrentScreen('members')} className="hover:text-slate-800">
              MEMBERS
            </button>
            <span>&gt;</span>
            <span className="text-slate-900 font-bold">ADD MEMBER</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Register New Member
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-xs font-bold border border-slate-200">
              Desk Terminal #04
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick reception registration form for new gym joiners. All asterisks (*) are required fields.
          </p>
        </div>

        {/* Top Right Live Telemetry */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              CURRENT FLOOR LOAD
            </span>
            <div className="text-sm font-extrabold text-slate-900 font-jakarta flex items-center gap-1.5 font-tnum mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{currentFloorLoad} / {maxFloorCap} Cap</span>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TODAY JOINED
            </span>
            <div className="text-sm font-extrabold text-[#65a30d] font-jakarta font-tnum mt-0.5">
              {todayJoinedCount} Members
            </div>
          </div>
        </div>
      </div>

      {/* Staff Tip WhatsApp Banner */}
      <div className="bg-lime-50/70 border border-lime-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#65a30d] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 font-jakarta">
              Staff Tip: WhatsApp Gateway Active
            </div>
            <p className="text-slate-600 mt-0.5 leading-snug">
              Verify Indian mobile number for automated WhatsApp expiry reminders, welcome PDF locker pin, and tax invoice generation.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-[#65a30d] font-bold bg-white px-3 py-1 rounded-full border border-lime-200 shadow-2xs">
          <span>✓</span>
          <span>SMS/WA Sync Enabled</span>
        </div>
      </div>

      {saveError && <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm">{saveError}</div>}

      {/* Form Content: Left 3-Steps (8 cols) + Right Card & Checklist (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7-8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* STEP 1: Personal Identification */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#65a30d] text-white flex items-center justify-center font-bold text-xs font-jakarta">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-jakarta">
                    Personal Identification
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Core demographics and biometric registration metadata
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Step 1 of 3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">👤</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Kapoor"
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Government-issued name for branch roster lookup
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex">
                  <span className="h-10 px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l flex items-center text-xs font-bold text-slate-700">
                    🇮🇳 +91
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-r text-xs font-bold text-slate-900 font-tnum focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Used for turnstile biometric &amp; OTP verification
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun.kapoor@example.com"
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Receives monthly invoice &amp; tax breakdown
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Date of Birth <span className="text-[10px] font-normal text-slate-400">(DD/MM/YYYY)</span>
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="14/08/1994"
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 font-tnum focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Calculated Age: 30 Yrs (Adult Category)
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                Gender Identity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Male', 'Female', 'Other', 'Prefer not'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      gender === g
                        ? 'border-[#65a30d] bg-lime-50 text-[#65a30d] font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{g === 'Male' ? '♂ Male' : g === 'Female' ? '♀ Female' : g}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: Address & Emergency Escalation */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#65a30d] text-white flex items-center justify-center font-bold text-xs font-jakarta">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-jakarta">
                    Address &amp; Emergency Escalation
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Required safety contact and regional locality data
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Step 2 of 3
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Kavita Kapoor (Spouse)"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Relationship explicitly indicated
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Emergency Contact Phone
                </label>
                <div className="flex">
                  <span className="h-10 px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l flex items-center text-xs font-bold text-slate-700">
                    🇮🇳 +91
                  </span>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="98111 22334"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-r text-xs font-bold text-slate-900 font-tnum focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Direct emergency call priority
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: Membership & Plan Config */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#65a30d] text-white flex items-center justify-center font-bold text-xs font-jakarta">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-jakarta">
                    Membership &amp; Plan Config
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Subscription lifecycle, batch slotting, and locker allocation
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Step 3 of 3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Joining Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 font-tnum focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Defaults to today's operations cycle
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Membership Tier Plan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={membershipTier}
                  onChange={(e) => setMembershipTier(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                >
                  <option>Yearly Elite All-Access @ ₹19,999</option>
                  <option>Half-Yearly Strength @ ₹11,500</option>
                  <option>Quarterly Gold Tier @ ₹6,500</option>
                  <option>Monthly Flex @ ₹2,500</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Includes steam, cardio zone, &amp; locker privileges
                </span>
              </div>
            </div>

            {/* Commencement Date -> Expiry Banner */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-tnum">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  COMMENCEMENT DATE
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{joiningDate}</span>
              </div>

              <div className="text-slate-400 text-lg hidden sm:block">→</div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CALCULATED EXPIRY DATE
                </span>
                <span className="text-sm font-bold text-[#65a30d] mt-0.5 block">26 Oct 2025</span>
              </div>

              <span className="px-2.5 py-1 rounded bg-lime-100 text-[#65a30d] text-xs font-bold uppercase">
                365 Days Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Batch Slotting Preference
                </label>
                <select
                  value={batchSlot}
                  onChange={(e) => setBatchSlot(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                >
                  <option>Evening Peak (05:00 PM – 09:30 PM)</option>
                  <option>Morning Prime (06:00 AM – 10:00 AM)</option>
                  <option>Afternoon Quiet Hours (11:00 AM – 04:00 PM)</option>
                  <option>All-Day Flex Access (24x7 Turnstile)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Locker Allocation (Male Wing)
                </label>
                <select
                  value={lockerAllocation}
                  onChange={(e) => setLockerAllocation(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                >
                  <option>Locker #102 (Middle Tier - RFID)</option>
                  <option>Locker #104 (Top Tier - RFID)</option>
                  <option>Locker #108 (Ground Tier - Keypad)</option>
                  <option>No Locker Allocated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Fitness Goal &amp; Medical Pre-conditions (Optional)
              </label>
              <textarea
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#65a30d]"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Synchronized to Floor Trainer Tablet App
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4-5 cols): Live Digital Card Preview & Reception Checklist */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Digital Member Card Preview (Exact match to Image 4 right top dark badge) */}
          <div className="bg-[#0b1c30] text-white rounded-xl p-5 shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#65a30d]/10 blur-2xl pointer-events-none"></div>

            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#65a30d] flex items-center justify-center font-black text-white text-[10px]">
                  M
                </div>
                <span className="font-black text-xs tracking-tight font-jakarta">MUSCLE UP</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#65a30d] text-white">
                Active Pro
              </span>
            </div>

            {/* Member Details */}
            <div className="flex items-center gap-3.5 pt-2">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                alt={fullName}
                className="w-14 h-14 rounded-lg object-cover border border-[#65a30d]"
              />
              <div>
                <h4 className="font-extrabold text-base text-white font-jakarta">
                  {fullName || 'Arjun Kapoor'}
                </h4>
                <div className="text-xs text-slate-300 font-tnum mt-0.5">
                  +91 {phone}
                </div>
                <div className="text-[11px] font-mono text-[#a3e635]">
                  ID: MU-2024-8891
                </div>
              </div>
            </div>

            {/* Grid of specs */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80 font-inter">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  PLAN ASSIGNED
                </span>
                <span className="font-bold text-white text-[11px] line-clamp-1">
                  {membershipTier.split('@')[0]}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  MEMBERSHIP FEE
                </span>
                <span className="font-extrabold text-white text-sm font-tnum text-[#a3e635]">
                  ₹19,999
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  BRANCH LOCATION
                </span>
                <span className="font-semibold text-slate-300 text-[11px]">
                  Indiranagar Center
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  VALID THRU
                </span>
                <span className="font-bold text-white text-[11px] font-tnum">
                  26 Oct 2025
                </span>
              </div>
            </div>

            {/* Barcode & NFC icon */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-mono text-slate-400 text-xs tracking-widest leading-none">
                  ||||| | |||| ||| ||||| ||| |||
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest mt-1">
                  8891 0247 9920
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300" title="Contactless RFID Enabled">
                <Wifi className="w-4 h-4 rotate-90 text-[#a3e635]" />
              </div>
            </div>
          </div>

          {/* Reception Checklist (Exact match to Image 4 checklist) */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 font-jakarta">
                Reception Checklist
              </h4>
              <span className="text-xs font-bold text-[#65a30d]">
                {checkedCount} of 5 Complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#65a30d] h-1.5 rounded-full transition-all"
                style={{ width: `${(checkedCount / 5) * 100}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={checklist.aadhaar}
                  onChange={(e) => setChecklist({ ...checklist, aadhaar: e.target.checked })}
                  className="rounded text-[#65a30d] focus:ring-0"
                />
                <span className="font-medium">Aadhaar/Govt Identity Sighted</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={checklist.phoneVerified}
                  onChange={(e) => setChecklist({ ...checklist, phoneVerified: e.target.checked })}
                  className="rounded text-[#65a30d] focus:ring-0"
                />
                <span className="font-medium">Indian Phone (+91) format verified</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={checklist.waiver}
                  onChange={(e) => setChecklist({ ...checklist, waiver: e.target.checked })}
                  className="rounded text-[#65a30d] focus:ring-0"
                />
                <span className="font-medium">Digital PAR-Q Physical Waiver Accepted</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={checklist.emergency}
                  onChange={(e) => setChecklist({ ...checklist, emergency: e.target.checked })}
                  className="rounded text-[#65a30d] focus:ring-0"
                />
                <span className="font-medium">Emergency Contact Documented</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={checklist.rfidAssigned}
                  onChange={(e) => setChecklist({ ...checklist, rfidAssigned: e.target.checked })}
                  className="rounded text-[#65a30d] focus:ring-0"
                />
                <span className="font-medium">RFID Access Wristband Assigned</span>
              </label>
            </div>

            {/* Programmer button */}
            <button
              onClick={() => {
                setChecklist({ ...checklist, rfidAssigned: true });
                alert('RFID wristband #NFC-8891-AK programmed and linked to member Arjun Kapoor.');
              }}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-[#65a30d]" />
              <span>Band Programmer Ready (Link NFC pad)</span>
            </button>
          </div>

          {/* GST Billing Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">ℹ</span>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-800">GST Billing Note:</span> All plan prices are inclusive of 18% GST (CGST 9% + SGST 9%). Receipt with HSN Code 999723 will be generated upon confirmation.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setCurrentScreen('members')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel Registration
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleSave(true)} disabled={isSaving}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs flex items-center justify-center gap-2 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-600" />
            <span>Save &amp; Record Payment</span>
          </button>
          <button
            onClick={() => handleSave(false)} disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#65a30d] hover:bg-[#558b09] active:scale-[0.99] text-white text-xs font-bold rounded shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};
