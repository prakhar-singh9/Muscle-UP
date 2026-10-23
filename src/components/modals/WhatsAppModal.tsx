import React, { useState } from 'react';
import { X, Send, MessageSquare, Check, Sparkles } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const WhatsAppModal: React.FC = () => {
  const { isWhatsAppModalOpen, setIsWhatsAppModalOpen, selectedMember, sendWhatsAppMessage } = useGym();
  const [template, setTemplate] = useState('reminder');
  const [customText, setCustomText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isWhatsAppModalOpen || !selectedMember) return null;

  const templates: Record<string, { title: string; text: string }> = {
    reminder: {
      title: 'Renewal Reminder & UPI Link',
      text: `Hi ${selectedMember.name}, your ${selectedMember.planName} at MuscleUp Gym expires soon on ${selectedMember.expiryDate}. Tap here to renew instantly via UPI: https://muscleup.fitness/pay/${selectedMember.id} - Front Desk Team.`
    },
    welcome: {
      title: 'Welcome & Locker Credentials',
      text: `Welcome to MuscleUp, ${selectedMember.name}! Your member ID is ${selectedMember.id} and your assigned locker is ${selectedMember.lockerNo || 'L-42'}. Your coach is ${selectedMember.assignedTrainer || 'Coach Sandeep Kumar'}. Let's crush your goals!`
    },
    workout: {
      title: 'Workout Consistency Streak',
      text: `Great job on maintaining your workout streak this week, ${selectedMember.name}! You've logged ${selectedMember.lifetimeVisits} lifetime sessions. Keep up the momentum!`
    },
    custom: {
      title: 'Custom Announcement',
      text: customText || `Hello ${selectedMember.name}, this is a quick message from MuscleUp Front Desk.`
    }
  };

  const handleSend = () => {
    const activeData = templates[template] || templates.reminder;
    sendWhatsAppMessage(selectedMember.id, activeData.title, activeData.text);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsWhatsAppModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm font-jakarta">Send WhatsApp Notification</h3>
              <p className="text-[11px] text-emerald-100">To: {selectedMember.name} ({selectedMember.phone})</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="text-emerald-100 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Message Template
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTemplate('reminder')}
                className={`p-2 rounded border text-left transition-all ${
                  template === 'reminder'
                    ? 'border-[#65a30d] bg-lime-50 font-bold text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Renewal Reminder
              </button>
              <button
                type="button"
                onClick={() => setTemplate('welcome')}
                className={`p-2 rounded border text-left transition-all ${
                  template === 'welcome'
                    ? 'border-[#65a30d] bg-lime-50 font-bold text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Welcome & Locker
              </button>
              <button
                type="button"
                onClick={() => setTemplate('workout')}
                className={`p-2 rounded border text-left transition-all ${
                  template === 'workout'
                    ? 'border-[#65a30d] bg-lime-50 font-bold text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Workout Streak
              </button>
              <button
                type="button"
                onClick={() => setTemplate('custom')}
                className={`p-2 rounded border text-left transition-all ${
                  template === 'custom'
                    ? 'border-[#65a30d] bg-lime-50 font-bold text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {template === 'custom' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Custom Message Content
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                placeholder="Type your message here..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#65a30d] focus:outline-none"
              />
            </div>
          )}

          {/* WhatsApp Preview Bubble */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Live Gateway Preview
            </label>
            <div className="bg-[#EFEAE2] p-3 rounded-lg border border-slate-200 relative">
              <div className="bg-white rounded-lg p-3 text-xs text-slate-800 shadow-xs max-w-[90%] ml-auto border border-emerald-100">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {templates[template]?.text}
                </p>
                <div className="text-[10px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                  <span>11:24 AM</span>
                  <span className="text-[#34B7F1] font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>

          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp message delivered via Cloud API Gateway!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sentSuccess}
            className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded flex items-center gap-2 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sentSuccess ? 'Delivered!' : 'Send Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
