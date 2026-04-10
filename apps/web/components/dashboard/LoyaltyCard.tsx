'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@spotlyclean/convex'
import { useState } from 'react'

export function LoyaltyCard() {
  const points = useQuery(api.loyalty.getPoints)
  const profile = useQuery(api.users.getProfile)
  const redeemPoints = useMutation(api.loyalty.redeemPoints)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [copied, setCopied] = useState(false)

  if (points === undefined || profile === undefined) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-40 rounded-xl bg-slate-200" />
      </div>
    )
  }

  const progressPercent = Math.min((points.points / 500) * 100, 100)

  async function handleRedeem() {
    setIsRedeeming(true)
    try {
      await redeemPoints()
    } catch (err: any) {
      alert(err.message || 'Failed to redeem points')
    } finally {
      setIsRedeeming(false)
    }
  }

  function handleCopyReferral() {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Loyalty & Referrals</h2>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {/* Points */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-900">{points.points}</p>
            <p className="text-sm text-slate-500">loyalty points</p>
          </div>
          {points.canRedeem && (
            <button
              onClick={handleRedeem}
              disabled={isRedeeming}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {isRedeeming ? 'Redeeming...' : `Redeem $${(points.redeemableCredits * points.creditValueCents) / 100}`}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{points.points} / 500 points</span>
            <span>$25 credit</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {!points.canRedeem && (
            <p className="mt-1 text-xs text-slate-400">
              {500 - points.points} more points until your next $25 credit
            </p>
          )}
        </div>

        {/* Referral code */}
        {profile?.referralCode && (
          <div className="mt-5 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Your referral code</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded bg-white px-3 py-1.5 text-sm font-mono font-semibold text-slate-900 border">
                {profile.referralCode}
              </code>
              <button
                onClick={handleCopyReferral}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-white transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Share your code and both you and your friend get $25 credit after their first clean.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
