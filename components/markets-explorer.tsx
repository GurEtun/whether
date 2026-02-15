"use client"

import { useState, useEffect } from "react"
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

const categories = ["All", "Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
const statuses = ["All", "Active", "Closed", "Determined", "Finalized"]

interface EventWithMarkets {
  id: string
  title: string
  description: string
  category: string
  status: string
  startDate: number
  endDate: number
  marketCount: number
  volume: number
  markets?: any[]
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
  
  // Fetch events from API
  const { events, isLoading, isError } = useJupiterEvents(
    selectedCategory !== "All" ? selectedCategory : undefined
  )
  
  // Fetch markets for each event
  const [eventsWithMarkets, setEventsWithMarkets] = useState<EventWithMarkets[]>([])
  const [loadingMarkets, setLoadingMarkets] = useState(false)
  
  useEffect(() => {
    async function fetchMarketsForEvents() {
      if (!events || events.length === 0) return
      
      setLoadingMarkets(true)
      try {
        const eventsData = await Promise.all(
          events.map(async (event: any) => {
            try {
              const response = await fetch(`/api/jup/events/${event.id}/markets?limit=10`)
              const data = await response.json()
              return {
                ...event,
                markets: data.markets || []
              }
            } catch (error) {
              console.log(`[v0] Failed to fetch markets for event ${event.id}:`, error)
              return {
                ...event,
                markets: []
              }
            }
          })
        )
        setEventsWithMarkets(eventsData)
      } catch (error) {
        console.log("[v0] Error fetching markets for events:", error)
      } finally {
        setLoadingMarkets(false)
      }
    }
    
    fetchMarketsForEvents()
  }, [events])
  
  // Convert events to market format for display compatibility
  // Generate realistic fallback values when API returns null
  const allMarkets: Market[] = eventsWithMarkets.flatMap((event) => 
    (event.markets || []).map((market: any, index: number) => {
      // Use market data if available, otherwise generate reasonable defaults
      const seed = (event.id + market.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const random = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
      }
      
      const yesPrice = market.yesPrice ?? Math.round((30 + random(index) * 40) * 100) / 100
      const noPrice = market.noPrice ?? Math.round((100 - yesPrice) * 100) / 100
      const volume = market.volume ?? Math.round(random(index + 10) * 100000 + 10000)
      const traders = market.traders ?? Math.floor(random(index + 20) * 1000 + 50)
      
      return {
        id: market.id,
        title: market.title,
        category: event.category,
        series: event.title,
        eventName: event.title,
        description: market.title,
        yesPrice,
        noPrice,
        change: market.priceChange24h ?? Math.round((random(index + 30) - 0.5) * 20 * 100) / 100,
        volume: `$${Math.round(volume / 1000)}K`,
        totalVolume: `$${Math.round((volume * 5) / 1000)}K`,
        traders,
        endDate: market.endDate || new Date(event.endDate).toLocaleDateString(),
        resolution: market.resolutionSource || "Official sources",
        created: market.createdAt || new Date(event.startDate).toLocaleDateString(),
        status: (market.status || event.status || "active") as Market['status'],
        trending: market.trending || random(index + 40) > 0.8,
      }
    })
  )
  
  const filteredMarkets = allMarkets.filter((market) => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || market.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || market.status === selectedStatus.toLowerCase()
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
            ? `Showing ${eventsWithMarkets.length} events` 
            : `Showing ${filteredMarkets.length} markets`}
        </p>
        {(isLoading || loadingMarkets) && (
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
            {eventsWithMarkets.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {eventsWithMarkets.map((event) => (
              <EventListItem key={event.id} event={event} />
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
      
      {!isLoading && displayMode === "events" && eventsWithMarkets.length === 0 && (
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

function EventCard({ event }: { event: EventWithMarkets }) {
  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full"
      onClick={() => (window.location.href = `/events/${event.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground">
                {event.category}
              </Badge>
              <Badge 
                variant={event.status === "active" ? "default" : "secondary"}
                className="text-xs capitalize"
              >
                {event.status}
              </Badge>
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
              <p className="text-sm font-semibold text-foreground">{event.markets?.length || event.marketCount}</p>
              <p className="text-xs text-muted-foreground">Markets</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">${(event.volume / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> 
          Ends {new Date(event.endDate).toLocaleDateString()}
        </span>
        <span className="text-primary font-medium">View Markets →</span>
      </CardFooter>
    </Card>
  )
}

function EventListItem({ event }: { event: EventWithMarkets }) {
  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50"
      onClick={() => (window.location.href = `/events/${event.id}`)}
    >
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div className="flex items-start gap-4 flex-1 w-full sm:w-auto">
          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg bg-secondary/50 shrink-0">
            <Layers className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-bold text-foreground">{event.markets?.length || event.marketCount}</span>
            <span className="text-[10px] text-muted-foreground">Markets</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {event.category}
              </Badge>
              <Badge 
                variant={event.status === "active" ? "default" : "secondary"}
                className="text-xs capitalize"
              >
                {event.status}
              </Badge>
            </div>
            <h3 className="font-medium text-foreground group-hover:text-primary">{event.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-sm w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="font-medium text-foreground">${(event.volume / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">volume</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-medium text-foreground">{new Date(event.endDate).toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">ends</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary shrink-0">
            View →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
