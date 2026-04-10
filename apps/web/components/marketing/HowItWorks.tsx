'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Get your estimate',
    description: 'Tell us about your space and get an instant price — no waiting.',
  },
  {
    number: '02',
    title: 'Book online',
    description: 'Pick a date, add extras, and pay securely in minutes.',
  },
  {
    number: '03',
    title: 'Sit back & relax',
    description: 'Our vetted, insured cleaners handle everything.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal animation="slide-up">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-forest">
              Simple process
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              How it works
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} animation="slide-up" delay={i * 200}>
              <div className="relative text-center">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+32px)] right-[calc(-50%+32px)] top-5 hidden h-px bg-gradient-to-r from-forest/15 to-transparent sm:block" />
                )}

                {/* Large typographic number */}
                <span className="relative inline-block font-display text-5xl font-bold text-forest/15">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-bold text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/45">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
