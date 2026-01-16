import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketsExplorer } from "@/components/markets-explorer"

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MarketsExplorer initialCategory={category} />
      </main>
      <Footer />
    </div>
  )
}
