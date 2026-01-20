import { Header } from "@/components/header"
import { MarketDetail } from "@/components/market-detail"
import { Footer } from "@/components/footer"
import { getMarketById, markets } from "@/lib/markets-data"
import { notFound } from "next/navigation"

// Generate static paths for all markets at build time
export function generateStaticParams() {
  return markets.map((market) => ({
    id: market.id,
  }))
}

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const market = getMarketById(id)

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
