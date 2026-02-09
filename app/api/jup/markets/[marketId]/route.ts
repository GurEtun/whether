import { type NextRequest, NextResponse } from "next/server"
import { upstreamFetch, handleOptions, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    
    console.log("[v0] Fetching market from Jupiter/Kalshi API:", marketId)
    
    // Fetch from Jupiter API
    const response = await upstreamFetch(`/api/v1/markets/${marketId}`, req)
    const data = await response.json()
    
    console.log("[v0] Market data received from Jupiter/Kalshi:", JSON.stringify(data, null, 2))
    
    // Pass through ALL data fields from the API
    return NextResponse.json(data, {
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[v0] Error fetching market from Jupiter/Kalshi:", error)
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch market",
      500
    )
  }
}

export async function OPTIONS() {
  return handleOptions()
}
