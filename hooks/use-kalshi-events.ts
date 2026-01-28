"use client"

import useSWR from "swr"
import { useCallback, useMemo } from "react"
import type {
  KalshiEvent,
  EventsListResponse,
  EventsSearchResponse,
  SingleEventResponse,
  EventCategory,
  EventFilter,
  TransformedMarket,
} from "@/lib/kalshi-types"
import { transformEventToMarket } from "@/lib/kalshi-types"

const API_BASE = "/api/jup"

/**
 * Generic fetcher with error handling
 */
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch" }))
    throw new Error(error.error || `HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Query parameters for events list
 */
export interface UseKalshiEventsParams {
  category?: EventCategory
  filter?: EventFilter
  sortBy?: "volume" | "beginAt"
  sortDirection?: "asc" | "desc"
  start?: number
  end?: number
  includeMarkets?: boolean
  enabled?: boolean
}

/**
 * Hook to fetch all Kalshi events with filtering
 */
export function useKalshiEvents(params: UseKalshiEventsParams = {}) {
  const {
    category,
    filter,
    sortBy,
    sortDirection,
    start,
    end,
    includeMarkets = true,
    enabled = true,
  } = params

  // Build URL with query params
  const url = useMemo(() => {
    if (!enabled) return null
    
    const searchParams = new URLSearchParams()
    if (category && category !== "all") searchParams.set("category", category)
    if (filter) searchParams.set("filter", filter)
    if (sortBy) searchParams.set("sortBy", sortBy)
    if (sortDirection) searchParams.set("sortDirection", sortDirection)
    if (start !== undefined) searchParams.set("start", start.toString())
    if (end !== undefined) searchParams.set("end", end.toString())
    searchParams.set("includeMarkets", includeMarkets.toString())
    
    const queryString = searchParams.toString()
    return `${API_BASE}/events${queryString ? `?${queryString}` : ""}`
  }, [category, filter, sortBy, sortDirection, start, end, includeMarkets, enabled])

  const { data, error, isLoading, isValidating, mutate } = useSWR<EventsListResponse>(
    url,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
    }
  )

  // Transform events to UI-friendly format
  const markets = useMemo(() => {
    if (!data?.data) return []
    return data.data.map((event) => transformEventToMarket(event))
  }, [data])

  return {
    events: data?.data || [],
    markets,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  }
}

/**
 * Hook to fetch trending Kalshi events
 */
export function useKalshiTrendingEvents(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<EventsListResponse>(
    `${API_BASE}/events?filter=trending&end=${limit}&includeMarkets=true`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  const markets = useMemo(() => {
    if (!data?.data) return []
    return data.data.map((event) => transformEventToMarket(event))
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook to fetch live Kalshi events
 */
export function useKalshiLiveEvents(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<EventsListResponse>(
    `${API_BASE}/events?filter=live&end=${limit}&includeMarkets=true`,
    fetcher,
    {
      refreshInterval: 15000, // More frequent for live events
      revalidateOnFocus: true,
      dedupingInterval: 3000,
    }
  )

  const markets = useMemo(() => {
    if (!data?.data) return []
    return data.data.map((event) => transformEventToMarket(event))
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook to fetch new Kalshi events
 */
export function useKalshiNewEvents(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<EventsListResponse>(
    `${API_BASE}/events?filter=new&end=${limit}&includeMarkets=true`,
    fetcher,
    {
      refreshInterval: 60000, // Less frequent for new events
      revalidateOnFocus: true,
    }
  )

  const markets = useMemo(() => {
    if (!data?.data) return []
    return data.data.map((event) => transformEventToMarket(event))
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook to search Kalshi events
 */
export function useKalshiSearch(query: string, limit = 20) {
  const url = query.trim()
    ? `${API_BASE}/events/search?query=${encodeURIComponent(query.trim())}&limit=${limit}`
    : null

  const { data, error, isLoading, mutate } = useSWR<EventsSearchResponse>(
    url,
    fetcher,
    {
      refreshInterval: 0, // Don't auto-refresh search results
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  )

  const markets = useMemo(() => {
    if (!data?.data) return []
    return data.data.map((event) => transformEventToMarket(event))
  }, [data])

  return {
    events: data?.data || [],
    markets,
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook to fetch a single Kalshi event
 */
export function useKalshiEvent(eventId: string | null, includeMarkets = true) {
  const url = eventId
    ? `${API_BASE}/events/${encodeURIComponent(eventId)}?includeMarkets=${includeMarkets}`
    : null

  const { data, error, isLoading, mutate } = useSWR<SingleEventResponse>(
    url,
    fetcher,
    {
      refreshInterval: 10000, // More frequent for single event view
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  )

  // Transform to UI-friendly market format
  const market = useMemo(() => {
    if (!data) return null
    return transformEventToMarket(data)
  }, [data])

  // Get all markets from the event
  const allMarkets = useMemo((): TransformedMarket[] => {
    if (!data?.markets) return []
    return data.markets.map((_, index) => transformEventToMarket(data, index))
  }, [data])

  return {
    event: data,
    market,
    allMarkets,
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook for events by category with pagination support
 */
export function useKalshiEventsByCategory(
  category: EventCategory,
  pageSize = 20
) {
  const { events, markets, pagination, isLoading, error, refresh } = useKalshiEvents({
    category,
    end: pageSize,
    includeMarkets: true,
  })

  const loadMore = useCallback(async () => {
    if (!pagination?.hasNext) return
    
    const nextStart = (pagination.end || 0)
    const url = `${API_BASE}/events?category=${category}&start=${nextStart}&end=${nextStart + pageSize}&includeMarkets=true`
    
    const response = await fetcher<EventsListResponse>(url)
    return response.data || []
  }, [category, pageSize, pagination])

  return {
    events,
    markets,
    pagination,
    isLoading,
    error,
    refresh,
    loadMore,
    hasMore: pagination?.hasNext || false,
  }
}

/**
 * Combined hook for markets explorer with all filtering options
 */
export function useMarketsExplorer(initialParams: UseKalshiEventsParams = {}) {
  const [params, setParams] = useSWR<UseKalshiEventsParams>(
    "markets-explorer-params",
    null,
    {
      fallbackData: initialParams,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const currentParams = params.data || initialParams

  const { events, markets, pagination, isLoading, error, refresh } = useKalshiEvents(currentParams)

  const updateParams = useCallback((newParams: Partial<UseKalshiEventsParams>) => {
    params.mutate({ ...currentParams, ...newParams })
  }, [currentParams, params])

  const setCategory = useCallback((category: EventCategory) => {
    updateParams({ category, start: 0 })
  }, [updateParams])

  const setFilter = useCallback((filter: EventFilter | undefined) => {
    updateParams({ filter, start: 0 })
  }, [updateParams])

  const setSortBy = useCallback((sortBy: "volume" | "beginAt") => {
    updateParams({ sortBy })
  }, [updateParams])

  return {
    events,
    markets,
    pagination,
    isLoading,
    error,
    refresh,
    params: currentParams,
    setCategory,
    setFilter,
    setSortBy,
    updateParams,
  }
}
