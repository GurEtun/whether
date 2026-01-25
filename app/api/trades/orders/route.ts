import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic trade orders
function generateTradeOrders(marketId: string, limit: number = 20) {
  const now = Date.now()
  const orders = []
  const seed = marketId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + i) * 10000
      return x - Math.floor(x)
    }

    const outcome = random(0) > 0.5 ? "yes" : "no"
    const side = random(1) > 0.5 ? "buy" : "sell"
    
    orders.push({
      id: `order-${marketId}-${i + 1}`,
      marketId,
      outcome,
      side,
      amount: Math.round(random(2) * 10000 + 100),
      price: 30 + random(3) * 40,
      status: i < 3 ? "filled" : i < 10 ? "pending" : "cancelled",
      executedAt: i < 10 ? now - i * 300000 : undefined,
      timestamp: now - i * 300000,
    })
  }

  return orders.sort((a, b) => b.timestamp - a.timestamp)
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const marketId = searchParams.get("marketId")
    const limit = parseInt(searchParams.get("limit") || "20", 10)

    if (!marketId) {
      return errorResponse("marketId is required", 400)
    }

    const orders = generateTradeOrders(marketId, Math.min(limit, 100))

    return NextResponse.json({ orders }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[orders-api] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch orders", 500, { message })
  }
}
