"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
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
  MessageSquare,
  Sparkles,
  X,
  Send,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Bot,
  Loader2,
  RefreshCw,
} from "lucide-react"
import type { Market } from "@/lib/markets-data"
import { PriceChart } from "@/components/price-chart"
import { RecentTrades } from "@/components/recent-trades"
import { useLiveMarketData } from "@/hooks/use-market-data"

const priorityFees = {
  normal: "Normal Fee",
  fast: "Fast Fee",
  instant: "Instant Fee",
}

export function MarketDetail({ market }: { market: Market }) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [slippage, setSlippage] = useState<"auto" | "custom">("auto")
  const [customSlippage, setCustomSlippage] = useState([0.5])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priorityFee, setPriorityFee] = useState<"normal" | "fast" | "instant">("normal")

  // Live market data from Jupiter API
  const { data: liveData, isLoading: isLiveLoading } = useLiveMarketData(market.id)
  
  // Use live data if available, fallback to static data
  const currentYesPrice = liveData?.yesPrice ?? market.yesPrice
  const currentNoPrice = liveData?.noPrice ?? market.noPrice
  const currentChange = liveData?.priceChange24h ?? market.change
  const currentVolume = liveData?.totalVolume ? `$${(liveData.totalVolume / 1000000).toFixed(1)}M` : market.totalVolume

  const [aiInput, setAiInput] = useState("")
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [aiLoading, setAiLoading] = useState(false)
  const aiMessagesEndRef = useRef<HTMLDivElement>(null)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "CryptoTrader99",
      avatar: "/diverse-group-avatars.png",
      content: "I think this market is undervalued. The fundamentals suggest a higher probability.",
      time: "2 hours ago",
      likes: 12,
      replies: 3,
    },
    {
      id: 2,
      user: "MarketMaker",
      avatar: "/diverse-group-avatars.png",
      content: "Looking at historical data, similar events resolved around 65% Yes. Current price seems fair.",
      time: "4 hours ago",
      likes: 8,
      replies: 1,
    },
    {
      id: 3,
      user: "DataAnalyst",
      avatar: "/diverse-group-avatars.png",
      content: "The volume spike yesterday indicates strong institutional interest. Bullish signal.",
      time: "6 hours ago",
      likes: 24,
      replies: 7,
    },
  ])

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [shares, setShares] = useState(0)
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [potentialProfit, setPotentialProfit] = useState(0)

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [aiMessages])

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || aiLoading) return

    const userMessage = aiInput.trim()
    setAiInput("")
    setShowAIPanel(true)
    setAiMessages(prev => [...prev, { role: "user", content: userMessage }])
    setAiLoading(true)

    // Simple mock response - replace with real AI later
    setTimeout(() => {
      setAiMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I can help analyze **${market.title}**. The current Yes price is ${currentYesPrice}¢ (${currentYesPrice}% probability). Ask me about price trends, volume analysis, or resolution details.`
      }])
      setAiLoading(false)
    }, 1000)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    setComments((prev) => [
      {
        id: Date.now(),
        user: "You",
        avatar: "/abstract-geometric-shapes.png",
        content: newComment,
        time: "Just now",
        likes: 0,
        replies: 0,
      },
      ...prev,
    ])
    setNewComment("")
  }

  const quickPrompts = [
    "What's the current price analysis?",
    "How much volume is there?",
    "When does this market end?",
    "What's the latest news?",
  ]

  const [showAIPanel, setShowAIPanel] = useState(false)

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-8 overflow-x-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 min-w-0 max-w-full">
            {/* Market Header */}
            <div className="mb-3 sm:mb-6">
              {/* Breadcrumb */}
              <div className="mb-2 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground overflow-hidden">
                <span className="hover:text-foreground cursor-pointer truncate max-w-[120px] sm:max-w-none">
                  {market.series}
                </span>
                <span className="shrink-0">/</span>
                <span className="hover:text-foreground cursor-pointer truncate">{market.eventName}</span>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {market.category}
                </Badge>
                <MarketStatusBadge status={market.status} />
                <Badge variant="outline" className="text-muted-foreground text-[10px] sm:text-xs">
                  Binary
                </Badge>
              </div>

              <h1 className="mb-2 sm:mb-4 text-base sm:text-2xl lg:text-3xl font-bold text-foreground text-balance leading-tight">
                {market.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span className="truncate">Ends {market.endDate}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 shrink-0" /> {market.traders.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 shrink-0" /> {market.totalVolume}
                </span>
              </div>
            </div>

            {/* Price Chart */}
            <Card className="mb-3 sm:mb-6 border-border bg-card overflow-hidden">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
<div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground flex items-center gap-1">
                      Yes Price
                      {isLiveLoading && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-success">{currentYesPrice}¢</p>
                  </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-sm font-medium ${
currentChange >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}
                  >
                    {currentChange >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                    )}
                    {currentChange >= 0 ? "+" : ""}
                    {currentChange}%
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
<CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <PriceChart marketId={market.id} title="Price History" />
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full min-w-0">
              <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                <TabsList className="w-max sm:w-full justify-start bg-secondary">
                  <TabsTrigger value="about" className="text-[10px] sm:text-xs px-2 sm:px-4">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="orderbook" className="text-[10px] sm:text-xs px-2 sm:px-4">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="trades" className="text-[10px] sm:text-xs px-2 sm:px-4">
                    Trades
                  </TabsTrigger>
                  <TabsTrigger value="positions" className="text-[10px] sm:text-xs px-2 sm:px-4">
                    Positions
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="text-[10px] sm:text-xs px-2 sm:px-4 gap-1">
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Comments</span>
                    <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[9px]">
                      {comments.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="mt-3 sm:mt-4">
                <Card className="border-border bg-card overflow-hidden">
                  <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-foreground">Description</h3>
                    <p className="mb-3 sm:mb-6 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
                      {market.description}
                    </p>

                    <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Resolution Source</p>
                        <p className="text-[11px] sm:text-base font-medium text-foreground break-words">
                          {market.resolution}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Market Status</p>
                        <p className="text-[11px] sm:text-base font-medium text-foreground capitalize">
                          {market.status}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Series</p>
                        <p className="text-[11px] sm:text-base font-medium text-foreground break-words">
                          {market.series}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Created</p>
                        <p className="text-[11px] sm:text-base font-medium text-foreground">{market.created}</p>
                      </div>
                    </div>

                    {/* Market Lifecycle Info */}
                    <div className="mt-3 sm:mt-6 rounded-lg border border-border bg-secondary/30 p-2.5 sm:p-4">
                      <h4 className="flex items-center gap-2 text-[11px] sm:text-base font-medium text-foreground mb-2 sm:mb-3">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                        Market Lifecycle
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-[9px] sm:text-sm">
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
                <Card className="border-border bg-card overflow-hidden">
                  <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                    <OrderBook />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades" className="mt-3 sm:mt-4">
                <Card className="border-border bg-card overflow-hidden">
                  <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                    <RecentTrades />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="positions" className="mt-3 sm:mt-4">
                <Card className="border-border bg-card overflow-hidden">
                  <CardContent className="flex h-24 sm:h-32 items-center justify-center pt-3 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6 text-center">
                    <p className="text-[11px] sm:text-sm text-muted-foreground">Connect wallet to view positions</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-3 sm:mt-4">
                <Card className="border-border bg-card overflow-hidden">
                  <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
                    {/* Add comment form */}
                    <div className="mb-3 sm:mb-6">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2 bg-secondary/50 min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          size="sm"
                          className="gap-1 h-7 sm:h-8 text-[10px] sm:text-xs"
                        >
                          <Send className="h-3 w-3" />
                          Post
                        </Button>
                      </div>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-2.5 sm:space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg bg-secondary/30 p-2.5 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                              <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-[10px] sm:text-xs">{comment.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[11px] sm:text-sm font-medium text-foreground truncate">
                                  {comment.user}
                                </span>
                                <span className="text-[9px] sm:text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed mb-2">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-3 text-[9px] sm:text-xs text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                  <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  {comment.likes}
                                </button>
                                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                  <Reply className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  {comment.replies}
                                </button>
                                <button className="hover:text-foreground transition-colors ml-auto">
                                  <MoreHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Trade Card - shows below on mobile */}
          <div className="lg:col-span-1 min-w-0 max-w-full">
            <Card className="border-border bg-card lg:sticky lg:top-24 overflow-hidden">
              <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-lg">Trade</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-[10px] sm:text-xs text-muted-foreground h-6 sm:h-8 px-1"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Settings2 className="h-3 w-3" />
                    {showAdvanced ? "Hide" : "Settings"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
                {/* Outcome Selection */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <Button
                    variant={selectedOutcome === "yes" ? "default" : "outline"}
                    className={`h-11 sm:h-16 flex-col ${
                      selectedOutcome === "yes"
                        ? "border-success bg-success/10 text-success hover:bg-success/20"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedOutcome("yes")}
                  >
                    <span className="text-sm sm:text-lg font-bold">Yes</span>
                    <span className="text-[10px] sm:text-xs opacity-80">{currentYesPrice}¢</span>
                  </Button>
                  <Button
                    variant={selectedOutcome === "no" ? "default" : "outline"}
                    className={`h-11 sm:h-16 flex-col ${
                      selectedOutcome === "no"
                        ? "border-danger bg-danger/10 text-danger hover:bg-danger/20"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedOutcome("no")}
                  >
                    <span className="text-sm sm:text-lg font-bold">No</span>
                    <span className="text-[10px] sm:text-xs opacity-80">{currentNoPrice}¢</span>
                  </Button>
                </div>

                {/* Order Type */}
                <div className="flex rounded-lg bg-secondary p-0.5">
                  <button
                    className={`flex-1 rounded-md py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium transition-colors ${
                      orderType === "market"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setOrderType("market")}
                  >
                    Market
                  </button>
                  <button
                    className={`flex-1 rounded-md py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium transition-colors ${
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
                  <label className="mb-1 block text-[10px] sm:text-xs text-muted-foreground">Amount (USDC)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-secondary pr-12 text-sm sm:text-lg h-9 sm:h-12"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 sm:h-7 px-1.5 text-[9px] sm:text-xs text-primary"
                      >
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
                      className="border-border text-[9px] sm:text-xs text-muted-foreground hover:text-foreground bg-transparent h-6 sm:h-8"
                      onClick={() => setAmount(val)}
                    >
                      ${val}
                    </Button>
                  ))}
                </div>

                {/* Advanced Settings */}
                {showAdvanced && (
                  <div className="space-y-2 sm:space-y-4 rounded-lg border border-border bg-secondary/30 p-2 sm:p-4">
                    <h4 className="text-[10px] sm:text-xs font-medium text-foreground">Trading Settings</h4>

                    {/* Slippage */}
                    <div>
                      <label className="mb-1 flex items-center justify-between text-[9px] sm:text-sm text-muted-foreground">
                        <span>Slippage</span>
                        <span className="text-foreground">
                          {slippage === "auto" ? "Auto" : `${customSlippage[0]}%`}
                        </span>
                      </label>
                      <div className="flex gap-1 sm:gap-2 mb-1.5">
                        <Button
                          variant={slippage === "auto" ? "default" : "outline"}
                          size="sm"
                          className={`flex-1 h-6 sm:h-8 text-[9px] sm:text-xs ${slippage === "auto" ? "bg-primary" : "bg-transparent"}`}
                          onClick={() => setSlippage("auto")}
                        >
                          Auto
                        </Button>
                        <Button
                          variant={slippage === "custom" ? "default" : "outline"}
                          size="sm"
                          className={`flex-1 h-6 sm:h-8 text-[9px] sm:text-xs ${slippage === "custom" ? "bg-primary" : "bg-transparent"}`}
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
                      <label className="mb-1 block text-[9px] sm:text-sm text-muted-foreground">Priority Fee</label>
                      <div className="grid grid-cols-3 gap-1 sm:gap-2">
                        {(["normal", "fast", "instant"] as const).map((fee) => (
                          <Button
                            key={fee}
                            variant={priorityFee === fee ? "default" : "outline"}
                            size="sm"
                            className={`flex-col h-auto py-1 sm:py-2 text-[9px] sm:text-xs ${priorityFee === fee ? "bg-primary" : "bg-transparent"}`}
                            onClick={() => setPriorityFee(fee)}
                          >
                            <span className="capitalize">{fee}</span>
                            <span className="text-[8px] sm:text-[10px] opacity-70">{priorityFees[fee]}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                {amount && Number.parseFloat(amount) > 0 && (
                  <div className="rounded-lg bg-secondary/50 p-2 sm:p-4 space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
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
                        <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                        {Number.parseFloat(amount) > 500 ? "Async" : "Sync"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1 sm:pt-2">
                      <span className="text-muted-foreground">Potential Profit</span>
                      <span className="font-medium text-success">+${potentialProfit.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  className={`w-full h-9 sm:h-12 text-xs sm:text-sm ${
                    selectedOutcome === "yes"
                      ? "bg-success text-success-foreground hover:bg-success/90"
                      : "bg-danger text-danger-foreground hover:bg-danger/90"
                  }`}
                  size="lg"
                >
                  Buy {selectedOutcome === "yes" ? "Yes" : "No"}
                </Button>

                {/* Info */}
                <div className="flex items-start gap-1.5 rounded-lg bg-secondary/30 p-2 sm:p-3 text-[8px] sm:text-xs text-muted-foreground leading-relaxed">
                  <Info className="mt-0.5 h-3 w-3 shrink-0" />
                  <p>All trades execute on-chain with best execution. Settlement on Solana.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Prompt Bar - fixed at bottom center */}
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-xl">
        <div className="relative">
          <form onSubmit={(e) => { e.preventDefault(); if (aiInput.trim()) { setShowAIPanel(true); handleAISubmit(e); } }} className="relative">
            <div className="flex items-center gap-2 bg-card/95 backdrop-blur-md border border-border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transition-all">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask AI about this market..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground min-w-0"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-primary/10 shrink-0"
                disabled={!aiInput.trim()}
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* AI Panel - full screen on mobile - only render when shown or has been shown */}
      {showAIPanel && (
        <div
          className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto z-50 w-full sm:w-[360px] lg:w-[400px] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0"
        >
          <div className="flex flex-col h-full">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">AI Assistant</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{market.title.slice(0, 25)}...</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                onClick={() => setShowAIPanel(false)}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Market Context Banner */}
            <div className="px-3 py-2 sm:px-4 sm:py-3 bg-secondary/50 border-b border-border">
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[9px] sm:text-[10px]">
                    {market.category}
                  </Badge>
                  <span className="text-muted-foreground">Yes: {market.yesPrice}¢</span>
                  <span className={market.change >= 0 ? "text-success" : "text-danger"}>
                    {market.change >= 0 ? "+" : ""}
                    {market.change}%
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-5 sm:h-6 px-1.5 sm:px-2 text-[9px] sm:text-xs gap-1">
                  <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-primary/50 mb-3 sm:mb-4" />
                  <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Ask me anything</h4>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                    Real-time context about prices, volume, and activity.
                  </p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setAiInput(prompt)
                          setTimeout(() => {
                            const form = document.getElementById("ai-form") as HTMLFormElement
                            form?.requestSubmit()
                          }, 100)
                        }}
                        className="w-full text-left text-[11px] sm:text-sm p-2.5 sm:p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-foreground rounded-bl-md"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-border/50">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          <span className="text-[10px] sm:text-xs font-medium">AI Assistant</span>
                        </div>
                      )}
                      <div className="text-[11px] sm:text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content.split("\n").map((line, i) => {
                          const segments = line.split(/(\*\*[^*]+\*\*)/g)
                          return (
                            <p key={i} className={i > 0 ? "mt-1.5 sm:mt-2" : ""}>
                              {segments.map((segment, j) => {
                                if (segment.startsWith("**") && segment.endsWith("**")) {
                                  return (
                                    <strong key={j} className="font-semibold">
                                      {segment.slice(2, -2)}
                                    </strong>
                                  )
                                }
                                return <span key={j}>{segment}</span>
                              })}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                    <span className="text-[11px] sm:text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={aiMessagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t border-border bg-card">
              <form id="ai-form" onSubmit={handleAISubmit} className="flex gap-2">
                <Input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask about this market..."
                  className="flex-1 bg-secondary text-sm h-9 sm:h-10"
                  disabled={aiLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                  disabled={!aiInput.trim() || aiLoading}
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setShowAIPanel(false)} />
      )}
    </>
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
    <Badge variant="outline" className={`gap-1 border-transparent text-[10px] sm:text-xs ${config.color}`}>
      {config.pulse && <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-pulse rounded-full bg-success" />}
      {config.label}
    </Badge>
  )
}

function OrderBook() {
  const asks = [
    { price: 70, size: 1200, total: 1200 },
    { price: 69, size: 800, total: 2000 },
    { price: 68, size: 1500, total: 3500 },
    { price: 67, size: 600, total: 4100 },
  ]

  const bids = [
    { price: 66, size: 900, total: 900 },
    { price: 65, size: 1100, total: 2000 },
    { price: 64, size: 700, total: 2700 },
    { price: 63, size: 1300, total: 4000 },
  ]

  const maxTotal = Math.max(...asks.map((a) => a.total), ...bids.map((b) => b.total))

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-medium text-foreground">Order Book</h3>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" />
            Asks
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            Bids
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-[9px] sm:text-xs text-muted-foreground pb-1.5 sm:pb-2 border-b border-border">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks */}
      <div className="space-y-0.5 sm:space-y-1">
        {asks.map((ask, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[10px] sm:text-xs py-0.5 sm:py-1">
            <div
              className="absolute inset-0 bg-danger/10 rounded"
              style={{ width: `${(ask.total / maxTotal) * 100}%`, right: 0, left: "auto" }}
            />
            <span className="relative text-danger font-medium">{ask.price}¢</span>
            <span className="relative text-right text-foreground">{ask.size.toLocaleString()}</span>
            <span className="relative text-right text-muted-foreground">{ask.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="flex items-center justify-center gap-2 py-1.5 sm:py-2 border-y border-border">
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] sm:text-xs text-muted-foreground">Spread: 4¢ (5.7%)</span>
      </div>

      {/* Bids */}
      <div className="space-y-0.5 sm:space-y-1">
        {bids.map((bid, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[10px] sm:text-xs py-0.5 sm:py-1">
            <div
              className="absolute inset-0 bg-success/10 rounded"
              style={{ width: `${(bid.total / maxTotal) * 100}%`, right: 0, left: "auto" }}
            />
            <span className="relative text-success font-medium">{bid.price}¢</span>
            <span className="relative text-right text-foreground">{bid.size.toLocaleString()}</span>
            <span className="relative text-right text-muted-foreground">{bid.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
