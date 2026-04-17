'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Pricing', href: '#quote' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '/about' },
]

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8 lg:py-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-forest-deep sm:text-2xl"
        >
          SpotlyClean
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sign-in"
            className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest transition-all hover:bg-forest hover:text-white active:scale-[0.97]"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-charcoal/5 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="flex w-5 flex-col items-end gap-[5px]">
            <span
              className={`block h-[2px] rounded-full bg-charcoal transition-all duration-300 ${
                menuOpen ? 'w-5 translate-y-[7px] rotate-45' : 'w-5'
              }`}
            />
            <span
              className={`block h-[2px] rounded-full bg-charcoal transition-all duration-300 ${
                menuOpen ? 'w-0 opacity-0' : 'w-3.5 opacity-100'
              }`}
            />
            <span
              className={`block h-[2px] rounded-full bg-charcoal transition-all duration-300 ${
                menuOpen ? 'w-5 -translate-y-[7px] -rotate-45' : 'w-4'
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-10 bg-charcoal/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed left-0 right-0 top-0 z-10 rounded-b-3xl bg-cream px-6 pt-20 pb-8 shadow-xl shadow-charcoal/10 transition-all duration-500 md:hidden ${
          menuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3.5 text-lg font-semibold text-charcoal transition-colors active:bg-forest/5"
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-charcoal/[0.06] pt-4">
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-forest/20 transition-all active:scale-[0.97]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-[5] mx-auto max-w-7xl px-6 pb-24 pt-8 sm:pb-32 sm:pt-20 lg:px-8 lg:pt-28">
        <div className="max-w-3xl">
          {/* Urgency badge */}
          <div className="animate-slide-up inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold-dark sm:px-4 sm:py-2 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Only 3 slots left this week
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight text-charcoal sm:mt-8 sm:text-7xl lg:text-[5.5rem]">
            <span className="animate-slide-up animate-delay-100 block">
              A cleaner home,
            </span>
            <span className="animate-slide-up animate-delay-200 block italic text-forest">
              a clearer mind.
            </span>
          </h1>

          {/* Price anchor */}
          <p className="animate-slide-up animate-delay-300 mt-3 text-lg font-semibold text-gold-dark sm:text-xl">
            Starting from $120/visit
          </p>

          {/* Subheadline */}
          <p className="animate-slide-up animate-delay-300 mt-4 max-w-xl text-base leading-relaxed text-charcoal/55 sm:text-lg">
            Vetted local cleaners arrive on your schedule. Book in 60 seconds
            &mdash; no phone calls, no haggling, no surprises.
          </p>

          {/* CTAs */}
          <div className="animate-slide-up animate-delay-400 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-col items-start">
              <Link
                href="#quote"
                className="group inline-flex items-center justify-center rounded-full bg-forest px-8 py-4 text-base font-semibold text-white shadow-lg shadow-forest/20 transition-all active:scale-[0.97] sm:px-10 sm:py-5 sm:text-lg hover:bg-forest-deep hover:shadow-xl hover:shadow-forest/30"
              >
                See my price — takes 60 seconds
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Social proof strip */}
          <div className="animate-slide-up animate-delay-500 mt-10 flex flex-wrap items-center gap-4 sm:mt-14 sm:gap-0 sm:divide-x sm:divide-charcoal/10">
            {/* Rating */}
            <div className="flex items-center gap-3 sm:pr-5">
              <div className="flex -space-x-2">
                {['#2d6a4f', '#d4a373', '#52b788', '#a67c52', '#1b4332'].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full ring-2 ring-cream sm:h-9 sm:w-9 sm:ring-[2.5px]"
                      style={{ backgroundColor: color, opacity: 0.85 }}
                    />
                  )
                )}
              </div>
              <div className="text-sm text-charcoal/50">
                <span className="font-bold text-charcoal/70">4.9/5</span> from
                87 reviews
              </div>
            </div>

            {/* Bookings this week */}
            <div className="flex items-center gap-2 sm:px-5">
              <svg
                className="h-4 w-4 text-forest"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <span className="text-sm text-charcoal/50">
                <span className="font-bold text-charcoal/70">23</span> bookings
                this week
              </span>
            </div>

            {/* Insured */}
            <div className="flex items-center gap-2 sm:pl-5">
              <svg
                className="h-4 w-4 text-forest"
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
              <span className="text-sm font-medium text-charcoal/50">
                Fully insured
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative blurs */}
      <div
        className="absolute -right-20 top-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-sage/50 to-transparent blur-[80px] sm:-right-32 sm:h-[600px] sm:w-[600px] sm:blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-gradient-to-tr from-gold/15 to-transparent blur-[60px] sm:-bottom-32 sm:-left-32 sm:h-[500px] sm:w-[500px] sm:blur-[100px]"
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-float sm:block">
        <div className="flex flex-col items-center gap-2 text-charcoal/25">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Scroll
          </span>
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
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
