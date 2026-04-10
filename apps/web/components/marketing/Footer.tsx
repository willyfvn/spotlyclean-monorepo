import Link from 'next/link'

const SERVICE_AREAS = [
  'Boston',
  'Cambridge',
  'Somerville',
  'Brookline',
  'Newton',
  'Watertown',
  'Arlington',
  'Medford',
  'Quincy',
  'Waltham',
]

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Sign In', href: '/sign-in' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-forest-deep">
      {/* Mini CTA strip */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-8">
          <p className="font-display text-lg italic text-white/90 sm:text-xl">
            Get a free quote in 60 seconds
          </p>
          <Link
            href="#quote"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-forest-deep transition-all hover:bg-gold-light active:scale-[0.97]"
          >
            Get quote &rarr;
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-white">
              SpotlyClean
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Professional cleaning services you can trust. Serving
              Massachusetts since 2025.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Quick links
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service areas */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Service areas
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {SERVICE_AREAS.map((area) => (
                <li key={area}>
                  <span className="text-sm text-white/40 transition-colors hover:text-white/70">
                    {area}, MA
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/25">
              and surrounding areas
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Contact us
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+16175550180"
                  className="flex items-center gap-2.5 text-sm text-white/50 transition-colors hover:text-white"
                >
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  (617) 555-0180
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@spotlyclean.com"
                  className="flex items-center gap-2.5 text-sm text-white/50 transition-colors hover:text-white"
                >
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  hello@spotlyclean.com
                </a>
              </li>
              <li className="text-sm text-white/40">Mon&ndash;Sat &middot; 7am&ndash;7pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-white/[0.08] pt-8 text-xs text-white/25 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SpotlyClean. All rights reserved.</p>
          <p>Licensed &amp; insured in Massachusetts</p>
        </div>
      </div>
    </footer>
  )
}
