'use client'

import { useState, useMemo } from 'react'

interface Props {
  scheduledAt: number
  notes: string
  entryInstructions: string
  onScheduledAtChange: (v: number) => void
  onNotesChange: (v: string) => void
  onEntryInstructionsChange: (v: string) => void
  onBack: () => void
  onNext: () => void
}

const TIME_SLOTS = [
  { label: 'Morning', time: '8–10 AM', hour: 8, badge: 'Most popular' },
  { label: 'Late Morning', time: '10–12 PM', hour: 10 },
  { label: 'Afternoon', time: '12–2 PM', hour: 12 },
  { label: 'Late Afternoon', time: '2–4 PM', hour: 14 },
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function StepSchedule({
  scheduledAt,
  notes,
  entryInstructions,
  onScheduledAtChange,
  onNotesChange,
  onEntryInstructionsChange,
  onBack,
  onNext,
}: Props) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const [calendarMonth, setCalendarMonth] = useState({
    year: tomorrow.getFullYear(),
    month: tomorrow.getMonth(),
  })

  const selectedDate = scheduledAt ? new Date(scheduledAt) : null
  const selectedHour = selectedDate?.getHours() ?? null

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)

    return days
  }, [calendarMonth])

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  function isDatePast(day: number) {
    const date = new Date(calendarMonth.year, calendarMonth.month, day)
    date.setHours(23, 59, 59)
    return date <= today
  }

  function isDateSelected(day: number) {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth.month &&
      selectedDate.getFullYear() === calendarMonth.year
    )
  }

  function handleDayClick(day: number) {
    const date = new Date(calendarMonth.year, calendarMonth.month, day)
    date.setHours(selectedHour ?? 8, 0, 0, 0)
    onScheduledAtChange(date.getTime())
  }

  function handleTimeChange(hour: number) {
    const date = selectedDate ? new Date(selectedDate) : new Date(tomorrow)
    date.setHours(hour, 0, 0, 0)
    onScheduledAtChange(date.getTime())
  }

  function prevMonth() {
    setCalendarMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1)
      if (d < new Date(today.getFullYear(), today.getMonth())) return prev
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function nextMonth() {
    setCalendarMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const canProceed = scheduledAt > 0

  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-semibold text-charcoal">
        Pick a date & time
      </h3>
      {/* Urgency */}
      <div className="mb-5 flex items-center gap-1.5 text-xs text-gold-dark">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        {/* TODO: Replace with real availability API */}
        Spots filling fast &mdash; 2 morning slots left this week
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-charcoal/[0.08] p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="rounded-lg p-1.5 text-charcoal/40 hover:bg-charcoal/[0.05] hover:text-charcoal transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-charcoal">{monthLabel}</span>
          <button onClick={nextMonth} className="rounded-lg p-1.5 text-charcoal/40 hover:bg-charcoal/[0.05] hover:text-charcoal transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((d) => (
            <span key={d} className="text-[11px] font-semibold text-charcoal/30 py-1">
              {d}
            </span>
          ))}
          {calendarDays.map((day, i) =>
            day === null ? (
              <div key={`empty-${i}`} />
            ) : (
              <button
                key={day}
                disabled={isDatePast(day)}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-full text-sm font-medium transition-all ${
                  isDateSelected(day)
                    ? 'bg-forest text-white font-semibold'
                    : isDatePast(day)
                      ? 'text-charcoal/15 cursor-not-allowed'
                      : 'text-charcoal/70 hover:bg-sage'
                }`}
              >
                {day}
              </button>
            )
          )}
        </div>
      </div>

      {/* Time slots */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-charcoal mb-2">Preferred time</label>
        <div className="grid grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.hour}
              onClick={() => handleTimeChange(slot.hour)}
              className={`relative rounded-xl border-2 px-3 py-3 text-left transition-all ${
                selectedHour === slot.hour
                  ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                  : 'border-charcoal/[0.08] hover:border-forest/30 hover:bg-sage/20'
              }`}
            >
              <span className={`block text-sm font-semibold ${selectedHour === slot.hour ? 'text-forest-deep' : 'text-charcoal/70'}`}>
                {slot.label}
              </span>
              <span className="block text-xs text-charcoal/40">{slot.time}</span>
              {slot.badge && (
                <span className="absolute right-2 top-2 rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold text-gold-dark">
                  {slot.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-charcoal mb-2">
          Anything we should know? <span className="text-charcoal/30">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Focus areas, fragile items, pets at home..."
          rows={2}
          className="w-full rounded-xl border border-charcoal/[0.08] px-4 py-3 text-sm placeholder:text-charcoal/30 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>

      {/* Entry */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-charcoal mb-2">
          How will we get in? <span className="text-charcoal/30">(optional)</span>
        </label>
        <textarea
          value={entryInstructions}
          onChange={(e) => onEntryInstructionsChange(e.target.value)}
          placeholder="Door code, lockbox, we'll be home..."
          rows={2}
          className="w-full rounded-xl border border-charcoal/[0.08] px-4 py-3 text-sm placeholder:text-charcoal/30 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>

      {selectedDate && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-sage/40 px-4 py-3">
          <svg className="h-4 w-4 text-forest" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-sm font-medium text-forest-deep">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at{' '}
            {selectedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-charcoal/10 px-6 py-3.5 text-base font-semibold text-charcoal/60 transition-all hover:bg-charcoal/[0.03] active:scale-[0.97]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 rounded-full bg-forest px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-deep disabled:opacity-50 active:scale-[0.97]"
        >
          {canProceed ? 'Continue' : 'Select a date'}
        </button>
      </div>
    </div>
  )
}
