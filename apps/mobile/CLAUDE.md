# SpotlyClean — CLAUDE.md (apps/mobile)

## Overview

Expo SDK 51 app (React Native). Full-service client hub for iOS and Android.
Shares backend (Convex), auth (Clerk), payments (Stripe), and AI chat (Claude API)
with the web app via shared packages.

---

## App Structure

```
apps/mobile/
├── app/                       Expo Router file-based routing
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                Main app — bottom tab navigator
│   │   ├── _layout.tsx        Tab bar config
│   │   ├── index.tsx          Home tab
│   │   ├── book.tsx           Booking tab
│   │   ├── track.tsx          Live tracking tab
│   │   └── profile.tsx        Profile + loyalty tab
│   ├── booking/               Full booking flow (modal stack)
│   │   ├── step-property.tsx
│   │   ├── step-frequency.tsx
│   │   ├── step-addons.tsx
│   │   ├── step-schedule.tsx
│   │   └── step-payment.tsx
│   ├── chat.tsx               AI support chat (full screen)
│   ├── booking/[id].tsx       Booking detail screen
│   └── _layout.tsx            Root layout — ClerkProvider, ConvexProvider
├── components/
│   ├── home/
│   │   ├── UpcomingBookingCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── LoyaltyBanner.tsx
│   ├── booking/
│   │   ├── QuoteDisplay.tsx
│   │   ├── CalendarPicker.tsx
│   │   └── TimeSlotPicker.tsx
│   ├── tracking/
│   │   ├── CleanerMap.tsx
│   │   └── StatusTimeline.tsx
│   ├── chat/
│   │   └── ChatBubble.tsx
│   └── shared/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useBookings.ts         Convex query wrapper
│   ├── useProfile.ts          User profile query
│   └── usePushNotifications.ts
├── lib/
│   ├── stripe.ts              Stripe React Native setup
│   └── notifications.ts       Expo Notifications helpers
└── constants/
    └── theme.ts               Colors, spacing, typography
```

---

## Navigation Structure

```
Root Stack
├── (auth) — shown when not signed in
│   ├── sign-in
│   └── sign-up
└── (app) — shown when signed in
    ├── (tabs) — bottom tabs
    │   ├── Home
    │   ├── Book
    │   ├── Track
    │   └── Profile
    ├── booking/* — modal stack (full-screen booking flow)
    ├── chat — full screen AI chat
    └── booking/[id] — booking detail
```

---

## Theme / Design System

Brand colors (import from `constants/theme.ts`):

```typescript
export const colors = {
  primary: '#0ea5e9',        // SpotlyClean blue — all CTAs, active states
  primaryLight: '#e0f2fe',   // light blue backgrounds
  primaryDark: '#0369a1',    // pressed states
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
}

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
}

export const radius = {
  sm: 8, md: 12, lg: 16, full: 9999,
}
```

Never hardcode colors or spacing values in components — always use theme tokens.

---

## Clerk Auth (Expo)

```typescript
// app/_layout.tsx
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'

const tokenCache = {
  async getToken(key: string) { return SecureStore.getItemAsync(key) },
  async saveToken(key: string, value: string) { return SecureStore.setItemAsync(key, value) },
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Slot />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

---

## Convex in Expo

```typescript
// Use useQuery and useMutation hooks exactly as in web
import { useQuery, useMutation } from 'convex/react'
import { api } from '@spotlyclean/convex'

// In a component:
const bookings = useQuery(api.bookings.getUpcoming, { userId })
const createBooking = useMutation(api.bookings.create)
```

---

## Stripe React Native

```typescript
// lib/stripe.ts
import { initStripe } from '@stripe/stripe-react-native'

// Initialize in app/_layout.tsx on mount
await initStripe({
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  merchantIdentifier: 'merchant.com.spotlyclean', // Apple Pay
})

// Payment flow:
// 1. Call web API to create PaymentIntent → get clientSecret
// 2. Use confirmPayment() from @stripe/stripe-react-native
// 3. On success → call Convex mutation to confirm booking
```

---

## Push Notifications

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications'

// Register for push token on first login
// Store token in Convex on UserProfile

// Notification types to handle:
// - booking_confirmed
// - cleaner_en_route    (with ETA)
// - cleaner_arrived
// - clean_completed
// - payment_processed
// - review_request      (sent 2h after clean_completed)
```

---

## AI Chat Screen

Full screen chat at `app/chat.tsx`.

```typescript
// Chat calls the same /api/chat endpoint as the web
// Pass auth token from Clerk so backend knows who is chatting
// Stream responses using fetch + ReadableStream
// Show typing indicator while streaming
// Context passed to AI: user name, upcoming booking details, loyalty points
```

---

## Live Tracking Screen

`app/(tabs)/track.tsx` — only shows content when there is an active/in-progress booking.

Implementation phases:
- **v1.1 (MVP):** Status timeline (confirmed → en route → arrived → in progress → done)
  + push notifications for each status change. No map yet.
- **v1.2:** Add react-native-maps with cleaner's real-time location.

Cleaner location is updated via Convex real-time subscriptions.

---

## Home Screen

Priority order of what to show:

1. Personalized greeting with first name
2. Upcoming booking card (if exists) — date, cleaner, status badge
3. Active tracking card (if booking is in_progress) — shows live status
4. Quick action grid: Book, Reschedule, Billing, Support
5. Loyalty points banner
6. Last clean summary (date + rating prompt if not yet rated)

---

## Environment Variables (Mobile)

Expo uses `EXPO_PUBLIC_` prefix for client-side vars:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CONVEX_URL=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## App Store Requirements

- **Bundle ID (iOS):** com.spotlyclean.app
- **Package name (Android):** com.spotlyclean.app
- **App name:** SpotlyClean
- **Category:** Lifestyle (iOS) / House & Home (Android)
- Permissions needed: Push Notifications, Location (tracking only, when in use)

---

## Build & Submit

```bash
# Development build (physical device)
eas build --profile development --platform ios

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```
