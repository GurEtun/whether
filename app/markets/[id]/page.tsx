import { Header } from "@/components/header"
import { MarketDetail } from "@/components/market-detail"
import { Footer } from "@/components/footer"
import { getMarketById, markets } from "@/lib/markets-data"
import { jupiterFetch } from "@/lib/jup-client"
import { notFound } from "next/navigation"

// Generate static paths for all markets at build time
export function generateStaticParams() {
  return markets.map((market) => ({
    id: market.id,
  }))
}

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Try to fetch from Jupiter/Kalshi API first
  let market
  try {
    console.log("[v0] Fetching market from Jupiter/Kalshi API:", id)
    market = await jupiterFetch(`/api/v1/markets/${id}`)
    console.log("[v0] Market data from Jupiter/Kalshi:", market)
  } catch (error) {
    console.log("[v0] Failed to fetch from Jupiter/Kalshi, using static data:", error)
    // Fallback to static data
    market = getMarketById(id)
  }

  if (!market) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MarketDetail market={market} />
      </main>
      <Footer />
    </div>
  )
}
