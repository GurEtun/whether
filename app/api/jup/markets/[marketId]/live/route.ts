import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic market data based on market ID
function generateLiveMarketData(marketId: string) {
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const now = Date.now()
  
  const random = (offset: number) => {
    const x = Math.sin(seed + offset + Math.floor(now / 5000)) * 10000
    return x - Math.floor(x)
  }

  const baseYesPrice = 40 + random(0) * 40
  const yesPrice = Math.max(10, Math.min(90, baseYesPrice))
  const noPrice = 100 - yesPrice

  return {
    marketId,
    yesPrice: Math.round(yesPrice * 100) / 100,
    noPrice: Math.round(noPrice * 100) / 100,
    volume24h: Math.round((100000 + random(1) * 500000) * 100) / 100,
    totalVolume: Math.round((1000000 + random(2) * 5000000) * 100) / 100,
    lastTradeTime: now - Math.floor(random(3) * 300000),
    priceChange24h: Math.round((random(4) - 0.5) * 15 * 100) / 100,
    liquidity: Math.round((50000 + random(5) * 250000) * 100) / 100,
    traders24h: Math.floor(50 + random(6) * 500),
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    
    // Generate realistic live data
    const liveData = generateLiveMarketData(marketId)
    
    return NextResponse.json(liveData, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[jup-live] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch live market data", 500, { message })
  }
}
