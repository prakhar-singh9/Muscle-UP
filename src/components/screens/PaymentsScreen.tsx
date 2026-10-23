import React, { useState } from 'react';
import { 
  Wallet, 
  QrCode, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CreditCard, 
  Smartphone, 
  Scan, 
  CheckCircle 
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { UpiQrCode } from '../common/UpiQrCode';
import { PaymentTransaction } from '../../types';

export const PaymentsScreen: React.FC = () => {
  const { 
    payments, 
    recordPayment, 
    verifyPayment, 
    rejectPayment, 
    todayCounterUpi, 
    members,
    currentBranch 
  } = useGym();

  // QR Generator State
  const [qrAmount, setQrAmount] = useState<number>(6500);
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Manual payment form state
  const [selectedMemberVal, setSelectedMemberVal] = useState('Aditi Deshmukh • MU-1204 (+91 98450 11982)');
  const [associatedPlan, setAssociatedPlan] = useState('Quarterly Gold Tier (3 Months) + Personal Training (12 Sessions)');
  const [manualAmount, setManualAmount] = useState<number>(8500);
  const [paymentInstrument, setPaymentInstrument] = useState('UPI QR (Customer App Scan)');
  const [utrNumber, setUtrNumber] = useState('429910482910');
  const [remarks, setRemarks] = useState('GPay payment confirmed on front desk screen. 5% festive discount applied.');

  // Table filter state
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending' | 'failed'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  const handleCopyVpa = () => {
    navigator.clipboard.writeText('muscleup.fitness@icici');
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const memberName = selectedMemberVal.split('•')[0].trim();
    const memberId = selectedMemberVal.match(/MU-\d+/)?.[0] || 'MU-1204';

    recordPayment({
      memberId,
      memberName,
      amount: manualAmount,
      planDescription: associatedPlan,
      paymentMethod: paymentInstrument,
      utrOrRef: utrNumber
    });

    alert(`Payment recorded for ${memberName} (₹${manualAmount}). Status: Pending Verification.`);
  };

  const handleSimulateOcr = () => {
    const fakeUtr = Math.floor(429900000000 + Math.random() * 99999999).toString();
    setUtrNumber(fakeUtr);
    setRemarks('UTR auto-parsed from bank SMS notification payload.');
  };

  const filteredTransactions = payments.filter((t) => {
    if (activeTab === 'verified' && t.status !== 'Verified') return false;
    if (activeTab === 'pending' && t.status !== 'Pending Verification') return false;
    if (activeTab === 'failed' && t.status !== 'Failed') return false;

    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.memberName.toLowerCase().includes(q) ||
        t.utrOrRef.toLowerCase().includes(q) ||
        t.planDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = payments.filter(p => p.status === 'Pending Verification').length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>FINANCIAL OPERATIONS • BRANCH: {currentBranch.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
            Payment Records &amp; UPI QR Collection
          </h1>
        </div>

        {/* Top Right Financial Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Today's Counter UPI
            </span>
            <div className="text-lg font-black text-slate-900 font-jakarta font-tnum">
              ₹{todayCounterUpi.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Action Required
            </span>
            <div className="text-lg font-black text-rose-600 font-jakarta font-tnum flex items-center gap-1.5">
              <span>{pendingCount} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Operational Hub: UPI QR Desk Terminal vs Manual Payment Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Gym Counter UPI QR Collection */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#65a30d]" />
                <h2 className="text-base font-black text-slate-900 font-jakarta">
                  Gym Counter UPI QR Collection
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant desk terminal scan &amp; dynamic payer payload
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Terminal Active
            </span>
          </div>

          {/* Amount input & preset chips */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              COUNTER COLLECTION AMOUNT (INR)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-2.5 font-bold text-slate-600 text-sm">₹</span>
                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(Number(e.target.value) || 0)}
                  className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:border-[#65a30d] font-tnum"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {[3000, 6500, 12000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setQrAmount(amt)}
                    className={`px-2.5 py-2 text-xs font-bold rounded border transition-colors ${
                      qrAmount === amt
                        ? 'bg-[#65a30d] text-white border-[#65a30d]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic QR Code & Merchant VPA */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center">
            <UpiQrCode amount={qrAmount} size={180} />

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold font-jakarta text-slate-900 shadow-2xs font-tnum">
              ₹{qrAmount.toLocaleString('en-IN')}.00
            </div>

            <div className="mt-3 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Verified Merchant VPA
              </span>
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800 bg-white py-1.5 px-3 rounded border border-slate-200">
                <span>muscleup.fitness@icici</span>
                <button
                  onClick={handleCopyVpa}
                  title="Copy VPA"
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                Accepts all UPI 2.0 compliant banking applications and credit on UPI lines.
              </p>
            </div>

            {/* Gateway Logos */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Certified Network Gateways
              </span>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600">
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">BHIM</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">GPay</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">PhonePe</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">Paytm</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">CRED</span>
              </div>
            </div>
          </div>

          {/* Staff Notice */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Staff Notice:</span> Static standee &amp; counter QR codes are configured in System Settings. Member scan on smartphone does not constitute auto-clearing; verify bank credit SMS/terminal before marking payment as verified.
            </div>
          </div>

          {/* Bottom Standee Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Front Counter Standee</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('SVG QR payload downloaded')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>SVG Payload</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Desk Standee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Quick Record Manual / Offline Payment */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900 font-jakarta">
                  Quick Record Manual / Offline Payment
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manual entry for UPI UTRs, POS cards, or counter cash
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px] font-bold">
                Step 1 of 2
              </span>
            </div>

            {/* Select Member */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                SELECT MEMBER • ID / NAME / PHONE *
              </label>
              <select
                value={selectedMemberVal}
                onChange={(e) => setSelectedMemberVal(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#65a30d]"
              >
                {members.map((m) => (
                  <option key={m.id} value={`${m.name} • ${m.id} (${m.phone})`}>
                    {m.name} • {m.id} ({m.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Associated Membership / Add-on */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                ASSOCIATED MEMBERSHIP / ADD-ON *
              </label>
              <input
                type="text"
                value={associatedPlan}
                onChange={(e) => setAssociatedPlan(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#65a30d]"
              />
            </div>

            {/* Amount & Payment Instrument */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  SETTLEMENT AMOUNT (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value) || 0)}
                    className="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-900 font-tnum focus:outline-none focus:border-[#65a30d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  PAYMENT INSTRUMENT *
                </label>
                <select
                  value={paymentInstrument}
                  onChange={(e) => setPaymentInstrument(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#65a30d]"
                >
                  <option>UPI QR (Customer App Scan)</option>
                  <option>Counter Cash</option>
                  <option>POS Card Swipe / Tap</option>
                  <option>Net Banking IMPS / NEFT</option>
                  <option>Bank Cheque</option>
                </select>
              </div>
            </div>

            {/* 12-Digit UPI UTR / Bank Ref */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  12-DIGIT UPI UTR / BANK REFERENCE NUMBER *
                </label>
                <button
                  type="button"
                  onClick={handleSimulateOcr}
                  className="text-xs text-[#65a30d] font-semibold hover:underline flex items-center gap-1"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Scan SMS / OCR</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-slate-400 text-xs">#</span>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 429910482910"
                  className="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#65a30d]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Cross-check this 12-digit numeric string with your HDFC/ICICI merchant statement.
              </p>
            </div>

            {/* Internal Billing Remarks */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                INTERNAL BILLING REMARKS (OPTIONAL)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#65a30d]"
              />
            </div>

            {/* Record Payment CTA */}
            <button
              type="submit"
              className="w-full py-3 bg-[#65a30d] hover:bg-[#558b09] active:scale-[0.99] text-white text-xs font-bold rounded shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Record Payment (Pending Verification)</span>
            </button>
          </form>

          {/* Operator Footer Tag */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Operator: Rahul Verma (Admin)</span>
            <span>GST Invoice Generated Automatically</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transactions & Payment Ledger */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Ledger Header & Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-jakarta">
              Transactions &amp; Payment Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time audit log of digital receipts, UTR reconciliations, and counter collections
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0b1c30] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records ₹8,42,500
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'verified'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Pending Verification ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'failed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Failed (1)
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by transaction ID, member or UTR..."
              className="w-full h-8 pl-8 pr-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#65a30d]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Filter date range dialog')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter Date Range</span>
            </button>
            <button
              onClick={() => alert('Exporting Tally ERP9 / Excel sheet...')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Tally / Excel</span>
            </button>
            <span className="text-slate-400 font-mono text-[11px]">1 / 26</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">TRANSACTION ID &amp; DATE</th>
                <th className="py-3 px-4">MEMBER DETAILS</th>
                <th className="py-3 px-4">PLAN / DESCRIPTION</th>
                <th className="py-3 px-4 text-right">AMOUNT</th>
                <th className="py-3 px-4">PAYMENT METHOD &amp; UTR</th>
                <th className="py-3 px-4 text-right">VERIFICATION STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-inter">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Transaction ID & Date */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 font-mono text-xs">
                      {txn.id}
                    </div>
                    <div className="text-[11px] text-slate-400 font-tnum mt-0.5">
                      {txn.date}
                    </div>
                  </td>

                  {/* Member Details */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 font-jakarta">
                      {txn.memberName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {txn.memberId} • {txn.branch}
                    </div>
                  </td>

                  {/* Plan / Description */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-800 line-clamp-1">
                      {txn.planDescription}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-tnum">
                    <div className="font-extrabold text-slate-900 text-sm">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Incl. 18% GST
                    </div>
                  </td>

                  {/* Payment Method & UTR */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {txn.paymentMethod}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {txn.utrOrRef}
                    </div>
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-4 text-right">
                    {txn.status === 'Verified' && (
                      <div>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Verified by {txn.verifiedBy || 'Rahul'}
                        </div>
                      </div>
                    )}

                    {txn.status === 'Pending Verification' && (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Pending Verification
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => verifyPayment(txn.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <span>✓ Verify</span>
                          </button>
                          <button
                            onClick={() => rejectPayment(txn.id)}
                            className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded font-bold text-[11px] transition-colors"
                          >
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {txn.status === 'Failed' && (
                      <div>
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </span>
                        <div className="text-[11px] text-rose-500">
                          {txn.failureReason || 'Declined by Remitter Bank'}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="px-4 py-3 bg-[#f8fafc] border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-inter">
          <span>Showing 1-{filteredTransactions.length} of 128 transactions recorded this billing cycle</span>
          <span className="font-mono">Audit Hash: SHA256:7e98a1f4b002c</span>
        </div>
      </div>
    </div>
  );
};
