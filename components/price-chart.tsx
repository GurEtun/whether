"use client"

import { useState, useEffect } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { usePriceHistory, type PriceHistoryPoint } from "@/hooks/use-market-data"
import { ChartControls } from "@/components/chart-controls"

interface PriceChartProps {
  marketId: string
  title?: string
}

const resolutionConfig: Record<string, { limit: number; interval: number }> = {
  "15m": { limit: 60, interval: 15 * 60 * 1000 },
  "1h": { limit: 96, interval: 60 * 60 * 1000 },
  "4h": { limit: 168, interval: 4 * 60 * 60 * 1000 },
  "1d": { limit: 180, interval: 24 * 60 * 60 * 1000 },
  "1w": { limit: 52, interval: 7 * 24 * 60 * 60 * 1000 },
}

export function PriceChart({ marketId, title = "Price History" }: PriceChartProps) {
  const [resolution, setResolution] = useState("1h")
  const config = resolutionConfig[resolution] || resolutionConfig["1h"]
  const { prices, isLoading, error } = usePriceHistory(marketId, resolution, config.limit)

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)
    if (resolution === "15m") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    if (resolution === "1h") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const formatTooltip = (value: number) => {
    const val = Number(value)
    return isNaN(val) ? "0¢" : `${val.toFixed(2)}¢`
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: number
  }) => {
    if (!active || !payload || !payload.length) return null

    const date = new Date(label || 0)
    return (
      <div className="rounded-lg border border-border bg-background/95 backdrop-blur p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{date.toLocaleString()}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.dataKey === "yesPrice" ? "Yes" : "No"}: {formatTooltip(entry.value)}
          </p>
        ))}
      </div>
    )
  }

  // Calculate min/max for better Y-axis scaling
  const yesValues = prices.map((p) => Number(p.yesPrice) || 0).filter((v) => v > 0)
  const yesMin = yesValues.length > 0 ? Math.min(...yesValues, 100) : 0
  const yesMax = yesValues.length > 0 ? Math.max(...yesValues, 0) : 100
  const yMin = Math.max(0, Math.floor(yesMin / 10) * 10 - 10)
  const yMax = Math.min(100, Math.ceil(yesMax / 10) * 10 + 10)

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <ChartControls resolution={resolution} onResolutionChange={setResolution} isLoading={isLoading} />
      <CardContent className="pt-4">
        <div className="h-[300px] sm:h-[400px]">
          {isLoading && prices.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-border/50 bg-muted/20">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Unable to Load Chart</p>
                <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
              </div>
            </div>
          ) : prices.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-border/50 bg-muted/20">
              <p className="text-sm text-muted-foreground">No price history available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="hsl(var(--foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  tickFormatter={(v) => `${v}¢`}
                  stroke="hsl(var(--foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
                <Area
                  type="monotone"
                  dataKey="yesPrice"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#yesGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#22c55e" }}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="noPrice"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#noGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#ef4444" }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm" />
            <span className="text-foreground font-medium">Yes Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm" />
            <span className="text-foreground font-medium">No Price</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
