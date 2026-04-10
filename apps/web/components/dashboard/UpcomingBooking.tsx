'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@spotlyclean/convex'
import Link from 'next/link'
import { useState } from 'react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  en_route: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-primary/10 text-primary',
}

const PROPERTY_LABELS: Record<string, string> = {
  home: 'Home',
  office: 'Office',
  airbnb: 'Airbnb',
  post_construction: 'Post-Construction',
  restaurant: 'Restaurant',
}

export function UpcomingBooking() {
  const bookings = useQuery(api.bookings.getUpcoming)
  const cancelBooking = useMutation(api.bookings.cancel)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  if (bookings === undefined) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-32 rounded-xl bg-slate-200" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-slate-500">No upcoming bookings</p>
        <Link
          href="/book"
          className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Book a Clean
        </Link>
      </div>
    )
  }

  async function handleCancel(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    try {
      await cancelBooking({ bookingId: bookingId as any })
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Upcoming Bookings</h2>
      <div className="space-y-3">
        {bookings.map((booking: any) => {
          const date = new Date(booking.scheduledAt)
          return (
            <div key={booking._id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {PROPERTY_LABELS[booking.propertyType] || booking.propertyType} Cleaning
                    </h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[booking.status] || 'bg-slate-100 text-slate-600'}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {booking.floors} floor{booking.floors > 1 ? 's' : ''} &middot; {booking.frequency}
                    {booking.addOns.length > 0 && ` \u00B7 ${booking.addOns.length} add-on${booking.addOns.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  ${(booking.totalPriceCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/book?reschedule=${booking._id}`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Reschedule
                </Link>
                <button
                  onClick={() => handleCancel(booking._id)}
                  disabled={cancellingId === booking._id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
