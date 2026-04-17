import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@spotlyclean/convex'
import crypto from 'crypto'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function generateTempPassword(): string {
  return crypto.randomBytes(12).toString('base64url').slice(0, 16)
}

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
        const email = session.metadata?.email || session.customer_email
        const name = session.metadata?.name || ''

        if (bookingId) {
          // 1. Confirm the booking in Convex
          await convex.mutation(api.bookings.confirm, {
            bookingId: bookingId as any,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : undefined,
          })

          // 2. Create Clerk account and send confirmation email
          if (email) {
            try {
              const clerk = await clerkClient()
              const existingUsers = await clerk.users.getUserList({
                emailAddress: [email],
              })

              let clerkUserId: string
              let tempPassword: string | undefined

              if (existingUsers.totalCount > 0) {
                clerkUserId = existingUsers.data[0].id
              } else {
                tempPassword = generateTempPassword()
                const newUser = await clerk.users.createUser({
                  emailAddress: [email],
                  password: tempPassword,
                  firstName: name.split(' ')[0] || undefined,
                  lastName: name.split(' ').slice(1).join(' ') || undefined,
                })
                clerkUserId = newUser.id
              }

              // 3. Link Clerk account to the guest Convex user
              await convex.mutation(api.users.linkClerkAccount, {
                email,
                clerkId: clerkUserId,
              })

              // 4. Send confirmation email with booking details
              const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spotlyclean.com'
              const scheduledAt = session.metadata?.scheduledAt
              const propertyType = session.metadata?.propertyType || ''
              const totalPriceCents = session.metadata?.totalPriceCents || '0'

              await fetch(`${appUrl}/api/resend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: email,
                  type: 'booking_confirmation',
                  data: {
                    name: name || 'there',
                    date: scheduledAt
                      ? new Date(Number(scheduledAt)).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })
                      : 'TBD',
                    propertyType,
                    price: (Number(totalPriceCents) / 100).toFixed(0),
                    loginUrl: `${appUrl}/sign-in`,
                    email,
                    tempPassword: tempPassword || '',
                  },
                }),
              })
            } catch (err) {
              console.error('Post-payment account/email error:', err)
              // Don't fail the webhook — booking is already confirmed
            }
          }
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
