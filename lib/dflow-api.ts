// DFlow Prediction Market Metadata API Service
const METADATA_API_BASE_URL = "https://prediction-markets-api.dflow.net"

export interface DFlowMarketAccount {
  yesMint: string
  noMint: string
}

export interface DFlowMarket {
  ticker: string
  title: string
  status: "initialized" | "active" | "closed" | "determined" | "finalized"
  accounts: Record<string, DFlowMarketAccount>
  volume?: number
  openInterest?: number
}

export interface DFlowEvent {
  ticker: string
  title: string
  subtitle?: string
  seriesTicker: string
  category?: string
  tags?: string[]
  markets?: DFlowMarket[]
  endDate?: string
  imageUrl?: string
}

export interface DFlowEventsResponse {
  events: DFlowEvent[]
  total?: number
}

export interface DFlowTagsByCategories {
  tagsByCategories: Record<string, string[]>
}

export interface DFlowSeries {
  ticker: string
  title: string
  category: string
  tags: string[]
  frequency?: string
}

// Fetch events with nested markets
export async function fetchEvents(options?: {
  status?: "active" | "initialized" | "closed" | "determined" | "finalized"
  limit?: number
  withNestedMarkets?: boolean
}): Promise<DFlowEventsResponse> {
  const params = new URLSearchParams()
  
  if (options?.withNestedMarkets !== false) {
    params.append("withNestedMarkets", "true")
  }
  if (options?.status) {
    params.append("status", options.status)
  }
  if (options?.limit) {
    params.append("limit", options.limit.toString())
  } else {
    params.append("limit", "200")
  }

  const response = await fetch(
    `${METADATA_API_BASE_URL}/api/v1/events?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`)
  }

  return response.json()
}

// Fetch events by series tickers
export async function fetchEventsBySeries(seriesTickers: string[]): Promise<DFlowEventsResponse> {
  const params = new URLSearchParams()
  params.append("withNestedMarkets", "true")
  params.append("seriesTickers", seriesTickers.join(","))
  params.append("limit", "200")

  const response = await fetch(
    `${METADATA_API_BASE_URL}/api/v1/events?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch events by series: ${response.status}`)
  }

  return response.json()
}

// Fetch categories and tags
export async function fetchTagsByCategories(): Promise<DFlowTagsByCategories> {
  const response = await fetch(
    `${METADATA_API_BASE_URL}/api/v1/tags`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status}`)
  }

  return response.json()
}

// Fetch series
export async function fetchSeries(options?: {
  category?: string
  tags?: string[]
}): Promise<{ series: DFlowSeries[] }> {
  const params = new URLSearchParams()
  
  if (options?.category) {
    params.append("category", options.category)
  }
  if (options?.tags && options.tags.length > 0) {
    params.append("tags", options.tags.join(","))
  }

  const response = await fetch(
    `${METADATA_API_BASE_URL}/api/v1/series?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch series: ${response.status}`)
  }

  return response.json()
}

// Transform DFlow event to our app's market format
export function transformEventToMarket(event: DFlowEvent, market?: DFlowMarket) {
  // Generate a pseudo-random price based on the ticker for demo purposes
  // In production, this would come from actual price data
  const hash = (event.ticker + (market?.ticker || "")).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const yesPrice = 20 + (hash % 60) // Random between 20-80
  const change = ((hash % 30) - 15) / 10 // Random between -1.5 and 1.5
  
  const volumeBase = (hash % 900) + 100
  const volumeFormatted = volumeBase > 500 ? `$${(volumeBase / 100).toFixed(1)}M` : `$${volumeBase}K`
  
  return {
    id: market?.ticker || event.ticker,
    title: market?.title || event.title,
    category: event.category || inferCategory(event),
    series: event.seriesTicker,
    eventName: event.title,
    description: event.subtitle || `Market for ${event.title}`,
    yesPrice,
    noPrice: 100 - yesPrice,
    change: Number(change.toFixed(1)),
    volume: volumeFormatted,
    totalVolume: `$${((volumeBase * 5) / 100).toFixed(1)}M`,
    traders: 500 + (hash % 5000),
    endDate: event.endDate || "TBD",
    resolution: "DFlow Market Resolution",
    created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: (market?.status || "active") as "active" | "closed" | "determined" | "finalized",
    trending: hash % 3 === 0,
    accounts: market?.accounts,
  }
}

// Infer category from event data
function inferCategory(event: DFlowEvent): string {
  const title = event.title.toLowerCase()
  const tags = event.tags?.map(t => t.toLowerCase()) || []
  
  if (tags.some(t => ["crypto", "btc", "eth", "sol", "bitcoin", "ethereum"].includes(t)) || 
      title.includes("bitcoin") || title.includes("crypto") || title.includes("eth")) {
    return "Crypto"
  }
  if (tags.some(t => ["sports", "nfl", "nba", "soccer", "football"].includes(t)) ||
      title.includes("win") && (title.includes("game") || title.includes("match"))) {
    return "Sports"
  }
  if (tags.some(t => ["politics", "election", "president"].includes(t)) ||
      title.includes("election") || title.includes("president")) {
    return "Politics"
  }
  if (tags.some(t => ["economics", "fed", "rate", "gdp", "inflation"].includes(t)) ||
      title.includes("fed") || title.includes("rate")) {
    return "Economics"
  }
  if (tags.some(t => ["tech", "ai", "apple", "google", "spacex"].includes(t)) ||
      title.includes("ai") || title.includes("tech") || title.includes("spacex")) {
    return "Science & Tech"
  }
  if (tags.some(t => ["entertainment", "oscar", "movie", "music"].includes(t)) ||
      title.includes("oscar") || title.includes("movie")) {
    return "Entertainment"
  }
  
  return "General"
}
