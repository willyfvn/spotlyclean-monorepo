import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

type EmailType =
  | 'booking_confirmation'
  | 'reminder_24h'
  | 'reminder_2h'
  | 'review_request'
  | 'payment_receipt'
  | 'referral_credit'

function buildEmailHtml(type: EmailType, data: Record<string, string>): { subject: string; html: string } {
  switch (type) {
    case 'booking_confirmation':
      return {
        subject: 'Your SpotlyClean booking is confirmed!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Booking Confirmed!</h1>
            <p>Hi ${data.name},</p>
            <p>Your cleaning is scheduled for <strong>${data.date}</strong>.</p>
            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p><strong>Service:</strong> ${data.propertyType} cleaning</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Total:</strong> $${data.price}</p>
            </div>
            <p>Need to make changes? You can reschedule or cancel up to 48 hours before your appointment.</p>
            <a href="https://spotlyclean.com/dashboard" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Booking</a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">SpotlyClean - Professional Cleaning Services in Massachusetts</p>
          </div>
        `,
      }
    case 'reminder_24h':
      return {
        subject: 'Your clean is tomorrow!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Reminder: Clean Tomorrow</h1>
            <p>Hi ${data.name},</p>
            <p>Just a reminder that your cleaning is scheduled for <strong>${data.date}</strong>.</p>
            <p>Please ensure access is available for our cleaning team.</p>
            <a href="https://spotlyclean.com/dashboard" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Details</a>
          </div>
        `,
      }
    case 'reminder_2h':
      return {
        subject: 'Your cleaner arrives in 2 hours!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Almost Time!</h1>
            <p>Hi ${data.name},</p>
            <p>Your cleaner will arrive in approximately 2 hours.</p>
            <a href="https://spotlyclean.com/dashboard" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Track Progress</a>
          </div>
        `,
      }
    case 'review_request':
      return {
        subject: 'How was your clean?',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">How Did We Do?</h1>
            <p>Hi ${data.name},</p>
            <p>We hope you loved your recent clean! Your feedback helps us improve.</p>
            <a href="https://spotlyclean.com/bookings" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Leave a Review</a>
          </div>
        `,
      }
    case 'payment_receipt':
      return {
        subject: 'Payment receipt from SpotlyClean',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Payment Receipt</h1>
            <p>Hi ${data.name},</p>
            <p>We've received your payment of <strong>$${data.amount}</strong>.</p>
            <p>Thank you for choosing SpotlyClean!</p>
          </div>
        `,
      }
    case 'referral_credit':
      return {
        subject: 'You earned a $25 referral credit!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">$25 Credit Earned!</h1>
            <p>Hi ${data.name},</p>
            <p>Your referral just completed their first clean. You've both earned a <strong>$25 credit</strong>!</p>
            <a href="https://spotlyclean.com/dashboard" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Your Credits</a>
          </div>
        `,
      }
  }
}

export async function POST(request: Request) {
  try {
    const { to, type, data } = await request.json()

    if (!to || !type) {
      return NextResponse.json({ error: 'Missing required fields: to, type' }, { status: 400 })
    }

    const { subject, html } = buildEmailHtml(type, data ?? {})

    const result = await resend.emails.send({
      from: 'SpotlyClean <bookings@spotlyclean.com>',
      to,
      subject,
      html,
    })

    return NextResponse.json({ sent: true, id: result.data?.id })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
