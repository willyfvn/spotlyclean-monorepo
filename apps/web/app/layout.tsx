import type { Metadata } from 'next'
import { Playfair_Display, Manrope } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/lib/convex'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://spotlyclean.com'),
  title: {
    default: 'SpotlyClean — Professional Cleaning Services in Massachusetts',
    template: '%s | SpotlyClean',
  },
  description:
    'Book professional residential and commercial cleaning in Massachusetts. Instant quotes, background-checked cleaners, and a satisfaction guarantee. Serving Boston, Cambridge, Somerville & beyond.',
  keywords: [
    'house cleaning Massachusetts',
    'cleaning service Boston',
    'professional cleaning Cambridge MA',
    'home cleaning Somerville MA',
    'residential cleaning Newton MA',
    'office cleaning Boston',
    'house cleaning Brookline MA',
    'maid service Massachusetts',
    'deep cleaning Boston area',
    'recurring cleaning service MA',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://spotlyclean.com',
    siteName: 'SpotlyClean',
    title: 'SpotlyClean — Professional Cleaning Services in Massachusetts',
    description:
      'Book professional residential and commercial cleaning in Massachusetts. Instant quotes, background-checked cleaners, satisfaction guaranteed.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SpotlyClean — Professional Cleaning Services in Massachusetts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpotlyClean — Professional Cleaning Services in Massachusetts',
    description:
      'Book professional cleaning in Massachusetts. Instant quotes, trusted cleaners, satisfaction guaranteed.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HouseCleaning'],
  name: 'SpotlyClean',
  url: 'https://spotlyclean.com',
  email: 'support@spotlyclean.com',
  telephone: '+1-617-555-0180',
  priceRange: '$$',
  foundingDate: '2025',
  description:
    'Professional residential and commercial cleaning services in Massachusetts. Serving Boston, Cambridge, Somerville, Brookline, Newton, Watertown, Arlington, Medford, Quincy, and Waltham.',
  areaServed: [
    'Boston', 'Cambridge', 'Somerville', 'Brookline', 'Newton',
    'Watertown', 'Arlington', 'Medford', 'Quincy', 'Waltham',
  ].map((city) => ({
    '@type': 'City',
    name: city,
    containedInPlace: { '@type': 'State', name: 'Massachusetts' },
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airbnb Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Post-Construction Cleaning' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '87',
    bestRating: '5',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
        <body className="font-body antialiased">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
