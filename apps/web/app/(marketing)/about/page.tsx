import { Footer } from '@/components/marketing/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About SpotlyClean — Massachusetts Cleaning Company',
  description:
    'Meet the SpotlyClean team. Founded in 2025, we provide professional, insured, and eco-friendly cleaning services across Boston, Cambridge, Somerville, and the greater Massachusetts area.',
  openGraph: {
    title: 'About SpotlyClean | Trusted Cleaning Company in Massachusetts',
    description:
      'Professional, insured, and background-checked cleaning services in Massachusetts since 2025.',
    url: 'https://spotlyclean.com/about',
    type: 'website',
  },
}

const SERVICE_AREAS = [
  'Boston', 'Cambridge', 'Somerville', 'Brookline', 'Newton',
  'Watertown', 'Arlington', 'Medford', 'Quincy', 'Waltham',
]

const VALUES = [
  {
    title: 'Reliability',
    description: 'We show up on time, every time. If something comes up, we communicate proactively.',
  },
  {
    title: 'Quality',
    description: 'Our cleaning standards are non-negotiable. Every clean is thorough, every detail matters.',
  },
  {
    title: 'Trust',
    description: 'All team members are insured, bonded, and background-checked. Your home is safe with us.',
  },
  {
    title: 'Transparency',
    description: 'No hidden fees, no surprise charges. What you see in your quote is what you pay.',
  },
]

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About SpotlyClean',
  url: 'https://spotlyclean.com/about',
  description:
    'SpotlyClean is a professional cleaning service founded in 2025, serving the greater Boston, Massachusetts area.',
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'SpotlyClean',
    foundingDate: '2025',
    url: 'https://spotlyclean.com',
    email: 'support@spotlyclean.com',
  },
}

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-sage/30 to-cream py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">
            About SpotlyClean
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal/60">
            We&apos;re a team of dedicated cleaning professionals on a mission to
            give Massachusetts residents and businesses spotless spaces they love
            coming back to.
          </p>
        </div>
      </section>

      {/* Story */}
      <article className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-charcoal">Our Story</h2>
          <div className="mt-6 space-y-4 text-charcoal/60 leading-relaxed">
            <p>
              SpotlyClean was founded in 2025 with a simple idea: professional
              cleaning should be easy to book, fairly priced, and consistently
              excellent.
            </p>
            <p>
              We noticed that finding a reliable cleaning service in the Boston
              area was harder than it should be. Between inconsistent quality,
              opaque pricing, and clunky booking processes, we knew there was a
              better way.
            </p>
            <p>
              Today, we serve over 100 happy clients across the greater Boston
              area with residential, commercial, Airbnb, and post-construction
              cleaning services. Every member of our team is fully insured,
              bonded, and background-checked.
            </p>
          </div>
        </div>
      </article>

      {/* Values */}
      <section aria-label="Our company values" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-charcoal">
            Our Values
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-charcoal/[0.06] bg-cream/80 p-6"
              >
                <h3 className="font-display font-semibold text-charcoal">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Your peace of mind is our priority
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {['Fully Insured', 'Bonded', 'Background Checked', 'Eco-Friendly Products'].map(
              (badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-full bg-sage px-5 py-2.5"
                >
                  <svg
                    className="h-5 w-5 text-forest"
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
                  <span className="text-sm font-medium text-forest-deep">
                    {badge}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section aria-label="Service areas" className="bg-sage/20 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-charcoal">
            Service Areas
          </h2>
          <p className="mt-2 text-center text-charcoal/60">
            We provide house cleaning, Airbnb cleaning, and commercial cleaning
            across Boston, Cambridge, Somerville, Brookline, Newton, Watertown,
            Arlington, Medford, Quincy, and Waltham, Massachusetts.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <li key={area}>
                <span className="inline-block rounded-full border border-charcoal/[0.06] bg-white px-4 py-2 text-sm font-medium text-charcoal">
                  {area}, MA
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-deep py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white">
            Ready for a spotless space?
          </h2>
          <p className="mt-2 text-sage">
            Join 100+ happy clients in Massachusetts.
          </p>
          <Link
            href="/#quote"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-forest-deep transition-all hover:bg-sage/20 active:scale-[0.97]"
          >
            Get Your Quote
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
