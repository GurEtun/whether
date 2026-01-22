"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  History,
  Settings,
  BarChart3,
  CheckCircle2,
  Coins,
  RefreshCw,
} from "lucide-react"

const positions = [
  {
    id: 1,
    market: "Will BTC reach $150K by March 2026?",
    series: "Crypto Milestones 2026",
    outcome: "Yes",
    shares: 150,
    avgPrice: 62,
    currentPrice: 67,
    value: 100.5,
    pnl: 7.5,
    pnlPercent: 8.06,
    status: "active",
  },
  {
    id: 2,
    market: "Will ETH flip BTC market cap in 2026?",
    series: "Crypto Milestones 2026",
    outcome: "No",
    shares: 200,
    avgPrice: 75,
    currentPrice: 77,
    value: 154.0,
    pnl: 4.0,
    pnlPercent: 2.67,
    status: "active",
  },
  {
    id: 3,
    market: "Fed rate cut by June 2026?",
    series: "Fed Policy 2026",
    outcome: "Yes",
    shares: 80,
    avgPrice: 74,
    currentPrice: 72,
    value: 57.6,
    pnl: -1.6,
    pnlPercent: -2.7,
    status: "active",
  },
]

const redeemablePositions = [
  {
    id: 4,
    market: "2024 US Presidential Election Winner",
    outcome: "Republican",
    shares: 200,
    payout: 200,
    status: "determined",
  },
]

const recentActivity = [
  { type: "buy", market: "BTC $150K", outcome: "Yes", amount: 50, price: 67, time: "2 hours ago", execution: "sync" },
  { type: "sell", market: "ETH Flip", outcome: "Yes", amount: 100, price: 24, time: "1 day ago", execution: "async" },
  { type: "redeem", market: "2024 Election", outcome: "Republican", amount: 200, payout: 200, time: "3 days ago" },
]

export function Portfolio() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const totalValue = positions.reduce((acc, p) => acc + p.value, 0)
  const totalPnl = positions.reduce((acc, p) => acc + p.pnl, 0)
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100
  const redeemableValue = redeemablePositions.reduce((acc, p) => acc + p.payout, 0)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Portfolio</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Track your positions and on-chain token accounts
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 bg-transparent text-xs sm:text-sm"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="border-border bg-card">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
              </div>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                </p>
              </div>
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${
                  totalPnl >= 0 ? "bg-success/10" : "bg-danger/10"
                }`}
              >
                {totalPnl >= 0 ? (
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-danger" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Return %</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalPnlPercent >= 0 ? "text-success" : "text-danger"}`}>
                  {totalPnlPercent >= 0 ? "+" : ""}
                  {totalPnlPercent.toFixed(2)}%
                </p>
              </div>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Positions</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{positions.length}</p>
              </div>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redeemable */}
        <Card className="border-border bg-card border-success/30 col-span-2 lg:col-span-1">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Redeemable</p>
                <p className="text-lg sm:text-2xl font-bold text-success">${redeemableValue.toFixed(2)}</p>
              </div>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success/10">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redeemable Alert */}
      {redeemablePositions.length > 0 && (
        <Card className="mb-4 sm:mb-6 border-success/30 bg-success/5">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-foreground">
                  You have {redeemablePositions.length} position{redeemablePositions.length > 1 ? "s" : ""} ready to
                  redeem
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Claim ${redeemableValue.toFixed(2)} in winning tokens
                </p>
              </div>
            </div>
            <Button className="w-full sm:w-auto bg-success text-success-foreground hover:bg-success/90 text-xs sm:text-sm">
              Redeem All
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="positions" className="w-full">
        <div className="overflow-x-auto mb-3 sm:mb-4">
          <TabsList className="bg-secondary inline-flex w-full sm:w-auto">
            <TabsTrigger value="positions" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Active </span>Positions
            </TabsTrigger>
            <TabsTrigger value="redeemable" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Coins className="h-3 w-3 sm:h-4 sm:w-4" /> Redeemable
              {redeemablePositions.length > 0 && (
                <Badge className="bg-success text-success-foreground ml-1 text-[10px] sm:text-xs h-4 sm:h-5 px-1 sm:px-2">
                  {redeemablePositions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <History className="h-3 w-3 sm:h-4 sm:w-4" /> Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" /> Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/30 p-3 sm:p-4"
                  >
                    <div className="flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{position.series}</p>
                      <div className="mb-1 sm:mb-2 flex flex-wrap items-center gap-2">
                        <Badge
                          className={`text-[10px] sm:text-xs ${
                            position.outcome === "Yes" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                          }`}
                        >
                          {position.outcome}
                        </Badge>
                        <span className="text-[10px] sm:text-sm text-muted-foreground">
                          {position.shares} shares @ {position.avgPrice}¢
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-medium text-foreground">{position.market}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6">
                      <div className="text-center sm:text-right">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Current Price</p>
                        <p className="text-xs sm:text-base font-medium text-foreground">{position.currentPrice}¢</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">Value</p>
                        <p className="text-xs sm:text-base font-medium text-foreground">${position.value.toFixed(2)}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">P&L</p>
                        <p
                          className={`text-xs sm:text-base font-medium ${position.pnl >= 0 ? "text-success" : "text-danger"}`}
                        >
                          {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto gap-1 bg-transparent text-xs sm:text-sm"
                    >
                      Trade <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeemable">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Redeemable Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {redeemablePositions.length > 0 ? (
                <div className="space-y-4">
                  {redeemablePositions.map((position) => (
                    <div
                      key={position.id}
                      className="flex flex-col gap-4 rounded-lg border border-success/30 bg-success/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-success/10 text-success">{position.outcome}</Badge>
                            <Badge variant="outline" className="text-success border-success/30">
                              Won
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground">{position.market}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Shares</p>
                          <p className="font-medium text-foreground">{position.shares}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Payout</p>
                          <p className="font-medium text-success">${position.payout.toFixed(2)}</p>
                        </div>
                        <Button className="bg-success text-success-foreground hover:bg-success/90">Redeem</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No redeemable positions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          activity.type === "buy"
                            ? "bg-success/10"
                            : activity.type === "sell"
                              ? "bg-danger/10"
                              : "bg-primary/10"
                        }`}
                      >
                        {activity.type === "buy" && <TrendingUp className="h-5 w-5 text-success" />}
                        {activity.type === "sell" && <TrendingDown className="h-5 w-5 text-danger" />}
                        {activity.type === "redeem" && <Coins className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.type === "buy" && `Bought ${activity.outcome}`}
                          {activity.type === "sell" && `Sold ${activity.outcome}`}
                          {activity.type === "redeem" && `Redeemed ${activity.outcome}`}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {activity.market}
                          {activity.execution && (
                            <Badge variant="outline" className="text-xs">
                              {activity.execution}
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {activity.type === "redeem"
                          ? `+$${activity.payout}`
                          : `$${activity.amount} @ ${activity.price}¢`}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Trading Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Default Slippage</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Configure your default slippage tolerance for trades
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="bg-primary">
                    Auto
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    0.5%
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    1%
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Custom
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Default Priority Fee</h4>
                <p className="text-sm text-muted-foreground mb-3">Set your preferred transaction priority for Solana</p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="bg-primary">
                    Normal
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Fast
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Instant
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Execution Preference</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose between sync (atomic) and async (multi-tx) execution
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="bg-primary">
                    Auto
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Prefer Sync
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Prefer Async
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
