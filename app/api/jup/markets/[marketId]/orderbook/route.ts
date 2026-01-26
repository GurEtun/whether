import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic orderbook data
function generateOrderbook(marketId: string, depth: number) {
  const seed = marketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const midPrice = 45 + random(0) * 30
  const bids: Array<{ price: number; size: number }> = []
  const asks: Array<{ price: number; size: number }> = []

  for (let i = 0; i < depth; i++) {
    const bidPrice = Math.max(1, midPrice - (i + 1) * (random(i) * 2 + 0.5))
    const askPrice = midPrice + (i + 1) * (random(i + depth) * 2 + 0.5)
    const bidSize = 100 + random(i * 2) * 1000
    const askSize = 100 + random(i * 2 + 1) * 1000

    bids.push({
      price: Math.round(bidPrice * 100) / 100,
      size: Math.round(bidSize * 100) / 100,
    })
    asks.push({
      price: Math.round(askPrice * 100) / 100,
      size: Math.round(askSize * 100) / 100,
    })
  }

  const spread = Math.round((asks[0].price - bids[0].price) * 100) / 100
  const midPriceRounded = Math.round(midPrice * 100) / 100

  return {
    bids: bids.sort((a, b) => b.price - a.price),
    asks: asks.sort((a, b) => a.price - b.price),
    spread,
    midPrice: midPriceRounded,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const searchParams = req.nextUrl.searchParams
    const depth = Math.min(parseInt(searchParams.get("depth") || "10", 10), 50)
    
    // Generate realistic orderbook data
    const orderbook = generateOrderbook(marketId, depth)
    
    return NextResponse.json(orderbook, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[jup-orderbook] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch orderbook", 500, { message })
  }
}
