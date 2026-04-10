import type { QuoteParams, AddOn } from '@spotlyclean/types'

// Base prices in dollars
export const BASE_PRICES = {
  deep_clean: { 1: 200, 2: 250, 3: 350 } as Record<number, number>,
  biweekly: { 1: 120, 2: 150, 3: 200 } as Record<number, number>,
  weekly: { 1: 100, 2: 120, 3: 180 } as Record<number, number>,
  office: { weekly: 100, biweekly: 120, daily: 80 } as Record<string, number>,
} as const

export const ADD_ON_PRICES: Record<AddOn, number> = {
  fridge: 25,
  stove: 20,
  inside_windows: 20,
  dishes: 20,
  pet_surcharge: 25,
}

/**
 * Calculate total price in cents for a given quote.
 * Always returns price in cents (integer).
 */
export function calculatePrice(params: QuoteParams): number {
  const { propertyType, floors, frequency, addOns } = params

  let basePriceDollars: number

  if (propertyType === 'office' || propertyType === 'restaurant') {
    // Office/restaurant pricing is by frequency
    basePriceDollars = BASE_PRICES.office[frequency] ?? BASE_PRICES.office.weekly
  } else {
    // Residential pricing: once = deep_clean, otherwise by frequency
    const tier = frequency === 'once' ? 'deep_clean' : frequency
    basePriceDollars = BASE_PRICES[tier][floors] ?? 0
  }

  // Add-on prices
  const addOnTotalDollars = addOns.reduce((sum, addOn) => {
    return sum + (ADD_ON_PRICES[addOn] ?? 0)
  }, 0)

  const totalDollars = basePriceDollars + addOnTotalDollars

  // Return in cents
  return totalDollars * 100
}
