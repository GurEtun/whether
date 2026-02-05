"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Clock, Users, ArrowRight, Flame, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useJupiterEvents } from "@/hooks/use-jupiter-market"
import type { TransformedMarket } from "@/lib/kalshi-types"

export function FeaturedMarkets() {
  const [sortBy, setSortBy] = useState<"trending" | "new" | "volume">("trending")
  
  // Map sortBy to API parameters
  const apiFilter = useMemo(() => {
    if (sortBy === "trending") return "trending" as const
    if (sortBy === "new") return "new" as const
    return undefined
  }, [sortBy])
  
  // Fetch real data from Jupiter Kalshi API
  const { markets, isLoading, isError, refresh } = useJupiterEvents({
    filter: apiFilter,
    sortBy: sortBy === "volume" ? "volume" : undefined,
    sortDirection: "desc",
  })
  
  // Take top 6 featured markets
  const featuredMarkets = markets.slice(0, 6)

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

        {/* Loading state */}
        {isLoading && featuredMarkets.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-full border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="h-5 w-16 bg-accent animate-pulse rounded" />
                  <div className="h-6 w-full bg-accent animate-pulse rounded mt-2" />
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-20 bg-accent animate-pulse rounded" />
                      <div className="h-8 w-16 bg-accent animate-pulse rounded-full" />
                    </div>
                    <div className="h-2 w-full bg-accent animate-pulse rounded" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-3">
                  <div className="h-4 w-full bg-accent animate-pulse rounded" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex h-60 items-center justify-center rounded-lg border border-danger/20 bg-danger/5">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-danger opacity-50 mb-3" />
              <p className="text-danger font-medium">Failed to load featured markets</p>
              <p className="text-sm text-muted-foreground mb-4">Could not connect to Jupiter API</p>
              <Button onClick={() => refresh()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Markets grid */}
        {!isLoading && !isError && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && featuredMarkets.length === 0 && (
          <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
            <div className="text-center">
              <p className="text-muted-foreground">No markets available</p>
              <p className="text-sm text-muted-foreground">Check back later for new markets</p>
            </div>
          </div>
        )}

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

function MarketCard({ market }: { market: TransformedMarket }) {
  const isPositive = market.change >= 0
  const yesPercent = Math.round(market.yesPrice)

  return (
    <Link href={`/markets/${market.id}`}>
      <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground capitalize">
              {market.category}
            </Badge>
            {market.trending && (
              <Badge className="gap-1 bg-warning/10 text-warning">
                <Flame className="h-3 w-3" /> Hot
              </Badge>
            )}
            {market.isLive && (
              <Badge className="gap-1 bg-success/10 text-success text-xs">
                Live
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
              <p className="text-3xl font-bold text-success">{yesPercent}¢</p>
            </div>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${
                isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {market.change.toFixed(1)}%
            </div>
          </div>

          {/* Mini probability bar */}
          <div className="mt-4 flex gap-1">
            <div className="h-2 rounded-l-full bg-success transition-all" style={{ width: `${yesPercent}%` }} />
            <div
              className="h-2 rounded-r-full bg-danger transition-all"
              style={{ width: `${100 - yesPercent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Yes {yesPercent}%</span>
            <span>No {100 - yesPercent}%</span>
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
