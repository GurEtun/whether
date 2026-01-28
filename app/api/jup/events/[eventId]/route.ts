import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions, JUP_PREDICTION_URL } from "@/lib/jup-client"
import type { SingleEventResponse } from "@/lib/kalshi-types"

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
    
    // Build query params
    const queryParams = new URLSearchParams()
    const includeMarkets = searchParams.get("includeMarkets")
    if (includeMarkets !== "false") {
      queryParams.set("includeMarkets", "true")
    }

    const url = `${JUP_PREDICTION_URL}/api/v1/events/${encodeURIComponent(eventId)}?${queryParams.toString()}`
    
    console.log("[jup-event-detail] Fetching:", url)
    
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
      if (response.status === 404) {
        return errorResponse("Event not found", 404, { eventId })
      }
      const errorText = await response.text()
      console.error("[jup-event-detail] API error:", response.status, errorText)
      return errorResponse(
        `Jupiter API error: ${response.statusText}`,
        response.status,
        { details: errorText }
      )
    }

    const data: SingleEventResponse = await response.json()
    
    console.log("[jup-event-detail] Fetched event:", data.eventId, "with", data.markets?.length || 0, "markets")

    return NextResponse.json(data, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-event-detail] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch event", 500, { message })
  }
}
