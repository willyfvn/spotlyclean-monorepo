'use client'

import { useState } from 'react'
import { UpcomingBooking } from '@/components/dashboard/UpcomingBooking'
import { BookingHistory } from '@/components/dashboard/BookingHistory'

export default function BookingsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'upcoming'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab('past')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'past'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Past
        </button>
      </div>

      {tab === 'upcoming' ? <UpcomingBooking /> : <BookingHistory />}
    </div>
  )
}
