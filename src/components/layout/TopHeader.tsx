import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  UserPlus, 
  ScanLine, 
  MapPin, 
  CheckCircle2, 
  X,
  ChevronDown 
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const TopHeader: React.FC = () => {
  const { 
    members, 
    navigateToMember, 
    setCurrentScreen, 
    currentBranch, 
    setCurrentBranch,
    setIsScannerOpen 
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = searchQuery.trim()
    ? members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery)
      )
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Global Search Bar */}
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search member by name, phone or ID..."
            className="w-full h-10 pl-10 pr-9 bg-[#f8fafc] border border-slate-200 rounded text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#65a30d]/30 transition-all font-inter"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Popup */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-11 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
            <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Matching Members ({filteredMembers.length})</span>
              <span className="text-slate-400">Click to view profile</span>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      navigateToMember(m.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 font-jakarta flex items-center gap-2">
                          {m.name}
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                            {m.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-tnum">
                          {m.phone} • {m.planName}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        m.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : m.status === 'expiring'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">
                  No member found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Branch Selector */}
        <div className="relative">
          <button
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#65a30d]" />
            <span>{currentBranch}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 top-9 w-52 bg-white border border-slate-200 rounded shadow-lg py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Branch
              </div>
              <button
                onClick={() => {
                  setCurrentBranch('Koramangala Branch');
                  setShowBranchMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                  currentBranch === 'Koramangala Branch'
                    ? 'bg-lime-50 text-[#65a30d] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Koramangala Branch</span>
                {currentBranch === 'Koramangala Branch' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setCurrentBranch('Indiranagar Flagship');
                  setShowBranchMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                  currentBranch === 'Indiranagar Flagship'
                    ? 'bg-lime-50 text-[#65a30d] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Indiranagar Flagship</span>
                {currentBranch === 'Indiranagar Flagship' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Demo Mode Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          <span className="w-2 h-2 rounded-full bg-[#65a30d] animate-pulse"></span>
          <span>Demo Mode</span>
        </div>

        {/* Quick Kiosk / RFID Scanner */}
        <button
          onClick={() => setIsScannerOpen(true)}
          title="Turnstile & RFID Scanner Kiosk"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded shadow-2xs transition-colors"
        >
          <ScanLine className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Quick Scan</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 font-jakarta">Notifications</span>
                <span className="text-[11px] text-[#65a30d] font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 mt-1 max-h-60 overflow-y-auto">
                <div className="py-2">
                  <div className="text-xs font-semibold text-slate-800">Renewal Alert: Devendra Sharma</div>
                  <div className="text-[11px] text-slate-500">Membership expires in 3 days. WhatsApp reminder scheduled.</div>
                </div>
                <div className="py-2">
                  <div className="text-xs font-semibold text-slate-800">3 Pending UPI Verifications</div>
                  <div className="text-[11px] text-slate-500">Aditi Deshmukh UTR 429910482910 requires admin clearance.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: + Add Member */}
        <button
          onClick={() => setCurrentScreen('add-member')}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#65a30d] hover:bg-[#558b09] active:scale-[0.98] text-white text-xs font-bold rounded shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Member</span>
        </button>

        {/* User Avatar */}
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          alt="Rahul Verma"
          className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer"
          title="Rahul Verma - Gym Admin"
        />
      </div>
    </header>
  );
};
