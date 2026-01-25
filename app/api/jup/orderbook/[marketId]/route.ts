import { NextResponse, type NextRequest } from "next/server"
import { getCorsHeaders, errorResponse } from "@/lib/jup-client"

// Mock orderbook data generator
function generateOrderbook(marketId: string) {
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const basePrice = 45 + random(0) * 20
  const bids = []
  const asks = []

  for (let i = 0; i < 10; i++) {
    const bidPrice = basePrice - i * (0.5 + random(i) * 0.5)
    const askPrice = basePrice + i * (0.5 + random(i + 100) * 0.5)
    const bidSize = 100 + random(i * 7) * 1000
    const askSize = 100 + random(i * 11) * 1000

    bids.push({
      price: Math.max(1, bidPrice).toFixed(2),
      size: bidSize.toFixed(0),
      cumulative: bids.reduce((sum, b) => sum + parseFloat(b.size), bidSize).toFixed(0),
    })

    asks.push({
      price: Math.min(99, askPrice).toFixed(2),
      size: askSize.toFixed(0),
      cumulative: asks.reduce((sum, a) => sum + parseFloat(a.size), askSize).toFixed(0),
    })
  }

  return { bids, asks }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const orderbook = generateOrderbook(marketId)
    
    return NextResponse.json(orderbook, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch orderbook", 500, { message })
  }
}
