import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // TODO: Email sending endpoint via Resend
  return NextResponse.json({ sent: true })
}
