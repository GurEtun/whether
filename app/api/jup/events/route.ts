import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, JUP_PREDICTION_URL } from "@/lib/jup-client"
import type { EventsListResponse, EventCategory, EventFilter, EventSortBy, SortDirection } from "@/lib/kalshi-types"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Build query params for Jupiter API
    const params = new URLSearchParams()
    
    // Always use Kalshi provider
    params.set("provider", "kalshi")
    
    // Include markets data
    const includeMarkets = searchParams.get("includeMarkets")
    if (includeMarkets !== "false") {
      params.set("includeMarkets", "true")
    }
    
    // Pagination
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    if (start) params.set("start", start)
    if (end) params.set("end", end)
    
    // Category filter
    const category = searchParams.get("category") as EventCategory | null
    if (category && category !== "all") {
      params.set("category", category.toLowerCase())
    }
    
    // Subcategory
    const subcategory = searchParams.get("subcategory")
    if (subcategory) params.set("subcategory", subcategory)
    
    // Sorting
    const sortBy = searchParams.get("sortBy") as EventSortBy | null
    const sortDirection = searchParams.get("sortDirection") as SortDirection | null
    if (sortBy) params.set("sortBy", sortBy)
    if (sortDirection) params.set("sortDirection", sortDirection)
    
    // Filter (new, live, trending)
    const filter = searchParams.get("filter") as EventFilter | null
    if (filter) params.set("filter", filter)

    const url = `${JUP_PREDICTION_URL}/api/v1/events?${params.toString()}`
    
    console.log("[v0] [jup-events] Fetching from:", url)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Whether-Prediction-Market/1.0",
      },
      cache: "no-store", // Disable cache for debugging
    })
    
    console.log("[v0] [jup-events] Response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[jup-events] API error:", response.status, errorText)
      return errorResponse(
        `Jupiter API error: ${response.statusText}`,
        response.status,
        { details: errorText }
      )
    }

    const data: EventsListResponse = await response.json()
    
    console.log("[v0] [jup-events] Fetched", data.data?.length || 0, "events")
    
    // Log first event's pricing for debugging
    if (data.data?.[0]) {
      const firstEvent = data.data[0]
      const firstMarket = firstEvent.markets?.[0]
      console.log("[v0] [jup-events] First event:", {
        eventId: firstEvent.eventId,
        title: firstEvent.metadata?.title,
        category: firstEvent.category,
        isLive: firstEvent.isLive,
        marketsCount: firstEvent.markets?.length || 0,
        firstMarketPricing: firstMarket?.pricing ? {
          buyYesPriceUsd: firstMarket.pricing.buyYesPriceUsd,
          buyNoPriceUsd: firstMarket.pricing.buyNoPriceUsd,
          volume24h: firstMarket.pricing.volume24h,
        } : 'no pricing data'
      })
    }

    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-events] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch events from Jupiter", 500, { message })
  }
}
