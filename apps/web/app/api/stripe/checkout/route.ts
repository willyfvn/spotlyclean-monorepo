import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { calculateFirstCleanPrice } from '@spotlyclean/utils'
import type { PropertyType, AddOn } from '@spotlyclean/types'

export async function POST(request: Request) {
  try {
    const { bookingId, propertyType, floors, frequency, addOns, email, name, scheduledAt } =
      await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    // Server-side price recalculation — never trust client
    // First clean is always a deep clean (one-time price)
    const firstCleanCents = calculateFirstCleanPrice({
      propertyType: propertyType as PropertyType,
      floors: floors as 1 | 2 | 3,
      addOns: (addOns || []) as AddOn[],
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: firstCleanCents,
            product_data: {
              name: 'SpotlyClean first clean (deep clean)',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
        email: email || '',
        name: name || '',
        frequency: frequency || '',
        scheduledAt: String(scheduledAt || ''),
        propertyType: propertyType || '',
        totalPriceCents: String(firstCleanCents),
      },
      success_url: `${appUrl}/book?step=6&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/book?step=5`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
