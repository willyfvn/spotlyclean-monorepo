'use client'

import { useState } from 'react'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'
import { ADD_ON_PRICES } from '@spotlyclean/utils'

const PROPERTY_LABELS: Record<string, string> = {
  home: 'Home',
  office: 'Office',
  airbnb: 'Airbnb',
  post_construction: 'Post-Construction',
  restaurant: 'Restaurant',
}

const ADD_ON_LABELS: Record<string, string> = {
  fridge: 'Inside fridge',
  stove: 'Inside stove/oven',
  inside_windows: 'Inside windows',
  dishes: 'Dishes',
  pet_surcharge: 'Pet surcharge',
}

const INCLUDED_FEATURES = [
  'All rooms cleaned',
  'Bathrooms scrubbed',
  'Kitchen surfaces',
  'Floors vacuumed & mopped',
  'Dusting throughout',
]

interface Props {
  propertyType: PropertyType
  floors: 1 | 2 | 3
  frequency: Frequency
  addOns: AddOn[]
  scheduledAt: number
  notes: string
  entryInstructions: string
  priceCents: number
  firstCleanCents: number
  durationMinutes: number
  createDraft: (args: any) => Promise<any>
  onBack: () => void
}

export function StepPayment({
  propertyType,
  floors,
  frequency,
  addOns,
  scheduledAt,
  notes,
  entryInstructions,
  priceCents,
  firstCleanCents,
  durationMinutes,
  createDraft,
  onBack,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const date = new Date(scheduledAt)

  async function handlePay() {
    setIsProcessing(true)
    setError('')
    try {
      const bookingId = await createDraft({
        propertyType,
        floors,
        frequency,
        addOns,
        scheduledAt,
        durationMinutes,
        totalPriceCents: firstCleanCents,
        notes: notes || undefined,
        entryInstructions: entryInstructions || undefined,
      })

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, propertyType, floors, frequency, addOns }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-semibold text-charcoal">
        You&apos;re almost there
      </h3>
      <p className="mb-6 text-xs uppercase tracking-widest text-forest">
        Your Booking Summary
      </p>

      {/* Summary card */}
      <div className="rounded-2xl border border-sage-dark/30 bg-cream p-5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Property</span>
            <span className="font-medium text-charcoal">
              {PROPERTY_LABELS[propertyType]} &middot; {floors} floor{floors > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Frequency</span>
            <span className="font-medium text-charcoal">
              {frequency === 'weekly' ? 'Weekly' : 'Biweekly'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Date & Time</span>
            <span className="font-medium text-charcoal">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
              {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Est. duration</span>
            <span className="font-medium text-charcoal">
              ~{Math.floor(durationMinutes / 60)}h
              {durationMinutes % 60 > 0 ? ` ${durationMinutes % 60}m` : ''}
            </span>
          </div>

          {addOns.length > 0 && (
            <div className="rounded-xl bg-white p-3 mt-2">
              <p className="text-xs font-medium text-charcoal/50 mb-2">Add-ons</p>
              {addOns.map((addon) => (
                <div key={addon} className="flex justify-between text-sm">
                  <span className="text-charcoal/50">{ADD_ON_LABELS[addon]}</span>
                  <span className="text-charcoal/70">+${ADD_ON_PRICES[addon]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="rounded-xl bg-forest text-white p-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/80">First clean (deep clean)</span>
              <span className="text-2xl font-bold">
                ${(firstCleanCents / 100).toFixed(0)}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Then ${(priceCents / 100).toFixed(0)}/{frequency === 'weekly' ? 'week' : 'visit'}
            </p>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[...INCLUDED_FEATURES, ...addOns.map((a) => ADD_ON_LABELS[a])].map(
          (feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 rounded-full bg-sage/50 px-3 py-1 text-xs font-medium text-forest"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {feature}
            </span>
          )
        )}
      </div>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-3 py-1.5 text-[11px] font-medium text-charcoal/50">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          256-bit SSL
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-3 py-1.5 text-[11px] font-medium text-charcoal/50">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Satisfaction guaranteed
        </span>
      </div>

      {/* Guarantee reminder */}
      <p className="mt-3 text-center text-xs text-charcoal/40">
        Not happy with your clean? We&apos;ll return within 24 hours, free. No questions asked.
      </p>

      {notes && (
        <div className="mt-4 rounded-xl bg-cream p-3">
          <p className="text-xs font-medium text-charcoal/50">Notes</p>
          <p className="text-sm text-charcoal/70">{notes}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 rounded-full border border-charcoal/10 px-4 py-3.5 text-base font-semibold text-charcoal/60 transition-all hover:bg-charcoal/[0.03] disabled:opacity-50 active:scale-[0.97]"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="flex-1 rounded-full bg-forest px-4 py-4 text-base font-bold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-deep disabled:opacity-50 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {isProcessing
              ? 'Processing...'
              : `Pay $${(firstCleanCents / 100).toFixed(0)} securely`}
          </span>
        </button>
      </div>
    </div>
  )
}
