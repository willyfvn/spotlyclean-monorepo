'use client'

import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

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
  {
    label: 'Happy clients',
    end: TRUST_SIGNALS.clientCount,
    suffix: '+',
    decimals: 0,
  },
  {
    label: 'Five-star reviews',
    end: TRUST_SIGNALS.reviewCount,
    suffix: '',
    decimals: 0,
  },
  {
    label: 'Average rating',
    end: TRUST_SIGNALS.averageRating,
    suffix: '/5',
    decimals: 1,
  },
  {
    label: 'Years serving MA',
    end: TRUST_SIGNALS.yearsInBusiness,
    suffix: '+',
    decimals: 0,
  },
]

const badges = [
  {
    label: 'Fully Insured',
    sub: 'Complete liability coverage',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Bonded',
    sub: 'Protected against damages',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Background Checked',
    sub: 'Every team member vetted',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: '100% Satisfaction',
    sub: 'Or we re-clean for free',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
]


export function TrustSignals() {
  return (
    <section className="bg-cream py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Google review badge */}
        <ScrollReveal animation="fade-in">
          <div className="mb-10 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-charcoal/60">
              4.9 on Google
            </span>
            <span className="text-sm text-charcoal/35">&middot;</span>
            <span className="text-sm text-forest hover:text-forest-deep">
              See all reviews
            </span>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} animation="scale-in" delay={i * 150}>
              <div>
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  duration={2200}
                  className="font-display text-4xl font-bold text-forest sm:text-5xl"
                />
                <p className="mt-2 text-sm font-medium text-charcoal/40">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Divider */}
        <ScrollReveal animation="fade-in" delay={500}>
          <div className="mx-auto mt-8 h-px w-24 bg-charcoal/10" />
        </ScrollReveal>

        {/* Trust badges — single column list */}
        <div className="mx-auto mt-8 max-w-md">
          {badges.map((badge, i) => (
            <ScrollReveal key={badge.label} animation="slide-up" delay={600 + i * 80}>
              <div className={`flex items-center gap-4 py-3.5 ${
                i < badges.length - 1 ? 'border-b border-charcoal/[0.06]' : ''
              }`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest/[0.07] text-forest">
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-charcoal">{badge.label}</p>
                  <p className="text-sm text-charcoal/35">{badge.sub}</p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-forest/40" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
