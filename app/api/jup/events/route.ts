import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, upstreamFetch } from "@/lib/jup-client"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    // Build query params for the real Jupiter Prediction API
    const searchParams = req.nextUrl.searchParams
    const queryParams = new URLSearchParams()
    
    // Map our params to Jupiter API params
    const category = searchParams.get("category")
    if (category) queryParams.set("category", category.toLowerCase())
    
    // Always request Kalshi provider and include markets
    queryParams.set("provider", "kalshi")
    queryParams.set("includeMarkets", "true")
    
    // Forward pagination params
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    if (start) queryParams.set("start", start)
    if (end) queryParams.set("end", end)
    
    // Forward filter/sort params
    const filter = searchParams.get("filter")
    const sortBy = searchParams.get("sortBy")
    const sortDirection = searchParams.get("sortDirection")
    if (filter) queryParams.set("filter", filter)
    if (sortBy) queryParams.set("sortBy", sortBy)
    if (sortDirection) queryParams.set("sortDirection", sortDirection)

    const queryString = queryParams.toString()
    const endpoint = `/prediction/v1/events${queryString ? `?${queryString}` : ""}`
    
    console.log("[v0] Fetching from Jupiter API:", endpoint)
    
    const response = await upstreamFetch(endpoint)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Jupiter events API error:", response.status, errorText)
      return errorResponse(
        `Jupiter API returned ${response.status}`,
        response.status,
        { details: errorText }
      )
    }
    
    const data = await response.json()
    console.log("[v0] Jupiter events response keys:", Object.keys(data))
    console.log("[v0] Jupiter events count:", data.data?.length)
    if (data.data?.[0]) {
      console.log("[v0] First event keys:", Object.keys(data.data[0]))
      console.log("[v0] First event markets count:", data.data[0].markets?.length)
      if (data.data[0].markets?.[0]) {
        console.log("[v0] First market keys:", Object.keys(data.data[0].markets[0]))
        console.log("[v0] First market pricing:", data.data[0].markets[0].pricing)
        console.log("[v0] First market metadata:", data.data[0].markets[0].metadata)
      }
    }

    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("Error fetching events from Jupiter/Kalshi API:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch events from Jupiter/Kalshi API", 500, { 
      message,
      details: error instanceof Error ? error.stack : undefined
    })
  }
}
