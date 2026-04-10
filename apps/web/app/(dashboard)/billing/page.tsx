'use client'

import { useQuery } from 'convex/react'
import { api } from '@spotlyclean/convex'
import { useState } from 'react'

export default function BillingPage() {
  const profile = useQuery(api.users.getProfile)
  const [isLoading, setIsLoading] = useState(false)

  async function handleManageBilling() {
    if (!profile?.stripeCustomerId) {
      alert('No billing account found. Complete a booking first to set up billing.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: profile.stripeCustomerId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-4">
        <div className="h-8 w-32 rounded bg-slate-200" />
        <div className="h-48 rounded-xl bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Billing</h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Payment Management</h2>
            <p className="mt-1 text-sm text-slate-500">
              View invoices, update payment methods, and manage subscriptions through our secure billing portal.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Opening...' : 'Manage Billing'}
            </button>
          </div>
        </div>
      </div>

      {profile?.stripeSubscriptionId && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Active Subscription</h2>
          <p className="mt-1 text-sm text-slate-500">
            You have an active recurring cleaning subscription.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Active</span>
          </div>
        </div>
      )}
    </div>
  )
}
