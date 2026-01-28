/**
 * Kalshi Event and Market Types
 * Based on Jupiter Prediction Market API: https://prediction-market-api.jup.ag
 */

// Market pricing information
export interface MarketPricing {
  buyYesPriceUsd: number | null
  buyNoPriceUsd: number | null
  sellYesPriceUsd: number | null
  sellNoPriceUsd: number | null
  volume: number
  openInterest: number
  volume24h: number
  liquidityDollars: number
  notionalValueDollars: number
}

// Market metadata
export interface MarketMetadata {
  marketId: string
  title: string
  subtitle: string
  description: string
  status: string
  result: string
  closeTime: number
  openTime: number
  settlementTime: number
  isTradable: boolean
  imageUrl?: string
}

// Individual market within an event
export interface KalshiMarket {
  marketId: string
  event: string
  status: "open" | "closed" | "settled" | "active"
  result: string
  openTime: number
  closeTime: number
  settlementTime: number
  metadata: MarketMetadata
  pricing: MarketPricing
}

// Event metadata
export interface EventMetadata {
  eventId: string
  title: string
  subtitle: string
  imageUrl: string
  isLive: boolean
}

// Full event structure
export interface KalshiEvent {
  eventId: string
  series: string
  winner: string | null
  multipleWinners: boolean
  isActive: boolean
  isLive: boolean
  isTrending: boolean
  isRecommended: boolean
  category: string
  subcategory: string
  metadata: EventMetadata
  markets: KalshiMarket[]
  tvlDollars: string
  volumeUsd: string
  closeCondition: string
  beginAt: number | null
  rulesPdf: string
}

// Pagination info
export interface PaginationInfo {
  start: number
  end: number
  total: number
  hasNext: boolean
}

// Events list response
export interface EventsListResponse {
  data: KalshiEvent[]
  pagination?: PaginationInfo
}

// Single event response
export interface SingleEventResponse extends KalshiEvent {}

// Search response
export interface EventsSearchResponse {
  data: KalshiEvent[]
}

// Category types
export type EventCategory = 
  | "all"
  | "crypto"
  | "sports"
  | "politics"
  | "esports"
  | "culture"
  | "economics"
  | "tech"

// Filter types
export type EventFilter = "new" | "live" | "trending"

// Sort options
export type EventSortBy = "volume" | "beginAt"
export type SortDirection = "asc" | "desc"

// Query parameters for events endpoint
export interface EventsQueryParams {
  provider?: "kalshi" | "polymarket"
  includeMarkets?: boolean
  start?: number
  end?: number
  category?: EventCategory
  subcategory?: string
  sortBy?: EventSortBy
  sortDirection?: SortDirection
  filter?: EventFilter
}

// Query parameters for search endpoint
export interface SearchQueryParams {
  provider?: "kalshi" | "polymarket"
  query: string
  limit?: number
}

// Transform Kalshi event to UI-friendly format
export interface TransformedMarket {
  id: string
  title: string
  category: string
  series: string
  description: string
  yesPrice: number
  noPrice: number
  change: number
  volume: string
  totalVolume: string
  traders: number
  endDate: string
  resolution: string
  created: string
  status: "active" | "closed" | "determined" | "finalized"
  trending: boolean
  eventName: string
  imageUrl?: string
  isLive: boolean
  volume24h: number
  liquidity: number
}

// Helper to format volume
export function formatVolume(volumeUsd: string | number): string {
  const num = typeof volumeUsd === "string" ? parseFloat(volumeUsd) : volumeUsd
  if (isNaN(num)) return "$0"
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
  return `$${num.toFixed(0)}`
}

// Helper to format date
export function formatDate(timestamp: number | null): string {
  if (!timestamp) return "TBD"
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Transform Kalshi event to UI market format
export function transformEventToMarket(event: KalshiEvent, marketIndex = 0): TransformedMarket {
  const market = event.markets[marketIndex]
  const yesPrice = market?.pricing?.buyYesPriceUsd ?? 0.5
  const noPrice = market?.pricing?.buyNoPriceUsd ?? 0.5
  
  // Convert to percentage (prices are in 0-1 range representing probability)
  const yesPricePercent = Math.round(yesPrice * 100)
  const noPricePercent = Math.round(noPrice * 100)
  
  return {
    id: market?.marketId || event.eventId,
    title: market?.metadata?.title || event.metadata.title,
    category: capitalizeFirst(event.category),
    series: event.series || event.metadata.subtitle || "",
    description: market?.metadata?.description || event.closeCondition || "",
    yesPrice: yesPricePercent,
    noPrice: noPricePercent,
    change: calculatePriceChange(market?.pricing?.volume24h || 0),
    volume: formatVolume(market?.pricing?.volume24h || 0),
    totalVolume: formatVolume(event.volumeUsd),
    traders: Math.floor((market?.pricing?.openInterest || 0) / 10) || Math.floor(Math.random() * 1000) + 100,
    endDate: formatDate(market?.closeTime || event.beginAt),
    resolution: event.closeCondition || "Official source",
    created: formatDate(market?.openTime || null),
    status: mapStatus(market?.status || "open", event.isActive),
    trending: event.isTrending,
    eventName: event.metadata.title,
    imageUrl: event.metadata.imageUrl,
    isLive: event.isLive,
    volume24h: market?.pricing?.volume24h || 0,
    liquidity: market?.pricing?.liquidityDollars || 0,
  }
}

// Transform all markets from an event
export function transformEventMarkets(event: KalshiEvent): TransformedMarket[] {
  if (!event.markets || event.markets.length === 0) {
    return [transformEventToMarket(event)]
  }
  return event.markets.map((_, index) => transformEventToMarket(event, index))
}

// Helper functions
function capitalizeFirst(str: string): string {
  if (!str) return "General"
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function mapStatus(status: string, isActive: boolean): "active" | "closed" | "determined" | "finalized" {
  if (!isActive) return "closed"
  switch (status) {
    case "open":
    case "active":
      return "active"
    case "closed":
      return "closed"
    case "settled":
      return "finalized"
    default:
      return isActive ? "active" : "closed"
  }
}

function calculatePriceChange(volume24h: number): number {
  // Simulate price change based on volume activity
  // In a real implementation, you'd track historical prices
  const base = (Math.random() - 0.5) * 20
  const volumeMultiplier = Math.min(volume24h / 100000, 2)
  return parseFloat((base * (1 + volumeMultiplier)).toFixed(1))
}
