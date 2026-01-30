"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Clock, Users, Flame, Grid3X3, List, Layers, RefreshCw, Wifi, WifiOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useJupiterEvents, useJupiterEventSearch } from "@/hooks/use-jupiter-market"
import type { TransformedMarket } from "@/lib/kalshi-types"

// Categories from Kalshi API
const categories = ["All", "Crypto", "Politics", "Sports", "Economics", "Science", "Entertainment", "Culture", "Climate", "Finance"]
const statuses = ["All", "Active", "Closed", "Determined", "Finalized"]

export function MarketsExplorer({ initialCategory }: { initialCategory?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const normalizedCategory = initialCategory
    ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
    : "All"
  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState<"trending" | "volume" | "new" | "ending">("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Map sort options to API parameters
  const apiFilter = useMemo(() => {
    if (sortBy === "trending") return "trending" as const
    if (sortBy === "new") return "new" as const
    return undefined
  }, [sortBy])

  const apiSortBy = useMemo(() => {
    if (sortBy === "volume") return "volume" as const
    if (sortBy === "ending") return "beginAt" as const
    return undefined
  }, [sortBy])

  // Fetch real data from Jupiter Kalshi API
  const { 
    markets: apiMarkets, 
    isLoading, 
    isError, 
    refresh 
  } = useJupiterEvents({
    category: selectedCategory.toLowerCase() === "all" ? undefined : selectedCategory.toLowerCase(),
    filter: apiFilter,
    sortBy: apiSortBy,
    sortDirection: sortBy === "ending" ? "asc" : "desc",
  })

  // Search results (only when user is searching)
  const { markets: searchMarkets, isLoading: isSearching } = useJupiterEventSearch(
    debouncedSearch.length >= 2 ? debouncedSearch : null
  )

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    // Debounce the actual search
    const timer = setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Use search results if searching, otherwise use API results
  const marketsToShow = useMemo(() => {
    const markets = debouncedSearch.length >= 2 ? searchMarkets : apiMarkets
    
    // Client-side filtering for status
    return markets.filter((market) => {
      const matchesStatus = selectedStatus === "All" || market.status?.toLowerCase() === selectedStatus.toLowerCase()
      return matchesStatus
    })
  }, [apiMarkets, searchMarkets, debouncedSearch, selectedStatus])

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
              {selectedCategory === "All" ? "Explore Markets" : `${selectedCategory} Markets`}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Live prediction markets from Kalshi via Jupiter
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs ${
              isError ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
            }`}>
              {isError ? (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">Live</span>
                </>
              )}
            </div>
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refresh()}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-secondary pl-9 w-full"
          />
          {isSearching && (
            <RefreshCw className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
          )}
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
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isLoading ? "Loading markets..." : `Showing ${marketsToShow.length} markets`}
        </p>
        {debouncedSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setDebouncedSearch("")
            }}
            className="text-xs"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && marketsToShow.length === 0 && (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-full bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-10 w-24 bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded mt-4" />
              </CardContent>
              <CardFooter className="border-t border-border pt-3">
                <div className="h-4 w-full bg-muted rounded" />
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
            <p className="text-danger font-medium">Failed to load markets</p>
            <p className="text-sm text-muted-foreground mb-4">Could not connect to Jupiter API</p>
            <Button onClick={() => refresh()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* Markets Grid/List */}
      {!isLoading && !isError && viewMode === "grid" && (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {marketsToShow.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
      
      {!isLoading && !isError && viewMode === "list" && (
        <div className="space-y-2 sm:space-y-3">
          {marketsToShow.map((market) => (
            <MarketListItem key={market.id} market={market} />
          ))}
        </div>
      )}

      {!isLoading && !isError && marketsToShow.length === 0 && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No markets found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MarketCard({ market }: { market: TransformedMarket }) {
  const isPositive = market.change >= 0
  const yesPercent = Math.round(market.yesPrice)

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
                <Badge variant="secondary" className="bg-secondary text-xs font-normal text-muted-foreground capitalize">
                  {market.category}
                </Badge>
              </Link>
              {market.trending && (
                <Badge className="gap-1 bg-warning/10 text-warning">
                  <Flame className="h-3 w-3" /> Hot
                </Badge>
              )}
              {market.status === "active" && (
                <Badge className="gap-1 bg-success/10 text-success text-xs">
                  Live
                </Badge>
              )}
            </div>
            {market.series && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" /> {market.series}
              </p>
            )}
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
          <div className="h-2 rounded-r-full bg-danger transition-all" style={{ width: `${100 - yesPercent}%` }} />
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
  )
}

function MarketListItem({ market }: { market: TransformedMarket }) {
  const isPositive = market.change >= 0
  const yesPercent = Math.round(market.yesPrice)

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50"
      onClick={() => (window.location.href = `/markets/${market.id}`)}
    >
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="flex flex-col items-center justify-center w-16 shrink-0">
            <span className="text-2xl font-bold text-success">{yesPercent}¢</span>
            <span className="text-xs text-muted-foreground">Yes</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/markets/category/${market.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:opacity-80 transition-opacity"
              >
                <Badge variant="secondary" className="text-xs capitalize">
                  {market.category}
                </Badge>
              </Link>
              {market.trending && (
                <Badge className="gap-1 bg-warning/10 text-warning text-xs">
                  <Flame className="h-3 w-3" />
                </Badge>
              )}
              {market.status === "active" && (
                <Badge className="gap-1 bg-success/10 text-success text-xs">
                  Live
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-foreground group-hover:text-primary">{market.title}</h3>
            {market.series && (
              <p className="text-xs text-muted-foreground mt-1">{market.series}</p>
            )}
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
            {market.change.toFixed(1)}%
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
