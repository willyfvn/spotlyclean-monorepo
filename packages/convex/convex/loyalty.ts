import { v, ConvexError } from 'convex/values'
import { query, mutation } from './_generated/server'

const REDEMPTION_THRESHOLD = 500
const REDEMPTION_VALUE_CENTS = 2500 // 500 points = $25

// ─── Queries ───────────────────────────────────────────────

export const getPoints = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    return {
      points: user.loyaltyPoints,
      canRedeem: user.loyaltyPoints >= REDEMPTION_THRESHOLD,
      redeemableCredits: Math.floor(user.loyaltyPoints / REDEMPTION_THRESHOLD),
      creditValueCents: REDEMPTION_VALUE_CENTS,
    }
  },
})

export const getTransactions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    return await ctx.db
      .query('loyalty_transactions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect()
  },
})

// ─── Mutations ─────────────────────────────────────────────

export const addPoints = mutation({
  args: {
    userId: v.id('users'),
    bookingId: v.optional(v.id('bookings')),
    points: v.number(),
    type: v.union(
      v.literal('earned_clean'),
      v.literal('referral_bonus'),
      v.literal('welcome_bonus')
    ),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Internal use — no auth check (called from other mutations/webhooks)
    const user = await ctx.db.get(args.userId)
    if (!user) throw new ConvexError('User not found')

    await ctx.db.insert('loyalty_transactions', {
      userId: args.userId,
      bookingId: args.bookingId,
      points: args.points,
      type: args.type,
      description: args.description,
    })

    await ctx.db.patch(args.userId, {
      loyaltyPoints: user.loyaltyPoints + args.points,
    })
  },
})

export const redeemPoints = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    if (user.loyaltyPoints < REDEMPTION_THRESHOLD) {
      throw new ConvexError(
        `Need at least ${REDEMPTION_THRESHOLD} points to redeem. You have ${user.loyaltyPoints}.`
      )
    }

    await ctx.db.insert('loyalty_transactions', {
      userId: user._id,
      points: -REDEMPTION_THRESHOLD,
      type: 'redeemed',
      description: `Redeemed ${REDEMPTION_THRESHOLD} points for $${REDEMPTION_VALUE_CENTS / 100} credit`,
    })

    await ctx.db.patch(user._id, {
      loyaltyPoints: user.loyaltyPoints - REDEMPTION_THRESHOLD,
    })

    return {
      creditCents: REDEMPTION_VALUE_CENTS,
      remainingPoints: user.loyaltyPoints - REDEMPTION_THRESHOLD,
    }
  },
})
