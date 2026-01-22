import { type NextRequest, NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    
    // Fetch live market data from Jupiter
    const data = await jupiterFetch<{
      marketId: string
      yesPrice: number
      noPrice: number
      volume24h: number
      totalVolume: number
      lastTradeTime: number
      priceChange24h: number
    }>(`/v1/markets/${marketId}`)
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch live market data", 500, { message })
  }
}
