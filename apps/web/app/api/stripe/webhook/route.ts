import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // TODO: Verify Stripe signature, handle events
  // - checkout.session.completed → confirm booking
  // - invoice.payment_succeeded → create next recurring booking
  // - invoice.payment_failed → notify client
  return NextResponse.json({ received: true })
}
