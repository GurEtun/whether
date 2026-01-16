"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Clock, Users, ArrowRight, Flame } from "lucide-react"
import Link from "next/link"

const featuredMarkets = [
  {
    id: 1,
    title: "Will the Fed cut rates by June 2026?",
    category: "Economics",
    yesPrice: 72,
    change: 5.2,
    volume: "$892K",
    traders: 2341,
    endDate: "Jun 15, 2026",
    trending: true,
  },
  {
    id: 2,
    title: "Will ETH flip BTC market cap in 2026?",
    category: "Crypto",
    yesPrice: 23,
    change: -3.1,
    volume: "$1.4M",
    traders: 4521,
    endDate: "Dec 31, 2026",
    trending: true,
  },
  {
    id: 3,
    title: "Will there be a major AI regulation bill passed in 2026?",
    category: "Politics",
    yesPrice: 58,
    change: 8.7,
    volume: "$567K",
    traders: 1892,
    endDate: "Dec 31, 2026",
    trending: false,
  },
  {
    id: 4,
    title: "Will Taylor Swift announce a new album by Q2 2026?",
    category: "Entertainment",
    yesPrice: 81,
    change: 2.1,
    volume: "$234K",
    traders: 3456,
    endDate: "Jun 30, 2026",
    trending: false,
  },
  {
    id: 5,
    title: "Will SpaceX Starship complete orbital refueling by 2026?",
    category: "Science & Tech",
    yesPrice: 45,
    change: 12.3,
    volume: "$678K",
    traders: 2134,
    endDate: "Dec 31, 2026",
    trending: true,
  },
  {
    id: 6,
    title: "Will Manchester City win the Premier League 25/26?",
    category: "Sports",
    yesPrice: 34,
    change: -1.5,
    volume: "$1.1M",
    traders: 5678,
    endDate: "May 25, 2026",
    trending: false,
  },
]

export function FeaturedMarkets() {
  const [sortBy, setSortBy] = useState("trending")

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Markets</h2>
            <p className="mt-1 text-muted-foreground">Top markets by volume and activity</p>
          </div>

          <Tabs value={sortBy} onValueChange={setSortBy}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="trending" className="gap-1.5">
                <Flame className="h-4 w-4" /> Trending
              </TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/markets">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              View All Markets <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function MarketCard({ market }: { market: (typeof featuredMarkets)[0] }) {
  const isPositive = market.change >= 0

  return (
    <Link href={`/markets/market-${market.id}`}>
      <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground">
              {market.category}
            </Badge>
            {market.trending && (
              <Badge className="gap-1 bg-warning/10 text-warning">
                <Flame className="h-3 w-3" /> Hot
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
            {market.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yes Price</p>
              <p className="text-3xl font-bold text-success">{market.yesPrice}¢</p>
            </div>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${
                isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {market.change}%
            </div>
          </div>

          {/* Mini probability bar */}
          <div className="mt-4 flex gap-1">
            <div className="h-2 rounded-l-full bg-success transition-all" style={{ width: `${market.yesPrice}%` }} />
            <div
              className="h-2 rounded-r-full bg-danger transition-all"
              style={{ width: `${100 - market.yesPrice}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Yes {market.yesPrice}%</span>
            <span>No {100 - market.yesPrice}%</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {market.volume}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {market.traders.toLocaleString()}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {market.endDate}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
