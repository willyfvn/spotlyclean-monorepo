'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { BookingWizard } from '@/components/booking/BookingWizard'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      {/* Branded header */}
      <div className="mx-auto mb-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-forest-deep"
          >
            SpotlyClean
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-charcoal/40">
            <svg
              className="h-3.5 w-3.5 text-gold"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">4.9/5</span> &middot; 87 reviews
          </div>
        </div>
        <p className="mt-1 text-sm text-charcoal/50">
          Book your clean &middot; Takes 2 minutes
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl animate-pulse space-y-4">
            <div className="h-3 w-32 rounded-full bg-sage" />
            <div className="h-16 rounded-2xl bg-sage/50" />
            <div className="h-80 rounded-2xl bg-sage/30" />
          </div>
        }
      >
        <BookingWizard />
      </Suspense>
    </div>
  )
}
