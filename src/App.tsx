/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdminAuthGate, AdminAuthProvider } from './auth/AdminAuth';
import { GymProvider, useGym } from './context/GymContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MembersDirectoryScreen } from './components/screens/MembersDirectoryScreen';
import { MemberDetailsScreen } from './components/screens/MemberDetailsScreen';
import { RenewalsScreen } from './components/screens/RenewalsScreen';
import { PaymentsScreen } from './components/screens/PaymentsScreen';
import { RegisterMemberScreen } from './components/screens/RegisterMemberScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { PlansScreen } from './components/screens/PlansScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { RfidScannerModal } from './components/modals/RfidScannerModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { BulkReminderModal } from './components/modals/BulkReminderModal';

const AppContent: React.FC = () => {
  const { currentScreen } = useGym();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Pinned Left Navigation Bar */}
      <Sidebar />

      {/* Main Dynamic Viewport */}
      <div className="flex-1 ml-[260px] min-w-0 flex flex-col min-h-screen">
        <TopHeader />

        <main className="flex-1 pb-16">
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'members' && <MembersDirectoryScreen />}
          {currentScreen === 'member-detail' && <MemberDetailsScreen />}
          {currentScreen === 'memberships' && <RenewalsScreen />}
          {currentScreen === 'payments' && <PaymentsScreen />}
          {currentScreen === 'add-member' && <RegisterMemberScreen />}
          {currentScreen === 'notifications' && <NotificationsScreen />}
          {currentScreen === 'plans' && <PlansScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <RfidScannerModal />
      <WhatsAppModal />
      <InvoiceModal />
      <BulkReminderModal />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminAuthGate>
        <GymProvider>
          <AppContent />
        </GymProvider>
      </AdminAuthGate>
    </AdminAuthProvider>
  );
}
