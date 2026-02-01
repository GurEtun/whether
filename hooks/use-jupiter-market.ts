"use client"

import useSWR from "swr"
import type { EventsListResponse, TransformedMarket } from "@/lib/kalshi-types"
import { transformEventToMarket } from "@/lib/kalshi-types"
import { useMemo } from "react"

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

const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url)
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`)
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
 * Fetch all events/markets from Jupiter Kalshi API
 */
export function useJupiterEvents(options?: {
  category?: string
  filter?: "new" | "live" | "trending"
  sortBy?: "volume" | "beginAt"
  sortDirection?: "asc" | "desc"
}) {
  const params = new URLSearchParams()
  params.set("provider", "kalshi")
  params.set("includeMarkets", "true")
  
  if (options?.category && options.category !== "all") {
    params.set("category", options.category.toLowerCase())
  }
  if (options?.filter) params.set("filter", options.filter)
  if (options?.sortBy) params.set("sortBy", options.sortBy)
  if (options?.sortDirection) params.set("sortDirection", options.sortDirection)
  
  const { data, error, isLoading, mutate } = useSWR<EventsListResponse>(
    `${JUP_API_BASE}/events?${params.toString()}`,
    fetcher,
    {
      refreshInterval: 15000, // Refresh every 15 seconds for live data
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  // Transform events to market format for compatibility
  const markets: TransformedMarket[] = useMemo(() => {
    if (!data?.data) return []
    console.log("[v0] Events count:", data.data.length, "Pagination:", data.pagination)
    return data.data.map(transformEventToMarket)
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    isError: error,
    refresh: mutate,
    pagination: data?.pagination,
  }
}

/**
 * Search events by query
 */
export function useJupiterEventSearch(query: string | null) {
  const params = new URLSearchParams()
  if (query) {
    params.set("query", query)
    params.set("limit", "20")
  }
  
  const { data, error, isLoading } = useSWR(
    query ? `${JUP_API_BASE}/events/search?${params.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  )

  const markets: TransformedMarket[] = useMemo(() => {
    if (!data?.data) return []
    return data.data.map(transformEventToMarket)
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    isError: error,
  }
}
