'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const guarantees = [
  {
    number: '01',
    title: '100% Satisfaction Guarantee',
    description:
      "Not happy with your clean? We'll return within 24 hours and re-clean at no charge. No questions asked.",
  },
  {
    number: '02',
    title: 'Insured & Background-Checked',
    description:
      'Every cleaner is fully vetted, bonded, and insured. Your home and belongings are completely protected.',
  },
  {
    number: '03',
    title: 'No Contracts, Cancel Anytime',
    description:
      'Weekly, biweekly, or one-time — change your plan or skip a visit whenever you need. Zero commitment.',
  },
  {
    number: '04',
    title: 'Money-Back Promise',
    description:
      "If you're not satisfied even after a re-clean, we'll refund your visit in full. That's how confident we are.",
  },
]

export function Pricing() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <ScrollReveal animation="slide-up">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-forest">
              Zero-risk guarantee
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              If it&rsquo;s not perfect, you don&rsquo;t pay for the redo.
            </h2>
            <p className="mt-4 text-charcoal/50">
              Every SpotlyClean visit comes with hard guarantees &mdash; backed
              by our company, not fine print.
            </p>
          </div>
        </ScrollReveal>

        {/* Certificate panel */}
        <ScrollReveal animation="scale-in" delay={200}>
          <div className="mt-14 overflow-hidden rounded-3xl border-2 border-forest/15 bg-white">
            {/* Certificate header */}
            <div className="flex items-center justify-center gap-3 bg-forest-deep py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
                <svg
                  className="h-5 w-5 text-forest-deep"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <p className="font-display text-lg italic text-white">
                SpotlyClean Guarantee
              </p>
            </div>

            {/* Guarantee rows */}
            {guarantees.map((g, i) => (
              <div
                key={g.title}
                className={`flex items-start gap-5 p-6 sm:p-7 ${
                  i < guarantees.length - 1
                    ? 'border-b border-forest/[0.06]'
                    : ''
                } ${i === 3 ? 'bg-gold-light/30' : ''}`}
              >
                <span className="hidden font-display text-2xl italic text-forest/30 sm:block">
                  {g.number}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-charcoal">{g.title}</h3>
                    <span className="hidden rounded-full bg-sage px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest sm:inline-block">
                      Active
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/50">
                    {g.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-in" delay={500}>
          <p className="mt-14 text-center text-sm text-charcoal/35">
            Join 100+ Massachusetts homes &middot; No contracts &middot; Free to
            get a quote
          </p>
          <div className="mt-6 text-center">
            <Link
              href="#quote"
              className="group inline-flex items-center rounded-full bg-forest px-8 py-4 text-base font-semibold text-white shadow-lg shadow-forest/20 transition-all active:scale-[0.97] hover:bg-forest-deep hover:shadow-xl"
            >
              Start with zero risk
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
