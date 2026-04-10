import { Hero } from '@/components/marketing/Hero'
import { QuoteEstimator } from '@/components/marketing/QuoteEstimator'
import { TrustSignals } from '@/components/marketing/TrustSignals'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { Footer } from '@/components/marketing/Footer'
import { AIChat } from '@/components/chat/AIChat'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <QuoteEstimator />
      <TrustSignals />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
      <AIChat />
    </main>
  )
}
