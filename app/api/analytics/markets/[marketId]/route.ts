import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

interface EventMetrics {
  volume24h: number
  tradeCount24h: number
  uniqueTraders24h: number
  avgPrice: number
  priceHigh24h: number
  priceLow24h: number
  volatility: number
}

function generateMarketMetrics(marketId: string): EventMetrics {
  const seed = marketId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const avgPrice = 40 + random(0) * 20
  
  return {
    volume24h: Math.round(random(1) * 1000000 + 50000),
    tradeCount24h: Math.floor(random(2) * 5000 + 100),
    uniqueTraders24h: Math.floor(random(3) * 2000 + 50),
    avgPrice: Math.round(avgPrice * 100) / 100,
    priceHigh24h: Math.round((avgPrice + random(4) * 15) * 100) / 100,
    priceLow24h: Math.round((avgPrice - random(5) * 15) * 100) / 100,
    volatility: Math.round((5 + random(6) * 20) * 100) / 100,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const metrics = generateMarketMetrics(marketId)

    return NextResponse.json({ metrics }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[market-analytics] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch analytics", 500, { message })
  }
}
