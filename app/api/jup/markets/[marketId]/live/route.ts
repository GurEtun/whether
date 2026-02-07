import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"
import { tradingEngine } from "@/lib/trading-engine"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic market data based on market ID
function generateLiveMarketData(marketId: string) {
  // Get trading engine prices if available
  const enginePrices = tradingEngine.getMarketPrice(marketId)
  const metrics = tradingEngine.getMetrics(marketId)
  
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const now = Date.now()
  
  const random = (offset: number) => {
    const x = Math.sin(seed + offset + Math.floor(now / 5000)) * 10000
    return x - Math.floor(x)
  }

  // Use engine prices with slight variation
  const baseYesPrice = enginePrices.yes + (random(0) - 0.5) * 2
  const yesPrice = Math.max(10, Math.min(90, baseYesPrice))
  const noPrice = 100 - yesPrice

  return {
    marketId,
    yesPrice: Math.round(yesPrice * 100) / 100,
    noPrice: Math.round(noPrice * 100) / 100,
    volume24h: Math.max(100000, metrics.totalVolume + random(1) * 500000),
    totalVolume: Math.max(1000000, metrics.totalVolume * 10 + random(2) * 5000000),
    lastTradeTime: metrics.lastTradeTime || now - Math.floor(random(3) * 300000),
    priceChange24h: Math.round(metrics.priceChange24h * 100) / 100,
    liquidity: Math.max(50000, random(5) * 250000),
    traders24h: Math.floor(Math.max(50, metrics.totalTrades * 10 + random(6) * 500)),
    bidAskSpread: Math.round(metrics.bidAskSpread * 100) / 100,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    
    // Validate marketId
    if (!marketId || typeof marketId !== 'string' || marketId.trim() === '') {
      return errorResponse("Invalid marketId", 400)
    }
    
    // Generate realistic live data
    const liveData = generateLiveMarketData(marketId)
    
    return NextResponse.json(liveData, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Live-Data": "true",
      },
    })
  } catch (error) {
    console.error("[jup-live] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch live market data", 500, { message })
  }
}
