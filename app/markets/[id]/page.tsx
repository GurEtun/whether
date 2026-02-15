import { Header } from "@/components/header"
import { MarketDetail } from "@/components/market-detail"
import { Footer } from "@/components/footer"
import { jupiterFetch } from "@/lib/jup-client"
import { notFound } from "next/navigation"

// Dynamic route - fetch from API at runtime
export const dynamic = "force-dynamic"

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch from Jupiter/Kalshi API
  let market
  try {
    market = await jupiterFetch(`/api/v1/markets/${id}`)
  } catch (error) {
    console.error("Failed to fetch market from Jupiter/Kalshi API:", error)
    notFound()
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
