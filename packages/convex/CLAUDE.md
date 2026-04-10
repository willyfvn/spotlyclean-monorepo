# SpotlyClean — CLAUDE.md (packages/convex)

## Overview

Shared Convex backend used by both the web app and the mobile app.
This is the single source of truth for all data and business logic.
Both `apps/web` and `apps/mobile` import from this package.

---

## Schema

File: `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })),
    preferredCleanerId: v.optional(v.id('cleaners')),
    loyaltyPoints: v.number(),
    referralCode: v.string(),
    referredBy: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  }).index('by_clerk_id', ['clerkId'])
    .index('by_referral_code', ['referralCode']),

  bookings: defineTable({
    userId: v.id('users'),
    cleanerId: v.optional(v.id('cleaners')),
    propertyType: v.union(
      v.literal('home'),
      v.literal('office'),
      v.literal('airbnb'),
      v.literal('post_construction'),
      v.literal('restaurant')
    ),
    floors: v.union(v.literal(1), v.literal(2), v.literal(3)),
    frequency: v.union(v.literal('once'), v.literal('weekly'), v.literal('biweekly')),
    addOns: v.array(v.union(
      v.literal('fridge'),
      v.literal('stove'),
      v.literal('inside_windows'),
      v.literal('dishes'),
      v.literal('pet_surcharge')
    )),
    scheduledAt: v.number(),              // Unix timestamp
    durationMinutes: v.number(),          // estimated duration
    status: v.union(
      v.literal('draft'),
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('en_route'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    totalPriceCents: v.number(),          // always store in cents
    stripePaymentIntentId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    notes: v.optional(v.string()),
    entryInstructions: v.optional(v.string()),
    rating: v.optional(v.number()),       // 1-5, set after completion
    reviewText: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
  }).index('by_user', ['userId'])
    .index('by_cleaner', ['cleanerId'])
    .index('by_status', ['status'])
    .index('by_scheduled_at', ['scheduledAt']),

  cleaners: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    rating: v.number(),
    totalCleans: v.number(),
    isActive: v.boolean(),
    currentLocationLat: v.optional(v.number()),
    currentLocationLng: v.optional(v.number()),
    lastLocationUpdate: v.optional(v.number()),
  }),

  loyalty_transactions: defineTable({
    userId: v.id('users'),
    bookingId: v.optional(v.id('bookings')),
    points: v.number(),                   // positive = earned, negative = redeemed
    type: v.union(
      v.literal('earned_clean'),
      v.literal('redeemed'),
      v.literal('referral_bonus'),
      v.literal('welcome_bonus')
    ),
    description: v.string(),
  }).index('by_user', ['userId']),

  referrals: defineTable({
    referrerId: v.id('users'),
    referredUserId: v.id('users'),
    status: v.union(v.literal('pending'), v.literal('credited')),
    creditedAt: v.optional(v.number()),
  }).index('by_referrer', ['referrerId']),

})
```

---

## Functions to Implement

### bookings.ts
```typescript
// Queries
export const getUpcoming = query(...)        // upcoming bookings for user
export const getHistory = query(...)         // past bookings for user
export const getById = query(...)            // single booking detail
export const getActive = query(...)          // currently in-progress booking

// Mutations
export const createDraft = mutation(...)     // create draft before payment
export const confirm = mutation(...)         // called by Stripe webhook
export const cancel = mutation(...)          // with 48h check
export const updateStatus = mutation(...)    // en_route → in_progress → completed
export const addRating = mutation(...)       // post-clean review
export const reschedule = mutation(...)      // change date/time
```

### users.ts
```typescript
export const getProfile = query(...)
export const createProfile = mutation(...)   // called after Clerk sign-up
export const updateProfile = mutation(...)
export const updatePushToken = mutation(...)
export const getByClerkId = query(...)
```

### loyalty.ts
```typescript
export const getPoints = query(...)
export const getTransactions = query(...)
export const addPoints = mutation(...)       // internal, called after clean
export const redeemPoints = mutation(...)
```

### cleaners.ts
```typescript
export const getAll = query(...)
export const getById = query(...)
export const updateLocation = mutation(...)  // called from cleaner app (future)
export const assignToBooking = mutation(...) // internal use
```

---

## Business Logic Rules (Enforce in Mutations)

```typescript
// Cancellation: must be 48h before scheduled time
if (booking.scheduledAt - Date.now() < 48 * 60 * 60 * 1000) {
  throw new ConvexError('Cancellations require 48 hours notice')
}

// Loyalty: earn 1 point per $1 spent (after clean completes)
const pointsEarned = Math.floor(booking.totalPriceCents / 100)

// Referral: credit both parties after referred user's first completed clean
// Check: referredUser has exactly 1 completed booking

// Prices always in cents in DB
// Never trust client-sent price — always recalculate server-side
```

---

## Convex + Clerk Auth Pattern

```typescript
import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

// Always verify the authenticated user
export const getUpcoming = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) throw new ConvexError('User not found')

    return await ctx.db
      .query('bookings')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .filter(q => q.gt(q.field('scheduledAt'), Date.now()))
      .order('asc')
      .collect()
  }
})
```

---

## Real-time Subscriptions

Convex queries are automatically reactive — components re-render when data changes.
This powers:
- Live booking status updates
- Real-time cleaner location tracking
- Instant loyalty point updates

No extra setup needed — `useQuery` in web and mobile auto-subscribes.

---

## Importing in Apps

```typescript
// In apps/web or apps/mobile:
import { api } from '@spotlyclean/convex'

// Usage:
const bookings = useQuery(api.bookings.getUpcoming)
const confirm = useMutation(api.bookings.confirm)
```

---

## HTTP Actions (for Webhooks)

```typescript
// convex/http.ts
import { httpRouter } from 'convex/server'
import { handleStripeWebhook } from './webhooks/stripe'
import { handleClerkWebhook } from './webhooks/clerk'

const http = httpRouter()
http.route({ path: '/stripe', method: 'POST', handler: handleStripeWebhook })
http.route({ path: '/clerk', method: 'POST', handler: handleClerkWebhook })

export default http
```
