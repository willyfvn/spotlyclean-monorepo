import Link from 'next/link'
import { BASE_PRICES, ADD_ON_PRICES } from '@spotlyclean/utils'

const tiers = [
  {
    name: 'One-Time Deep Clean',
    description: 'Perfect for first-time clients or seasonal refreshes',
    prices: [
      { label: '2-floor home', price: BASE_PRICES.deep_clean[2] },
      { label: '3-floor home', price: BASE_PRICES.deep_clean[3] },
    ],
    frequency: 'one-time',
    highlighted: false,
  },
  {
    name: 'Biweekly',
    description: 'Our most popular plan — keeps your space consistently fresh',
    prices: [
      { label: '2-floor home', price: BASE_PRICES.biweekly[2] },
      { label: '3-floor home', price: BASE_PRICES.biweekly[3] },
    ],
    frequency: 'per visit',
    highlighted: true,
  },
  {
    name: 'Weekly',
    description: 'Best per-visit rate for homes that need regular attention',
    prices: [
      { label: '2-floor home', price: BASE_PRICES.weekly[2] },
      { label: '3-floor home', price: BASE_PRICES.weekly[3] },
    ],
    frequency: 'per visit',
    highlighted: false,
  },
]

const addOns = Object.entries(ADD_ON_PRICES).map(([key, price]) => ({
  label: key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  price,
}))

export function Pricing() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Transparent pricing
          </h2>
          <p className="mt-2 text-slate-600">
            No hidden fees. What you see is what you pay.
          </p>
        </div>

        {/* Residential tiers */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 ${
                tier.highlighted
                  ? 'border-primary bg-white shadow-lg ring-2 ring-primary/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {tier.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{tier.description}</p>

              <div className="mt-5 space-y-2">
                {tier.prices.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-baseline justify-between"
                  >
                    <span className="text-sm text-slate-600">{p.label}</span>
                    <span className="text-xl font-bold text-slate-900">
                      ${p.price}
                      <span className="text-sm font-normal text-slate-400">
                        /{tier.frequency}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="#quote"
                className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Get quote
              </Link>
            </div>
          ))}
        </div>

        {/* Office pricing */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Commercial cleaning
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Offices, restaurants, and commercial spaces
          </p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <span className="text-2xl font-bold text-slate-900">$80</span>
              <span className="text-sm text-slate-400">/daily visit</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">$100</span>
              <span className="text-sm text-slate-400">/weekly visit</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">$120</span>
              <span className="text-sm text-slate-400">/biweekly visit</span>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-10">
          <h3 className="text-center text-lg font-bold text-slate-900">
            Add-ons
          </h3>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {addOns.map((addOn) => (
              <span
                key={addOn.label}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
              >
                {addOn.label}{' '}
                <span className="font-semibold text-primary">
                  +${addOn.price}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
