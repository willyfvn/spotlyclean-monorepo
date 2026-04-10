'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  { label: 'Get a quote', message: "I'd like to get a quote for cleaning" },
  { label: 'Check availability', message: 'What dates do you have available this week?' },
  { label: 'Our services', message: 'What cleaning services do you offer?' },
  { label: 'Pricing info', message: 'What are your pricing options?' },
]

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    function handleOpenChat() {
      setIsOpen(true)
      setHasBeenOpened(true)
    }
    window.addEventListener('open-chat', handleOpenChat)
    return () => window.removeEventListener('open-chat', handleOpenChat)
  }, [])

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message ?? 'Sorry, something went wrong.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't connect. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSend() {
    sendMessage(input)
  }

  function handleQuickAction(text: string) {
    sendMessage(text)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!hasBeenOpened) setHasBeenOpened(true)
        }}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-lg shadow-forest/25 ring-4 ring-forest/10 transition-all hover:bg-forest-deep hover:shadow-xl active:scale-95 ${
          !isOpen && !hasBeenOpened ? 'animate-float' : ''
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Notification dot */}
        {!hasBeenOpened && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
          </span>
        )}
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-3xl border border-forest/15 bg-white shadow-2xl shadow-charcoal/10 sm:bottom-24 sm:right-6 sm:w-[26rem]">
          {/* Header */}
          <div className="bg-forest px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-deep">
                  <svg className="h-5 w-5 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">SpotlyClean AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage" />
                    </span>
                    <p className="text-[11px] text-white/60">Replies instantly</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 rounded-lg bg-sage/15 px-3 py-1.5 text-[11px] text-sage">
              Powered by AI &middot; Ask about pricing &amp; availability
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-cream/50 px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-charcoal">
                  Hi there! I&apos;m Spotly, your cleaning assistant.
                </p>
                <p className="mt-1 text-xs text-charcoal/50">
                  I can get you an instant quote, check availability, or answer
                  any questions.
                </p>
                {/* Quick action chips */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="rounded-xl border border-forest/15 bg-sage/40 px-3 py-2.5 text-left text-xs font-medium text-forest transition-all hover:border-forest/30 hover:bg-sage"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-forest text-white'
                      : 'bg-white text-charcoal border border-charcoal/[0.06]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-charcoal/[0.06] px-4 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/50"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Book Now CTA (shown after 3+ messages) */}
          {messages.length >= 3 && (
            <div className="flex items-center justify-between border-t border-forest/10 bg-forest/[0.03] px-4 py-2.5">
              <span className="text-xs text-charcoal/50">Ready to book?</span>
              <Link
                href="/book"
                className="text-xs font-bold text-forest hover:text-forest-deep"
              >
                Book now &rarr;
              </Link>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-charcoal/[0.06] bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, availability..."
                className="flex-1 rounded-xl border border-forest/15 bg-cream/50 px-3 py-2.5 text-sm placeholder:text-charcoal/35 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white transition-colors hover:bg-forest-deep disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
