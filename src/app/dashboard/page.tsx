"use client";

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { ExplorationSection } from '@/components/dashboard/exploration-section'
import { UpcomingTrip } from '@/components/dashboard/upcoming-trip'
import { DealsCarousel } from '@/components/dashboard/deals-carousel'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 w-full pt-8 pb-16">
        <DashboardHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Column */}
          <div className="lg:col-span-2 space-y-10">
            <ExplorationSection />
            <UpcomingTrip />
            <DealsCarousel />
          </div>

          {/* Right Sidebar - Widgets/Quick Info */}
          <div className="space-y-6">
            {/* Tip Card */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h3 className="font-bold text-amber-900 mb-2">💡 Travel Tip</h3>
              <p className="text-sm text-amber-800">
                Book your flights at least 3 weeks in advance to get the best prices. Weekday departures are usually cheaper!
              </p>
            </div>

            {/* Support Widget */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Need Assistance?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-slate-600 hover:text-orange-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Manage Bookings
                </li>
                <li className="flex items-center gap-2 text-slate-600 hover:text-orange-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Cancel a Reservation
                </li>
                <li className="flex items-center gap-2 text-slate-600 hover:text-orange-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Contact Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
