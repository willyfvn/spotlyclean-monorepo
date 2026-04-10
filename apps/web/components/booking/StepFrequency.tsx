'use client'

import type { Frequency } from '@spotlyclean/types'

interface Props {
  frequency: Frequency
  onChange: (v: Frequency) => void
  weeklyPriceCents: number
  biweeklyPriceCents: number
  onBack: () => void
  onNext: () => void
}

export function StepFrequency({
  frequency,
  onChange,
  weeklyPriceCents,
  biweeklyPriceCents,
  onBack,
  onNext,
}: Props) {
  const weeklyPrice = weeklyPriceCents / 100
  const biweeklyPrice = biweeklyPriceCents / 100
  const savingsPerVisit = biweeklyPrice - weeklyPrice

  const options = [
    {
      value: 'biweekly' as Frequency,
      label: 'Every 2 weeks',
      price: biweeklyPrice,
      annual: biweeklyPrice * 26,
      badge: 'Most popular',
      badgeColor: 'bg-gold/15 text-gold-dark border-gold/20',
      social: '73% of our clients choose this',
    },
    {
      value: 'weekly' as Frequency,
      label: 'Weekly',
      price: weeklyPrice,
      annual: weeklyPrice * 52,
      badge: 'Best value',
      badgeColor: 'bg-forest/10 text-forest border-forest/20',
      social: `Save $${savingsPerVisit}/visit vs biweekly`,
    },
  ]

  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-semibold text-charcoal">
        How often?
      </h3>
      <p className="mb-6 text-sm text-charcoal/40">
        Choose your cleaning frequency &mdash; upgrade or cancel anytime
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border-2 p-5 text-left transition-all duration-200 active:scale-[0.97] ${
              frequency === opt.value
                ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                : 'border-charcoal/[0.08] hover:border-forest/30 hover:bg-sage/20'
            }`}
          >
            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${opt.badgeColor}`}>
              {opt.badge}
            </span>
            <p className={`mt-3 text-base font-bold ${frequency === opt.value ? 'text-forest-deep' : 'text-charcoal'}`}>
              {opt.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-charcoal">
              ${opt.price}
              <span className="text-sm font-medium text-charcoal/40">/visit</span>
            </p>
            <p className="mt-1 text-xs text-charcoal/35">
              ~${opt.annual.toLocaleString()}/year
            </p>
            <p className={`mt-3 text-xs font-medium ${frequency === opt.value ? 'text-forest' : 'text-charcoal/40'}`}>
              {opt.social}
            </p>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-charcoal/35">
        Not sure? Most new clients start biweekly and upgrade once they see the difference.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-full border border-charcoal/10 px-4 py-3.5 text-base font-semibold text-charcoal/60 transition-all hover:bg-charcoal/[0.03] active:scale-[0.97]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-full bg-forest px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-deep active:scale-[0.97]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
