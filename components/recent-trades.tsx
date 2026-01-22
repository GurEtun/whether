"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useRecentTrades } from "@/hooks/use-market-data"

interface RecentTradesProps {
  marketId: string
}

export function RecentTrades({ marketId }: RecentTradesProps) {
  const { trades, isLoading, error } = useRecentTrades(marketId, 15)

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const formatSize = (size: number) => {
    if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`
    return `$${size.toFixed(0)}`
  }

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[280px] overflow-y-auto">
          {isLoading && trades.length === 0 ? (
            <div className="flex h-20 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
              Failed to load trades
            </div>
          ) : trades.length === 0 ? (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
              No recent trades
            </div>
          ) : (
            <div className="space-y-1">
              {trades.map((trade, index) => (
                <div
                  key={trade.id || index}
                  className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={trade.outcome === "yes" ? "default" : "secondary"}
                      className={`text-[10px] px-1.5 py-0 ${
                        trade.outcome === "yes"
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {trade.outcome.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-medium">
                      {trade.price.toFixed(1)}¢
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatSize(trade.size)}</span>
                    <span className="text-[10px]">{formatTime(trade.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
