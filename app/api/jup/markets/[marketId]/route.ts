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
    
    const response = await upstreamFetch(`/prediction/v1/markets/${marketId}`)
    
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
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("Error fetching market from Jupiter/Kalshi API:", error)
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch market",
      500,
      { details: error instanceof Error ? error.stack : undefined }
    )
  }
}

export async function OPTIONS() {
  return handleOptions()
}
