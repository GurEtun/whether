'use client';

import React from "react"

import useSWR from "swr"

interface MarketEvent {
  id: string
  marketId: string
  type: "price_update" | "trade" | "liquidity" | "volume_spike"
  timestamp: number
  data: Record<string, any>
}

interface EventMetrics {
  volume24h: number
  tradeCount24h: number
  uniqueTraders24h: number
  avgPrice: number
  priceHigh24h: number
  priceLow24h: number
  volatility: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMarketEvents(marketId: string, limit: number = 50) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/jup/markets/${marketId}/events?limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000,
    }
  )

  return {
    events: (data?.events as MarketEvent[]) || [],
    isLoading,
    error,
    mutate,
  }
}

export function useMarketAnalytics(marketId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/analytics/markets/${marketId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      focusThrottleInterval: 10000,
    }
  )

  return {
    metrics: (data?.metrics as EventMetrics) || null,
    isLoading,
    error,
    mutate,
  }
}

export function useGlobalAnalytics() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/analytics/global",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      focusThrottleInterval: 30000,
    }
  )

  return {
    stats: data || null,
    isLoading,
    error,
    mutate,
  }
}

export function useEventStream(eventType?: string) {
  const [events, setEvents] = React.useState<MarketEvent[]>([])
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    // Simple polling-based event stream for now
    // In production, this would be a WebSocket connection
    const interval = setInterval(async () => {
      try {
        const url = eventType 
          ? `/api/analytics/events?type=${eventType}`
          : "/api/analytics/events"
        
        const response = await fetch(url)
        const data = await response.json()
        setEvents(data.events || [])
        setIsConnected(true)
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setIsConnected(false)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [eventType])

  return { events, isConnected }
}
