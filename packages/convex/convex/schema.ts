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
