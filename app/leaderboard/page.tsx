import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Trophy, Medal, Award, ArrowUp, ArrowDown } from "lucide-react"

export default function LeaderboardPage() {
  const topTraders = [
    {
      rank: 1,
      username: "CryptoWhale",
      avatar: "CW",
      totalVolume: "$2.4M",
      profit: "+$145K",
      winRate: "68%",
      trades: 1247,
      change: 0,
    },
    {
      rank: 2,
      username: "MarketMaven",
      avatar: "MM",
      totalVolume: "$1.8M",
      profit: "+$98K",
      winRate: "64%",
      trades: 892,
      change: 2,
    },
    {
      rank: 3,
      username: "PredictionPro",
      avatar: "PP",
      totalVolume: "$1.5M",
      profit: "+$87K",
      winRate: "72%",
      trades: 654,
      change: -1,
    },
    {
      rank: 4,
      username: "TradeGuru",
      avatar: "TG",
      totalVolume: "$1.2M",
      profit: "+$76K",
      winRate: "61%",
      trades: 1089,
      change: 1,
    },
    {
      rank: 5,
      username: "BullishBob",
      avatar: "BB",
      totalVolume: "$980K",
      profit: "+$64K",
      winRate: "59%",
      trades: 743,
      change: -2,
    },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers in prediction markets</p>
        </div>

        <Tabs defaultValue="all-time" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full">
              <TabsTrigger value="all-time" className="flex-1 sm:flex-none">
                All Time
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1 sm:flex-none">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1 sm:flex-none">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex-1 sm:flex-none">
                Daily
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all-time" className="space-y-4">
            {/* Stats Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Volume</p>
                    <p className="text-lg font-bold text-foreground">$12.4M</p>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Trophy className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Traders</p>
                    <p className="text-lg font-bold text-foreground">1,247</p>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Medal className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Win Rate</p>
                    <p className="text-lg font-bold text-foreground">64.8%</p>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Award className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                    <p className="text-lg font-bold text-foreground">8,945</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Leaderboard Table */}
            <Card className="border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="p-4 text-xs font-medium text-muted-foreground">Rank</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Trader</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Volume</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Profit</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Win Rate</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Trades</th>
                      <th className="p-4 text-xs font-medium text-muted-foreground">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTraders.map((trader) => (
                      <tr key={trader.rank} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{trader.rank}</span>
                            {getRankIcon(trader.rank)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border bg-primary/10">
                              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                                {trader.avatar}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{trader.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-foreground">{trader.totalVolume}</td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-green-500">{trader.profit}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                            {trader.winRate}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{trader.trades}</td>
                        <td className="p-4">
                          {trader.change > 0 && (
                            <div className="flex items-center gap-1 text-green-500">
                              <ArrowUp className="h-4 w-4" />
                              <span className="text-sm font-medium">{trader.change}</span>
                            </div>
                          )}
                          {trader.change < 0 && (
                            <div className="flex items-center gap-1 text-red-500">
                              <ArrowDown className="h-4 w-4" />
                              <span className="text-sm font-medium">{Math.abs(trader.change)}</span>
                            </div>
                          )}
                          {trader.change === 0 && <span className="text-sm text-muted-foreground">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card className="border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">Monthly leaderboard data will be displayed here</p>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card className="border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">Weekly leaderboard data will be displayed here</p>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card className="border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">Daily leaderboard data will be displayed here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
