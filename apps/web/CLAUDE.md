# SpotlyClean — CLAUDE.md (apps/web)

## Overview

Next.js 14 App Router website. Two roles:
1. **Marketing site** — converts visitors into paying clients
2. **Client portal** — authenticated dashboard for managing bookings

Deployed on Vercel. Domain: spotlyclean.com

---

## App Router Structure

```
apps/web/
├── app/
│   ├── (marketing)/           Public pages (no auth required)
│   │   ├── page.tsx           Homepage — hero, quote CTA, trust signals
│   │   ├── pricing/           Pricing breakdown page
│   │   └── about/             About the team
│   ├── (auth)/                Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/           Protected — requires Clerk auth
│   │   ├── layout.tsx         Dashboard shell with sidebar
│   │   ├── dashboard/         Client home — upcoming bookings
│   │   ├── book/              Multi-step booking flow
│   │   ├── bookings/          All bookings history
│   │   ├── billing/           Stripe portal, invoices
│   │   ├── profile/           Account settings
│   │   └── support/           AI chat (Claude API)
│   ├── api/
│   │   ├── stripe/
│   │   │   └── webhook/       Stripe webhook handler (route.ts)
│   │   ├── chat/
│   │   │   └── route.ts       Claude AI chat endpoint (streaming)
│   │   └── resend/
│   │       └── route.ts       Email sending endpoint
│   ├── layout.tsx             Root layout — ClerkProvider, ConvexProvider
│   └── globals.css
├── components/
│   ├── marketing/             Homepage sections
│   │   ├── Hero.tsx
│   │   ├── QuoteEstimator.tsx ← most important component
│   │   ├── TrustSignals.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   └── Pricing.tsx
│   ├── booking/               Multi-step booking flow
│   │   ├── BookingWizard.tsx  orchestrator
│   │   ├── StepProperty.tsx   property type + floors
│   │   ├── StepFrequency.tsx  once / weekly / biweekly
│   │   ├── StepAddOns.tsx     fridge, stove, pets, etc
│   │   ├── StepSchedule.tsx   calendar + time picker
│   │   ├── StepPayment.tsx    Stripe checkout
│   │   └── StepConfirm.tsx    success screen
│   ├── dashboard/
│   │   ├── UpcomingBooking.tsx
│   │   ├── BookingHistory.tsx
│   │   └── LoyaltyCard.tsx
│   ├── chat/
│   │   └── AIChat.tsx         Floating chat widget (Claude API)
│   └── ui/                    Shared primitives (Button, Card, Badge, etc)
├── lib/
│   ├── stripe.ts              Stripe client + helpers
│   ├── resend.ts              Email templates + sender
│   └── convex.ts              Convex client setup
└── public/
    └── images/
```

---

## Routing Strategy

- `/` — public homepage with embedded quote estimator
- `/book` — start booking (redirects to dashboard/book if logged in)
- `/dashboard` — protected, redirects to sign-in if not authed
- All `/dashboard/*` routes are server components that fetch via Convex

---

## Homepage Priority

The homepage is the #1 conversion tool. Build it in this order:

1. **Hero section** — headline, subheadline, primary CTA ("Get instant quote")
2. **Quote Estimator** — interactive, shows live price, ends with "Book now" CTA
3. **Trust signals** — insured badge, Google reviews, client count, team photos
4. **How it works** — 3 steps: estimate → book → relax
5. **Pricing section** — clear breakdown of all service tiers
6. **AI chat widget** — bottom-right floating button, opens Claude chat
7. **Footer** — links, service areas in MA, contact

---

## Quote Estimator Component

This is the heart of the website. Requirements:

- Step 1: property type (home / office)
- Step 2: floors (1 / 2 / 3)
- Step 3: frequency (once / weekly / biweekly)
- Step 4: add-ons (multi-select: fridge, stove, windows, pets)
- Live price updates as user selects options
- Import `calculatePrice` from `@spotlyclean/utils`
- "Book now" CTA at the bottom — if not logged in, redirect to sign-up then back to booking

```tsx
// Price must always come from shared utils — never hardcode
import { calculatePrice } from '@spotlyclean/utils'

const price = calculatePrice({ propertyType, floors, frequency, addOns })
```

---

## Multi-Step Booking Flow

Located at `/dashboard/book`. Uses URL params to track step:
`/dashboard/book?step=1`, `?step=2`, etc.

State is persisted in Convex as a `draft_booking` until payment is confirmed.
On Stripe payment success → webhook fires → booking status set to `confirmed`.

**Never trust client-side price for payment.** Always recalculate on the server
in the Stripe checkout session creation.

---

## AI Chat (Claude API)

Route: `app/api/chat/route.ts`

```typescript
// Streaming chat endpoint
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// System prompt context to inject:
// - Business name, services, pricing
// - Client's upcoming bookings (if authenticated)
// - Cancellation / rescheduling policy
// - Escalation path ("I'll connect you with our team")

// Use streaming response for good UX
```

The floating chat widget (`AIChat.tsx`) sits on every page.
When user is authenticated, pass their upcoming booking context to the system prompt.

---

## Stripe Integration

Two payment modes:

1. **One-time** (first clean, deep clean): `stripe.checkout.sessions.create` with `mode: 'payment'`
2. **Recurring** (weekly/biweekly): `stripe.checkout.sessions.create` with `mode: 'subscription'`

Webhook handler at `/api/stripe/webhook`:
- `checkout.session.completed` → set booking status to `confirmed`, send confirmation email
- `invoice.payment_succeeded` → create next recurring booking in Convex
- `invoice.payment_failed` → notify client via email + in-app

---

## Auth Flow (Clerk)

```typescript
// middleware.ts — protect dashboard routes
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/pricing', '/about', '/sign-in', '/sign-up', '/api/chat'],
})
```

After sign-up → Convex webhook creates UserProfile in database.

---

## Email Templates (Resend)

Send emails for:
- Booking confirmation (with date, cleaner name, price)
- 24h reminder before clean
- 2h reminder before clean
- Post-clean review request
- Payment receipt
- Referral credit applied

Use React Email for templates. Store templates in `lib/emails/`.

---

## SEO Requirements

Every public page needs:
- Unique `<title>` and `<meta name="description">`
- OpenGraph tags
- LocalBusiness schema markup (JSON-LD) on homepage
- Sitemap at `/sitemap.xml`
- Target keywords: "house cleaning [city] MA", "cleaning service Massachusetts"

---

## Performance Requirements

- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Images: use `next/image` with proper sizing always
- Fonts: use `next/font` — never load Google Fonts directly
- Never import heavy libraries client-side without dynamic imports

---

## Trust Signal Data

Hardcode these initially, replace with live data when available:

```typescript
const TRUST_SIGNALS = {
  clientCount: 100,
  reviewCount: 87,
  averageRating: 4.9,
  yearsInBusiness: 1,
  insured: true,
  bonded: true,
  backgroundChecked: true,
}
```
