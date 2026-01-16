import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <Search className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Market Not Found</h1>
        <p className="text-muted-foreground mb-8">The market you're looking for doesn't exist or has been removed.</p>
        <Link href="/markets">
          <Button size="lg">Explore All Markets</Button>
        </Link>
      </main>
      <Footer />
    </div>
  )
}
