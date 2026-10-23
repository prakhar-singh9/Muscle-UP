import React, { useState } from 'react';
import { 
  X, 
  ScanLine, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  DoorOpen,
  User
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types';

export const RfidScannerModal: React.FC = () => {
  const { isScannerOpen, setIsScannerOpen, checkInMember, members, navigateToMember } = useGym();
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; member?: Member } | null>(null);

  if (!isScannerOpen) return null;

  const handleScan = (query: string) => {
    if (!query.trim()) return;
    const res = checkInMember(query);
    setResult(res);
  };

  const handleQuickTap = (id: string) => {
    setInputVal(id);
    handleScan(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-[#0b1c30] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#65a30d] flex items-center justify-center text-white">
              <ScanLine className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base font-jakarta">RFID Gate Turnstile Simulator</h3>
              <p className="text-xs text-slate-300">Terminal Gate 1 • Turnstile A (Biometric & NFC)</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsScannerOpen(false);
              setResult(null);
              setInputVal('');
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Simulate Wristband Tap / Barcode / Member ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan(inputVal)}
                placeholder="e.g. MU-1088 or #NFC-9981-L or name"
                className="flex-1 h-11 px-3.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#65a30d]"
                autoFocus
              />
              <button
                onClick={() => handleScan(inputVal)}
                className="px-5 h-11 bg-[#65a30d] hover:bg-[#558b09] text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                <span>Simulate Tap</span>
              </button>
            </div>
          </div>

          {/* Preset Member Quick Taps */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Test Taps
            </span>
            <div className="grid grid-cols-3 gap-2">
              {members.slice(0, 3).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleQuickTap(m.id)}
                  className="p-2 text-left bg-slate-50 hover:bg-lime-50 border border-slate-200 hover:border-[#65a30d] rounded transition-all text-xs"
                >
                  <div className="font-bold text-slate-800 truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{m.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Result Banner */}
          {result && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 transition-all ${
                result.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold text-sm font-jakarta">
                  {result.success ? 'TURNSTILE UNLOCKED - ACCESS GRANTED' : 'GATE RESTRICTED'}
                </div>
                <div className="text-xs mt-1 text-slate-700 leading-relaxed">
                  {result.message}
                </div>
                {result.member && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Locker: {result.member.lockerNo || 'No Locker'}
                    </span>
                    <button
                      onClick={() => {
                        setIsScannerOpen(false);
                        navigateToMember(result.member!.id);
                      }}
                      className="text-[#65a30d] hover:underline font-bold"
                    >
                      View Profile →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Connected to Turnstile IP: 192.168.1.140</span>
          <button
            onClick={() => {
              setIsScannerOpen(false);
              setResult(null);
            }}
            className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
