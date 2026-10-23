import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const BulkReminderModal: React.FC = () => {
  const { isBulkReminderOpen, setIsBulkReminderOpen, triggerBatchRenewalReminder, members } = useGym();
  const [isProcessing, setIsProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!isBulkReminderOpen) return null;

  const expiringMembers = members.filter(m => m.status === 'expiring');

  const handleTrigger = () => {
    setIsProcessing(true);
    setTimeout(() => {
      triggerBatchRenewalReminder();
      setIsProcessing(false);
      setComplete(true);
      setTimeout(() => {
        setComplete(false);
        setIsBulkReminderOpen(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-sm font-jakarta">Automated 1-Click Renewal Push</h3>
              <p className="text-[11px] text-amber-100">Broadcast payment links to members expiring within 7 days</p>
            </div>
          </div>
          <button
            onClick={() => setIsBulkReminderOpen(false)}
            className="text-amber-200 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Automated Batch Rule:</span> This will dispatch personalized WhatsApp notifications with dynamic UPI Payment Links to all <span className="font-bold underline">38 expiring members</span>. 
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Queue</span>
              <div className="text-xl font-black text-slate-900 mt-1 font-jakarta">38 Members</div>
              <span className="text-[11px] text-slate-500">Expiring in next 7 days</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recoverable Revenue</span>
              <div className="text-xl font-black text-[#65a30d] mt-1 font-jakarta font-tnum">₹1,84,500</div>
              <span className="text-[11px] text-slate-500">Estimated 84% conversion</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              WhatsApp Message Preview
            </label>
            <div className="bg-[#EFEAE2] p-3 rounded-lg border border-slate-200 text-xs text-slate-800">
              <div className="bg-white p-2.5 rounded shadow-2xs border border-emerald-100 leading-relaxed">
                "Hello <span className="text-emerald-700 font-bold">&#123;&#123;name&#125;&#125;</span>! Your MuscleUp fitness membership expires in <span className="text-emerald-700 font-bold">&#123;&#123;days_left&#125;&#125; days</span>. Avoid turnstile access interruptions by renewing with 1-click via UPI: <span className="text-blue-600 underline">https://muscleup.fitness/pay/&#123;&#123;id&#125;&#125;</span>. Early renewal unlocks a ₹1,500 festive discount!"
              </div>
            </div>
          </div>

          {complete && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>38 WhatsApp renewal messages queued and delivered!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setIsBulkReminderOpen(false)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleTrigger}
            disabled={isProcessing || complete}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Dispatching...' : complete ? 'Sent Successfully!' : 'Trigger 1-Click Reminder Batch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
