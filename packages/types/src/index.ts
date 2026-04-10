// Booking status flow: pending → confirmed → in_progress → completed | cancelled
export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

// Service frequency
export type Frequency = 'once' | 'weekly' | 'biweekly'

// Property type
export type PropertyType = 'home' | 'office' | 'airbnb' | 'post_construction' | 'restaurant'

// Add-on services
export type AddOn = 'fridge' | 'stove' | 'inside_windows' | 'dishes' | 'pet_surcharge'

// Address
export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

// User profile
export interface UserProfile {
  clerkId: string
  email: string
  name: string
  phone?: string
  address?: Address
  preferredCleanerId?: string
  loyaltyPoints: number
  referralCode: string
  referredBy?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  pushToken?: string
  createdAt: string
}

// Booking
export interface Booking {
  id: string
  userId: string
  cleanerId?: string
  propertyType: PropertyType
  floors: 1 | 2 | 3
  frequency: Frequency
  addOns: AddOn[]
  scheduledAt: string // ISO datetime
  durationMinutes: number
  status: BookingStatus
  totalPriceCents: number // always store in cents
  stripePaymentIntentId?: string
  stripeSessionId?: string
  notes?: string
  entryInstructions?: string
  rating?: number // 1-5
  reviewText?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
}

// Cleaner
export interface Cleaner {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  totalCleans: number
  isActive: boolean
  currentLocationLat?: number
  currentLocationLng?: number
  lastLocationUpdate?: number
}

// Loyalty transaction
export type LoyaltyTransactionType =
  | 'earned_clean'
  | 'redeemed'
  | 'referral_bonus'
  | 'welcome_bonus'

export interface LoyaltyTransaction {
  id: string
  userId: string
  bookingId?: string
  points: number // positive = earned, negative = redeemed
  type: LoyaltyTransactionType
  description: string
  createdAt: string
}

// Referral
export type ReferralStatus = 'pending' | 'credited'

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  status: ReferralStatus
  creditedAt?: string
}

// Quote params for pricing calculation
export interface QuoteParams {
  propertyType: PropertyType
  floors: 1 | 2 | 3
  frequency: Frequency
  addOns: AddOn[]
}
