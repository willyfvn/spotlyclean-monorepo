'use client'

import type { PropertyType } from '@spotlyclean/types'

const PROPERTY_TYPES: { value: PropertyType; label: string; sub: string }[] = [
  { value: 'home', label: 'Home', sub: 'Apartments, condos & houses' },
  { value: 'office', label: 'Office', sub: 'Workspaces & commercial' },
]

const FLOOR_OPTIONS: { value: 1 | 2 | 3; label: string; duration: string }[] = [
  { value: 1, label: '1 Floor', duration: '~2h' },
  { value: 2, label: '2 Floors', duration: '~3h' },
  { value: 3, label: '3 Floors', duration: '~4h' },
]

const INCLUDED = [
  'All rooms, bathrooms & kitchen',
  'Vacuuming & mopping',
  'Dusting & surface wipe-down',
  'Satisfaction guaranteed',
]

interface Props {
  propertyType: PropertyType
  floors: 1 | 2 | 3
  onPropertyTypeChange: (v: PropertyType) => void
  onFloorsChange: (v: 1 | 2 | 3) => void
  onNext: () => void
}

export function StepProperty({ propertyType, floors, onPropertyTypeChange, onFloorsChange, onNext }: Props) {
  const isResidential = propertyType !== 'office'

  return (
    <div>
      <h3 className="mb-1 font-display text-lg font-semibold text-charcoal">
        Let&apos;s start with your space
      </h3>
      <p className="mb-6 text-sm text-charcoal/40">
        Most clients choose Home &middot; 2 floors
      </p>

      <div className="grid grid-cols-2 gap-4">
        {PROPERTY_TYPES.map((pt) => (
          <button
            key={pt.value}
            onClick={() => onPropertyTypeChange(pt.value)}
            className={`relative rounded-2xl border-2 px-4 py-6 text-center transition-all duration-200 active:scale-[0.97] ${
              propertyType === pt.value
                ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                : 'border-charcoal/[0.08] hover:border-forest/30 hover:bg-sage/20'
            }`}
          >
            {propertyType === pt.value && (
              <div className="absolute right-3 top-3">
                <svg className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <svg
              className={`mx-auto h-10 w-10 ${propertyType === pt.value ? 'text-forest' : 'text-charcoal/30'}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {pt.value === 'home' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              )}
            </svg>
            <span className={`mt-2 block text-sm font-semibold ${propertyType === pt.value ? 'text-forest-deep' : 'text-charcoal/70'}`}>
              {pt.label}
            </span>
            <span className="mt-0.5 block text-[11px] text-charcoal/35">{pt.sub}</span>
          </button>
        ))}
      </div>

      {isResidential && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-charcoal">How many floors?</h3>
          <div className="flex gap-3">
            {FLOOR_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => onFloorsChange(f.value)}
                className={`flex-1 rounded-2xl border-2 px-4 py-4 text-center transition-all duration-200 active:scale-[0.97] ${
                  floors === f.value
                    ? 'border-forest bg-sage/50 shadow-md shadow-forest/10'
                    : 'border-charcoal/[0.08] hover:border-forest/30 hover:bg-sage/20'
                }`}
              >
                <span className={`block text-xl font-bold ${floors === f.value ? 'text-forest' : 'text-charcoal/30'}`}>
                  {f.value}
                </span>
                <span className={`mt-0.5 block text-xs font-medium ${floors === f.value ? 'text-forest-deep' : 'text-charcoal/50'}`}>
                  {f.value === 1 ? 'Floor' : 'Floors'}
                </span>
                <span className="mt-1 block text-[10px] text-charcoal/30">{f.duration}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What's included */}
      <div className="mt-6 rounded-xl bg-sage/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest/60">
          Always included
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-charcoal/50">
              <svg className="h-3 w-3 text-forest" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full rounded-full bg-forest px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-deep active:scale-[0.97]"
      >
        Continue &mdash; {propertyType === 'home' ? 'Home' : 'Office'}
        {isResidential ? `, ${floors} floor${floors > 1 ? 's' : ''}` : ''}
      </button>
    </div>
  )
}
