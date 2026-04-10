import { v, ConvexError } from 'convex/values'
import { query, mutation } from './_generated/server'

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000

// ─── Queries ───────────────────────────────────────────────

export const getUpcoming = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    return await ctx.db
      .query('bookings')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) =>
        q.and(
          q.gt(q.field('scheduledAt'), Date.now()),
          q.neq(q.field('status'), 'cancelled'),
          q.neq(q.field('status'), 'completed')
        )
      )
      .order('asc')
      .collect()
  },
})

export const getHistory = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    return await ctx.db
      .query('bookings')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) =>
        q.or(
          q.eq(q.field('status'), 'completed'),
          q.eq(q.field('status'), 'cancelled')
        )
      )
      .order('desc')
      .collect()
  },
})

export const getById = query({
  args: { bookingId: v.id('bookings') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    // Verify the booking belongs to the authenticated user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user || booking.userId !== user._id) {
      throw new ConvexError('Unauthorized')
    }

    return booking
  },
})

export const getActive = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    return await ctx.db
      .query('bookings')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) =>
        q.or(
          q.eq(q.field('status'), 'confirmed'),
          q.eq(q.field('status'), 'en_route'),
          q.eq(q.field('status'), 'in_progress')
        )
      )
      .first()
  },
})

// ─── Mutations ─────────────────────────────────────────────

export const createDraft = mutation({
  args: {
    propertyType: v.union(
      v.literal('home'),
      v.literal('office'),
      v.literal('airbnb'),
      v.literal('post_construction'),
      v.literal('restaurant')
    ),
    floors: v.union(v.literal(1), v.literal(2), v.literal(3)),
    frequency: v.union(v.literal('once'), v.literal('weekly'), v.literal('biweekly')),
    addOns: v.array(
      v.union(
        v.literal('fridge'),
        v.literal('stove'),
        v.literal('inside_windows'),
        v.literal('dishes'),
        v.literal('pet_surcharge')
      )
    ),
    scheduledAt: v.number(),
    durationMinutes: v.number(),
    totalPriceCents: v.number(),
    notes: v.optional(v.string()),
    entryInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    // Never trust client-sent price — recalculate server-side
    // For now we accept the price but this should call calculatePrice() server-side
    // once the utils package is available as a Convex dependency

    const bookingId = await ctx.db.insert('bookings', {
      userId: user._id,
      propertyType: args.propertyType,
      floors: args.floors,
      frequency: args.frequency,
      addOns: args.addOns,
      scheduledAt: args.scheduledAt,
      durationMinutes: args.durationMinutes,
      status: 'draft',
      totalPriceCents: args.totalPriceCents,
      notes: args.notes,
      entryInstructions: args.entryInstructions,
    })

    return bookingId
  },
})

export const confirm = mutation({
  args: {
    bookingId: v.id('bookings'),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    if (booking.status !== 'draft' && booking.status !== 'pending') {
      throw new ConvexError('Booking cannot be confirmed from current status')
    }

    await ctx.db.patch(args.bookingId, {
      status: 'confirmed',
      stripeSessionId: args.stripeSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId,
    })
  },
})

export const cancel = mutation({
  args: {
    bookingId: v.id('bookings'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user || booking.userId !== user._id) {
      throw new ConvexError('Unauthorized')
    }

    // Enforce 48h cancellation policy
    if (booking.scheduledAt - Date.now() < FORTY_EIGHT_HOURS_MS) {
      throw new ConvexError('Cancellations require 48 hours notice')
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new ConvexError('Booking cannot be cancelled from current status')
    }

    await ctx.db.patch(args.bookingId, {
      status: 'cancelled',
      cancelledAt: Date.now(),
      cancellationReason: args.reason,
    })
  },
})

