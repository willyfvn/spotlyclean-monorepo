'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@spotlyclean/convex'
import { calculatePrice, calculateFirstCleanPrice } from '@spotlyclean/utils'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'
import { StepProperty } from './StepProperty'
import { StepFrequency } from './StepFrequency'
import { StepAddOns } from './StepAddOns'
import { StepSchedule } from './StepSchedule'
import { StepPayment } from './StepPayment'
import { StepConfirm } from './StepConfirm'

const STEP_NAMES = ['Property', 'Frequency', 'Add-ons', 'Schedule', 'Payment']

export function BookingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = Number(searchParams.get('step') || '1')
  const [transitionKey, setTransitionKey] = useState(0)

  const [propertyType, setPropertyType] = useState<PropertyType>('home')
  const [floors, setFloors] = useState<1 | 2 | 3>(2)
  const [frequency, setFrequency] = useState<Frequency>('biweekly')
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [scheduledAt, setScheduledAt] = useState<number>(0)
  const [notes, setNotes] = useState('')
  const [entryInstructions, setEntryInstructions] = useState('')

  const createDraft = useMutation(api.bookings.createDraft)

  const priceCents = useMemo(
    () => calculatePrice({ propertyType, floors, frequency, addOns }),
    [propertyType, floors, frequency, addOns]
  )

  const firstCleanCents = useMemo(
    () => calculateFirstCleanPrice({ propertyType, floors, addOns }),
    [propertyType, floors, addOns]
  )

  const weeklyPriceCents = useMemo(
    () => calculatePrice({ propertyType, floors, frequency: 'weekly', addOns }),
    [propertyType, floors, addOns]
  )

  const biweeklyPriceCents = useMemo(
    () => calculatePrice({ propertyType, floors, frequency: 'biweekly', addOns }),
    [propertyType, floors, addOns]
  )

  function goToStep(step: number) {
    setTransitionKey((k) => k + 1)
    router.push(`/book?step=${step}`)
  }

  const isResidential = propertyType !== 'office'
  const durationMinutes = isResidential
    ? floors === 1 ? 120 : floors === 2 ? 180 : 240
    : 120

  const displayStep = Math.min(currentStep, 5)
  const savingsPerVisit = frequency === 'weekly'
    ? (biweeklyPriceCents - weeklyPriceCents) / 100
    : 0

  return (
    <div className="mx-auto max-w-2xl">
      {/* Labeled step bar */}
      {currentStep < 6 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-charcoal/40">
              Step {displayStep} of 5
            </p>
            <p className="font-display text-sm italic text-forest">
              {STEP_NAMES[displayStep - 1]}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {STEP_NAMES.map((name, i) => {
              const s = i + 1
              return (
                <button
                  key={name}
                  onClick={() => s < currentStep && goToStep(s)}
                  disabled={s >= currentStep}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s < currentStep
                      ? 'bg-forest cursor-pointer'
                      : s === currentStep
                        ? 'bg-forest'
                        : 'bg-charcoal/[0.08]'
                  }`}
                  title={name}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Live price panel */}
      {currentStep < 6 && (
        <div className="mb-6 rounded-2xl border border-sage-dark/20 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/50">First clean (deep clean)</span>
            <span className="font-semibold text-forest-deep">
              ${(firstCleanCents / 100).toFixed(0)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-charcoal/50">
              Recurring ({frequency === 'weekly' ? 'weekly' : 'every 2 weeks'})
            </span>
            <span className="font-semibold text-forest-deep">
              ${(priceCents / 100).toFixed(0)}
            </span>
          </div>
          {savingsPerVisit > 0 && (
            <p className="mt-1 text-right text-xs font-medium text-forest">
              You save ${savingsPerVisit}/visit vs biweekly
            </p>
          )}
          <div className="mt-2 rounded-xl bg-sage/40 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal/70">Due today</span>
            <span className="text-xl font-bold text-forest-deep">
              ${(firstCleanCents / 100).toFixed(0)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-charcoal/35">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Secure checkout via Stripe
          </div>
        </div>
      )}

      {/* Step content */}
      <div
        key={transitionKey}
        className="rounded-2xl border border-charcoal/[0.06] bg-white p-6 shadow-md shadow-charcoal/5 sm:p-8 animate-scale-in"
      >
        {currentStep === 1 && (
          <StepProperty
            propertyType={propertyType}
            floors={floors}
            onPropertyTypeChange={setPropertyType}
            onFloorsChange={setFloors}
            onNext={() => goToStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepFrequency
            frequency={frequency}
            onChange={setFrequency}
            weeklyPriceCents={weeklyPriceCents}
            biweeklyPriceCents={biweeklyPriceCents}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}
        {currentStep === 3 && (
          <StepAddOns
            addOns={addOns}
            onChange={setAddOns}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}
        {currentStep === 4 && (
          <StepSchedule
            scheduledAt={scheduledAt}
            notes={notes}
            entryInstructions={entryInstructions}
            onScheduledAtChange={setScheduledAt}
            onNotesChange={setNotes}
            onEntryInstructionsChange={setEntryInstructions}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}
        {currentStep === 5 && (
          <StepPayment
            propertyType={propertyType}
            floors={floors}
            frequency={frequency}
            addOns={addOns}
            scheduledAt={scheduledAt}
            notes={notes}
            entryInstructions={entryInstructions}
            priceCents={priceCents}
            firstCleanCents={firstCleanCents}
            durationMinutes={durationMinutes}
            createDraft={createDraft}
            onBack={() => goToStep(4)}
          />
        )}
        {currentStep === 6 && <StepConfirm />}
      </div>
    </div>
  )
}
