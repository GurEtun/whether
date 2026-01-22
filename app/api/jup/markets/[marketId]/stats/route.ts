import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, handleOptions, errorResponse } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate market statistics
function generateMarketStats(marketId: string) {
  // Seed random based on marketId
  let seed = 0
  for (let i = 0; i < marketId.length; i++) {
    seed += marketId.charCodeAt(i)
  }
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const baseVolume = 50000 + random(0) * 500000
  const currentPrice = 45 + random(1) * 30

  return {
    volume24h: Math.round(baseVolume * (0.1 + random(2) * 0.2)),
    volume7d: Math.round(baseVolume),
    trades24h: Math.round(100 + random(3) * 2000),
    uniqueTraders: Math.round(50 + random(4) * 500),
    priceChange24h: Math.round((random(5) - 0.5) * 20 * 100) / 100,
    highPrice24h: Math.round((currentPrice + random(6) * 5) * 100) / 100,
    lowPrice24h: Math.round((currentPrice - random(7) * 5) * 100) / 100,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  const { marketId } = await params

  try {
    const stats = generateMarketStats(marketId)
    
    return NextResponse.json(stats, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return errorResponse("Failed to fetch market stats", 500, error)
  }
}
