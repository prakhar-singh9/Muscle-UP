import React from 'react';
import { 
  Users, 
  CreditCard, 
  RotateCw, 
  Wallet, 
  ScanLine, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  UserPlus,
  DoorOpen,
  QrCode
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const DashboardScreen: React.FC = () => {
  const { 
    currentFloorLoad, 
    maxFloorCap, 
    todayJoinedCount, 
    todayCounterUpi, 
    members, 
    attendanceLogs, 
    setCurrentScreen, 
    setIsScannerOpen, 
    navigateToMember 
  } = useGym();

  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const expiringCount = members.filter(m => m.status === 'expiring').length;
  const liveDatabaseMode = isSupabaseConfigured;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OPERATION SUITE &gt; EXECUTIVE OVERVIEW
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
            Gym Floor Command Center
          </h1>
          <p className="text-xs text-slate-500">
            {liveDatabaseMode ? 'Database-backed member overview. Attendance, memberships, and payments will appear once those integrations are connected.' : 'Demo view: turnstile telemetry, financial throughput, and floor density metrics.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-slate-500" />
            <span>Turnstile Kiosk</span>
          </button>
          <button
            onClick={() => setCurrentScreen('add-member')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#65a30d] hover:bg-[#558b09] text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Floor Load */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{liveDatabaseMode ? 'Live Floor Occupancy' : 'Live Floor Occupancy'}</span>
            <Activity className="w-4 h-4 text-[#65a30d]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            {liveDatabaseMode ? '—' : currentFloorLoad} <span className="text-base text-slate-400 font-normal">{liveDatabaseMode ? 'Not connected' : `/ ${maxFloorCap} Cap`}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-[#65a30d] h-1.5 rounded-full"
              style={{ width: liveDatabaseMode ? '0%' : `${(currentFloorLoad / maxFloorCap) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-slate-500 flex justify-between">
            <span>{liveDatabaseMode ? 'Turnstile integration not connected' : 'Turnstile Gate 1 Online'}</span>
            <span>{liveDatabaseMode ? 'No live data' : `${Math.round((currentFloorLoad / maxFloorCap) * 100)}% density`}</span>
          </div>
        </div>

        {/* Today's Counter UPI */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{liveDatabaseMode ? 'Today’s UPI Collections' : 'Today’s Counter UPI'}</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            {liveDatabaseMode ? 'Not available' : `₹${todayCounterUpi.toLocaleString('en-IN')}`}
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            {!liveDatabaseMode && <><ArrowUpRight className="w-3.5 h-3.5" /><span>+18.4% vs yesterday</span></>}
            {liveDatabaseMode && <span className="text-slate-500">Payment records are not connected</span>}
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{liveDatabaseMode ? 'Registered Members' : 'Active Enrolled Members'}</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-jakarta font-tnum">
            {liveDatabaseMode ? members.length : activeMembersCount}
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-500">
            {liveDatabaseMode ? 'Loaded from Supabase' : `${todayJoinedCount} new joined today`}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{liveDatabaseMode ? 'Memberships Expiring Soon' : 'Expiring Within 7 Days'}</span>
            <RotateCw className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2 font-jakarta font-tnum">
            {liveDatabaseMode ? '—' : expiringCount}
          </div>
          <div className="mt-2 text-xs font-semibold text-amber-700">
            {liveDatabaseMode ? 'Membership records not connected' : '₹1,84,500 recoverable revenue'}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Floor Check-ins vs Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Real-time Turnstile Live Feed */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#65a30d]" />
              <h3 className="text-sm font-bold text-slate-900 font-jakarta">
                Live Turnstile Entry Stream (Gate 1)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {liveDatabaseMode ? 'No live feed' : 'Demo data'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {liveDatabaseMode ? (
              <div className="p-8 text-center text-sm text-slate-500">Attendance records are not connected to Supabase yet.</div>
            ) : attendanceLogs.slice(0, 6).map((log) => (
              <div 
                key={log.id} 
                onClick={() => navigateToMember(log.memberId)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-lime-50 text-[#65a30d] font-bold flex items-center justify-center text-xs">
                    {log.memberName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs font-jakarta flex items-center gap-2">
                      {log.memberName}
                      <span className="font-mono text-[10px] text-slate-400 font-normal">
                        {log.memberId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {log.gate} • {log.accessKey}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'On-Floor' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
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

        {/* Right Column (4 cols): Quick Operations Launcher */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Front Desk Quick Operations
            </h3>

            <button
              onClick={() => setCurrentScreen('payments')}
              className="w-full p-3 bg-slate-50 hover:bg-lime-50/50 border border-slate-200 hover:border-[#65a30d] rounded-lg text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white shadow-2xs flex items-center justify-center text-slate-700">
                  <QrCode className="w-4 h-4 text-[#65a30d]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Launch UPI Counter QR</div>
                  <div className="text-[10px] text-slate-500">{liveDatabaseMode ? 'Payment integration not connected' : 'Demo QR counter action'}</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentScreen('memberships')}
              className="w-full p-3 bg-slate-50 hover:bg-lime-50/50 border border-slate-200 hover:border-[#65a30d] rounded-lg text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white shadow-2xs flex items-center justify-center text-slate-700">
                  <RotateCw className="w-4 h-4 text-[#65a30d]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Renew Membership Cycle</div>
                  <div className="text-[10px] text-slate-500">{liveDatabaseMode ? 'Membership integration not connected' : 'Demo membership action'}</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentScreen('members')}
              className="w-full p-3 bg-slate-50 hover:bg-lime-50/50 border border-slate-200 hover:border-[#65a30d] rounded-lg text-left transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white shadow-2xs flex items-center justify-center text-slate-700">
                  <Users className="w-4 h-4 text-[#65a30d]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Browse Full Member Roster</div>
                  <div className="text-[10px] text-slate-500">{liveDatabaseMode ? `${members.length} records loaded` : 'Demo roster'}</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Franchise Compliance Card */}
          <div className="bg-[#0b1c30] text-white rounded-lg p-5 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-[#a3e635] uppercase tracking-wider block">
              Franchise GST Compliance
            </span>
            <div className="text-sm font-bold font-jakarta">
              MuscleUp Fitness Pvt Ltd
            </div>
            <div className="text-xs font-mono text-slate-300">
              GSTIN: 29AAACM1204N1Z5
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-snug">
              HSN Code 999723 enabled. Daily closing logs auto-synced to Tally ERP9 and Chartered Accountant ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
