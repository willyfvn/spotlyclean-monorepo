'use client'

import { useState } from 'react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'Post-Construction': (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743" />
    </svg>
  ),
  'Airbnb': (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M15.75 21H8.25m6.75-18v5.258a4.518 4.518 0 01-1.193 2.964L12 12m0 0l-1.807-1.233A4.518 4.518 0 019 7.803V3.545m3 8.455v5.25M4.5 21h15" />
    </svg>
  ),
  'Restaurant': (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
    </svg>
  ),
}

const SERVICES = [
  { name: 'Post-Construction', description: 'Deep cleaning after renovations or new builds' },
  { name: 'Airbnb', description: 'Turnover cleaning between guests' },
  { name: 'Restaurant', description: 'Commercial kitchen and dining area cleaning' },
]

const SERVICE_OPTIONS = [
  'Post-Construction Cleaning',
  'Airbnb Turnover',
  'Restaurant Cleaning',
  'Office Cleaning',
  'Other',
]

export function CallForQuote() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  function handleChat() {
    window.dispatchEvent(new Event('open-chat'))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: Wire up to backend API
    setFormSubmitted(true)
  }

  return (
    <section className="relative overflow-hidden bg-forest-deep py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left panel */}
          <div>
            <ScrollReveal animation="blur-in">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage">
                  Custom services
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Need a specialized cleaning?
                </h2>
                <p className="mt-4 text-white/60">
                  These services require custom pricing. Get a free estimate
                  within 1 hour &mdash; no commitment, no sales pressure.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {SERVICES.map((service, i) => (
                <ScrollReveal key={service.name} animation="slide-up" delay={i * 150}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 lg:flex lg:items-center lg:gap-4 lg:text-left">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sage lg:mx-0">
                      {SERVICE_ICONS[service.name]}
                    </div>
                    <div>
                      <h3 className="mt-2 text-base font-bold text-white lg:mt-0">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/50">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Urgency + CTAs */}
            <ScrollReveal animation="scale-in" delay={600}>
              <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-light opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-forest-light" />
                </span>
                We typically respond within 1 hour
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleChat}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-forest-deep shadow-lg transition-all active:scale-[0.97] hover:bg-sage hover:shadow-xl"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  Chat with us
                </button>
                <a
                  href="tel:+16175550180"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  (617) 555-0180
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right panel — lead capture form */}
          <ScrollReveal animation="slide-up" delay={300}>
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8 lg:mt-0">
              {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-display text-xl font-bold text-white">
                    Get your free estimate
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    We&apos;ll respond within 1 hour
                  </p>

                  <div className="mt-6 space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                    />
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                    >
                      <option value="" disabled className="text-charcoal">
                        Select service type
                      </option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-charcoal">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-full bg-gold px-8 py-4 text-base font-bold text-forest-deep shadow-lg transition-all active:scale-[0.97] hover:bg-gold-light hover:shadow-xl"
                  >
                    Request Free Quote
                  </button>
                  <p className="mt-3 text-center text-xs text-white/25">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/30">
                    <svg className="h-7 w-7 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    Thanks! We&apos;ll be in touch.
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    Expect a response within 1 hour during business hours.
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-forest-light/10 blur-[100px]" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[100px]" aria-hidden="true" />
    </section>
  )
}
