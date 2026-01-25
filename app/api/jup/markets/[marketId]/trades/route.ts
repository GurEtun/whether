import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic trade data for a specific market
function generateMarketTrades(marketId: string, limit: number) {
  const now = Date.now()
  const trades = []
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  for (let i = 0; i < limit; i++) {
    const timestamp = now - i * Math.floor(Math.random() * 120000) // Random intervals up to 2 minutes
    const tradeSeed = seed + timestamp + i
    const random = (offset: number) => {
      const x = Math.sin(tradeSeed + offset) * 10000
      return x - Math.floor(x)
    }

    const outcome = random(0) > 0.5 ? "yes" : "no"
    const side = random(1) > 0.5 ? "buy" : "sell"
    const price = 30 + random(2) * 40
    const size = 100 + random(3) * 1000

    trades.push({
      id: `trade-${marketId}-${i}-${timestamp}`,
      price: Math.round(price * 100) / 100,
      size: Math.round(size * 100) / 100,
      side,
      outcome,
      timestamp,
      trader: `${Math.random().toString(36).substr(2, 6)}...${Math.random().toString(36).substr(2, 4)}`,
    })
  }

  return { trades: trades.sort((a, b) => b.timestamp - a.timestamp) }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    
    const data = generateMarketTrades(marketId, Math.min(limit, 100))
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[jup-trades] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch trades", 500, { message })
  }
}
