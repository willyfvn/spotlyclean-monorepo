'use client'

import type { AddOn } from '@spotlyclean/types'

const KITCHEN_ADDONS: { value: AddOn; label: string; price: number; desc: string; popular?: boolean }[] = [
  { value: 'fridge', label: 'Inside fridge', price: 25, desc: 'Deodorized & fully wiped down', popular: true },
  { value: 'stove', label: 'Inside stove/oven', price: 20, desc: 'Grease & grime removed', popular: true },
  { value: 'dishes', label: 'Dishes', price: 20, desc: 'Washed, dried & put away' },
]

const HOME_ADDONS: { value: AddOn; label: string; price: number; desc: string }[] = [
  { value: 'inside_windows', label: 'Inside windows', price: 20, desc: 'Streak-free interior glass' },
]

interface Props {
  addOns: AddOn[]
  onChange: (v: AddOn[]) => void
  onBack: () => void
  onNext: () => void
}

function AddonButton({
  addon,
  selected,
  onToggle,
}: {
  addon: { value: AddOn; label: string; price: number; desc: string; popular?: boolean }
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.98] ${
        selected
          ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
          : 'border-charcoal/[0.08] hover:border-forest/30 hover:bg-sage/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
            selected ? 'border-forest bg-forest' : 'border-charcoal/20'
          }`}
        >
          {selected && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${selected ? 'text-forest-deep' : 'text-charcoal/70'}`}>
              {addon.label}
            </span>
            {addon.popular && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                Popular
              </span>
            )}
          </div>
          <p className="text-[11px] text-charcoal/35">{addon.desc}</p>
        </div>
      </div>
      <span className={`text-sm font-bold ${selected ? 'text-forest' : 'text-charcoal/30'}`}>
        +${addon.price}
      </span>
    </button>
  )
}

export function StepAddOns({ addOns, onChange, onBack, onNext }: Props) {
  function toggle(addOn: AddOn) {
    onChange(
      addOns.includes(addOn) ? addOns.filter((a) => a !== addOn) : [...addOns, addOn]
    )
  }

  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-semibold text-charcoal">
        Make it a deeper clean
      </h3>
      <p className="mb-6 text-sm text-charcoal/40">
        All add-ons are performed during your scheduled visit
      </p>

      {/* Kitchen group */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal/30">
        Kitchen deep clean
      </p>
      <div className="space-y-2.5">
        {KITCHEN_ADDONS.map((a) => (
          <AddonButton key={a.value} addon={a} selected={addOns.includes(a.value)} onToggle={() => toggle(a.value)} />
        ))}
      </div>

      {/* Home group */}
      <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-charcoal/30">
        Home extras
      </p>
      <div className="space-y-2.5">
        {HOME_ADDONS.map((a) => (
          <AddonButton key={a.value} addon={a} selected={addOns.includes(a.value)} onToggle={() => toggle(a.value)} />
        ))}
      </div>

      {/* Bundle banner */}
      {addOns.length >= 3 && (
        <div className="mt-4 rounded-xl bg-gold/10 border border-gold/20 p-3 text-center text-xs font-medium text-gold-dark">
          Great choice! You&apos;ve selected {addOns.length} add-ons for our deepest clean.
        </div>
      )}

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

      <button
        onClick={onNext}
        className="mt-2 w-full text-center text-xs text-charcoal/35 hover:text-charcoal/60 transition-colors"
      >
        Skip extras
      </button>
    </div>
  )
}
