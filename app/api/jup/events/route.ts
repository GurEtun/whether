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
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Whether-Prediction-Market/1.0",
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    })

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
