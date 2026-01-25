"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, Activity, BarChart3 } from "lucide-react"
import { useGlobalAnalytics } from "@/hooks/use-event-streaming"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsDashboard() {
  const { stats, isLoading } = useGlobalAnalytics()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "24h Volume",
      value: `$${(stats.totalVolume24h / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Total Trades",
      value: stats.totalTrades24h.toLocaleString(),
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Active Traders",
      value: stats.uniqueTraders.toLocaleString(),
      icon: Zap,
      color: "text-warning",
    },
    {
      title: "Volatility Avg",
      value: `${stats.averageVolatility}%`,
      icon: BarChart3,
      color: "text-info",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Market Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCategories.map((cat: any) => (
              <div key={cat.category} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">{cat.markets} markets</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${(cat.volume / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Market Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentEvents.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {event.type.replace("_", " ")}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{event.description}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round((Date.now() - event.timestamp) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
