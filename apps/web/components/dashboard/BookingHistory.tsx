'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@spotlyclean/convex'
import { useState } from 'react'

const PROPERTY_LABELS: Record<string, string> = {
  home: 'Home',
  office: 'Office',
  airbnb: 'Airbnb',
  post_construction: 'Post-Construction',
  restaurant: 'Restaurant',
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number
  onRate?: (r: number) => void
  interactive?: boolean
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <svg
            className={`h-4 w-4 ${
              star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-200'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export function BookingHistory({ limit }: { limit?: number }) {
  const bookings = useQuery(api.bookings.getHistory)
  const addRating = useMutation(api.bookings.addRating)
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null)

  if (bookings === undefined) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-20 rounded-xl bg-slate-200" />
        <div className="h-20 rounded-xl bg-slate-200" />
      </div>
    )
  }

  const displayBookings = limit ? bookings.slice(0, limit) : bookings

  if (displayBookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-500">No past bookings yet</p>
      </div>
    )
  }

  async function handleRate(bookingId: string, rating: number) {
    try {
      await addRating({ bookingId: bookingId as any, rating })
      setRatingBookingId(null)
    } catch (err: any) {
      alert(err.message || 'Failed to submit rating')
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Past Bookings</h2>
      <div className="space-y-2">
        {displayBookings.map((booking: any) => {
          const date = new Date(booking.scheduledAt)
          const isCompleted = booking.status === 'completed'
          const needsRating = isCompleted && !booking.rating

          return (
            <div key={booking._id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">
                      {PROPERTY_LABELS[booking.propertyType] || booking.propertyType} Cleaning
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ${(booking.totalPriceCents / 100).toFixed(2)}
                  </p>
                  {booking.rating ? (
                    <StarRating rating={booking.rating} />
                  ) : needsRating ? (
                    ratingBookingId === booking._id ? (
                      <StarRating
                        rating={0}
                        interactive
                        onRate={(r) => handleRate(booking._id, r)}
                      />
                    ) : (
                      <button
                        onClick={() => setRatingBookingId(booking._id)}
                        className="text-xs font-medium text-primary hover:text-primary-dark"
                      >
                        Rate this clean
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
