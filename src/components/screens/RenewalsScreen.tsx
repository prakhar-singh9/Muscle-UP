import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Download, 
  FileText, 
  Search, 
  RotateCw, 
  CheckCircle2, 
  QrCode, 
  Banknote, 
  Printer, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ScanLine
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PlanTierOption } from '../../types';
import { INITIAL_PLAN_TIERS } from '../../data/mockData';

export const RenewalsScreen: React.FC = () => {
  const { 
    members, 
    renewals, 
    renewMembership, 
    selectedMemberId, 
    setSelectedMemberId, 
    setActiveInvoiceData,
    setIsScannerOpen,
    navigateToMember 
  } = useGym();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'grace'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('yearly-prime');
  const [paymentMethod, setPaymentMethod] = useState<'UPI QR' | 'Cash' | 'Card / POS'>('UPI QR');
  const [isSettling, setIsSettling] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(1500); // Diwali early renewal discount

  // Find active member to renew (default to selected or Devendra Sharma MU-1194)
  const currentRenewMember = members.find(m => m.id === selectedMemberId) || 
    members.find(m => m.id === 'MU-1194') || 
    members[0];

  const selectedPlan = INITIAL_PLAN_TIERS.find(p => p.id === selectedPlanId) || INITIAL_PLAN_TIERS[3];

  const basePrice = selectedPlan.price;
  const totalPayable = Math.max(0, basePrice - appliedDiscount);

  const handleProceedSettlement = () => {
    setIsSettling(true);
    setTimeout(() => {
      renewMembership({
        memberId: currentRenewMember.id,
        planName: selectedPlan.name,
        durationDays: selectedPlan.durationDays,
        amount: totalPayable,
        paymentMode: paymentMethod
      });
      setIsSettling(false);
      // Auto open invoice preview
      setActiveInvoiceData({
        invoiceNo: `INV-2024-${Math.floor(9000 + Math.random() * 999)}`,
        memberName: currentRenewMember.name,
        memberId: currentRenewMember.id,
        memberPhone: currentRenewMember.phone,
        planName: selectedPlan.name,
        amount: totalPayable,
        paymentMode: paymentMethod,
        date: 'Today'
      });
    }, 600);
  };

  const filteredRenewals = renewals.filter(r => {
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return (
        r.memberName.toLowerCase().includes(q) ||
        r.memberId.toLowerCase().includes(q) ||
        r.memberPhone.includes(q) ||
        r.invoiceNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OPERATION SUITE &gt; LIFECYCLE & ACCESS CONTROL
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
            Memberships & Renewals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage active memberships, extend gym access, and issue renewals without overwriting historical records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#65a30d]" />
            <span>Immutable Audit Log Active</span>
          </div>
          <button 
            onClick={() => alert('Exporting ledger CSV...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Ledger (CSV)</span>
          </button>
          <button 
            onClick={() => alert('Generating bulk tax invoices zip...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Bulk Tax Invoices</span>
          </button>
        </div>
      </div>

      {/* Main Card: Process Membership Renewal (Exact recreation of Image 2 top section) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Top bar of renewal card */}
        <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#65a30d] flex items-center justify-center text-white font-bold shrink-0 shadow-2xs">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 font-jakarta">
                Process Membership Renewal
              </h2>
              <p className="text-xs text-slate-500">
                Continuous accession mode: appends sequential billing cycle, preserving cycle archives.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[11px] font-bold">
            Terminal #MU-BLR-02
          </span>
        </div>

        {/* Form Body: Left Controls + Right Ledger Valuation */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Member Selector, Plans, Dates */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Member Selector Row */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  SELECT MEMBER FOR EXTENSION *
                </label>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="text-xs text-[#65a30d] font-semibold hover:underline flex items-center gap-1"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>scan nfc / rfid</span>
                </button>
              </div>

              {/* Selected Member Preview Card */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentRenewMember.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                    alt={currentRenewMember.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-jakarta text-sm">
                        {currentRenewMember.name}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                        {currentRenewMember.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-tnum mt-0.5">
                      {currentRenewMember.phone} • {currentRenewMember.gender}, {currentRenewMember.age || 31} yrs
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Expires in {currentRenewMember.daysRemaining > 0 ? `${currentRenewMember.daysRemaining} days` : 'Overdue'}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1 font-tnum">
                    Expiry: {currentRenewMember.expiryDate}
                  </div>
                </div>
              </div>

              {/* Quick switch member dropdown */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Switch member:</span>
                <select
                  value={currentRenewMember.id}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="h-7 px-2 bg-white border border-slate-200 rounded text-xs text-slate-700"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id}) - {m.planName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Renewal Plan Tier Radio Group */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
                RENEWAL PLAN TIER
              </label>

              <div className="space-y-2">
                {INITIAL_PLAN_TIERS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#65a30d] bg-lime-50/40 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#65a30d] bg-[#65a30d]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 font-jakarta">
                            {plan.name}
                          </span>
                          <span className="ml-2 text-xs text-slate-500 font-tnum">
                            {plan.durationLabel}
                          </span>
                          {isSelected && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-lime-100 text-[#65a30d] text-[10px] font-bold uppercase">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right font-bold text-xs text-slate-800 font-tnum">
                        {plan.periodLabel}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Duration / Trainer add-on */}
                <div className="p-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-between cursor-pointer text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                    <span className="font-semibold">Custom Duration / Trainer Add-on Package</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Manual day allocation</span>
                </div>
              </div>
            </div>

            {/* Calculated Dates Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Effective Start Date (Auto-linked)
                </span>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2 font-tnum">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>31 Oct 2024</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Begins immediately post-expiry
                </span>
              </div>

              <div className="p-3.5 bg-lime-50/50 rounded-lg border border-lime-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  New Extended Expiry Date
                </span>
                <div className="text-sm font-bold text-[#65a30d] mt-1 flex items-center gap-2 font-tnum">
                  <span className="w-2 h-2 rounded-full bg-[#65a30d]"></span>
                  <span>30 Oct 2025</span>
                </div>
                <span className="text-[11px] text-[#65a30d] font-semibold block mt-0.5">
                  +{selectedPlan.durationDays} access days appended
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (4-5 cols): Ledger Valuation & Payment Settlement */}
          <div className="lg:col-span-5 xl:col-span-4 bg-slate-50 rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-jakarta">
                  Ledger Valuation
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Cycle 03 (Renewal)</span>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-3 text-xs divide-y divide-slate-200/70 font-inter">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Plan Base Price ({selectedPlan.name}):</span>
                  <span className="font-semibold text-slate-900 font-tnum">
                    ₹{basePrice.toLocaleString('en-IN')}.00
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 pt-2.5">
                  <span>Locker & Spa Add-on:</span>
                  <span className="font-semibold text-slate-900 font-tnum">₹0.00</span>
                </div>

                <div className="flex justify-between items-center text-[#65a30d] pt-2.5 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Diwali Early Renewal:</span>
                  </span>
                  <span className="font-tnum">-₹{appliedDiscount.toLocaleString('en-IN')}.00</span>
                </div>

                <div className="flex justify-between items-center text-slate-500 pt-2.5 text-[11px]">
                  <span>Taxes included (18% GST):</span>
                  <span className="font-bold text-slate-700">INCLUSIVE</span>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL PAYABLE
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Saved ₹{appliedDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1 font-jakarta font-tnum">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Auto-synced with GST ledger
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  PAYMENT METHOD
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI QR')}
                    className={`py-2 px-2 rounded border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'UPI QR'
                        ? 'border-[#65a30d] bg-lime-50 text-[#65a30d] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`py-2 px-2 rounded border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'Cash'
                        ? 'border-[#65a30d] bg-lime-50 text-[#65a30d] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card / POS')}
                    className={`py-2 px-2 rounded border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'Card / POS'
                        ? 'border-[#65a30d] bg-lime-50 text-[#65a30d] shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card / POS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Big Action CTA */}
            <button
              onClick={handleProceedSettlement}
              disabled={isSettling}
              className="w-full mt-6 py-3 bg-[#65a30d] hover:bg-[#558b09] active:scale-[0.99] text-white text-sm font-black rounded shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>{isSettling ? 'Settling Transaction...' : 'Proceed to Settlement →'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Strip (Exact recreation of Image 2 telemetry banner) */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Activity className="w-4 h-4 text-[#65a30d]" />
            <span>ACCESS INTEGRITY TELEMETRY</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">● Live Gateway Sync</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-slate-400 mr-2">Renewals Today</span>
              <span className="font-extrabold text-slate-900 font-tnum">14</span>
              <span className="text-[#65a30d] text-[11px] font-bold ml-1">+3 vs avg</span>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 mr-2">Retention Index</span>
              <span className="font-extrabold text-slate-900 font-tnum">88.4%</span>
              <span className="text-[#65a30d] text-[11px] font-bold ml-1">+2.1%</span>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 mr-2">October Renewal Target</span>
              <span className="font-extrabold text-slate-900 font-tnum">₹7,42,800</span>
              <span className="text-slate-500 text-[11px] ml-1">(87%)</span>
              <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">
                ₹1,07,200 remaining to close target...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section: Recent Membership Renewals & History Log */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header Row */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-jakarta">
              Recent Membership Renewals & History Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Each renewal issues a new accession node. Pre-existing membership periods remain locked in the archive.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Renewals (312)
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Upcoming Expiries (38)
            </button>
            <button
              onClick={() => setActiveTab('grace')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'grace'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Grace Period (12)
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by invoice ID, member name, or phone number..."
              className="w-full h-8 pl-9 pr-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#65a30d]"
            />
          </div>
          <span className="text-xs text-slate-400">
            Showing 1-{filteredRenewals.length} of 312 transactions
          </span>
        </div>

        {/* Renewals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">MEMBER NAME & ID</th>
                <th className="py-3 px-4">TYPE / LEDGER NODE</th>
                <th className="py-3 px-4">OLD EXPIRY → EXTENDED EXPIRY</th>
                <th className="py-3 px-4 text-right">TOTAL FEE (INR)</th>
                <th className="py-3 px-4">RENEWED BY STAFF</th>
                <th className="py-3 px-4 text-right">RECEIPT & TAX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-inter">
              {filteredRenewals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'}
                        alt={item.memberName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div 
                          onClick={() => navigateToMember(item.memberId)}
                          className="font-bold text-slate-900 hover:text-[#65a30d] cursor-pointer font-jakarta"
                        >
                          {item.memberName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.memberId} • {item.memberPhone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type / Ledger Node */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <RotateCw className="w-3 h-3" />
                      <span>{item.typeBadge}</span>
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.ledgerNode}
                    </div>
                  </td>

                  {/* Expiry Dates */}
                  <td className="py-3 px-4 font-tnum">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="line-through text-slate-400">{item.oldExpiry}</span>
                      <span>→</span>
                      <span className="font-bold text-slate-900">{item.extendedExpiry}</span>
                    </div>
                  </td>

                  {/* Fee & Payment mode */}
                  <td className="py-3 px-4 text-right font-tnum">
                    <div className="font-extrabold text-slate-900 text-sm">
                      ₹{item.totalFee.toLocaleString('en-IN')}.00
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.paymentMode}
                    </div>
                  </td>

                  {/* Staff */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {item.renewedByStaff}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveInvoiceData({
                          invoiceNo: item.invoiceNo,
                          memberName: item.memberName,
                          memberId: item.memberId,
                          memberPhone: item.memberPhone,
                          planName: item.planName,
                          amount: item.totalFee,
                          paymentMode: item.paymentMode,
                          date: item.date
                        })}
                        title="Download Tax Receipt"
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveInvoiceData({
                          invoiceNo: item.invoiceNo,
                          memberName: item.memberName,
                          memberId: item.memberId,
                          memberPhone: item.memberPhone,
                          planName: item.planName,
                          amount: item.totalFee,
                          paymentMode: item.paymentMode,
                          date: item.date
                        })}
                        title="Print Invoice"
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All records cryptographically signed with gym franchise GSTIN: <strong className="text-slate-800 font-mono">29AAACM1204N1Z5</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('Opening full audit log...')}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
            >
              Audit Trial Log
            </button>
            <button 
              onClick={() => alert('Printing daily shift close report...')}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
            >
              Print Shift Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
