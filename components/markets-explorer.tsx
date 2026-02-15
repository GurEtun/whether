"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Clock, Users, Flame, Grid3X3, List, Layers, Loader2 } from "lucide-react"
import Link from "next/link"
import { type Market } from "@/lib/markets-data"
import { useJupiterEvents } from "@/hooks/use-jupiter-market"

const categories = ["All", "Crypto", "Politics", "Sports", "Economics", "Tech", "Culture"]
const statuses = ["All", "Open", "Closed"]

// Normalized event shape from Jupiter/Kalshi API
interface NormalizedEvent {
  eventId: string
  title: string
  subtitle: string
  description: string
  category: string
  isActive: boolean
  isLive: boolean
  isTrending: boolean
  volumeUsd: string
  tvlDollars: string
  imageUrl: string
  beginAt: string | null
  markets: NormalizedMarket[]
}

interface NormalizedMarket {
  marketId: string
  eventId: string
  title: string
  subtitle: string
  description: string
  status: "open" | "closed"
  result: string | null
  isTradable: boolean
  openTime: number
  closeTime: number
  buyYesPriceUsd: number | null
  buyNoPriceUsd: number | null
  sellYesPriceUsd: number | null
  sellNoPriceUsd: number | null
  volume: number
  volume24h: number
  openInterest: number
  liquidityDollars: number
  rulesPrimary: string
  rulesSecondary: string
}

/** Normalize a raw Jupiter event into a flat, usable shape */
function normalizeEvent(raw: any): NormalizedEvent {
  return {
    eventId: raw.eventId || raw.id || "",
    title: raw.metadata?.title || raw.title || "",
    subtitle: raw.metadata?.subtitle || "",
    description: raw.metadata?.subtitle || raw.description || "",
    category: raw.category || "all",
    isActive: raw.isActive ?? true,
    isLive: raw.isLive ?? false,
    isTrending: raw.isTrending ?? false,
    volumeUsd: raw.volumeUsd || "0",
    tvlDollars: raw.tvlDollars || "0",
    imageUrl: raw.metadata?.imageUrl || "",
    beginAt: raw.beginAt || null,
    markets: (raw.markets || []).map((m: any) => normalizeMarket(m, raw.eventId || raw.id)),
  }
}

function normalizeMarket(raw: any, eventId: string): NormalizedMarket {
  return {
    marketId: raw.marketId || raw.id || "",
    eventId: raw.event || eventId,
    title: raw.metadata?.title || raw.title || "",
    subtitle: raw.metadata?.subtitle || "",
    description: raw.metadata?.description || raw.metadata?.subtitle || "",
    status: raw.status === "open" ? "open" : "closed",
    result: raw.result || null,
    isTradable: raw.metadata?.isTradable ?? true,
    openTime: raw.openTime || 0,
    closeTime: raw.closeTime || raw.metadata?.closeTime || 0,
    buyYesPriceUsd: raw.pricing?.buyYesPriceUsd ?? null,
    buyNoPriceUsd: raw.pricing?.buyNoPriceUsd ?? null,
    sellYesPriceUsd: raw.pricing?.sellYesPriceUsd ?? null,
    sellNoPriceUsd: raw.pricing?.sellNoPriceUsd ?? null,
    volume: raw.pricing?.volume ?? 0,
    volume24h: raw.pricing?.volume24h ?? 0,
    openInterest: raw.pricing?.openInterest ?? 0,
    liquidityDollars: raw.pricing?.liquidityDollars ?? 0,
    rulesPrimary: raw.metadata?.rulesPrimary || "",
    rulesSecondary: raw.metadata?.rulesSecondary || "",
  }
}

