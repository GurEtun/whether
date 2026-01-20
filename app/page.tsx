import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MarketCategories } from "@/components/market-categories"
import { FeaturedMarkets } from "@/components/featured-markets"
import { SocialAIFeatures } from "@/components/social-ai-features"
import { TrendingMarkets } from "@/components/trending-markets"
import { MarketSeries } from "@/components/market-series"
import { DFlowFeatures } from "@/components/dflow-features"
import { HowItWorks } from "@/components/how-it-works"
import { DFlowAnimation } from "@/components/dflow-animation"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MarketCategories />
        <FeaturedMarkets />
        <SocialAIFeatures />
        <TrendingMarkets />
        <MarketSeries />
        <DFlowFeatures />
        <HowItWorks />
      </main>
      <Footer />
      <DFlowAnimation />
    </div>
  )
}
