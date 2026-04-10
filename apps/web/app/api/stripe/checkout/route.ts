import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { calculatePrice } from '@spotlyclean/utils'
import type { PropertyType, Frequency, AddOn } from '@spotlyclean/types'

export async function POST(request: Request) {
  try {
    const { bookingId, propertyType, floors, frequency, addOns } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    // Server-side price recalculation — never trust client
    const priceCents = calculatePrice({
      propertyType: propertyType as PropertyType,
      floors: floors as 1 | 2 | 3,
      frequency: frequency as Frequency,
      addOns: (addOns || []) as AddOn[],
    })

    const isRecurring = frequency === 'weekly' || frequency === 'biweekly'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (isRecurring) {
      // Create a recurring price on-the-fly for subscriptions
      const price = await stripe.prices.create({
        unit_amount: priceCents,
        currency: 'usd',
        recurring: {
          interval: frequency === 'weekly' ? 'week' : 'week',
          interval_count: frequency === 'biweekly' ? 2 : 1,
        },
        product_data: {
          name: `SpotlyClean ${frequency} cleaning`,
        },
      })

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: { bookingId },
        success_url: `${appUrl}/book?step=6&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/book?step=5`,
      })

      return NextResponse.json({ url: session.url })
    } else {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: priceCents,
              product_data: {
                name: 'SpotlyClean one-time cleaning',
              },
            },
            quantity: 1,
          },
        ],
        metadata: { bookingId },
        success_url: `${appUrl}/book?step=6&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/book?step=5`,
      })

      return NextResponse.json({ url: session.url })
    }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
