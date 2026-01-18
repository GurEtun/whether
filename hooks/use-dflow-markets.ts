"use client"

import useSWR from "swr"
import { transformEventToMarket, type DFlowEvent, type DFlowMarket } from "@/lib/dflow-api"

// Fetcher function for SWR - uses our API route to avoid CORS issues
async function marketsFetcher(url: string) {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform events to markets
    const markets = (data.events || []).flatMap((event: DFlowEvent) => {
      if (event.markets && event.markets.length > 0) {
        return event.markets.map((market: DFlowMarket) => transformEventToMarket(event, market))
      }
      return [transformEventToMarket(event)]
    })
    
    return markets
  } catch (error) {
    console.error("Error fetching DFlow markets:", error)
    return []
  }
}

export function useDFlowMarkets(status?: "active" | "initialized") {
  // Build the API URL with status parameter
  const apiUrl = `/api/markets${status ? `?status=${status}` : ""}`
  
  const { data, error, isLoading, mutate } = useSWR(
    apiUrl,
    marketsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      fallbackData: [],
    }
  )

  return {
    markets: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  }
}

export function useDFlowMarket(marketId: string) {
  const { markets, isLoading, isError } = useDFlowMarkets("active")
  
  const market = markets.find((m: { id: string }) => m.id === marketId)
  
  return {
    market,
    isLoading,
    isError,
  }
}
