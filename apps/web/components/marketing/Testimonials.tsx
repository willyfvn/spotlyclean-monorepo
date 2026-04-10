'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Boston, MA',
    text: 'SpotlyClean transformed my apartment. The team was professional, thorough, and my place has never looked better. Booking was effortless.',
    rating: 5,
    service: 'Deep Clean',
    date: 'March 2025',
    verified: true,
  },
  {
    name: 'James K.',
    location: 'Cambridge, MA',
    text: 'We switched our office cleaning to SpotlyClean and the difference is night and day. Reliable, consistent, and great communication.',
    rating: 5,
    service: 'Office Cleaning',
    date: 'February 2025',
    verified: true,
  },
  {
    name: 'Maria L.',
    location: 'Somerville, MA',
    text: 'As an Airbnb host, turnaround cleaning is critical. SpotlyClean nails it every time \u2014 my guests always comment on how spotless the place is.',
    rating: 5,
    service: 'Airbnb Turnover',
    date: 'January 2025',
    verified: true,
  },
  {
    name: 'David R.',
    location: 'Brookline, MA',
    text: 'I was nervous trying a new cleaning service but SpotlyClean won me over immediately. Thorough, on time, and they even reorganized my pantry without being asked.',
    rating: 5,
    service: 'Deep Clean',
    date: 'March 2025',
    verified: true,
  },
  {
    name: 'Priya N.',
    location: 'Newton, MA',
    text: 'The loyalty points program is a nice bonus but honestly the consistent quality is what keeps me coming back. My house is immaculate every single visit.',
    rating: 5,
    service: 'Weekly Cleaning',
    date: 'February 2025',
    verified: true,
  },
  {
    name: 'Tom & Lisa B.',
    location: 'Watertown, MA',
    text: 'After our kitchen renovation we were drowning in construction dust. SpotlyClean did a post-construction deep clean in one day \u2014 completely transformed the space.',
    rating: 5,
    service: 'Post-Construction',
    date: 'January 2025',
    verified: true,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-gold"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="group rounded-3xl border border-charcoal/[0.06] bg-white p-6 transition-all duration-300 sm:p-7 hover:-translate-y-1 hover:border-forest/15 hover:shadow-xl hover:shadow-forest/[0.06] active:scale-[0.98]">
      <div className="flex items-center justify-between">
        <Stars count={t.rating} />
        {t.verified && (
          <span className="flex items-center gap-1 text-xs font-medium text-forest">
            <svg
              className="h-3.5 w-3.5"
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
            Verified
          </span>
        )}
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-charcoal/60 sm:mt-5">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 sm:mt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-sm font-bold text-forest">
          {t.name[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-charcoal">{t.name}</p>
          <p className="text-xs text-charcoal/35">{t.location}</p>
          <p className="text-[11px] text-charcoal/25">
            {t.service} &middot; {t.date}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal animation="slide-up">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-forest">
              Testimonials
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              What our clients say
            </h2>
            <p className="mt-4 text-charcoal/50">
              Real reviews from real clients across Massachusetts
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile: horizontal snap-scroll carousel */}
        <div className="mt-10 sm:hidden">
          <ScrollReveal animation="fade-in">
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="w-[85vw] flex-shrink-0 snap-center"
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
              <div className="w-4 flex-shrink-0" />
            </div>
            <div className="mt-4 flex justify-center gap-1.5">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-charcoal/15"
                />
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="mt-14 hidden gap-6 sm:grid sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal
              key={t.name}
              animation={
                i % 3 === 0
                  ? 'slide-right'
                  : i % 3 === 1
                    ? 'scale-in'
                    : 'slide-left'
              }
              delay={(i < 3 ? i : i - 3) * 150 + (i >= 3 ? 300 : 0)}
            >
              <TestimonialCard t={t} />
            </ScrollReveal>
          ))}
        </div>

        {/* Google Reviews link */}
        <ScrollReveal animation="fade-in" delay={600}>
          <div className="mt-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-5 py-2.5 text-sm font-medium text-charcoal/60 transition-colors hover:border-forest/20 hover:text-forest">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              Read all 87 reviews on Google
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
