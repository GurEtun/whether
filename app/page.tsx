import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MarketCategories } from "@/components/market-categories"
import { FeaturedMarkets } from "@/components/featured-markets"
import { TrendingMarkets } from "@/components/trending-markets"
import { MarketSeries } from "@/components/market-series"
import { DFlowFeatures } from "@/components/dflow-features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MarketCategories />
        <FeaturedMarkets />
        <TrendingMarkets />
        <MarketSeries />
        <DFlowFeatures />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
