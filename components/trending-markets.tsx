"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useDFlowMarkets } from "@/hooks/use-dflow-markets"

// Fallback data when API is unavailable
const fallbackTrendingData = [
  { id: "trending-1", title: "BTC above $100K EOY 2026", yesPrice: 78, change: 12.4, category: "Crypto" },
  { id: "trending-2", title: "US GDP growth > 3% in 2026", yesPrice: 41, change: 8.2, category: "Economics" },
  { id: "trending-3", title: "iPhone SE 4 released by Q2", yesPrice: 89, change: 5.7, category: "Tech" },
  { id: "trending-4", title: "Champions League Final: English team wins", yesPrice: 52, change: -2.1, category: "Sports" },
  { id: "trending-5", title: "Oscars Best Picture: Sci-Fi wins", yesPrice: 28, change: 15.8, category: "Entertainment" },
]

export function TrendingMarkets() {
  const { markets: dflowMarkets } = useDFlowMarkets("active")
  
  // Filter trending markets and take top 5
  const trendingData = dflowMarkets.length > 0 
    ? dflowMarkets.filter((m: { trending?: boolean }) => m.trending).slice(0, 5).map((m: { id: string; title: string; yesPrice: number; change: number; category: string }) => ({
        id: m.id,
        title: m.title,
        yesPrice: m.yesPrice,
        change: m.change,
        category: m.category,
      }))
    : fallbackTrendingData
  
  // Ensure we always have some data
  const displayData = trendingData.length > 0 ? trendingData : fallbackTrendingData
  return (
    <section className="border-y border-border bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
          </div>
          <Link href="/markets">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
              See all <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayData.map((item) => {
            const isPositive = item.change >= 0

            return (
              <Link key={item.id} href={`/markets/${item.id}`}>
                <Card className="group min-w-[280px] shrink-0 cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/50">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <div
                      className={`flex items-center gap-0.5 text-sm font-medium ${
                        isPositive ? "text-success" : "text-danger"
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isPositive ? "+" : ""}
                      {item.change}%
                    </div>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-success">{item.yesPrice}¢</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-success/30 px-2 text-xs text-success hover:bg-success/10 bg-transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-danger/30 px-2 text-xs text-danger hover:bg-danger/10 bg-transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
