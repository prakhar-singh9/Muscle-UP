import React from 'react';
import { Bell, MessageSquare, CheckCircle2, Clock, Send, ShieldCheck, Smartphone } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const NotificationsScreen: React.FC = () => {
  const { messageLogs, setIsBulkReminderOpen, members } = useGym();

  const expiringCount = members.filter(m => m.status === 'expiring').length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OPERATION SUITE &gt; COMMUNICATION &amp; DISPATCH
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
            Notifications &amp; WhatsApp Bot Engine
          </h1>
          <p className="text-xs text-slate-500">
            Automated WhatsApp reminders, welcome locker PDF delivery, and birthday perks.
          </p>
        </div>

        <button
          onClick={() => setIsBulkReminderOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8701a] hover:bg-[#d65f0a] text-white rounded text-xs font-bold shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Trigger 1-Click Reminder Batch</span>
        </button>
      </div>

      {/* Gateway Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>WhatsApp Bot Gateway</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-jakarta">
            Connected (Active)
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Meta Cloud API • 99.8% Uptime
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Messages Sent This Month</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            1,482 Delivered
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 block">
            94% Read within 15 minutes
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Renewal Notice Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2 font-jakarta font-tnum">
            {expiringCount} Pending
          </div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">
            Scheduled for 14-day &amp; 3-day window
          </span>
        </div>
      </div>

      {/* Message Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-jakarta">
            Dispatch Audit Log (Recent Messages)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Channel: WhatsApp / SMS</span>
        </div>

        <div className="divide-y divide-slate-100">
          {messageLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-jakarta text-sm">
                    {log.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {log.channel}
                  </span>
                </div>
                <p className="text-slate-600 max-w-2xl leading-relaxed">
                  {log.message}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {log.status}
                </span>
                <div className="text-[11px] text-slate-400 font-tnum mt-1">
                  {log.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
