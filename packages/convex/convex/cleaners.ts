import { v, ConvexError } from 'convex/values'
import { query, mutation } from './_generated/server'

// ─── Queries ───────────────────────────────────────────────

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('cleaners')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()
  },
})

export const getById = query({
  args: { cleanerId: v.id('cleaners') },
  handler: async (ctx, args) => {
    const cleaner = await ctx.db.get(args.cleanerId)
    if (!cleaner) throw new ConvexError('Cleaner not found')
    return cleaner
  },
})

// ─── Mutations ─────────────────────────────────────────────

export const updateLocation = mutation({
  args: {
    cleanerId: v.id('cleaners'),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const cleaner = await ctx.db.get(args.cleanerId)
    if (!cleaner) throw new ConvexError('Cleaner not found')

    await ctx.db.patch(args.cleanerId, {
      currentLocationLat: args.lat,
      currentLocationLng: args.lng,
      lastLocationUpdate: Date.now(),
    })
  },
})

export const assignToBooking = mutation({
  args: {
    bookingId: v.id('bookings'),
    cleanerId: v.id('cleaners'),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId)
    if (!booking) throw new ConvexError('Booking not found')

    const cleaner = await ctx.db.get(args.cleanerId)
    if (!cleaner) throw new ConvexError('Cleaner not found')
    if (!cleaner.isActive) throw new ConvexError('Cleaner is not active')

    await ctx.db.patch(args.bookingId, {
      cleanerId: args.cleanerId,
    })

    // Increment cleaner's total cleans count
    await ctx.db.patch(args.cleanerId, {
      totalCleans: cleaner.totalCleans + 1,
    })
  },
})
