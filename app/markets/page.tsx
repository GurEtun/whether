import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketsExplorer } from "@/components/markets-explorer"

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MarketsExplorer />
      </main>
      <Footer />
    </div>
  )
}
