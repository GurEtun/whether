import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic price history data
function generatePriceHistory(marketId: string, interval: string, limit: number) {
  const now = Date.now()
  const intervalMs: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
  }
  const ms = intervalMs[interval] || intervalMs["1h"]

  // Seed random based on marketId for consistency
  let seed = 0
  for (let i = 0; i < marketId.length; i++) {
    seed += marketId.charCodeAt(i)
  }
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  let yesPrice = 45 + random(0) * 30
  const data = []

  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - i * ms
    const change = (random(i * 17) - 0.5) * 4
    yesPrice = Math.max(5, Math.min(95, yesPrice + change))
    
    data.push({
      timestamp,
      yesPrice: Math.round(yesPrice * 100) / 100,
      noPrice: Math.round((100 - yesPrice) * 100) / 100,
      volume: Math.round(random(i * 31) * 50000 + 5000),
    })
  }

  return data
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  const { marketId } = await params
  const searchParams = req.nextUrl.searchParams
  const interval = searchParams.get("interval") || "1h"
  const limit = parseInt(searchParams.get("limit") || "100", 10)

  const priceHistory = generatePriceHistory(marketId, interval, limit)
  
  return NextResponse.json(priceHistory, {
    status: 200,
    headers: getCorsHeaders(),
  })
}
