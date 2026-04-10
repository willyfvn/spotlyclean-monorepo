'use client'

import { useUser } from '@clerk/nextjs'
import { UpcomingBooking } from '@/components/dashboard/UpcomingBooking'
import { BookingHistory } from '@/components/dashboard/BookingHistory'
import { LoyaltyCard } from '@/components/dashboard/LoyaltyCard'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-slate-500">Here&apos;s an overview of your cleaning schedule.</p>
        </div>
        <Link
          href="/book"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          Book a Clean
        </Link>
      </div>

      <UpcomingBooking />
      <LoyaltyCard />
      <BookingHistory limit={3} />
    </div>
  )
}
