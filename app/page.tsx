import { Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MarketCategories } from "@/components/market-categories"
import { FeaturedMarkets } from "@/components/featured-markets"
import { SocialAIFeatures } from "@/components/social-ai-features"
import { TrendingMarkets } from "@/components/trending-markets"
import { MarketSeries } from "@/components/market-series"
import { TradingFeatures } from "@/components/trading-features"
import { HowItWorks } from "@/components/how-it-works"
import { WhetherAnimation } from "@/components/whether-animation"
import { Footer } from "@/components/footer"
import { HomeSkeleton } from "@/components/home-skeleton"

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <MarketCategories />
          <FeaturedMarkets />
          <SocialAIFeatures />
          <TrendingMarkets />
          <MarketSeries />
          <TradingFeatures />
          <HowItWorks />
        </main>
        <Footer />
        <WhetherAnimation />
      </div>
    </Suspense>
  )
}
