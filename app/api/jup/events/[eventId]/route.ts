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
    
    const response = await upstreamFetch(`/prediction/v1/events/${eventId}?includeMarkets=true`)
    
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
    console.error("Error fetching event from Jupiter/Kalshi API:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch event from Jupiter/Kalshi API", 500, { 
      message,
      details: error instanceof Error ? error.stack : undefined
    })
  }
}
