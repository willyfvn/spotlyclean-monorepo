const TRUST_SIGNALS = {
  clientCount: 100,
  reviewCount: 87,
  averageRating: 4.9,
  yearsInBusiness: 1,
  insured: true,
  bonded: true,
  backgroundChecked: true,
}

const stats = [
  { label: 'Happy clients', value: `${TRUST_SIGNALS.clientCount}+` },
  { label: 'Five-star reviews', value: `${TRUST_SIGNALS.reviewCount}` },
  { label: 'Average rating', value: `${TRUST_SIGNALS.averageRating}/5` },
]

const badges = [
  { label: 'Fully insured', active: TRUST_SIGNALS.insured },
  { label: 'Bonded', active: TRUST_SIGNALS.bonded },
  { label: 'Background checked', active: TRUST_SIGNALS.backgroundChecked },
]

export function TrustSignals() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {badges
            .filter((b) => b.active)
            .map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
              >
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {badge.label}
              </span>
            ))}
        </div>
      </div>
    </section>
  )
}