export function MarketsExplorer({ initialCategory }: { initialCategory?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const normalizedCategory = initialCategory
    ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
    : "All"
  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [displayMode, setDisplayMode] = useState<"markets" | "events">("markets")
  
  // Fetch events from Jupiter/Kalshi API
  const { events: rawEvents, isLoading, isError } = useJupiterEvents(
    selectedCategory !== "All" ? selectedCategory : undefined
  )
  
  // Normalize events from Jupiter API shape
  const normalizedEvents: NormalizedEvent[] = (rawEvents || []).map(normalizeEvent)
  
  console.log("[v0] Raw events from API:", rawEvents?.length, "first:", rawEvents?.[0] ? Object.keys(rawEvents[0]) : "none")
  console.log("[v0] Normalized events:", normalizedEvents.length, "first title:", normalizedEvents[0]?.title, "markets:", normalizedEvents[0]?.markets?.length)
  if (normalizedEvents[0]?.markets?.[0]) {
    const m = normalizedEvents[0].markets[0]
    console.log("[v0] First market:", m.title, "yes:", m.buyYesPriceUsd, "no:", m.buyNoPriceUsd, "vol:", m.volume)
  }
  
  // Convert to Market display format
  const allMarkets: Market[] = normalizedEvents.flatMap((event) =>
    event.markets.map((market) => {
      // Convert cents price to percentage (Jupiter returns prices in USD cents 0-1)
      const yesPrice = market.buyYesPriceUsd != null ? Math.round(market.buyYesPriceUsd * 100) : 50
      const noPrice = market.buyNoPriceUsd != null ? Math.round(market.buyNoPriceUsd * 100) : 50
      const vol = market.volume || 0
      
      return {
        id: market.marketId,
        title: market.title || "Untitled Market",
        category: event.category,
        series: event.title,
        eventName: event.title,
        description: market.description || market.subtitle || market.title,
        yesPrice,
        noPrice,
        change: 0,
        volume: vol > 0 ? `$${(vol / 1000).toFixed(0)}K` : "$0",
        totalVolume: vol > 0 ? `$${(vol / 1000).toFixed(0)}K` : "$0",
        traders: 0,
        endDate: market.closeTime ? new Date(market.closeTime * 1000).toLocaleDateString() : "TBD",
        resolution: market.rulesPrimary || "Official sources",
        created: market.openTime ? new Date(market.openTime * 1000).toLocaleDateString() : "Recently",
        status: market.status === "open" ? "active" : "closed",
        trending: event.isTrending,
      } as Market
    })
  )
  
  const filteredMarkets = allMarkets.filter((market) => {
    const matchesSearch = searchQuery === "" || 
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || 
      market.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesStatus = selectedStatus === "All" || 
      (selectedStatus === "Open" && market.status === "active") ||
      (selectedStatus === "Closed" && market.status === "closed")
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
          {selectedCategory === "All" ? "Explore Markets" : `${selectedCategory} Markets`}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Discover prediction markets on Solana
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary pl-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px] sm:w-[160px] bg-secondary shrink-0 text-xs sm:text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px] sm:w-[140px] bg-secondary shrink-0 text-xs sm:text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={sortBy} onValueChange={setSortBy} className="shrink-0">
            <TabsList className="bg-secondary h-9">
              <TabsTrigger value="trending" className="gap-1 text-xs sm:text-sm px-2 sm:px-3">
                <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-xs sm:text-sm px-2 sm:px-3">
                Volume
              </TabsTrigger>
              <TabsTrigger value="new" className="text-xs sm:text-sm px-2 sm:px-3">
                New
              </TabsTrigger>
              <TabsTrigger value="ending" className="text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex">
                Ending Soon
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Display Mode Toggle */}
          <div className="flex rounded-lg bg-secondary p-0.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 text-[10px] sm:text-xs ${displayMode === "markets" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setDisplayMode("markets")}
            >
              Markets
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 text-[10px] sm:text-xs ${displayMode === "events" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setDisplayMode("events")}
            >
              Events
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg bg-secondary p-0.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-3 sm:mb-4 flex items-center gap-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {displayMode === "events" 
            ? `Showing ${normalizedEvents.length} events` 
            : `Showing ${filteredMarkets.length} markets`}
        </p>
        {isLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground">Loading events and markets...</p>
          </div>
        </div>
      )}

      {/* Content Display */}
      {!isLoading && displayMode === "events" ? (
        viewMode === "grid" ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {normalizedEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {normalizedEvents.map((event) => (
              <EventListItem key={event.eventId} event={event} />
            ))}
          </div>
        )
      ) : !isLoading && displayMode === "markets" ? (
        viewMode === "grid" ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredMarkets.map((market) => (
              <MarketListItem key={market.id} market={market} />
            ))}
          </div>
        )
      ) : null}

      {!isLoading && displayMode === "markets" && filteredMarkets.length === 0 && allMarkets.length === 0 && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3 animate-spin" />
            <p className="text-muted-foreground">Loading markets from Jupiter/Kalshi...</p>
            <p className="text-sm text-muted-foreground">Please wait while we fetch the latest data</p>
          </div>
        </div>
      )}
      
      {!isLoading && displayMode === "markets" && filteredMarkets.length === 0 && allMarkets.length > 0 && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No markets match your filters</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
      
      {!isLoading && displayMode === "events" && normalizedEvents.length === 0 && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No events available</p>
            <p className="text-sm text-muted-foreground">Check back later for new prediction events</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MarketCard({ market }: { market: Market }) {
  const isPositive = market.change >= 0

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full"
      onClick={() => (window.location.href = `/markets/${market.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/markets/category/${market.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:opacity-80 transition-opacity"
              >
                <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground">
                  {market.category}
                </Badge>
              </Link>
              {market.trending && (
                <Badge className="gap-1 bg-warning/10 text-warning">
                  <Flame className="h-3 w-3" /> Hot
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" /> {market.series}
            </p>
          </div>
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
          <div className="h-2 rounded-r-full bg-danger transition-all" style={{ width: `${100 - market.yesPrice}%` }} />
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
  )
}

function MarketListItem({ market }: { market: Market }) {
  const isPositive = market.change >= 0

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50"
      onClick={() => (window.location.href = `/markets/${market.id}`)}
    >
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="flex flex-col items-center justify-center w-16 shrink-0">
            <span className="text-2xl font-bold text-success">{market.yesPrice}¢</span>
            <span className="text-xs text-muted-foreground">Yes</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/markets/category/${market.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:opacity-80 transition-opacity"
              >
                <Badge variant="secondary" className="text-xs">
                  {market.category}
                </Badge>
              </Link>
              {market.trending && (
                <Badge className="gap-1 bg-warning/10 text-warning text-xs">
                  <Flame className="h-3 w-3" />
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-foreground group-hover:text-primary">{market.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{market.series}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-sm w-full sm:w-auto justify-between sm:justify-end">
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium ${
              isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {market.change}%
          </div>
          <div className="text-right">
            <p className="font-medium text-foreground">{market.volume}</p>
            <p className="text-xs text-muted-foreground">volume</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-medium text-foreground">{market.traders.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">traders</p>
          </div>
          <div className="text-right hidden lg:block">
            <p className="font-medium text-foreground">{market.endDate}</p>
            <p className="text-xs text-muted-foreground">ends</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EventCard({ event }: { event: NormalizedEvent }) {
  const volumeNum = parseFloat(event.volumeUsd) || 0
  const volumeDisplay = volumeNum > 1000 ? `$${(volumeNum / 1000).toFixed(0)}K` : `$${volumeNum.toFixed(0)}`
  
  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full"
      onClick={() => (window.location.href = `/events/${event.eventId}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground capitalize">
                {event.category}
              </Badge>
              {event.isLive && (
                <Badge variant="default" className="text-xs">Live</Badge>
              )}
              {event.isTrending && (
                <Badge variant="secondary" className="text-xs">
                  <Flame className="h-3 w-3 mr-1" /> Trending
                </Badge>
              )}
            </div>
          </div>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary mt-2">
          {event.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{event.markets.length}</p>
              <p className="text-xs text-muted-foreground">Markets</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{volumeDisplay}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        {event.isActive ? (
          <span className="flex items-center gap-1 text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Closed
          </span>
        )}
        <span className="text-primary font-medium">View Markets &rarr;</span>
      </CardFooter>
    </Card>
  )
}

function EventListItem({ event }: { event: NormalizedEvent }) {
  const volumeNum = parseFloat(event.volumeUsd) || 0
  const volumeDisplay = volumeNum > 1000 ? `$${(volumeNum / 1000).toFixed(0)}K` : `$${volumeNum.toFixed(0)}`
  
  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50"
      onClick={() => (window.location.href = `/events/${event.eventId}`)}
    >
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div className="flex items-start gap-4 flex-1 w-full sm:w-auto">
          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg bg-secondary/50 shrink-0">
            <Layers className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-bold text-foreground">{event.markets.length}</span>
            <span className="text-[10px] text-muted-foreground">Markets</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs capitalize">
                {event.category}
              </Badge>
              {event.isLive && (
                <Badge variant="default" className="text-xs">Live</Badge>
              )}
              {event.isTrending && (
                <Badge variant="secondary" className="text-xs">Trending</Badge>
              )}
            </div>
            <h3 className="font-medium text-foreground group-hover:text-primary">{event.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-sm w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="font-medium text-foreground">{volumeDisplay}</p>
            <p className="text-xs text-muted-foreground">volume</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-medium text-foreground">{event.isActive ? "Active" : "Closed"}</p>
            <p className="text-xs text-muted-foreground">status</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary shrink-0">
            View &rarr;
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
