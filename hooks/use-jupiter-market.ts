"use client"

import useSWR from "swr"

const JUP_API_BASE = "/api/jup"

interface JupiterMarket {
  id: string
  eventId: string
  title: string
  description: string
  status: "active" | "resolved" | "closed"
  yesPrice: number
  noPrice: number
  volume24h: number
  totalVolume: number
  liquidity: number
  createdAt: string
  endDate: string
  resolutionSource: string
  category: string
}

interface JupiterPriceHistory {
  timestamp: number
  yesPrice: number
  noPrice: number
  volume: number
}

interface JupiterOrderbook {
  bids: Array<{ price: number; size: number }>
  asks: Array<{ price: number; size: number }>
  spread: number
  midPrice: number
}

interface JupiterMarketStats {
  volume24h: number
  volume7d: number
  trades24h: number
  uniqueTraders: number
  priceChange24h: number
  highPrice24h: number
  lowPrice24h: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch" }))
    throw new Error(error.error || "Failed to fetch")
  }
  return res.json()
}

/**
 * Fetch market details from Jupiter API
 */
export function useJupiterMarket(marketId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<JupiterMarket>(
    marketId ? `${JUP_API_BASE}/markets/${marketId}` : null,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds for live prices
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  )

  return {
    market: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Fetch price history for charts
 */
export function useJupiterPriceHistory(
  marketId: string | null,
  interval: "1h" | "4h" | "1d" | "1w" = "1h",
  limit: number = 100
) {
  const { data, error, isLoading, mutate } = useSWR<JupiterPriceHistory[]>(
    marketId
      ? `${JUP_API_BASE}/markets/${marketId}/price-history?interval=${interval}&limit=${limit}`
      : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    priceHistory: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Fetch orderbook data
 */
export function useJupiterOrderbook(marketId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<JupiterOrderbook>(
    marketId ? `${JUP_API_BASE}/markets/${marketId}/orderbook` : null,
    fetcher,
    {
      refreshInterval: 2000, // Refresh every 2 seconds for live orderbook
      revalidateOnFocus: true,
    }
  )

  return {
    orderbook: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Fetch market statistics
 */
export function useJupiterMarketStats(marketId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<JupiterMarketStats>(
    marketId ? `${JUP_API_BASE}/markets/${marketId}/stats` : null,
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Fetch all events/markets
 */
export function useJupiterEvents(category?: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  
  const { data, error, isLoading, mutate } = useSWR(
    `${JUP_API_BASE}/events${params.toString() ? `?${params}` : ""}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    events: data?.events || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
