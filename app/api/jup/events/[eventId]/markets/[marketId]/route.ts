import { type NextRequest, NextResponse } from "next/server"
import { upstreamFetch, handleOptions, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; marketId: string }> }
) {
  try {
    const { eventId, marketId } = await params
    const response = await upstreamFetch(`/prediction/v1/events/${eventId}/markets/${marketId}`)
    if (!response.ok) return errorResponse("Market not found", response.status)
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (e) {
    return errorResponse("Failed to fetch market", 500)
  }
}

export async function OPTIONS() {
  return handleOptions()
}
