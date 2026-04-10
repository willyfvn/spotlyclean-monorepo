import type { QuoteParams, AddOn } from '../../types/src/index'

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
 * Calculate the recurring price per visit in cents.
 */
export function calculatePrice(params: QuoteParams): number {
  const { propertyType, floors, frequency, addOns } = params

  let basePriceDollars: number

  if (propertyType === 'office') {
    basePriceDollars = BASE_PRICES.office[frequency] ?? BASE_PRICES.office.weekly
  } else {
    basePriceDollars = BASE_PRICES[frequency][floors] ?? 0
  }

  const addOnTotalDollars = addOns.reduce((sum, addOn) => {
    return sum + (ADD_ON_PRICES[addOn] ?? 0)
  }, 0)

  return (basePriceDollars + addOnTotalDollars) * 100
}

/**
 * Calculate the one-time first clean (deep clean) price in cents.
 */
export function calculateFirstCleanPrice(params: Pick<QuoteParams, 'propertyType' | 'floors' | 'addOns'>): number {
  const { propertyType, floors, addOns } = params

  let basePriceDollars: number

  if (propertyType === 'office') {
    basePriceDollars = BASE_PRICES.office.weekly
  } else {
    basePriceDollars = BASE_PRICES.deep_clean[floors] ?? 0
  }

  const addOnTotalDollars = addOns.reduce((sum, addOn) => {
    return sum + (ADD_ON_PRICES[addOn] ?? 0)
  }, 0)

  return (basePriceDollars + addOnTotalDollars) * 100
}
