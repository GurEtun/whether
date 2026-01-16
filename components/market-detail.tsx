"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Info,
  ArrowUpDown,
  Share2,
  Bookmark,
  ExternalLink,
  Settings2,
  Zap,
  Shield,
} from "lucide-react"
import type { Market } from "@/lib/markets-data"

export function MarketDetail({ market }: { market: Market }) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [slippage, setSlippage] = useState<"auto" | "custom">("auto")
  const [customSlippage, setCustomSlippage] = useState([0.5])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priorityFee, setPriorityFee] = useState<"normal" | "fast" | "instant">("normal")

  const yesPrice = market.yesPrice / 100
  const noPrice = market.noPrice / 100
  const selectedPrice = selectedOutcome === "yes" ? yesPrice : noPrice
  const shares = amount ? Number.parseFloat(amount) / selectedPrice : 0
  const potentialProfit = shares - Number.parseFloat(amount || "0")

  const priorityFees = {
    normal: "0.00001 SOL",
    fast: "0.0001 SOL",
    instant: "0.001 SOL",
  }

  return (
    <div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <div className="grid gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main Content - appears first on mobile */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          {/* Market Header */}
          <div className="mb-3 sm:mb-6">
            {/* Breadcrumb - Series > Event > Market */}
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto pb-1">
              <span className="hover:text-foreground cursor-pointer whitespace-nowrap">{market.series}</span>
              <span>/</span>
              <span className="hover:text-foreground cursor-pointer whitespace-nowrap">{market.eventName}</span>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge variant="secondary" className="text-xs">
                {market.category}
              </Badge>
              <MarketStatusBadge status={market.status} />
              <Badge variant="outline" className="text-muted-foreground text-xs">
                Binary
              </Badge>
            </div>

            <h1 className="mb-2 sm:mb-4 text-lg font-bold text-foreground sm:text-2xl lg:text-3xl text-balance leading-tight">
              {market.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3" />
                <span>Ends {market.endDate}</span>
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Users className="h-3 w-3" /> {market.traders.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <TrendingUp className="h-3 w-3" /> {market.totalVolume}
              </span>
            </div>
          </div>

          {/* Price Chart - prioritized on mobile */}
          <Card className="mb-3 sm:mb-6 border-border bg-card">
            <CardHeader className="pb-2 px-2 sm:px-6 pt-2 sm:pt-6">
              <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Yes Price</p>
                    <p className="text-xl sm:text-3xl font-bold text-success">{market.yesPrice}¢</p>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-sm font-medium ${
                      market.change >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}
                  >
                    {market.change >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    )}
                    {market.change >= 0 ? "+" : ""}
                    {market.change}% (24h)
                  </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10">
                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-10 sm:w-10">
                    <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pb-2 sm:pb-6">
              <div className="flex h-[150px] sm:h-[250px] lg:h-[300px] items-center justify-center rounded-lg bg-secondary/50">
                <div className="text-center text-muted-foreground px-4">
                  <TrendingUp className="mx-auto mb-2 h-6 w-6 sm:h-12 sm:w-12 opacity-50" />
                  <p className="text-xs sm:text-base">Price chart powered by DFlow</p>
                  <p className="text-[10px] sm:text-sm">Real-time data via WebSocket</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs - moved after chart */}
          <Tabs defaultValue="about" className="w-full">
            <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
              <TabsList className="w-full justify-start bg-secondary inline-flex min-w-full">
                <TabsTrigger value="about" className="text-xs px-2.5 sm:px-4">
                  About
                </TabsTrigger>
                <TabsTrigger value="orderbook" className="text-xs px-2.5 sm:px-4">
                  Order Book
                </TabsTrigger>
                <TabsTrigger value="trades" className="text-xs px-2.5 sm:px-4">
                  Trades
                </TabsTrigger>
                <TabsTrigger value="positions" className="text-xs px-2.5 sm:px-4">
                  Positions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about" className="mt-3 sm:mt-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-3 sm:pt-6 px-2 sm:px-6 pb-3 sm:pb-6">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Description</h3>
                  <p className="mb-3 sm:mb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {market.description}
                  </p>

                  <div className="grid gap-2 sm:gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Resolution Source</p>
                      <p className="text-xs sm:text-base font-medium text-foreground break-words">
                        {market.resolution}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Market Status</p>
                      <p className="text-xs sm:text-base font-medium text-foreground capitalize">{market.status}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Series</p>
                      <p className="text-xs sm:text-base font-medium text-foreground break-words">{market.series}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Created</p>
                      <p className="text-xs sm:text-base font-medium text-foreground">{market.created}</p>
                    </div>
                  </div>

                  {/* Market Lifecycle Info */}
                  <div className="mt-3 sm:mt-6 rounded-lg border border-border bg-secondary/30 p-2.5 sm:p-4">
                    <h4 className="flex items-center gap-2 text-xs sm:text-base font-medium text-foreground mb-2 sm:mb-3">
                      <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      Market Lifecycle
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-sm">
                      <div className="text-center">
                        <div className="h-1.5 sm:h-2 w-full rounded-full bg-success mb-1.5 sm:mb-2" />
                        <p className="text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <div className="h-1.5 sm:h-2 w-full rounded-full bg-muted mb-1.5 sm:mb-2" />
                        <p className="text-muted-foreground">Closed</p>
                      </div>
                      <div className="text-center">
                        <div className="h-1.5 sm:h-2 w-full rounded-full bg-muted mb-1.5 sm:mb-2" />
                        <p className="text-muted-foreground">Finalized</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orderbook" className="mt-3 sm:mt-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-3 sm:pt-6 px-2 sm:px-6 pb-3 sm:pb-6">
                  <OrderBook />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades" className="mt-3 sm:mt-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-3 sm:pt-6 px-2 sm:px-6 pb-3 sm:pb-6">
                  <RecentTrades />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positions" className="mt-3 sm:mt-4">
              <Card className="border-border bg-card">
                <CardContent className="flex h-32 sm:h-40 items-center justify-center pt-3 sm:pt-6 px-2 sm:px-6 pb-3 sm:pb-6 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Connect wallet to view your positions in this market
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 order-2 lg:order-last">
          <Card className="border-border bg-card lg:sticky lg:top-24">
            <CardHeader className="pb-2.5 sm:pb-4 px-2 sm:px-6 pt-2.5 sm:pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-lg">Trade</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-muted-foreground h-7 sm:h-8"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Settings2 className="h-3 w-3" />
                  {showAdvanced ? "Hide" : "Settings"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-4 px-2 sm:px-6 pb-2.5 sm:pb-6">
              {/* Outcome Selection */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <Button
                  variant={selectedOutcome === "yes" ? "default" : "outline"}
                  className={`h-12 sm:h-16 flex-col ${
                    selectedOutcome === "yes"
                      ? "border-success bg-success/10 text-success hover:bg-success/20"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedOutcome("yes")}
                >
                  <span className="text-sm sm:text-lg font-bold">Yes</span>
                  <span className="text-xs opacity-80">{market.yesPrice}¢</span>
                </Button>
                <Button
                  variant={selectedOutcome === "no" ? "default" : "outline"}
                  className={`h-12 sm:h-16 flex-col ${
                    selectedOutcome === "no"
                      ? "border-danger bg-danger/10 text-danger hover:bg-danger/20"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedOutcome("no")}
                >
                  <span className="text-sm sm:text-lg font-bold">No</span>
                  <span className="text-xs opacity-80">{market.noPrice}¢</span>
                </Button>
              </div>

              {/* Order Type */}
              <div className="flex rounded-lg bg-secondary p-0.5 sm:p-1">
                <button
                  className={`flex-1 rounded-md py-1.5 sm:py-2 text-xs font-medium transition-colors ${
                    orderType === "market"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </button>
                <button
                  className={`flex-1 rounded-md py-1.5 sm:py-2 text-xs font-medium transition-colors ${
                    orderType === "limit"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="mb-1.5 sm:mb-2 block text-xs text-muted-foreground">Amount (USDC)</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-secondary pr-14 text-sm sm:text-lg h-10 sm:h-12"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <Button variant="ghost" size="sm" className="h-6 sm:h-7 px-1.5 sm:px-2 text-xs text-primary">
                      MAX
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
                {["10", "25", "50", "100"].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    className="border-border text-[10px] sm:text-xs text-muted-foreground hover:text-foreground bg-transparent h-7 sm:h-8"
                    onClick={() => setAmount(val)}
                  >
                    ${val}
                  </Button>
                ))}
              </div>

              {/* Advanced Settings - DFlow specific */}
              {showAdvanced && (
                <div className="space-y-2.5 sm:space-y-4 rounded-lg border border-border bg-secondary/30 p-2 sm:p-4">
                  <h4 className="text-xs font-medium text-foreground">Trading Settings</h4>

                  {/* Slippage Tolerance */}
                  <div>
                    <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-[10px] sm:text-sm text-muted-foreground">
                      <span>Slippage Tolerance</span>
                      <span className="text-foreground">{slippage === "auto" ? "Auto" : `${customSlippage[0]}%`}</span>
                    </label>
                    <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Button
                        variant={slippage === "auto" ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 h-7 sm:h-8 text-[10px] sm:text-xs ${slippage === "auto" ? "bg-primary" : "bg-transparent"}`}
                        onClick={() => setSlippage("auto")}
                      >
                        Auto
                      </Button>
                      <Button
                        variant={slippage === "custom" ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 h-7 sm:h-8 text-[10px] sm:text-xs ${slippage === "custom" ? "bg-primary" : "bg-transparent"}`}
                        onClick={() => setSlippage("custom")}
                      >
                        Custom
                      </Button>
                    </div>
                    {slippage === "custom" && (
                      <Slider
                        value={customSlippage}
                        onValueChange={setCustomSlippage}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="mt-2"
                      />
                    )}
                  </div>

                  {/* Priority Fee */}
                  <div>
                    <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-sm text-muted-foreground">
                      Priority Fee
                    </label>
                    <div className="grid grid-cols-3 gap-1 sm:gap-2">
                      {(["normal", "fast", "instant"] as const).map((fee) => (
                        <Button
                          key={fee}
                          variant={priorityFee === fee ? "default" : "outline"}
                          size="sm"
                          className={`flex-col h-auto py-1.5 sm:py-2 text-[10px] sm:text-xs ${priorityFee === fee ? "bg-primary" : "bg-transparent"}`}
                          onClick={() => setPriorityFee(fee)}
                        >
                          <span className="capitalize">{fee}</span>
                          <span className="text-[9px] sm:text-[10px] opacity-70">{priorityFees[fee]}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              {amount && Number.parseFloat(amount) > 0 && (
                <div className="rounded-lg bg-secondary/50 p-2 sm:p-4 space-y-1.5 sm:space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shares</span>
                    <span className="font-medium text-foreground">{shares.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Price</span>
                    <span className="font-medium text-foreground">{(selectedPrice * 100).toFixed(1)}¢</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Execution</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      {Number.parseFloat(amount) > 500 ? "Async" : "Sync"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5 sm:pt-2">
                    <span className="text-muted-foreground">Potential Profit</span>
                    <span className="font-medium text-success">+${potentialProfit.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                className={`w-full h-10 sm:h-12 ${
                  selectedOutcome === "yes"
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-danger text-danger-foreground hover:bg-danger/90"
                }`}
                size="lg"
              >
                Buy {selectedOutcome === "yes" ? "Yes" : "No"}
              </Button>

              {/* Info */}
              <div className="flex items-start gap-1.5 sm:gap-2 rounded-lg bg-secondary/30 p-2 sm:p-3 text-[9px] sm:text-xs text-muted-foreground leading-relaxed">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                <p>Orders route through DFlow&apos;s Trade API for best execution. Settlement on Solana.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MarketStatusBadge({
  status,
}: { status: "initialized" | "active" | "inactive" | "closed" | "determined" | "finalized" }) {
  const statusConfig = {
    initialized: { color: "bg-muted text-muted-foreground", label: "Initialized" },
    active: { color: "bg-success/10 text-success", label: "Active", pulse: true },
    inactive: { color: "bg-warning/10 text-warning", label: "Inactive" },
    closed: { color: "bg-muted text-muted-foreground", label: "Closed" },
    determined: { color: "bg-primary/10 text-primary", label: "Determined" },
    finalized: { color: "bg-success/10 text-success", label: "Finalized" },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={`gap-1 border-transparent ${config.color}`}>
      {config.pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-success" />}
      {config.label}
    </Badge>
  )
}

function OrderBook() {
  const asks = [
    { price: 70, size: 1200, total: 1200 },
    { price: 69, size: 800, total: 2000 },
    { price: 68, size: 1500, total: 3500 },
    { price: 67, size: 2200, total: 5700 },
  ]

  const bids = [
    { price: 66, size: 1800, total: 1800 },
    { price: 65, size: 900, total: 2700 },
    { price: 64, size: 1100, total: 3800 },
    { price: 63, size: 2500, total: 6300 },
  ]

  const maxTotal = Math.max(...asks.map((a) => a.total), ...bids.map((b) => b.total))

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground px-1">
        <span>Price (¢)</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      {/* Asks */}
      <div className="space-y-0.5 sm:space-y-1">
        {[...asks].reverse().map((ask, i) => (
          <div key={i} className="relative flex items-center justify-between py-1 sm:py-1.5 text-xs sm:text-sm px-1">
            <div className="absolute inset-0 bg-danger/10" style={{ width: `${(ask.total / maxTotal) * 100}%` }} />
            <span className="relative text-danger font-medium">{ask.price}</span>
            <span className="relative text-muted-foreground">{ask.size.toLocaleString()}</span>
            <span className="relative text-foreground font-medium">{ask.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="flex items-center justify-center gap-2 border-y border-border py-2">
        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        <span className="text-xs sm:text-sm text-muted-foreground">Spread: 1¢</span>
      </div>

      {/* Bids */}
      <div className="space-y-0.5 sm:space-y-1">
        {bids.map((bid, i) => (
          <div key={i} className="relative flex items-center justify-between py-1 sm:py-1.5 text-xs sm:text-sm px-1">
            <div className="absolute inset-0 bg-success/10" style={{ width: `${(bid.total / maxTotal) * 100}%` }} />
            <span className="relative text-success font-medium">{bid.price}</span>
            <span className="relative text-muted-foreground">{bid.size.toLocaleString()}</span>
            <span className="relative text-foreground font-medium">{bid.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentTrades() {
  const trades = [
    { time: "2 min ago", side: "buy", outcome: "Yes", price: 67, amount: 150, execution: "sync" },
    { time: "5 min ago", side: "sell", outcome: "Yes", price: 66, amount: 200, execution: "sync" },
    { time: "8 min ago", side: "buy", outcome: "No", price: 34, amount: 750, execution: "async" },
    { time: "12 min ago", side: "buy", outcome: "Yes", price: 65, amount: 500, execution: "async" },
    { time: "15 min ago", side: "sell", outcome: "No", price: 35, amount: 300, execution: "sync" },
  ]

  return (
    <div className="space-y-2 sm:space-y-3">
      {trades.map((trade, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 p-2.5 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`h-2 w-2 rounded-full shrink-0 ${trade.side === "buy" ? "bg-success" : "bg-danger"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                {trade.side === "buy" ? "Bought" : "Sold"} {trade.outcome}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <span className="whitespace-nowrap">{trade.time}</span>
                <span className="text-primary">• {trade.execution}</span>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-xs sm:text-sm font-medium text-foreground">{trade.price}¢</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">${trade.amount}</p>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full bg-transparent h-9" size="sm">
        <span className="text-xs sm:text-sm">View All Trades</span>
        <ExternalLink className="ml-2 h-3 w-3" />
      </Button>
    </div>
  )
}
