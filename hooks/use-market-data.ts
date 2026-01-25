"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
})

export interface LiveMarketData {
  marketId: string
  yesPrice: number
  noPrice: number
  volume24h: number
  totalVolume: number
  lastTradeTime: number
  priceChange24h: number
}

export interface PriceHistoryPoint {
  timestamp: number
  yesPrice: string | number
  noPrice: string | number
  volume?: number
}

export interface Trade {
  id: string
  price: number
  size: number
  side: "buy" | "sell"
  outcome: "yes" | "no"
  timestamp: number
  trader?: string
}

export interface OrderbookData {
  bids: Array<{ price: number; size: number }>
  asks: Array<{ price: number; size: number }>
  spread: number
}

/**
 * Hook for fetching live market data with auto-refresh
 */
export function useLiveMarketData(marketId: string | undefined, refreshInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR<LiveMarketData>(
    marketId ? `/api/jup/markets/${marketId}/live` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching price history for charts
 */
export function usePriceHistory(
  marketId: string | undefined,
  resolution: "15m" | "1h" | "4h" | "1d" | "1w" = "1h",
  limit = 100
) {
  const { data, error, isLoading, mutate } = useSWR<{ prices: PriceHistoryPoint[] }>(
    marketId ? `/api/jup/markets/${marketId}/price-history?resolution=${resolution}&limit=${limit}` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  return {
    prices: data?.prices || [],
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching recent trades
 */
export function useRecentTrades(marketId: string | undefined, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<{ trades: Trade[] }>(
    marketId ? `/api/jup/markets/${marketId}/trades?limit=${limit}` : null,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  return {
    trades: data?.trades || [],
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching orderbook data
 */
export function useOrderbook(marketId: string | undefined, depth = 10) {
  const { data, error, isLoading, mutate } = useSWR<OrderbookData>(
    marketId ? `/api/jup/markets/${marketId}/orderbook?depth=${depth}` : null,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  return {
    orderbook: data,
    error,
    isLoading,
    refresh: mutate,
  }
}
