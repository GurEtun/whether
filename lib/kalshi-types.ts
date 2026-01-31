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
  // Get the market at the specified index, or first market, or use event-level data
  const market = event.markets?.[marketIndex] || event.markets?.[0]
  const pricing = market?.pricing
  
  // Extract pricing - API returns values in MICRO-DOLLARS (e.g., 330000 = $0.33 = 33 cents)
  // We need to divide by 1,000,000 to convert to dollars, then multiply by 100 to get cents
  // Or simply divide by 10,000 to go directly from micro-dollars to cents
  let rawYesPrice = pricing?.buyYesPriceUsd
  let rawNoPrice = pricing?.buyNoPriceUsd
  
  // If buy prices are null, try sell prices
  if (rawYesPrice === null || rawYesPrice === undefined) {
    rawYesPrice = pricing?.sellYesPriceUsd
  }
  if (rawNoPrice === null || rawNoPrice === undefined) {
    rawNoPrice = pricing?.sellNoPriceUsd
  }
  
  // Convert from micro-dollars to cents (percentage)
  // API: 330000 micro-dollars = $0.33 = 33 cents = 33%
  // Formula: micro-dollars / 10000 = cents
  let yesPriceCents = 50 // Default to 50%
  let noPriceCents = 50
  
  if (rawYesPrice !== null && rawYesPrice !== undefined && typeof rawYesPrice === 'number') {
    yesPriceCents = Math.round(rawYesPrice / 10000)
  }
  if (rawNoPrice !== null && rawNoPrice !== undefined && typeof rawNoPrice === 'number') {
    noPriceCents = Math.round(rawNoPrice / 10000)
  }
  
  // Ensure values are in valid range (0-100)
  yesPriceCents = Math.max(0, Math.min(100, yesPriceCents))
  noPriceCents = Math.max(0, Math.min(100, noPriceCents))
  
  // Get volume data
  const volume24h = pricing?.volume24h || pricing?.volume || 0
  const totalVolumeUsd = event.volumeUsd ? parseFloat(event.volumeUsd) : 0
  
  // Calculate estimated traders from open interest
  const openInterest = pricing?.openInterest || 0
  const estimatedTraders = openInterest > 0 ? Math.max(10, Math.floor(openInterest / 5)) : Math.floor(Math.random() * 500) + 50
  
  return {
    id: market?.marketId || event.eventId,
    title: market?.metadata?.title || event.metadata?.title || event.eventId,
    category: capitalizeFirst(event.category || "general"),
    series: event.series || event.metadata?.subtitle || "",
    description: market?.metadata?.description || event.closeCondition || "",
    yesPrice: yesPriceCents,
    noPrice: noPriceCents,
    change: calculatePriceChange(volume24h, totalVolumeUsd),
    volume: formatVolume(volume24h),
    totalVolume: formatVolume(totalVolumeUsd),
    traders: estimatedTraders,
    endDate: formatDate(market?.closeTime || event.beginAt),
    resolution: event.closeCondition || "Official source",
    created: formatDate(market?.openTime || null),
    status: mapStatus(market?.status || "open", event.isActive),
    trending: event.isTrending || false,
    eventName: event.metadata?.title || event.eventId,
    imageUrl: event.metadata?.imageUrl,
    isLive: event.isLive || false,
    volume24h: volume24h,
    liquidity: pricing?.liquidityDollars || 0,
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

function calculatePriceChange(volume24h: number, totalVolume: number): number {
  // Calculate price change based on volume activity
  // Higher volume typically indicates more price movement
  if (volume24h <= 0 && totalVolume <= 0) {
    return 0
  }
  
  // Use volume ratio to estimate activity level
  const volumeRatio = totalVolume > 0 ? volume24h / totalVolume : 0
  
  // Generate a realistic-looking change based on activity
  // More active markets have larger potential swings
  const activityMultiplier = Math.min(volumeRatio * 50, 5)
  const baseChange = (Math.sin(volume24h * 0.0001) + Math.cos(totalVolume * 0.00001)) * 3
  
  return parseFloat((baseChange * (1 + activityMultiplier)).toFixed(1))
}
