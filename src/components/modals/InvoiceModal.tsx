import React from 'react';
import { X, Printer, Download, CheckCircle } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceData, setActiveInvoiceData } = useGym();

  if (!activeInvoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const basePrice = Math.round(activeInvoiceData.amount / 1.18);
  const gstAmount = activeInvoiceData.amount - basePrice;
  const halfGst = Math.round(gstAmount / 2);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0b1c30] text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm font-jakarta">GST Tax Invoice & Receipt</h3>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {activeInvoiceData.invoiceNo || 'INV-2024-9102'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#65a30d] hover:bg-[#558b09] text-white rounded text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setActiveInvoiceData(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white" id="invoice-sheet">
          {/* Top Info */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="text-xl font-black text-[#0b1c30] font-jakarta tracking-tight">
                MUSCLE<span className="text-[#65a30d]">UP</span> FITNESS PRIVATE LIMITED
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Koramangala 5th Block, 80 Feet Road, Bengaluru, Karnataka - 560095
              </p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                GSTIN: <span className="font-bold text-slate-900">29AAACM1204N1Z5</span> • State Code: 29 (KA)
              </p>
              <p className="text-xs text-slate-500">Contact: accounts@muscleup.fitness | +91 80 4912 8800</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded uppercase tracking-wider border border-emerald-200">
                TAX INVOICE - PAID
              </span>
              <div className="mt-2 text-xs text-slate-500">
                Invoice No: <span className="font-bold text-slate-900 font-mono">{activeInvoiceData.invoiceNo || 'INV-2024-9102'}</span>
              </div>
              <div className="text-xs text-slate-500">
                Date: <span className="font-semibold text-slate-900">{activeInvoiceData.date || '27 Oct 2024'}</span>
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Billed To (Member Details)
              </span>
              <div className="font-bold text-slate-900 text-sm font-jakarta">
                {activeInvoiceData.memberName || 'Sneha Rao'}
              </div>
              <div className="text-slate-600 mt-0.5">Member ID: {activeInvoiceData.memberId || 'MU-1088'}</div>
              <div className="text-slate-600">Phone: {activeInvoiceData.memberPhone || '+91 98450 88712'}</div>
              <div className="text-slate-600 mt-1">Place of Supply: Karnataka (29)</div>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Subscription & Facility
              </span>
              <div className="font-semibold text-slate-900">{activeInvoiceData.planName || 'Yearly Prime Access'}</div>
              <div className="text-slate-600 mt-0.5">Access Duration: 365 Days</div>
              <div className="text-slate-600">Branch: Koramangala Center</div>
              <div className="text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Payment Mode: {activeInvoiceData.paymentMode || 'UPI / NetBanking'}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider text-left">
                <th className="py-2.5 font-bold">Item Description</th>
                <th className="py-2.5 font-bold text-center">HSN Code</th>
                <th className="py-2.5 font-bold text-right">Taxable Value</th>
                <th className="py-2.5 font-bold text-right">CGST (9%)</th>
                <th className="py-2.5 font-bold text-right">SGST (9%)</th>
                <th className="py-2.5 font-bold text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-tnum">
              <tr>
                <td className="py-3 text-slate-800 font-semibold">
                  {activeInvoiceData.planName || 'Yearly Unlimited Pro Fitness'}
                  <div className="text-[11px] font-normal text-slate-500">
                    Includes all gym floors, RFID access turnstiles, locker & shower access.
                  </div>
                </td>
                <td className="py-3 text-center text-slate-600">999723</td>
                <td className="py-3 text-right text-slate-700">₹{basePrice.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right text-slate-700">₹{halfGst.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right text-slate-700">₹{halfGst.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right font-bold text-slate-900">
                  ₹{Number(activeInvoiceData.amount || 18499).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total Summary */}
          <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
            <div className="text-[11px] text-slate-500 max-w-xs">
              <p className="font-semibold text-slate-700">Declaration & Terms:</p>
              <p>We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.</p>
              <p className="mt-1 font-mono text-slate-400">Computer generated invoice. No signature required.</p>
            </div>
            <div className="w-64 space-y-1.5 text-xs text-right font-tnum">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span>₹{halfGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span>₹{halfGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="text-base text-[#65a30d]">
                  ₹{Number(activeInvoiceData.amount || 18499).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center no-print">
          <span className="text-xs text-slate-500 font-mono">
            Signed by GST Authority • 29AAACM1204N1Z5
          </span>
          <button
            onClick={() => setActiveInvoiceData(null)}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
