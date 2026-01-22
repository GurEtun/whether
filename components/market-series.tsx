"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Layers, TrendingUp } from "lucide-react"
import Link from "next/link"

// Markets are organized into Series > Events > Markets
const seriesData = [
  {
    id: "us-elections-2026",
    name: "US Elections 2026",
    description: "Midterm election markets including Senate, House, and Governor races",
    eventCount: 48,
    totalVolume: "$12.4M",
    icon: "🇺🇸",
    status: "active",
    events: [
      { name: "Senate Control", markets: 4, volume: "$3.2M" },
      { name: "House Control", markets: 2, volume: "$2.8M" },
      { name: "Key Races", markets: 42, volume: "$6.4M" },
    ],
  },
  {
    id: "crypto-milestones-2026",
    name: "Crypto Milestones 2026",
    description: "Major cryptocurrency price and adoption milestones",
    eventCount: 24,
    totalVolume: "$8.7M",
    icon: "₿",
    status: "active",
    events: [
      { name: "BTC Price Targets", markets: 8, volume: "$4.1M" },
      { name: "ETH Price Targets", markets: 6, volume: "$2.3M" },
      { name: "Alt Season", markets: 10, volume: "$2.3M" },
    ],
  },
  {
    id: "fed-policy-2026",
    name: "Fed Policy 2026",
    description: "Federal Reserve interest rate decisions and policy changes",
    eventCount: 12,
    totalVolume: "$5.2M",
    icon: "🏦",
    status: "active",
    events: [
      { name: "Rate Decisions", markets: 8, volume: "$3.8M" },
      { name: "Policy Changes", markets: 4, volume: "$1.4M" },
    ],
  },
]

export function MarketSeries() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Market Series</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Organized collections of related events and markets
            </p>
          </div>
          <Link href="/markets">
            <Button variant="outline" className="w-full gap-2 bg-transparent sm:w-auto">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seriesData.map((series) => (
            <Link key={series.id} href={`/markets?series=${series.id}`}>
              <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl sm:text-2xl">
                        {series.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors sm:text-lg">
                          {series.name}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:gap-2">
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {series.eventCount} events
                          </Badge>
                          <Badge className="bg-success/10 text-success text-[10px] sm:text-xs">{series.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{series.description}</p>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    {series.events.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-secondary/50 px-2 py-2 sm:px-3 text-xs sm:text-sm"
                      >
                        <span className="text-foreground font-medium">{event.name}</span>
                        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground">
                          <span>{event.markets} markets</span>
                          <span className="text-success">{event.volume}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{series.totalVolume} total volume</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
