'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { BookingWizard } from '@/components/booking/BookingWizard'

export default function BookPage() {
  return (
    <div className="relative min-h-screen bg-cream overflow-hidden">
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-sage/30 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-forest/[0.04] blur-3xl" />
      </div>

      <div className="relative px-4 py-8 sm:py-12">
        {/* Branded header */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest shadow-sm">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-forest-deep group-hover:text-forest transition-colors">
                SpotlyClean
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-xs text-charcoal/50 backdrop-blur-sm border border-charcoal/[0.06]">
                <svg className="h-3.5 w-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-charcoal/70">4.9</span>
                <span className="text-charcoal/30">&middot;</span>
                <span>87 reviews</span>
              </div>
            </div>
          </div>
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
    </div>
  )
}
