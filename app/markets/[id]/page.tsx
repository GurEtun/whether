import { Header } from "@/components/header"
import { MarketDetail } from "@/components/market-detail"
import { Footer } from "@/components/footer"
import { getMarketById } from "@/lib/markets-data"
import { notFound } from "next/navigation"

export default function MarketPage({ params }: { params: { id: string } }) {
  const market = getMarketById(params.id)

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
