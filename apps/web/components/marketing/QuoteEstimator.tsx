'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice, calculateFirstCleanPrice } from '@spotlyclean/utils'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'

const PROPERTY_ICONS: Partial<Record<PropertyType, React.ReactNode>> = {
  home: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  office: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
}

const PROPERTY_TYPES: { value: PropertyType; label: string; sub: string }[] = [
  { value: 'home', label: 'Home', sub: 'Apartments, condos & houses' },
  { value: 'office', label: 'Office', sub: 'Workspaces & commercial' },
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

const ADD_ON_ICONS: Record<AddOn, React.ReactNode> = {
  fridge: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5M3.75 4.5v15.75a.75.75 0 00.75.75h15a.75.75 0 00.75-.75V4.5M3.75 4.5A.75.75 0 014.5 3.75h15a.75.75 0 01.75.75M3.75 12h16.5M7.5 7.5h.008v.008H7.5V7.5zm0 7.5h.008v.008H7.5V15z" />
    </svg>
  ),
  stove: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  inside_windows: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M12 3.75v16.5m-9-8.25h18" />
    </svg>
  ),
  dishes: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
    </svg>
  ),
  pet_surcharge: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H3.75" />
    </svg>
  ),
}

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
    router.push('/book')
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
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                      propertyType === pt.value
                        ? 'bg-forest/15 text-forest'
                        : 'bg-charcoal/[0.05] text-charcoal/40'
                    }`}>
                      {PROPERTY_ICONS[pt.value]}
                    </div>
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
              {/* Personalized header */}
              <h3 className="text-lg font-bold text-charcoal">
                Your personalized {serviceMode === 'recurring' ? 'plan' : 'quote'}
              </h3>
              <p className="mb-5 text-sm text-charcoal/40">
                Based on your {floors}-floor {propertyType}{serviceMode === 'recurring' ? `, cleaned ${frequency === 'weekly' ? 'weekly' : 'every 2 weeks'}` : ''}
              </p>

              {serviceMode === 'recurring' ? (
                <>
                  {/* Recurring: Total due today prominent */}
                  <div className="rounded-2xl bg-sage/30 p-5 text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
                      Due today &mdash; first deep clean
                    </p>
                    <p className="mt-1 font-display text-4xl font-bold text-forest-deep">
                      ${firstCleanDollars}
                    </p>
                    <p className="mt-1.5 text-xs text-charcoal/40">
                      Cancel anytime &mdash; no penalties or fees
                    </p>
                  </div>

                  {/* Recurring price highlight */}
                  <div className="mt-4 rounded-2xl border-2 border-forest/20 bg-forest/[0.04] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-forest-deep">
                          Then ${priceDollars}/{frequency === 'weekly' ? 'week' : '2 weeks'}
                        </p>
                        <p className="mt-0.5 text-xs text-charcoal/45">
                          You save ${firstCleanDollars - priceDollars} every visit vs. one-time pricing
                        </p>
                      </div>
                      <div className="rounded-full bg-forest px-3 py-1">
                        <span className="text-xs font-bold text-white">
                          Save {Math.round(((firstCleanDollars - priceDollars) / firstCleanDollars) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* One-time: Simple total */}
                  <div className="rounded-2xl bg-sage/30 p-5 text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
                      Your deep clean total
                    </p>
                    <p className="mt-1 font-display text-4xl font-bold text-forest-deep">
                      ${firstCleanDollars}
                    </p>
                    <p className="mt-1.5 text-xs text-charcoal/40">
                      One-time service &mdash; no recurring charges
                    </p>
                  </div>

                  {/* Upsell nudge to recurring */}
                  <button
                    onClick={() => {
                      setServiceMode('recurring')
                      setStep(totalSteps)
                    }}
                    className="mt-3 flex w-full items-center justify-between rounded-xl bg-forest/[0.04] px-4 py-3 text-left transition-all hover:bg-forest/[0.07]"
                  >
                    <span className="text-xs text-charcoal/60">
                      Switch to a plan and pay <span className="font-bold text-forest">${priceDollars}/visit</span> instead
                    </span>
                    <span className="text-xs font-semibold text-forest">
                      See plan &rarr;
                    </span>
                  </button>
                </>
              )}

              {/* CTA */}
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
                  Book my first clean
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </button>

              {/* Trust nudges */}
              <p className="mt-3 text-center text-[11px] text-charcoal/35">
                No charges until your first visit. Free rescheduling up to 24h before.
              </p>
              <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-charcoal/40">
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Insured &amp; bonded
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Background-checked
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  4.9 stars
                </span>
              </div>

              <button
                onClick={() => setStep(step - 1)}
                className="mt-4 w-full rounded-full border border-charcoal/10 px-6 py-3 text-sm font-medium text-charcoal/40 transition-all active:scale-[0.97] hover:border-charcoal/20 hover:bg-charcoal/[0.03]"
              >
                Edit estimate
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
