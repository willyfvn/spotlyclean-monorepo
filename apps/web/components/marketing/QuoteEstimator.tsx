'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { calculatePrice, calculateFirstCleanPrice } from '@spotlyclean/utils'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: string; sub: string }[] = [
  { value: 'home', label: 'Home', icon: '\u{1F3E0}', sub: 'Apartments, condos & houses' },
  { value: 'office', label: 'Office', icon: '\u{1F3E2}', sub: 'Workspaces & commercial' },
]

const FLOOR_OPTIONS: { value: 1 | 2 | 3; label: string; size: string }[] = [
  { value: 1, label: '1 Floor', size: '~800-1,200 sq ft' },
  { value: 2, label: '2 Floors', size: '~1,200-2,000 sq ft' },
  { value: 3, label: '3 Floors', size: '2,000+ sq ft' },
]

const FREQUENCY_OPTIONS: {
  value: Frequency
  label: string
  badge?: string
}[] = [
  { value: 'biweekly', label: 'Every 2 weeks', badge: 'Most popular' },
  { value: 'weekly', label: 'Weekly', badge: 'Best value' },
]

const ADD_ON_OPTIONS: { value: AddOn; label: string; price: number; popular?: boolean }[] = [
  { value: 'fridge', label: 'Inside fridge', price: 25, popular: true },
  { value: 'stove', label: 'Inside stove/oven', price: 20, popular: true },
  { value: 'inside_windows', label: 'Inside windows', price: 20 },
  { value: 'dishes', label: 'Dishes', price: 20 },
  { value: 'pet_surcharge', label: 'Pet surcharge', price: 25 },
]

type ServiceMode = 'onetime' | 'recurring'

