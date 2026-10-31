/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BookingModal } from './components/bookings/BookingModal';
import { AiMatcherModal } from './components/ai/AiMatcherModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { ResourceDetailsPage } from './pages/ResourceDetailsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingRequestsPage } from './pages/BookingRequestsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AddResourcePage } from './pages/AddResourcePage';
import { CheckInOutPage } from './pages/CheckInOutPage';
import { ConditionReportsPage } from './pages/ConditionReportsPage';
import { ActivityHistoryPage } from './pages/ActivityHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AccessDeniedView } from './components/auth/AccessDeniedView';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    canAccessPage,
    currentPage,
    bookingModalResource,
    setBookingModalResource,
    isAiModalOpen,
    setIsAiModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not authenticated or explicitly at login, show the professional LoginPage
  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    // Check role-based permission
    if (!canAccessPage(currentPage)) {
      return <AccessDeniedView attemptedPage={currentPage} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'explore':
        return <ExplorePage />;
      case 'resource-details':
        return <ResourceDetailsPage />;
      case 'my-bookings':
        return <MyBookingsPage />;
      case 'booking-requests':
        return <BookingRequestsPage />;
      case 'owner-dashboard':
        return <OwnerDashboardPage />;
      case 'add-resource':
        return <AddResourcePage />;
      case 'checkin-checkout':
        return <CheckInOutPage />;
      case 'condition-reports':
        return <ConditionReportsPage />;
      case 'activity-history':
        return <ActivityHistoryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header */}
      <Header />

      {/* Mobile Menu Bar for small devices */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 flex items-center gap-2 text-xs font-semibold"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Navigation Menu</span>
        </button>
        <span className="text-xs font-mono font-medium text-slate-500 capitalize">
          {currentPage.replace('-', ' ')}
        </span>
      </div>

      {/* Main Body with Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Platform Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div
                className="flex-1 overflow-y-auto"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Modals */}
      <BookingModal
        resource={bookingModalResource}
        onClose={() => setBookingModalResource(null)}
      />

      <AiMatcherModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
