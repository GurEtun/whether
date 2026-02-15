import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, upstreamFetch } from "@/lib/jup-client"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const searchParams = req.nextUrl.searchParams
    const queryParams = new URLSearchParams()
    
    // Forward all query parameters to Jupiter API
    searchParams.forEach((value, key) => {
      queryParams.set(key, value)
    })

    const queryString = queryParams.toString()
    const endpoint = `/prediction/v1/events/${eventId}/markets${queryString ? `?${queryString}` : ""}`
    
    const response = await upstreamFetch(endpoint)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Jupiter API error:", response.status, errorText)
      return errorResponse(
        `Jupiter API returned ${response.status}`,
        response.status,
        { details: errorText }
      )
    }
    
    const data = await response.json()

    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("Error fetching markets from Jupiter/Kalshi API:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch markets from Jupiter/Kalshi API", 500, { 
      message,
      details: error instanceof Error ? error.stack : undefined
    })
  }
}