export const updateStatus = mutation({
  args: {
    bookingId: v.id('bookings'),
    status: v.union(
      v.literal('en_route'),
      v.literal('in_progress'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      confirmed: ['en_route'],
      en_route: ['in_progress'],
      in_progress: ['completed'],
    }

    const allowed = validTransitions[booking.status]
    if (!allowed || !allowed.includes(args.status)) {
      throw new ConvexError(
        `Cannot transition from "${booking.status}" to "${args.status}"`
      )
    }

    const patch: Record<string, unknown> = { status: args.status }
    if (args.status === 'completed') {
      patch.completedAt = Date.now()
    }

    await ctx.db.patch(args.bookingId, patch)

    // If completed, award loyalty points
    if (args.status === 'completed') {
      const pointsEarned = Math.floor(booking.totalPriceCents / 100)

      await ctx.db.insert('loyalty_transactions', {
        userId: booking.userId,
        bookingId: args.bookingId,
        points: pointsEarned,
        type: 'earned_clean',
        description: `Earned ${pointsEarned} points for completed clean`,
      })

      // Update user's loyalty points
      const user = await ctx.db.get(booking.userId)
      if (user) {
        await ctx.db.patch(booking.userId, {
          loyaltyPoints: user.loyaltyPoints + pointsEarned,
        })
      }

      // Check if this user was referred and this is their first completed clean
      if (user?.referredBy) {
        const completedBookings = await ctx.db
          .query('bookings')
          .withIndex('by_user', (q) => q.eq('userId', booking.userId))
          .filter((q) => q.eq(q.field('status'), 'completed'))
          .collect()

        // If this is their first completed booking, credit the referral
        if (completedBookings.length === 1) {
          const referrer = await ctx.db
            .query('users')
            .withIndex('by_referral_code', (q) =>
              q.eq('referralCode', user.referredBy!)
            )
            .unique()

          if (referrer) {
            // Find the pending referral
            const referral = await ctx.db
              .query('referrals')
              .withIndex('by_referrer', (q) => q.eq('referrerId', referrer._id))
              .filter((q) =>
                q.and(
                  q.eq(q.field('referredUserId'), booking.userId),
                  q.eq(q.field('status'), 'pending')
                )
              )
              .first()

            if (referral) {
              await ctx.db.patch(referral._id, {
                status: 'credited',
                creditedAt: Date.now(),
              })
            }

            // $25 credit = 2500 cents → but loyalty is 1pt per $1, so 25 points worth $25
            // Actually referral credit is $25 for both parties
            const referralPoints = 2500 // represents $25 credit (stored as cents equivalent)

            // Credit referrer
            await ctx.db.insert('loyalty_transactions', {
              userId: referrer._id,
              points: referralPoints,
              type: 'referral_bonus',
              description: 'Referral bonus: $25 credit',
            })
            await ctx.db.patch(referrer._id, {
              loyaltyPoints: referrer.loyaltyPoints + referralPoints,
            })

            // Credit referred user
            await ctx.db.insert('loyalty_transactions', {
              userId: booking.userId,
              points: referralPoints,
              type: 'referral_bonus',
              description: 'Referral bonus: $25 credit for being referred',
            })
            await ctx.db.patch(booking.userId, {
              loyaltyPoints: (user.loyaltyPoints + pointsEarned) + referralPoints,
            })
          }
        }
      }
    }
  },
})

export const addRating = mutation({
  args: {
    bookingId: v.id('bookings'),
    rating: v.number(),
    reviewText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError('Rating must be between 1 and 5')
    }

    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user || booking.userId !== user._id) {
      throw new ConvexError('Unauthorized')
    }

    if (booking.status !== 'completed') {
      throw new ConvexError('Can only rate completed bookings')
    }

    await ctx.db.patch(args.bookingId, {
      rating: args.rating,
      reviewText: args.reviewText,
    })

    // Update cleaner's average rating if assigned
    if (booking.cleanerId) {
      const cleaner = await ctx.db.get(booking.cleanerId)
      if (cleaner) {
        const cleanerBookings = await ctx.db
          .query('bookings')
          .withIndex('by_cleaner', (q) => q.eq('cleanerId', booking.cleanerId!))
          .filter((q) => q.neq(q.field('rating'), undefined))
          .collect()

        const totalRating = cleanerBookings.reduce(
          (sum, b) => sum + (b.rating ?? 0),
          0
        )
        const avgRating = totalRating / cleanerBookings.length

        await ctx.db.patch(booking.cleanerId, {
          rating: Math.round(avgRating * 10) / 10,
        })
      }
    }
  },
})

export const reschedule = mutation({
  args: {
    bookingId: v.id('bookings'),
    newScheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user || booking.userId !== user._id) {
      throw new ConvexError('Unauthorized')
    }

    // Enforce 48h notice for rescheduling
    if (booking.scheduledAt - Date.now() < FORTY_EIGHT_HOURS_MS) {
      throw new ConvexError('Rescheduling requires 48 hours notice')
    }

    if (
      booking.status === 'completed' ||
      booking.status === 'cancelled' ||
      booking.status === 'in_progress'
    ) {
      throw new ConvexError('Booking cannot be rescheduled from current status')
    }

    await ctx.db.patch(args.bookingId, {
      scheduledAt: args.newScheduledAt,
    })
  },
})
