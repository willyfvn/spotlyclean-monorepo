'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Professional cleaning
            <br />
            <span className="text-primary">you can trust</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Residential and commercial cleaning services across Massachusetts.
            Insured, background-checked cleaners. Book in under 60 seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <a
              href="#quote"
              className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              Get instant quote
            </a>
            <Link
              href="/pricing"
              className="text-base font-semibold text-slate-700 hover:text-primary transition-colors"
            >
              View pricing &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden="true"
      />
    </section>
  )
}
