'use client'

import { useState, useMemo, useEffect } from 'react'
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
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestAddress, setGuestAddress] = useState('')

  // Restore booking state from sessionStorage after Stripe redirect
  const [savedBooking, setSavedBooking] = useState<Record<string, any> | null>(null)
  useEffect(() => {
    if (currentStep === 6) {
      try {
        const saved = sessionStorage.getItem('spotly_booking')
        if (saved) setSavedBooking(JSON.parse(saved))
      } catch {}
    }
  }, [currentStep])

  const createGuestDraft = useMutation(api.bookings.createGuestDraft)

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
      {/* Step bar */}
      {currentStep < 6 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">
                {displayStep}
              </span>
              <span className="text-sm font-semibold text-charcoal">
                {STEP_NAMES[displayStep - 1]}
              </span>
            </div>
            <span className="text-xs text-charcoal/30">
              {displayStep} of 5
            </span>
          </div>
          <div className="flex items-center gap-1">
            {STEP_NAMES.map((name, i) => {
              const s = i + 1
              return (
                <button
                  key={name}
                  onClick={() => s < currentStep && goToStep(s)}
                  disabled={s >= currentStep}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s < currentStep
                      ? 'bg-forest cursor-pointer hover:bg-forest-deep'
                      : s === currentStep
                        ? 'bg-forest'
                        : 'bg-charcoal/[0.06]'
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
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm shadow-charcoal/[0.04] ring-1 ring-charcoal/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-charcoal/40">Due today</p>
              <p className="text-2xl font-bold text-forest-deep tracking-tight">
                ${(firstCleanCents / 100).toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-charcoal/40">Then</p>
              <p className="text-sm font-semibold text-charcoal/70">
                ${(priceCents / 100).toFixed(0)}
                <span className="font-normal text-charcoal/40">/{frequency === 'weekly' ? 'wk' : '2wk'}</span>
              </p>
            </div>
          </div>
          {savingsPerVisit > 0 && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-forest/[0.06] px-2.5 py-1.5">
              <svg className="h-3 w-3 text-forest" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
              </svg>
              <span className="text-xs font-medium text-forest">
                Saving ${savingsPerVisit}/visit with weekly
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step content */}
      <div
        key={transitionKey}
        className="rounded-2xl bg-white p-6 shadow-lg shadow-charcoal/[0.06] ring-1 ring-charcoal/[0.05] sm:p-8 animate-scale-in"
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
            guestName={guestName}
            guestEmail={guestEmail}
            guestPhone={guestPhone}
            guestAddress={guestAddress}
            onGuestNameChange={setGuestName}
            onGuestEmailChange={setGuestEmail}
            onGuestPhoneChange={setGuestPhone}
            onGuestAddressChange={setGuestAddress}
            createGuestDraft={createGuestDraft}
            onBack={() => goToStep(4)}
          />
        )}
        {currentStep === 6 && (
          <StepConfirm
            guestEmail={savedBooking?.guestEmail}
            guestName={savedBooking?.guestName}
            scheduledAt={savedBooking?.scheduledAt}
            propertyType={savedBooking?.propertyType}
            firstCleanCents={savedBooking?.firstCleanCents}
          />
        )}
      </div>
    </div>
  )
}
