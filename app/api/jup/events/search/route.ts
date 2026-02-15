import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, upstreamFetch } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    
    if (!query) {
      return errorResponse("Missing required query parameter: query", 400)
    }

    // Use Jupiter's search endpoint
    const params = new URLSearchParams({ q: query, provider: "kalshi", includeMarkets: "true" })
    const response = await upstreamFetch(`/prediction/v1/events/search?${params}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      return errorResponse("Search API error", response.status, { details: errorText })
    }
    
    const data = await response.json()

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
