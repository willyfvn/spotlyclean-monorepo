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
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-slate-900">SpotlyClean</p>
            <p className="mt-2 text-sm text-slate-500">
              Professional cleaning services you can trust. Serving
              Massachusetts since 2025.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-slate-900">Quick links</p>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service areas */}
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Service areas
            </p>
            <p className="mt-3 text-sm text-slate-500">
              {SERVICE_AREAS.join(' · ')}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              and surrounding areas in MA
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SpotlyClean. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
