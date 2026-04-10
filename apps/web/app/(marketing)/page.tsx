import { Hero } from '@/components/marketing/Hero'
import { TrustSignals } from '@/components/marketing/TrustSignals'
import { QuoteEstimator } from '@/components/marketing/QuoteEstimator'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { CallForQuote } from '@/components/marketing/CallForQuote'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { Footer } from '@/components/marketing/Footer'
import { AIChat } from '@/components/chat/AIChat'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <QuoteEstimator />
      <Pricing />
      <Testimonials />
      <CallForQuote />
      <Footer />
      <AIChat />
    </main>
  )
}
