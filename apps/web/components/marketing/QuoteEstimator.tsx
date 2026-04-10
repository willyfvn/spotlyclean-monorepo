'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { calculatePrice } from '@spotlyclean/utils'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'office', label: 'Office' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'post_construction', label: 'Post-Construction' },
  { value: 'restaurant', label: 'Restaurant' },
]

const FLOOR_OPTIONS: { value: 1 | 2 | 3; label: string }[] = [
  { value: 1, label: '1 Floor' },
  { value: 2, label: '2 Floors' },
  { value: 3, label: '3 Floors' },
]

const FREQUENCY_OPTIONS: { value: Frequency; label: string; badge?: string }[] = [
  { value: 'once', label: 'One-time deep clean' },
  { value: 'biweekly', label: 'Every 2 weeks', badge: 'Popular' },
  { value: 'weekly', label: 'Weekly', badge: 'Best value' },
]

const ADD_ON_OPTIONS: { value: AddOn; label: string; price: number }[] = [
  { value: 'fridge', label: 'Inside fridge', price: 25 },
  { value: 'stove', label: 'Inside stove/oven', price: 20 },
  { value: 'inside_windows', label: 'Inside windows', price: 20 },
  { value: 'dishes', label: 'Dishes', price: 20 },
  { value: 'pet_surcharge', label: 'Pet surcharge', price: 25 },
]

export function QuoteEstimator() {
  const [step, setStep] = useState(1)
  const [propertyType, setPropertyType] = useState<PropertyType>('home')
  const [floors, setFloors] = useState<1 | 2 | 3>(2)
  const [frequency, setFrequency] = useState<Frequency>('biweekly')
  const [addOns, setAddOns] = useState<AddOn[]>([])

  const { isSignedIn } = useAuth()
  const router = useRouter()

  const priceCents = useMemo(
    () => calculatePrice({ propertyType, floors, frequency, addOns }),
    [propertyType, floors, frequency, addOns]
  )

  const priceDollars = priceCents / 100

  function toggleAddOn(addOn: AddOn) {
    setAddOns((prev) =>
      prev.includes(addOn) ? prev.filter((a) => a !== addOn) : [...prev, addOn]
    )
  }

  function handleBook() {
    if (isSignedIn) {
      router.push('/book')
    } else {
      router.push('/sign-up')
    }
  }

  const isResidential = !['office', 'restaurant'].includes(propertyType)

  return (
    <section id="quote" className="bg-white py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Get your instant quote
          </h2>
          <p className="mt-2 text-slate-600">No commitment. No hidden fees.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          {/* Step indicators */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`h-2.5 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-primary'
                    : s < step
                      ? 'w-2.5 bg-primary/40'
                      : 'w-2.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Property Type */}
          {step === 1 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                What type of property?
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => setPropertyType(pt.value)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      propertyType === pt.value
                        ? 'border-primary bg-primary-light text-primary-dark'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-dark transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Floors */}
          {step === 2 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                {isResidential ? 'How many floors?' : 'Select your space'}
              </h3>
              {isResidential && (
                <div className="flex gap-3">
                  {FLOOR_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFloors(f.value)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                        floors === f.value
                          ? 'border-primary bg-primary-light text-primary-dark'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
              {!isResidential && (
                <p className="text-sm text-slate-500">
                  Office and restaurant pricing is based on frequency. Continue
                  to the next step.
                </p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-dark transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                How often?
              </h3>
              <div className="space-y-3">
                {FREQUENCY_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                      frequency === f.value
                        ? 'border-primary bg-primary-light text-primary-dark'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{f.label}</span>
                    {f.badge && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {f.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-dark transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Add-ons */}
          {step === 4 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Any extras?
              </h3>
              <div className="space-y-3">
                {ADD_ON_OPTIONS.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => toggleAddOn(a.value)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                      addOns.includes(a.value)
                        ? 'border-primary bg-primary-light text-primary-dark'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className="text-slate-500">+${a.price}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Live price display */}
          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-center">
            <p className="text-sm font-medium text-slate-500">Your estimate</p>
            <p className="mt-1 text-4xl font-bold text-slate-900">
              ${priceDollars}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {frequency === 'once'
                ? 'one-time'
                : frequency === 'weekly'
                  ? 'per visit, billed weekly'
                  : 'per visit, billed every 2 weeks'}
            </p>
            <button
              onClick={handleBook}
              className="mt-4 w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
