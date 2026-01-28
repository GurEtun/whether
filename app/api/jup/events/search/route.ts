import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, JUP_PREDICTION_URL } from "@/lib/jup-client"
import type { EventsSearchResponse } from "@/lib/kalshi-types"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    const limit = searchParams.get("limit") || "20"
    
    if (!query) {
      return errorResponse("Missing required query parameter: query", 400)
    }

    // Build query params for Jupiter API
    const params = new URLSearchParams()
    params.set("provider", "kalshi")
    params.set("query", query)
    params.set("limit", Math.min(parseInt(limit, 10), 20).toString())

    const url = `${JUP_PREDICTION_URL}/api/v1/events/search?${params.toString()}`
    
    console.log("[jup-events-search] Searching:", url)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Whether-Prediction-Market/1.0",
      },
      next: { revalidate: 10 }, // Cache search results for 10 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[jup-events-search] API error:", response.status, errorText)
      return errorResponse(
        `Jupiter API error: ${response.statusText}`,
        response.status,
        { details: errorText }
      )
    }

    const data: EventsSearchResponse = await response.json()
    
    console.log("[jup-events-search] Found", data.data?.length || 0, "events for query:", query)

    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-events-search] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to search events", 500, { message })
  }
}
