import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Wallet, 
  Bell, 
  Layers, 
  Settings, 
  LogOut,
  Dumbbell
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { ScreenType } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useGym();

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'members', label: 'Members', icon: <Users className="w-5 h-5" /> },
    { id: 'memberships', label: 'Memberships', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <Wallet className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'plans', label: 'Membership Plans', icon: <Layers className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  // If we are on member-detail or add-member, highlight 'members' or keep context clean
  const isNavActive = (id: ScreenType) => {
    if (currentScreen === id) return true;
    if (id === 'members' && (currentScreen === 'member-detail' || currentScreen === 'add-member')) {
      return true;
    }
    return false;
  };

  return (
    <aside className="w-[260px] min-w-[260px] h-screen bg-[#0b1c30] text-slate-300 flex flex-col justify-between select-none border-r border-[#1e293b] fixed left-0 top-0 z-30">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => setCurrentScreen('dashboard')}
          className="p-5 cursor-pointer flex items-center gap-3 border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors"
        >
          <div className="w-9 h-9 rounded bg-[#65a30d] flex items-center justify-center text-white font-black shadow-md shadow-[#65a30d]/20">
            <span className="text-lg tracking-tighter">M</span>
          </div>
          <div className="leading-none">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#a3e635]">
              MuscleUp
            </div>
            <div className="text-lg font-black tracking-tight text-white font-jakarta">
              MUSCLE<span className="text-[#a3e635]">UP</span>
            </div>
          </div>
        </div>

        {/* Operation Suite Category */}
        <div className="px-5 pt-6 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Operation Suite
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#65a30d] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className={active ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-slate-800/90 bg-[#081524]">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Rahul Verma"
              className="w-9 h-9 rounded-full object-cover border border-[#65a30d]/50"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate font-jakarta">
                Rahul Verma
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Gym Administrator
              </div>
            </div>
          </div>
          <button 
            title="Log out / Switch User"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
