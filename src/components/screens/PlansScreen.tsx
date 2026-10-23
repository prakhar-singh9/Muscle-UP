import React from 'react';
import { Layers, Check, Sparkles, Plus, Dumbbell, Shield, Flame } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { INITIAL_PLAN_TIERS } from '../../data/mockData';

export const PlansScreen: React.FC = () => {
  const { setCurrentScreen } = useGym();

  const plans = [
    {
      title: 'Monthly Flex',
      price: 2500,
      duration: '30 Days Access',
      badge: 'Standard',
      popular: false,
      features: [
        'All-hours gym floor access',
        'Locker room & shower access',
        'RFID wristband turnstile entry',
        'Mobile workout tracking app'
      ]
    },
    {
      title: 'Quarterly Gold',
      price: 6500,
      duration: '90 Days Access',
      badge: 'Most Popular',
      popular: true,
      features: [
        'All-hours gym floor access',
        'Dedicated middle-tier RFID locker',
        '1 complimentary PT posture intake',
        'Steam & sauna weekend access',
        '2 guest passes per quarter'
      ]
    },
    {
      title: 'Half-Yearly Elite',
      price: 11500,
      duration: '180 Days Access',
      badge: 'Recommended',
      popular: false,
      features: [
        'Priority gym floor access',
        'Permanent assigned locker',
        'Bi-weekly trainer consultation',
        'Free smoothie bar voucher monthly',
        'Unlimited steam & sauna privileges',
        '14-day medical freeze pass'
      ]
    },
    {
      title: 'Yearly Prime All-Access',
      price: 19999,
      duration: '365 Days Access',
      badge: 'Best Value',
      popular: false,
      features: [
        'Complete 24x7 all-branch access (Indiranagar & Koramangala)',
        'VIP locker & private laundry service',
        '12 complimentary PT sessions included',
        'Full dietary & macros nutrition protocol',
        '30-day medical freeze pass guarantee',
        'Personal RFID biometric silicone wristband'
      ]
    }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OPERATION SUITE &gt; CATALOG &amp; PACKAGES
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 font-jakarta tracking-tight">
            Membership Plans &amp; Add-on Packages
          </h1>
          <p className="text-xs text-slate-500">
            Define pricing tiers, turnstile privileges, and personal trainer add-ons.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('add-member')}
          className="flex items-center gap-2 px-4 py-2 bg-[#65a30d] hover:bg-[#558b09] text-white rounded text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Plan Tier</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div
            key={p.title}
            className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all relative ${
              p.popular
                ? 'border-[#65a30d] ring-1 ring-[#65a30d] shadow-md'
                : 'border-slate-200 shadow-2xs hover:shadow-sm'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#65a30d] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {p.badge}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base font-jakarta">
                  {p.title}
                </h3>
                {!p.popular && (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 pb-4 border-b border-slate-100">
                <div className="text-3xl font-black text-slate-900 font-jakarta font-tnum">
                  ₹{p.price.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {p.duration} • Incl. 18% GST
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                {p.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#65a30d] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('add-member')}
              className={`w-full mt-6 py-2 rounded text-xs font-bold transition-all ${
                p.popular
                  ? 'bg-[#65a30d] hover:bg-[#558b09] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Enroll Member
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