export function QuoteEstimator() {
  const [serviceMode, setServiceMode] = useState<ServiceMode>('recurring')
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

  const firstCleanCents = useMemo(
    () => calculateFirstCleanPrice({ propertyType, floors, addOns }),
    [propertyType, floors, addOns]
  )

  const firstCleanDollars = firstCleanCents / 100
  const priceDollars = priceCents / 100

  // One-time: Property → Size → Extras → Estimate
  // Recurring: Property → Size → Frequency → Extras → Estimate
  const totalSteps = serviceMode === 'onetime' ? 4 : 5
  // Only show steps up to Extras in the indicator (Estimate is a reveal, not a step)
  const STEP_LABELS =
    serviceMode === 'onetime'
      ? ['Property', 'Size', 'Extras']
      : ['Property', 'Size', 'Frequency', 'Extras']
  const visibleSteps = STEP_LABELS.length

  const isResidential = propertyType !== 'office'

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

  // Map logical step to content step based on mode
  function getContentStep() {
    if (serviceMode === 'onetime') {
      // Steps: 1=Property, 2=Size, 3=Extras, 4=Estimate
      if (step === 1) return 'property'
      if (step === 2) return 'size'
      if (step === 3) return 'extras'
      return 'estimate'
    }
    // Steps: 1=Property, 2=Size, 3=Frequency, 4=Extras, 5=Estimate
    if (step === 1) return 'property'
    if (step === 2) return 'size'
    if (step === 3) return 'frequency'
    if (step === 4) return 'extras'
    return 'estimate'
  }

  const contentStep = getContentStep()

  return (
    <section id="quote" className="relative bg-cream py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-forest">
            Instant Estimate
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Your quote in 60 seconds
          </h2>
        </div>

        {/* Service mode toggle */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex rounded-full border border-charcoal/[0.08] bg-white p-1">
            <button
              onClick={() => {
                setServiceMode('onetime')
                setStep(1)
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                serviceMode === 'onetime'
                  ? 'bg-forest text-white shadow-md shadow-forest/20'
                  : 'text-charcoal/50 hover:text-charcoal/70'
              }`}
            >
              One-Time Deep Clean
            </button>
            <button
              onClick={() => {
                setServiceMode('recurring')
                setStep(1)
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                serviceMode === 'recurring'
                  ? 'bg-forest text-white shadow-md shadow-forest/20'
                  : 'text-charcoal/50 hover:text-charcoal/70'
              }`}
            >
              Regular Plan
              <span className="ml-1.5 text-[10px] font-bold opacity-70">
                Save up to 40%
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-charcoal/[0.06] bg-white p-6 shadow-xl shadow-charcoal/[0.04] sm:p-10">
          {/* Sticky price ticker — hidden on estimate */}
          <div className={`mb-6 flex items-center justify-between rounded-2xl bg-sage/30 px-5 py-3 ${contentStep === 'estimate' ? 'hidden' : ''}`}>
            <span className="text-sm font-medium text-charcoal/60">
              Estimated total
            </span>
            <span
              key={serviceMode === 'onetime' ? firstCleanDollars : priceDollars}
              className="font-display text-2xl font-bold text-forest-deep transition-all duration-300"
            >
              ${serviceMode === 'onetime' ? firstCleanDollars : priceDollars}
              {serviceMode === 'recurring' && (
                <span className="text-sm font-medium text-charcoal/40">
                  /visit
                </span>
              )}
            </span>
          </div>

          {/* Step indicators — hidden on estimate */}
          <div className={`mb-10 flex items-center justify-center ${contentStep === 'estimate' ? 'hidden' : ''}`}>
            {STEP_LABELS.map((label, i) => {
              const s = i + 1
              return (
                <button
                  key={`${serviceMode}-${s}`}
                  onClick={() => setStep(s)}
                  className="flex items-center"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        s === step
                          ? 'scale-110 bg-forest text-white shadow-md shadow-forest/25'
                          : s < step
                            ? 'bg-sage text-forest'
                            : 'bg-charcoal/[0.05] text-charcoal/30'
                      }`}
                    >
                      {s < step ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        s
                      )}
                    </div>
                    <span
                      className={`hidden text-[11px] font-medium sm:block ${
                        s === step
                          ? 'text-forest'
                          : s < step
                            ? 'text-forest/50'
                            : 'text-charcoal/25'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {s < visibleSteps && (
                    <div
                      className={`mx-3 h-px w-10 sm:w-14 ${
                        s < step ? 'bg-forest/25' : 'bg-charcoal/[0.08]'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Step: Property Type */}
          {contentStep === 'property' && (
            <div>
              <h3 className="mb-1 text-lg font-bold text-charcoal">
                What type of property?
              </h3>
              <p className="mb-6 text-sm text-charcoal/40">
                Select your property type to get started
              </p>
              <div className="grid grid-cols-2 gap-4">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => setPropertyType(pt.value)}
                    className={`group relative rounded-2xl border-2 px-5 py-6 text-center transition-all duration-200 active:scale-[0.97] ${
                      propertyType === pt.value
                        ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                        : 'border-charcoal/[0.06] hover:border-charcoal/15 hover:bg-charcoal/[0.02]'
                    }`}
                  >
                    {pt.value === 'home' && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-light px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
                        Most popular
                      </span>
                    )}
                    <span className="block text-3xl">{pt.icon}</span>
                    <span
                      className={`mt-2 block text-sm font-semibold ${
                        propertyType === pt.value
                          ? 'text-forest-deep'
                          : 'text-charcoal/70'
                      }`}
                    >
                      {pt.label}
                    </span>
                    <span className="mt-1 block text-[11px] text-charcoal/35">
                      {pt.sub}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-8 w-full rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-lg"
              >
                Continue
              </button>
              <p className="mt-3 text-center text-xs text-charcoal/30">
                23 homes booked this week in Massachusetts
              </p>
            </div>
          )}

          {/* Step: Floors / Size */}
          {contentStep === 'size' && (
            <div>
              <h3 className="mb-1 text-lg font-bold text-charcoal">
                {isResidential ? 'How many floors?' : 'Select your space'}
              </h3>
              <p className="mb-6 text-sm text-charcoal/40">
                {isResidential
                  ? 'This helps us estimate the cleaning time'
                  : 'Office pricing is based on frequency'}
              </p>
              {isResidential && (
                <div className="grid grid-cols-3 gap-3">
                  {FLOOR_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFloors(f.value)}
                      className={`rounded-2xl border-2 px-4 py-5 text-center transition-all duration-200 active:scale-[0.97] ${
                        floors === f.value
                          ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                          : 'border-charcoal/[0.06] hover:border-charcoal/15 hover:bg-charcoal/[0.02]'
                      }`}
                    >
                      <span
                        className={`block text-2xl font-bold ${
                          floors === f.value ? 'text-forest' : 'text-charcoal/30'
                        }`}
                      >
                        {f.value}
                      </span>
                      <span
                        className={`mt-1 block text-xs font-medium ${
                          floors === f.value
                            ? 'text-forest-deep'
                            : 'text-charcoal/50'
                        }`}
                      >
                        {f.value === 1 ? 'Floor' : 'Floors'}
                      </span>
                      <span className="mt-1 block text-[10px] text-charcoal/30">
                        {f.size}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-charcoal/10 px-6 py-3.5 text-base font-semibold text-charcoal/60 transition-all active:scale-[0.97] hover:border-charcoal/20 hover:bg-charcoal/[0.03]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Frequency (recurring only) */}
          {contentStep === 'frequency' && (
            <div>
              <h3 className="mb-1 text-lg font-bold text-charcoal">
                How often?
              </h3>
              <p className="mb-6 text-sm text-charcoal/40">
                Most clients choose biweekly — upgrade anytime
              </p>
              <div className="space-y-3">
                {FREQUENCY_OPTIONS.map((f) => {
                  const optionPrice =
                    calculatePrice({
                      propertyType,
                      floors,
                      frequency: f.value,
                      addOns,
                    }) / 100
                  return (
                    <button
                      key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                        frequency === f.value
                          ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                          : 'border-charcoal/[0.06] hover:border-charcoal/15 hover:bg-charcoal/[0.02]'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-sm font-semibold ${
                            frequency === f.value
                              ? 'text-forest-deep'
                              : 'text-charcoal/70'
                          }`}
                        >
                          {f.label}
                        </span>
                        <span className="ml-2 text-sm font-bold text-charcoal/50">
                          ${optionPrice}/visit
                        </span>
                      </div>
                      {f.badge && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            frequency === f.value
                              ? 'bg-forest/15 text-forest-deep'
                              : 'bg-charcoal/[0.05] text-charcoal/40'
                          }`}
                        >
                          {f.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-full border border-charcoal/10 px-6 py-3.5 text-base font-semibold text-charcoal/60 transition-all active:scale-[0.97] hover:border-charcoal/20 hover:bg-charcoal/[0.03]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Extras */}
          {contentStep === 'extras' && (
            <div>
              <h3 className="mb-1 text-lg font-bold text-charcoal">
                Customize your clean
              </h3>
              <p className="mb-6 text-sm text-charcoal/40">
                Most customers skip these &mdash; or add just one or two
              </p>
              <div className="space-y-3">
                {ADD_ON_OPTIONS.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => toggleAddOn(a.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                      addOns.includes(a.value)
                        ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                        : 'border-charcoal/[0.06] hover:border-charcoal/15 hover:bg-charcoal/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                          addOns.includes(a.value)
                            ? 'border-forest bg-forest'
                            : 'border-charcoal/20'
                        }`}
                      >
                        {addOns.includes(a.value) && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            addOns.includes(a.value)
                              ? 'text-forest-deep'
                              : 'text-charcoal/70'
                          }`}
                        >
                          {a.label}
                        </span>
                        {a.popular && (
                          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        addOns.includes(a.value)
                          ? 'text-forest'
                          : 'text-charcoal/30'
                      }`}
                    >
                      +${a.price}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-full border border-charcoal/10 px-6 py-3.5 text-base font-semibold text-charcoal/60 transition-all active:scale-[0.97] hover:border-charcoal/20 hover:bg-charcoal/[0.03]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-lg"
                >
                  See my estimate
                </button>
              </div>
            </div>
          )}

          {/* Step: Estimate */}
          {contentStep === 'estimate' && (
            <div>
              <h3 className="mb-6 text-lg font-bold text-charcoal">
                Your estimate
              </h3>

              <div className="space-y-4">
                {serviceMode === 'recurring' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-charcoal/80">
                          First clean (deep clean)
                        </p>
                        <p className="text-xs text-charcoal/35">One-time fee</p>
                      </div>
                      <p className="text-lg font-bold text-charcoal">
                        ${firstCleanDollars}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-charcoal/80">
                          Recurring clean
                        </p>
                        <p className="text-xs text-charcoal/35">
                          {frequency === 'weekly'
                            ? 'Per visit, billed weekly'
                            : 'Per visit, every 2 weeks'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-charcoal/30 line-through">
                            ${firstCleanDollars}
                          </span>
                          <span className="text-lg font-bold text-charcoal">
                            ${priceDollars}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-forest">
                          Save {Math.round(((firstCleanDollars - priceDollars) / firstCleanDollars) * 100)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {serviceMode === 'onetime' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-charcoal/80">
                        Deep clean
                      </p>
                      <p className="text-xs text-charcoal/35">One-time service</p>
                    </div>
                    <p className="text-lg font-bold text-charcoal">
                      ${firstCleanDollars}
                    </p>
                  </div>
                )}

                <div className="rounded-xl bg-sage/30 p-4">
                  <div className="flex items-end justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">
                      Total due today
                    </p>
                    <p className="font-display text-3xl font-bold text-forest-deep">
                      ${firstCleanDollars}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="group mt-6 w-full rounded-full bg-forest px-8 py-4 text-base font-bold text-white shadow-lg shadow-forest/25 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-xl hover:shadow-forest/30"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Secure my booking
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </button>
              <button
                onClick={() => setStep(step - 1)}
                className="mt-3 w-full rounded-full border border-charcoal/10 px-6 py-3.5 text-base font-semibold text-charcoal/60 transition-all active:scale-[0.97] hover:border-charcoal/20 hover:bg-charcoal/[0.03]"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
