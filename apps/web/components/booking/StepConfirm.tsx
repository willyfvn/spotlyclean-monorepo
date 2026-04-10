'use client'

import Link from 'next/link'

const NEXT_STEPS = [
  {
    title: 'Check your email',
    description: 'Booking details and cleaner info sent within minutes.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "We'll confirm 24h before",
    description: 'Your cleaner will confirm the appointment the day before.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: 'Enjoy your clean home',
    description: 'Sit back — your SpotlyClean team handles everything.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
]

export function StepConfirm() {
  return (
    <div className="py-6">
      {/* Success icon */}
      <div className="text-center">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage border-4 border-forest/20">
          <svg
            className="h-8 w-8 text-forest"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {/* Decorative dots */}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold animate-float" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-forest-light animate-float" style={{ animationDelay: '500ms' }} />
        </div>

        <h3 className="mt-5 font-display text-2xl font-bold text-charcoal">
          Your home is in good hands.
        </h3>
        <p className="mt-2 text-sm text-charcoal/50">
          A confirmation email is on its way to your inbox.
        </p>
      </div>

      {/* What happens next */}
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/30 mb-4">
          What happens next
        </p>
        <div className="border-l-2 border-sage-dark ml-3 space-y-5 pl-6">
          {NEXT_STEPS.map((step, i) => (
            <div key={step.title} className="relative animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-sage border-2 border-cream text-forest">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-forest/60">{step.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{step.title}</p>
                  <p className="text-xs text-charcoal/40">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral card */}
      <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/10 p-5">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 text-gold-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <div>
            <p className="text-sm font-bold text-gold-dark">
              Give $25, Get $25
            </p>
            <p className="mt-1 text-xs text-charcoal/50">
              Refer a friend and you&apos;ll both receive $25 off your next clean.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/bookings"
          className="flex items-center justify-center rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-deep active:scale-[0.97]"
        >
          View my booking
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-full border border-charcoal/10 px-6 py-3.5 text-sm font-semibold text-charcoal/60 transition-all hover:bg-charcoal/[0.03] active:scale-[0.97]"
        >
          Go to dashboard
        </Link>
        <Link
          href="/book"
          className="text-center text-xs text-charcoal/35 hover:text-charcoal/60 transition-colors"
        >
          Book another clean
        </Link>
      </div>
    </div>
  )
}
