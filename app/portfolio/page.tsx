import { Header } from "@/components/header"
import { Portfolio } from "@/components/portfolio"
import { Footer } from "@/components/footer"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Portfolio />
      </main>
      <Footer />
    </div>
  )
}
