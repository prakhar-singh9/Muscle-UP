import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, QrCode, Cpu, Building2, CheckCircle2 } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const SettingsScreen: React.FC = () => {
  const { currentBranch, setCurrentBranch } = useGym();
  const [gstin, setGstin] = useState('29AAACM1204N1Z5');
  const [vpa, setVpa] = useState('muscleup.fitness@icici');
  const [turnstileIp, setTurnstileIp] = useState('192.168.1.140');
  const [terminalId, setTerminalId] = useState('Terminal #MU-BLR-02');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          OPERATION SUITE &gt; SYSTEM ADMINISTRATION
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
          System &amp; Hardware Gate Configuration
        </h1>
        <p className="text-xs text-slate-500">
          Gym legal identity, GSTIN registration, biometric turnstile gateways, and UPI payment terminals.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Gym Entity & Tax Profile */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-[#65a30d]" />
            <h3 className="text-sm font-bold text-slate-900 font-jakarta">
              Franchise Entity &amp; GST Details
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Legal Business Name
            </label>
            <input
              type="text"
              defaultValue="MuscleUp Fitness Private Limited"
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Gym GSTIN Number (State Code 29 - Karnataka)
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Cryptographically signed on all invoices &amp; receipt exports
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Active Operational Branch
            </label>
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            >
              <option value="Koramangala Branch">Koramangala Branch (Flagship Suite)</option>
              <option value="Indiranagar Flagship">Indiranagar Center</option>
            </select>
          </div>
        </div>

        {/* Card 2: Payment Gateway & Turnstile Hardware */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-[#65a30d]" />
            <h3 className="text-sm font-bold text-slate-900 font-jakarta">
              Hardware Turnstile &amp; UPI QR Terminals
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Desk Merchant UPI VPA
            </label>
            <input
              type="text"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Auto-generates dynamic QR payloads for members
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Turnstile A Biometric Controller IP
            </label>
            <input
              type="text"
              value={turnstileIp}
              onChange={(e) => setTurnstileIp(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Listens for RFID 13.56MHz Mifare / NFC wristband check-ins
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Front Desk Station Terminal ID
            </label>
            <input
              type="text"
              value={terminalId}
              onChange={(e) => setTerminalId(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#65a30d]"
            />
          </div>
        </div>

        {/* Save button banner */}
        <div className="lg:col-span-2 flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          {saved ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings and hardware bindings updated successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Changes take effect immediately across all desk terminals.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#65a30d] hover:bg-[#558b09] text-white text-xs font-bold rounded shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
