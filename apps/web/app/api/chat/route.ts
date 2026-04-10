import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // TODO: Streaming Claude AI chat endpoint
  // - Parse messages from request body
  // - Inject system prompt with business context
  // - If authenticated, include user's upcoming booking context
  // - Stream response back
  return NextResponse.json({ message: 'Chat endpoint placeholder' })
}
