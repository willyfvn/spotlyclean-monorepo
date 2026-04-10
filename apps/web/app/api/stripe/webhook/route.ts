import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@spotlyclean/convex'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          await convex.mutation(api.bookings.confirm, {
            bookingId: bookingId as any,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : undefined,
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : undefined
        if (customerId) {
          console.log('Recurring payment succeeded for customer:', customerId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : undefined
        if (customerId) {
          console.error('Payment failed for customer:', customerId)
        }
        break
      }
    }
  } catch (err) {
    console.error('Error handling webhook event:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
