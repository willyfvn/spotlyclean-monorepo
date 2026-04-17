import { v, ConvexError } from 'convex/values'
import { query, mutation } from './_generated/server'

// ─── Queries ───────────────────────────────────────────────

export const getProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
  },
})

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique()
  },
})

// ─── Mutations ─────────────────────────────────────────────

export const createProfile = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    referredBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique()
    if (existing) return existing._id

    // Generate a unique referral code
    const referralCode = `SC-${args.clerkId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

    // If referred by someone, validate the referral code exists
    if (args.referredBy) {
      const referrer = await ctx.db
        .query('users')
        .withIndex('by_referral_code', (q) =>
          q.eq('referralCode', args.referredBy!)
        )
        .unique()
      if (!referrer) {
        throw new ConvexError('Invalid referral code')
      }
    }

    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      loyaltyPoints: 0,
      referralCode,
      referredBy: args.referredBy,
    })

    // If referred, create a pending referral record
    if (args.referredBy) {
      const referrer = await ctx.db
        .query('users')
        .withIndex('by_referral_code', (q) =>
          q.eq('referralCode', args.referredBy!)
        )
        .unique()

      if (referrer) {
        await ctx.db.insert('referrals', {
          referrerId: referrer._id,
          referredUserId: userId,
          status: 'pending',
        })
      }
    }

    // Welcome bonus
    await ctx.db.insert('loyalty_transactions', {
      userId,
      points: 50,
      type: 'welcome_bonus',
      description: 'Welcome bonus for signing up',
    })
    await ctx.db.patch(userId, { loyaltyPoints: 50 })

    return userId
  },
})

export const linkClerkAccount = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()

    if (user && user.clerkId.startsWith('guest_')) {
      await ctx.db.patch(user._id, { clerkId: args.clerkId })
    }
  },
})

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
      })
    ),
    preferredCleanerId: v.optional(v.id('cleaners')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    const updates: Record<string, unknown> = {}
    if (args.name !== undefined) updates.name = args.name
    if (args.phone !== undefined) updates.phone = args.phone
    if (args.address !== undefined) updates.address = args.address
    if (args.preferredCleanerId !== undefined)
      updates.preferredCleanerId = args.preferredCleanerId

    await ctx.db.patch(user._id, updates)
  },
})

export const updatePushToken = mutation({
  args: { pushToken: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Unauthenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
    if (!user) throw new ConvexError('User not found')

    await ctx.db.patch(user._id, { pushToken: args.pushToken })
  },
})
