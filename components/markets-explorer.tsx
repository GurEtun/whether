"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Clock, Users, Flame, Grid3X3, List, Layers } from "lucide-react"
import Link from "next/link"

const allMarkets = [
  {
    id: "btc-150k",
    title: "Will BTC reach $150K by March 2026?",
    category: "Crypto",
    series: "Crypto Milestones 2026",
    yesPrice: 67,
    change: 5.2,
    volume: "$1.2M",
    traders: 4521,
    endDate: "Mar 31, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "fed-rate-cut",
    title: "Will the Fed cut rates by June 2026?",
    category: "Economics",
    series: "Fed Policy 2026",
    yesPrice: 72,
    change: 3.2,
    volume: "$892K",
    traders: 2341,
    endDate: "Jun 15, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "eth-flip",
    title: "Will ETH flip BTC market cap in 2026?",
    category: "Crypto",
    series: "Crypto Milestones 2026",
    yesPrice: 23,
    change: -3.1,
    volume: "$1.4M",
    traders: 4521,
    endDate: "Dec 31, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "ai-regulation",
    title: "Major AI regulation bill passed in 2026?",
    category: "Politics",
    series: "Tech Policy 2026",
    yesPrice: 58,
    change: 8.7,
    volume: "$567K",
    traders: 1892,
    endDate: "Dec 31, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "starship-orbital",
    title: "SpaceX Starship orbital refueling by 2026?",
    category: "Science & Tech",
    series: "Space Milestones",
    yesPrice: 45,
    change: 12.3,
    volume: "$678K",
    traders: 2134,
    endDate: "Dec 31, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "man-city-premier",
    title: "Manchester City wins Premier League 25/26?",
    category: "Sports",
    series: "Premier League 25/26",
    yesPrice: 34,
    change: -1.5,
    volume: "$1.1M",
    traders: 5678,
    endDate: "May 25, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "sol-500",
    title: "Will Solana reach $500 by Q2 2026?",
    category: "Crypto",
    series: "Crypto Milestones 2026",
    yesPrice: 41,
    change: 6.8,
    volume: "$432K",
    traders: 1876,
    endDate: "Jun 30, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "gpt5-release",
    title: "GPT-5 released by OpenAI before July 2026?",
    category: "Science & Tech",
    series: "AI Milestones",
    yesPrice: 78,
    change: 2.1,
    volume: "$234K",
    traders: 987,
    endDate: "Jul 1, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "super-bowl-chiefs",
    title: "Will the Chiefs win Super Bowl LXI?",
    category: "Sports",
    series: "NFL 2026",
    yesPrice: 28,
    change: -2.3,
    volume: "$823K",
    traders: 3456,
    endDate: "Feb 14, 2027",
    status: "active",
    trending: false,
  },
  {
    id: "oscars-dune3",
    title: "Will Dune 3 win Best Picture at 2027 Oscars?",
    category: "Entertainment",
    series: "Awards Season 2027",
    yesPrice: 15,
    change: 1.8,
    volume: "$156K",
    traders: 789,
    endDate: "Mar 15, 2027",
    status: "active",
    trending: false,
  },
]

const categories = ["All", "Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
const statuses = ["All", "Active", "Closed", "Determined", "Finalized"]

export function MarketsExplorer({ initialCategory }: { initialCategory?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const normalizedCategory = initialCategory
    ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
    : "All"
  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
          Discover prediction markets powered by DFlow infrastructure
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
      <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">Showing {filteredMarkets.length} markets</p>

      {/* Markets Grid/List */}
      {viewMode === "grid" ? (
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
      )}

      {filteredMarkets.length === 0 && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No markets found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MarketCard({ market }: { market: (typeof allMarkets)[0] }) {
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

function MarketListItem({ market }: { market: (typeof allMarkets)[0] }) {
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
