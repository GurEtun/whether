/**
 * Kalshi Client Library
 * Handles all communication with Jupiter Prediction Market API for Kalshi events
 */

import type {
  KalshiEvent,
  EventsListResponse,
  EventsSearchResponse,
  SingleEventResponse,
  EventCategory,
  EventFilter,
  EventSortBy,
  SortDirection,
  TransformedMarket,
  transformEventToMarket,
  transformEventMarkets,
} from "./kalshi-types"

const API_BASE = "/api/jup"

// Re-export transform functions
export { transformEventToMarket, transformEventMarkets } from "./kalshi-types"

/**
 * Fetch options for API calls
 */
interface FetchOptions {
  signal?: AbortSignal
  revalidate?: number
}

/**
 * Error response type
 */
export class KalshiApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message)
    this.name = "KalshiApiError"
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    signal: options?.signal,
  })

  if (!response.ok) {
    let details: unknown
    try {
      details = await response.json()
    } catch {
      details = await response.text()
    }
    throw new KalshiApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      details
    )
  }

  return response.json()
}

/**
 * Event list query parameters
 */
export interface EventsQueryParams {
  category?: EventCategory
  subcategory?: string
  filter?: EventFilter
  sortBy?: EventSortBy
  sortDirection?: SortDirection
  start?: number
  end?: number
  includeMarkets?: boolean
}

/**
 * Fetch all Kalshi events with optional filters
 */
export async function fetchKalshiEvents(
  params: EventsQueryParams = {},
  options?: FetchOptions
): Promise<EventsListResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category)
  }
  if (params.subcategory) {
    searchParams.set("subcategory", params.subcategory)
  }
  if (params.filter) {
    searchParams.set("filter", params.filter)
  }
  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy)
  }
  if (params.sortDirection) {
    searchParams.set("sortDirection", params.sortDirection)
  }
  if (params.start !== undefined) {
    searchParams.set("start", params.start.toString())
  }
  if (params.end !== undefined) {
    searchParams.set("end", params.end.toString())
  }
  if (params.includeMarkets !== undefined) {
    searchParams.set("includeMarkets", params.includeMarkets.toString())
  }

  const queryString = searchParams.toString()
  const endpoint = `/events${queryString ? `?${queryString}` : ""}`
  
  return apiFetch<EventsListResponse>(endpoint, options)
}

/**
 * Fetch trending Kalshi events
 */
export async function fetchTrendingEvents(
  limit = 10,
  options?: FetchOptions
): Promise<KalshiEvent[]> {
  const response = await fetchKalshiEvents(
    { filter: "trending", end: limit, includeMarkets: true },
    options
  )
  return response.data || []
}

/**
 * Fetch live Kalshi events
 */
export async function fetchLiveEvents(
  limit = 20,
  options?: FetchOptions
): Promise<KalshiEvent[]> {
  const response = await fetchKalshiEvents(
    { filter: "live", end: limit, includeMarkets: true },
    options
  )
  return response.data || []
}

/**
 * Fetch new Kalshi events (created in last 24 hours)
 */
export async function fetchNewEvents(
  limit = 20,
  options?: FetchOptions
): Promise<KalshiEvent[]> {
  const response = await fetchKalshiEvents(
    { filter: "new", end: limit, includeMarkets: true },
    options
  )
  return response.data || []
}

/**
 * Fetch events by category
 */
export async function fetchEventsByCategory(
  category: EventCategory,
  params: Omit<EventsQueryParams, "category"> = {},
  options?: FetchOptions
): Promise<EventsListResponse> {
  return fetchKalshiEvents({ ...params, category }, options)
}

/**
 * Search Kalshi events
 */
export async function searchKalshiEvents(
  query: string,
  limit = 20,
  options?: FetchOptions
): Promise<EventsSearchResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set("query", query)
  searchParams.set("limit", Math.min(limit, 20).toString())
  
  return apiFetch<EventsSearchResponse>(`/events/search?${searchParams.toString()}`, options)
}

/**
 * Fetch a single event by ID
 */
export async function fetchKalshiEvent(
  eventId: string,
  includeMarkets = true,
  options?: FetchOptions
): Promise<SingleEventResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set("includeMarkets", includeMarkets.toString())
  
  return apiFetch<SingleEventResponse>(`/events/${encodeURIComponent(eventId)}?${searchParams.toString()}`, options)
}

/**
 * Transform events to UI-friendly market format
 */
export function transformEventsToMarkets(events: KalshiEvent[]): TransformedMarket[] {
  const markets: TransformedMarket[] = []
  
  for (const event of events) {
    // Get the first market from each event for the list view
    const transformed = transformEventToMarket(event)
    markets.push(transformed)
  }
  
  return markets
}

/**
 * Real-time event manager for polling updates
 */
export class KalshiEventManager {
  private pollingInterval: ReturnType<typeof setInterval> | null = null
  private listeners: Map<string, Set<(events: KalshiEvent[]) => void>> = new Map()
  private cache: Map<string, { data: KalshiEvent[]; timestamp: number }> = new Map()
  private readonly cacheMaxAge = 30000 // 30 seconds

  /**
   * Start polling for events
   */
  startPolling(
    key: string,
    fetchFn: () => Promise<KalshiEvent[]>,
    intervalMs = 30000
  ): void {
    if (this.pollingInterval) {
      return
    }

    const poll = async () => {
      try {
        const events = await fetchFn()
        this.cache.set(key, { data: events, timestamp: Date.now() })
        this.notifyListeners(key, events)
      } catch (error) {
        console.error("[KalshiEventManager] Polling error:", error)
      }
    }

    // Initial fetch
    poll()

    // Set up interval
    this.pollingInterval = setInterval(poll, intervalMs)
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  /**
   * Subscribe to event updates
   */
  subscribe(
    key: string,
    callback: (events: KalshiEvent[]) => void
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(callback)

    // Return cached data immediately if available and fresh
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheMaxAge) {
      callback(cached.data)
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback)
    }
  }

  /**
   * Notify all listeners for a key
   */
  private notifyListeners(key: string, events: KalshiEvent[]): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((callback) => callback(events))
    }
  }

  /**
   * Get cached data
   */
  getCached(key: string): KalshiEvent[] | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheMaxAge) {
      return cached.data
    }
    return null
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// Singleton instance
export const kalshiEventManager = new KalshiEventManager()

/**
 * Category mapping for display
 */
export const categoryDisplayNames: Record<EventCategory, string> = {
  all: "All",
  crypto: "Crypto",
  sports: "Sports",
  politics: "Politics",
  esports: "Esports",
  culture: "Culture",
  economics: "Economics",
  tech: "Tech",
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): { value: EventCategory; label: string }[] {
  return Object.entries(categoryDisplayNames).map(([value, label]) => ({
    value: value as EventCategory,
    label,
  }))
}
