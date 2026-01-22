"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { usePriceHistory, type PriceHistoryPoint } from "@/hooks/use-market-data"

interface PriceChartProps {
  marketId: string
  title?: string
}

const timeframes = [
  { label: "1H", value: "1m" as const, limit: 60 },
  { label: "24H", value: "15m" as const, limit: 96 },
  { label: "7D", value: "1h" as const, limit: 168 },
  { label: "30D", value: "4h" as const, limit: 180 },
]

export function PriceChart({ marketId, title = "Price History" }: PriceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[1])
  const { prices, isLoading, error, refresh } = usePriceHistory(
    marketId,
    selectedTimeframe.value,
    selectedTimeframe.limit
  )

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)
    if (selectedTimeframe.value === "1m" || selectedTimeframe.value === "15m") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const formatTooltip = (value: number) => `${value.toFixed(1)}¢`

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: number
  }) => {
    if (!active || !payload || !payload.length) return null

    const date = new Date(label || 0)
    return (
      <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-2">
          {date.toLocaleString()}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.dataKey === "yesPrice" ? "Yes" : "No"}: {formatTooltip(entry.value)}
          </p>
        ))}
      </div>
    )
  }

  // Calculate min/max for better Y-axis scaling
  const yesMin = Math.min(...prices.map(p => p.yesPrice), 100)
  const yesMax = Math.max(...prices.map(p => p.yesPrice), 0)
  const yMin = Math.max(0, Math.floor(yesMin / 10) * 10 - 10)
  const yMax = Math.min(100, Math.ceil(yesMax / 10) * 10 + 10)

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.label}
                  variant={selectedTimeframe.label === tf.label ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setSelectedTimeframe(tf)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => refresh()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] sm:h-[280px]">
          {isLoading && prices.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Failed to load price data
            </div>
          ) : prices.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No price history available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={prices}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  tickFormatter={(v) => `${v}¢`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="yesPrice"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#yesGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#22c55e" }}
                />
                <Area
                  type="monotone"
                  dataKey="noPrice"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#noGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#ef4444" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Yes Price</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">No Price</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
