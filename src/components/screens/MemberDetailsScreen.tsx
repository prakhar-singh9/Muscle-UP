import React, { useState } from 'react';
import { 
  Users, 
  RotateCw, 
  Edit3, 
  Play, 
  Phone, 
  Mail, 
  Fingerprint, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Key, 
  PauseCircle, 
  MessageSquare, 
  Download, 
  Check, 
  FileText,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const MemberDetailsScreen: React.FC = () => {
  const { 
    selectedMember, 
    navigateToRenewal, 
    setIsWhatsAppModalOpen, 
    setCurrentScreen,
    setActiveInvoiceData,
    attendanceLogs,
    messageLogs,
    renewals,
    updateMember
  } = useGym();

  const [activeTab, setActiveTab] = useState<'attendance' | 'history'>('attendance');
  const [isFrozen, setIsFrozen] = useState(false);
  const [editingLocker, setEditingLocker] = useState(false);
  const [lockerVal, setLockerVal] = useState(selectedMember?.lockerNo || 'L-42 (Women Wing)');

  if (!selectedMember) {
    return (
      <div className="p-8 text-center text-slate-500">
        Member not found. Return to <button onClick={() => setCurrentScreen('members')} className="text-[#65a30d] font-bold">Directory</button>
      </div>
    );
  }

  const memberAttendance = attendanceLogs.filter(a => a.memberId === selectedMember.id);
  const memberMessages = messageLogs.filter(m => m.memberId === selectedMember.id);
  const memberRenewals = renewals.filter(r => r.memberId === selectedMember.id);

  const handleToggleFreeze = () => {
    setIsFrozen(!isFrozen);
    alert(isFrozen ? 'Membership freeze lifted.' : 'Membership pass frozen for medical reasons for 14 days.');
  };

  const handleSaveLocker = () => {
    updateMember(selectedMember.id, { lockerNo: lockerVal });
    setEditingLocker(false);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button 
              onClick={() => setCurrentScreen('members')} 
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Members</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">{selectedMember.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] font-mono text-slate-600">
              {selectedMember.id}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2 font-jakarta tracking-tight">
            Member Details: {selectedMember.name} ({selectedMember.id})
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#65a30d] fill-[#65a30d]" />
            <span>Send Reminder</span>
          </button>
          <button
            onClick={() => alert(`Edit profile modal for ${selectedMember.name}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Member Details</span>
          </button>
          <button
            onClick={() => navigateToRenewal(selectedMember.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#65a30d] hover:bg-[#558b09] text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Renew Membership</span>
          </button>
        </div>
      </div>

      {/* Main Profile Info Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Member Identity */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-lg object-cover border border-slate-200 shadow-xs"
              />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#65a30d] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-xs">
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900 font-jakarta">
                  {selectedMember.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
                  Tier: {selectedMember.planTier}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="font-mono text-slate-700 font-semibold">ID: {selectedMember.id}</span>
                <span>•</span>
                <span>Joined: {selectedMember.joinedDate} {selectedMember.tenureString}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Fingerprint Registered</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
                <span className="flex items-center gap-1.5 font-semibold font-tnum">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedMember.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedMember.email}</span>
                </span>
              </div>

              {selectedMember.emergencyContact && (
                <div className="text-xs text-rose-700 flex items-center gap-1.5 font-medium pt-0.5">
                  <span className="text-rose-500 font-black">*</span>
                  <span>{selectedMember.emergencyContact.name} ({selectedMember.emergencyContact.relationship || 'Emergency'}): {selectedMember.emergencyContact.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Key Performance Telemetry */}
          <div className="grid grid-cols-3 gap-6 border-t xl:border-t-0 xl:border-l border-slate-200 pt-4 xl:pt-0 xl:pl-8">
            {/* Lifetime visits */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lifetime Visits
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-jakarta mt-1 font-tnum">
                {selectedMember.lifetimeVisits}
              </div>
              <span className="text-xs text-[#65a30d] font-semibold flex items-center gap-1 mt-0.5 font-tnum">
                ~ 4.8 visits/wk
              </span>
            </div>

            {/* Compliance Rate */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Compliance Rate
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-jakarta mt-1 font-tnum">
                {selectedMember.complianceRate}%
              </div>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block truncate">
                {selectedMember.preferredSlot}
              </span>
            </div>

            {/* Payment State */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Payment State
              </span>
              <div className="text-xl font-black text-emerald-600 font-jakarta mt-2 tracking-tight">
                {selectedMember.paymentState}
              </div>
              <span className="text-xs text-emerald-600 font-semibold block mt-1">
                Zero Dues
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'attendance'
              ? 'bg-[#65a30d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Attendance & Logs</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-[#65a30d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>Membership History</span>
        </button>
      </div>

      {/* Tab Content: Attendance & Logs */}
      {activeTab === 'attendance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (4 cols): Current Subscription */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current Subscription
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isFrozen ? 'FROZEN' : 'Running'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 font-jakarta">
                {selectedMember.planName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                All-hours gym floor access, sauna & locker included
              </p>
            </div>

            {/* Validity Box */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Remaining Validity</span>
                <span className="font-bold text-[#65a30d] text-sm font-tnum">
                  {selectedMember.daysRemaining} Days Left
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#65a30d] h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (selectedMember.daysRemaining / 365) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Started {selectedMember.startDate}</span>
                <span>Expires {selectedMember.expiryDate}</span>
              </div>
            </div>

            {/* Subscription Line Specs */}
            <div className="space-y-3 text-xs divide-y divide-slate-100 font-inter">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Fee Paid:</span>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm font-tnum">
                    ₹{selectedMember.planPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[11px] text-slate-400">{selectedMember.paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Locker No:</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Key className="w-3.5 h-3.5 text-[#65a30d]" />
                  <span>{selectedMember.lockerNo || 'Not assigned'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Assigned Trainer:</span>
                <span className="font-bold text-slate-800">
                  {selectedMember.assignedTrainer || 'Coach Sandeep Kumar'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">NFC Key Tag:</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {selectedMember.nfcTag || '#NFC-9981-L'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={handleToggleFreeze}
                className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-700 transition-colors"
              >
                {isFrozen ? 'Unfreeze Pass' : 'Freeze Pass (Medical)'}
              </button>
              {editingLocker ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={lockerVal}
                    onChange={(e) => setLockerVal(e.target.value)}
                    className="w-full text-xs px-2 border rounded"
                  />
                  <button onClick={handleSaveLocker} className="px-2 bg-[#65a30d] text-white text-xs rounded font-bold">
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingLocker(true)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-700 transition-colors"
                >
                  Change Locker
                </button>
              )}
            </div>
          </div>

          {/* Middle Column (4 cols): Consistency Map & Turnstile Logs */}
          <div className="lg:col-span-4 space-y-6">
            {/* Weekly Consistency Map */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-jakarta flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#65a30d]" />
                    <span>Weekly Consistency Map</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Weekly workout streak & regular check-in regularity
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-50 text-[#65a30d] border border-lime-200">
                  ● 5 of 6 Days Logged
                </span>
              </div>

              {/* Day Pills Grid */}
              <div className="grid grid-cols-7 gap-2 mt-4 text-center">
                {[
                  { day: 'MON', status: 'done' },
                  { day: 'TUE', status: 'done' },
                  { day: 'WED', status: 'done' },
                  { day: 'THU', status: 'rest' },
                  { day: 'FRI', status: 'done' },
                  { day: 'SAT', status: 'done' },
                  { day: 'SUN', status: 'plan' }
                ].map((d) => (
                  <div key={d.day} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">{d.day}</span>
                    <div
                      className={`h-9 rounded flex items-center justify-center font-bold text-xs transition-all ${
                        d.status === 'done'
                          ? 'bg-[#65a30d] text-white shadow-2xs'
                          : d.status === 'rest'
                          ? 'bg-slate-100 text-slate-500 text-[10px]'
                          : 'bg-slate-50 text-slate-400 border border-dashed border-slate-300 text-[10px]'
                      }`}
                    >
                      {d.status === 'done' ? '✓' : d.status === 'rest' ? 'Rest' : 'Plan'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed RFID Turnstile Logs */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 font-jakarta">Detailed RFID Turnstile Logs</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Gate 1 (RFID Turnstile A)</span>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {/* Item 1 */}
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Today 07:12 AM - Floor Check-in
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      RFID Turnstile A • Access Key {selectedMember.nfcTag || '#NFC-9981-L'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    On-Floor
                  </span>
                </div>

                {/* Item 2 */}
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Yesterday 07:05 AM - Floor Check-in
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      07:05 AM - 08:32 AM (87 mins workout)
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100">
                    Completed
                  </span>
                </div>

                {/* Item 3 */}
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Friday 07:18 AM - Floor Check-in
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      07:18 AM - 08:30 AM (72 mins workout)
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100">
                    Completed
                  </span>
                </div>

                {/* Item 4 */}
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Wednesday 07:10 AM - Floor Check-in
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      07:10 AM - 08:40 AM (90 mins workout)
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100">
                    Completed
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`Exporting 30-day attendance roster for ${selectedMember.name}`)}
                className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 transition-colors"
              >
                Export Monthly Attendance Sheet
              </button>
            </div>
          </div>

          {/* Right Column (4 cols): Message & Alert Engine */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 font-jakarta">
                  Message & Alert Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  WhatsApp Bot Active
                </span>
              </div>

              <div className="space-y-4 mt-4">
                {/* Message 1 */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Scheduled: Renewal Notice
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">01 Jan 2025</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trigger rule: 14-day early expiration alert via WhatsApp API & SMS template #MU_RENEW_PRO.
                  </p>
                </div>

                {/* Message 2 */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <span>✓✓</span>
                      <span>WhatsApp Welcome Sent</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">15 Jan 2024</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Welcome to Pro Tier! Your trainer Coach Sandeep Kumar has been notified." Delivered & Read.
                  </p>
                </div>

                {/* Message 3 */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Annual Birthday Perk Sent
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">12 Aug 2024</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sent complementary smoothie voucher & personal trainer coupon code. Redeemed.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom WhatsApp CTA */}
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="w-full mt-6 py-2.5 bg-[#65a30d] hover:bg-[#558b09] text-white text-xs font-bold rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Custom WhatsApp</span>
            </button>
          </div>
        </div>
      ) : (
        /* Tab Content: Membership History */
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-jakarta">
              Historical Access & Renewal Records
            </h3>
            <span className="text-xs text-slate-500">All historical nodes preserved</span>
          </div>

          <div className="divide-y divide-slate-100">
            {memberRenewals.length > 0 ? (
              memberRenewals.map((ren) => (
                <div key={ren.id} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800 font-jakarta text-sm">
                      {ren.planName} • {ren.typeBadge}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Issued on {ren.date} by {ren.renewedByStaff} • Valid until {ren.extendedExpiry}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-slate-900 text-sm font-tnum">
                      ₹{ren.totalFee.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setActiveInvoiceData({
                        invoiceNo: ren.invoiceNo,
                        memberName: selectedMember.name,
                        memberId: selectedMember.id,
                        memberPhone: selectedMember.phone,
                        planName: ren.planName,
                        amount: ren.totalFee,
                        paymentMode: ren.paymentMode,
                        date: ren.date
                      })}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 font-jakarta text-sm">
                    {selectedMember.planName} (Initial Enrollment)
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Commenced on {selectedMember.startDate} • Valid until {selectedMember.expiryDate}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-slate-900 text-sm font-tnum">
                    ₹{selectedMember.planPrice.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setActiveInvoiceData({
                      invoiceNo: 'INV-2024-9102',
                      memberName: selectedMember.name,
                      memberId: selectedMember.id,
                      memberPhone: selectedMember.phone,
                      planName: selectedMember.planName,
                      amount: selectedMember.planPrice,
                      paymentMode: selectedMember.paymentMethod,
                      date: selectedMember.startDate
                    })}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
