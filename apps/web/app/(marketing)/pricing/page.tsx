import { Footer } from '@/components/marketing/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cleaning Service Pricing in Massachusetts',
  description:
    'Simple, transparent pricing for house cleaning in Boston, Cambridge, Somerville, and greater Massachusetts. Deep clean from $200, biweekly from $120, weekly from $100. No hidden fees.',
  openGraph: {
    title: 'Cleaning Service Pricing | SpotlyClean Massachusetts',
    description:
      'Transparent pricing for residential and commercial cleaning. One-time deep clean from $200, weekly from $100, biweekly from $120.',
    url: 'https://spotlyclean.com/pricing',
    type: 'website',
  },
}

const FAQ_DATA = [
  {
    q: "What's included in a standard clean?",
    a: 'All rooms are dusted, vacuumed, and mopped. Kitchens and bathrooms get a thorough scrub including countertops, sinks, toilets, and tubs. We also take out the trash and make the beds.',
  },
  {
    q: 'Can I cancel or reschedule?',
    a: 'Yes! You can cancel or reschedule any booking up to 48 hours before the scheduled time at no charge. Changes within 48 hours are subject to our cancellation policy.',
  },
  {
    q: 'Are your cleaners insured?',
    a: 'Absolutely. All SpotlyClean team members are fully insured, bonded, and background-checked for your peace of mind.',
  },
  {
    q: 'How does the loyalty program work?',
    a: 'Earn 1 point for every $1 spent. Once you reach 500 points, you can redeem them for a $25 credit on your next booking. Refer a friend and you both get $25!',
  },
  {
    q: 'What areas do you serve?',
    a: 'We currently serve the greater Boston area including Cambridge, Somerville, Brookline, Newton, Watertown, Arlington, Medford, Quincy, and Waltham.',
  },
  {
    q: 'Do I need to provide cleaning supplies?',
    a: 'No! Our team brings all professional-grade, eco-friendly cleaning supplies and equipment.',
  },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'House Cleaning Services in Massachusetts',
  provider: {
    '@type': 'LocalBusiness',
    name: 'SpotlyClean',
    url: 'https://spotlyclean.com',
  },
  areaServed: 'Massachusetts',
  offers: [
    { '@type': 'Offer', name: 'One-Time Deep Clean', price: '200', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Biweekly Cleaning', price: '120', priceCurrency: 'USD', description: 'Per visit, recurring biweekly' },
    { '@type': 'Offer', name: 'Weekly Cleaning', price: '100', priceCurrency: 'USD', description: 'Per visit, best per-visit rate' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function PricingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section aria-label="Pricing overview" className="bg-gradient-to-b from-sage/30 to-cream py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-charcoal/60">
            No hidden fees. No surprise charges. Just honest pricing for quality cleaning.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section aria-label="Cleaning service pricing tiers" className="bg-cream py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div className="rounded-3xl border border-charcoal/[0.06] bg-white p-6">
              <p className="text-sm font-medium text-charcoal/50">One-time deep clean</p>
              <p className="mt-2 font-display text-3xl font-bold text-charcoal">From $200</p>
              <p className="mt-1 text-xs text-charcoal/35">Based on home size</p>
            </div>
            <div className="rounded-3xl border-2 border-forest bg-white p-6 shadow-lg ring-2 ring-forest/20">
              <span className="inline-block rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest mb-2">
                Most popular
              </span>
              <p className="text-sm font-medium text-charcoal/50">Biweekly</p>
              <p className="mt-2 font-display text-3xl font-bold text-charcoal">From $120</p>
              <p className="mt-1 text-xs text-charcoal/35">Per visit</p>
            </div>
            <div className="rounded-3xl border border-charcoal/[0.06] bg-white p-6">
              <p className="text-sm font-medium text-charcoal/50">Weekly</p>
              <p className="mt-2 font-display text-3xl font-bold text-charcoal">From $100</p>
              <p className="mt-1 text-xs text-charcoal/35">Best per-visit rate</p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-charcoal/50">
            Final price depends on property size and add-ons. Use our quote tool for an instant personalized estimate.
          </p>
          <div className="mt-4 text-center">
            <Link
              href="/#quote"
              className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-deep active:scale-[0.97]"
            >
              Get Your Instant Quote
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions" className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-charcoal">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-charcoal/[0.06] bg-white p-5">
                <dt className="font-semibold text-charcoal">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Get started" className="bg-forest-deep py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-2 text-sage">
            Get your instant quote in under 60 seconds.
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
