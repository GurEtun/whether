import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic price history data
function generatePriceHistory(marketId: string, resolution: string, limit: number) {
  const now = Date.now()
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  const intervalMs: Record<string, number> = {
    "15m": 15 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
  }
  const ms = intervalMs[resolution] || intervalMs["1h"]

  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  let yesPrice = 45 + random(0) * 30
  const prices = []

  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - i * ms
    const change = (random(i * 17) - 0.5) * 6
    yesPrice = Math.max(10, Math.min(90, yesPrice + change))
    
    prices.push({
      timestamp,
      yesPrice: (Math.round(yesPrice * 100) / 100).toString(),
      noPrice: (Math.round((100 - yesPrice) * 100) / 100).toString(),
      volume: Math.round(random(i * 31) * 100000 + 10000),
    })
  }

  return prices
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const searchParams = req.nextUrl.searchParams
    const resolution = searchParams.get("resolution") || "1h"
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500)

    // Generate realistic price history
    const prices = generatePriceHistory(marketId, resolution, limit)
    
    return NextResponse.json({ prices }, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "max-age=30, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[jup-price-history] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch price history", message },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
